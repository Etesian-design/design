import type { Meta } from '@storybook/vue3';
import { ref } from 'vue';
import { qs } from './q';
const meta: Meta = { title: 'Quasar/Examples', parameters: { layout: 'fullscreen' } };
export default meta;

export const SettingsApp = qs(`<q-layout view="hHh lpR fFf" container style="height:640px;max-width:420px;margin:0 auto">
  <q-header class="hd-plain"><q-toolbar><q-toolbar-title>Settings</q-toolbar-title></q-toolbar></q-header>
  <q-footer><q-toolbar><q-btn flat round :icon="ic('back')" aria-label="Back" /><q-space /><q-btn flat round :icon="ic('menu')" aria-label="Menu" /></q-toolbar></q-footer>
  <q-page-container><q-page>
    <q-list>
      <q-item-label header>Connectivity</q-item-label>
      <q-item tag="label"><q-item-section avatar><q-avatar color="primary" text-color="white" :icon="ic('wifi')" /></q-item-section><q-item-section><q-item-label>Wi-Fi</q-item-label><q-item-label caption>HomeNet</q-item-label></q-item-section><q-item-section side><q-toggle v-model="wifi" aria-label="Wi-Fi" /></q-item-section></q-item>
      <q-item tag="label"><q-item-section avatar><q-avatar color="accent" text-color="white" :icon="ic('bluetooth')" /></q-item-section><q-item-section><q-item-label>Bluetooth</q-item-label><q-item-label caption>Off</q-item-label></q-item-section><q-item-section side><q-toggle v-model="bt" aria-label="Bluetooth" /></q-item-section></q-item>
      <q-item clickable><q-item-section avatar><q-avatar color="positive" text-color="white" :icon="ic('phone')" /></q-item-section><q-item-section><q-item-label>Calls</q-item-label></q-item-section><q-item-section side><q-icon :name="ic('chevron-right')" /></q-item-section></q-item>
      <q-item-label header>Device</q-item-label>
      <q-item clickable><q-item-section avatar><q-avatar color="orange" text-color="white" :icon="ic('battery')" /></q-item-section><q-item-section><q-item-label>Battery</q-item-label><q-item-label caption>82%, power save off</q-item-label></q-item-section><q-item-section side><q-icon :name="ic('chevron-right')" /></q-item-section></q-item>
      <q-item><q-item-section avatar><q-avatar color="purple" text-color="white" :icon="ic('photo')" /></q-item-section><q-item-section><q-item-label>Brightness</q-item-label><q-slider v-model="bright" :min="0" :max="100" /></q-item-section></q-item>
      <q-item clickable><q-item-section avatar><q-avatar color="grey-8" text-color="white" :icon="ic('lock')" /></q-item-section><q-item-section><q-item-label>Security</q-item-label></q-item-section><q-item-section side><q-icon :name="ic('chevron-right')" /></q-item-section></q-item>
    </q-list>
  </q-page></q-page-container></q-layout>`, () => ({ wifi: ref(true), bt: ref(false), bright: ref(60) }), { name: 'Settings app (N9 style)' });

const mails = [
  { from: 'Anna Virtanen', subject: 'Trip to Lapland', snippet: 'I booked the cabin for the second week of...', time: '10:45', unread: true, c: 'primary' },
  { from: 'Mikko Laine', subject: 'Re: band practice', snippet: 'Thursday works for me, bring the...', time: '09:12', unread: true, c: 'positive' },
  { from: 'Store', subject: 'Your receipt', snippet: 'Thank you for your purchase of...', time: 'Yesterday', unread: false, c: 'orange' },
  { from: 'Sara K', subject: 'Photos', snippet: 'Here are the photos from Saturday', time: 'Mon', unread: false, c: 'purple' },
];
export const EmailApp = qs(`<q-layout view="hHh lpR fFf" container style="height:640px;max-width:420px;margin:0 auto">
  <q-header><q-toolbar><q-toolbar-title>Inbox <q-badge color="white" text-color="primary" class="q-ml-sm">2</q-badge></q-toolbar-title></q-toolbar>
    <q-toolbar><q-input dense outlined class="full-width" placeholder="Search" :model-value="''"><template #prepend><q-icon :name="ic('search')" /></template></q-input></q-toolbar></q-header>
  <q-footer><q-toolbar><q-btn flat round :icon="ic('refresh')" aria-label="Refresh" /><q-space /><q-btn flat round :icon="ic('edit')" aria-label="Compose" /><q-space /><q-btn flat round :icon="ic('menu')" aria-label="Menu" /></q-toolbar></q-footer>
  <q-page-container><q-page>
    <q-list separator>
      <q-slide-item v-for="m in mails" :key="m.subject" right-color="negative"><template #right>Delete</template>
        <q-item clickable><q-item-section avatar><q-avatar :color="m.c" text-color="white">{{ m.from.split(' ').map(w => w[0]).join('').slice(0,2) }}</q-avatar></q-item-section>
          <q-item-section><q-item-label :class="m.unread ? 'text-weight-bold' : ''" style="font-size:16px">{{ m.from }}</q-item-label><q-item-label>{{ m.subject }}</q-item-label><q-item-label caption lines="1">{{ m.snippet }}</q-item-label></q-item-section>
          <q-item-section side top><q-item-label caption>{{ m.time }}</q-item-label></q-item-section></q-item>
      </q-slide-item>
    </q-list>
  </q-page></q-page-container></q-layout>`, () => ({ mails }), { name: 'Email app' });
