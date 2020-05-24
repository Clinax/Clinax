<template>
  <div
    class="d-flex align-center"
    :class="{ 'w-100': $vuetify.breakpoint.smAndDown }"
  >
    <v-menu
      left
      :close-on-content-click="false"
      class="flex-grow-0"
      v-model="menu"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" class="flex-grow-0 mr-3">
          <v-badge :value="filtered" color="transparent" top right>
            <template v-slot:badge>
              <v-icon color="primary">mdi-circle-medium</v-icon>
            </template>
            <icon
              icon="mdi-filter-variant"
              :title="'Filter by' + filterBy || 'status'"
            ></icon>
          </v-badge>
        </v-btn>
      </template>
      <v-card>
        <v-subheader>Filters</v-subheader>
        <v-list class="pt-0">
          <v-list-group v-if="filterItems" :value="!!filterModel.length">
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
                class="elevation-0 flex-column w-100"
                @change="emitFilterChange"
                multiple
              >
                <v-btn
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
      v-model="search"
      class="flex-grow-1"
      label="Search"
      prepend-inner-icon="mdi-magnify"
      @input="(ev) => $emit('search', ev)"
      solo-inverted
      hide-details
      clearable
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
</template>

<script>
import { json2excel } from "js2excel";

export default {
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
