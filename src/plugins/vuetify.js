import Vue from "vue";
import Vuetify, {
  VTextField,
  VTextarea,
  VCombobox,
  VSlider,
  VAutocomplete,
  VSelect,
} from "vuetify/lib";

Vue.use(Vuetify, {
  components: {
    VTextField,
    VTextarea,
    VCombobox,
    VSelect,
    VSlider,
    VAutocomplete,
  },
});

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#0779e4",
        secondary: "#4cbbb9",
        accent: "#eff3c6",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
      },
    },
  },
});
