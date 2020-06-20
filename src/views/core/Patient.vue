<template>
  <v-container>
    <v-card>
      <v-toolbar flat :prominent="$vuetify.breakpoint.smAndDown">
        <v-app-bar-nav-icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title v-if="$vuetify.breakpoint.mdAndUp">
          Patients
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <patient-dialog
          v-model="patientDialog"
          :no-activator="$vuetify.breakpoint.smAndDown"
          @patient-add="(ev) => patients.push(ev)"
        >
        </patient-dialog>
        <v-divider
          v-if="$vuetify.breakpoint.mdAndUp"
          class="ml-3"
          vertical
          inset
        ></v-divider>

        <toolbar-tools
          @search="(ev) => (ui.search = ev)"
          :filter-items="[
            { icon: 'mdi-gender-male', text: 'Male', value: 'male' },
            { icon: 'mdi-gender-female', text: 'Female', value: 'female' },
            { icon: 'mdi-gender-non-binary', text: 'Other', value: 'other' },
          ]"
          @refresh="init"
          filter-by="Gender"
          :filter.sync="filter"
          :items="() => items"
        >
          <v-btn @click="ui.dense = !ui.dense" icon>
            <icon
              :icon="
                ui.dense ? 'mdi-format-list-text' : 'mdi-format-list-bulleted'
              "
              title="(Un) dense"
            >
            </icon>
          </v-btn>
          <v-btn @click="ui.groupBy = !ui.groupBy" icon>
            <icon icon="mdi-group" title="Group By Gender"> </icon>
          </v-btn>
        </toolbar-tools>
      </v-toolbar>
      <v-btn
        v-if="$vuetify.breakpoint.smAndDown"
        color="primary"
        class="ma-3"
        @click="patientDialog = true"
        bottom
        fixed
        right
        fab
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
      >
        <template v-slot:item="{ item, headers }">
          <tr
            class="item"
            :class="[item.gender, { mobile: $vuetify.breakpoint.xs }]"
            @click="
              profile = {
                model: true,
                patient: item,
              }
            "
          >
            <td class="text-truncate">
              <div class="head">{{ headers[0].text }}</div>
              {{ moment(item.createdAt).format("Do MMMM 'YY") }}
            </td>
            <td class="text-truncate">
              <div class="head">{{ headers[1].text }}</div>

              <span>{{ item.fullname }}</span>
            </td>
            <td class="contact-info">
              <div class="head">{{ headers[2].text }}</div>
              <span v-if="item.email || item.phone">
                <a v-if="item.phone" :href="'tel:' + item.phone">
                  {{ item.phone }}
                </a>
                <a v-else-if="item.email" :href="'mailto:' + item.email">
                  {{ item.email }}
                </a>
              </span>
              <pre v-else>-</pre>
              <template v-if="item.email && item.phone">
                <br />
                <small>
                  <a :href="'mailto:' + item.email">{{ item.email }}</a>
                </small>
              </template>
            </td>
            <td>
              <div class="head">{{ headers[3].text }}</div>
              <v-tooltip top v-if="item.birthDate">
                <template v-slot:activator="{ on }">
                  <v-layout align-center v-on="on" class="subheading">
                    <v-icon
                      v-if="
                        moment(item.birthDate).format('L') ==
                        moment().format('L')
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
                <v-simple-table dense dark class="transparent">
                  <tr>
                    <th>Birth Date</th>
                    <td>
                      {{ moment(item.birthDate).format("Do MMMM 'YY") }}
                    </td>
                  </tr>
                  <tr>
                    <th>Gender</th>
                    <td>
                      {{ item.gender }}
                    </td>
                  </tr>
                </v-simple-table>
              </v-tooltip>
              <pre v-else>Not provided</pre>
            </td>
            <td>
              <div class="head">{{ headers[4].text }}</div>
              <v-tooltip v-if="item.address" top>
                <template v-slot:activator="{ on }">
                  <b v-on="on">{{ item.address.area }}</b>
                </template>
                <span>{{ item.address.street }}</span>
              </v-tooltip>
              <pre v-else>-</pre>
            </td>
            <td class="text-right text-truncate">
              <div class="head">{{ headers[5].text }}</div>
              <div>
                {{ moment(item.updatedAt).format("Do MMMM 'YY") }}
              </div>
              <small>
                {{ moment(item.updatedAt).format("LT") }}
              </small>
            </td>
            <td>
              <v-btn
                color="primary"
                title="Open patient case"
                @click.stop="$router.push('/app/case/' + item._id)"
                depressed
                block
                small
              >
                open Case
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <patient-dialog
      v-model="profile.model"
      :patient.sync="profile.patient"
      @update:patient="init"
      no-activator
    ></patient-dialog>
  </v-container>
</template>

<script>
// import colorGenerate from "string-to-color";
import { makeRequest, baseUrl } from "@/modules/request";
import ToolbarTools from "@/components/ToolbarTools";
import { stringToRegex } from "@/modules/regex";
import { getCookie, setCookie } from "../../modules/cookie";

export default {
  components: { ToolbarTools },
  data: () => ({
    baseUrl,

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
        {
          text: "Patient Since",
          value: "createdAt",
          hidden: true,
        },
        {
          text: "Full name",
          value: "fullname",
        },
        {
          text: "Contact Info",
          value: "phone",
          filter: (value, search, item) => {
            var b = true;
            if (!item.phone && !item.email) return false;

            let regex = stringToRegex(search);
            if (regex) {
              var match =
                (item.phone && item.phone.replace(/ /g, "").match(regex)) ||
                (item.email && item.email.match(regex));

              b = Boolean(match);
            }

            return b;
          },
        },
        {
          text: "Age & gender",
          value: "age",
        },
        {
          text: "Area",
          value: "address.area",
          filter: (value, search, item) => {
            var b = true;
            let regex = stringToRegex(search);

            if (regex) {
              if (!item.address) return false;

              var match =
                item.address &&
                (item.address.street.match(regex) ||
                  item.address.area.match(regex));

              b = Boolean(match);
            }

            return b;
          },
        },
        {
          text: "Date updated",
          value: "updatedAt",
          align: "right",
        },
        {
          text: "Action",
          align: "right",
          sortable: false,
        },
      ],
      groupBy: getCookie("clinax.patient.groupBy") == "true",
      dense: getCookie("clinax.patient.dense") == "true",
      sortDesc: getCookie("clinax.patient.sortDesc") == "true",
      sortBy: getCookie("clinax.patient.sortBy") || "createdAt",
      search: "",
      loading: false,
    },
  }),
  watch: {
    "ui.groupBy"(a) {
      setCookie("clinax.patient.groupBy", a);
    },
    "ui.sortBy"(a) {
      setCookie("clinax.patient.sortBy", a);
    },
    "ui.dense"(a) {
      setCookie("clinax.patient.dense", a);
    },
    "ui.sortDesc"(a) {
      setCookie("clinax.patient.sortDesc", a);
    },
    patients() {
      this.makeitems();
    },
    filter() {
      this.makeitems();
    },
  },
  methods: {
    makeitems() {
      this.items = this.patients.filter(
        (ev) => !this.filter.length || this.filter.includes(ev.gender)
      );
    },
    init() {
      this.ui.loading = true;
      makeRequest("get", "patient")
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
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss">
.item {
  position: relative;
  transition: 350ms cubic-bezier(0.075, 0.82, 0.165, 1);
  cursor: pointer;

  & > td:first-child {
    position: relative;
    &:after {
      position: absolute;
      content: "";
      left: 0;
      top: 0;
      bottom: 0;
      transition: 350ms cubic-bezier(0.075, 0.82, 0.165, 1);
      border-left-style: solid;
      border-color: rgb(56, 116, 194);
    }
  }
  &.female {
    // background: #ffd7e3;
    & > td:first-child::after {
      border-color: rgb(109, 4, 21) !important;
    }
  }
  &:hover {
    & > td:first-child::after {
      border-left-width: 4px;
      box-shadow: 3px 0px 6px rgba($color: #000000, $alpha: 0.3);
    }
  }
  & > td .head {
    display: none;
  }
  &.mobile {
    & > td {
      height: auto !important;
      padding: 0.5rem 1.5rem;
      display: block !important;
      text-align: start !important;
      .head {
        display: block;
        font-size: 10pt;
        font-weight: bold;
        font-family: monospace !important;
        margin-bottom: 0.25rem;
        margin-left: -0.5rem;
        &:after {
          content: ":";
        }
      }
      border-bottom: 0.25px solid rgba($color: #000000, $alpha: 0.12);
    }
  }
}
.contact-info {
  a {
    color: #474747;
    border-bottom: 1px dashed rgba($color: #000000, $alpha: 0.12);
  }
}
</style>
