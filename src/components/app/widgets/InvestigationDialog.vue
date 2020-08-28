<template>
  <v-dialog v-model="model" max-width="420" scrollable>
    <v-card>
      <v-card-title>Select report type</v-card-title>
      <v-text-field
        v-model="search"
        label="Search..."
        class="mb-5 mx-5"
        solo-inverted
        hide-details
        single-line
        dense
        solo
        flat
      ></v-text-field>
      <v-card-text>
        <v-scale-transition v-if="avaiableReports.length" group>
          <v-chip
            v-for="report in avaiableReports"
            :key="report.name"
            color="primary"
            class="ma-1"
            outlined
            label
            :disabled="report.disabled"
            :close="report.remove"
            @click:close="removeField(report.name)"
            @click="addField(report.name)"
          >
            {{ report.name }}
          </v-chip>
        </v-scale-transition>
        <p v-else class="text-center mb-0">- No report available -</p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";
import mongoObjectId from "@/utils/mongoObjectId";
import InputModel from "@/components/widgets/InputModel";
import investigationReports from "@/json/investigation-reports.json";
import { sortBy } from "@pranavraut033/js-utils/utils/list";
import { stringToRegex } from "@pranavraut033/js-utils/utils/regex";

export default {
  extends: InputModel,
  props: { investigations: { type: Array, default: () => [] } },
  data() {
    return {
      search: "",
    };
  },
  computed: {
    entriesLengthMap() {
      const entriesLengthMap = {};
      this.investigations.forEach(
        (ev) => (entriesLengthMap[ev.name] = ev.entries.length)
      );
      return entriesLengthMap;
    },
    avaiableReports() {
      const regex = stringToRegex(this.search);
      const { entriesLengthMap } = this;

      const reports = investigationReports
        .map((ev) => ({
          name: ev.name || ev,
          remove: entriesLengthMap[ev.name || ev] === 0,
          disabled: entriesLengthMap[ev.name || ev] > 0,
        }))
        .filter((ev) => !regex || regex.test(ev.name))

        .sort(sortBy("name"));
      return reports;
    },
    closeable() {
      return true;
    },
  },
  methods: {
    removeField(key) {
      this.$emit(
        "update:investigations",
        this.investigations.filter((ev) => ev.name !== key)
      );
    },
    addField(key) {
      const { entriesLengthMap } = this;
      if (entriesLengthMap[key] !== undefined) return;

      const format = investigationReports.find((ev) => (ev.name || ev) === key);

      this.$emit("update:investigations", [
        ...this.investigations,
        {
          name: key,
          entries: [
            {
              _id: mongoObjectId(),
              reportDate: moment().format("YYYY-MM-DD"),
              values: typeof format === "string" ? "" : {},
              edit: true,
              changeDate: false,
            },
          ],
          format,
        },
      ]);
    },
    open() {
      this.model = true;
    },
    close() {
      this.model = false;
    },
  },
};
</script>

<style></style>
