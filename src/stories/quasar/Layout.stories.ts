import type { Meta } from '@storybook/vue3-vite';
import { qs, both } from './q';
const meta: Meta = { title: 'Quasar/Components/Layout & navigation', ...both, parameters: { docs: { description: { component: 'Quasar layout components in the Etesian theme. N9 bottom toolbar = QFooter + QToolbar; page header = QHeader (accent) or `class="hd-plain"`.' } } } };
export default meta;

const layout = (footer = true) => `<q-layout view="hHh lpR fFf" container style="height:360px" class="rounded-borders">
  <q-header><q-toolbar><q-toolbar-title>Settings</q-toolbar-title><q-btn flat round :icon="ic('search')" aria-label="Search" /></q-toolbar></q-header>
  ${footer ? `<q-footer><q-toolbar><q-btn flat round :icon="ic('back')" aria-label="Back" /><q-space /><q-btn flat round :icon="ic('menu')" aria-label="Menu" /></q-toolbar></q-footer>` : ''}
  <q-page-container><q-page class="q-pa-md"><p>Page content. Light type, sentence case, flat surfaces.</p></q-page></q-page-container></q-layout>`;
export const Layout = qs(layout());
export const HeaderPlain = qs(`<q-layout view="hHh lpR fFf" container style="height:200px"><q-header class="hd-plain"><q-toolbar><q-toolbar-title>Inbox</q-toolbar-title></q-toolbar></q-header><q-page-container><q-page class="q-pa-md">Plain header with divider</q-page></q-page-container></q-layout>`, undefined, { name: 'QHeader (plain)' });
export const Drawer = qs(`<q-layout view="hHh Lpr fFf" container style="height:300px"><q-header><q-toolbar><q-toolbar-title>Drawer</q-toolbar-title></q-toolbar></q-header>
  <q-drawer :model-value="true" bordered :width="200" :breakpoint="0"><q-list><q-item clickable active><q-item-section>Inbox</q-item-section></q-item><q-item clickable><q-item-section>Sent</q-item-section></q-item><q-item clickable><q-item-section>Drafts</q-item-section></q-item></q-list></q-drawer>
  <q-page-container><q-page class="q-pa-md">Content</q-page></q-page-container></q-layout>`, undefined, { name: 'QDrawer' });
export const Toolbar = qs(`<q-toolbar class="bg-primary text-white"><q-toolbar-title>Toolbar title</q-toolbar-title><q-btn flat label="Done" /></q-toolbar>`, undefined, { name: 'QToolbar / QToolbarTitle' });
export const Bar = qs(`<q-bar><div>Operator</div><q-space /><div>12:45</div></q-bar>`, undefined, { name: 'QBar (status bar)' });
export const Breadcrumbs = qs(`<q-breadcrumbs><q-breadcrumbs-el label="Home" href="#" /><q-breadcrumbs-el label="Settings" href="#" /><q-breadcrumbs-el label="Display" /></q-breadcrumbs>`, undefined, { name: 'QBreadcrumbs' });
export const Tabs = qs(`<div class="q-gutter-md"><q-tabs :model-value="'all'" align="left"><q-tab name="all" label="All" /><q-tab name="unread" label="Unread" /><q-tab name="flagged" label="Flagged" /></q-tabs>
  <q-tab-panels :model-value="'all'"><q-tab-panel name="all">All messages panel</q-tab-panel></q-tab-panels>
  <q-tabs :model-value="'a'" class="bg-primary text-white"><q-route-tab name="a" label="Route tab" to="/" exact /><q-tab name="b" label="Other" /></q-tabs></div>`, undefined, { name: 'QTabs / QTab / QRouteTab / QTabPanels' });
export const Pagination = qs(`<q-pagination :model-value="3" :max="8" direction-links boundary-links />`, undefined, { name: 'QPagination' });
export const Stepper = qs(`<q-stepper :model-value="2" header-nav animated><q-step :name="1" title="Account" :done="true">Step 1</q-step><q-step :name="2" title="Sync">Choose what to sync.<q-stepper-navigation><q-btn color="primary" label="Continue" /><q-btn flat label="Back" class="q-ml-sm" /></q-stepper-navigation></q-step><q-step :name="3" title="Done">Done</q-step></q-stepper>`, undefined, { name: 'QStepper / QStep' });
export const Splitter = qs(`<q-splitter :model-value="40" style="height:120px;border:1px solid var(--hd-c-divider)"><template #before><div class="q-pa-md">Folders</div></template><template #after><div class="q-pa-md">Messages</div></template></q-splitter>`, undefined, { name: 'QSplitter' });
export const ScrollArea = qs(`<q-scroll-area style="height:120px;max-width:320px;border:1px solid var(--hd-c-divider)"><div v-for="n in 20" :key="n" class="q-px-md q-py-xs">Row {{ n }}</div></q-scroll-area>`, undefined, { name: 'QScrollArea' });
export const Space = qs(`<div class="row" style="border:1px dashed var(--hd-c-divider)"><span>Left</span><q-space /><span>Right</span></div>`, undefined, { name: 'QSpace' });
export const Separator = qs(`<p>Above</p><q-separator /><p>Below</p><q-separator vertical inset style="height:24px;display:inline-block" />`, undefined, { name: 'QSeparator' });
