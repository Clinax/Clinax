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
      <v-sheet max-width="540" class="transparent mx-auto" dark>
        <v-autocomplete
          class="search-bar"
          label="Search by name, address, phone, etc..."
          :items="items"
          :menu-props="{ maxWidth: 540 }"
          :search-input.sync="search"
          :rounded="!focused"
          :shaped="focused"
          :flat="!focused"
          :filter="filter"
          :loading="loading"
          prepend-inner-icon="mdi-magnify"
          autocomplete="off"
          solo-inverted
          hide-details
          append-icon
          clearable
          light
          dense
          solo
          @input="onInput"
          @focus="focused = true"
          @blur="focused = false"
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
              <v-list-item v-if="search" dense>
                <v-list-item-content>
                  <v-list-item-subtitle>No result found</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-else dense>
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
import { decrypt } from "@/utils";

import { stringToRegex } from "@pranavraut033/js-utils/utils/regex";

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

      this.makeRequest("get", "search", {
        query: { minimal: this.minimal, search: encodeURI(search) },
      })
        .then((res) => {
          const data = decrypt(res.data.compressedData);
          this.loading = false;

          // console.log(data);
          data.forEach((ev) => {
            ev.casekeys =
              (ev.case &&
                ev.case.followUps
                  .map((followUp) => [
                    followUp.treatment && followUp.treatment.diagnosis,
                    followUp.chiefComplain,
                  ])
                  .flat()
                  .filter((treatment) => !!treatment)) ||
              [];

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
      const regex = stringToRegex(search);

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
  // border: thin solid rgba(0, 0, 0, 0.12);
  &.focused {
    border: none !important;
  }
}

.v-autocomplete__content {
  border-radius: 0 0 4px 4px !important;
}
</style>
