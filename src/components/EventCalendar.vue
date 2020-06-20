<template>
  <v-sheet style="position: relative;">
    <v-progress-linear
      :active="loading"
      absolute
      indeterminate
      bottom
    ></v-progress-linear>
    <v-calendar
      :event-more="true"
      v-model="model"
      ref="calendar"
      :weekday-format="
        (ev) =>
          (small
            ? ['Su', 'mo', 'tu', 'we', 'th', 'fi', 'sa']
            : [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ])[ev.weekday]
      "
      :event-color="(ev) => ev.color + '9f'"
      :events="events"
      :show-month-on-first="!small"
      :short-months="small"
      @click:more="showAll"
    >
      <template v-slot:event="{ event }">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <div
              v-on="on"
              class="text--primary font-weight-bold px-3 text-truncate"
              @click="openDialog(event)"
              :class="{
                stripped: event.type == 'appointment',
                '': event.type == 'follow-up',
              }"
            >
              <span v-if="!small"> {{ event.name }}</span>
              <template v-else>&nbsp;</template>
            </div>
          </template>
          <span> {{ event.name }} </span>
        </v-tooltip>
      </template>
    </v-calendar>
    <v-dialog v-model="eventDialog.model" max-width="320">
      <v-card v-if="eventDialog.event">
        <v-card-title
          :style="{ background: eventDialog.event.color + 'af' }"
          :class="{
            stripped: eventDialog.event.type == 'appointment',
          }"
        >
          {{ eventDialog.event.name }}
        </v-card-title>

        <v-card-text class="pt-2">
          <v-subheader class="px-0">
            Appointmented Details:
          </v-subheader>
          <v-simple-table dense>
            <tbody>
              <tr>
                <th>Type</th>
                <td class="text-uppercase">{{ eventDialog.event.type }}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{{ eventDialog.date }}</td>
              </tr>
              <tr v-if="eventDialog.time">
                <th>Time</th>
                <td>{{ eventDialog.time }}</td>
              </tr>
              <tr v-if="eventDialog.event.notes">
                <th>Notes</th>
                <td>{{ eventDialog.event.notes }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="eventDialog.event._id"
            color="primary"
            :to="`/app/case/${eventDialog.event._id}`"
            @click="eventDialog.model = false"
            depressed
          >
            View case File
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="allEventsDialog.model" max-width="380">
      <v-card v-if="allEventsDialog.events">
        <v-card-title>
          Events on&nbsp;<b>{{ allEventsDialog.date }}</b>
        </v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item
              v-for="(event, i) in allEventsDialog.events"
              :key="i"
              :style="{ borderLeft: `2px solid ${event.color}` }"
              class="mb-2"
              @click="openDialog(event)"
            >
              <v-list-item-content>
                <v-list-item-title> {{ event.name }}</v-list-item-title>
                <v-list-item-subtitle> {{ event.notes }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text>
                  {{ moment(event.start).format("LT") }}
                </v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
import { makeRequest } from "../modules/request";
import moment from "moment";
import { sortBy } from "../modules/list";

export default {
  props: {
    small: Boolean,
    value: String,
    tag: { type: String, required: true },
  },
  data() {
    return {
      model: this.value,
      events: [],
      dateEventMap: {},
      loading: false,
      eventDialog: { model: false, event: null },
      allEventsDialog: { model: false },
    };
  },
  methods: {
    openDialog(event) {
      this.eventDialog.model = false;
      this.$nextTick(() => {
        let m = moment(event.start);
        let time = m.format("LT");
        time = time == "5:30 AM" ? null : time;
        let date = m.format("Do MMM YYYY");

        this.eventDialog = {
          event,
          model: true,
          date,
          time,
        };
      });
    },
    showAll(ev) {
      this.allEventsDialog.model = false;
      this.$nextTick(() => {
        this.allEventsDialog.model = true;
        this.allEventsDialog.date = ev.date;
        this.allEventsDialog.events = this.dateEventMap[ev.date].sort(
          sortBy("start")
        );
      });
    },
    getEvents() {
      if (this.loading) return;

      this.loading = true;
      makeRequest("get", "followUp/events")
        .then(({ data }) => {
          this.loading = false;
          this.$store.commit("setEvents", data.compressedData);
        })
        .catch((err) => {
          this.loading = false;
          this.errorHandler(err);
        });
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
  },
  watch: {
    loading(a) {
      this.$emit("update:loading", a);
    },
    model(a) {
      this.$emit("input", a);
    },
    value(a) {
      this.model = a;
    },
  },
  mounted() {
    this.$store.dispatch("addListener", {
      event: "eventChange",
      name: this.tag,
      callback: () => {
        this.dateEventMap = this.$store.getters.events;
        this.events = [];
        Object.values(this.$store.getters.events).forEach((ev) =>
          this.events.push(...ev)
        );
        this.$nextTick(
          () => this.$refs.calendar && this.$refs.calendar.checkChange()
        );
      },
    });
    this.getEvents();
  },
};
</script>

<style lang="scss">
.stripped {
  position: relative;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: repeating-linear-gradient(
      60deg,
      #fff1,
      #fff1 2px,
      #0009 2px,
      #0009 4px
    );
  }
  &.v-card__title {
    &::after {
      top: 0;
      left: 0;
      bottom: 0;
      height: auto;
      width: 8px;
      background: repeating-linear-gradient(
        -30deg,
        #fff1,
        #fff1 2px,
        #0009 2px,
        #0009 4px
      );
    }
  }
}
</style>
