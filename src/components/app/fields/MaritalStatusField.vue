<template>
  <input-field
    field="v-select"
    v-model="model"
    v-bind="$props"
    v-on="$listeners"
    :textfield="{
      label: 'Marital Status',
      prependInnerIcon: 'mdi-ring',
      items: [
        'Single',
        'Married',
        'Engaged',
        'Divorced',
        'Widowed',
        'Widower',
        'Separated',
      ],
      ...textfield,
    }"
  ></input-field>
</template>

<script>
import InputField from "@/components/widgets/InputField";

export default {
  components: { InputField },
  props: { ...InputField.props },
  data() {
    return {
      model: this.value || "",
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
