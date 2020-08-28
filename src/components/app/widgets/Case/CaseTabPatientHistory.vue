<template>
  <tab-item
    :updates="updates"
    :param-id="patient._id"
    :method="patient.case.new ? 'put' : 'post'"
    @saved="saved"
    @cancel="reset"
    @changed:updates="(a) => $emit('changed', a)"
  >
    <input-field
      v-model="fields.pastHistory"
      label="Past History"
      v-bind="fieldProps"
    >
    </input-field>
    <input-field
      v-model="fields.familyHistory"
      label="Family History"
      v-bind="fieldProps"
    >
    </input-field>
    <input-field
      v-model="fields.medicalNote"
      label="Medical note"
      v-bind="fieldProps"
    >
    </input-field>
  </tab-item>
</template>

<script>
import { clone, changedFields } from "@pranavraut033/js-utils/utils/object";
import Patient from "@/models/Patient";
import TabItem from "./TabItem";

export default {
  components: { TabItem },
  props: {
    patient: { type: Object, required: true },
  },
  data() {
    return {
      fields: {},
      initialState: {},
      fieldProps: {
        field: "v-textarea",
        textfield: {
          placeholder: "Start Typing...",
          autoGrow: true,
          rows: 3,
        },
      },
    };
  },
  computed: {
    updates() {
      return changedFields(this.initialState, this.fields);
    },
  },
  watch: {
    patient() {
      this.reset();
    },
  },
  mounted() {
    this.reset();
  },
  methods: {
    reset() {
      const _case = this.patient.case;
      const fields = {
        pastHistory: _case.pastHistory,
        familyHistory: _case.familyHistory,
        medicalNote: _case.medicalNote,
      };
      this.fields = fields;
      this.initialState = clone(fields);
    },
    saved() {
      const patient = new Patient(this.patient);
      Object.assign(patient.case, this.fields);
      this.$emit("update:patient", patient);
    },
  },
};
</script>
