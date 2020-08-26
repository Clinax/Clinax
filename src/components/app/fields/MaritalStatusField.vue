<template>
  <input-field
    v-model="model"
    field="v-select"
    v-bind="$props"
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
    v-on="$listeners"
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
