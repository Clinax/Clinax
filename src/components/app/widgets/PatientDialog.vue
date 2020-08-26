<template>
  <v-dialog
    v-model="model"
    :fullscreen="isSuperSmall"
    :persistent="!closeable || ui.loading"
    max-width="640"
  >
    <template v-if="!noActivator" v-slot:activator="{ on }">
      <slot name="activator" :on="on">
        <v-btn color="primary" :block="block" depressed v-on="on">
          Add Patient
        </v-btn>
      </slot>
    </template>

    <v-card>
      <v-subheader v-if="patientModel._id" class="grey lighten-4">
        <span>{{ patientModel.fullname }}'s Profile</span>
        <v-spacer class="mx-3"></v-spacer>
        <v-btn
          :disabled="ui.loading"
          color="error"
          icon
          @click="ui.deleteConfirmation = { model: true, name: '' }"
        >
          <v-icon>mdi-delete-circle</v-icon>
        </v-btn>
        <v-btn
          class="mx-3"
          :to="'/app/case/' + patientModel._id"
          color="primary"
          :disabled="ui.loading"
          depressed
          small
          @click="closeDialog"
        >
          <span>View Case</span>
        </v-btn>
        <v-btn :disabled="ui.loading" small text @click="closeDialog">
          <v-icon class="ml-2" small>mdi-close</v-icon>
          <span v-if="!isMobile">Close</span>
        </v-btn>
      </v-subheader>
      <v-divider></v-divider>
      <v-stepper v-model="ui.step">
        <v-stepper-header>
          <v-stepper-step
            :complete="ui.step > 1 || !!patientModel._id"
            :editable="!!patientModel._id"
            step="1"
          >
            Basic
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step
            :complete="ui.step > 2 || !!patientModel._id"
            :editable="!!patientModel._id"
            step="2"
          >
            Photo
          </v-stepper-step>
          <v-divider></v-divider>

          <v-stepper-step
            :complete="!!patientModel.address"
            :editable="!!patientModel._id"
            step="3"
          >
            Address
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1" class="pa-0">
            <v-form ref="patientForm" lazy-validation @submit.prevent="submit">
              <v-card-text class="grey lighten-4">
                <v-layout>
                  <prefix-field
                    v-model="patientModel.prefix"
                    :textfield="{ autocomplete: 'off' }"
                    :col="{ cols: 3 }"
                    required
                  >
                  </prefix-field>

                  <input-field
                    v-model="patientModel.fullname"
                    label="Full name"
                    :col="{ cols: 9 }"
                    :textfield="{
                      placeholder: 'John Doe',
                      prependInnerIcon: 'mdi-account',
                      autocomplete: 'off',
                    }"
                    required
                  ></input-field>
                </v-layout>
                <gender-field
                  v-model="patientModel.gender"
                  field="v-select"
                  required
                ></gender-field>
                <birth-date-field
                  v-model="patientModel.birthDate"
                  required
                ></birth-date-field>
                <marital-status-field
                  v-model="patientModel.maritalStatus"
                  label="Marital Status"
                >
                </marital-status-field>
                <input-field
                  v-model="patientModel.occupation"
                  field="v-combobox"
                  label="Occupation"
                  :textfield="{
                    prependInnerIcon: 'mdi-tie',
                    items: ui.preLoaders.occupations,
                    loading: ui.preLoaders.loading,
                  }"
                ></input-field>
                <v-divider class="mt-5"></v-divider>
                <template v-for="(field, model) in extraFileds">
                  <input-field
                    v-if="field.visibility"
                    :key="model"
                    v-model="patientModel[model]"
                    v-bind="field"
                  ></input-field>
                </template>
                <v-layout justify-end>
                  <template v-for="(field, model) in extraFileds">
                    <div
                      v-if="!field.visibility"
                      :key="model"
                      class="my-3 mx-3 text-right"
                    >
                      <a @click="field.visibility = true">
                        + {{ field.label }}
                      </a>
                    </div>
                  </template>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text :disabled="ui.loading" @click="closeDialog">
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="ui.loading"
                  :disabled="ui.loading"
                  depressed
                >
                  {{ patientModel._id ? "save" : "Next" }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-stepper-content>
          <v-stepper-content step="2">
            <template v-if="avatar.preview">
              <v-card-text>
                <p v-if="avatar.fd">
                  Click <b>UPLOAD</b> to use this picture for
                  {{ patientModel.fullname }}
                </p>
                <v-layout column justify-center align-center>
                  <div class="text-right">
                    <v-btn
                      color="error"
                      class="mb-2"
                      small
                      text
                      @click="
                        (avatar.fd && (avatar.fd = null)) ||
                          (avatar.preview = '')
                      "
                    >
                      <v-icon class="pr-1" small>mdi-close</v-icon> remove
                    </v-btn>
                    <v-img
                      class="preview"
                      :src="avatar.preview"
                      height="248"
                      width="168"
                    >
                    </v-img>
                  </div>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  :loading="ui.loading"
                  :disabled="ui.loading || !avatar.fd"
                  block
                  @click="uploadPicture"
                >
                  Upload
                </v-btn>
              </v-card-actions>
            </template>
            <template v-else>
              <v-card-text>
                <p>Select or drag a picture of the patient</p>
                <input
                  ref="avatar"
                  type="file"
                  accept="images/*"
                  hidden
                  @input="(ev) => (avatar.fd = ev.target.files[0])"
                />
                <v-card-actions v-if="false" row wrap>
                  <v-spacer></v-spacer>
                  <v-dialog>
                    <template v-slot:activator="{ on }">
                      <v-btn color="success" v-on="on">Open Camera</v-btn>
                    </template>
                    <v-card>
                      <vue-camera></vue-camera>
                    </v-card>
                  </v-dialog>
                </v-card-actions>
                <div
                  v-ripple
                  class="drag-region"
                  :class="{ dragging: ui.dragEvent.dragging }"
                  @click="$refs.avatar.click()"
                  @drop.prevent="onFileDrag"
                  @dragover.prevent="onFileDrag"
                  @dragenter.prevent="onFileDrag"
                  @dragleave.prevent="onFileDrag"
                >
                  <v-layout fill-height align-center justify-center column>
                    <v-icon
                      class="mb-2"
                      :x-large="ui.dragEvent.dragging"
                      :large="!ui.dragEvent.dragging"
                    >
                      {{
                        ui.dragEvent.dragging ? "mdi-package-down" : "mdi-image"
                      }}
                    </v-icon>
                    <v-slide-y-transition mode="out-in">
                      <span
                        :key="ui.dragEvent.dragging"
                        class="text--secondary"
                      >
                        {{
                          ui.dragEvent.dragging
                            ? "Drop your file here"
                            : "Drag and drop photo file here"
                        }}
                      </span>
                    </v-slide-y-transition>
                  </v-layout>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" text @click="ui.step = 3">
                  skip
                  <v-icon>mdi-skip-next</v-icon>
                </v-btn>
              </v-card-actions>
            </template>
          </v-stepper-content>
          <v-stepper-content step="3" class="pa-0">
            <address-form
              ref="extraForm"
              v-model="patientModel.address"
              content-class="grey lighten-4 pt-3 pb-8"
              :pins="ui.preLoaders.pins"
              :areas="ui.preLoaders.areas"
              :loading-prefetch="ui.preLoaders.loading"
              add-address
              @submit="submit"
            ></address-form>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>

    <confirmation-dialog
      v-model="ui.closeConfirmation"
      @next="model = false"
    ></confirmation-dialog>

    <v-dialog v-model="ui.deleteConfirmation.model" max-width="340">
      <v-card>
        <v-card-title>Are you sure?</v-card-title>
        <v-card-text>
          <p>
            <span> Retype patient name </span>
            <code class="text-truncate">{{ patientModel.fullname }}</code>
            <span> to confirm delete </span>
          </p>
          <v-text-field
            v-model="ui.deleteConfirmation.name"
            solo-inverted
            hide-details
            solo
            flat
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            depressed
            @click.native="ui.deleteConfirmation.model = false"
          >
            cancel
          </v-btn>
          <v-btn
            v-if="patientModel.fullname"
            color="error"
            :disabled="patientModel.fullname != ui.deleteConfirmation.name"
            outlined
            @click="deletePatient"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import Toggleable from "@/components/widgets/Toggleable";
import ConfirmationDialog from "@/components/widgets/ConfirmationDialog";

import PrefixField from "@/components/app/fields/PrefixField";
import GenderField from "@/components/app/fields/GenderField";
import BirthDateField from "@/components/app/fields/BirthDateField";
import MaritalStatusField from "@/components/app/fields/MaritalStatusField";
import AddressForm from "@/components/app/forms/AddressForm";

import moment from "moment";
import Patient from "@/model/Patient";
import {
  isEmpty,
  clone,
  changedFields,
} from "@pranavraut033/js-utils/utils/object";

function ExtraField(label, textfield, extras) {
  this.visibility = false;
  this.label = label;
  this.textfield = textfield;

  if (!isEmpty(extras))
    Object.keys(extras).forEach((key) => (this[key] = extras[key]));
}

export default {
  components: {
    ConfirmationDialog,
    PrefixField,
    BirthDateField,
    GenderField,
    MaritalStatusField,
    AddressForm,
  },
  extends: Toggleable,
  props: {
    noActivator: { type: Boolean, default: false },
    patient: { type: Object, default: null },
    block: { type: Boolean, default: false },
  },
  data() {
    return {
      patientModel: { address: {} },
      avatar: {
        fd: null,
        preview: "",
      },
      extraFileds: {
        email: new ExtraField("Email", {
          placeholder: "johndoe@abc.com",
          autocomplete: "off",
          prependInnerIcon: "mdi-email",
        }),
        phone: new ExtraField("Contact", {
          autocomplete: "off",
          placeholder: "12345 12345",
          prependInnerIcon: "mdi-phone-classic",
          count: 10,
        }),
        bloodGroup: new ExtraField(
          "Blood group",
          {
            prependInnerIcon: "mdi-water",
            items: [
              "a+",
              "b+",
              "o+",
              "ab+",
              "a-",
              "b-",
              "o-",
              "ab-",
              "unknown",
            ],
          },
          { field: "v-select" }
        ),
      },

      ui: {
        dragEvent: { dragging: false, x: 0, y: 0 },
        closeConfirmation: false,
        deleteConfirmation: { model: false, name: "" },
        step: 1,
        loading: false,
        preLoaders: {
          loading: false,
          areas: [],
          pins: [],
          occupations: [],
        },
        initialState: null,
      },
    };
  },

  computed: {
    changedField() {
      // this.log(changedFields(this.ui.initialState, this.patientModel));
      return changedFields(this.ui.initialState, this.patientModel);
    },
    closeable() {
      return isEmpty(this.changedField);
    },
  },
  watch: {
    model(a) {
      if (!a) this.reset();
    },
    "avatar.fd": function (a) {
      if (!a) {
        this.avatar.preview = "";
        return;
      }

      const fr = new FileReader();
      fr.onload = (ev) => (this.avatar.preview = ev.target.result);

      fr.readAsDataURL(a);
    },
  },
  mounted() {
    this.setPatient(this.patient);
  },
  methods: {
    closeDialog() {
      if (this.closeable) this.model = false;
      else this.ui.closeConfirmation = true;
    },
    submit() {
      if (this.ui.loading) return;

      if (this.$refs.patientForm.validate()) {
        this.ui.loading = true;
        let requestData;
        let method;
        if (this.patient) {
          method = "put";
          requestData = {
            id: this.patientModel._id,
            updates: this.changedField,
          };
        } else {
          method = "post";
          requestData = this.patientModel;
        }

        this.makeRequest(method, "patient", requestData)
          .then(({ data }) => {
            this.setPatient(data);
            this.$emit("update:patient", data);

            this.ui.loading = false;

            if (method === "post") this.$nextTick(() => (this.ui.step = 2));
          })
          .catch((err) => {
            this.ui.loading = false;
            this.errorHandler(err);
          });
      } else this.showSnackbar("Please enter all the details");
    },
    uploadPicture() {
      // todo upload files to aws
    },

    deletePatient() {
      if (this.ui.loading) return;
      this.ui.loading = true;

      this.makeRequest("delete", "patient", { id: this.patientModel._id })
        .then(() => {
          this.$emit("patient:removed", this.patientModel._id);

          this.ui.deleteConfirmation = { model: false, name: "" };
          this.model = false;

          if (window.location.pathname !== "/app/patients/")
            this.$router.push("/app/patients/");
        })
        .catch((err) => {
          this.ui.loading = false;
          this.errorHandler(err);
        });
    },
    reset() {
      Object.assign(this.$data, this.$options.data.apply(this));

      this.$nextTick(() => {
        this.fetchAutoCompleData();
        this.setPatient(this.patient);
      });
    },
    setPatient(patient) {
      const patientModel = new Patient(patient);

      if (patientModel)
        Object.keys(this.extraFileds).forEach((key) => {
          this.extraFileds[key].visibility = Boolean(patientModel[key]);
        });

      if (patientModel.birthDate)
        patientModel.birthDate = moment(patientModel.birthDate).format(
          "YYYY-MM-DD"
        );

      this.ui.initialState = clone(patientModel);

      this.patientModel = patientModel;
    },
    fetchAutoCompleData() {
      this.ui.preLoaders.loading = true;

      this.makeRequest("get", "patient/options")
        .then(({ data }) => {
          this.ui.preLoaders.loading = false;
          this.ui.preLoaders = Object.assign(this.ui.preLoaders, data);
        })
        .catch((err) => {
          this.ui.preLoaders.loading = false;
          this.errorHandler(err);
        });
    },
    onFileDrag(ev) {
      const dragging = ev.type === "dragenter" || ev.type === "dragover";

      if (dragging) {
        this.ui.dragEvent.x = ev.x;
        this.ui.dragEvent.y = ev.y;
      }

      if (ev.type === "drop")
        this.avatar.fd = ev.dataTransfer.files && ev.dataTransfer.files[0];

      if (this.ui.dragEvent.dragging !== dragging)
        this.$nextTick(() => (this.ui.dragEvent.dragging = dragging));
    },
  },
};
</script>

<style lang="scss">
.v-stepper__header {
  height: auto !important;
  .v-stepper__step {
    padding: 1rem;
  }
}
.drag-region {
  border: 2px dashed rgba(71, 71, 71, 0.4);
  border-radius: 0.5rem;
  height: 200px;
  background: white;
  cursor: pointer;
  box-shadow: none !important;
  transition: all 300ms cubic-bezier(0.075, 0.82, 0.165, 1);

  &.dragging {
    cursor: grabbing;
    border: 2px solid rgba(71, 71, 71, 0.4);
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
      0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
  }
}
.preview {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.137);
}
</style>
