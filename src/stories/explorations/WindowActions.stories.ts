import type { Meta, StoryObj } from '@storybook/vue3-vite';
import XWindow from '../../shell/desktop/XWindow.vue';
import XMiniApp from '../../shell/parts/XMiniApp.vue';
import type { XAction } from '../../shell/parts/types';

/** Desktop / Window actions: one rule for an app's actions at every width, the same in a desktop window and the classic top bar. */
const meta: Meta = {
  title: 'Desktop/Window actions',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Each app lists its actions once, most important first. Wide: all in the header. Narrower: the last ones fold into ⋯ at the right end, one by one; the title menu keeps views and filters only. Phone-narrow (under 560 px): the phone pattern, Back and the first three actions in a bottom toolbar, the rest in its ⋯. Minimise, maximise and close never move; nothing is cut off.' } } },
};
export default meta;

const MAIL: XAction[] = [{ icon: 'add', label: 'Write' }, { icon: 'search', label: 'Search' }, { icon: 'refresh', label: 'Refresh' }, { icon: 'folder', label: 'Move to' }, { icon: 'delete', label: 'Delete' }, { icon: 'check', label: 'Mark as read' }, { icon: 'star', label: 'Flag' }, { icon: 'share', label: 'Forward' }, { icon: 'settings', label: 'Accounts' }];
const ANDROID: XAction[] = [{ icon: 'back', label: 'Back' }, { icon: 'home', label: 'Home' }, { icon: 'window', label: 'Recent apps' }, { icon: 'speaker', label: 'Sound' }, { icon: 'attach', label: 'Clipboard' }, { icon: 'folder', label: 'Send a file' }, { icon: 'restart', label: 'Rotate' }, { icon: 'power', label: 'Restart Android' }];
const WIDTHS = [{ w: 1000, label: 'Wide: everything in the header' }, { w: 640, label: 'Medium: the last actions fold into ⋯' }, { w: 400, label: 'Narrow: phone pattern, bottom toolbar + ⋯' }];

const render = (app: string, icon: string, color: string, title: string, tools: XAction[], views?: string[], back = false) => (args: { open?: number }) => ({
  components: { XWindow, XMiniApp },
  setup: () => ({ app, icon, color, title, tools, views, back, WIDTHS, args }),
  template: `<div style="display:flex;flex-direction:column;gap:20px;padding:20px;min-height:100vh;background:var(--hd-surface-home)">
    <div v-for="(s, i) in WIDTHS" :key="s.w">
      <p style="margin:0 0 6px;color:var(--hd-c-fg-secondary);font:var(--hd-font-size-small)/1.2 var(--hd-font-family-base)">{{ s.w }} px · {{ s.label }}</p>
      <div style="position:relative;height:340px">
        <XWindow :title="title" :icon="icon" :color="color" :w="s.w" :h="340" focused :resizable="false" :tools="tools" :views="views" :back="back" :more-open="args.open === i">
          <XMiniApp :name="app" chrome="none" density="pointer" :hints="false" :id-prefix="'wa-' + app + i" />
        </XWindow>
      </div>
    </div></div>`,
});
export const Mail: StoryObj<{ open?: number }> = { name: 'Mail (title = views)', args: { open: 1 }, render: render('Mail', 'mail', '#1C6FD1', 'Inbox', MAIL, ['Inbox', 'Sent', 'Drafts', 'Archive']) };
export const Android: StoryObj<{ open?: number }> = { name: 'Android (many controls)', args: { open: 2 }, render: render('Settings', 'phone', '#5AA21C', 'Android', ANDROID) };
