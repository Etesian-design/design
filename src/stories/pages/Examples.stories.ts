import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import * as Hd from '../../index';
import { apps, lockItems } from '../Home.stories';
import { links } from '../Web.stories';

const meta: Meta = { title: 'Examples/Full pages', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;
/* N9: the status bar is square and full width; the app window under it has 10 n9px (7px) top corners, the bottom is square */
const frameStyle = `<component is="style">.x-frame > .hd-status-bar + * { border-radius: 7px 7px 0 0; overflow: hidden; }</component>`;
const lockShell = (cards: string) => `<HdTheme mode="dark" :fill="false" style="max-width:400px;height:760px;margin:0 auto;display:flex;flex-direction:column;color:#fff;background:linear-gradient(160deg,#0e1418 10%,#2f6b6b 55%,#0d2a2c 90%)">
      <HdStatusBar transparent time="12:45" />
      <div style="text-align:right;padding:28px 18px 0"><div style="font:300 88px/1 var(--hd-font-family-light);font-variant-numeric:tabular-nums">12:45</div>
        <div style="margin-top:10px;font:400 1.125rem/1.3 var(--hd-font-family-base)">Saturday, 24 October 2026</div></div>
      <div style="margin-top:auto;padding:16px 16px 12px">${cards}
        <p style="margin:18px 0 0;text-align:center;color:rgba(255,255,255,.6);font:400 .8125rem/1 var(--hd-font-family-base)">Swipe sideways to unlock</p></div></HdTheme>`;
const components = { ...Object.fromEntries(Object.entries(Hd).filter(([k]) => k.startsWith('Hd'))) } as any;

const settingsMain = [
  ['wifi', 'Network and Internet', 'Mobile, Wi-Fi, hotspot'], ['bluetooth', 'Connected devices', 'Bluetooth, pairing'], ['grid', 'Apps', 'Recent apps, default apps'],
  ['info', 'Notifications', 'Notification history, conversations'], ['music', 'Sound and vibration', 'Volume and vibration'], ['lock', 'Modes', 'Do Not Disturb, Sleeping'],
  ['star', 'Display', 'Dark theme, font size, brightness'], ['photo', 'Wallpaper and style', 'Home, lock screen'], ['window', 'Storage', '10% used – 231 GB free'],
  ['battery', 'Battery', '100%'], ['settings', 'System', 'Languages, gestures, time'],
];
const settingsShell = (inner: string, toolbar = '') => `${frameStyle}<HdTheme mode="dark" class="x-frame" style="max-width:400px;height:760px;margin:0 auto;display:flex;flex-direction:column;position:relative;overflow:hidden;background:#000;color:#fff">
  <HdStatusBar time="14:16" />${inner}${toolbar}</HdTheme>`;
const mainList = `<ul class="x-set__list">
    <li v-for="r in rows" :key="r[1]" class="x-set__row"><HdIcon :name="r[0]" :size="22" /><span><b>{{ r[1] }}</b><small>{{ r[2] }}</small></span></li></ul>`;
const setStyle = `<component is="style">
  .x-set__list { list-style: none; margin: 0; padding: 4px 0 0; flex: 1; min-height: 0; overflow: hidden; }
  .x-set__row { display: flex; align-items: center; gap: 28px; padding: 14px 20px; }
  .x-set__row span { display: flex; flex-direction: column; gap: 4px; }
  .x-set__row b { font: 400 1.25rem/1.15 var(--hd-font-family-base); }
  .x-set__row small { font: 400 .875rem/1.2 var(--hd-font-family-base); color: rgba(255,255,255,.62); }
  .x-set__pull { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 0 10px; color: rgba(255,255,255,.75); font: 700 .875rem/1 var(--hd-font-family-base); }
  .x-set__pull svg { transition: transform .2s; }
  .x-set__pull.is-release svg { transform: rotate(180deg); }
  .x-set__search { margin: 0 16px 8px; }
  .x-set__head { padding: 20px 16px 12px; font: 700 1.5rem/1 var(--hd-font-family-base); border-bottom: 2px solid var(--hd-accent); }
  .x-set__sh { display: flex; align-items: center; gap: 12px; padding: 18px 16px 8px; font: 700 .9375rem/1 var(--hd-font-family-base); color: rgba(255,255,255,.6); }
  .x-set__sh::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.25); }
  .x-set__item { display: flex; align-items: center; gap: 20px; min-height: 56px; padding: 8px 16px; font: 400 1.0625rem/1.2 var(--hd-font-family-base); }
  .x-set__item small { display: block; margin-top: 3px; font-size: .9375rem; color: rgba(255,255,255,.6); }
  .x-set__item > span { flex: 1; }
</component>`;
export const OSSettings: S = {
  name: 'OS: Settings (main page)',
  render: () => ({ components, setup: () => ({ rows: settingsMain }),
    template: setStyle + settingsShell(mainList) }),
};
/* N9 Settings main page (n9-settings-main.png): plain "Settings" header over a rule, a curated block of plain rows
 * (no icons) on top, then the icon list. No brand colour and no bottom bar on the main page. */
const sun = (r: number) => `<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="${r}" fill="none" stroke="currentColor" stroke-width="1.6" /><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>`;
const n9Icons = [['grid', 'Device'], ['bluetooth', 'Bluetooth'], ['music', 'Sounds and vibration'], ['photo', 'Wallpaper'], ['clock', 'Time and language'], ['grid', 'Applications'], ['lock', 'Security']];
const quickRows = `<div class="x-n9__row"><span>Flight mode</span><button type="button" class="x-n9__info hd-sq" aria-label="About flight mode">i</button><HdSwitch v-model="flight" aria-label="Flight mode" /></div>
  <div class="x-n9__row" role="link"><span>Internet connection</span><HdIcon name="chevron-right" :size="22" /></div>
  <div class="x-n9__row" role="link"><span>Mobile network</span><HdIcon name="chevron-right" :size="22" /></div>
  <hr class="x-n9__rule" /><div class="x-n9__label">Brightness</div>
  <div class="x-n9__bright">${sun(3)}<HdSlider v-model="bright" label="Brightness" style="flex:1" />${sun(5)}</div><hr class="x-n9__rule" />`;
const iconRows = `<div v-for="r in n9Icons" :key="r[1]" class="x-n9__row x-n9__row--icon" role="link"><span class="x-n9__tile hd-sq"><HdIcon :name="r[0]" :size="26" /></span><span>{{ r[1] }}</span><HdIcon name="chevron-right" :size="22" /></div>`;
const quickStyle = `<component is="style">
  .x-n9 { flex: 1; min-height: 0; overflow: hidden; }
  .x-n9__head { margin: 0 16px; padding: 14px 0 10px; border-bottom: 1px solid rgba(255,255,255,.3); font: 300 1.75rem/1 var(--hd-font-family-light); }
  .x-n9__row { display: flex; align-items: center; gap: 12px; min-height: 53px; padding: 0 16px; font: 700 1.125rem/1.2 var(--hd-font-family-base); }
  .x-n9__row > span:first-child:not(.x-n9__tile), .x-n9__row--icon > span:nth-child(2) { flex: 1; }
  .x-n9__row--icon { gap: 18px; }
  .x-n9__info { width: 20px; height: 20px; border: 0; padding: 0; --hd-sq-size: 20px; --hd-sq-fill: #3a3a3a; color: #fff; font: 700 .8125rem/1 var(--hd-font-family-base); }
  .x-n9__tile { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 41px; height: 41px; --hd-sq-size: 41px; --hd-sq-fill: linear-gradient(#3a3a3a, #1c1c1c); }
  .x-n9__rule { margin: 0 16px; border: 0; border-top: 1px solid rgba(255,255,255,.3); }
  .x-n9__label { padding: 14px 16px 0; font: 700 1.125rem/1 var(--hd-font-family-base); }
  .x-n9__bright { display: flex; align-items: center; gap: 16px; padding: 8px 16px 12px; }
  .x-set__hint { margin: 8px 16px 0; padding: 10px 12px; border-radius: 6px; background: rgba(255,255,255,.08); font: 400 .8125rem/1.35 var(--hd-font-family-base); color: rgba(255,255,255,.75); }
  .x-n9__pin { color: var(--hd-accent); }
  .x-set__menu { position: absolute; left: 24px; right: 24px; top: 210px; z-index: 5; border-radius: 6px; background: #1c1c1c; border: 1px solid #393839; box-shadow: 0 8px 24px rgba(0,0,0,.6); }
  .x-set__menu div { padding: 14px 16px; font: 400 1.0625rem/1 var(--hd-font-family-base); } .x-set__menu div + div { border-top: 1px solid #2a2a2a; }
</component>`;
export const OSSettingsQuick: S = {
  name: 'OS: Settings (N9 main page: quick rows, then the icon list)',
  render: () => ({ components, setup: () => ({ n9Icons, flight: ref(false), bright: ref(55) }),
    template: quickStyle + settingsShell(`<div class="x-n9"><div class="x-n9__head">Settings</div>${quickRows}${iconRows}</div>`) }),
};
export const OSSettingsPinned: S = {
  name: 'OS: Settings (pinned settings, customisable)',
  render: () => ({ components, setup: () => ({ n9Icons, pins: ['Font size', 'Power save', 'Lock code'], flight: ref(false), bright: ref(55) }),
    template: quickStyle + settingsShell(`<div class="x-n9"><div class="x-n9__head">Settings</div>
      <p class="x-set__hint">Long-press any setting in a submenu and choose <b>Pin to Settings</b>. Pinned settings join the rows on top; long-press one to unpin or reorder.</p>
      <div v-for="p in pins" :key="p" class="x-n9__row" role="link"><span>{{ p }}</span><HdIcon name="star" :size="14" class="x-n9__pin" /><HdIcon name="chevron-right" :size="22" /></div>
      ${quickRows}${iconRows}</div>`) }),
};
export const OSSettingsPinMenu: S = {
  name: 'OS: Settings (sub page: long-press → Pin to Settings)',
  render: () => ({ components, setup: () => ({ wifi: ref(true) }),
    template: setStyle + quickStyle + settingsShell(`<div style="flex:1;min-height:0;overflow:hidden;position:relative">
      <div class="x-set__head">Display</div>
      <div class="x-set__item"><span>Brightness<small>Automatic</small></span></div>
      <div class="x-set__item" style="background:rgba(255,255,255,.12)"><span>Font size<small>Default</small></span></div>
      <div class="x-set__item"><span>Dark theme</span><HdSwitch v-model="wifi" aria-label="Dark theme" /></div>
      <div class="x-set__menu" role="menu" aria-label="Font size"><div role="menuitem">Pin to Settings</div><div role="menuitem">Help</div></div></div>`,
      `<HdToolBar variant="dark" back label="Settings toolbar" />`) }),
};
export const OSSettingsPull: S = {
  name: 'OS: Settings (pull down to search)',
  render: () => ({ components, setup: () => ({ rows: settingsMain, release: ref(true), q: ref('') }),
    template: setStyle + settingsShell(`<div class="x-set__pull" :class="{ 'is-release': release }" role="status" @click="release = !release">
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v14m0 0l-6-6m6 6l6-6" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" /></svg>
      {{ release ? 'Release to search' : 'Pull down to search' }}</div>
      <HdSearchField v-if="release" v-model="q" class="x-set__search" placeholder="Search settings" label="Search settings" />` + mainList) }),
};
export const OSSettingsSub: S = {
  name: 'OS: Settings (sub page, dark toolbar with Back)',
  render: () => ({ components, setup: () => ({ wifi: ref(true) }),
    template: setStyle + settingsShell(`<div style="flex:1;min-height:0;overflow:hidden">
      <div class="x-set__head">Internet</div>
      <div class="x-set__sh">Mobile data</div>
      <div class="x-set__item"><HdIcon name="wifi" :size="20" /><span>COSMOTE<small>Mobile data won't auto-connect</small></span><HdIcon name="settings" :size="22" style="color:var(--hd-accent)" /></div>
      <div class="x-set__sh">Wi-Fi</div>
      <div class="x-set__item"><span>Use Wi-Fi</span><HdSwitch v-model="wifi" aria-label="Use Wi-Fi" /></div>
      <div class="x-set__item"><HdIcon name="wifi" :size="20" style="color:var(--hd-accent)" /><span>ASUS<small>Connected</small></span><HdIcon name="settings" :size="22" style="color:var(--hd-accent)" /></div>
      <div class="x-set__sh">Networks</div>
      <div v-for="n in ['RPiDev', 'DIRECT-sAC48x Series', 'mesh']" :key="n" class="x-set__item"><HdIcon name="wifi" :size="20" /><span>{{ n }}</span><HdIcon name="lock" :size="20" /></div>
      <div class="x-set__item"><HdIcon name="add" :size="22" /><span>Add network</span></div></div>`,
      `<HdToolBar variant="dark" back label="Settings toolbar" />`) }),
};

export const OSLockScreen: S = {
  name: 'OS: Lock screen (stacked carousel, default)',
  render: () => ({
    components, setup: () => ({ items: lockItems }),
    template: lockShell(`<HdLockScreenStack :items="items" :visible="3" />`),
  }),
};
export const OSLockScreenMore: S = {
  name: 'OS: Lock screen (N9 "More" style, optional)',
  render: () => ({
    components, setup: () => ({ items: lockItems }),
    template: lockShell(`<HdLockScreenStack :items="items" :visible="3" variant="more" />`),
  }),
};

export const OSHome: S = {
  name: 'OS: Home (Applications view)',
  render: () => ({
    components, setup: () => ({ apps, view: ref(1) }),
    template: frameStyle + `<div class="hd-on-home x-frame" style="max-width:400px;height:720px;margin:0 auto;display:flex;flex-direction:column;background:var(--hd-surface-home);color:var(--hd-c-fg)">
      <HdStatusBar time="12:45" />
      <div style="flex:1;min-height:0;overflow:auto"><HdAppGrid><li v-for="a in apps" :key="a[0]"><HdAppIcon :label="a[0]" :icon="a[1]" :color="a[2]" :loading="a[0]==='Music'" /></li></HdAppGrid></div>
      <div style="display:flex;justify-content:center;padding:16px"><HdPageIndicator :total="3" :current="view" interactive label="Home views" @select="view = $event" /></div></div>`,
  }),
};

export const WebLanding: S = {
  name: 'Web: Landing page',
  render: () => ({
    components,
    setup() {
      const email = ref(''), toast = ref(false), page = ref(1);
      const rows = [{ id: 1, plan: 'Personal', seats: 1, price: 0 }, { id: 2, plan: 'Team', seats: 10, price: 49 }, { id: 3, plan: 'Studio', seats: 50, price: 199 }];
      const cols = [{ key: 'plan', label: 'Plan' }, { key: 'seats', label: 'Seats', numeric: true }, { key: 'price', label: 'EUR / month', numeric: true }];
      return { links, email, toast, rows, cols, page, apps };
    },
    template: `<div>
      <HdSiteHeader brand="Etesian" :links="links"><template #actions><HdButton variant="accent" @click="toast = true">Get started</HdButton><HdToolIcon icon="search" label="Search" /></template></HdSiteHeader>
      <main id="main">
        <HdHero eyebrow="Design language" title="The content is the interface." lead="A calm, light, gesture-first design system inspired by the Nokia N9, for apps and the web.">
          <template #actions><HdButton variant="accent" @click="toast = true">Get started</HdButton><HdButton>Read the guide</HdButton></template>
          <template #media><HdAppGrid class="hd-on-home" style="background:var(--hd-surface-home);border-radius:var(--hd-radius-card)">
            <li v-for="a in apps.slice(0, 8)" :key="a[0]"><HdAppIcon :label="a[0]" :icon="a[1]" :color="a[2]" /></li></HdAppGrid></template>
        </HdHero>
        <section id="features" style="padding:48px 0"><HdContainer>
          <h2 style="font:300 var(--hd-font-size-xxlarge)/1.1 var(--hd-font-family-light);margin:0 0 32px">Three ideas</h2>
          <HdGrid min="260px">
            <HdCard title="Swipe" text="No home button. Edge swipes minimise, top swipe closes." icon="back" accent="#62B700" href="#swipe" />
            <HdCard title="Squircle" text="Avatars, icons and thumbnails share one superellipse." icon="star" accent="#821DDE" href="#squircle" />
            <HdCard title="Light type" text="Large, light typography and generous whitespace." icon="edit" accent="#EF5500" href="#type" />
          </HdGrid></HdContainer></section>
        <section id="pricing" style="padding:48px 0;background:var(--hd-c-surface)"><HdContainer size="prose">
          <HdTable caption="Pricing" :columns="cols" :rows="rows" />
          <div style="display:flex;justify-content:center;margin-top:24px"><HdPagination v-model:page="page" :total="3" /></div></HdContainer></section>
        <section id="contact" style="padding:48px 0"><HdContainer size="prose">
          <form style="display:grid;gap:16px" @submit.prevent="toast = true">
            <h2 style="font:300 var(--hd-font-size-xxlarge)/1.1 var(--hd-font-family-light);margin:0">Stay in touch</h2>
            <HdTextField v-model="email" label="Email" type="email" autocomplete="email" />
            <HdButton type="submit" variant="accent">Subscribe</HdButton></form></HdContainer></section>
      </main>
      <HdFooter note="Etesian Design Language. Unaffiliated with Nokia; no Nokia assets included." :columns="[{ title: 'Guide', links: [{ label: 'Principles', href: '#p' }, { label: 'Components', href: '#c' }] }, { title: 'Project', links: [{ label: 'Source', href: '#s' }, { label: 'Contributing', href: '#k' }] }]" />
      <HdToast v-model:open="toast" text="Thanks! Check your inbox." action="Undo" />
    </div>`,
  }),
};
