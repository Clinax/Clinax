<template>
  <tab-item
    ref="container"
    :updates="updates"
    :param-id="patient._id"
    :method="patient.case.new ? 'post' : 'put'"
    hide-actions
    @saved="saved"
    @cancel="reset"
    @changed:updates="(a) => $emit('changed', a)"
  >
    <v-card v-if="editorVisible">
      <portal to="appbar-extension">
        <v-toolbar dense flat color="transparent">
          <v-btn
            color="primary"
            small
            depressed
            @click="$refs.createDialog.open()"
          >
            Select reports ({{ fields.investigations.length }})
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="anyUpdates" class="mx-3" small outlined @click="reset">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!anyUpdates"
            small
            @click="$refs.container.save()"
          >
            Save
          </v-btn>
        </v-toolbar>
      </portal>
      <v-tabs class="grey lighten-4">
        <template v-for="report in fields.investigations">
          <v-tab :key="report.name + '-header'">
            <v-badge
              color="priamry"
              dot
              :value="!!report.entries.find((ev) => ev.edit)"
            >
              {{ report.name }}
            </v-badge>
          </v-tab>

          <v-tab-item :key="report.name">
            <v-container fluid>
              <v-scale-transition group>
                <v-card
                  v-for="entry in report.entries"
                  :key="entry._id"
                  class="mb-3"
                >
                  <v-subheader>
                    <span v-if="entry.edit">Report Date:</span>
                    <input
                      v-if="entry.edit && entry.changeDate"
                      :ref="'input-' + entry._id"
                      v-model="entry.reportDate"
                      class="mx-3"
                      type="date"
                    />
                    <b v-else class="mx-3">
                      {{ moment(entry.reportDate).format("ddd, Do MMM YYYY") }}
                    </b>
                    <v-btn
                      v-if="entry.edit"
                      :color="entry.changeDate ? 'primary' : ''"
                      outlined
                      small
                      icon
                      @click="
                        (entry.changeDate = !entry.changeDate) &&
                          $nextTick(() =>
                            $refs['input-' + entry._id][0].focus()
                          )
                      "
                    >
                      <v-icon small>
                        {{
                          entry.changeDate
                            ? "mdi-calendar-check"
                            : "mdi-calendar-edit"
                        }}
                      </v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      v-if="entry.edit"
                      class="mx-3"
                      color="error"
                      icon
                      @click="
                        report.entries = report.entries.filter(
                          (ev) => ev._id != entry._id
                        );
                        emitUpdate();
                      "
                    >
                      <v-icon> mdi-close-circle </v-icon>
                    </v-btn>
                    <v-btn
                      color="primary"
                      icon
                      @click="(entry.edit = !entry.edit) || emitUpdate()"
                    >
                      <v-icon>
                        {{ entry.edit ? "mdi-check" : "mdi-pencil" }}
                      </v-icon>
                    </v-btn>
                  </v-subheader>
                  <v-card-text class="pt-0">
                    <template v-if="typeof report.format == 'string'">
                      <input-field
                        v-if="entry.edit"
                        v-model="entry.value"
                        class="pa-0"
                        hide-details
                        field="v-textarea"
                        :textfield="{
                          label: report.name,
                          outlined: true,
                          solo: false,
                          flat: true,
                        }"
                      ></input-field>
                      <span
                        v-else
                        :class="{ 'text--secondary': !entry.value }"
                        class="border-left-bold border-primary text--primary px-3 body-1"
                        v-html="entry.value || 'Not provided'"
                      >
                      </span>
                    </template>
                    <v-simple-table
                      v-else
                      class="stripped-table border rounded"
                      dense
                    >
                      <tbody>
                        <tr>
                          <th
                            v-for="head in report.format.heads"
                            v-once
                            :key="head"
                            v-html="head"
                          ></th>
                        </tr>
                        <template v-for="(row, i) in report.format.rows" v-once>
                          <tr v-if="row.section" :key="i">
                            <th
                              :colspan="report.format.heads.length"
                              v-html="row.section"
                            ></th>
                          </tr>
                          <tr v-else :key="i">
                            <component
                              :is="row.head ? 'th' : 'td'"
                              v-html="row.name"
                            >
                            </component>
                            <td>
                              <v-text-field
                                v-if="entry.edit"
                                v-model="entry.values[row.name]"
                                label="Value"
                                class="ma-1"
                                hide-details
                                single-line
                                dense
                                outlined
                              ></v-text-field>
                              <span
                                v-else
                                class="dashed"
                                v-html="entry.values[row.name] || '&mdash;'"
                              >
                              </span>
                            </td>
                            <td
                              v-for="col in Object.keys(row).filter(
                                (ev) => ev != 'name' && ev != 'head'
                              )"
                              :key="col"
                              class="text-no-wrap"
                              v-html="row[col]"
                            ></td>
                          </tr>
                        </template>
                      </tbody>
                    </v-simple-table>
                  </v-card-text>
                </v-card>
              </v-scale-transition>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="addEntry(report)">
                  Add entry
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-container>
          </v-tab-item>
        </template>
      </v-tabs>
    </v-card>
    <v-card v-else max-width="540" class="mx-auto">
      <no-investigation-illustration
        @click:create="$refs.createDialog.open()"
      ></no-investigation-illustration>
    </v-card>
    <investigation-dialog
      ref="createDialog"
      :investigations.sync="fields.investigations"
    ></investigation-dialog>
  </tab-item>
</template>

<script>
import moment from "moment";
import mongoObjectId from "@/utils/mongoObjectId";
import InvestigationDialog from "@/components/app/widgets/InvestigationDialog";
import NoInvestigationIllustration from "@/components/NoInvestigationIllustration";
import {
  clone,
  changedFields,
  isEmpty,
} from "@pranavraut033/js-utils/utils/object";
import Patient from "@/models/Patient";
import TabItem from "./TabItem";

export default {
  components: { InvestigationDialog, NoInvestigationIllustration, TabItem },
  props: {
    patient: { type: Object, required: true },
    active: Boolean,
  },

  data() {
    return {
      fields: { investigations: [] },
      initialState: { investigations: [] },
    };
  },
  computed: {
    anyUpdates() {
      return !isEmpty(this.updates);
    },
    updates() {
      return changedFields(this.initialState, this.fields);
    },
    editorVisible() {
      return (
        this.fields.investigations.length ||
        this.initialState.investigations.length
      );
    },
  },
  watch: {
    patient() {
      this.reset();
    },
    active() {
      this.manageExtension();
    },
    editorVisible() {
      this.manageExtension();
    },
  },
  mounted() {
    this.reset();
  },
  methods: {
    manageExtension() {
      if (this.active && this.editorVisible)
        this.$store.dispatch("app/showExtension");
      else this.$store.dispatch("app/hideExtension");
    },
    reset() {
      const _case = this.patient.case;
      const fields = { investigations: clone(_case.investigations) };

      this.fields = fields;
      this.initialState = clone(fields);
    },
    saved() {
      const patient = new Patient(this.patient);
      Object.assign(patient.case, this.fields);
      this.$emit("update:patient", patient);
    },
    addEntry(report) {
      report.entries = [
        {
          _id: mongoObjectId(),
          reportDate: moment().format("YYYY-MM-DD"),
          values: typeof report.format === "string" ? "" : {},
          edit: true,
          changeDate: false,
        },
        ...report.entries,
      ];
    },
  },
};
</script>

<style lang="scss">
.stripped-table {
  tr {
    &:first-child,
    th:only-child {
      text-transform: uppercase;
    }

    &:nth-child(2n + 1) {
      background: rgba(0, 0, 0, 0.12) !important;
    }

    th:only-child {
      background: var(--v-accent-base) !important;
    }

    &:first-child {
      background: var(--v-primary-base) !important;
      color: white;
    }
  }
}
</style>
