<template>
  <v-col
    class="py-0"
    v-bind="col"
    :class="{ 'pt-5': !label }"
    :title="label || textfield.label"
  >
    <v-subheader
      v-if="editableHeader || label"
      :class="{ 'error--text': errors && errors[0] != true }"
    >
      <span ref="header" :contenteditable="editableHeader" @blur="onHeaderBlur">
        {{ label }}
      </span>
      <v-spacer></v-spacer>
      <v-btn
        v-if="
          removable &&
          (!textfield || (!textfield.readonly && !textfield.disabled))
        "
        color="error"
        @click="$emit('remove', label)"
        x-small
        text
      >
        remove
      </v-btn>
    </v-subheader>

    <component
      v-on="on"
      v-bind:is="field || 'v-text-field'"
      v-model="model"
      v-bind="textfield"
      :rules="rules || [true]"
      @blur="check"
      @change="(ev) => $emit('change', ev)"
      hide-details
      solo
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
              v-on="on"
              :color="errors && errors[0] == true ? 'success' : 'error'"
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
import { getReqiredField } from "../modules/regex";

export default {
  props: {
    col: Object,
    value: [String, Number],
    label: String,
    textfield: Object,
    required: Boolean,
    inputRules: Array,
    field: String,
    mask: String,
    on: Object,
    editableHeader: { type: Boolean, default: false },
    removable: { type: Boolean, default: false },
  },
  data() {
    return {
      model: this.value || "",
      errors: null,
      foucused: true,
    };
  },
  computed: {
    rules() {
      let rules = [];
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
  methods: {
    check() {
      this.errors =
        this.rules &&
        this.rules
          .map((ev) => typeof ev === "function" && ev(this.model))
          .filter((ev) => ev != true);

      if (this.errors && !this.errors.length) this.errors[0] = true;
    },
    onHeaderBlur(a) {
      let text = a.target.innerText;
      if (!text) text = a.target.innerText = "Click here to edit title";

      this.$emit("update:label", text);
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
};
</script>

<style></style>
