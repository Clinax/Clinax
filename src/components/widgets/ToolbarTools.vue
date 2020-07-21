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
            v-on="on"
            :badge="filtered"
            :title="'Filter by ' + filterBy || 'status'"
            class="flex-grow-0 mr-3"
            icon="mdi-filter-variant"
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
                  @change="emitFilterChange"
                  multiple
                >
                  <v-btn
                    text
                    class="border-0"
                    v-for="item in filterItems"
                    :key="item.text || item"
                    :value="item.value || item.text || item"
                  >
                    <v-layout class="text-left">
                      <v-icon
                        v-if="item.icon"
                        v-text="item.icon"
                        :color="item.color"
                        class="mx-2 flex-grow-0"
                        small
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
              @click="
                filterModel = [];
                currencyFilterModel = '';
                emitFilterChange(true);
              "
              block
              small
              text
            >
              clear filters
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-text-field
        v-if="!isMobile"
        v-model="search"
        class="flex-grow-1"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        @input="(ev) => $emit('search', ev)"
        solo-inverted
        hide-details
        clearable
        dense
        flat
        solo
      ></v-text-field>

      <v-menu left class="flex-grow-0">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" class="flex-grow-0 mr-0">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-subheader>Menu</v-subheader>
          <v-list class="pt-0">
            <v-list-item @click="$emit('refresh')">
              <v-list-item-action>
                <v-icon>mdi-refresh</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Refresh</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="downloadXLS">
              <v-list-item-action>
                <v-icon>mdi-file-excel-outline</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Download Excel</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>
    <div v-if="isMobile" style="left: 1rem; position: absolute; right: 1rem;">
      <v-text-field
        v-model="search"
        class="flex-grow-1 my-2"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        @input="(ev) => $emit('search', ev)"
        solo-inverted
        hide-details
        clearable
        flat
        solo
      ></v-text-field>
    </div>
  </div>
</template>

<script>
import { json2excel } from "js2excel";
import IconButton from "./IconButton";

export default {
  components: { IconButton },
  props: {
    filterItems: Array,
    filter: { type: Array, default: () => [] },
    filterBy: String,
    items: Function,
    fileName: { type: String, default: () => "clinax-data" },
  },
  data() {
    return {
      menu: false,
      search: "",
      filterModel: [...this.filter],

      /* DATE FILTERS */
      clear: false,
    };
  },
  watch: {
    filterModel(a) {
      this.$emit("update:filter", a);
    },
  },
  computed: {
    filtered() {
      return this.filterModel.length || this.clear;
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
        let data = (this.items && this.items()) || [
          { text: "items not specified" },
        ];
        json2excel({
          data,
          name: this.fileName,
        });
      } catch (e) {
        alert("export error: " + e.message);
      }
    },
  },
};
</script>
