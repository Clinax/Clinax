<template>
  <v-dialog
    v-model="model"
    :fullscreen="$vuetify.breakpoint.smAndDown"
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
    <v-card v-if="added">
      <v-card-title>
        <b>{{ patientModel.fullname }}</b>
        &nbsp;added
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
        <v-spacer></v-spacer>
        <v-btn
          class="mx-3"
          color="primary"
          :to="'/app/case/' + patientModel._id"
          @click="closeDialog"
          depressed
          small
        >
          <span>View Case</span>
        </v-btn>
        <v-btn text @click="closeDialog" small>
          <v-icon class="ml-2" small>mdi-close</v-icon>
          <span v-if="$vuetify.breakpoint.mdAndUp">Close</span>
        </v-btn>
      </v-subheader>
      <v-divider></v-divider>
      <v-stepper v-model="step">
        <v-stepper-header>
          <v-stepper-step
            :complete="step > 1 || !!patientModel._id"
            :editable="!!patientModel._id"
            step="1"
          >
            Basic
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step
            :complete="step > 2 || !!patientModel._id"
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
                  <input-field
                    v-model="patientModel.prefix"
                    field="v-select"
                    label="Prefix"
                    @input="
                      (patientModel.prefix === '- Less' &&
                        ((prefixes = ['Mr', 'Mrs', 'Ms', '+ More']),
                        (patientModel.prefix = null))) ||
                        (patientModel.prefix === '+ More' &&
                          ((prefixes = namePrefixes),
                          (patientModel.prefix = null)))
                    "
                    :textfield="{
                      items: prefixes,
                      autocomplete: 'off',
                    }"
                    :col="{ cols: 3 }"
                    required
                  >
                  </input-field>

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
                <input-field
                  field="v-select"
                  v-model="patientModel.gender"
                  :textfield="{
                    label: 'Gender',
                    items: [
                      { text: 'Male', value: 'male' },
                      { text: 'Female', value: 'female' },
                      { text: 'Other', value: 'non-binary' },
                    ],
                    prependInnerIcon:
                      (patientModel.gender &&
                        `mdi-gender-${patientModel.gender}`) ||
                      'mdi-help',
                  }"
                  required
                ></input-field>
                <v-layout>
                  <input-field
                    v-if="age"
                    v-model="patientModel.age"
                    @input="
                      (ev) =>
                        (patientModel.birthDate =
                          ev &&
                          moment(String(new Date().getFullYear() - ev)).format(
                            'YYYY-MM-DD'
                          ))
                    "
                    :textfield="{
                      prependInnerIcon: ' mdi-cake-variant',
                      label: 'Age',
                      type: 'number',
                      autocomplete: 'off',
                      max: 100,
                      min: 1,
                    }"
                    required
                  ></input-field>
                  <v-menu
                    v-else
                    v-model="birthDateMenu"
                    :close-on-content-click="false"
                    max-width="290px"
                    min-width="290px"
                    offset-y
                    top
                  >
                    <template v-slot:activator="{ on }">
                      <input-field
                        :on="on"
                        v-model="patientModel.birthDate"
                        :textfield="{
                          label: 'Date of Birth',
                          autocomplete: 'off',
                          prependInnerIcon: ' mdi-cake-variant',
                          readonly: true,
                        }"
                        required
                      ></input-field>
                    </template>
                    <v-date-picker
                      @input="
                        (ev) => {
                          patientModel.birthDate = ev;
                          birthDateMenu = false;
                        }
                      "
                      :value="patientModel.birthDate"
                      :max="moment().format('YYYY-MM-DD')"
                      no-title
                    ></v-date-picker>
                  </v-menu>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-on="on"
                        icon
                        class="mt-7 mr-2"
                        @click="age = !age"
                      >
                        <v-icon>mdi-counter</v-icon>
                      </v-btn>
                    </template>
                    <span>
                      Change between age input and birth date input
                    </span>
                  </v-tooltip>
                </v-layout>
                <input-field
                  field="v-select"
                  v-model="patientModel.bloodGroup"
                  label="Blood group"
                  :textfield="{
                    prependInnerIcon: 'mdi-water',
                    items: [
                      'a+',
                      'b+',
                      'o+',
                      'ab+',
                      'a-',
                      'b-',
                      'o-',
                      'ab-',
                      'unknown',
                    ],
                  }"
                  required
                ></input-field>
                <input-field
                  field="v-select"
                  v-model="patientModel.maritalStatus"
                  label="Marital Status"
                  :textfield="{
                    prependInnerIcon: 'mdi-ring',
                    items: [
                      'Single',
                      'Married',
                      'Divorced',
                      'Widowed',
                      'Separated',
                    ],
                  }"
                  required
                ></input-field>
                <v-divider class="mt-5"></v-divider>
                <input-field
                  v-if="showPhoneField"
                  v-model="patientModel.phone"
                  label="Phone"
                  mask="+91 ### ### ####"
                  :textfield="{
                    autocomplete: 'off',
                    placeholder: '12345 12345',
                    prependInnerIcon: 'mdi-phone-classic',
                    count: 10,
                  }"
                ></input-field>
                <div v-else class="my-3 mx-5 text-right">
                  <a @click="showPhoneField = true">+ Contact</a>
                </div>
                <input-field
                  v-if="showEmailField"
                  v-model="patientModel.email"
                  label="Email (optional)"
                  :textfield="{
                    placeholder: 'johndoe@abc.com',
                    autocomplete: 'off',
                    prependInnerIcon: 'mdi-email',
                  }"
                ></input-field>
                <div v-else class="my-3 mx-5 text-right">
                  <a @click="showEmailField = true">+ Email</a>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeDialog" :disabled="loading">
                  cancel
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="loading"
                  :disabled="loading"
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
                  :loading="loading"
                  :disabled="loading || !avatar.fd"
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
                  :class="{ dragging: dragEvent.dragging }"
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
                      :x-large="dragEvent.dragging"
                      :large="!dragEvent.dragging"
                    >
                      {{
                        dragEvent.dragging ? "mdi-package-down" : "mdi-image"
                      }}
                    </v-icon>
                    <v-slide-y-transition mode="out-in">
                      <span class="text--secondary" :key="dragEvent.dragging">
                        {{
                          dragEvent.dragging
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
                <v-btn color="grey" text @click="step = 3">
                  skip
                  <v-icon>mdi-skip-next</v-icon>
                </v-btn>
              </v-card-actions>
            </template>
          </v-stepper-content>
          <v-stepper-content step="3" class="pa-0">
            <v-form
              ref="extraForm"
              lazy-validation
              @submit.prevent="updateExtra"
            >
              <v-card-text class="grey lighten-4">
                <input-field
                  field="v-textarea"
                  v-model="address.street"
                  label="Street address"
                  :textfield="{
                    rows: 3,
                    autoGrow: true,
                    prependInnerIcon: 'mdi-map',
                  }"
                ></input-field>
                <v-row class="mx-0">
                  <input-field
                    field="v-combobox"
                    v-model="address.area"
                    label="Area"
                    :col="{ md: 6, xs: 12 }"
                    :textfield="{
                      items: areas,
                      prependInnerIcon: 'mdi-image-filter-hdr',
                    }"
                    required
                  ></input-field>
                  <input-field
                    field="v-combobox"
                    v-model="address.pincode"
                    label="Pincode"
                    :col="{ md: 6, xs: 12 }"
                    :input-rules="[
                      (v) => String(v).length == 6 || 'Invalid Pincode',
                    ]"
                    :textfield="{
                      items: pins,
                      type: 'number',
                      prependInnerIcon: 'mdi-map-marker-radius-outline',
                    }"
                    required
                  ></input-field>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" type="submit">finish</v-btn>
              </v-card-actions>
            </v-form>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>

    <v-dialog v-model="closeConformation" max-width="280">
      <v-card>
        <v-card-title>Are you sure?</v-card-title>
        <v-card-text>You will lose all the progess</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            depressed
            @click.native="closeConformation = false"
          >
            cancel
          </v-btn>
          <v-btn outlined @click.native="model = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import ComponentWithModel from "./ComponentWithModel";
import InputField from "./InputField";
import namePrefixes from "@/json/name-prefixes.json";
import { makeRequest } from "../modules/request";
import { isEmpty, clone, isEqual } from "../modules/object";
import { getCookie, setCookie } from "../modules/cookie";

export default {
  extends: ComponentWithModel,
  components: { InputField },
  props: {
    noActivator: { type: Boolean, default: false },
    patient: { value: Object },
    block: { type: Boolean, default: false },
  },
  data: () => ({
    namePrefixes,
    prefixes: ["Mr", "Mrs", "Ms", "+ More"],
    patientModel: {},
    address: {},
    avatar: {
      fd: null,
      preview: "",
    },

    step: 1,
    showEmailField: false,
    showPhoneField: false,
    birthDateMenu: false,
    closeConformation: false,
    fullscreen: false,
    added: false,
    dragEvent: { dragging: false, x: 0, y: 0 },
    loading: false,
    areas: [],
    pins: [],
    age: getCookie("clinax.addPatient.age") == "true",
  }),
  computed: {
    closeable() {
      return (
        !this.loading &&
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
    age: (a) => setCookie("clinax.addPatient.age", a, 100),
    model(a) {
      if (a) {
        makeRequest("get", "patient/areas")
          .then(({ data }) => {
            this.areas = data.areas;
            this.pins = data.pins;
          })
          .catch((err) => {
            this.errorHandler(err);
          });
        this.added = false;
        this.showEmailField = Boolean(this.patient && this.patient.email);
        this.showPhoneField = Boolean(this.patient && this.patient.phone);
        this.step = 1;
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
      else this.closeConformation = true;
    },
    addPatient() {
      if (this.loading) return;

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
          this.loading = true;
          makeRequest("post", "patient", this.patientModel)
            .then(({ data }) => {
              if (this.patient) this.$emit("update:patient", data);
              else this.patientModel = clone(data);

              this.loading = false;
              this.$nextTick(() => (this.step = 2));
            })
            .catch((err) => {
              this.loading = false;
              this.errorHandler(err);
            });
        }
      } else this.showSnackbar("Please enter all the details");
    },
    uploadPicture() {
      if (this.loading) return;

      let data = new FormData();
      data.append("avatar", this.avatar.fd, this.avatar.fd.name);
      data.append("id", this.patientModel._id);

      this.updatePatient(data, () => (this.step = 3));
    },
    updateExtra() {
      if (this.loading) return;

      if (this.$refs.extraForm.validate())
        this.updatePatient(
          {
            id: this.patientModel._id,
            updates: { address: this.address },
          },
          () => {
            if (this.patient) this.showSnackbar("Saved");
            else this.added = true;
          }
        );
      else this.showSnackbar("Please enter all the details");
    },

    onFileDrag(ev) {
      let dragging = ev.type == "dragenter" || ev.type == "dragover";

      if (dragging) {
        this.dragEvent.x = ev.x;
        this.dragEvent.y = ev.y;
      }

      if (ev.type == "drop")
        this.avatar.fd = ev.dataTransfer.files && ev.dataTransfer.files[0];

      if (this.dragEvent.dragging != dragging)
        this.$nextTick(() => (this.dragEvent.dragging = dragging));
    },
    updatePatient(data, then) {
      if (this.loading) return;

      if (this.$refs.patientForm.validate()) {
        this.loading = true;

        makeRequest("put", "patient", data)
          .then(({ data }) => {
            this.loading = false;
            if (this.patient) this.$emit("update:patient", data);
            else this.patientModel = clone(data);
            then && then();
          })
          .catch((err) => {
            this.loading = false;
            this.errorHandler(err);
          });
      }
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
