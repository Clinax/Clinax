<template>
  <v-container>
    <v-card>
      <v-toolbar flat dense>
        <v-toolbar-title>Inventory to-do</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-expand-x-transition mode="out-in">
            <v-combobox
              v-if="addFieldActive || fieldFocused"
              key="input"
              v-model="selected"
              :items="allDrugs"
              class="mt-2"
              label="Add Drug"
              input-value="name"
              input-text="name"
              solo-inverted
              hide-details
              dense
              solo
              flat
              autofocus
              @input="addDrug"
              @focus="fieldFocused = true"
              @blur="addFieldActive = fieldFocused = false"
            >
            </v-combobox>
            <v-btn v-else key="button" depressed @click="addFieldActive = true">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-expand-x-transition>
        </v-toolbar-items>
        <v-toolbar-items>
          <v-hover v-slot="{ hover }">
            <v-expand-x-transition>
              <v-text-field
                v-if="hover || searchFocused"
                key="search-input"
                v-model="search"
                label="Search"
                input-value="name"
                class="my-1"
                input-text="name"
                hide-details
                autofocus
                clearable
                dense
                solo
                @focus="searchFocused = true"
                @blur="searchFocused = false"
              >
              </v-text-field>
              <v-btn
                v-else
                key="search-icon"
                icon
                @click="searchFocused = true"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-expand-x-transition>
          </v-hover>
        </v-toolbar-items>
      </v-toolbar>
      <v-data-table
        :items="drugs"
        :headers="headers"
        :search="search"
        :loading="loading"
        sort-by="name"
      >
        <template v-slot:item.potency.200="{ item }">
          <v-checkbox
            v-model="item.potency[200]"
            hide-details
            class="ma-0 pa-0"
            @change="updateEntry(item)"
          ></v-checkbox>
        </template>
        <template v-slot:item.potency.30="{ item }">
          <v-checkbox
            v-model="item.potency[30]"
            class="ma-0 pa-0"
            hide-details
            @change="updateEntry(item)"
          ></v-checkbox>
        </template>
        <template v-slot:item.potency.1m="{ item }">
          <v-checkbox
            v-model="item.potency['1m']"
            class="ma-0 pa-0"
            hide-details
            @change="updateEntry(item)"
          ></v-checkbox>
        </template>
        <template v-slot:item.potency.mt="{ item }">
          <v-checkbox
            v-model="item.potency['mt']"
            class="ma-0 pa-0"
            hide-details
            @change="updateEntry(item)"
          ></v-checkbox>
        </template>
        <template v-slot:item.remove="{ item }">
          <v-btn icon color="error" @click="removeEntry(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import drugs from "@/json/drugs.json";
import { mongoObjectId } from "@pranavraut033/js-utils";

export default {
  data() {
    return {
      searchFocused: false,
      fieldFocused: false,
      addFieldActive: false,
      selected: "",
      search: "",
      loading: false,
      drugs: [],
      headers: [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "30",
          value: "potency.30",
          filterable: false,
        },
        {
          text: "200",
          value: "potency.200",
          filterable: false,
        },
        {
          text: "1M",
          value: "potency.1m",
          filterable: false,
        },
        {
          text: "Mt",
          value: "potency.mt",
          filterable: false,
        },
        {
          text: "Actions",
          value: "remove",
          sortable: false,
          filterable: false,
        },
      ],
    };
  },
  computed: {
    allDrugs() {
      const dgs = this.drugs.map(({ name }) => name);

      return [...drugs].filter((name) => !dgs.includes(name));
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.loading = true;

      this.makeRequest("get", "inventory-todo")
        .then(({ data }) => (this.drugs = data))
        .catch(this.errorHandler)
        .finally(() => (this.loading = false));
    },
    updateEntry(item) {
      this.loading = true;

      const { potency, name } = item;

      this.makeRequest("put", "inventory-todo", { potency, name })
        .catch(this.errorHandler)
        .finally(() => (this.loading = false));
    },
    removeEntry(item) {
      this.loading = true;

      this.makeRequest("delete", "inventory-todo", { id: item.name })
        .then(() => this.removeItem(item))
        .catch(this.errorHandler)
        .finally(() => (this.loading = false));
    },
    addDrug(value) {
      if (!value) return;

      const drug = {
        _id: mongoObjectId(),
        name: value,
        potency: { 30: false, 200: false, "1m": false, mt: false },
      };

      this.drugs.push(drug);

      this.loading = true;
      this.makeRequest("post", "inventory-todo", drug)
        .catch((error) => {
          this.removeItem(drug);
          this.errorHandler(error);
        })
        .finally(() => (this.loading = false));

      this.$nextTick(() => (this.selected = ""));
    },
    removeItem(item) {
      const index = this.drugs.findIndex(({ name }) => name === item.name);

      if (~index) this.drugs.splice(index, 1);
    },
  },
};
</script>
