span<template>
  <v-container fluid class="pb-12 mb-12">
    <template v-if="investigationsModel.length">
      <v-card class="mb-8">
        <v-tabs class="grey lighten-4" :vertical="$vuetify.breakpoint.mdAndUp">
          <template v-for="report in investigationsModel">
            <v-tab :key="report.name + '-header'">
              <v-list-item class="text-left">
                <v-list-item-content>
                  <v-list-item-title>
                    <span class="mr-1" v-html="report.name"> </span>
                    <v-avatar
                      v-if="!!report.entries.find((ev) => ev.edit)"
                      color="white"
                      size="12"
                    >
                      <v-icon color="primary" x-small>mdi-circle</v-icon>
                    </v-avatar>
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="report.entries[0]">
                    <small>
                      {{
                        moment(report.entries[0].reportDate).format(
                          "Do MMM YYYY"
                        )
                      }}
                    </small>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action v-if="$vuetify.breakpoint.mdAndUp">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-action>
              </v-list-item>
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
                        v-model="entry.reportDate"
                        :ref="'input-' + entry._id"
                        class="mx-3"
                        type="date"
                      />
                      <b v-else class="mx-3">
                        {{
                          moment(entry.reportDate).format("ddd, Do MMM YYYY")
                        }}
                      </b>
                      <v-btn
                        v-if="entry.edit"
                        @click="
                          (entry.changeDate = !entry.changeDate) &&
                            $nextTick(() =>
                              $refs['input-' + entry._id][0].focus()
                            )
                        "
                        :color="entry.changeDate ? 'primary' : ''"
                        outlined
                        small
                        icon
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
                        @click="
                          report.entries = report.entries.filter(
                            (ev) => ev._id != entry._id
                          );
                          emitUpdate();
                        "
                        icon
                      >
                        <v-icon> mdi-close-circle </v-icon>
                      </v-btn>
                      <v-btn
                        color="primary"
                        @click="(entry.edit = !entry.edit) || emitUpdate()"
                        icon
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
                          }"
                        ></input-field>
                        <span
                          v-else
                          v-html="entry.value || 'Not provided'"
                          :class="{ 'text--secondary': !entry.value }"
                          class="border-left-bold border-primary text--primary px-3 body-1"
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
                              v-html="head"
                              v-once
                              :key="head"
                            ></th>
                          </tr>
                          <template
                            v-for="(row, i) in report.format.rows"
                            v-once
                          >
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
      <v-btn
        color="primary"
        class="ma-5"
        @click="$refs.createDialog.open()"
        bottom
        fixed
        right
        fab
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card v-else max-width="540" class="mx-auto">
      <no-investigation-illustration
        @click:create="$refs.createDialog.open()"
      ></no-investigation-illustration>
    </v-card>
    <investigation-dialog
      ref="createDialog"
      :investigations.sync="investigationsModel"
    ></investigation-dialog>
  </v-container>
</template>

<script>
import moment from "moment";
import mongoObjectId from "@/utils/mongoObjectId";
import InvestigationDialog from "@/components/app/widgets/InvestigationDialog";
import NoInvestigationIllustration from "@/components/NoInvestigationIllustration";

export default {
  components: { InvestigationDialog, NoInvestigationIllustration },
  props: { investigations: Array, default: () => [] },
  data() {
    return { investigationsModel: [...this.investigations] };
  },
  watch: {
    investigationsModel() {
      this.emitUpdate();
    },
  },
  methods: {
    addEntry(report) {
      report.entries = [
        {
          _id: mongoObjectId(),
          reportDate: moment().format("YYYY-MM-DD"),
          values: typeof report.format == "string" ? "" : {},
          edit: true,
          changeDate: false,
        },
        ...report.entries,
      ];
    },
    emitUpdate() {
      this.$emit("update:investigations", this.investigationsModel);
    },
    removeReport(indexToRemove) {
      this.investigationsModel = this.investigationsModel.filter(
        (_, i) => i != indexToRemove
      );
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
