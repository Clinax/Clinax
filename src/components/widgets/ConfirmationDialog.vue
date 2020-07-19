<template>
  <v-dialog v-model="model">
    <v-card>
      <v-card-title>Are you sure?</v-card-title>
      <v-card-text>
        Unsaved data will be lost and cannot be recovered
      </v-card-text>
      <v-card-action>
        <v-btn color="primary" @click="close()">cancel</v-btn>
        <v-btn outlined @click="$emit('next'), close()">ok</v-btn>
      </v-card-action>
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
