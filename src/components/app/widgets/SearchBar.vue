<template>
  <div>
    <patient-dialog
      v-model="profile.model"
      :patient.sync="profile.patient"
      no-activator
    ></patient-dialog>
    <slot
      v-bind="{
        onInput,
        loading,
        filter,
        items,
        search,
        onSearch: (ev) => (search = ev),
      }"
    >
      <v-sheet max-width="540" class="transparent mx-auto">
        <v-autocomplete
          class="search-bar"
          label="Search by name, address, phone, etc..."
          :class="{ focused, 'shadow-lg': focused }"
          :items="items"
          :dense="!$vuetify.breakpoint.mdAndUp"
          :menu-props="{
            maxWidth: $vuetify.breakpoint.mdAndUp ? 540 : '100%',
          }"
          :search-input.sync="search"
          :rounded="!focused"
          :shaped="focused"
          :flat="!focused"
          :filter="filter"
          :loading="loading"
          @input="onInput"
          @focus="focused = true"
          @blur="focused = false"
          prepend-inner-icon="mdi-magnify"
          autocomplete="off"
          append-icon
          hide-details
          clearable
          solo
        >
          <template v-slot:selection="{ item }">
            {{ item.fullname }}
          </template>
          <template v-slot:item="{ item }">
            <v-list-item
              dense
              @click="
                profile = {
                  model: true,
                  patient: item,
                }
              "
            >
              <v-list-item-avatar class="grey">
                <v-img
                  v-if="item.avatar"
                  class="fullscreen"
                  :src="baseUrl + '/img/' + item.avatar"
                ></v-img>
                <small v-else class="white--text"> {{ item.initials }}</small>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.fullname }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    (item.case && item.case.complain) ||
                    (item.address && item.address.street) ||
                    item.phone
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>
                  {{ item.address && item.address.area }}
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </template>
          <template v-slot:no-data>
            <v-skeleton-loader
              type="list-item-avatar-two-line"
              :loading="loading"
            >
              <v-list-item dense v-if="search">
                <v-list-item-content>
                  <v-list-item-subtitle>No result found</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item dense v-else>
                <v-list-item-content>
                  <v-list-item-subtitle>Start typing...</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-skeleton-loader>
          </template>
        </v-autocomplete>
      </v-sheet>
    </slot>
  </div>
</template>

<script>
import { decompressFromUTF16 } from "lz-string";

import { stringToRegex } from "@/modules/regex";
import { makeRequest } from "@/modules/request";

export default {
  props: { minimal: Boolean },
  data: () => ({
    search: "",
    focused: false,
    loading: false,
    cachedItems: {},
    profile: {
      model: false,
      patient: null,
    },
    items: [],
  }),

  watch: {
    search(a) {
      this.onInput(a);
    },
  },
  methods: {
    onInput(search) {
      if (!search) return;

      this.loading = true;

      makeRequest("get", "search", {
        query: { minimal: this.minimal, search: encodeURI(search) },
      })
        .then(({ data }) => {
          data = JSON.parse(decompressFromUTF16(data.compressedData));
          this.loading = false;

          // console.log(data);
          data.forEach((ev) => {
            ev.casekeys = ev.case.followUps
              .map((ev) => [
                ev.treatment && ev.treatment.diagnosis,
                ev.chiefComplain,
              ])
              .flat()
              .filter((ev) => !!ev);

            delete ev.case;
            this.cachedItems[ev._id] = ev;
          });
          this.items = Object.values(this.cachedItems);
        })
        .catch((err) => {
          this.loading = false;
          this.errorHandler(err);
        });
    },
    filter(object, search) {
      let regex = stringToRegex(search);
      if (regex)
        return (
          regex.test(object.fullname) ||
          regex.test(object.email) ||
          regex.test(object.phone) ||
          (object.address &&
            (regex.test(object.address.street) ||
              regex.test(object.address.area))) ||
          !!object.casekeys.find((ev) => regex.test(ev))
        );
      return true;
    },
  },
};
</script>

<style lang="scss">
.search-bar {
  transition: 350ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
  border: thin solid rgba(0, 0, 0, 0.12);
  &.focused {
    border: none !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
  }
}

.v-autocomplete__content {
  border-radius: 0 0 4px 4px !important;
}
</style>
