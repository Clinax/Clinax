<template>
  <v-col
    class="py-0"
    v-bind="col"
    :class="{ 'pt-5': !label }"
    :title="label || (textfield && textfield.label)"
  >
    <v-subheader
      v-if="editableHeader || label"
      :class="{ 'error--text': errors && errors[0] != true }"
    >
      <span
        ref="header"
        :contenteditable="editableHeader"
        style="user-select: all;"
        @blur="onHeaderBlur"
      >
        {{ label }}
      </span>
      <v-spacer></v-spacer>
      <v-btn
        v-if="
          removable &&
          (!textfield || (!textfield.readonly && !textfield.disabled))
        "
        color="error"
        x-small
        text
        @click="$emit('remove', label)"
      >
        remove
      </v-btn>
    </v-subheader>

    <component
      :is="field"
      v-if="mask"
      ref="field"
      v-model="model"
      v-mask="mask"
      v-bind="props"
      v-on="listeners"
    >
      <template
        v-if="
          errors && (!textfield || (!textfield.readonly && !textfield.disabled))
        "
        v-slot:append
      >
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon
              :color="errors && errors[0] == true ? 'success' : 'error'"
              v-on="on"
            >
              {{ errors[0] == true ? "mdi-check-circle" : "mdi-alert-circle" }}
            </v-icon>
          </template>
          <span>{{ errors[0] == true ? "All Good" : errors[0] }}</span>
        </v-tooltip>
      </template>
    </component>
    <component
      :is="field"
      v-else
      ref="field"
      v-model="model"
      v-bind="props"
      v-on="listeners"
    >
      <template
        v-if="
          errors && (!textfield || (!textfield.readonly && !textfield.disabled))
        "
        v-slot:append
      >
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon
              :color="errors && errors[0] == true ? 'success' : 'error'"
              v-on="on"
            >
              {{ errors[0] == true ? "mdi-check-circle" : "mdi-alert-circle" }}
            </v-icon>
          </template>
          <span>{{ errors[0] == true ? "All Good" : errors[0] }}</span>
        </v-tooltip>
      </template>
    </component>
  </v-col>
</template>

<script>
import { getReqiredField } from "@pranavraut033/js-utils/utils/regex";

export default {
  props: {
    col: { type: Object, default: () => {} },
    value: { type: [String, Number], default: null },
    label: { type: String, default: "" },
    textfield: { type: Object, default: () => {} },
    inputRules: { type: Array, default: () => [] },
    field: { type: String, default: "v-text-field" },
    mask: { type: String, default: null },
    editableHeader: { type: Boolean, default: false },
    removable: { type: Boolean, default: false },
    required: Boolean,
  },
  data() {
    return {
      model: this.value || "",
      errors: null,
      foucused: true,
    };
  },
  computed: {
    props() {
      const props = {
        ...this.textfield,
        rules: this.rules || [true],
        solo: this.textfield && !this.textfield.solo,
        hideDetails: this.textfield && !this.textfield.hideDetails,
      };
      return props;
    },
    listeners() {
      const listeners = {
        ...this.$listeners,
        blur: this.check,
        change: (ev) => this.$emit("change", ev),
      };
      return listeners;
    },
    rules() {
      const rules = [];
      if (this.required)
        rules.push(
          ...getReqiredField(
            this.label || (this.textfield && this.textfield.label)
          )
        );

      if (this.inputRules && this.inputRules.length) {
        rules.push(...this.inputRules);
      }

      return rules;
    },
  },
  watch: {
    value(a) {
      this.model = a;
    },
    model(a) {
      this.check();
      this.$emit("input", a);
    },
  },
  mounted() {
    // this.$refs.header.addEventListener(
    //   "input",
    //   (a) => {
    //     this.$emit("update:label", a.target.innerText);
    //   },
    //   false
    // );
  },
  methods: {
    check() {
      if (
        (this.model || this.$refs.field.hasError) &&
        !this.$refs.field.isResetting
      )
        this.errors =
          this.rules &&
          this.rules
            .map((ev) => typeof ev === "function" && ev(this.model))
            .filter((ev) => ev !== true);
      else this.errors = null;

      if (this.errors && !this.errors.length) this.errors[0] = true;
    },
    onHeaderBlur(a) {
      let text = a.target.innerText;
      if (!text) {
        text = "Click here to edit title";
        a.target.innerText = text;
      }

      this.$emit("update:label", text);
    },
  },
};
</script>

<style></style>
