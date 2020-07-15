import Vue from "vue";

import VueMask from "v-mask";
import PortalVue from "portal-vue";
import draggable from "vuedraggable";
import VueClipboard from "vue-clipboard2";
import PerfectScrollbar from "vue2-perfect-scrollbar";

import Icon from "./widgets/Icon";
import InputField from "./widgets/InputField";
import List from "./widgets/List";
import Snackbar from "./widgets/Snackbar";
import WOI from "./widgets/WOI";
import PatientDialog from "./app/widgets/PatientDialog";

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
