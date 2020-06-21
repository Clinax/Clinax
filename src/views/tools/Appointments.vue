<template>
  <v-container>
    <v-card class="mx-auto">
      <v-toolbar flat>
        <v-app-bar-nav-icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-app-bar-nav-icon>
        <v-spacer></v-spacer>

        <v-btn color="primary" depressed @click="ui.appoinmentDialog = true">
          <v-icon class="mr-2">mdi-calendar-plus</v-icon>
          Add appointment
        </v-btn>
        <v-divider vertical inset class="mx-3"></v-divider>
        <v-menu
          v-model="ui.rangeFilterMenu"
          :close-on-content-click="false"
          bottom
          left
        >
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              color="primary"
              title="Date Range Filter"
              dark
              icon
            >
              <v-icon>mdi-calendar-range</v-icon>
            </v-btn>
          </template>
          <range-picker
            v-model="dates"
            min-now
            :presets="ui.presets"
            @input="
              init();
              ui.rangeFilterMenu = false;
            "
          ></range-picker>
        </v-menu>
        <div class="ml-3">
          <v-text-field
            label="Search"
            v-model="ui.search"
            :disabled="ui.loading"
            prepend-inner-icon="mdi-magnify"
            solo-inverted
            hide-details
            single-line
            clearable
            dense
            solo
            flat
          ></v-text-field>
        </div>
        <v-toolbar-items class="ml-3" title="Refresh">
          <v-btn @click="init" text>
            <v-icon color="grey darken-2">mdi-refresh-circle</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-divider></v-divider>

      <v-data-table
        v-if="appointments.length"
        :items="appointments"
        :loading="ui.loading"
        :search="ui.search"
        :headers="ui.headers"
        group-by="date"
        disable-pagination
        hide-default-footer
      >
        <template v-slot:body.prepend>
          <td :colspan="ui.headers.length">
            <v-card-actions class="info white--text">
              <v-icon dark small class="mr-2">mdi-information</v-icon>
              <small>
                Showing appointments from
                <b>{{ formattedDate1 }}</b>
                <template v-if="formattedDate1 != formattedDate2">
                  to
                  <b>{{ formattedDate2 }}</b>
                </template>
              </small>
              <v-spacer></v-spacer>
              <small>
                <b>{{ appointments.length }}</b> item(s)
              </small>
            </v-card-actions>
          </td>
        </template>
        <template v-slot:item.createdAt="{ item }">
          <span>
            {{ moment(item.createdAt).format("DD MMM YYYY") }}
          </span>
          <br />
          <small>
            {{ moment(item.createdAt).format("LT") }}
          </small>
        </template>
        <template v-slot:item.action="{ item }">
          <v-menu left bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon disabled>
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-list dense nav>
                <v-subheader> {{ item.patientName }}</v-subheader>
                <v-list-item>
                  <v-list-item-action>
                    <v-icon>mdi-calendar-refresh</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      Reschedule
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item @click="deleteEntry(item)" class="error lighten-4">
                  <v-list-item-action>
                    <v-icon color="error ">mdi-delete</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      Delete
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </template>
        <template
          v-slot:group.header="{ group, headers, items, isOpen, toggle }"
        >
          <td :colspan="headers.length">
            <v-card-actions class="w-100">
              <span>Appointments on&nbsp;</span>
              <span class="pa-1 primary--text">{{ group }}</span>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="toggle" small depressed>
                <span>{{ items.length }} item(s)</span>
                <v-icon small>
                  mdi-chevron-down
                  <template v-if="isOpen">
                    mdi-rotate-180
                  </template>
                </v-icon>
              </v-btn>
            </v-card-actions>
          </td>
        </template>
      </v-data-table>
      <v-sheet v-else max-width="680" class="mx-auto">
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
                    {{ formattedDate1 }}
                  </li>
                  <template v-if="formattedDate1 != formattedDate2">
                    <li><small>To</small></li>
                    <li class="grey rounded d-inline-block px-3 lighten-2">
                      {{ formattedDate2 }}
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
      <v-btn
        v-if="$vuetify.breakpoint.smAndDown"
        color="primary"
        @click="ui.appoinmentDialog = true"
        bottom
        fixed
        right
        fab
      >
        <v-icon>mdi-calendar-plus</v-icon>
      </v-btn>
    </v-card>
    <appointment-form
      v-model="ui.appoinmentDialog"
      @add="appointments.push"
    ></appointment-form>
  </v-container>
</template>

<script>
import AppointmentForm from "@/components/AppointmentForm";
import RangePicker from "@/components/RangePicker";
import moment from "moment";
import { makeRequest } from "../../modules/request";
import Logger from "../../modules/Logger";

export default {
  components: { AppointmentForm, RangePicker },
  data() {
    return {
      dates: [
        moment().format("YYYY-MM-DD"),
        moment().add(7, "days").format("YYYY-MM-DD"),
      ],
      appointments: [],
      ui: {
        rangeFilterMenu: false,
        appoinmentDialog: false,
        search: "",
        headers: [
          {
            text: "Time",
            value: "time",
          },
          {
            text: "Name",
            value: "patientName",
          },
          {
            text: "Notes",
            value: "notes",
          },
          {
            text: "Created On",
            value: "createdAt",
            align: "right",
          },
          {
            align: "center",
            value: "action",
            sortable: false,
          },
        ],
        presets: [
          {
            text: "Last 3 Months",
            params: [1, "months", "subtract"],
          },
          {
            text: "Today",
            params: [0, "days"],
          },
          {
            text: "Next 7 days",
            params: [7, "days"],
          },
          {
            text: "Next 30 days",
            params: [30, "days"],
          },
          {
            text: "Next 3 months",
            params: [3, "months"],
          },
          "CUSTOM",
        ],
      },
    };
  },
  computed: {
    formattedDate1() {
      return moment(this.dates[0]).format("DD MMM YYYY");
    },
    formattedDate2() {
      return moment(this.dates[1]).format("DD MMM YYYY");
    },
  },
  methods: {
    init() {
      if (this.ui.loading) return;
      this.ui.loading = true;
      makeRequest("get", "appointments", {
        query: { from: this.dates[0], to: this.dates[1] },
      })
        .then(({ data }) => {
          this.ui.loading = false;
          this.appointments = data.map((ev) => {
            let m = moment(ev.dateTime);
            ev.date = m.format("Do MMMM YYYY");
            ev.time = m.format("LT");
            return ev;
          });
        })
        .catch((err) => {
          this.ui.loading = false;
          this.errorHandler(err);
        });
    },
    deleteEntry(item) {
      Logger.d(item);
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style></style>
