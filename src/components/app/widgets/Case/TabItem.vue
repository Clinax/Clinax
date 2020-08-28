<template>
  <v-container>
    <div>
      <slot></slot>
    </div>
    <v-card-actions v-if="!hideActions" class="mt-5 mx-1">
      <v-spacer></v-spacer>
      <v-btn v-if="anyUpdates" outlined @click="cancel">Cancel</v-btn>
      <v-btn
        color="primary"
        :disabled="!anyUpdates || loadingModel"
        :loading="loadingModel"
        @click="save"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-container>
</template>

<script>
import { isEmpty } from "@pranavraut033/js-utils/utils/object";

export default {
  props: {
    paramId: { type: String, required: true },
    updates: { type: Object, required: true },
    hideActions: { type: Boolean, default: false },
    validation: { type: Function, default: null },
    method: {
      type: String,
      default: "post",
      validation: (v) => ["post", "put"].includes(v),
      required: false,
    },
    path: {
      type: String,
      default: "case",
      validation: (v) => ["case", "followUp"].includes(v),
      required: false,
    },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      loadingModel: false,
    };
  },
  computed: {
    anyUpdates() {
      return !isEmpty(this.updates);
    },
  },
  watch: {
    anyUpdates(a) {
      this.$emit("changed:updates", a);
    },
    loadingModel(a) {
      this.$emit("update:loading", a);
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save() {
      if (this.loadingModel) return;

      if (!this.validation || this.validation()) {
        this.loadingModel = true;
        this.makeRequest(this.method, this.path, {
          id: this.paramId,
          ...this.updates,
        })
          .then(({ data }) => {
            this.showSnackbar("Saved");
            this.$emit("saved", data);
          })
          .catch(this.errorHandler)
          .finally(() => (this.loadingModel = false));
      }
    },
  },
};
</script>

<style></style>
