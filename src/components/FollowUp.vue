<template>
  <v-sheet class="transparent">
    <v-tabs v-model="ui.tab" show-arrows center-active class="transparent">
      <v-tab v-for="tab in ui.tabs" :key="tab.text">
        <v-icon v-if="tab.icon && $vuetify.breakpoint.smAndUp" class="mr-2">
          {{ tab.icon }}
        </v-icon>
        <small class="text-truncate"> {{ tab.text }} </small>
      </v-tab>
    </v-tabs>

    <v-divider></v-divider>
    <v-card-text>
      <v-tabs-items v-model="ui.tab">
        <v-tab-item>
          <input-field
            @input="disabled || onChange()"
            v-model="followUpModel.chiefComplain"
            label="Cheif Complain"
            field="v-textarea"
            :textfield="{
              placeholder: 'Complain by patient..',
              autoGrow: true,
              rows: 4,
              flat: disabled,
              class: { border: disabled },
              disabled,
            }"
          ></input-field>
          <input-field
            @input="disabled || onChange()"
            v-if="patient && patient.gender == 'female'"
            v-model="followUpModel.femaleComplain"
            label="Female Complain"
            field="v-textarea"
            :textfield="{
              placeholder: 'Complain by patient..',
              autoGrow: true,
              rows: 3,
              flat: disabled,
              class: { border: disabled },
              disabled,
            }"
          ></input-field>

          <v-card-title class="title">
            <v-divider></v-divider>
            <span class="px-3 mb-1">Criteria</span>
            <v-divider></v-divider>
          </v-card-title>
          <v-slide-y-transition
            class="row align-center justify-center mx-0"
            tag="div"
            group
          >
            <input-field
              v-for="(field, i) in criteria"
              :key="i"
              v-model="field[1]"
              :label.sync="field[0]"
              :col="{ cols: 12, md: 6, lg: 4 }"
              :textfield="{
                placeholder: disabled ? 'Not Provided' : 'Start Typing...',
                class: { border: disabled },
                flat: disabled,
                disabled,
              }"
              @remove="criteria = criteria.filter((_, index) => i != index)"
              editable-header
              removable
            >
            </input-field>
            <v-col cols="12" sm="6" md="4" key="add" v-if="!disabled">
              <v-layout fill-height justify-center align-center>
                <v-btn
                  color="primary"
                  @click.prevent="
                    criteria.push(['Click here to change title', ''])
                  "
                  outlined
                  small
                >
                  Add Creatira
                </v-btn>
              </v-layout>
            </v-col>
          </v-slide-y-transition>
          <v-divider class="my-5"></v-divider>

          <v-slide-y-transition group>
            <input-field
              v-for="(field, i) in extra"
              :key="i"
              field="v-textarea"
              v-model="field[1]"
              :label.sync="field[0]"
              :textfield="{
                placeholder: disabled ? 'Not Provided' : 'Start Typing...',
                class: { border: disabled },
                flat: disabled,
                autoGrow: true,
                rows: 3,
                disabled,
              }"
              @remove="extra = extra.filter((_, index) => i != index)"
              editable-header
              removable
            >
            </input-field>
          </v-slide-y-transition>
          <v-card-actions v-if="!disabled">
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              outlined
              @click.prevent="extra.push(['Click here to change title', ''])"
            >
              Add extra field
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-tab-item>

        <!-- physicalGeneral -->
        <v-tab-item>
          <v-slide-y-transition
            class="row align-center justify-center mx-0"
            tag="div"
            group
          >
            <input-field
              v-for="(field, i) in physicalGeneral"
              :key="i"
              v-model="field[1]"
              :label.sync="field[0]"
              :textfield="{
                placeholder: disabled ? 'Not Provided' : 'Start Typing...',
                class: { border: disabled },
                flat: disabled,
                disabled,
              }"
              :col="{ sm: 6, md: 4, cols: 12 }"
              @remove="
                physicalGeneral = physicalGeneral.filter(
                  (_, index) => i != index
                )
              "
              :removable="field[2]"
              :editable-header="field[2]"
            >
            </input-field>
            <v-col cols="12" sm="6" md="4" key="add" v-if="!disabled">
              <v-layout fill-height justify-center align-center>
                <v-btn
                  color="primary"
                  @click.prevent="
                    physicalGeneral.push([
                      'Click here to change title',
                      '',
                      true,
                    ])
                  "
                  outlined
                  small
                >
                  Add Extra Field
                </v-btn>
              </v-layout>
            </v-col>
          </v-slide-y-transition>
        </v-tab-item>

        <!-- onExamination -->
        <v-tab-item>
          <v-slide-y-transition
            class="row align-center justify-center mx-0"
            tag="div"
            group
          >
            <input-field
              v-for="(field, i) in onExamination"
              :key="i"
              v-model="field[1]"
              :label.sync="field[0]"
              :textfield="{
                placeholder: disabled ? 'Not Provided' : 'Start Typing...',
                class: { border: disabled },
                flat: disabled,
                disabled,
              }"
              :col="{ sm: 6, md: 4, cols: 12 }"
              @remove="
                onExamination = onExamination.filter((_, index) => i != index)
              "
              :removable="field[2]"
              :editable-header="field[2]"
            >
            </input-field>
            <v-col cols="12" sm="6" md="4" key="add" v-if="!disabled">
              <v-layout fill-height justify-center align-center>
                <v-btn
                  color="primary"
                  @click.prevent="
                    onExamination.push(['Click here to change title', '', true])
                  "
                  outlined
                  small
                >
                  Add Extra Field
                </v-btn>
              </v-layout>
            </v-col>
          </v-slide-y-transition>
        </v-tab-item>

        <!-- Treatment -->
        <v-tab-item>
          <v-menu
            v-model="ui.dateMenu"
            :close-on-content-click="false"
            max-width="290px"
            min-width="290px"
            offset-y
            top
          >
            <template v-slot:activator="{ on }">
              <input-field
                v-model="followupDate"
                :on="disabled ? null : on"
                :value="
                  (followUpModel.nextFollowUpDate &&
                    moment(followUpModel.nextFollowUpDate).format(
                      'Do MMM YYYY'
                    )) ||
                  'Not provided'
                "
                @input="disabled || onChange()"
                label="Next Follow up date"
                :textfield="{
                  autocomplete: 'off',
                  prependInnerIcon: ' mdi-calendar-refresh-outline',
                  class: { border: disabled },
                  flat: disabled,
                  readonly: true,
                  clearable: true,
                  disabled,
                }"
              ></input-field>
            </template>
            <v-card>
              <v-date-picker
                class="elevation-0"
                ref="datePicker"
                color="primary"
                :value="followUpModel.nextFollowUpDate"
                :min="moment().format('YYYY-MM-DD')"
                no-title
              ></v-date-picker>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed text small @click="ui.dateMenu = false">
                  cancel
                </v-btn>
                <v-btn
                  color="primary"
                  depressed
                  small
                  @click="
                    followUpModel.nextFollowUpDate = $refs.datePicker.inputDate;
                    ui.dateMenu = false;
                  "
                >
                  ok
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
          <v-divider class="mt-5"></v-divider>

          <input-field
            @input="disabled || onChange()"
            field="v-textarea"
            v-model="followUpModel.treatment.diagnosis"
            label="Diagnosis"
            :textfield="{
              placeholder: disabled ? 'Not Provided' : 'Start Typing...',
              class: { border: disabled },
              flat: disabled,
              disabled,
              rows: 3,
              autoGrow: true,
            }"
          >
          </input-field>

          <input-field
            v-if="ui.parallelTreatment"
            @input="disabled || onChange()"
            field="v-textarea"
            v-model="followUpModel.treatment.parallelTreatment"
            label="Parallel Treatment"
            :textfield="{
              placeholder: disabled ? 'Not Provided' : 'Start Typing...',
              class: { border: disabled },
              flat: disabled,
              disabled,
              rows: 3,
              autoGrow: true,
            }"
          >
          </input-field>
          <div v-else class="my-3 mx-5 text-right">
            <a @click="ui.parallelTreatment = true">+ Parallel Treatment</a>
          </div>
          <v-card-title class="title pb-0">
            <v-divider></v-divider>
            <span class="px-3 mb-1">Drugs</span>
            <v-divider></v-divider>
          </v-card-title>
          <v-alert
            v-if="!followUpModel.treatment.drugs.length"
            type="info"
            dense
            outlined
            class="mx-3 mt-4"
          >
            Click '<b>ADD</b>' to add drugs
          </v-alert>
          <v-alert v-else-if="disabled" type="warning" dense class="mx-3 mt-4">
            No drugs were given
          </v-alert>
          <v-slide-y-transition group>
            <div
              v-for="(drug, i) in followUpModel.treatment.drugs"
              :key="i"
              class="border rounded pb-3 mb-2"
            >
              <v-layout class="pt-2 pl-5">
                <span class="text--primary font-weight-bold">
                  Drug #{{ i + 1 }}
                </span>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="!disabled"
                  color="error"
                  text
                  x-small
                  @click="
                    followUpModel.treatment.drugs = followUpModel.treatment.drugs.filter(
                      (_, index) => index != i
                    );
                    onChange();
                  "
                >
                  <v-icon small>mdi-close</v-icon> remove
                </v-btn>
              </v-layout>
              <v-row class="mx-0 align-center justify-center">
                <input-field
                  @input="disabled || onChange()"
                  v-model="drug.name"
                  field="v-autocomplete"
                  label="Name"
                  :textfield="{
                    items: drugs,
                    clearable: true,
                    autocomplete: 'false',
                    dense: true,
                    class: { border: disabled },
                    flat: disabled,
                    disabled,
                  }"
                  :col="{ cols: 6, md: 4 }"
                  :required="!disabled"
                >
                </input-field>
                <input-field
                  @input="disabled || onChange()"
                  v-model="drug.potency"
                  label="Potency"
                  :textfield="{
                    class: { border: disabled },
                    flat: disabled,
                    disabled,
                    dense: true,
                  }"
                  :col="{ cols: 6, md: 2 }"
                  :required="!disabled"
                >
                </input-field>
                <input-field
                  @input="disabled || onChange()"
                  v-model="drug.dosage"
                  field="v-select"
                  label="Dosage"
                  :textfield="{
                    items: ['OA', 'BD', 'TDS', 'QDS', 'PID'],
                    dense: true,
                    class: { border: disabled },
                    flat: disabled,
                    disabled,
                  }"
                  :col="{ cols: 6, md: 2 }"
                >
                </input-field>
                <input-field
                  @input="disabled || onChange()"
                  v-model="drug.duration"
                  field="v-slider"
                  :label="`Duration: ${drug.duration} day(s)`"
                  :textfield="{
                    max: 30,
                    min: 1,
                    dense: true,
                    thumbLabel: true,
                    flat: disabled,
                    disabled,
                  }"
                  :col="{ cols: 6, md: 4 }"
                >
                </input-field>
              </v-row>
            </div>
          </v-slide-y-transition>
          <v-card-actions v-if="!disabled" class="mt-3">
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="followUpModel.treatment.drugs.push({ id: drugId++ })"
              small
              outlined
            >
              Add
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
    <v-footer app inset v-if="ui.saving || ui.saved" class="grey darken-2" dark>
      <v-spacer></v-spacer>
      <v-progress-circular
        indeterminate
        color="#ffffffaf"
        v-if="ui.saving"
        size="12"
        width="2"
      ></v-progress-circular>
      <span class="mx-3">{{ ui.saving ? "Saving..." : "Saved" }} </span>
    </v-footer>
  </v-sheet>
</template>

<script>
import { clone, isEqual } from "../modules/object";
import { sortBy } from "../modules/list";
import { makeRequest } from "../modules/request";
import drugs from "@/json/drugs.json";
import moment from "moment";

export default {
  props: {
    patient: Object,
    followUp: Object,
    disabled: { default: false, type: Boolean },
  },
  data: () => ({
    drugs,
    drugId: 1,
    followUpModel: {
      treatment: {
        drugs: [],
      },
      nextFollowUpDate: null,
    },

    extra: [],
    criteria: [],

    physicalGeneral: [
      ["Hunger", ""],
      ["Appetite", ""],
      ["Craving", ""],
      ["Aversion", ""],
      ["Thirst", ""],
      ["Stool", ""],
      ["Urine", ""],
      ["Habit", ""],
      ["Sleep", ""],
      ["Dream", ""],
    ],
    onExamination: [
      ["BP", ""],
      ["CNS", ""],
      ["CVS", ""],
      ["Chest", ""],
      ["Eyes", ""],
      ["Nose", ""],
      ["Per-abdomin", ""],
      ["Pulse", ""],
      ["Skin", ""],
      ["Weight", ""],
      ["Mouth", ""],
      ["Tongue", ""],
      ["Pallor", ""],
      ["Sclera", ""],
      ["Joints", ""],
      ["Height", ""],
      ["Lymph-node", ""],
    ],

    ui: {
      tabs: [
        { icon: "mdi-star-circle-outline", text: "Chief chiefComplain" },
        { icon: "mdi-human", text: "Physical General" },
        { icon: "mdi-card-text", text: "On Examination" },
        { icon: "mdi-pill", text: "Treatment" },
      ],
      parallelTreatment: false,
      tab: 0,
      saveDelayTimerId: null,
      saveBadgeTimerId: null,
      dateMenu: false,
      saving: false,
      saved: false,
    },
  }),
  computed: {
    followupDate: {
      get() {
        return (
          this.followUpModel.nextFollowUpDate &&
          moment(this.followUpModel.nextFollowUpDate).format("YYYY-MM-DD")
        );
      },
      set(v) {
        this.followUpModel.nextFollowUpDate = v;
      },
    },
  },
  watch: {
    "ui.saving"(a) {
      this.$emit("saving", a);
    },
    "ui.saved"(a) {
      this.$emit("saved", a);
    },
    extra(a) {
      this.followUpModel.extra = {};
      a.forEach((entry) => (this.followUpModel.extra[entry[0]] = entry[1]));
      this.onChange();
    },
    criteria(a) {
      this.followUpModel.criteria = {};
      a.forEach((entry) => (this.followUpModel.criteria[entry[0]] = entry[1]));
      this.onChange();
    },
    physicalGeneral(a) {
      this.followUpModel.physicalGeneral = {};
      a.forEach(
        (entry) => (this.followUpModel.physicalGeneral[entry[0]] = entry[1])
      );
      this.onChange();
    },
    onExamination(a) {
      this.followUpModel.onExamination = {};
      a.forEach(
        (entry) => (this.followUpModel.onExamination[entry[0]] = entry[1])
      );
      this.onChange();
    },
    // "followUpModel.treatment.drugs"(a) {
    //   this.onChange();
    // },
  },
  methods: {
    onChange() {
      if (this.disabled) return;

      let setTimer = () => {
        if (this.ui.saveDelayTimerId) clearTimeout(this.ui.saveDelayTimerId);

        this.ui.saveDelayTimerId = setTimeout(() => {
          if (this.ui.saving) setTimer();
          else this.save();
        }, 1000);
      };

      setTimer();
    },
    save() {
      if (isEqual(this.followUpModel, this.followUp)) return;

      if (this.ui.saving) return;
      this.ui.saving = true;
      this.ui.saved = false;

      let method, data;
      if (this.followUpModel._id) {
        data = {
          id: this.followUpModel._id,
        };

        for (const key in this.followUpModel) {
          if (this.followUpModel.hasOwnProperty(key)) {
            const element = this.followUpModel[key];
            if (!isEqual(element, this.followUp[key])) data[key] = element;
          }
        }

        method = "put";
        delete data.updatedAt;
      } else {
        data = clone(this.followUpModel);
        data.id = this.patient._id;
        method = "post";
      }

      makeRequest(method, "followUp", data)
        .then(({ data }) => {
          this.followUpModel = clone(data);

          if (data.nextFollowUpDate)
            this.$store.commit("addEvent", {
              _id: this.patient._id,
              followUpId: data._id,
              name: this.patient.fullname,
              date: data.nextFollowUpDate,
            });

          this.$emit("update:followUp", data);

          this.$nextTick(() => {
            this.ui.saving = false;
            this.ui.saved = true;
            if (this.ui.saveBadgeTimerId)
              clearTimeout(this.ui.saveBadgeTimerId);
            this.ui.saveBadgeTimerId = setTimeout(
              () => (this.ui.saved = false),
              1200
            );
          });
        })
        .catch((err) => {
          this.ui.saving = false;
          this.ui.saved = false;
          this.errorHandler(err);
        });
    },
  },
  destroyed() {
    if (this.ui.saveBadgeTimerId) clearTimeout(this.ui.saveBadgeTimerId);
    if (this.ui.saveDelayTimerId) clearTimeout(this.ui.saveDelayTimerId);
  },
  mounted() {
    if (this.followUp) {
      this.followUpModel = clone(this.followUp);
      this.ui.parallelTreatment = !!this.followUp.treatment.parallelTreatment;

      ["onExamination", "criteria", "extra", "physicalGeneral"].forEach(
        (ev) => {
          if (this.followUpModel[ev]) {
            let indexNameMap = {};
            for (let i = 0; i < this[ev].length; i++) {
              const element = this[ev][i];
              indexNameMap[element[0]] = i;
            }

            for (const key in this.followUpModel[ev]) {
              if (this.followUpModel[ev].hasOwnProperty(key)) {
                const element = this.followUpModel[ev][key];
                if (typeof indexNameMap[key] == "number") {
                  this[ev][indexNameMap[key]][1] = element;
                } else {
                  this[ev].push([key, element, true]);
                }
              }
            }
          }

          this[ev] = this[ev].sort(sortBy(0));
        }
      );
    }
  },
};
</script>

<style></style>
