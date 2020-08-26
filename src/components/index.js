import Vue from "vue";

import VueMask from "v-mask";
import PortalVue from "portal-vue";
import draggable from "vuedraggable";
import VueClipboard from "vue-clipboard2";
import PerfectScrollbar from "vue2-perfect-scrollbar";

import { RecycleScroller } from "vue-virtual-scroller";
import WOI from "./widgets/WOI";
import Icon from "./widgets/Icon";
import List from "./widgets/List";
import Snackbar from "./widgets/Snackbar";
import InputField from "./widgets/InputField";
import IconButton from "./widgets/IconButton";
import ResponsiveContainer from "./widgets/ResponsiveContainer";

import PatientDialog from "./app/widgets/PatientDialog";

import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

Vue.use(VueMask);
Vue.use(PortalVue);
Vue.use(VueClipboard);
Vue.use(PerfectScrollbar);

Vue.component("draggable", draggable);
Vue.component("RecycleScroller", RecycleScroller);

Vue.component("icon", Icon);
Vue.component("woi", WOI);
Vue.component("list", List);
Vue.component("snackbar", Snackbar);
Vue.component("icon-button", IconButton);
Vue.component("input-field", InputField);
Vue.component("patient-dialog", PatientDialog);
Vue.component("responsive-container", ResponsiveContainer);
