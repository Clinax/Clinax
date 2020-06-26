<template>
  <v-footer
    v-if="saving || saved || changed"
    :class="{ 'grey darken-2': saving, warning: changed && !(saving || saved) }"
    :dark="!changed"
    inset
    app
  >
    <v-icon v-if="changed" small> mdi-alert-circle</v-icon>
    <v-spacer></v-spacer>
    <v-progress-circular
      indeterminate
      color="#ffffffaf"
      v-if="saving"
      size="12"
      width="2"
    ></v-progress-circular>
    <span class="mx-3">
      <template v-if="saving">Saving...</template>
      <template v-else-if="changed">unsaved</template>
      <template v-else> Saved!</template>
    </span>
  </v-footer>
</template>

<script>
export default {
  props: {
    saving: Boolean,
    saved: Boolean,
    changed: Boolean,
  },
};
</script>
