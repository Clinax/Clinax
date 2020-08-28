<template>
  <input-field
    v-model="model"
    field="v-select"
    :textfield="{
      label: 'Gender',
      items: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
        { text: 'Other', value: 'non-binary' },
      ],
      prependInnerIcon: (model && `mdi-gender-${model}`) || 'mdi-help',
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
