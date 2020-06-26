<template>
  <v-snackbar
    v-model="model"
    :color="mColor"
    :right="!center"
    :center="center"
    :top="top"
  >
    <slot>
      <v-layout align-center>
        <v-expand-x-transition>
          <v-progress-circular
            v-if="loading"
            indeterminate
            size="28"
          ></v-progress-circular>
        </v-expand-x-transition>
        <span v-html="(loading ? '&emsp;' : '') + message"></span>
        <v-spacer></v-spacer>
        <v-expand-x-transition>
          <v-btn
            class="m-0"
            v-if="!loading"
            text
            :color="mBtnColor"
            @click.native="(callback && callback()) || (model = false)"
          >
            <span v-text="btnText || 'Close'"></span>
          </v-btn>
        </v-expand-x-transition>
      </v-layout>
    </slot>
  </v-snackbar>
</template>

<script>
import ComponentWithModel from "./ComponentWithModel";

export default {
  extends: ComponentWithModel,

  props: {
    message: { type: String, default: "" },
    error: { type: Boolean, default: false },
    color: { type: String, default: "dark" },
    loading: Boolean,
    success: { type: Boolean, default: false },
    center: { type: Boolean, default: false },
    top: { type: Boolean, default: false },

    btnColor: { type: String, default: "primary" },
    btnText: { type: String, default: "Close" },
    callback: Function,
  },
  data() {
    return {
      mColor: this.color,
      mBtnColor: this.btnColor,
    };
  },
  methods: {
    init() {
      if (this.success) {
        this.mColor = "success";
        this.mBtnColor = "white";
        return;
      }
      if (this.error) {
        this.mColor = "error";
        this.mBtnColor = "white";
        return;
      }

      this.mColor = "dark";
      this.mBtnColor = "primary";
    },
  },
  watch: {
    error() {
      this.init();
    },
    success() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
};
</script>
