<template>
  <responsive-container>
    <v-card>
      <v-toolbar flat color="grey lighten-3">
        <v-app-bar-nav-icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-app-bar-nav-icon>
        <div class="flex-grow-1">
          <v-text-field
            class="w-100 border"
            label="Search contacts..."
            prepend-inner-icon="mdi-magnify"
            hide-details
            single-line
            clearable
            dense
            flat
            solo
          ></v-text-field>
        </div>
        <toolbar-menu :options="options"></toolbar-menu>
      </v-toolbar>
      <v-list>
        <v-skeleton-loader
          :loading="ui.loading"
          type="list-item-avatar-two-line@5"
          key="loader"
        >
          <v-slide-y-transition group>
            <template v-for="contact in contacts">
              <v-list-item
                :key="contact._id"
                @click="openProfile(contact)"
                :class="{
                  'v-list-item--active':
                    contact._id == (ui.contactDetails && ui.contactDetails._id),
                }"
              >
                <v-list-item-avatar :color="contact.color + '4f'">
                  <v-img
                    v-if="contact.avatar"
                    :src="baseUrl + 'img/' + contact.avatar"
                  ></v-img>
                  <span v-else>{{ contact.initials }}</span>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ contact.displayName }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ contact.phone || contact.email }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action v-if="!isSuperSmall">
                  <v-chip
                    :color="getFromColorMap(contact.type) + '4f'"
                    x-small
                    label
                  >
                    <span class="text-capitalize">
                      {{ contact.type }}
                    </span>
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-slide-y-transition>
        </v-skeleton-loader>
      </v-list>
    </v-card>
    <contact-dialog
      v-model="ui.contactDetailDialog"
      :contact="ui.contactDetails"
      @update:contact="updated"
    ></contact-dialog>

    <v-btn
      color="primary"
      class="ma-5"
      @click="openProfile()"
      bottom
      fixed
      right
      fab
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </responsive-container>
</template>

<script>
import ContactDialog from "@/components/app/widgets/ContactDialog";
import ToolbarMenu from "@/components/widgets/ToolbarMenu";

import { decrypt } from "@/utils";
import { makeRequest } from "@/modules/request";
import { getFromColorMap } from "@/utils";

export default {
  components: { ContactDialog, ToolbarMenu },
  data() {
    return {
      contacts: [],
      options: [
        {
          text: "Refresh",
          icon: "mdi-refresh",
          on: { click: this.init },
        },
        {
          text: "Sort By",
          icon: "mdi-sort",
          items: [
            {
              text: "Sort by Name",
              on: {
                click: function () {}.bind(this),
              },
            },
            {
              text: "Sort by Email",
              on: {
                click: function () {}.bind(this),
              },
            },
            {
              text: "Sort by Association",
              on: {
                click: function () {}.bind(this),
              },
            },
          ],
        },
      ],
      ui: {
        editName: false,
        contactDetails: null,
        contactDetailDialog: false,
        sortBy: "Name",
        loading: false,
      },
    };
  },
  methods: {
    getFromColorMap,
    init() {
      if (this.ui.loading) return;

      this.ui.loading = true;
      makeRequest("get", "contacts")
        .then(({ data }) => {
          // eslint-disable-next-line no-console
          this.contacts = decrypt(data.contacts);
          this.ui.loading = false;
        })
        .catch((err) => {
          this.ui.loading = false;
          this.errorHandler(err);
        });
    },
    updated(contact) {
      let index = this.contacts.findIndex((ev) => ev._id == contact._id);

      if (~index) this.contacts[index] = contact;
      else this.contacts.push(contact);
    },
    openProfile(contact) {
      this.ui.contactDetails = contact;
      this.ui.contactDetailDialog = true;
      // this.$nextTick(() => (this.ui.contactDetailDialog = true));
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style></style>
