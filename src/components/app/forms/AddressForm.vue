<template>
  <v-card-text
    v-if="!area && !street && !pincode && !addAddressModel"
    class="text-center"
  >
    <v-btn
      v-if="field && field.textfield && !field.textfield.disabled"
      @click="addAddressModel = true"
      color="primary"
      depressed
      small
    >
      + Address
    </v-btn>
  </v-card-text>
  <v-form v-else ref="addressForm" lazy-validation @submit.prevent="submit">
    <v-card-text :class="contentClass">
      <input-field
        v-bind="field"
        field="v-textarea"
        v-model="streetModel"
        :label="inlineLabels ? 'Street' : ''"
        :textfield="{
          rows: 3,
          label: inlineLabels ? '' : 'Street',
          autoGrow: true,
          prependInnerIcon: 'mdi-map',
          ...((field && field.textfield) || {}),
        }"
      ></input-field>
      <v-row class="mx-0">
        <input-field
          v-bind="field"
          v-model="areaModel"
          field="v-combobox"
          :label="inlineLabels ? 'Area' : ''"
          :col="{ md: 6, xs: 12 }"
          :textfield="{
            items: areas,
            label: inlineLabels ? '' : 'Area',
            prependInnerIcon: 'mdi-image-filter-hdr',
            ...((field && field.textfield) || {}),
          }"
          required
        ></input-field>
        <input-field
          v-bind="field"
          field="v-combobox"
          v-model="pincodeModel"
          :label="inlineLabels ? 'Pincode' : ''"
          :col="{ md: 6, xs: 12 }"
          :input-rules="[(v) => String(v).length == 6 || 'Invalid Pincode']"
          :textfield="{
            items: pins,
            type: 'number',
            label: inlineLabels ? '' : 'Pincode',
            prependInnerIcon: 'mdi-map-marker-radius-outline',
            ...((field && field.textfield) || {}),
          }"
          required
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

var emitUpdate = function (field, value, event = "update") {
  if (field) this.$emit(`update:${field}`, value);

  this.$emit(event, {
    street: this.streetModel,
    area: this.areaModel,
    pincode: this.pincodeModel,
  });
};

var makeListeners = function (field) {
  let listeners = {};
  let modelName = `${field}Model`;

  this.$watch(field, function (a) {
    this[modelName] = a;
  });

  this.$watch(modelName, function (a) {
    this.$emit(`update:${field}`, a);
  });

  return listeners;
};

export default {
  components: { InputField },
  props: {
    field: { type: Object, required: false },

    // model
    street: String,
    area: String,
    pincode: String,

    // UIs and prefills
    inlineLabels: String,
    contentClass: String,
    hideSubmit: Boolean,
    areas: Array,
    pins: Array,
    addAddress: Boolean,
  },
  data() {
    return {
      streetModel: this.street,
      areaModel: this.area,
      pincodeModel: this.pincode,
      addAddressModel: this.addAddress,
    };
  },
  methods: {
    validate() {
      return this.$refs.addressForm.validate();
    },
    submit() {
      // eslint-disable-next-line no-console
      if (this.validate()) emitUpdate(null, null, "submit");
      else this.showSnackbar("Please enter all the details");
    },
  },

  mounted() {
    makeListeners = makeListeners.bind(this);
    emitUpdate = emitUpdate.bind(this);
    makeListeners("street");
    makeListeners("area");
    makeListeners("pincode");
    makeListeners("addAddress");
  },
};
</script>
