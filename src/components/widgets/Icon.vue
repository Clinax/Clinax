<template>
  <v-tooltip v-if="title" bottom>
    <template v-slot:activator="{ on }">
      <span v-if="!fa" v-on="on" v-bind:class="classes">
        <v-icon :color="color" :small="small">{{ icon }}</v-icon>
      </span>
      <i v-else v-on="on" :class="classes" :style="fcolor"></i>
    </template>
    <span>{{ title }}</span>
  </v-tooltip>
  <span v-else v-bind:class="classes" class="d-inline">
    <v-icon v-if="!fa" :color="color" :small="small">{{ icon }}</v-icon>
    <i v-else v-on="on" :class="classes" :style="fcolor"></i>
  </span>
</template>

<script>
export default {
  props: {
    icon: { type: String, required: true },
    title: { type: String, required: false, default: "" },
    color: { type: String, default: "#676767" },
    cls: { type: String, default: "" },
    fa: { type: Boolean, default: false },
    fas: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    outlined: { type: Boolean, default: false },
    "two-tone": { type: Boolean, default: false },
    round: { type: Boolean, default: false },
    sharp: { type: Boolean, default: false },
  },
  data() {
    return {
      faIcon: "fa-" + this.icon,
      classes: {
        fas: this.fas,
        "v-icon mx-2": true,
      },
      fcolor: "",
    };
  },
  created() {
    var t;
    if (this.fa) {
      this.classes[this.faIcon] = true;
      if (this.class) this.classes[this.class] = true;

      if (this.color[0] == "#") {
        this.fcolor = "color: " + this.color;
      } else {
        t = this.color.split(" ");
        this.classes[t[0] + "--text"] = true;
        if (t.length > 1) this.classes["text--" + t[1]] = true;
      }
    } else {
      t = "";

      if (this.outlined) t = "-outlined";
      else if (this["two-tone"]) t = "-two-tone";
      else if (this.round) t = "-round";
      else if (this.sharp) t = "-sharp";

      this.classes = {};
      this.classes["material-icons" + t] = true;
      this.classes[this.cls] = true;
    }
  },
};
</script>
