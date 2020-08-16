<template>
  <v-dialog v-model="model" max-width="340">
    <v-card>
      <v-card-title>Are you sure?</v-card-title>
      <v-card-text>
        Unsaved data will be lost and cannot be recovered.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="close()" depressed>cancel</v-btn>
        <v-btn @click="$emit('next'), close()" text>ok</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Toggleable from "./Toggleable";

export default {
  extends: Toggleable,
  methods: {
    open() {
      this.model = true;
    },
    close() {
      this.model = false;
    },
  },
};
</script>

<style></style>
