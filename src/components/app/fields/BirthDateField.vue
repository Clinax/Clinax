<template>
  <v-row no-gutter class="mx-0 align-center" style="flex-wrap: nowrap;">
    <input-field
      v-if="fieldToggle"
      v-model="ageModel"
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
          :value="moment(model).format('ddd, Do MMM YYYY')"
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
      @click="fieldToggle = !fieldToggle"
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
const FIELD_TOGGLE = "clinax.fields.birthDate.fieldToggle";

export default {
  components: { InputField },
  props: { ...InputField.props, value: [String, Date] },
  data() {
    return {
      model: this.value || "",
      birthDateMenu: false,
      ageModel: Number(this.age),
      fieldToggle: getCookie(FIELD_TOGGLE) == "true",
    };
  },
  computed: {
    rtAge() {
      let dateDif = new Date(Date.now() - new Date(this.model).getTime());
      return dateDif.getFullYear() - 1970;
    },
    rtBirthDate() {
      let momentInstance;
      let bYear = new Date().getFullYear() - this.ageModel;

      //! FIX for infinite loop !!DO NOT REMOVE!!
      if (
        new Date(this.model).getMonth() > new Date().getMonth() ||
        (new Date(this.model).getMonth() == new Date().getMonth() &&
          new Date(this.model).getDay() > new Date().getDay())
      ) {
        bYear--;
      }

      if (this.model) {
        var d = new Date(this.model);
        d.setFullYear(bYear);
        momentInstance = moment(d);
      } else momentInstance = moment(String(bYear));

      return momentInstance.format("YYYY-MM-DD");
    },
  },
  watch: {
    ageModel() {
      if (
        new Date(this.rtBirthDate).getFullYear() !=
        new Date(this.model).getFullYear()
      )
        this.$emit("input", this.rtBirthDate);
    },
    value(a) {
      this.model = a;
      this.ageModel = this.rtAge;
    },
    model(a) {
      this.$emit("input", a);
    },
    fieldToggle(a) {
      if (a) this.ageModel = this.rtAge;
      else this.model = this.rtBirthDate;

      setCookie(FIELD_TOGGLE, a, 100);
    },
  },
};
</script>

<style></style>
