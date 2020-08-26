<template>
  <v-container>
    <v-card max-width="680">
      <v-layout class="d-flex align-center">
        <v-btn color="primary" icon @click.stop="$refs.calendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <span>
          {{ moment(new Date(calender)).format("MMM YYYY") }}
        </span>

        <v-spacer></v-spacer>
        <v-btn color="primary" icon @click.stop="$refs.calendar.next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-layout>
      <event-calendar
        ref="calendar"
        v-model="calender"
        tag="home"
      ></event-calendar>
    </v-card>
  </v-container>
</template>

<script>
import EventCalendar from "@/components/app/widgets/EventCalendar";

export default {
  components: { EventCalendar },
  data() {
    return {
      calender: this.moment(new Date()).format("MMM YYYY"),
    };
  },
};
</script>
