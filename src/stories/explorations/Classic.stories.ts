import type { Meta, StoryObj } from '@storybook/vue3-vite';
import XClassic from '../../shell/web/XClassic.vue';
import XMail from '../../shell/apps/XMail.vue';
import XSettingsSplit from '../../shell/apps/XSettingsSplit.vue';
import type { XAction } from '../../shell/parts/types';

/** Web / Classic layout: one app at a time, the efficient single task (the desktop is the multitask place). */
const meta: Meta = {
  title: 'Web/Classic layout',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'The classic layout of a web app such as Cloud Companion: a calm top bar in the page colours, an apps button that opens the app grid (recent first, with search) instead of a permanent sidebar, the app title as a menu of its views, and the actions by the same rule as a desktop window (as many as fit, the rest in ⋮; under 600 px a bottom toolbar). The page gets the full width; list and detail sit side by side when there is room.' } } },
};
export default meta;
const APPS = [
  { id: 'browser', title: 'Browser', icon: 'globe', color: '#2EA8C7' }, { id: 'chats', title: 'Chats', icon: 'message', color: '#1FA8C9' },
  { id: 'mail', title: 'Mail', icon: 'mail', color: '#1C6FD1' }, { id: 'calendar', title: 'Calendar', icon: 'calendar', color: '#E2701C' },
  { id: 'contacts', title: 'Contacts', icon: 'person', color: '#1E7FC2' }, { id: 'files', title: 'Files', icon: 'folder', color: '#E2701C' },
  { id: 'photos', title: 'Photos', icon: 'photo', color: '#7A3FD0' }, { id: 'music', title: 'Music', icon: 'music', color: '#D6237A' },
  { id: 'android', title: 'Android', icon: 'phone', color: '#5AA21C' }, { id: 'settings', title: 'Settings', icon: 'settings', color: '#555' },
];
const MAIL: XAction[] = [{ icon: 'add', label: 'Write' }, { icon: 'search', label: 'Search' }, { icon: 'refresh', label: 'Refresh' }, { icon: 'folder', label: 'Move to' }, { icon: 'delete', label: 'Delete' }, { icon: 'check', label: 'Mark as read' }, { icon: 'star', label: 'Flag' }];
const frame = (w: number, h: number, inner: string, extra = {}) => ({
  components: { XClassic, XMail, XSettingsSplit },
  setup: () => ({ APPS, MAIL, ...extra }),
  template: `<div style="padding:20px;min-height:100vh;background:var(--hd-surface-home)"><div style="width:${w}px;height:${h}px;overflow:hidden;border-radius:10px;box-shadow:0 0 0 1px rgba(255,255,255,.15)">${inner}</div></div>`,
});
const mail = (more = false, grid = false) => `<XClassic :apps="APPS" app="mail" :views="['Inbox','Sent','Drafts','Archive']" :tools="MAIL" :recent="['mail','chats','browser']" status="Connected" :more-open="${more}" :grid-open="${grid}">
  <XMail chrome="none" density="pointer" :hints="false" landscape id-prefix="cl-mail" /></XClassic>`;
export const Mail: StoryObj = { render: () => frame(1280, 760, mail()) };
export const AppsMenu: StoryObj = { name: 'Apps menu', render: () => frame(1280, 760, mail(false, true)) };
export const Medium: StoryObj = { name: 'Medium width, actions in ⋮', render: () => frame(640, 640, mail(true)) };
export const Settings: StoryObj = { render: () => frame(1280, 760, `<XClassic :apps="APPS" app="settings" title="Settings" :tools="[{icon:'search',label:'Search'}]" status="Connected"><XSettingsSplit page="connections" /></XClassic>`) };
export const Phone: StoryObj = { render: () => frame(390, 760, mail()) };
