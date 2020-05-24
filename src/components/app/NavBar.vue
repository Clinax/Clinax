<template>
  <v-navigation-drawer id="nav-bar" v-model="model" app>
    <v-layout fill-height column>
      <router-link to="/">
        <v-img src="/img/logo.png" width="98" class="mx-auto my-4"></v-img>
      </router-link>
      <v-divider></v-divider>
      <perfect-scrollbar class="flex-grow-1">
        <v-card-actions>
          <patient-dialog block>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" color="primary" rounded large block depressed>
                <v-icon>mdi-plus</v-icon>Add Patient
              </v-btn>
            </template>
          </patient-dialog>
        </v-card-actions>
        <list :items="links" shaped> </list>
      </perfect-scrollbar>
      <div class="border-top">
        <v-expand-transition absolute>
          <div v-if="calendarNav">
            <div
              class="text-center grey lighten-3 small"
              style="cursor: pointer;"
              v-ripple
              @click="calender = moment().format('YYYY-MM-DD')"
            >
              <small>
                <b>
                  {{ moment().format("Do MMMM YYYY") }}&nbsp;
                  <digital-clock
                    :twelveHour="true"
                    :blink="true"
                  ></digital-clock>
                </b>
              </small>
            </div>

            <v-sheet>
              <v-calendar
                :event-more="false"
                v-model="calender"
                ref="calendar"
                :weekday-format="
                  (ev) => ['Su', 'mo', 'tu', 'we', 'th', 'fi', 'sa'][ev.weekday]
                "
                :show-month-on-first="false"
                short-months
              >
                <template v-slot:day="{ date }">
                  <v-layout
                    class="fill-height w-100"
                    style="position: absolute; top: 0; left: 0;"
                    column
                    wrap
                  >
                    <v-sheet
                      @click="openDialog(event)"
                      v-for="(event, i) in events[date]"
                      :key="i"
                      :title="event.name"
                      :color="event.color"
                      width="12"
                      class="border rounded-0 mt-1"
                      height="4"
                    >
                      &nbsp;
                    </v-sheet>
                  </v-layout>
                </template>
              </v-calendar>
            </v-sheet>
          </div>
        </v-expand-transition>
        <v-list-item
          @click.stop="calendarNav = !calendarNav"
          v-ripple="!calendarNav"
        >
          <v-list-item-content class="pa-0 flex-grow-1">
            <template v-if="calendarNav">
              <v-list-item-subtitle class="d-flex align-center">
                <v-btn
                  color="primary"
                  small
                  icon
                  @click.stop="$refs.calendar.prev()"
                >
                  <v-icon small>mdi-chevron-left</v-icon>
                </v-btn>
                <v-spacer></v-spacer>

                <span>
                  {{ moment(calender).format("MMM YYYY") }}
                </span>

                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  small
                  icon
                  @click.stop="$refs.calendar.next()"
                >
                  <v-icon small>mdi-chevron-right</v-icon>
                </v-btn>
              </v-list-item-subtitle>
            </template>
            <v-list-item-title v-else>Mini calendar</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon small @click.stop="calendarNav = !calendarNav">
              <v-icon class="animate">
                mdi-chevron-up
                <template v-if="calendarNav">
                  mdi-rotate-180
                </template>
              </v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </div>
    </v-layout>
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
  </v-navigation-drawer>
</template>

<script>
import moment from "moment";
import { makeRequest } from "@/modules/request";

import DigitalClock from "vue-digital-clock";
import ComponentWithModel from "@/components/ComponentWithModel";

export default {
  extends: ComponentWithModel,
  components: { DigitalClock },

  data: () => ({
    calendarNav: true,
    events: new Map(),

    calender: moment(new Date()).format("YYYY-MM-DD"),
    eventDialog: { model: false, event: null },

    links: [
      {
        title: "Home",
        icon: "mdi-home",
        to: "/app",
      },
      {
        title: "Patients",
        icon: "mdi-account-multiple",
        to: "/app/patients/",
      },
      {
        title: "Tools",
        icon: "mdi-tools",
        model: true,
        subLinks: [
          {
            title: "Contacts",
            icon: "mdi-account-box",
            to: "/app/contacts/",
          },
          {
            title: "Invetory Manager",
            icon: "mdi-warehouse",
            to: "/app/inventory/",
          },
        ],
      },
    ],
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
      name: "navBar",
      callback: () => {
        this.events = this.$store.getters.events;
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

<style lang="scss">
#nav-bar {
  // .theme--light.v-calendar-weekly .v-calendar-weekly__day,
  // .v-calendar-weekly__head-weekday {
  //   border: none !important;
  // }
  .v-calendar-weekly__head-weekday {
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.12) !important;
  }
  .v-event {
    height: 4px !important;
  }
}
</style>
