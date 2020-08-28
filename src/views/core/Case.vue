<template>
  <v-skeleton-loader :loading="ui.loading" type="actions, article">
    <template v-if="patient">
      <v-tabs-items v-model="ui.tab">
        <v-tab-item v-for="(caseTab, i) in caseTabs" :key="i">
          <component
            :is="caseTab.component"
            v-bind="caseTab.props"
            :active="i == ui.tab"
            :patient.sync="patient"
            @changed="(a) => $refs.sideDrawer.markChanged(i, a)"
          ></component>
        </v-tab-item>

        <v-tab-item>
          <woi></woi>
        </v-tab-item>
      </v-tabs-items>

      <case-side-drawer
        ref="sideDrawer"
        v-model="ui.sideDrawer"
        :tab.sync="ui.tab"
        :follow-up-id="followUpId"
        :follow-up-tab.sync="ui.followUpTab"
        :patient="patient"
      ></case-side-drawer>
      <v-btn
        v-if="!ui.sideDrawer"
        color="primary"
        bottom
        fixed
        right
        fab
        @click="ui.sideDrawer = !ui.sideDrawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </template>

    <v-container v-else>
      <v-sheet max-width="480" class="mx-auto my-8 transparent">
        <v-card>
          <v-card-text>
            <v-layout align-center justify-center column>
              <v-img src="/img/swr.png" height="156" contain></v-img>
              <p>{{ ui.error || "Something went wrong" }}</p>
              <v-card-actions>
                <v-btn color="primary" @click="getPatient">Try Again</v-btn>
              </v-card-actions>
            </v-layout>
          </v-card-text>
        </v-card>
        <v-btn text class="mt-8" block @click="$router.go(-1)">Go Back</v-btn>
      </v-sheet>
    </v-container>
  </v-skeleton-loader>
</template>

<script>
import { errorHandler } from "@pranavraut033/js-utils";
import CaseSideDrawer from "@/components/app/widgets/Case/CaseSideDrawer";

import Patient from "@/models/Patient";

export default {
  components: {
    CaseSideDrawer,
    CaseTabMind: () => import("@/components/app/widgets/Case/CaseTabMind"),
    CaseTabInvestigation: () =>
      import("@/components/app/widgets/Case/CaseTabInvestigation"),
    CaseTabPatientHistory: () =>
      import("@/components/app/widgets/Case/CaseTabPatientHistory"),
    CaseTabFollowUp: () =>
      import("@/components/app/widgets/Case/CaseTabFollowUp"),
  },
  props: {
    patientId: { type: String, required: true },
    followUpId: { type: String, default: null },
  },
  data() {
    return {
      patient: null,
      intitalCaseState: null,

      ui: {
        tab: 2,
        followUpTab: 0,
        error: "",
        loading: false,
        ready: false,
        sideDrawer: true,
      },
    };
  },

  computed: {
    caseTabs() {
      return [
        { component: "CaseTabMind" },
        { component: "CaseTabPatientHistory" },
        {
          component: "CaseTabFollowUp",
          props: {
            followUpId: this.followUpId,
            followUpTab: this.ui.followUpTab,
          },
        },
        { component: "CaseTabInvestigation" },
      ];
    },
  },
  watch: {
    patientId() {
      this.getPatient();
    },
  },
  mounted() {
    this.getPatient();
  },
  destroyed() {
    this.$store.dispatch("app/hideExtension");
  },
  methods: {
    getPatient() {
      const self = this;

      if (this.ui.loading) return;
      this.ui.ready = false;
      this.ui.loading = true;

      this.$nextTick(() => {
        self.patient = null;
        self
          .makeRequest("get", "case", { id: self.patientId })
          .then(({ data }) => {
            self.patient = new Patient(data);
            self.intitalCaseState = new Patient(data);
          })
          .catch((err) => {
            self.ui.error = errorHandler(err);
            self.errorHandler(self.ui.error);
          })
          .finally(() => {
            self.ui.loading = false;
            self.ui.ready = true;
          });
      });
    },
  },
};
</script>

<style lang="scss">
.badge {
  background: var(--v-primary-base);
  padding: 0.25rem 0.5rem;
  font-size: 10pt;
  margin: 1rem;
  color: white;
  border-radius: 4px;
}
.v-tabs-items {
  background: transparent !important;
}

.save-badge {
  @extend .badge;
  opacity: 1;
  background: #bdbdbd !important ;
  white-space: nowrap;
  transition: opacity 3500ms cubic-bezier(0.19, 1, 0.22, 1);
  &.saved {
    animation: fade-out 3200ms cubic-bezier(0.215, 0.61, 0.355, 1) both;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.slider {
  border: none;
  height: 3.5px !important;
  margin-top: -1px;
  background: var(--v-primary-base) !important;
  border-radius: 3px 3px 0 0;
}
</style>
