import Vue from "vue";

import VueMask from "v-mask";
import VueClipboard from "vue-clipboard2";
import draggable from "vuedraggable";
import PerfectScrollbar from "vue2-perfect-scrollbar";

import Icon from "./Icon";
import InputField from "./InputField";
import List from "./List";
import Snackbar from "./Snackbar";
import PatientDialog from "./PatientDialog";
import { WebCam } from "vue-web-cam";
import PortalVue from "portal-vue";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";

Vue.use(PortalVue);
Vue.use(VueMask);
Vue.use(VueClipboard);
Vue.use(PerfectScrollbar);
Vue.component("draggable", draggable);
Vue.component("web-cam", WebCam);

Vue.component("icon", Icon);
Vue.component("list", List);
Vue.component("snackbar", Snackbar);
Vue.component("input-field", InputField);
Vue.component("patient-dialog", PatientDialog);
