<template>
  <responsive-container>
    <v-card>
      <v-toolbar flat :prominent="isMobile">
        <v-app-bar-nav-icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-app-bar-nav-icon>

        <v-spacer></v-spacer>
        <patient-dialog
          v-model="patientDialog"
          :no-activator="isMobile"
          @patient:added="(ev) => patients.push(ev)"
        >
        </patient-dialog>
        <v-divider v-if="!isMobile" class="ml-3" vertical inset></v-divider>
        <icon-button
          class="mx-3"
          :icon="ui.dense ? 'mdi-format-list-text' : 'mdi-format-list-bulleted'"
          :active="ui.dense"
          title="(Un) Dense"
          @click="ui.dense = !ui.dense"
        >
        </icon-button>
        <icon-button
          :active="ui.groupBy"
          title="Group By Gender"
          icon="mdi-gender-transgender"
          @click="ui.groupBy = !ui.groupBy"
        >
        </icon-button>
        <v-divider v-if="!isMobile" class="mx-3" vertical inset></v-divider>
        <toolbar-tools
          :filter-items="[
            { icon: 'mdi-gender-male', text: 'Male', value: 'male' },
            { icon: 'mdi-gender-female', text: 'Female', value: 'female' },
            { icon: 'mdi-gender-non-binary', text: 'Other', value: 'other' },
          ]"
          filter-by="Gender"
          :filter.sync="filter"
          :items="() => items"
          @search="(ev) => (ui.search = ev)"
          @refresh="init"
        >
        </toolbar-tools>
      </v-toolbar>
      <v-btn
        v-if="isMobile"
        color="primary"
        class="ma-3"
        bottom
        fixed
        right
        fab
        @click="patientDialog = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-divider></v-divider>
      <v-data-table
        :items="items"
        :search="ui.search"
        :loading="ui.loading"
        :headers="ui.headers"
        :group-by="(ui.groupBy && 'gender') || null"
        :sort-by.sync="ui.sortBy"
        :sort-desc.sync="ui.sortDesc"
        :dense="ui.dense"
        item-key="_id"
        @click:row="(item) => (profile = { model: true, patient: item })"
      >
        <template
          v-slot:group.header="{ group, headers, items, isOpen, toggle }"
        >
          <td :colspan="headers.length">
            <v-card-actions class="w-100">
              <span class="pa-1 primary--text text-uppercase">
                {{ group }}&nbsp;
              </span>
              <span>patients</span>
              <v-spacer></v-spacer>
              <v-btn color="primary" small text @click="toggle">
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

        <template v-slot:item.pid="{ item }">
          <div :class="[item.gender]" class="text-truncate">
            <kbd>{{ item.pid }}</kbd>
          </div>
        </template>
        <template v-slot:item.createdAt="{ item }">
          <div
            class="text-capitalize"
            :title="
              'Since ' + moment(item.createdAt).format('DD MMM YYYY / LT')
            "
          >
            {{ moment(item.createdAt).fromNow() }}
          </div>
        </template>
        <template v-slot:item.diagnosis="{ item }">
          <v-tooltip v-if="item.diagnosis" top>
            <template v-slot:activator="{ on }">
              <b v-on="on">{{ item.diagnosis }}</b>
            </template>
            <v-simple-table>
              <tbody>
                <tr v-for="(value, key) in item.diagnoses" :key="value">
                  <td>{{ moment(value).format("DD MMM YYYY") }}</td>
                  <th>{{ key }}</th>
                </tr>
              </tbody>
            </v-simple-table>
          </v-tooltip>
          <pre v-else>-</pre>
        </template>

        <template v-slot:item.prefixFullname="{ item, value }">
          <v-menu :close-on-content-click="false" open-on-hover top offset-y>
            <template v-slot:activator="{ on }">
              <span class="dashed" v-on="on">{{ value }}</span>
            </template>

            <patient-mini-card :patient="item"> </patient-mini-card>
          </v-menu>
        </template>
        <template v-slot:item.age="{ item }">
          <v-tooltip v-if="item.birthDate" top>
            <template v-slot:activator="{ on }">
              <v-layout align-center v-on="on">
                <v-icon
                  v-if="
                    moment(item.birthDate).format('L') == moment().format('L')
                  "
                  title="Happy Birthday!"
                  color="pink"
                  class="mr-2"
                  small
                >
                  mdi-cake
                </v-icon>
                <span class="text-no-wrap">
                  {{ item.age }} / {{ item.gender[0] }}
                </span>
              </v-layout>
            </template>
            <span class="text-uppercase">
              {{ moment(item.birthDate).format("YYYY") }} /
              {{ item.gender }}
            </span>
          </v-tooltip>
          <pre v-else>Not provided</pre>
        </template>
        <template v-slot:item.address.area="{ item }">
          <v-tooltip v-if="item.address" top>
            <template v-slot:activator="{ on }">
              <span v-on="on">{{ item.address.area }}</span>
            </template>
            <v-list-item dense dark>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.address.street || "-" }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.address.area || "-" }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-tooltip>
          <pre v-else>-</pre>
        </template>
        <template v-slot:item.updatedAt="{ item }">
          <span class="text-truncate">
            {{ moment(item.updatedAt).format("Do MMM YYYY") }}
          </span>
          <br />
          <small class="text-truncate">
            {{ moment(item.updatedAt).format("LT") }}
          </small>
        </template>
        <template v-slot:item.action="{ item }">
          <v-card-actions>
            <v-btn
              color="primary"
              title="Open patient case"
              depressed
              small
              @click.stop="$router.push('/app/case/' + item._id)"
            >
              open Case
            </v-btn>
          </v-card-actions>
        </template>
      </v-data-table>
    </v-card>

    <patient-dialog
      v-model="profile.model"
      :patient.sync="profile.patient"
      no-activator
      @update:patient="listUpdated"
      @patient:removed="
        (id) => (patients = patients.filter((patient) => patient._id != id))
      "
    ></patient-dialog>
  </responsive-container>
</template>

<script>
/* eslint-disable func-names */
import ToolbarTools from "@/components/widgets/ToolbarTools";
import PatientMiniCard from "@/components/app/widgets/PatientMiniCard";

export default {
  components: { ToolbarTools, PatientMiniCard },
  data: () => ({
    patientDialog: false,
    patients: [],
    profile: {
      patient: null,
      model: false,
    },
    items: [],
    filter: [],

    ui: {
      headers: [
        { text: "Patient Id", value: "pid" },
        {
          text: "Patient Since",
          value: "createdAt",
          width: 80,
        },
        { text: "Name", value: "prefixFullname" },
        { text: "Age & Sex", value: "age" },
        { text: "Diagnosis", value: "diagnosis" },
        {
          text: "Area",
          value: "address.area",
          width: 120,
        },
        {
          text: "Date updated",
          value: "updatedAt",
          align: "right",
        },
        {
          text: "Action",
          value: "action",
          align: "center",
          sortable: false,
        },
      ],
      groupBy: localStorage.getItem("clinax.patient.groupBy") === "true",
      dense: localStorage.getItem("clinax.patient.dense") === "true",
      sortDesc: localStorage.getItem("clinax.patient.sortDesc") === "true",
      sortBy: localStorage.getItem("clinax.patient.sortBy") || "updatedAt",
      search: "",
      loading: false,
    },
  }),
  watch: {
    "ui.groupBy": function (a) {
      localStorage.setItem("clinax.patient.groupBy", a);
    },
    "ui.sortBy": function (a) {
      localStorage.setItem("clinax.patient.sortBy", a);
    },
    "ui.dense": function (a) {
      localStorage.setItem("clinax.patient.dense", a);
    },
    "ui.sortDesc": function (a) {
      localStorage.setItem("clinax.patient.sortDesc", a);
    },
    patients: {
      deep: true,
      handler() {
        this.makeitems();
      },
    },
    filter() {
      this.makeitems();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    makeitems() {
      this.items = this.patients.filter(
        (ev) => !this.filter.length || this.filter.includes(ev.gender)
      );
    },
    listUpdated(patient) {
      const index = this.patients.findIndex((ev) => ev._id === patient._id);

      if (~index) this.patients[index] = patient;
      else this.patients.push(patient);
    },
    init() {
      this.ui.loading = true;
      this.makeRequest("get", "patient")
        .then(({ data }) => {
          this.ui.loading = false;
          this.patients = data;
        })
        .catch((err) => {
          this.ui.loading = false;
          this.errorHandler(err);
        });
    },
  },
};
</script>

<style lang="scss">
.v-data-table-header tr th {
  white-space: nowrap;
}

.v-data-table__wrapper tr {
  position: relative;
  transition: 350ms cubic-bezier(0.075, 0.82, 0.165, 1);
  cursor: pointer;

  & > td:first-child {
    position: relative;
    div {
      &.female,
      &.male {
        &:after {
          position: absolute;
          content: "";
          left: 0;
          top: 0;
          bottom: 0;
          transition: 350ms cubic-bezier(0.075, 0.82, 0.165, 1);
          border-left-style: solid;
        }
      }
      &.male::after {
        border-color: rgb(76, 153, 255);
      }
      &.female::after {
        border-color: rgb(165, 54, 72) !important;
      }
    }
  }

  &:hover > td:first-child div::after {
    border-left-width: 4px;
    box-shadow: 3px 0px 6px rgba($color: #000000, $alpha: 0.3);
  }
}
</style>
