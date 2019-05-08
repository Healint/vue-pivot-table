// Import vue components
import Pivot from './Pivot';
import PivotTable from './PivotTable';

// Declare install function executed by Vue.use()
export default function install (Vue, options) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('pivot', Pivot);
  Vue.component('pivot-table', PivotTable);
}

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// Create module definition for Vue.use()
const plugin = { install };

// To allow use as module (npm/webpack/etc.) export component
export const DynamicPivotTable = Pivot;
export const StaticPivotTable = PivotTable;

