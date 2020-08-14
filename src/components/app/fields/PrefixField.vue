<template>
  <input-field
    v-model="model"
    v-on="$listeners"
    v-bind="$props"
    field="v-select"
    :label="inlineLabel ? null : 'Prefix'"
    :textfield="{
      label: inlineLabel ? 'Prefix' : '',
      items: prefixes,
      ...textfield,
    }"
    @input="
      (model === '- Less' &&
        ((prefixes = ['Mr', 'Mrs', 'Ms', '+ More']), (model = null))) ||
        (model === '+ More' && ((prefixes = namePrefixes), (model = null)))
    "
  >
  </input-field>
</template>

<script>
import namePrefixes from "@/json/name-prefixes.json";
import InputField from "@/components/widgets/InputField";

export default {
  components: { InputField },
  props: { ...InputField.props, inlineLabel: Boolean },
  data() {
    return {
      model: this.value || "",
      prefixes: ["Mr", "Mrs", "Ms", "+ More"],
      namePrefixes,
    };
  },
  watch: {
    value(a) {
      this.model = a;
    },
    model(a) {
      this.$emit("input", a);
    },
  },
};
</script>
