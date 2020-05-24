<template>
  <v-container>
    <v-card max-width="540">
      <v-layout class="d-flex align-center">
        <v-btn color="primary" icon @click.stop="$refs.calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <span>
          {{ moment(calender).format("MMM YYYY") }}
        </span>

        <v-spacer></v-spacer>
        <v-btn color="primary" icon @click.stop="$refs.calendar.next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-layout>
      <v-calendar
        v-model="calender"
        ref="calendar"
        :event-color="(ev) => ev.color + 'af'"
        :events="events"
      >
        <template v-slot:event="{ event }">
          <div
            class="text--primary font-weight-bold border px-1"
            @click="openDialog(event)"
          >
            {{ event.name }}
          </div>
        </template>
      </v-calendar>
    </v-card>

    <v-dialog v-model="eventDialog.model" max-width="290">
      <v-card v-if="eventDialog.event">
        <v-card-title :style="{ background: eventDialog.event.color + '5f' }">
          {{ eventDialog.event.name }}
        </v-card-title>
        <v-card-text class="pt-5 pb-3">
          Appointmented for:
          <b class="text-no-wrap">
            {{ moment(eventDialog.event.start).format("Do MMM YYYY") }}
          </b>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            depressed
            @click="eventDialog.model = false"
            :to="`/app/case/${eventDialog.event._id}`"
          >
            View case File
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from "moment";
import { makeRequest } from "@/modules/request";

import ComponentWithModel from "@/components/ComponentWithModel";

export default {
  extends: ComponentWithModel,

  data: () => ({
    calendarNav: true,
    events: [],

    calender: moment(new Date()).format("YYYY-MM-DD"),
    eventDialog: { model: false, event: null },
  }),
  methods: {
    openDialog(event) {
      this.eventDialog.model = false;
      this.$nextTick(() => {
        this.eventDialog = { model: true, event };
      });
    },
  },
  mounted() {
    this.$store.dispatch("addListener", {
      event: "eventChange",
      name: "home",
      callback: () => {
        this.events = [];
        Object.values(this.$store.getters.events).forEach((ev) =>
          this.events.push(...ev)
        );
        this.$nextTick(() => this.$refs.calendar.checkChange());
      },
    });
    makeRequest("get", "followUp/events")
      .then(({ data }) => {
        this.$store.commit("setEvents", data);
      })
      .catch((err) => {
        this.errorHandler(err);
      });
  },
};
</script>
