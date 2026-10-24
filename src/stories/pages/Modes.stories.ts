import type { Meta, StoryObj } from '@storybook/vue3-vite';
import * as Ex from './Examples.stories';
import * as QEx from '../quasar/Examples.stories';
import HdToolBar from '../../components/HdToolBar.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';
import HdListItem from '../../components/HdListItem.vue';
import HdButton from '../../components/HdButton.vue';
import HdInfoBanner from '../../components/HdInfoBanner.vue';
import HdPageHeader from '../../components/HdPageHeader.vue';
import HdStatusBar from '../../components/HdStatusBar.vue';

const meta: Meta = { title: 'Examples/All colour modes', parameters: { layout: 'fullscreen' }, globals: { mode: 'all' } };
export default meta;
type S = StoryObj;
const all = { globals: { mode: 'all' } };

export const SurfacesAllModes: S = {
  name: 'Surfaces',
  ...all,
  render: () => ({
    components: { HdToolBar, HdToolIcon, HdListItem, HdButton, HdInfoBanner, HdPageHeader, HdStatusBar },
    template: `<div style="display:flex;flex-direction:column;gap:12px">
      <HdStatusBar time="12:45" />
      <HdPageHeader title="Page (surface/page)" />
      <div style="background:var(--hd-surface-card);padding:8px 0"><HdListItem title="Card row" subtitle="surface/card" drilldown /></div>
      <div class="hd-on-overlay" style="background:var(--hd-surface-overlay);padding:12px 16px;border-radius:8px">Menu / dialog (surface/overlay) <HdButton style="margin-left:8px">Button</HdButton></div>
      <HdInfoBanner :open="true" text="Banner (surface/banner)" inline :timeout="0" />
      <div class="hd-on-home" style="background:var(--hd-surface-home);padding:12px 16px">Home / lock (surface/home)</div>
      <HdToolBar back label="Toolbar (light, default)"><HdToolIcon icon="add" label="Add" /></HdToolBar><HdToolBar back variant="dark" label="Toolbar (dark, per app)"><HdToolIcon icon="add" label="Add" /></HdToolBar></div>`,
  }),
};
export const OSSettings: S = { ...Ex.OSSettings, ...all, name: 'OS: Settings' };
export const OSSettingsSub: S = { ...Ex.OSSettingsSub, ...all, name: 'OS: Settings sub page' };
export const OSHome: S = { ...Ex.OSHome, ...all, name: 'OS: Home' };
export const OSLockScreen: S = { ...Ex.OSLockScreen, ...all, name: 'OS: Lock screen' };
export const WebLanding: S = { ...Ex.WebLanding, ...all, name: 'Web: Landing page' };
export const QuasarSettings: S = { ...QEx.SettingsApp, ...all, name: 'Quasar: Settings app' };
export const QuasarEmail: S = { ...QEx.EmailApp, ...all, name: 'Quasar: Email app' };
export const QuasarContacts: S = { ...QEx.ContactsApp, ...all, name: 'Quasar: Contacts' };
export const QuasarMessaging: S = { ...QEx.MessagingApp, ...all, name: 'Quasar: Messaging' };
export const QuasarMusic: S = { ...QEx.MusicApp, ...all, name: 'Quasar: Music player' };
export const QuasarCalendar: S = { ...QEx.CalendarApp, ...all, name: 'Quasar: Calendar' };
export const QuasarGallery: S = { ...QEx.GalleryApp, ...all, name: 'Quasar: Gallery' };
export const QuasarStore: S = { ...QEx.StoreApp, ...all, name: 'Quasar: Store app details' };
export const QuasarClock: S = { ...QEx.ClockApp, ...all, name: 'Quasar: Clock' };
export const QuasarFeeds: S = { ...QEx.FeedsApp, ...all, name: 'Quasar: Feeds reader' };
export const QuasarAdmin: S = { ...QEx.AdminDashboard, ...all, name: 'Quasar: Web admin dashboard' };
