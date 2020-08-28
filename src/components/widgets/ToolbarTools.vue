<template>
  <div id="toolbar-tools">
    <div class="d-flex align-center">
      <v-spacer></v-spacer>
      <slot></slot>
      <v-menu
        v-if="filterItems"
        v-model="menu"
        class="flex-grow-0"
        :close-on-content-click="false"
        left
      >
        <template v-slot:activator="{ on }">
          <icon-button
            :badge="filtered"
            :title="'Filter by ' + filterBy || 'status'"
            class="flex-grow-0"
            :active="!!filtered"
            icon="mdi-filter-variant"
            v-on="on"
          >
          </icon-button>
        </template>
        <v-card>
          <v-subheader>Filters</v-subheader>
          <v-list class="pt-0">
            <v-list-group v-if="filterItems">
              <template v-slot:activator>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title
                      :class="{ 'u dotted': filterModel.length }"
                    >
                      Filter by {{ filterBy || "status" }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-layout px-1>
                <v-btn-toggle
                  v-model="filterModel"
                  class="elevation-0 grey lighten-5 flex-column w-100"
                  multiple
                  @change="emitFilterChange"
                >
                  <v-btn
                    v-for="item in filterItems"
                    :key="item.text || item"
                    text
                    class="border-0"
                    :value="item.value || item.text || item"
                  >
                    <v-layout class="text-left">
                      <v-icon
                        v-if="item.icon"
                        :color="item.color"
                        class="mx-2 flex-grow-0"
                        small
                        v-text="item.icon"
                      ></v-icon>
                      <v-spacer></v-spacer>
                      <span v-text="item.text || item"></span>
                    </v-layout>
                  </v-btn>
                </v-btn-toggle>
              </v-layout>
            </v-list-group>
          </v-list>
          <v-card-actions>
            <v-btn
              color="primary"
              :disabled="!filtered"
              block
              small
              text
              @click="
                filterModel = [];
                currencyFilterModel = '';
                emitFilterChange(true);
              "
            >
              clear filters
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-text-field
        v-if="!isMobile"
        v-model="search"
        class="flex-grow-1 mx-3"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        solo-inverted
        hide-details
        clearable
        dense
        flat
        solo
        @input="(ev) => $emit('search', ev)"
      ></v-text-field>
      <toolbar-menu :options="options" class="flex-grow-0"></toolbar-menu>
    </div>
    <div v-if="isMobile" style="left: 1rem; position: absolute; right: 1rem;">
      <v-text-field
        v-model="search"
        class="flex-grow-1 my-2"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        solo-inverted
        hide-details
        clearable
        flat
        solo
        @input="(ev) => $emit('search', ev)"
      ></v-text-field>
    </div>
  </div>
</template>

<script>
import { json2excel } from "js2excel";
import IconButton from "./IconButton";
import ToolbarMenu from "./ToolbarMenu";

export default {
  components: { IconButton, ToolbarMenu },
  props: {
    filterItems: { type: Array, default: () => [] },
    filter: { type: Array, default: () => [] },
    filterBy: { type: String, default: "" },
    items: { type: Function, required: true },
    fileName: { type: String, default: () => "clinax-data" },
  },
  data() {
    return {
      menu: false,
      search: "",
      filterModel: [...this.filter],
      options: [
        {
          text: "Refresh",
          icon: "mdi-refresh",
          on: {
            click: () => {
              this.$emit("refresh");
            },
          },
        },
        {
          text: "Download Excel",
          icon: "mdi-file-excel-outline",
          on: {
            click: () => {
              this.downloadXLS();
            },
          },
        },
      ],
      /* DATE FILTERS */
      clear: false,
    };
  },
  computed: {
    filtered() {
      return !!this.filterModel.length || this.clear;
    },
  },
  watch: {
    filterModel(a) {
      this.$emit("update:filter", a);
    },
  },
  methods: {
    emitFilterChange() {
      this.$emit("filter", {
        filter: this.filterModel,
      });
    },
    downloadXLS() {
      try {
        const data = (this.items && this.items()) || [
          { text: "items not specified" },
        ];
        json2excel({
          data,
          name: this.fileName,
        });
      } catch (e) {
        alert(`export error: ${e.message}`);
      }
    },
  },
};
</script>
