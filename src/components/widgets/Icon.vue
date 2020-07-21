<template>
  <v-tooltip v-if="title" bottom>
    <template v-slot:activator="{ on }">
      <v-badge :color="dotColor" :value="badge" dot>
        <span v-on="on" :class="classes" class="d-inline">
          <i v-if="fa" :class="classes" :style="fcolor"></i>
          <v-icon v-else v-bind="$props">{{ icon }}</v-icon>
        </span>
      </v-badge>
    </template>
    <span>{{ title }}</span>
  </v-tooltip>
  <span v-else :class="classes" class="d-inline">
    <i v-if="fa" :class="classes" :style="fcolor"></i>
    <v-icon v-else v-bind="$props">{{ icon }}</v-icon>
  </span>
</template>

<script>
import { VIcon } from "vuetify/lib";

export default {
  props: {
    ...VIcon.props,
    badge: { type: Boolean, default: false },
    dotColor: { type: String, default: "primary" },
    icon: { type: String, required: true },
    title: { type: String, required: false, default: "" },
    cls: { type: String, default: "" },
    fa: { type: Boolean, default: false },
    fas: { type: Boolean, default: false },
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
