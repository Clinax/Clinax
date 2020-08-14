<template>
  <v-row no-gutter class="mx-0 align-center" style="flex-wrap: nowrap;">
    <input-field
      v-if="ageField"
      v-model="ageModel"
      v-on="$listeners"
      v-bind="$props"
      :textfield="{
        prependInnerIcon: ' mdi-cake-variant',
        label: 'Age',
        type: 'number',
        autocomplete: 'off',
        max: 130,
        min: 0,
        ...textfield,
      }"
      :col="{ cols: 11 }"
    ></input-field>
    <v-menu
      v-else
      v-model="birthDateMenu"
      :close-on-content-click="false"
      max-width="290px"
      min-width="290px"
      offset-y
      top
    >
      <template v-slot:activator="{ on }">
        <input-field
          v-on="on"
          v-bind="$props"
          :value="model && moment(model).format('ddd, Do MMM YYYY')"
          :textfield="{
            label: 'Date of Birth',
            autocomplete: 'off',
            prependInnerIcon: ' mdi-calendar-star',
            readonly: true,
            ...textfield,
          }"
          :col="{ col: true }"
        ></input-field>
      </template>
      <v-date-picker
        @input="
          (ev) => {
            model = ev;
            birthDateMenu = false;
          }
        "
        :value="model"
        :max="moment().format('YYYY-MM-DD')"
        no-title
      ></v-date-picker>
    </v-menu>
    <icon-button
      class="mt-5 mr-3"
      :disabled="textfield && textfield.disabled"
      icon="mdi-counter"
      @click="ageField = !ageField"
      title="Change between age input and birth date input"
      fab
    >
    </icon-button>
  </v-row>
</template>

<script>
import moment from "moment";
import InputField from "@/components/widgets/InputField";
import { getCookie, setCookie } from "@/modules/cookie";

export default {
  components: { InputField },
  props: { ...InputField.props, age: [String, Number] },
  data() {
    return {
      model: this.value || "",
      birthDateMenu: false,
      ageModel: Number(this.age),
      ageField: getCookie("clinax.field.ageField") == "true",
    };
  },
  watch: {
    age(a) {
      this.ageModel = a;
    },
    ageModel(a) {
      this.$emit("update:age", String(a));
    },
    value(a) {
      this.model = a;
    },
    model(a) {
      this.$emit("input", a);
    },
    ageField(a) {
      if (a) {
        let dateDif = new Date(Date.now() - new Date(this.model).getTime());
        this.ageModel = dateDif.getFullYear() - 1970;
      } else
        this.model = moment(
          String(new Date().getFullYear() - this.ageModel)
        ).format("YYYY-MM-DD");

      setCookie("clinax.field.ageField", a, 100);
    },
  },
};
</script>

<style></style>
