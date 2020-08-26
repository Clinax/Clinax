<template>
  <v-dialog v-model="model" max-width="350">
    <v-card>
      <v-card-title>Select report type</v-card-title>
      <v-card-text>
        <v-scale-transition group>
          <v-chip
            v-for="report in avaiableReports"
            :key="report"
            color="primary"
            class="ma-1"
            outlined
            label
            @click="addField(report)"
          >
            {{ report }}
          </v-chip>
        </v-scale-transition>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";
import mongoObjectId from "@/utils/mongoObjectId";
import Toggleable from "@/components/widgets/Toggleable";
import investigationReports from "@/json/investigation-reports.json";

export default {
  extends: Toggleable,
  props: { investigations: { type: Array, default: () => [] } },
  computed: {
    avaiableReports() {
      const alreadyAdded = this.investigations.map((ev) => ev.name);

      return investigationReports
        .map((ev) => ev.name || ev)
        .filter((ev) => !alreadyAdded.includes(ev))
        .sort();
    },
    closeable() {
      return true;
    },
  },
  watch: {
    avaiableReports(a) {
      if (!a.length) this.model = false;
    },
  },
  methods: {
    addField(key) {
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
              edit: false,
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
