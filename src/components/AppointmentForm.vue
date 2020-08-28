<template>
  <v-dialog v-model="model" :persistent="loading" max-width="540" scrollable>
    <v-form ref="form" lazy-validation @submit.prevent="submit">
      <v-card>
        <v-card-title>
          <span class="ml-3">
            {{ !!entry._id ? "Update" : "Add" }} Appointment
          </span>
          <v-spacer></v-spacer>
          <v-btn
            v-if="entry._id"
            class="mx-3"
            color="error"
            depressed
            small
            @click="deleteEntry"
          >
            <v-icon small>mdi-delete-circle</v-icon> delete
          </v-btn>
          <v-app-bar-nav-icon @click="model = false">
            <v-icon>mdi-close</v-icon>
          </v-app-bar-nav-icon>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="pb-0">
              <search-bar
                v-slot:default="{
                  search,
                  onInput,
                  onSearch,
                  items,
                  filter,
                  // eslint-disable-next-line vue/no-template-shadow
                  loading,
                }"
                class="w-100"
                minimal
              >
                <v-combobox
                  v-model="patient"
                  label="Patient Name"
                  :items="items"
                  :menu-props="{
                    maxWidth: 540,
                  }"
                  :filter="filter"
                  :loading="loading"
                  :disabled="!!entry._id"
                  prepend-inner-icon="mdi-face"
                  autocomplete="off"
                  append-icon
                  hide-details
                  item-text="fullname"
                  clearable
                  outlined
                  @update:search-input="onSearch"
                  @input="onInput"
                >
                </v-combobox>
              </search-bar>
            </v-col>
            <v-menu
              v-model="dateMenu"
              :close-on-content-click="false"
              max-width="290px"
              min-width="290px"
              offset-y
              top
            >
              <template v-slot:activator="{ on }">
                <input-field
                  v-model="entry.date"
                  :on="on"
                  :textfield="{
                    label: 'Date',
                    prependInnerIcon: 'mdi-calendar',
                    autocomplete: 'off',
                    readonly: true,
                    outlined: true,
                    solo: false,
                  }"
                  :col="{ md: 6, cols: 12 }"
                  required
                  @click="dateMenu = true"
                ></input-field>
              </template>
              <v-card>
                <v-date-picker
                  ref="datePicker"
                  class="elevation-0"
                  color="primary"
                  :value="entry.date"
                  :min="moment().format('YYYY-MM-DD')"
                  no-title
                ></v-date-picker>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn depressed text small @click="dateMenu = false">
                    cancel
                  </v-btn>
                  <v-btn
                    color="primary"
                    depressed
                    small
                    @click="
                      entry.date = $refs.datePicker.inputDate;
                      dateMenu = false;
                    "
                  >
                    ok
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
            <v-menu
              v-model="timeMenu"
              :close-on-content-click="false"
              max-width="290px"
              min-width="290px"
              offset-y
              top
            >
              <template v-slot:activator="{ on }">
                <input-field
                  v-model="entry.time"
                  :on="on"
                  :textfield="{
                    label: 'Time',
                    prependInnerIcon: 'mdi-clock',
                    autocomplete: 'off',
                    readonly: true,
                    outlined: true,
                    solo: false,
                  }"
                  :col="{ md: 6, cols: 12 }"
                  required
                  @click="timeMenu = true"
                ></input-field>
              </template>
              <v-card>
                <v-time-picker
                  ref="timePicker"
                  class="elevation-0"
                  color="primary"
                  :value="entry.time"
                ></v-time-picker>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn depressed text small @click="timeMenu = false">
                    cancel
                  </v-btn>
                  <v-btn
                    color="primary"
                    depressed
                    small
                    @click="
                      entry.time = $refs.timePicker.genValue();
                      timeMenu = false;
                    "
                  >
                    ok
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>

            <input-field
              v-model="entry.contact"
              :textfield="{
                label: 'Contact',
                prependInnerIcon: 'mdi-phone',
                autocomplete: 'off',
                outlined: true,
                solo: false,
              }"
              :col="{ cols: 12 }"
            ></input-field>

            <input-field
              v-model="entry.notes"
              field="v-textarea"
              :textfield="{
                label: 'Notes',
                prependInnerIcon: 'mdi-phone',
                autocomplete: 'off',
                outlined: true,
                autoGrow: true,
                rows: 4,
                solo: false,
              }"
              :col="{ cols: 12 }"
            ></input-field>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="$refs.form.reset()">reset</v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="loading" outlined @click.native="model = false">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            :loading="loading"
            :disabled="loading"
            depressed
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import moment from "moment";
import { changedFields } from "@pranavraut033/js-utils/utils/object";
import SearchBar from "@/components/app/widgets/SearchBar";
import InputModel from "@/components/widgets/InputModel";

const defaultEntry = () => ({
  date: moment().add(1, "weeks").format("YYYY-MM-DD"),
  time: "",
});

export default {
  components: { SearchBar },
  extends: InputModel,
  props: { appointment: { type: Object, default: null } },
  data() {
    return {
      patient: "",
      dateMenu: false,
      timeMenu: false,
      loading: false,
      entry: defaultEntry(),
    };
  },
  watch: {
    model() {
      this.cloneAppointment();
    },
    appointment() {
      this.cloneAppointment();
    },
  },
  mounted() {
    if (!this.appointment) this.cloneAppointment();
  },

  methods: {
    submit() {
      if (this.loading) return;
      if (this.$refs.form.validate()) {
        const requestData = {};
        let method = "post";

        this.entry.dateTime = new Date(`${this.entry.date} ${this.entry.time}`);

        if (this.entry._id) {
          method = "put";
          requestData.updates = changedFields(this.appointment, this.entry);
          requestData.id = this.entry._id;
        } else {
          if (typeof this.patient === "string") this.entry.name = this.patient;
          else this.entry.patient = this.patient._id;

          Object.assign(requestData, this.entry);

          // delete requestData.date;
          // delete requestData.time;
        }

        this.loading = true;
        this.makeRequest(method, "appointment", requestData)
          .then(({ data }) => {
            this.loading = false;

            if (method === "post") this.$emit("add", data);
            else this.$emit("update:appointment", data);

            this.reset();
            this.$refs.form.reset();
          })
          .catch((err) => {
            this.loading = false;
            this.errorHandler(err);
          });
      }
    },
    cloneAppointment() {
      if (!this.appointment) return this.reset();

      Object.assign(this.entry, this.appointment);
      this.entry.date = moment(this.entry.dateTime).format("YYYY-MM-DD");
      this.entry.time = moment(this.entry.dateTime).format("HH:mm");
      this.patient = this.appointment.patientName;
    },
    deleteEntry() {
      const self = this;
      self.deleteLoading = true;

      this.$store
        .dispatch("deleteAppointment", {
          id: self.entry._id,
          makeRequest: self.makeRequest,
        })
        .then(() => (self.model = false))
        .catch(self.errorHandler)
        .finally(() => (self.deleteLoading = false));
    },
    reset() {
      this.patient = "";
      this.entry = defaultEntry();
    },
  },
};
</script>
