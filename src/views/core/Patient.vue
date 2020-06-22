<template>
  <v-container>
    <v-card>
      <v-toolbar flat :prominent="$vuetify.breakpoint.smAndDown">
        <v-app-bar-nav-icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-app-bar-nav-icon>

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
        <v-btn
          @click="ui.dense = !ui.dense"
          :class="{ 'v-btn--active': ui.dense }"
          :color="ui.dense ? 'primary' : ''"
          :outlined="ui.dense"
          class="mx-3"
          icon
        >
          <icon
            :icon="
              ui.dense ? 'mdi-format-list-text' : 'mdi-format-list-bulleted'
            "
            title="(Un) Dense"
          >
          </icon>
        </v-btn>
        <v-btn
          @click="ui.groupBy = !ui.groupBy"
          :class="{ 'v-btn--active': ui.groupBy }"
          :color="ui.groupBy ? 'primary' : ''"
          :outlined="ui.groupBy"
          icon
        >
          <icon icon="mdi-gender-transgender" title="Group By Gender"> </icon>
        </v-btn>
        <v-divider
          v-if="$vuetify.breakpoint.mdAndUp"
          class="mx-3"
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
        item-key="_id"
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

        <template v-slot:item.pid="{ item }">
          <div :class="[item.gender]">
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
        <template v-slot:item.phone="{ item }">
          <div class="contact-info">
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
          </div>
        </template>
        <template v-slot:item.age="{ item }">
          <v-tooltip top v-if="item.birthDate">
            <template v-slot:activator="{ on }">
              <v-layout v-on="on" class="subheading" align-center>
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
            <v-simple-table class="transparent" dense dark>
              <tbody>
                <tr>
                  <th>Birth Date</th>
                  <td>
                    {{ moment(item.birthDate).format("Do MMM YYYY") }}
                  </td>
                </tr>
                <tr>
                  <th>Gender</th>
                  <td>
                    {{ item.gender }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-tooltip>
          <pre v-else>Not provided</pre>
        </template>
        <template v-slot:item.address.area="{ item }">
          <v-tooltip v-if="item.address" top>
            <template v-slot:activator="{ on }">
              <b v-on="on">{{ item.address.area }}</b>
            </template>
            <span>{{ item.address.street }}</span>
          </v-tooltip>
          <pre v-else>-</pre>
        </template>
        <template v-slot:item.updatedAt="{ item }">
          <span class="text-truncate">
            {{ moment(item.updatedAt).format("Do MMM YYYY") }}
          </span>
          <br />
          <small class="text-truncate">
            {{ moment(item.updatedAt).format("LTS") }}
          </small>
        </template>
        <template v-slot:item.action="{ item }">
          <v-card-actions>
            <v-btn
              color="primary"
              outlined
              small
              icon
              @click="profile = { model: true, patient: item }"
            >
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              color="primary"
              title="Open patient case"
              @click.stop="$router.push('/app/case/' + item._id)"
              depressed
              small
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
          text: "Patient Id",
          value: "pid",
        },
        {
          text: "Patient Since",
          value: "createdAt",
        },
        {
          text: "name",
          value: "fullname",
        },
        {
          text: "Contact Info",
          value: "phone",
          filter: (value, search, item) => {
            let regex = stringToRegex(search);
            if (regex) {
              if (!item.phone && !item.email) return false;
              var match =
                (item.phone && item.phone.replace(/ /g, "").match(regex)) ||
                (item.email && item.email.match(regex));

              return Boolean(match);
            }

            return true;
          },
        },
        {
          text: "Age & Sex",
          value: "age",
        },
        {
          text: "area",
          value: "address.area",
          filter: (value, search, item) => {
            let regex = stringToRegex(search);

            if (regex) {
              if (!item.address) return false;

              var match =
                item.address &&
                (item.address.street.match(regex) ||
                  item.address.area.match(regex));

              return Boolean(match);
            }

            return true;
          },
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
      groupBy: getCookie("clinax.patient.groupBy") == "true",
      dense: getCookie("clinax.patient.dense") == "true",
      sortDesc: getCookie("clinax.patient.sortDesc") == "true",
      sortBy: getCookie("clinax.patient.sortBy") || "updatedAt",
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
.v-data-table__wrapper tr {
  position: relative;
  transition: 350ms cubic-bezier(0.075, 0.82, 0.165, 1);

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

.contact-info {
  a {
    color: #474747;
    border-bottom: 1px dashed rgba($color: #000000, $alpha: 0.12);
  }
}
</style>
