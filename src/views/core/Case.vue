<template>
  <v-skeleton-loader :loading="ui.loading" type="actions, article">
    <template v-if="patient">
      <portal to="app-bar-extension">
        <patient-dialog
          v-if="$vuetify.breakpoint.xs"
          :patient="patient"
          @update:patient="patientUpdated"
          block
        >
          <template v-slot:activator="{ on }">
            <v-layout class="white px-5 py-2" v-on="on" v-ripple align-center>
              <v-layout class="flex-grow-1">
                <div>
                  <div class="title text-truncate">{{ patient.fullname }}</div>
                  <small>
                    Age and Gender:&ensp;
                    <b class="text-uppercase text-nonospace text-truncate">
                      {{ patient.age }} Years / {{ patient.gender[0] }}
                    </b>
                  </small>
                </div>
              </v-layout>

              <v-toolbar-items class="h-100">
                <v-avatar size="48" v-on="on" v-ripple>
                  <v-img
                    v-if="patient.avatar"
                    class="fullscreen"
                    :src="baseUrl + '/img/' + patient.avatar"
                  ></v-img>
                  <small v-else class="white--text">
                    {{ patient.initials }}
                  </small>
                </v-avatar>
              </v-toolbar-items>
            </v-layout>
          </template>
        </patient-dialog>

        <v-toolbar v-else class="white" dense flat>
          <v-app-bar-nav-icon @click="$router.go(-1)">
            <v-icon>mdi-arrow-left</v-icon>
          </v-app-bar-nav-icon>
          <v-toolbar-items>
            <patient-dialog
              block
              :patient="patient"
              @update:patient="patientUpdated"
            >
              <template v-slot:activator="{ on }">
                <v-btn text v-on="on">
                  {{ patient.fullname }}&ensp;<v-icon color="primary" small>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </template>
            </patient-dialog>
          </v-toolbar-items>

          <v-spacer></v-spacer>
          <span :title="patient.age + ' Years / ' + patient.gender[0]">
            Age and Gender:&ensp;
            <span class="text-uppercase text-nonospace text-no-wrap">
              {{ patient.age }} Years / {{ patient.gender[0] }}
            </span>
          </span>
        </v-toolbar>
        <v-tabs v-model="ui.tab">
          <v-tab v-for="tab in ui.tabs" :key="tab.text">
            <v-icon v-if="tab.icon && $vuetify.breakpoint.smAndUp" class="mr-2">
              {{ tab.icon }}
            </v-icon>
            <small class="text-truncate"> {{ tab.text }} </small>
          </v-tab>
          <v-tabs-slider class="slider"></v-tabs-slider>
        </v-tabs>
        <template v-if="ui.tab == 2">
          <v-divider></v-divider>
          <v-expand-transition>
            <v-subheader class="white" v-if="ui.tab == 2">
              <v-menu right max-height="340" :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" absolute left small depressed>
                    <v-icon>mdi-history</v-icon>
                  </v-btn>
                </template>
                <v-card min-width="320">
                  <template v-for="(f, i) in [...followUps].reverse()">
                    <v-subheader :key="f[0]">{{ f[0] }}</v-subheader>
                    <v-simple-table :key="i" dense>
                      <tbody>
                        <tr v-for="(value, key) in f[1].criteria" :key="key">
                          <th>{{ key }}</th>
                          <td>{{ value }}</td>
                        </tr>
                        <tr class="primary--text">
                          <th>Diagnosis</th>
                          <td>{{ f[1].treatment.diagnosis }}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </template>
                </v-card>
              </v-menu>
              <v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
              <v-sheet max-width="240">
                <v-select
                  v-model="ui.followUpTab"
                  :items="followUpsDateItems"
                  hide-details
                  solo-inverted
                  dense
                  solo
                  flat
                ></v-select>
              </v-sheet>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                title="Previous visit"
                class="mr-12"
                :disabled="ui.followUpTab == 0"
                @click="ui.followUpTab--"
                depressed
                absolute
                x-small
                right
              >
                <v-icon small>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                color="primary"
                title="Next visit"
                :disabled="ui.followUpTab == followUps.length"
                @click="ui.followUpTab++"
                depressed
                absolute
                x-small
                right
              >
                <v-icon small>mdi-chevron-right</v-icon>
              </v-btn>
            </v-subheader>
          </v-expand-transition>
          <v-divider></v-divider>
        </template>
      </portal>
      <v-divider></v-divider>
      <v-container>
        <v-tabs-items v-model="ui.tab">
          <v-tab-item>
            <input-field
              v-model="$data.case.mind"
              @input="onChange"
              label="Mind"
              field="v-textarea"
              :textfield="{
                placeholder: 'Start Typing...',
                autoGrow: true,
                rows: 3,
              }"
            >
            </input-field>
            <input-field
              v-model="$data.case.duringAcute"
              @input="onChange"
              label="During Acute"
              field="v-textarea"
              :textfield="{
                placeholder: 'Start Typing...',
                autoGrow: true,
                rows: 3,
              }"
            >
            </input-field>
          </v-tab-item>
          <v-tab-item>
            <input-field
              v-model="$data.case.pastHistory"
              @input="onChange"
              label="Past History"
              field="v-textarea"
              :textfield="{
                placeholder: 'Start Typing...',
                autoGrow: true,
                rows: 3,
              }"
            >
            </input-field>
            <input-field
              v-model="$data.case.familyHistory"
              @input="onChange"
              label="Family History"
              field="v-textarea"
              :textfield="{
                placeholder: 'Start Typing...',
                autoGrow: true,
                rows: 3,
              }"
            >
            </input-field>
            <input-field
              v-model="$data.case.medicalNote"
              @input="onChange"
              label="Medical note"
              field="v-textarea"
              :textfield="{
                placeholder: 'Start Typing...',
                autoGrow: true,
                rows: 3,
              }"
            >
            </input-field>
          </v-tab-item>
          <v-tab-item>
            <v-card color="grey lighten-4">
              <v-tabs-items v-model="ui.followUpTab">
                <v-tab-item
                  v-for="followUp in followUps"
                  :key="followUp[1]._id"
                >
                  <follow-up
                    :patient="patient"
                    :follow-up="followUp[1]"
                    disabled
                  ></follow-up>
                </v-tab-item>
                <v-tab-item>
                  <follow-up
                    :follow-up.sync="lastFollowUp"
                    :patient="patient"
                  ></follow-up>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
        <saving-alert
          v-bind="{ saving: ui.saving, saved: ui.saved, changed: ui.changed }"
        ></saving-alert>
      </v-container>
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
        <v-btn text @click="$router.go(-1)" class="mt-8" block>Go Back</v-btn>
      </v-sheet>
    </v-container>
  </v-skeleton-loader>
</template>

<script>
import moment from "moment";

import { sortBy } from "@/modules/list";
import { clone, isEqual } from "@/modules/object";
import { makeRequest, errorHandler } from "@/modules/request";

import FollowUp from "@/components/FollowUp";
import SavingAlert from "@/components/SavingAlert";

export default {
  components: { FollowUp, SavingAlert },
  props: { patientId: String },
  data() {
    return {
      patient: null,

      case: {
        mind: "",
        duringAcute: "",
        pastHistory: "",
        familyHistory: "",
        medicalNote: "",
      },
      followUps: [],
      lastFollowUp: null,
      ui: {
        tab: 2,
        error: "",
        loading: false,
        saving: false,
        saved: false,
        changed: false,
        followUpTab: 0,
        tabs: [
          { icon: "mdi-brain", text: "Mind" },
          { icon: "mdi-face", text: " Patient History" },
          { icon: "mdi-folder-account", text: "Case" },
        ],
        saveDelayTimerId: null,
        saveBadgeTimerId: null,
      },
    };
  },
  computed: {
    followUpsDateItems() {
      return [
        ...this.followUps
          .map((ev) => ev[0])
          .map((ev, i) => ({
            text: ev,
            value: i,
          })),
        {
          text: "Today",
          value: this.followUps.length,
        },
      ].reverse();
    },
  },
  methods: {
    onChange() {
      let setTimer = () => {
        if (this.ui.saveDelayTimerId) clearTimeout(this.ui.saveDelayTimerId);

        this.ui.saveDelayTimerId = setTimeout(async () => {
          if (this.ui.saving) {
            setTimer();
          } else {
            await this.save();
            this.ui.changed = false;
          }
        }, 2500);
      };

      this.ui.changed = true;
      setTimer();
    },
    async save() {
      let newCase = clone(this.case);
      let prevCase = clone(this.patient.case);
      delete newCase.followUps;
      delete prevCase.followUps;
      if (isEqual(newCase, prevCase)) return;

      if (this.ui.saving) return;
      this.ui.saving = true;
      this.ui.saved = false;

      let method, body;
      if (newCase._id) {
        body = { id: this.patientId };

        for (const key in newCase) {
          if (newCase.hasOwnProperty(key)) {
            const element = newCase[key];
            if (!isEqual(element, prevCase[key])) body[key] = element;
          }
        }
        method = "put";
      } else {
        body = clone(newCase);
        body.id = this.patientId;
        method = "post";
      }
      try {
        await makeRequest(method, "case", body);

        this.$nextTick(() => {
          this.ui.saving = false;
          this.ui.saved = true;
          if (this.ui.saveBadgeTimerId) clearTimeout(this.ui.saveBadgeTimerId);
          this.ui.saveBadgeTimerId = setTimeout(
            () => (this.ui.saved = false),
            3200
          );
        });
      } catch (err) {
        this.ui.saving = false;
        this.ui.saved = false;
        this.errorHandler(err);
      }
    },
    setHeight() {
      this.$store.state.app.extensionHeight =
        (this.$vuetify.breakpoint.smAndUp ? 96 : 116) +
        (this.ui.tab == 2 ? 48 : 0) +
        1;
    },
    patientUpdated(updates) {
      updates.case = this.patient.case;
      this.patient = updates;
    },
    getPatient() {
      if (this.ui.loading) return;

      this.ui.loading = true;
      makeRequest("get", "case", { id: this.patientId })
        .then(({ data }) => {
          data.case = data.case || {};
          this.patient = data;
          this.ui.loading = false;

          this.$store.state.app.extentedAppBar = true;
          this.setHeight();
        })
        .catch((err) => {
          this.ui.loading = false;
          this.ui.error = errorHandler(err);
          this.errorHandler(this.ui.error);
        });
    },
  },
  watch: {
    "patient.case"(a) {
      if (!a) return;

      this.case = clone(a);

      if (this.case.followUps && this.case.followUps.length > 0) {
        this.case.followUps = this.case.followUps.sort(
          sortBy("createdAt", true)
        );

        let lastFollowUp = clone(this.case.followUps[0]);

        let sameDay =
          moment().format("YYYYMMDD") ==
          moment(lastFollowUp.createdAt).format("YYYYMMDD");

        if (sameDay) {
          this.case.followUps = this.case.followUps.slice(
            1,
            this.case.followUps.length
          );
        } else {
          delete lastFollowUp._id;
          delete lastFollowUp.updatedAt;
        }

        this.followUps = this.case.followUps
          .map((ev) => [moment(ev.createdAt).format("Do MMMM YYYY"), ev])
          .reverse();

        this.ui.followUpTab = this.followUps.length;
        this.lastFollowUp = lastFollowUp;
      }
    },
    patientId() {
      this.patient = null;

      this.case = {
        mind: "",
        duringAcute: "",
        pastHistory: "",
        familyHistory: "",
        medicalNote: "",
      };
      this.followUps = [];
      this.lastFollowUp = null;

      this.getPatient();
    },
    "$vuetify.breakpoint.xs"() {
      this.setHeight();
    },
    "ui.tab"() {
      this.setHeight();
    },
  },
  destroyed() {
    this.$store.state.app.extentedAppBar = false;
    if (this.ui.saveBadgeTimerId) clearTimeout(this.ui.saveBadgeTimerId);
    if (this.ui.saveDelayTimerId) clearTimeout(this.ui.saveDelayTimerId);
  },
  mounted() {
    this.getPatient();
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
