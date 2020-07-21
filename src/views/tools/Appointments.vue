<template>
  <v-container>
    <v-card class="mx-auto">
      <v-toolbar flat :prominent="isMobile">
        <v-app-bar-nav-icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-app-bar-nav-icon>
        <v-spacer></v-spacer>

        <v-btn
          v-if="!isMobile"
          color="primary"
          @click="ui.appoinmentDialog.model = { mdoel: true }"
          depressed
        >
          <v-icon class="mr-2">mdi-calendar-plus</v-icon>
          Add appointment
        </v-btn>
        <v-divider v-if="!isMobile" vertical inset class="mx-3"></v-divider>
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
            :presets="ui.presets"
            @input="
              init();
              ui.rangeFilterMenu = false;
            "
          ></range-picker>
        </v-menu>

        <toolbar-tools
          @search="(ev) => (ui.search = ev)"
          @refresh="init"
          :items="() => appointments"
          :fileName="`Appointments-${moment().format('DD-MM-YYYY')}`"
        >
        </toolbar-tools>
      </v-toolbar>
      <v-divider></v-divider>
      <v-data-table
        v-if="appointments.length || ui.loading"
        :items="appointments"
        :loading="ui.loading"
        :search="ui.search"
        :headers="ui.headers"
        group-by="groupKey"
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
                Total: <b> {{ appointments.length }} item(s)</b>
              </small>
            </v-card-actions>
          </td>
        </template>
        <template v-slot:item.time="{ value }">
          <b>{{ value }}</b>
        </template>
        <template v-slot:item.createdAt="{ item }">
          <div class="text-no-wrap">
            <span>
              {{ moment(item.createdAt).format("Do MMM YYYY") }}
            </span>
            <small>
              {{ moment(item.createdAt).format("LT") }}
            </small>
          </div>
          <small class="text-no-wrap">
            {{ moment(item.createdAt).fromNow() }}
          </small>
        </template>
        <template v-slot:item.action="{ item }">
          <v-menu left bottom min-width="190">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" :disabled="ui.loading" icon>
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-list dense nav>
                <v-subheader> {{ item.patientName }}</v-subheader>
                <v-list-item @click="updateEntry(item)">
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
                    <v-icon color="error">mdi-delete</v-icon>
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
              <span class="pa-1 primary--text">
                {{ moment(items[0].dateTime).format("Do MMMM YYYY") }}
              </span>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="toggle" small text>
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
      <no-appointment-illustration
        v-else
        v-bind="{ date1: formattedDate1, date2: formattedDate2 }"
        @click:add="ui.appoinmentDialog.model = true"
        @click:date-filter="ui.rangeFilterMenu = true"
      ></no-appointment-illustration>

      <v-btn
        v-if="isMobile"
        color="primary"
        @click="ui.appoinmentDialog.model = true"
        bottom
        fixed
        right
        fab
      >
        <v-icon>mdi-calendar-plus</v-icon>
      </v-btn>
    </v-card>
    <appointment-form
      v-model="ui.appoinmentDialog.model"
      :appointment="ui.appoinmentDialog.item"
      @update:appointment="(ui.appoinmentDialog = { model: false }), init()"
      @add="
        ((ev) => (init(), (ui.appoinmentDialog.model = false)))
      "
    ></appointment-form>
  </v-container>
</template>

<script>
import moment from "moment";

import { makeRequest } from "@/modules/request";
import { sortBy } from "@/modules/list";

import AppointmentForm from "@/components/AppointmentForm";
import NoAppointmentIllustration from "@/components/NoAppointmentIllustration";
import RangePicker from "@/components/widgets/RangePicker";
import ToolbarTools from "@/components/widgets/ToolbarTools";

export default {
  components: {
    AppointmentForm,
    RangePicker,
    ToolbarTools,
    NoAppointmentIllustration,
  },
  data() {
    return {
      dates: [
        moment().format("YYYY-MM-DD"),
        moment().add(7, "days").format("YYYY-MM-DD"),
      ],
      appointments: [],
      ui: {
        rangeFilterMenu: false,
        appoinmentDialog: { model: false },
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
        loading: false,
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
  watch: {
    "ui.appoinmentDialog.model"(a) {
      if (!a) this.ui.appoinmentDialog.item = null;
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
          this.appointments = data
            .map((ev) => {
              let m = moment(ev.dateTime);
              ev.groupKey = m.format("YYYYMMDD");
              ev.time = m.format("LT");
              return ev;
            })
            .sort(sortBy("dateTime"), true);
        })
        .catch((err) => {
          this.ui.loading = false;
          this.errorHandler(err);
        });
    },
    deleteEntry(item) {
      const self = this;
      self.ui.loading = true;

      this.$store.dispatch("deleteAppointment", {
        id: item._id,
        callback: (err) => {
          self.ui.loading = false;

          if (err) self.errorHandler(err);
          else
            this.appointments = this.appointments.filter(
              (ev) => ev._id != item._id
            );
        },
      });
    },
    updateEntry(item) {
      this.ui.appoinmentDialog = { model: true, item };
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style></style>
