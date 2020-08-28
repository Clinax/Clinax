<template>
  <v-card-text v-if="!value && !addAddressModel" class="text-center">
    <v-btn
      v-if="field && field.textfield && !field.textfield.disabled"
      color="primary"
      depressed
      small
      @click="addAddressModel = true"
    >
      + Address
    </v-btn>
  </v-card-text>
  <v-form v-else ref="addressForm" lazy-validation @submit.prevent="submit">
    <v-card-text :class="contentClass">
      <input-field
        v-model="addressModel.street"
        v-bind="field"
        field="v-textarea"
        :label="inlineLabels ? 'Street' : ''"
        :textfield="{
          rows: 3,
          label: inlineLabels ? '' : 'Street',
          autoGrow: true,
          prependInnerIcon: 'mdi-map',
          ...((field && field.textfield) || {}),
        }"
        @input="emitInput"
      ></input-field>
      <v-row class="mx-0">
        <input-field
          v-model="addressModel.area"
          v-bind="field"
          field="v-combobox"
          :label="inlineLabels ? 'Area' : ''"
          :col="{ md: 6, xs: 12 }"
          :textfield="{
            loading: loadingPrefetch,
            items: areas,
            label: inlineLabels ? '' : 'Area',
            prependInnerIcon: 'mdi-image-filter-hdr',
            ...((field && field.textfield) || {}),
          }"
          required
          @input="emitInput"
        ></input-field>
        <input-field
          v-model="addressModel.pincode"
          v-bind="field"
          field="v-combobox"
          :label="inlineLabels ? 'Pincode' : ''"
          :col="{ md: 6, xs: 12 }"
          :input-rules="[(v) => String(v).length == 6 || 'Invalid Pincode']"
          :textfield="{
            items: pins,
            loading: loadingPrefetch,
            label: inlineLabels ? '' : 'Pincode',
            prependInnerIcon: 'mdi-map-marker-radius-outline',
            type: 'number',
            ...((field && field.textfield) || {}),
          }"
          required
          @input="emitInput"
        ></input-field>
      </v-row>
    </v-card-text>
    <v-card-actions v-if="!hideSubmit">
      <v-spacer></v-spacer>
      <v-btn color="primary" type="submit">finish</v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import InputField from "@/components/widgets/InputField";
import Address from "@/models/Address";

export default {
  components: { InputField },
  props: {
    field: { type: Object, default: null },

    // model
    value: { type: Object, default: null },

    // UIs
    contentClass: { type: String, default: null },
    inlineLabels: { type: String, default: null },
    hideSubmit: Boolean,
    addAddress: Boolean,
    loadingPrefetch: Boolean,
    // prefills
    areas: { type: Array, default: () => [] },
    pins: { type: Array, default: () => [] },
  },
  data() {
    return {
      addressModel: new Address(this.value),

      addAddressModel: this.addAddress,
      emitInput: () => {
        this.$emit("input", new Address(this.addressModel));
      },
    };
  },
  watch: {
    value(a) {
      this.addressModel = new Address(a);
    },
  },
  methods: {
    Address,
    validate() {
      return this.$refs.addressForm.validate();
    },
    reset() {
      return this.$refs.addressForm.reset();
    },
    submit() {
      // eslint-disable-next-line no-console
      if (this.validate()) this.$emit("submit", new Address(this.addressModel));
      else this.showSnackbar("Please enter all the details");
    },
  },
};
</script>
