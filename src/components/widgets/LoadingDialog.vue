<template>
  <v-dialog v-model="model" persistent no-click-animation max-width="320">
    <v-card>
      <v-card-actions class="pa-5">
        <v-progress-circular
          color="primary"
          indeterminate
          class="mr-5"
        ></v-progress-circular>
        <span>{{ text }}</span>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import InputModel from "./InputModel";

export default {
  extends: InputModel,
  props: { text: { type: String, default: "Loading" } },
};
</script>

<style></style>
