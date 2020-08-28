<template>
  <v-dialog
    v-model="model"
    :fullscreen="isMobile || fullscreen"
    :persistent="loading || !closeable"
    max-width="620"
    scrollable
  >
    <v-form ref="contactForm" class="h-100 w-100" @submit.prevent="save">
      <v-card>
        <v-card-title class="py-0 border-bottom" style="position: relative;">
          <v-card-subtitle class="px-0">
            Contact Details
          </v-card-subtitle>
          <v-spacer></v-spacer>

          <v-btn
            class="ml-3"
            :disabled="loading"
            small
            text
            @click="
              closeable
                ? (model = false)
                : ((confirmNext = 'close'), (closeConfirmation = true))
            "
          >
            <v-icon class="mr-1" small>mdi-close</v-icon>
            close
          </v-btn>
          <v-btn class="ml-3" icon @click="fullscreen = !fullscreen">
            <v-icon>
              {{ fullscreen ? "mdi-arrow-collapse" : "mdi-arrow-expand" }}
            </v-icon>
          </v-btn>
          <v-progress-linear
            color="primary"
            :active="loading"
            indeterminate
            absolute
            bottom
          ></v-progress-linear>
        </v-card-title>

        <v-card-text v-if="contactModel">
          <v-card flat color="grey lighten-5" class="mt-3 mx-3">
            <v-card-title class="py-1">
              <label
                for="contact-type"
                class="body-2 text--secondary pr-5"
                @click="$refs.type.focus()"
              >
                <b>Type</b>
              </label>
              <input-field
                ref="type"
                v-model="contactModel.type"
                field="v-select"
                style="padding: 0 !important;"
                :textfield="{
                  ...inputFieldProps,
                  id: 'contact-type',
                  items: contactTypes,
                  disabled: contactModel.autoAdded || !edit,
                }"
                required
              ></input-field>
            </v-card-title>
          </v-card>
          <section>
            <div class="text-center pt-8">
              <!-- :style="{ border: `1px solid ${contactModel.color}` }" -->
              <v-avatar
                :color="contactModel.color + '4f'"
                class="animate overlay"
                size="98"
              >
                <v-img
                  v-if="contactModel.avatar"
                  :src="baseUrl + 'img/' + contactModel.avatar"
                ></v-img>
                <span v-else>{{ contactModel.initials }}</span>
                <v-layout
                  v-if="edit"
                  style="position: absolute; top: 0;"
                  justify-center
                  align-center
                  fill-height
                >
                  <v-btn :color="contactModel.color" dark fab depressed>
                    <v-icon>mdi-camera-plus</v-icon>
                  </v-btn>
                </v-layout>
              </v-avatar>

              <v-expand-transition mode="out-in">
                <div v-if="edit" key="nameEditor">
                  <v-row>
                    <prefix-field
                      v-model="contactModel.name.prefix"
                      :textfield="{ label: 'Prefix', ...inputFieldProps }"
                      :col="{ cols: 12 }"
                      inline-label
                    ></prefix-field>
                    <input-field
                      v-model="contactModel.name.first"
                      :textfield="{ label: 'First Name', ...inputFieldProps }"
                      :col="{ cols: 12 }"
                      required
                    ></input-field>
                    <input-field
                      v-model="contactModel.name.middle"
                      :textfield="{ label: 'Middle Name', ...inputFieldProps }"
                      :col="{ cols: 12 }"
                    ></input-field>
                    <input-field
                      v-model="contactModel.name.last"
                      :textfield="{ label: 'Last Name', ...inputFieldProps }"
                      :col="{ cols: 12 }"
                    ></input-field>
                  </v-row>
                </div>
                <div v-else>
                  <v-card-title class="justify-center">
                    {{ contactModel.displayName }}
                  </v-card-title>
                </div>
              </v-expand-transition>
            </div>
          </section>
          <section>
            <v-card-subtitle class="pb-0" :class="{ 'primary--text': edit }">
              Contact Info
            </v-card-subtitle>
            <v-row>
              <input-field
                v-model="contactModel.email"
                :textfield="{ label: 'Email Address', ...inputFieldProps }"
                :col="{ cols: 12 }"
              ></input-field>
              <input-field
                v-model="contactModel.phone"
                :textfield="{ label: 'Phone', ...inputFieldProps }"
                :col="{ cols: 12 }"
              ></input-field>
              <input-field
                v-model="contactModel.occupation"
                field="v-combobox"
                :textfield="{
                  ...inputFieldProps,
                  label: 'Occupation',
                  prependInnerIcon: 'mdi-tie',
                  items: preLoaders.occupations,
                  loading: preLoaders.loading,
                }"
                :col="{ cols: 12 }"
              ></input-field>
            </v-row>
          </section>
          <section>
            <v-card-subtitle class="pb-0" :class="{ 'primary--text': edit }">
              Personal info
            </v-card-subtitle>
            <v-row>
              <gender-field
                v-model="contactModel.gender"
                :textfield="inputFieldProps"
                :col="{ cols: 12 }"
              ></gender-field>
              <marital-status-field
                v-model="contactModel.maritalStatus"
                :textfield="inputFieldProps"
                :col="{ cols: 12 }"
              ></marital-status-field>
              <birth-date-field
                v-model="contactModel.birthDate"
                class="hide-number-arrows"
                :textfield="inputFieldProps"
              ></birth-date-field>
            </v-row>
          </section>
          <section>
            <v-card-subtitle class="pb-0" :class="{ 'primary--text': edit }">
              Address
            </v-card-subtitle>
            <address-form
              ref="extraForm"
              v-model="contactModel.address"
              content-class="px-0 pt-0 "
              style="margin: 0 -15px;"
              :field="{ textfield: { ...inputFieldProps } }"
              :pins="preLoaders.pins"
              :areas="preLoaders.areas"
              :loading-prefetch="preLoaders.loading"
              inline-labels
              hide-submit
            ></address-form>
          </section>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="!edit"
            :disabled="loading"
            color="primary"
            depressed
            outlined
            small
            @click="edit = true"
          >
            <v-icon class="mr-1" small> mdi-pencil </v-icon>
            <span>Edit</span>
          </v-btn>
          <v-btn
            v-if="contactModel.newObject"
            :disabled="loading"
            type="reset"
            depressed
            outlined
            small
            @click="reset"
          >
            <span>reset</span>
          </v-btn>
          <template v-if="edit">
            <v-spacer></v-spacer>
            <v-btn
              :disabled="loading"
              type="submit"
              color="primary"
              depressed
              small
            >
              <v-icon class="mr-1" small>
                mdi-content-save
              </v-icon>
              <span>Save</span>
            </v-btn>
            <v-btn
              v-if="!contactModel.newObject"
              class="ml-3"
              :disabled="loading"
              outlined
              small
              @click="
                closeable
                  ? reset()
                  : ((confirmNext = 'reset'), (closeConfirmation = true))
              "
            >
              Cancel
            </v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-form>
    <confirmation-dialog
      v-model="closeConfirmation"
      @next="confirmClose"
    ></confirmation-dialog>
  </v-dialog>
</template>

<script>
/* eslint-disable no-console */

import InputModel from "@/components/widgets/InputModel";
import ConfirmationDialog from "@/components/widgets/ConfirmationDialog";
import PrefixField from "@/components/app/fields/PrefixField";
import GenderField from "@/components/app/fields/GenderField";
import BirthDateField from "@/components/app/fields/BirthDateField";
import MaritalStatusField from "@/components/app/fields/MaritalStatusField";
import AddressForm from "@/components/app/forms/AddressForm";

import moment from "moment";
import contactTypes from "@/json/contact-types.json";
import Contact from "@/models/Contact";

import {
  clone,
  changedFields,
  isEmpty,
} from "@pranavraut033/js-utils/utils/object";

export default {
  components: {
    AddressForm,
    ConfirmationDialog,
    PrefixField,
    GenderField,
    BirthDateField,
    MaritalStatusField,
  },
  extends: InputModel,
  props: { contact: { type: Object, default: null } },
  data() {
    return {
      contactTypes,
      contactModel: new Contact(this.contact, this.user && this.user._id),

      preLoaders: {
        loading: false,
        areas: [],
        pins: [],
        occupations: [],
      },

      initialState: null,
      edit: false,
      loading: false,
      fullscreen: false,
      closeConfirmation: false,
      confirmNext: "close",
    };
  },
  computed: {
    changedField() {
      // this.log(changedFields(this.initialState, this.contactModel));
      return changedFields(this.initialState, this.contactModel);
    },
    closeable() {
      return isEmpty(this.changedField);
    },
    inputFieldProps() {
      return {
        dense: true,
        disabled: !this.edit || this.loading,
        outlined: false,
        solo: true,
        soloInverted: true,
        flat: true,
        class: "mx-3",
      };
    },
    user() {
      return this.$store.state.user;
    },
  },
  watch: {
    model(a) {
      if (a) {
        this.reset();
        this.preLoaders.loading = true;
        this.makeRequest("get", "patient/options")
          .then(({ data }) => {
            this.preLoaders.loading = false;
            Object.assign(this.preLoaders, data);
          })
          .catch((err) => {
            this.preLoaders.loading = false;
            this.errorHandler(err);
          });
      }
    },
  },
  mounted() {
    this.setContact(this.contact);
  },

  methods: {
    save() {
      if (!this.edit) return;
      if (this.closeable) return (this.edit = false);

      if (this.$refs.contactForm.validate()) {
        this.loading = true;
        let method;
        let requestData;

        if (this.contactModel.newObject) {
          method = "post";
          requestData = this.contactModel;
        } else {
          method = "put";
          requestData = {
            id: this.contactModel._id,
            ...this.changedField,
            query: { isPatient: !!this.contactModel.autoAdded },
          };
        }

        this.makeRequest(method, "contact", requestData)
          .then(({ data }) => {
            this.loading = false;

            this.$nextTick(() => this.setContact(data));
            this.$nextTick(() => this.$emit("update:contact", data));
          })
          .catch((err) => {
            this.loading = false;
            this.errorHandler(err);
          });
      }
    },
    confirmClose() {
      switch (this.confirmNext) {
        case "close":
          this.model = false;
          break;
        case "reset":
          this.reset();
          break;
        default:
          console.log("Invalid Case", this.confirmNext);
          break;
      }
    },
    reset() {
      Object.assign(this.$data, this.$options.data.apply(this));

      this.$nextTick(() => this.setContact(this.contact));
    },
    setContact(contact) {
      const contactModel = new Contact(contact, this.user._id);

      if (contactModel.birthDate)
        contactModel.birthDate = moment(contactModel.birthDate).format(
          "YYYY-MM-DD"
        );

      this.edit = contactModel.newObject;
      this.initialState = clone(contactModel);
      this.contactModel = contactModel;
    },
  },
};
</script>
