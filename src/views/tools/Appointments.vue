<template>
  <v-container>
    <v-form ref="form" lazy-validation @submit.prevent="submit">
      <v-card max-width="680" class="mx-auto">
        <v-card-title>
          <v-app-bar-nav-icon @click="$router.go(-1)">
            <v-icon>mdi-arrow-left</v-icon>
          </v-app-bar-nav-icon>
          <span class="ml-3">Add Appointment</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="pb-0">
              <search-bar
                class="w-100"
                v-slot:default="{
                  search,
                  onInput,
                  onSearch,
                  items,
                  filter,
                  loading,
                }"
                minimal
              >
                <v-combobox
                  v-model="patient"
                  @update:search-input="onSearch"
                  label="Patient Name"
                  :items="items"
                  :menu-props="{
                    maxWidth: 540,
                  }"
                  :filter="filter"
                  :loading="loading"
                  @input="onInput"
                  prepend-inner-icon="mdi-face"
                  autocomplete="off"
                  append-icon
                  hide-details
                  item-text="fullname"
                  clearable
                  outlined
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
                  :on="on"
                  v-model="entry.date"
                  @click="dateMenu = true"
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
                ></input-field>
              </template>
              <v-card>
                <v-date-picker
                  class="elevation-0"
                  ref="datePicker"
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
                  :on="on"
                  v-model="entry.time"
                  @click="timeMenu = true"
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
                ></input-field>
              </template>
              <v-card>
                <v-time-picker
                  class="elevation-0"
                  ref="timePicker"
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
          <v-btn color="primary" type="submit" depressed>save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
import moment from "moment";
import { makeRequest } from "../../modules/request";
import Logger from "../../modules/Logger";
import SearchBar from "../../components/SearchBar";

export default {
  components: { SearchBar },
  data() {
    return {
      patient: "",
      dateMenu: false,
      timeMenu: false,
      entry: {
        date: moment().add(1, "weeks").format("YYYY-MM-DD"),
        time: "",
      },
    };
  },
  methods: {
    submit() {
      if (this.loading) return;
      if (this.$refs.form.validate()) {
        if (typeof this.patient == "string") this.entry.name = this.patient;
        else this.entry.patient = this.patient._id;
        this.entry.dateTime = new Date(this.entry.date + " " + this.entry.time);
        this.loading = true;
        makeRequest("post", "appointment", this.entry)
          .then((res) => {
            Logger.d(res);
            this.loading = false;
            this.entry = {};
            this.$refs.form.reset();
          })
          .catch((err) => {
            this.loading = false;
            this.errorHandler(err);
          });
      }
    },
  },
};
</script>

<style></style>
