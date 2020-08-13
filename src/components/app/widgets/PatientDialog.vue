<template>
  <v-dialog
    v-model="model"
    :fullscreen="$vuetify.breakpoint.xs"
    :persistent="!closeable"
    max-width="640"
  >
    <template v-if="!noActivator" v-slot:activator="{ on }">
      <slot name="activator" v-bind:on="on">
        <v-btn v-on="on" color="primary" depressed :block="block">
          Add Patient
        </v-btn>
      </slot>
    </template>
    <v-card v-if="ui.added">
      <v-card-title>
        <b>{{ patientModel.fullname }}</b>
        <span>&nbsp;added</span>
      </v-card-title>
      <v-card-text>
        <v-layout align-center justify-center column>
          <div>
            <img src="/img/check.gif" width="348" />
          </div>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" :to="'/app/case/' + patientModel._id" block>
          View Case
        </v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn text block to="/app/patients/" @click="model = false" small>
          go to patients
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else-if="model">
      <v-subheader v-if="patientModel._id" class="grey lighten-4">
        <span>{{ patientModel.fullname }}'s Profile</span>
        <v-spacer class="mx-3"></v-spacer>
        <v-btn
          color="error"
          @click="ui.deleteConfirmation = { model: true, name: '' }"
          icon
        >
          <v-icon>mdi-delete-circle</v-icon>
        </v-btn>
        <v-btn
          class="mx-3"
          :to="'/app/case/' + patientModel._id"
          color="primary"
          @click="closeDialog"
          depressed
          small
        >
          <span>View Case</span>
        </v-btn>
        <v-btn text @click="closeDialog" small>
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
            <v-form
              ref="patientForm"
              lazy-validation
              @submit.prevent="addPatient"
            >
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
                  field="v-select"
                  v-model="patientModel.gender"
                  required
                ></gender-field>
                <birth-date-field
                  v-model="patientModel.birthDate"
                  :age.sync="patientModel.age"
                  required
                ></birth-date-field>
                <marital-status-field
                  label="Marital Status"
                  v-model="patientModel.maritalStatus"
                >
                </marital-status-field>
                <input-field
                  field="v-combobox"
                  v-model="patientModel.occupation"
                  label="Occupation"
                  :textfield="{
                    prependInnerIcon: 'mdi-tie',
                    items: ui.occupations,
                  }"
                ></input-field>
                <v-divider class="mt-5"></v-divider>
                <template v-for="(field, model) in extraFileds">
                  <input-field
                    v-if="field.visibility"
                    v-bind="field"
                    v-model="patientModel[model]"
                    :key="model"
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
                <v-btn text @click="closeDialog" :disabled="ui.loading">
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="ui.loading"
                  :disabled="ui.loading"
                  depressed
                >
                  Next
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
                      @click="
                        (avatar.fd && (avatar.fd = null)) ||
                          (avatar.preview = '')
                      "
                      small
                      text
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
                  @click="uploadPicture"
                  :loading="ui.loading"
                  :disabled="ui.loading || !avatar.fd"
                  block
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
                  @input="(ev) => (avatar.fd = ev.target.files[0])"
                  hidden
                />
                <v-card-actions row wrap v-if="false">
                  <v-spacer></v-spacer>
                  <v-dialog>
                    <template v-slot:activator="{ on }">
                      <v-btn color="success" v-on="on">Open Camera</v-btn>
                    </template>
                    <v-card>
                      <VueCamera></VueCamera>
                    </v-card>
                  </v-dialog>
                </v-card-actions>
                <div
                  class="drag-region"
                  :class="{ dragging: ui.dragEvent.dragging }"
                  @click="$refs.avatar.click()"
                  @drop.prevent="onFileDrag"
                  @dragover.prevent="onFileDrag"
                  @dragenter.prevent="onFileDrag"
                  @dragleave.prevent="onFileDrag"
                  v-ripple
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
                        class="text--secondary"
                        :key="ui.dragEvent.dragging"
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
              v-bind="address"
              :pins="ui.pins"
              :areas="ui.areas"
              @submit="updateExtra"
              content-class="grey lighten-4 pt-3 pb-8"
              lazy-validation
            ></address-form>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>

    <v-dialog v-model="ui.closeConfirmation" max-width="280">
      <v-card>
        <v-card-title>Are you sure?</v-card-title>
        <v-card-text>You will lose all the progess</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click.native="ui.closeConfirmation = false"
            depressed
          >
            cancel
          </v-btn>
          <v-btn @click.native="model = false" outlined>OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            @click.native="ui.deleteConfirmation.model = false"
            depressed
          >
            cancel
          </v-btn>
          <v-btn
            v-if="patientModel.fullname"
            color="error"
            :disabled="patientModel.fullname != ui.deleteConfirmation.name"
            @click="deletePatient"
            outlined
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
import PrefixField from "@/components/app/fields/PrefixField";
import GenderField from "@/components/app/fields/GenderField";
import BirthDateField from "@/components/app/fields/BirthDateField";
import MaritalStatusField from "@/components/app/fields/MaritalStatusField";
import AddressForm from "@/components/app/forms/AddressForm";

import { makeRequest } from "@/modules/request";
import { isEmpty, clone, isEqual } from "@/modules/object";

export default {
  extends: Toggleable,
  components: {
    PrefixField,
    BirthDateField,
    GenderField,
    MaritalStatusField,
    AddressForm,
  },
  props: {
    noActivator: { type: Boolean, default: false },
    patient: { value: Object },
    block: { type: Boolean, default: false },
  },
  data: () => ({
    patientModel: {},
    address: {},
    avatar: {
      fd: null,
      preview: "",
    },
    extraFileds: {
      email: {
        visibility: false,
        label: "Email",
        textfield: {
          placeholder: "johndoe@abc.com",
          autocomplete: "off",
          prependInnerIcon: "mdi-email",
        },
      },
      phone: {
        visibility: false,
        label: "Contact",
        textfield: {
          autocomplete: "off",
          placeholder: "12345 12345",
          prependInnerIcon: "mdi-phone-classic",
          count: 10,
        },
      },
      bloodGroup: {
        visibility: false,
        label: "Blood group",
        field: "v-select",
        textfield: {
          prependInnerIcon: "mdi-water",
          items: ["a+", "b+", "o+", "ab+", "a-", "b-", "o-", "ab-", "unknown"],
        },
      },
    },

    ui: {
      dragEvent: { dragging: false, x: 0, y: 0 },
      added: false,
      closeConfirmation: false,
      deleteConfirmation: { model: false, name: "" },
      step: 1,
      loading: false,
      areas: [],
      pins: [],
      occupations: [],
    },
  }),
  computed: {
    closeable() {
      return (
        !this.ui.loading &&
        ((this.patient &&
          this.patient.address &&
          isEqual(this.patient.address, this.address)) ||
          isEmpty(this.address)) &&
        ((this.patient && isEqual(this.patientModel, this.patient)) ||
          isEmpty(this.patientModel))
      );
    },
  },
  watch: {
    patient() {
      this.clonePatientProp();
    },
    model(a) {
      if (a) {
        makeRequest("get", "patient/options")
          .then(({ data }) => {
            this.ui.areas = data.areas;
            this.ui.pins = data.pins;
            this.ui.occupations = data.occupations;
          })
          .catch((err) => {
            this.errorHandler(err);
          });
        this.ui.added = false;

        if (this.patient)
          for (const key in this.extraFileds)
            this.extraFileds[key].visibility = Boolean(this.patient[key]);

        this.ui.step = 1;
        this.patientModel = {};
        this.address = {};
        if (this.patient) this.clonePatientProp();
        else {
          if (this.$refs.patientForm)
            this.$nextTick(() => this.$refs.patientForm.reset());
        }
      }
    },
    "avatar.fd"(a) {
      if (!a) {
        this.avatar.preview = "";
        return;
      }

      let fr = new FileReader();
      fr.onload = (ev) => (this.avatar.preview = ev.target.result);

      fr.readAsDataURL(a);
    },
  },
  methods: {
    closeDialog() {
      if (this.closeable) this.model = false;
      else this.ui.closeConfirmation = true;
    },
    addPatient() {
      if (this.ui.loading) return;

      if (this.$refs.patientForm.validate()) {
        if (this.patient) {
          let data = {
            id: this.patientModel._id,
            updates: {},
          };
          for (const key in this.patientModel) {
            if (this.patientModel.hasOwnProperty(key)) {
              const element = this.patientModel[key];
              if (!isEqual(element, this.patient[key]))
                data.updates[key] = element;
            }
          }
          this.updatePatient(data, () => this.showSnackbar("Saved"));
        } else {
          this.ui.loading = true;
          makeRequest("post", "patient", this.patientModel)
            .then(({ data }) => {
              if (this.patient) this.$emit("update:patient", data);
              else this.patientModel = clone(data);

              this.ui.loading = false;
              this.$nextTick(() => (this.ui.step = 2));
            })
            .catch((err) => {
              this.ui.loading = false;
              this.errorHandler(err);
            });
        }
      } else this.showSnackbar("Please enter all the details");
    },
    uploadPicture() {
      if (this.ui.loading) return;

      let data = new FormData();
      data.append("avatar", this.avatar.fd, this.avatar.fd.name);
      data.append("id", this.patientModel._id);

      this.updatePatient(data, () => (this.ui.step = 3));
    },
    updateExtra(address) {
      // eslint-disable-next-line no-console
      console.log(arguments);
      if (this.ui.loading) return;

      this.updatePatient(
        {
          id: this.patientModel._id,
          updates: { address },
        },
        () => {
          if (this.patient) this.showSnackbar("Saved");
          else this.ui.added = true;
        }
      );
    },

    onFileDrag(ev) {
      let dragging = ev.type == "dragenter" || ev.type == "dragover";

      if (dragging) {
        this.ui.dragEvent.x = ev.x;
        this.ui.dragEvent.y = ev.y;
      }

      if (ev.type == "drop")
        this.avatar.fd = ev.dataTransfer.files && ev.dataTransfer.files[0];

      if (this.ui.dragEvent.dragging != dragging)
        this.$nextTick(() => (this.ui.dragEvent.dragging = dragging));
    },
    updatePatient(data, then) {
      if (this.ui.loading) return;

      if (this.$refs.patientForm.validate()) {
        this.ui.loading = true;

        makeRequest("put", "patient", data)
          .then(({ data }) => {
            this.ui.loading = false;
            if (this.patient) this.$emit("update:patient", data);
            else this.patientModel = clone(data);
            then && then();
          })
          .catch((err) => {
            this.ui.loading = false;
            this.errorHandler(err);
          });
      }
    },
    deletePatient() {
      makeRequest("delete", "patient", { id: this.patientModel._id })
        .then(() => {
          this.$emit("patient:removed", this.patientModel._id);

          this.ui.deleteConfirmation = { model: false, name: "" };
          this.model = false;

          if (window.location.pathname != "/app/patients/")
            this.$router.push("/app/patients/");
        })
        .catch((err) => {
          this.ui.loading = false;
          this.errorHandler(err);
        });
    },
    clonePatientProp() {
      if (this.patient) {
        this.patientModel = clone(this.patient);
        this.avatar.preview =
          (this.patient.avatar &&
            this.baseUrl + "img/" + this.patient.avatar) ||
          "";

        if (this.patient.address) this.address = clone(this.patient.address);
      }
    },
  },
  mounted() {
    this.clonePatientProp();
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
