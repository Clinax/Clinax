<template>
  <v-navigation-drawer v-model="model" right app>
    <v-layout fill-height column>
      <div>
        <patient-dialog
          :patient="patient"
          block
          @update:patient="patientUpdated"
        >
          <template v-slot:activator="{ on }">
            <v-list-item v-on="on">
              <v-list-item-content>
                <v-list-item-title>{{ patient.fullname }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ patient.age }} Years / {{ patient.gender[0] }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <!-- <v-list-item-action> -->
              <!-- <treatment-summary
                  :follow-ups="patient.case.followUps"
                ></treatment-summary> -->
              <!-- </v-list-item-action> -->
            </v-list-item>
          </template>
        </patient-dialog>
      </div>
      <v-divider></v-divider>
      <perfect-scrollbar class="flex-grow-1">
        <v-list dense>
          <template v-for="(tabItem, index) in tabs">
            <v-list-group
              v-if="tabItem.items"
              :key="tabItem.text"
              :prepend-icon="tabItem.icon"
              :value="index == tabModel"
              @click="tabModel = index"
            >
              <template v-slot:activator>
                <v-list-item-title>
                  {{ tabItem.text }}
                  <v-icon v-if="tabStatus[index]" color="primary">
                    mdi-circle-medium
                  </v-icon>
                </v-list-item-title>
              </template>
              <template v-if="!!followUpId">
                <v-divider></v-divider>
                <v-list-item
                  v-for="(tabSubItem, subIndex) in tabItem.items"
                  :key="tabSubItem.text"
                  :class="{ 'v-list-item--active': subIndex == followUpTab }"
                  no-action
                  @click="followUpTabModel = subIndex"
                >
                  <v-list-item-action v-if="tabSubItem.icon" class="mx-4">
                    <v-icon small>
                      {{ tabSubItem.icon }}
                    </v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ tabSubItem.text }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
              </template>
            </v-list-group>
            <v-list-item
              v-else
              :key="tabItem.text"
              :class="{ 'v-list-item--active': index == tabModel }"
              @click="tabModel = index"
            >
              <v-list-item-action v-if="tabItem.icon">
                <v-icon>
                  {{ tabItem.icon }}
                </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ tabItem.text }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action v-if="tabStatus[index]">
                <v-icon color="primary">mdi-circle-medium</v-icon>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
        <template v-if="tabModel == 2">
          <v-divider></v-divider>
          <v-subheader>Followups</v-subheader>
          <v-list dense class="pt-0">
            <v-menu
              v-for="(f, i) in followUpsDateItems"
              :key="f.value"
              :close-on-content-click="false"
              max-height="320"
              open-on-hover
              offset-x
              left
              top
            >
              <template v-slot:activator="{ on }">
                <v-list-item
                  :to="`/app/case/${patient._id}/${f._id}`"
                  v-on="on"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{
                        patient.case.followUps[i] &&
                        patient.case.followUps[i].treatment.diagnosis
                      }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ f.text }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-card>
                <v-layout>
                  <v-col v-if="followUp && followUp._id != f._id">
                    <follow-up-summary-table :follow-up="followUp">
                    </follow-up-summary-table>
                  </v-col>
                  <v-col>
                    <follow-up-summary-table
                      :follow-up="patient.case.followUps[i]"
                    >
                    </follow-up-summary-table>
                  </v-col>
                </v-layout>
              </v-card>
            </v-menu>
          </v-list>
        </template>
      </perfect-scrollbar>
    </v-layout>
  </v-navigation-drawer>
</template>

<script>
// import TreatmentSummary from "@/components/app/widgets/TreatmentSummary";
import FollowUpSummaryTable from "@/components/app/widgets/FollowUpSummaryTable";
import InputModel from "@/components/widgets/InputModel";

export default {
  components: { FollowUpSummaryTable },
  extends: InputModel,
  props: {
    patient: { type: Object, required: true },
    tab: { type: Number, default: 2 },
    followUpTab: { type: Number, default: 0 },
    followUpId: { type: String, default: null },
  },
  data() {
    return {
      tabModel: this.tab,
      followUpTabModel: this.followUpTab,
      tabStatus: [false, false, false, false, false],
    };
  },
  computed: {
    tabs() {
      return [
        { icon: "mdi-brain", text: "Mind", badge: false },
        { icon: "mdi-face", text: " Patient History", badge: false },
        {
          icon: "mdi-folder-account",
          text: "Case",
          badge: false,
          items: [
            { icon: "mdi-star-circle-outline", text: "Chief Complain" },
            { icon: "mdi-human", text: "Physical General" },
            { icon: "mdi-card-text", text: "On Examination" },
            { icon: "mdi-pill", text: "Treatment" },
            { icon: "mdi-receipt", text: "Fees" },
          ],
        },
        {
          icon: "mdi-text-box-search-outline",
          text: `Investigation (${this.patient.case.investigations.length})`,
          badge: false,
        },
        { icon: "mdi-image-multiple-outline", text: "Gallery", badge: false },
      ];
    },
    followUp() {
      if (this.followUpId)
        return this.patient.case.followUps.find(
          ({ _id }) => _id === this.followUpId
        );

      return null;
    },
    followUpsDateItems() {
      return this.patient.case.followUps.map(({ createdAt, _id }, i) => ({
        text: this.moment(createdAt).format("Do MMM YYYY"),
        value: i,
        _id,
      }));
    },
  },
  watch: {
    tabModel(a) {
      this.$emit("update:tab", a);
    },
    tab(a) {
      this.tabModel = a;
    },
    followUpTabModel(a) {
      this.$emit("update:followUpTab", a);
    },
    followUpTab(a) {
      this.followUpTabModel = a;
    },
  },
  methods: {
    markChanged(index, status) {
      this.tabStatus[index] = !!status;
      this.$forceUpdate();
    },
    patientUpdated(...args) {
      this.$emit("update:patient", ...args);
    },
  },
};
</script>

<style></style>
