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
            <div class="grey lighten-3 d-flex align-center justify-center">
              <v-spacer></v-spacer>
              <div
                v-ripple
                @click="calendar = moment().format('YYYY-MM-DD')"
                class="px-2"
                style="cursor: pointer;"
              >
                <small>
                  <b>
                    <span> {{ moment().format("Do MMMM YYYY") }}&nbsp; </span>
                    <digital-clock
                      :twelveHour="true"
                      :blink="true"
                    ></digital-clock>
                  </b>
                </small>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                :loading="loading"
                :disabled="loading"
                @click.stop="$refs.calendar.getEvents()"
                absolute
                right
                small
                icon
              >
                <v-icon small>mdi-refresh</v-icon>
              </v-btn>
            </div>
            <event-calendar
              ref="calendar"
              v-model="calendar"
              :loading.sync="loading"
              tag="navbar"
              small
            ></event-calendar>
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
                  {{ moment(calendar).format("MMM YYYY") }}
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
  </v-navigation-drawer>
</template>

<script>
import moment from "moment";

import DigitalClock from "vue-digital-clock";
import ComponentWithModel from "@/components/ComponentWithModel";
import EventCalendar from "@/components/EventCalendar";

export default {
  extends: ComponentWithModel,
  components: { DigitalClock, EventCalendar },

  data: () => ({
    calendarNav: false,
    loading: false,
    calendar: moment(new Date()).format("YYYY-MM-DD"),

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
            title: "Appointments",
            icon: "mdi-tab-plus",
            to: "/app/appointments/",
          },
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
