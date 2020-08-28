<template>
  <v-dialog v-model="model" max-width="340">
    <v-card>
      <v-card-title>Are you sure?</v-card-title>
      <v-card-text>
        Unsaved data will be lost and cannot be recovered.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" depressed @click="close()">cancel</v-btn>
        <v-btn text @click="$emit('next'), close()">ok</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import InputModel from "./InputModel";

export default {
  extends: InputModel,
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
