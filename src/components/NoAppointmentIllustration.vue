<template>
  <v-sheet max-width="680" class="mx-auto">
    <v-row fill-height>
      <v-col cols="12" md="5">
        <v-img src="@/assets/notebook.svg" max-height="320" contain></v-img>
      </v-col>
      <v-col cols="12" md="7">
        <v-layout fill-height align-center justify-center column>
          <div class="text-center">
            <p class="text--secondary body-1">
              No appointment available for selected period
            </p>
            <ul type="none" class="px-0">
              <li class="grey rounded d-inline-block px-3 lighten-2">
                {{ date1 }}
              </li>
              <template v-if="date1 != date2">
                <li><small>To</small></li>
                <li class="grey rounded d-inline-block px-3 lighten-2">
                  {{ date2 }}
                </li>
              </template>
            </ul>
          </div>
          <v-card-actions class="my-5 justify-center">
            <v-btn color="primary" @click="ui.appoinmentDialog = true">
              <v-icon class="mr-2">mdi-calendar-plus</v-icon>
              Add appointment
            </v-btn>
            <span class="mx-3"> OR</span>
            <v-btn
              color="primary"
              title="Date Range Filter"
              @click="ui.rangeFilterMenu = true"
              icon
            >
              <v-icon>mdi-calendar-range</v-icon>
            </v-btn>
          </v-card-actions>
        </v-layout>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
export default {
  props: { date1: String, date2: String },
};
</script>
