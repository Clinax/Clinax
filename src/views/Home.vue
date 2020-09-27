<template>
  <v-container>
    <v-row>
      <v-col>
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
      </v-col>
      <v-col>
        <v-card max-width="320">
          <v-card-title>Inventory Todo</v-card-title>
          <v-list dense class="pt-0">
            <v-list-item
              v-for="entry in [...inventoryTodoList].slice(0, maxTodoItem)"
              :key="entry.name"
            >
              <v-list-item-content>
                <v-list-item-title>{{ entry.name }}</v-list-item-title>
                <div>
                  <template v-for="(value, name) in entry.potency">
                    <v-chip
                      v-if="value"
                      :key="name"
                      :color="getColor(String(name)) + '3f'"
                      class="chip-item text-uppercase"
                      :ripple="false"
                      small
                    >
                      {{ name }}
                    </v-chip>
                  </template>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-layout
              v-if="inventoryTodoList.length > maxTodoItem"
              class="mx-4 mb-1 body-2 text--secondary"
            >
              <span>+{{ inventoryTodoList.length - maxTodoItem }} items</span>
              <v-spacer></v-spacer>
              <router-link to="/app/inventory/">
                View all<v-icon small>mdi-chevron-right</v-icon>
              </router-link>
            </v-layout>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EventCalendar from "@/components/app/widgets/EventCalendar";
import getColor from "@pranavraut033/js-utils/utils/getColor";

export default {
  components: { EventCalendar },
  data() {
    return {
      calender: this.moment(new Date()).format("MMM YYYY"),
      todoLoading: false,
      inventoryTodoList: [],
      maxTodoItem: 5,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    getColor,
    init() {
      if (this.todoLoading) return;

      this.todoLoading = true;

      this.makeRequest("get", "inventory-todo")
        .then(({ data }) => (this.inventoryTodoList = data))
        .catch(this.errorHandler)
        .finally(() => (this.todoLoading = false));
    },
  },
};
</script>

<style scoped>
.chip-item:nth-child(2n) {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}
</style>
