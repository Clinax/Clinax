<template>
  <v-card>
    <v-layout>
      <v-sheet v-if="!isMobile" color="primary" min-width="240" dark>
        <v-list class="transparent">
          <v-subheader>Presets</v-subheader>
          <v-list-item
            v-for="(preset, i) in internalPresets"
            :key="i"
            @click="
              (preset.callback && preset.callback()) ||
                computeDates(...preset.params)
            "
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ preset.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-sheet>
      <div>
        <v-card-text>
          <v-text-field
            ref="date1"
            v-model="date1"
            label="Start Date"
            type="date"
            class="mb-3"
            prepend-inner-icon="mdi-clock-start"
            solo-inverted
            hide-details
            dense
            flat
          ></v-text-field>
          <v-text-field
            v-model="date2"
            label="Start Date"
            type="date"
            prepend-inner-icon="mdi-clock-end"
            solo-inverted
            hide-details
            dense
            flat
            solo
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>

        <v-date-picker
          v-model="dates"
          class="range-picker"
          color="primary"
          no-title
          range
        >
        </v-date-picker>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="emit()">Apply</v-btn>
        </v-card-actions>
      </div>
    </v-layout>
  </v-card>
</template>

<script>
import moment from "moment";

export default {
  props: {
    value: { type: Array, default: () => [] },
    presets: {
      type: Array,
      default: () => [
        {
          text: "Today",
          params: [0, "days"],
        },
        {
          text: "Past 7 days",
          params: [7, "days", "subtract"],
        },
        {
          text: "Past 30 days",
          params: [30, "days", "subtract"],
        },
        {
          text: "Past 3 months",
          params: [3, "months", "subtract"],
        },
        {
          text: "Last 6 Months",
          params: [6, "months", "subtract"],
        },
        {
          text: "Last Year",
          params: [1, "year", "subtract"],
        },
        "CUSTOM",
      ],
    },
  },
  data() {
    return {
      date1:
        (this.value && this.value[0]) ||
        moment().add(7, "days").format("YYYY-MM-DD"),
      date2: (this.value && this.value[1]) || moment().format("YYYY-MM-DD"),
    };
  },
  computed: {
    internalPresets() {
      return this.presets.map((ev) =>
        ev === "CUSTOM"
          ? {
              text: "Custom",
              callback: () => {
                this.$refs.date1.focus();
              },
            }
          : ev
      );
    },
    dates: {
      set(v) {
        const date1 = v[0];
        let date2 = v[1];

        if (!date2) {
          const d1 = Math.abs(moment(v[0]).diff(this.date1));
          const d2 = Math.abs(moment(v[0]).diff(this.date2));
          date2 = v[1] || (d1 > d2 ? this.date1 : this.date2);
        }
        this.setDates(date1, date2);
      },
      get() {
        return [this.date1, this.date2].sort();
      },
    },
  },
  watch: {
    value(a) {
      if (a) this.dates = a;
    },
  },
  methods: {
    emit() {
      this.$emit("input", this.dates);
    },
    computeDates(...params) {
      const method = params[2] || "add";
      const date1 = moment()[method](params[0], params[1]).format("YYYY-MM-DD");
      const date2 = moment().format("YYYY-MM-DD");
      this.setDates(date1, date2);
    },
    setDates(date1, date2) {
      if (date2 > date1) {
        this.date1 = date1;
        this.date2 = date2;
      } else {
        this.date1 = date2;
        this.date2 = date1;
      }
    },
  },
};
</script>

<style lang="scss">
.range-picker {
  box-shadow: none !important;
  .v-btn--rounded {
    border-radius: 4px !important;
  }
}
</style>
