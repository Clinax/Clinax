import Vue from "vue";

import VueMask from "v-mask";
import VueClipboard from "vue-clipboard2";
import draggable from "vuedraggable";
import PerfectScrollbar from "vue2-perfect-scrollbar";

import Icon from "./Icon";
import InputField from "./InputField";
import List from "./List";
import Snackbar from "./Snackbar";
import WOI from "./WOI";
import PatientDialog from "./PatientDialog";
import PortalVue from "portal-vue";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";

Vue.use(VueMask);
Vue.use(PortalVue);
Vue.use(VueClipboard);
Vue.use(PerfectScrollbar);

Vue.component("draggable", draggable);

Vue.component("icon", Icon);
Vue.component("woi", WOI);
Vue.component("list", List);
Vue.component("snackbar", Snackbar);
Vue.component("input-field", InputField);
Vue.component("patient-dialog", PatientDialog);
