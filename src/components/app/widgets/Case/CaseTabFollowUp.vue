<template>
  <tab-item
    ref="container"
    :updates="updates"
    :param-id="followUp.new ? patient._id : followUp._id || patient._id"
    :method="followUp.new ? 'post' : 'put'"
    :loading.sync="ui.saveLoading"
    path="followUp"
    hide-actions
    @saved="saved"
    @cancel="reset"
    @changed:updates="(a) => $emit('changed', a)"
  >
    <portal to="appbar-extension">
      <v-toolbar v-if="followUpId" dense flat color="transparent">
        <v-app-bar-nav-icon
          @click="$router.replace(`/app/case/${patient._id}`)"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title>
          {{ moment(initialState.createdAt).format("Do MMM YYYY") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn v-if="anyUpdates" class="mx-3" small outlined @click="reset">
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!anyUpdates || ui.saveLoading"
          :loading="ui.saveLoading"
          small
          @click="$refs.container.save()"
        >
          Save
        </v-btn>
      </v-toolbar>
      <v-toolbar v-else dense flat color="transparent">
        <v-app-bar-nav-icon to="/app/patients/">
          <v-icon>mdi-arrow-left</v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title>
          Followups
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn class="mx-3" small outlined @click="addFollowUp">
          New Follow Up
        </v-btn>
      </v-toolbar>
    </portal>
    <v-card v-if="followUpId" color="transparent" flat>
      <v-form ref="form" lazy-validation>
        <v-skeleton-loader :loading="ui.loading" type="table">
          <v-card-text>
            <v-tabs-items v-model="followUpTabModel">
              <v-tab-item>
                <input-field
                  v-model="followUp.chiefComplain"
                  label="Cheif Complain"
                  field="v-textarea"
                  :textfield="{
                    placeholder: 'Complain by patient..',
                    autoGrow: true,
                    rows: 4,
                  }"
                  required
                ></input-field>
                <input-field
                  v-if="patient && patient.gender == 'female'"
                  v-model="followUp.femaleComplain"
                  label="Female Complain"
                  field="v-textarea"
                  :textfield="{
                    placeholder: 'Complain by patient..',
                    autoGrow: true,
                    rows: 3,
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
                      placeholder: field[3] || 'Start Typing...',
                    }"
                    editable-header
                    removable
                    @remove="
                      criteria = criteria.filter((_, index) => i != index)
                    "
                  >
                  </input-field>
                  <v-col key="add" cols="12" sm="6" md="4">
                    <v-layout fill-height justify-center align-center>
                      <v-btn
                        color="primary"
                        outlined
                        small
                        @click.prevent="
                          criteria.push(['Click here to change title', ''])
                        "
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
                    v-model="field[1]"
                    field="v-textarea"
                    :label.sync="field[0]"
                    :textfield="{
                      placeholder: field[3] || 'Start Typing...',

                      autoGrow: true,
                      rows: 3,
                    }"
                    editable-header
                    removable
                    @remove="extra = extra.filter((_, index) => i != index)"
                  >
                  </input-field>
                </v-slide-y-transition>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    outlined
                    @click.prevent="
                      extra.push(['Click here to change title', ''])
                    "
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
                      placeholder: field[3] || 'Start Typing...',
                    }"
                    :col="{ sm: 6, md: 4, cols: 12 }"
                    :removable="field[2]"
                    :editable-header="field[2]"
                    @remove="
                      physicalGeneral = physicalGeneral.filter(
                        (_, index) => i != index
                      )
                    "
                  >
                  </input-field>
                  <v-col key="add" cols="12" sm="6" md="4">
                    <v-layout fill-height justify-center align-center>
                      <v-btn
                        color="primary"
                        outlined
                        small
                        @click.prevent="
                          physicalGeneral.push([
                            'Click here to change title',
                            '',
                            true,
                          ])
                        "
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
                      placeholder: field[3] || 'Start Typing...',
                    }"
                    :col="{ sm: 6, md: 4, cols: 12 }"
                    :removable="field[2]"
                    :editable-header="field[2]"
                    @remove="
                      onExamination = onExamination.filter(
                        (_, index) => i != index
                      )
                    "
                  >
                  </input-field>
                  <v-col key="add" cols="12" sm="6" md="4">
                    <v-layout fill-height justify-center align-center>
                      <v-btn
                        color="primary"
                        outlined
                        small
                        @click.prevent="
                          onExamination.push([
                            'Click here to change title',
                            '',
                            true,
                          ])
                        "
                      >
                        Add Extra Field
                      </v-btn>
                    </v-layout>
                  </v-col>
                </v-slide-y-transition>
              </v-tab-item>

              <!--  Treatment -->
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
                      v-model="followUpDate"
                      :value="
                        (followUp.nextFollowUpDate &&
                          moment(followUp.nextFollowUpDate).format(
                            'Do MMM YYYY'
                          )) ||
                        'Not provided'
                      "
                      label="Next Follow up date"
                      :textfield="{
                        autocomplete: 'off',
                        prependInnerIcon: ' mdi-calendar-refresh-outline',

                        readonly: true,
                        clearable: true,
                      }"
                      v-on="on"
                    ></input-field>
                  </template>
                  <v-card>
                    <v-date-picker
                      ref="datePicker"
                      class="elevation-0"
                      color="primary"
                      :value="followUp.nextFollowUpDate"
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
                          followUp.nextFollowUpDate =
                            $refs.datePicker.inputDate;
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
                  v-model="followUp.treatment.diagnosis"
                  field="v-textarea"
                  label="Diagnosis"
                  :textfield="{
                    placeholder: 'Start Typing...',
                    rows: 3,
                    autoGrow: true,
                  }"
                >
                </input-field>

                <input-field
                  v-if="ui.parallelTreatment"
                  v-model="followUp.treatment.parallelTreatment"
                  field="v-textarea"
                  label="Parallel Treatment"
                  :textfield="{
                    placeholder: 'Start Typing...',
                    rows: 3,
                    autoGrow: true,
                  }"
                >
                </input-field>
                <div v-else class="my-3 mx-5 text-right">
                  <a @click="ui.parallelTreatment = true">
                    + Parallel Treatment
                  </a>
                </div>
                <v-card-title class="title pb-0">
                  <v-divider></v-divider>
                  <span class="px-3 mb-1">Drugs</span>
                  <v-divider></v-divider>
                </v-card-title>

                <template v-if="!followUp.treatment.drugs.length">
                  <v-alert type="info" dense outlined class="mx-3 mt-4">
                    Click <b>ADD</b> to add drugs
                  </v-alert>
                </template>

                <v-slide-y-transition group>
                  <div
                    v-for="(drug, i) in followUp.treatment.drugs"
                    :key="i"
                    class="border rounded pb-3 mb-2"
                  >
                    <v-layout class="pt-2 pl-5">
                      <span class="text--primary font-weight-bold">
                        Drug #{{ i + 1 }}
                      </span>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="error"
                        text
                        x-small
                        @click="
                          followUp.treatment.drugs = followUp.treatment.drugs.filter(
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
                        v-model="drug.name"
                        field="v-autocomplete"
                        label="Name"
                        :textfield="{
                          items: drugs,
                          clearable: true,
                          autocomplete: 'false',
                          dense: true,
                        }"
                        :col="{ cols: 6, md: 4 }"
                      >
                      </input-field>
                      <input-field
                        v-model="drug.potency"
                        label="Potency"
                        :textfield="{
                          dense: true,
                        }"
                        :col="{ cols: 6, md: 2 }"
                      >
                      </input-field>
                      <input-field
                        v-model="drug.dosage"
                        field="v-combobox"
                        label="Dosage"
                        :textfield="{
                          items: ['OA', 'BD', 'TDS', 'QDS', 'PID', 'SOS'],
                          dense: true,
                        }"
                        :col="{ cols: 6, md: 6 }"
                      >
                      </input-field>
                      <input-field
                        v-if="false"
                        v-model="drug.duration"
                        field="v-slider"
                        :label="`Duration: ${drug.duration} day(s)`"
                        :textfield="{
                          max: 30,
                          min: 1,
                          dense: true,
                          thumbLabel: true,
                        }"
                        :col="{ cols: 6, md: 4 }"
                      >
                      </input-field>
                    </v-row>
                  </div>
                </v-slide-y-transition>
                <v-card-actions class="mt-3">
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    small
                    outlined
                    @click="followUp.treatment.drugs.push({ id: drugId++ })"
                  >
                    Add
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-tab-item>
              <!-- fees -->
              <v-tab-item> <woi></woi></v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-skeleton-loader>
      </v-form>
    </v-card>
    <v-card v-else>
      <v-list v-if="patient.case.followUps.length">
        <v-list-item
          v-for="f in patient.case.followUps"
          :key="f._id"
          :to="`/app/case/${patient._id}/${f._id}`"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ moment(f.createdAt).format("Do MMM YYYY") }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ f.treatment.drugs.map(({ name }) => name).join(", ") }}
            </v-list-item-subtitle>
            <v-list-item-subtitle v-if="isMobile">
              {{ f.treatment.diagnosis }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action v-if="!isMobile" class="mx-3">
            <v-list-item-action-text>
              {{ f.treatment.diagnosis }}
            </v-list-item-action-text>
          </v-list-item-action>
          <v-list-item-action v-if="f.isToday">
            <v-chip class="primary" label small>Today</v-chip>
          </v-list-item-action>
          <v-list-item-action>
            <v-icon>mdi-chevron-right</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <no-follow-up-illustration
        v-else
        @click:create="addFollowUp"
      ></no-follow-up-illustration>
    </v-card>
  </tab-item>
</template>

<script>
import moment from "moment";
import drugs from "@/json/drugs.json";
import Patient from "@/models/Patient";

import { sortBy } from "@pranavraut033/js-utils/utils/list";
import {
  changedFields,
  isEmpty,
  clone,
} from "@pranavraut033/js-utils/utils/object";
import FollowUp from "@/models/FollowUp";
import mongoObjectId from "@/utils/mongoObjectId";
import NoFollowUpIllustration from "@/components/NoFollowUpIllustration";
import TabItem from "./TabItem";

export default {
  components: { TabItem, NoFollowUpIllustration },
  props: {
    patient: { type: Object, required: true },
    followUpId: { type: String, default: null },
    followUpTab: { type: Number, default: 0 },
    active: Boolean,
  },
  data() {
    return {
      drugs,
      drugId: 1,
      followUp: new FollowUp(),
      initialState: new FollowUp(),
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
      followUpTabModel: this.followUpTab,

      ui: {
        parallelTreatment: false,
        dateMenu: false,
        loading: true,
        saveLoading: false,
      },
    };
  },
  computed: {
    updates() {
      return changedFields(this.initialState, this.followUp);
    },
    anyUpdates() {
      return !isEmpty(this.updates);
    },
    followUpDate: {
      get() {
        return (
          this.followUp.nextFollowUpDate &&
          moment(this.followUp.nextFollowUpDate).format("YYYY-MM-DD")
        );
      },
      set(v) {
        this.followUp.nextFollowUpDate = v;
      },
    },
  },
  watch: {
    patient() {
      this.reset();
    },
    followUpId() {
      this.reset();
      this.manageExtension();
    },
    extra(a) {
      const extra = {};
      a.forEach(([key, value]) => (extra[key] = value));
      this.followUp.extra = extra;
    },
    criteria(a) {
      const criteria = {};
      a.forEach(([key, value]) => (criteria[key] = value));
      this.followUp.criteria = criteria;
    },
    physicalGeneral(a) {
      const physicalGeneral = {};
      a.forEach(([key, value]) => (physicalGeneral[key] = value));
      this.followUp.physicalGeneral = physicalGeneral;
    },
    onExamination(a) {
      const onExamination = {};
      a.forEach(([key, value]) => (onExamination[key] = value));
      this.followUp.onExamination = onExamination;
    },
    followUpTabModel(a) {
      this.$emit("update:followUpTab", a);
    },
    followUpTab(a) {
      this.followUpTabModel = a;
    },
    active() {
      this.manageExtension();
    },
  },
  mounted() {
    this.reset();
    this.manageExtension();
  },

  methods: {
    manageExtension() {
      if (this.active) this.$store.dispatch("app/showExtension");
      else this.$store.dispatch("app/hideExtension");
    },
    reset() {
      this.ui.loading = true;
      const _case = this.patient.case;
      Object.assign(this.$data, this.$options.data.call(this));
      let followUp;

      if (this.followUpId && this.followUpId !== "__blank") {
        followUp = _case.followUps.find(({ _id }) => this.followUpId === _id);
        if (!followUp) {
          this.$router.push(`/app/case/${this.patient._id}`);
          return;
        }
      } else {
        const latestFollowUp = _case.followUps[0];
        followUp = new FollowUp(latestFollowUp, true);
      }

      this.ui.parallelTreatment = !!followUp.treatment.parallelTreatment;

      ["onExamination", "criteria", "extra", "physicalGeneral"].forEach(
        (key) => {
          const temp = clone(this[key]);

          if (followUp[key]) {
            const indexNameMap = {};
            temp.forEach(([k], i) => (indexNameMap[k] = i));

            Object.keys(followUp[key]).forEach((subKey) => {
              const value = followUp[key][subKey];
              const placeHolder =
                followUp[`old-${key}`] && followUp[`old-${key}`][subKey];

              if (typeof indexNameMap[subKey] === "number") {
                temp[indexNameMap[subKey]][1] = value;
                temp[indexNameMap[subKey]][3] = placeHolder;
              } else temp.push([subKey, value, true, placeHolder]);
            });
          }

          this[key] = temp.sort(sortBy(0));
        }
      );

      this.followUp = new FollowUp(followUp);
      this.initialState = new FollowUp(followUp);
      this.followUp._id = this.followUp._id || mongoObjectId();
      this.$nextTick(() => (this.ui.loading = false));
    },
    saved() {
      const patient = new Patient(this.patient);

      if (this.followUp._id) {
        const index = patient.case.followUps.findIndex(
          ({ _id }) => this.followUp._id === _id
        );

        if (~index) patient.case.followUps[index] = new FollowUp(this.followUp);
        else patient.case.followUps.push(new FollowUp(this.followUp));
      } else patient.case.followUps.push(new FollowUp(this.followUp));

      this.$emit("update:patient", new Patient(patient));

      this.$nextTick(() => {
        if (this.followUpId === "__blank") {
          this.$router.push(
            `/app/case/${this.patient._id}/${this.followUp._id}`
          );
        }
      });
    },
    addFollowUp() {
      this.$router.push(`/app/case/${this.patient._id}/__blank`);
    },
  },
};
</script>

<style></style>
