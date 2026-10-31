import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { readFileSync } from 'node:fs';
import HdButton from '../src/components/HdButton.vue';
import HdSlider from '../src/components/HdSlider.vue';
import BelleWidget from '../src/stories/belle/BelleWidget.vue';

const read = (p: string) => readFileSync(`${process.cwd()}/${p}`, 'utf8');

// 2026-10-25, from the N9 and the ROM launcher (Util.kt N9.button / editButton).
describe('buttons', () => {
  const css = read('src/components/HdButton.vue');
  it('dark is the measured N9 ramp with the #393839 rim', () => {
    expect(css).toMatch(/\.hd-button--dark:not\(\.hd-button--flat\):not\(\.hd-sq\) \{ background: linear-gradient\(#1C1C1C, #101010 50%, #080808\); border-color: #393839;/);
  });
  it('bar size is the 180x41 n9px edit-bar button', () => expect(css).toMatch(/\.hd-button--bar \{ --hd-btn-h: 27\.5px; height: 27\.5px; min-height: 0; width: 120px;/));
  it('corners are 21% of the height at every size', () => expect(css).toContain('border-radius: calc(var(--hd-btn-h) * .21)'));
  it('edit bar buttons keep 21% corners too', () => expect(read('src/components/HdButton.vue')).toContain('.hd-button { --hd-btn-base: var(--hd-c-button-bg); border-radius: calc(var(--hd-btn-h) * .21); }'));
  it('renders variant, size and pressed classes', () => {
    const w = mount(HdButton, { props: { variant: 'dark', size: 'bar', pressed: true }, slots: { default: 'Done' } });
    expect(w.classes()).toEqual(expect.arrayContaining(['hd-button--dark', 'hd-button--bar', 'is-pressed']));
    expect(mount(HdButton, { slots: { default: 'OK' } }).classes().some((c) => c.startsWith('hd-button--bar') || c === 'is-pressed')).toBe(false);
  });
  it('the docs list every kind with n9px and px', () => {
    const s = read('src/stories/Buttons.stories.ts');
    for (const k of ['180 × 41', '120 × 27.5', '51 × 49', '34 × 33', '322 × 60']) expect(s).toContain(k);
  });
});

describe('Belle widgets', () => {
  it('sizes follow the 4-column grid (n x 90 - 12)', () => {
    const cases: [string, number, number][] = [['switch', 78, 78], ['wifi', 168, 78], ['music', 348, 123], ['agenda', 348, 258], ['analog', 168, 168]];
    for (const [kind, w, h] of cases) {
      const el = mount(BelleWidget, { props: { kind: kind as any } }).element as HTMLElement;
      expect([el.style.width, el.style.height]).toEqual([`${w}px`, `${h}px`]);
    }
  });
  it('album art and web thumbnails are shown as is, not squircled', () => {
    for (const kind of ['music', 'web', 'contact'] as const) expect(mount(BelleWidget, { props: { kind, art: '#333' } }).find('[aria-label="Album art"].hd-squircle, .hd-squircle [aria-label="Album art"]').exists()).toBe(false);
    expect(mount(BelleWidget, { props: { kind: 'm-music', art: '#333' } }).find('.hd-squircle').exists()).toBe(false);
    expect(mount(BelleWidget, { props: { kind: 'm-music' } }).find('.bw-mmusic__ph').exists()).toBe(true);
  });
  it('edit mode adds the 30px red squircle badge at the top right', () => {
    const w = mount(BelleWidget, { props: { kind: 'notes', editing: true } });
    const b = w.find('.bw-close');
    expect(b.exists()).toBe(true);
    expect(b.attributes('style')).toContain('width: 30px');
    expect(read('src/stories/belle/BelleWidget.vue')).toMatch(/\.bw-close \{ position: absolute !important; top: 0; right: 0;/);
    expect(mount(BelleWidget, { props: { kind: 'notes' } }).find('.bw-close').exists()).toBe(false);
  });
  // Regression 2026-10-30: the feed and mail widgets showed a fixed few rows; Belle's hold up to 20 and scroll.
  it('feed and mail widgets hold more than fits and scroll', () => {
    for (const [kind, row] of [['rss', '.bw-rss__row'], ['mail', '.bw-mail__row']] as const) {
      const w = mount(BelleWidget, { props: { kind } });
      expect(w.findAll(row).length).toBeGreaterThan(5);
      expect(w.find('.bw-scroll').exists()).toBe(true);
    }
    const css = read('src/stories/belle/BelleWidget.vue');
    expect(css).toMatch(/\.bw-scroll \{ overflow-y: auto;/);
    expect(css).toMatch(/\.bw-rss__row \{ flex: none; min-height: 52px;/);
    expect(css).toMatch(/-webkit-line-clamp: 3/);
  });
  it('agenda steps through days and its events scroll; latest mail steps one at a time', async () => {
    const a = mount(BelleWidget, { props: { kind: 'agenda' } });
    const first = a.find('[data-test=agenda-day]').text();
    expect(a.findAll('.bw-agenda__row').length).toBeGreaterThan(3);
    expect(a.find('.bw-agenda__list.bw-scroll').exists()).toBe(true);
    await a.find('[aria-label="Next day"]').trigger('click');
    expect(a.find('[data-test=agenda-day]').text()).not.toBe(first);
    const m = mount(BelleWidget, { props: { kind: 'stackmail' } });
    expect(m.find('[aria-label="Newer mail"]').attributes('disabled')).toBeDefined();
    const sender = m.find('.bw-stack__mail b').text();
    await m.find('[aria-label="Older mail"]').trigger('click');
    expect(m.find('.bw-stack__mail b').text()).not.toBe(sender);
  });
  it('edit bar offers Done and Add widget', () => expect(read('src/stories/BelleWidgets.stories.ts')).toContain('done-label="Done" close-all-label="Add widget"'));
});

describe('content shown as is, headers', () => {
  it('gallery and events photos are not squircled', () => {
    expect(read('src/stories/explorations/apps/XGallery.vue')).not.toContain('HdSquircle');
    expect(read('src/stories/explorations/parts/XEvents.vue')).not.toMatch(/HdSquircle[^>]*photo\(/);
    expect(read('src/stories/explorations/apps/XMusic.vue')).not.toContain('HdThumbnail');
  });
  it('app main pages use the brand colour, sub pages stay plain', () => {
    const ex = read('src/stories/quasar/Examples.stories.ts');
    expect(ex).toMatch(/head\('Inbox', .*'#0067BC'\)/);
    expect(ex).toContain("head('Messages', '', '#09A7CC')");
    expect(ex).toContain("head('Anna Virtanen')");
    expect(ex).toContain("head('New event')");
  });
});

// 2026-10-25 follow-ups (user answers).
import HdFastScroll from '../src/components/HdFastScroll.vue';
import HdEventsFeedItem from '../src/components/HdEventsFeedItem.vue';
describe('follow-ups', () => {
  const ex = read('src/stories/quasar/Examples.stories.ts');
  const pages = read('src/stories/pages/Examples.stories.ts');
  it('Settings main page has no brand colour', () => expect(ex).toContain("head('Settings')}"));
  it('Settings has quick-access, pinned and pin-menu variants', () => {
    for (const n of ['OSSettingsQuick', 'OSSettingsPinned', 'OSSettingsPinMenu', 'Pin to Settings']) expect(pages).toContain(n);
  });
  it('phone frames have rounded display corners', () => {
    // N9: 10 n9px = 7px, top corners of the app window only (status bar and toolbar edge square)
    expect(ex).toContain('.hd-q-story { --hd-q-screen-radius: 7px; }');
    expect(ex).toMatch(/const phone = [^\n]*border-radius:var\(--hd-q-screen-radius\) var\(--hd-q-screen-radius\) 0 0;overflow:hidden/);
    expect(ex).not.toContain('22px; }');
    expect(pages).toContain('.x-frame > .hd-status-bar + * { border-radius: 7px 7px 0 0; overflow: hidden; }');
    expect(pages).not.toContain('border-radius:22px');
    expect((pages.match(/class="(hd-on-home )?x-frame"/g) ?? []).length).toBe(2);
  });
  it('contacts: no letter rail, letters on the right, fast scroll idle + active, compact detail', () => {
    expect(ex).not.toContain('hd-q-rail');
    expect(ex).toMatch(/\.hd-q-letter \{[^}]*flex-direction:row-reverse/);
    expect(ex).toMatch(/<HdFastScroll :position="0\.3" :sections="secs"/);
    expect(ex).toMatch(/<HdFastScroll [^>]*active letter="K"/);
    expect(ex).toMatch(/phoneSmall\([\s\S]*width:43px;height:43px[\s\S]*hd-q-sqart|hd-q-sqart" style="width:43px/);
  });
  it('fast scroll: dot only when idle, big letter box on the left when active', () => {
    expect(mount(HdFastScroll, { props: { position: .5, letter: 'J' } }).find('.hd-fast-scroll__letter').exists()).toBe(false);
    const a = mount(HdFastScroll, { props: { position: .5, active: true, letter: 'J' } });
    expect(a.find('.hd-fast-scroll__letter').text()).toBe('J');
    expect(a.find('.hd-fast-scroll__dot').exists()).toBe(false);
  });
  it('feed post photos are square, icons stay squircles', () => {
    expect(mount(HdEventsFeedItem, { props: { title: 't', time: 'now', image: 'x.png' } }).find('.hd-squircle').exists()).toBe(false);
    expect(mount(HdEventsFeedItem, { props: { title: 't', time: 'now', icon: 'mail' } }).find('.hd-squircle').exists()).toBe(true);
    const q = read('src/quasar/etesian-quasar.css');
    expect(q).toContain('.hd-quasar .q-carousel__thumbnail { border-radius: 0; }');
    expect(q).toMatch(/\.q-item__section--thumbnail img \{ width: 43px; height: 43px; border-radius: 0; object-fit: cover; \}/);
  });
  it('music playing item is #C4008F', () => expect(read('src/stories/explorations/apps/XMusic.vue')).toContain('--hd-accent: #C4008F'));
});

// 2026-10-25, n9-contacts-fastscroll*.png, n9-settings-main.png.
describe('N9 fast scroll and Settings main page', () => {
  const fs = read('src/components/HdFastScroll.vue');
  const secs = [{ letter: 'A', top: 14 }, { letter: 'K', top: 300 }, { letter: 'L', top: 600 }];
  it('wide translucent band on the right with section letters inside it', () => {
    expect(fs).toMatch(/--hd-fast-scroll-width: 47px;/);
    expect(fs).toMatch(/\.hd-fast-scroll__band \{[^}]*right: 0; width: var\(--hd-fast-scroll-width\); overflow: hidden; background: rgba\(184,184,188,\.7\);/);
    const w = mount(HdFastScroll, { props: { sections: secs, position: .2 } });
    expect(w.findAll('.hd-fast-scroll__sec').map((x) => x.text())).toEqual(['A', 'K', 'L']);
    expect(w.find('.hd-fast-scroll__dot').exists()).toBe(true);
  });
  it('finger on the bar: dark band across the list up to the scroll band, big light letter at the left', () => {
    expect(fs).toMatch(/\.hd-fast-scroll__finger \{ position: absolute; left: 0; right: var\(--hd-fast-scroll-width\); height: var\(--hd-fast-scroll-finger, 120px\);[^}]*background: rgba\(26,26,26,\.85\);/);
    expect(fs).toMatch(/\.hd-fast-scroll__letter \{[^}]*color: #fff; font: 200 72px/);
  });
  it('dragging snaps section by section and emits one jump per section', async () => {
    const w = mount(HdFastScroll, { props: { sections: secs }, attachTo: document.body });
    const band = w.find('.hd-fast-scroll__band');
    (band.element as HTMLElement).getBoundingClientRect = () => ({ top: 0, height: 300, left: 0, right: 47, bottom: 300, width: 47, x: 0, y: 0, toJSON: () => ({}) });
    const fire = async (type: string, clientY = 0) => { band.element.dispatchEvent(new MouseEvent(type, { clientY, bubbles: true })); await w.vm.$nextTick(); };
    await fire('pointerdown', 10);
    await fire('pointermove', 40);
    await fire('pointermove', 110);
    await fire('pointermove', 130);
    await fire('pointermove', 290);
    expect(w.emitted('jump')).toEqual([[0, 'A'], [1, 'K'], [2, 'L']]);
    expect(w.find('.hd-fast-scroll__letter').text()).toBe('L');
    expect(w.find('.hd-fast-scroll__dot').exists()).toBe(false);
    await fire('pointerup');
    expect(w.find('.hd-fast-scroll__finger').exists()).toBe(false);
    w.unmount();
  });
  it('contacts: brand header, search, dark squircle initials, + left and ≡ right, no Back; list snaps to the section', () => {
    const ex = read('src/stories/quasar/Examples.stories.ts');
    const c = ex.slice(ex.indexOf('const contactsList'), ex.indexOf('const cPeople'));
    expect(c).toContain("head('Contacts', '', '#0A7FD6')");
    expect(c).toContain("<q-footer><q-toolbar>${tool('add', 'New contact')}${tool('lines', 'Menu')}</q-toolbar></q-footer>");
    expect(c).not.toContain('${back}');
    expect(c).toMatch(/q-input rounded outlined dense placeholder="Search"/);
    expect(c).toMatch(/\.hd-q-cav \{[^}]*background: linear-gradient\(#3a3a3a, #0a0a0a\); color: #fff; font: 700/);
    expect(ex).toContain('@jump="(i) => (at = secs[i].top - 14)"');
  });
  it('Settings main page: plain rows on top, icon list, no tiles, no bottom bar', () => {
    const pg = read('src/stories/pages/Examples.stories.ts');
    const q = pg.slice(pg.indexOf('export const OSSettingsQuick'), pg.indexOf('export const OSSettingsPinMenu'));
    expect(q).not.toMatch(/x-set__q(i|uick)/);
    expect(q).not.toContain('HdToolBar');
    for (const t of ['Flight mode', 'Internet connection', 'Mobile network', 'Brightness']) expect(pg).toContain(t);
    expect(pg).toContain("['bluetooth', 'Bluetooth'], ['music', 'Sounds and vibration'], ['photo', 'Wallpaper'], ['clock', 'Time and language']");
  });
});

// 2026-10-25: Messaging / Accounts / Store from the N9, toolbar tabs, contacts snapped under K.
import HdEmptyState from '../src/components/HdEmptyState.vue';
import HdToolBar from '../src/components/HdToolBar.vue';
import HdTabButton from '../src/components/HdTabButton.vue';
describe('Messaging, Accounts, Store, tabs', () => {
  const m = read('src/stories/pages/Messaging.stories.ts');
  it('contacts finger-on-bar example shows the list snapped to K', () => {
    const ex = read('src/stories/quasar/Examples.stories.ts');
    expect(ex).toMatch(/active letter="K" :sections="secs\.map\(\(x\) => \(\{ \.\.\.x, top: x\.top - kTop \}\)\)"[^\n]*'kTop'\)/);
    expect(ex).toContain("kTop: cSecs.find((x) => x.letter === 'K')!.top - SEC / 2");
  });
  it('empty state: no chrome, light grey text, stacked dark lit buttons', () => {
    const w = mount(HdEmptyState, { props: { text: 'Nothing yet', actions: ['Send a text', 'Add chat account'] } });
    expect(w.findAll('.hd-empty-state__btn').map((b) => b.text())).toEqual(['Send a text', 'Add chat account']);
    const css = read('src/components/HdEmptyState.vue');
    expect(css).toMatch(/font: 200 37px\/1\.2 var\(--hd-font-family-light\)/);
    expect(css).toContain('#1A1A1C');
    expect(css).toMatch(/\.hd-empty-state__btn \{ height: 33px;/);
    const e = m.slice(m.indexOf('export const MessagingEmpty'), m.indexOf('export const MessagingCompose'));
    expect(e).not.toContain('HdToolBar');
  });
  it('compose: sheet with Cancel + title, blue chip, counter, Send, keyboard, no toolbar', () => {
    const c = m.slice(m.indexOf('export const MessagingCompose'), m.indexOf('export const MessagingConversation'));
    for (const t of ['Cancel', 'New text message', 'xm-chip', '155<small>(1)</small>', 'xm-send', '${keyboard}']) expect(c).toContain(t);
    expect(read('src/stories/parts/N9Keyboard.vue')).toContain('?123'); expect(m).toContain('<N9Keyboard />');
    expect(c).not.toContain('HdToolBar');
  });
  it('conversation: cyan sent bubble with tail top-right, received bubble flagged as a guess, Send only in the keyboard strip', () => {
    expect(m).toMatch(/\.xm-bub--out \{[^}]*border-top-right-radius: 0; background: linear-gradient\(#24AADD, #1A92C2\)/);
    expect(m).toContain('Received bubble: unverified guess');
    expect(m).not.toContain('<button v-if="draft"'); // Send lives in the keyboard strip, not the composer
  });
  it('page owned by another app: owner icon instead of Back', () => {
    const w = mount(HdToolBar, { props: { variant: 'dark', owner: { icon: 'wrench', label: 'Accounts' } } });
    expect(w.find('.hd-toolbar__back').exists()).toBe(false);
    expect(w.find('.hd-toolbar__owner').attributes('aria-label')).toBe('Accounts');
    expect(m).toContain(`:owner="{ icon: 'wrench', label: 'Accounts' }"`);
  });
  it('no third-party trademarks in the samples', () => expect(m).not.toMatch(/Skype|Facebook|Google|Nokia|Ovi/));
  it('selected toolbar tab is a lighter full-height square-edged cell', () => {
    expect(mount(HdTabButton, { props: { label: 'Home', icon: 'home', selected: true } }).classes()).not.toContain('hd-sq');
    expect(read('src/components/HdTabButton.vue')).toMatch(/\.hd-tab-button--icon \{ align-self: stretch; min-width: 64px; height: auto; border: 0; border-radius: 0;/);
    expect(read('src/components/HdToolBar.vue')).toContain('.hd-toolbar--light { --hd-tab-selected: linear-gradient(#F4F4F5, #D2D2D5); }');
    const q = read('src/quasar/etesian-quasar.css');
    expect(q).toMatch(/\.q-footer \.q-tab::before \{ left: 0; top: 0; right: 0; bottom: 0;[^}]*mask-image: none; \}/);
    expect(q).toContain('.hd-quasar .q-footer .q-tab--active::before { background: linear-gradient(#F4F4F5, #D2D2D5); }');
  });
  it('store: plain header, hero with dark title band, Featured band, FREE, tabs with Back', () => {
    const st = m.slice(m.indexOf('export const StoreHome'));
    for (const t of ['xm-store-h">Store', 'Welcome to the Store', 'xm-feat">Featured', 'FREE', '<HdToolBar back', 'HdTabBar']) expect(st).toContain(t);
  });
});

// 2026-10-25 (measured): first / last centres 44 n9px from the edges, the rest evenly spaced; tabs in equal cells; one button left or right; actions hit only their squircle.
import HdToolIcon from '../src/components/HdToolIcon.vue';
describe('bottom bar layout', () => {
  const tb = read('src/components/HdToolBar.vue');
  const q = read('src/quasar/etesian-quasar.css');
  it('several buttons: space-between with the 44 n9px edge inset (not equal slots), groups dissolved; tabs equal cells', () => {
    expect(tb).toContain('--hd-toolbar-inset: calc(88px / 3 - 20px);');
    expect(tb).toMatch(/display: flex; justify-content: space-between; align-items: center; height: var\(--hd-size-toolbar\); padding: 0 var\(--hd-toolbar-inset\);/);
    expect(tb).toContain('.hd-toolbar__back { margin: 0 3px; }');
    expect(tb).toMatch(/\.hd-toolbar:has\(\.hd-tab-button--icon\) \{ display: grid; grid-auto-flow: column; grid-auto-columns: minmax\(0, 1fr\);/);
    expect(88 / 3).toBeCloseTo(44 * 2 / 3);
    expect(tb).toContain('.hd-toolbar__side, .hd-toolbar__center, .hd-toolbar .hd-tab-bar { display: contents; }');
    expect(q).toContain('.q-footer .q-toolbar:not(.hd-q-free) { display: flex; justify-content: space-between; align-items: center; padding: 0 calc(88px / 3 - var(--hd-size-touch-target) / 2); }');
    const ex = read('src/stories/quasar/Examples.stories.ts');
    expect(ex).not.toMatch(/<q-footer[^`]*<q-space \/>/);
  });
  it('one button: left or right by action', () => {
    expect(mount(HdToolBar, { props: { back: true } }).classes()).toContain('hd-toolbar--start');
    expect(mount(HdToolBar, { props: { align: 'end' }, slots: { right: '<button>≡</button>' } }).classes()).toContain('hd-toolbar--end');
    const many = mount(HdToolBar, { props: { back: true }, slots: { default: '<button>a</button><button>b</button>' } });
    expect(many.classes().some((c) => c === 'hd-toolbar--start' || c === 'hd-toolbar--end')).toBe(false);
    expect(tb).toContain('.hd-toolbar--end { justify-content: flex-end; }');
    expect(q).toContain('.hd-quasar .q-footer .q-toolbar.hd-q-bar--end { justify-content: flex-end; }');
  });
  it('action buttons hit only their squircle; only tabs fill the slot', () => {
    expect(tb).toContain('.hd-toolbar .hd-tool-icon { width: 40px; height: 40px; }');
    expect(tb).toContain('.hd-toolbar .hd-tab-button--icon { justify-self: stretch; align-self: stretch; }');
    expect(read('src/components/HdToolIcon.vue')).toContain('--hd-sq-size: 40px');
    expect(mount(HdToolIcon, { props: { icon: 'add', label: 'Add' } }).classes()).toContain('hd-sq');
  });
  it('documented on the toolbar and the Buttons page', () => {
    expect(tb).toContain('44 n9px (29.33px) from the bar edges');
    expect(read('src/stories/Buttons.stories.ts')).toContain('not equal-width slots');
    expect(read('src/stories/Buttons.stories.ts')).toContain('Bottom bar layout');
  });
});

// 2026-10-25: Phone v2, every Android 16 gap proposal visualised.
import PhoneV2 from '../src/stories/explorations/phone2/PhoneV2.vue';
import { STATES, CORE, SMALL, NO_MOCK, LEAVE_OUT, QUESTIONS, storyId, type P2State } from '../src/stories/explorations/phone2/states';
describe('Phone v2 proposals', () => {
  const all = [...CORE, ...SMALL];
  it('every gap row is either mocked or listed as done / left out', () => {
    const covered = new Set([...all.flatMap((s) => STATES[s].gaps), ...NO_MOCK.map((r) => r[0])]);
    for (let n = 1; n <= 33; n++) expect(covered.has(n), `gap #${n}`).toBe(true);
  });
  it('every state renders a 360 x 640 phone with 7px app corners', () => {
    for (const s of all) expect(mount(PhoneV2, { props: { state: s } }).attributes('data-state')).toBe(s);
    const v = read('src/stories/explorations/phone2/PhoneV2.vue');
    expect(v).toMatch(/\.p2 \{ position: relative; width: 360px; height: 640px;/);
    expect(v).toMatch(/\.p2__app \{[^}]*border-radius: 7px 7px 0 0;/);
  });
  it('unverified rows carry the Proposal tag', () => {
    for (const s of ['lock-music', 'banner', 'screenshot', 'power'] as const) {
      expect(STATES[s].proposal).toBe(true);
      expect(mount(PhoneV2, { props: { state: s } }).find('.p2__proposal').exists()).toBe(true);
    }
    expect(mount(PhoneV2, { props: { state: 'share-people' } }).find('.p2__proposal').exists()).toBe(false);
  });
  it('status menu matches n9-status-menu.png: no panel card, Profile segments, flat magenta Volume, squircle rows, no switches', () => {
    const w = mount(PhoneV2, { props: { state: 'status-more' } });
    expect(w.findAll('.p2-seg > span').map((e) => e.text())).toEqual(['Silent', 'Beep', 'Ringing']);
    expect(w.find('.p2-fill').exists()).toBe(true);
    expect(w.find('.p2-sm .hd-slider, .p2-sm .hd-switch, .p2-sm input[type=range]').exists()).toBe(false);
    expect(w.findAll('.p2-row .hd-squircle').length).toBe(3);
    expect(w.text()).toContain('Transfers');
    expect(w.text()).not.toMatch(/\bMore\b/);
    const v = read('src/stories/explorations/phone2/PhoneV2.vue');
    expect(v).toMatch(/\.p2-fill i \{[^}]*background: #C800B4/);
    expect(v).not.toMatch(/\.p2-(sm|fill|seg)[^{]*\{[^}]*(border-radius|box-shadow)/);
  });
  it('status menu customisation: toggle strip placements, max rows + handle (not a row), swipe pull, edit, settings page', () => {
    const m = (st: string) => mount(PhoneV2, { props: { state: st as never } });
    const c = m('status-more');
    expect(c.findAll('.p2-sm__rows .p2-row').length).toBe(3);
    expect(c.find('button.p2-handle-line').attributes('aria-label')).toBe('Show 3 more rows');
    expect(c.find('.p2-handle-line').classes()).not.toContain('p2-row');
    expect(c.find('.p2-tg').element.previousElementSibling?.className).toBe('p2-fill');
    expect(c.findAll('.p2-tg [role=switch] .hd-squircle').length).toBe(6);
    expect(c.find('[aria-label=Flashlight] .hd-icon').html() + c.find('[aria-label="Mobile data"] .hd-icon').html()).not.toMatch(/M12 2l3|phone/);
    expect(read('src/stories/explorations/phone2/PhoneV2.vue')).toMatch(/\['torch', 'Flashlight'[\s\S]*\['data', 'Mobile data'/);
    const o = m('status-more-open');
    expect(o.find('.p2-tg').element.previousElementSibling?.className).toBe('p2-seg');
    expect(o.findAll('.p2-row--pulled').length).toBe(3);
    expect(o.find('.p2-sm--pull').exists()).toBe(true);
    const e = m('status-edit');
    expect(e.findAll('.p2-blk').length).toBe(7);
    expect(e.findAll('.p2-blk > .p2-x').length).toBe(7);
    expect(e.findAll('.p2-blk > .p2-x:not(.p2-pen)').length).toBe(6);
    expect(e.findAll('.p2-blk [aria-label="Drag to reorder"]').length).toBe(7);
    expect(e.find('.p2-blk--drag').text()).toContain('Brightness');
    expect(e.findAll('.p2-add .p2-add__plus.hd-sq').length).toBe(4);
    expect(e.text()).toContain('Add item');
    const b = m('status-brightness');
    expect(b.find('[role=slider][aria-label=Brightness] i').attributes('style')).toContain('rgb(42, 134, 216)');
    expect(b.find('[role=slider] .hd-slider, [role=slider] input').exists()).toBe(false);
    expect(b.findAll('.p2-sm__label').map((l) => l.text())).toEqual(['Profile', 'Volume', 'Brightness']);
    expect(m('privacy').find('.p2-tg, .p2-handle-line').exists()).toBe(false);
    expect(m('privacy').findAll('.p2-sm__rows .p2-row').length).toBe(7);
    const st = m('status-settings').text();
    for (const t of ['Sliders', 'Brightness', 'Add slider', 'Toggle strip', 'Below Profile', 'Below Volume', 'Below the rows', 'Visible rows', 'All', 'Swipe down', 'Both']) expect(st).toContain(t);
  });
  it('squircle rule: no border-radius on Phone v2 icon tiles, avatars, badges or icon buttons', () => {
    const v = read('src/stories/explorations/phone2/PhoneV2.vue');
    const allowed = ['p2-mu', 'p2-wt', 'p2__proposal', 'p2-extra', 'p2-sb__rec', 'p2__app', 'p2-menu__card', 'p2-code i', 'p2-send', 'p2-kb span'];
    for (const m of v.matchAll(/^\.([^{]+)\{[^}]*border-radius/gm)) expect(allowed.some((a) => m[1].includes(a)), m[1]).toBe(true);
    expect(v).not.toMatch(/(tile|avatar|icon|badge|p2-x)[^{]*\{[^}]*border-radius/);
    expect(read('src/components/HdSlider.vue')).toMatch(/slider-thumb \{[^}]*border: 0; background: var\(--hd-slider-thumb\)/);
  });
  it('web leakage gone: no chips, no light card sheet, snooze via a sheet row; extras are optional', () => {
    const v = read('src/stories/explorations/phone2/PhoneV2.vue');
    for (const c of ['p2-snz', 'p2-prof__p', 'p2-sheet', 'BelleWidget kind="switch"', 'HdSlider']) expect(v).not.toContain(c);
    expect(mount(PhoneV2, { props: { state: 'events-sheet' } }).find('.p2-menu').text()).toContain('Snooze');
    const ex = mount(PhoneV2, { props: { state: 'extras' } });
    const names = [...CORE, ...SMALL].map((s) => STATES[s].extra).filter(Boolean);
    expect(ex.findAll('.p2-set .hd-switch').length).toBe(new Set(names).size);
    expect(ex.findAll('input:checked').length).toBe(0);
    for (const s of [...CORE, ...SMALL]) if (STATES[s].extra) expect(mount(PhoneV2, { props: { state: s } }).find('.p2-extra').text()).toContain('Android extras');
    expect(mount(PhoneV2, { props: { state: 'banner' } }).find('.p2-extra').exists()).toBe(false);
  });
  it('N9 slider: thin dark groove, accent fill, end icons outside the track', () => {
    const w = mount(HdSlider, { props: { label: 'Brightness', modelValue: 40, startIcon: 'star', endIcon: 'star' } });
    expect(w.findAll('.hd-slider__end').length).toBe(2);
    expect(read('src/components/HdSlider.vue')).toMatch(/height: 4px;/);
  });
  it('heads-up banner has no buttons and animates drop / hold / swipe up', () => {
    const w = mount(PhoneV2, { props: { state: 'banner' } });
    expect(w.find('.p2-banner').exists()).toBe(true);
    expect(w.find('.p2-banner button').exists()).toBe(false);
    expect(read('src/stories/explorations/phone2/PhoneV2.vue')).toMatch(/@keyframes p2-banner \{ 0% \{ transform: translateY\(-140%\); opacity: 0; \}/);
    expect(w.find('.p2-banner .hd-lock-card, .p2-banner [class*="hd-lock"]').exists()).toBe(true);
    expect(w.find('.p2-tags').element.parentElement?.classList.contains('p2')).toBe(true); expect(w.find('.p2-tags--banner').exists()).toBe(true);
  });
  it('album art, screenshot thumbnail and gallery are content shown as is', () => {
    const v = read('src/stories/explorations/phone2/PhoneV2.vue');
    expect(read('src/stories/belle/BelleWidget.vue')).toMatch(/class="bw-music__art"[^>]*role="img"/);
    expect(v).toMatch(/class="p2-info__thumb"/);
    expect(v.slice(v.indexOf('<template>'))).not.toMatch(/<HdSquircle[^>]*(art|Screenshot)/);
  });
  it('docs page lists every mock with its story id, the leave-out list and the open questions', () => {
    const mdx = read('src/stories/guide/PhoneV2.mdx');
    for (const k of ['storyId(s)', 'LEAVE_OUT.map', 'QUESTIONS.map', 'NO_MOCK.map']) expect(mdx).toContain(k);
    expect(storyId('banner')).toBe('explorations-phone-v2--banner');
    expect(storyId('history' as P2State)).toBe('explorations-phone-v2--gallery'); // not a state: falls back to the gallery
    expect(LEAVE_OUT.map((l) => l[0])).toEqual(expect.arrayContaining(['One-handed mode', 'Bubbles', 'App pairs']));
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(5);
  });
  it('no third-party trademarks', () => expect(read('src/stories/explorations/phone2/PhoneV2.vue') + read('src/stories/explorations/phone2/states.ts')).not.toMatch(/Google|Skype|Facebook|Nokia|Ovi|Spotify|WhatsApp/));
});

// 2026-10-25: edit modes (✕ right, handle left), N9 Back arrow geometry, identical edit-bar buttons.
import { BACK_ARROW_PATH } from '../src/components/backArrow';
import HdTaskEditBar from '../src/components/HdTaskEditBar.vue';
describe('edit modes, Back, edit bar', () => {
  it('✕ remove badge always right of the item, drag handle left', () => {
    for (const st of ['status-edit', 'status-settings'] as const) {
      const w = mount(PhoneV2, { props: { state: st } });
      for (const el of w.findAll('.p2-blk, .p2-set').filter((e) => e.find('.p2-x').exists() || e.find('.p2-handle').exists())) {
        const kids = [...el.element.children];
        const x = kids.findIndex((k) => k.classList.contains('p2-x') && !k.classList.contains('p2-pen')); const h = kids.findIndex((k) => k.classList.contains('p2-handle'));
        if (x >= 0) {
          expect(x, st).toBe(kids.length - 1);
          const badge = kids[x];
          expect(badge.classList.contains('hd-squircle') || !!badge.querySelector('.hd-squircle'), 'badge is a squircle').toBe(true);
          expect(badge.querySelector('.hd-squircle svg.p2-x__g') ?? (badge.classList.contains('hd-squircle') && badge.querySelector('svg.p2-x__g')), '✕ inside the squircle').toBeTruthy();
          expect(badge.querySelector('svg.p2-x__g path')?.getAttribute('d'), 'badge contains the ✕').toMatch(/^M9\.3 9\.3/);
          expect(badge.querySelector('svg.p2-x__g path')?.getAttribute('stroke')).toBe('#fff');
          expect(el.element.contains(badge)).toBe(true);
        }
        if (h >= 0) expect(h, st).toBe(0);
      }
    }
    expect(read('src/stories/explorations/phone2/PhoneV2.vue')).toMatch(/\.p2-x \{ flex: none; margin-left: auto; \}/);
    expect(read('src/stories/explorations/phone2/PhoneV2.vue')).not.toMatch(/p2-x[^{]*\{[^}]*position: static/);
    const ed = mount(PhoneV2, { props: { state: 'status-edit' } });
    expect(ed.findAll('.p2-tg__t .p2-x').length, 'no per-tile badges in the menu edit mode').toBe(0);
    const tb = ed.findAll('.p2-blk').find((b) => b.find('.p2-tgblk').exists())!;
    expect(tb.find('.hd-button').exists()).toBe(false);
    const pen = tb.element.lastElementChild!;
    expect(pen.classList.contains('p2-pen')).toBe(true);
    expect(pen.getAttribute('aria-label') ?? pen.querySelector('[aria-label]')?.getAttribute('aria-label')).toBe('Edit toggles');
    const box = (el: Element) => [((el.querySelector('.hd-squircle') ?? el).getAttribute('style') ?? '').replace(/--hd-sq-fill:[^;]*;?|background[^;]*;?/g, ''), el.querySelector('svg.p2-x__g')?.getAttribute('width'), el.querySelector('svg.p2-x__g')?.getAttribute('height'), el.className.replace(' p2-pen', '')];
    expect(box(pen), 'pencil badge = ✕ badge box').toEqual(box(ed.find('.p2-blk > .p2-x:not(.p2-pen)').element));
    expect(tb.find('[aria-label="Remove Toggles"]').exists(), 'the strip cannot be removed').toBe(false);
    expect(read("src/stories/explorations/phone2/PhoneV2.vue")).toContain(`class="p2-x p2-pen" color="linear-gradient(#FFFFFF, #ECECEE 50%, #CFCFD3)"`);
    const em = mount(PhoneV2, { props: { state: 'status-edit-empty' } });
    expect(em.find('.p2-tg-empty').text()).toContain('No toggles — tap ✎ to add');
    expect(em.findAll('.p2-tg-empty svg path[stroke-dasharray]').length).toBe(6);
    expect(em.find('.p2-tg').exists()).toBe(false);
    expect(em.find('.p2-pen').exists()).toBe(true);
    const ns = mount(PhoneV2, { props: { state: 'status-no-strip' } });
    expect(ns.find('.p2-tg, .p2-tg-empty').exists()).toBe(false);
    expect(ns.find('.p2-fill').element.nextElementSibling?.className).toContain('p2-sm__rows');
    const te = mount(PhoneV2, { props: { state: 'toggles-editor' } });
    expect(te.findAll('.p2-set--tile:not(.p2-set--avail)').length).toBe(6);
    for (const r of te.findAll('.p2-set--tile:not(.p2-set--avail)')) { const k = [...r.element.children]; expect(k[0].classList.contains('p2-handle')).toBe(true); expect(k[k.length - 1].querySelector('svg.p2-x__g path')).toBeTruthy(); }
    expect(te.find('.p2-sec').text()).toBe('Available');
    expect(te.text()).toContain('VPN switch · from an app');
    const two = mount(PhoneV2, { props: { state: 'status-two-rows' } });
    expect(two.findAll('.p2-tg [role=switch]').length).toBe(10);
    expect(read('src/stories/explorations/phone2/PhoneV2.vue')).toContain('.p2-tg { display: grid; grid-template-columns: repeat(6, auto); justify-content: space-between;');
    expect(mount(PhoneV2, { props: { state: 'status-settings' } }).text()).toContain('Opens the toggles editor');
    expect(read('src/stories/belle/BelleWidget.vue')).toMatch(/\.bw-close \{[^}]*right: 0;/);
    expect(read('src/components/HdTaskCard.vue')).toMatch(/\.hd-task-card__close \{[\s\S]*?right: calc/);
  });
  it('Back arrow: bounding box (with stroke) centred ±1px and padded inside the 33px squircle', () => {
    const n = BACK_ARROW_PATH.match(/-?\d+(\.\d+)?/g)!.map(Number);
    const xs = n.filter((_, i) => i % 2 === 0), ys = n.filter((_, i) => i % 2 === 1), k = 33 / 24, sw = 2.6 / 2;
    const [x0, x1, y0, y1] = [Math.min(...xs) - sw, Math.max(...xs) + sw, Math.min(...ys) - sw, Math.max(...ys) + sw].map((v) => v * k);
    expect(Math.abs((x0 + x1) / 2 - 16.5)).toBeLessThanOrEqual(1);
    expect(Math.abs((y0 + y1) / 2 - 16.5)).toBeLessThanOrEqual(1);
    expect(x0).toBeGreaterThanOrEqual(6); expect(33 - x1).toBeGreaterThanOrEqual(6);
    expect((x1 - x0) / 33).toBeGreaterThan(.5); expect((x1 - x0) / 33).toBeLessThan(.62);
    const tb = mount(HdToolBar, { props: { back: true } });
    expect(tb.find('.hd-toolbar__back svg').attributes()).toMatchObject({ width: '33', height: '33' });
    expect(tb.find('.hd-toolbar__back path').attributes('d')).toBe(BACK_ARROW_PATH);
    expect(read('src/stories/quasar/Examples.stories.ts')).toContain('${BACK_ARROW_PATH}');
    expect(read('src/components/HdToolBar.vue') + read('src/quasar/etesian-quasar.css')).toContain('--hd-sq-ring: rgba(255,255,255,.1)');
  });
  it('all edit-bar buttons are the same HdButton dark / bar', () => {
    const w = mount(HdTaskEditBar, { props: { closeAllLabel: 'Add item' } });
    const b = w.findAll('.hd-task-edit-bar button');
    expect(b.length).toBe(2);
    expect(b[0].classes().sort()).toEqual(b[1].classes().sort());
    expect(b[0].classes()).toEqual(expect.arrayContaining(['hd-button--dark', 'hd-button--bar']));
    for (const f of ['src/stories/explorations/phone2/PhoneV2.vue', 'src/stories/BelleWidgets.stories.ts', 'src/stories/Home.stories.ts']) expect(read(f)).not.toMatch(/hd-task-edit-bar__btn|class="[^"]*edit-bar__done/);
  });
});

describe('Phone v2 review pass', () => {
  it('dev tags sit in the status bar (never over content); sheets are the N9 toolbar menu', () => {
    for (const st of ['events-sheet', 'lock-music', 'status-edit'] as const) {
      const w = mount(PhoneV2, { props: { state: st } });
      for (const t of w.findAll('.p2-extra, .p2__proposal')) expect(t.element.closest('.p2-tags'), st).toBeTruthy();
      expect(read('src/stories/explorations/phone2/PhoneV2.vue')).toContain('.p2-tags { position: absolute; z-index: 12; left: 50%; top: 4px;');
    }
    const v = read('src/stories/explorations/phone2/PhoneV2.vue');
    expect(v).toContain('.p2-menu__card::before { content: \'\'; position: absolute; z-index: -2; inset: -12px; background: #DCDADE; }');
    expect(v).toMatch(/\.p2-menu \{[^}]*padding: 0 11px 11px; background: rgba\(0,0,0,\.45\);/);
    expect(mount(PhoneV2, { props: { state: 'events-sheet' } }).findAll('.p2-menu__r').map((r) => r.text().split('15')[0])).toEqual(['Reply', 'Mark as read', 'Snooze', 'Dismiss']);
  });
});

import * as Msg from '../src/stories/pages/Messaging.stories';
import { composeStories } from '@storybook/vue3-vite';
describe('N9 composer: Send / counter / attach live in the keyboard strip', () => {
  const M = composeStories(Msg);
  it('idle conversation: field + service icon only, no Send, no counter', () => {
    const w = mount(M.MessagingConversation());
    expect(w.find('.xm-compose .hd-squircle').exists()).toBe(true);
    expect(w.find('.xm-send, .xm-count, .xm-strip, .xm-kb').exists()).toBe(false);
  });
  it('typing: composer, then the white strip (attach, emoticon, counter, Send), then the keys', () => {
    for (const st of [M.MessagingConversationTyping, M.MessagingCompose]) {
      const w = mount(st());
      expect(w.find('.xm-compose .xm-send, .xm-body .xm-send').exists()).toBe(false);
      const strip = w.find('.xm-strip');
      expect(strip.find('.xm-send').text()).toBe('Send');
      expect(strip.find('.xm-count').text()).toMatch(/^\d+\(1\)$/);
      expect(strip.element.nextElementSibling?.classList.contains('xm-kb')).toBe(true);
    }
  });
  it('Phone v2 inline reply uses the same split', () => {
    const w = mount(PhoneV2, { props: { state: 'events-reply' } });
    expect(w.find('.p2-reply__f .p2-send').exists()).toBe(false);
    expect(w.find('.p2-kstrip .p2-send').exists()).toBe(true);
    expect(w.find('.p2-kstrip').element.nextElementSibling?.classList.contains('xm-kb')).toBe(true);
  });
});

describe('one N9 keyboard everywhere', () => {
  it('every mock keyboard has Shift and Backspace on the third row', () => {
    const M = composeStories(Msg);
    const ws = [mount(M.MessagingCompose()), mount(M.MessagingConversationTyping()), mount(PhoneV2, { props: { state: 'events-reply' } })];
    for (const w of ws) { const row = w.findAll('.xm-kb > div')[2]; expect(row.find('[aria-label=Shift]').exists()).toBe(true); expect(row.find('[aria-label=Backspace]').exists()).toBe(true); }
    expect(read('src/stories/explorations/phone2/PhoneV2.vue')).not.toContain('p2-kb');
  });
});

describe('readable grey text on black (N9 sampled)', () => {
  const lum = (h: string) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
  const onBlack = (h: string) => (lum(h) + .05) / .05;
  it('dark secondary / tertiary tokens reach 4.5:1 on #000', () => {
    const t = read('src/styles/tokens.css'); const d = t.slice(t.indexOf('[data-hd-mode="dark"], .hd-mode-dark'));
    for (const k of ['secondary', 'tertiary']) { const h = d.match(new RegExp(`--hd-c-fg-${k}: (#[0-9A-Fa-f]{6})`))![1]; expect(onBlack(h), k).toBeGreaterThanOrEqual(4.5); }
  });
  it('Phone v2 is dark-themed and uses no dark grey text outside light surfaces / dimmed layers', () => {
    expect(mount(PhoneV2, { props: { state: 'events-reply' } }).classes()).toContain('hd-theme-dark');
    const v = read('src/stories/explorations/phone2/PhoneV2.vue');
    const light = /p2-wt|p2-sugg|p2-reply|p2-row--light|p2-appbg|p2-kstrip|p2-count|p2-seg|p2-dimmed|p2-tg--avail|p2-card|p2-share/;
    for (const m of v.matchAll(/^([^{\n]+)\{([^}]*)\}/gm)) for (const c of m[2].matchAll(/(?:^|[;\s])color: (#[0-9A-Fa-f]{6})/g)) {
      const h = c[1]; const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
      if (Math.max(r, g, b) - Math.min(r, g, b) < 24 && !light.test(m[1])) expect(onBlack(h), `${m[1]} ${h}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

// fg-tertiary must come from tokens.json (tokens.css is generated and gets overwritten), 2026-10-25
describe('tertiary text token survives regeneration', () => {
  it('is defined in tokens.json and in the generated tokens.css', () => {
    const fs = require('node:fs');
    expect(fs.readFileSync(`${process.cwd()}/tokens/tokens.json`, 'utf8')).toContain('"fg-tertiary"');
    expect(fs.readFileSync(`${process.cwd()}/src/styles/tokens.css`, 'utf8')).toMatch(/--hd-c-fg-tertiary: #A0A0A0;/);
  });
});

describe('status music', () => {
  it('07 shows the music row (art as is, title, ⏸) without the dialog; 07b the Play on dialog over a ≥90% backdrop', () => {
    const a = mount(PhoneV2, { props: { state: 'status-music' } });
    expect(a.find('.p2-sm .bw-music .bw-music__art[role=img]').exists()).toBe(true);
    expect(a.find('.bw-mlarge').exists()).toBe(false);
    expect(a.findAll('.bw-music__ctl .hd-squircle').length).toBe(3); expect(a.find('.bw-music__out').text()).toBe('Headset');
    expect(mount(BelleWidget, { props: { kind: 'music' } }).find('.bw-music__title').text()).toBe('Go to Music library');
    const e = mount(BelleWidget, { props: { kind: 'music-large' } });
    expect(e.find('.bw-mlarge__art--empty').text()).toBe('Go to Music library'); expect(e.attributes('data-cells')).toBe('4x3');
    expect(read('docs/22-home-widgets.md')).toMatch(/music-large[^\n]*launcher/);
    expect(mount(PhoneV2, { props: { state: 'status-music-output' } }).find('.bw-music').exists()).toBe(true);
    const d = mount(PhoneV2, { props: { state: 'dictionary-tracker' } });
    expect(d.find('.p2-wordwrap > .p2-cur + .p2-wt').exists()).toBe(true);
    expect(a.find('.p2-sel').exists()).toBe(false);
    const b = mount(PhoneV2, { props: { state: 'status-music-output' } });
    expect(b.find('.p2-sel h3').text()).toBe('Play on');
    expect(read('src/stories/explorations/phone2/PhoneV2.vue')).toMatch(/\.p2-sel \{[^}]*background: rgba\(0,0,0,\.9[0-9]\)/);
    expect(STATES['lock-music'].note).toMatch(/album art/);
  });
});

describe('hardware keyboard + dictionary', () => {
  const M = composeStories(Msg);
  it('hardware keyboard: white strip alone at the bottom, no keys; landscape 640 x 360', () => {
    for (const st of [M.MessagingConversationHw, M.MessagingComposeHw, M.MessagingConversationHwLandscape, M.MessagingComposeHwLandscape]) {
      const w = mount(st());
      expect(w.find('.xm-kb').exists()).toBe(false);
      expect(w.find('.xm-phone').element.lastElementChild?.classList.contains('xm-strip')).toBe(true);
      expect(w.find('.xm-strip .xm-send').exists()).toBe(true);
    }
    expect(mount(M.MessagingComposeHwLandscape()).find('.xm-phone--land').exists()).toBe(true);
    for (const st of ['events-reply-hw', 'events-reply-hw-land'] as const) {
      const w = mount(PhoneV2, { props: { state: st } });
      expect(w.find('.xm-kb').exists()).toBe(false);
      expect(w.find('.p2-reply').element.lastElementChild?.classList.contains('p2-kstrip')).toBe(true);
    }
    expect(mount(PhoneV2, { props: { state: 'events-reply-hw-land' } }).classes()).toContain('p2--land');
  });
  it('dictionary: word tracker bubble, candidate list, hw suggestions (proposal)', () => {
    const t = mount(PhoneV2, { props: { state: 'dictionary-tracker' } });
    expect(t.find('.p2-cur').text()).toBe('lste'); expect(t.find('.p2-wt').text()).toBe('late'); expect(t.find('.xm-kb').exists()).toBe(true);
    const l = mount(PhoneV2, { props: { state: 'dictionary-list' } });
    expect(l.findAll('.p2-wl__r').map((r) => r.text())).toEqual(['late', 'list', 'lose', 'lste']);
    const h = mount(PhoneV2, { props: { state: 'dictionary-hwkb' } });
    expect(h.find('.p2-kstrip .p2-sugg b').text()).toBe('late'); expect(h.find('.p2__proposal').exists()).toBe(true); expect(h.find('.xm-kb').exists()).toBe(false);
    expect(read('src/stories/explorations/phone2/PhoneV2.vue')).toMatch(/\.p2-wt \{[^}]*background: #F7F7F7;[^}]*color: #282828;/);
  });
});

it('empty music widgets always show a dimmed Play, even with on', () => {
  for (const kind of ['music', 'music-large'] as const) {
    const w = mount(BelleWidget, { props: { kind, on: true } });
    expect(w.find('[aria-label=Play]').exists(), kind).toBe(true);
    expect(w.find('[aria-label=Pause]').exists(), kind).toBe(false);
    expect(w.findAll('.is-dim').length, kind).toBe(3);
  }
});

it('Messages list follows n9-messages-list.jpg', () => {
  const w = mount(composeStories(Msg).MessagingList());
  expect(w.find('.xm-lh').text()).toContain('Messages');
  expect(w.findAll('.xm-sec').map((x) => x.text())).toEqual(['Today', 'Yesterday']);
  const th = w.findAll('.xm-th');
  expect(th[0].classes()).toContain('is-unread');
  for (const t of th) expect(t.element.lastElementChild?.classList.contains('xm-av'), 'avatar on the right').toBe(true);
  expect(w.find('.xm-meta--fail').text()).toBe('Failed');
  expect(w.findAll('.xm-av .hd-squircle').length).toBeGreaterThanOrEqual(5);
  expect(w.findAll('.hd-toolbar .hd-tool-icon').length).toBe(2);
});

it('Messages list meta rule: service thread "time | Service", SMS = time only, failed SMS = red "Failed"', () => {
  const metas = mount(composeStories(Msg).MessagingList()).findAll('.xm-meta');
  const t = metas.map((m) => m.text());
  expect(t.some((x) => /^\d{1,2}:\d\d \| \S/.test(x)), 'service thread').toBe(true);
  expect(t.some((x) => /^\d{1,2}:\d\d$/.test(x)), 'plain SMS').toBe(true);
  for (const m of metas) expect(m.classes().includes('xm-meta--fail')).toBe(m.text() === 'Failed');
});

it('08 banner is a floating bubble: lock card, inset, no band', () => {
  const css = read('src/stories/explorations/phone2/PhoneV2.vue');
  const rule = css.match(/\.p2-banner \{[^}]*\}/)![0];
  expect(rule).toMatch(/top: 30px; left: 12px; right: 12px;/);
  expect(rule).not.toMatch(/background/);
  expect(css).toMatch(/time="14:12"/);
});

it('Profile strip: Ringing segment is the ringer volume slider; Mode strip has no remainder', () => {
  const css = read('src/stories/explorations/phone2/PhoneV2.vue');
  expect(css).toMatch(/class="p2-seg__ring"[^>]*role="slider"[^>]*aria-label="Ringing volume"/);
  expect(css).toMatch(/\.p2-seg__ring\.sel \{ background: linear-gradient\(90deg, #4A9BFF var\(--ring\), #3A3A3A var\(--ring\)\)/);
  expect(css).not.toMatch(/p2-seg[^"]*">.*?<i \/><\/div>/);
  expect(css).toMatch(/is\('status-ring-low'\) \? 25 : 60/);
  expect(css).toMatch(/\.p2-seg--4 > span \{ flex: 1 1 auto;/);
});

it('Share sheet: Filter field, many squircle targets, Pinned, filter matches word starts, people optional', () => {
  const v = read('src/stories/explorations/phone2/PhoneV2.vue');
  expect(v).toMatch(/<HdSearchField[^>]*placeholder="Filter"/);
  expect((v.match(/const TARGETS[\s\S]*?\];\n/)![0].match(/\['[^']+', '/g) || []).length).toBeGreaterThanOrEqual(12);
  expect(v).toMatch(/p2-share__sec">Pinned/);
  expect(v).toMatch(/is\('share-people'\)[^\n]*Suggested people/);
  const st = read('src/stories/explorations/phone2/states.ts');
  expect(st).toMatch(/'share-people': \{ extra: 'Suggested people in share'/);
  const words = (n: string, q: string) => n.toLowerCase().split(/\s+/).some((w) => w.startsWith(q));
  expect(['Notes', 'Nearby', 'Mail'].filter((n) => words(n, 'no'))).toEqual(['Notes']);
});

it('share Filter is an N9 text field (light, control radius, sunken), not a pill', () => {
  const v = read('src/stories/explorations/phone2/PhoneV2.vue');
  expect(v).toMatch(/class="p2-share__f hd-theme-light"/);
  expect(v).toMatch(/\.p2-share__f \.hd-search \.hd-field__box \{ border-radius: var\(--hd-radius-control\); background: #fff; box-shadow: inset/);
});

it('every Phone v2 banner/toast is the lock-card bubble; screenshot uses a square thumbnail', () => {
  for (const s of ['banner', 'screenshot', 'pinning', 'copied'] as const) {
    const w = mount(PhoneV2, { props: { state: s } });
    expect(w.find('.p2-banner .hd-lock-card').exists(), s).toBe(true);
    expect(w.find('.hd-info-banner').exists(), s).toBe(false);
  }
  const w = mount(PhoneV2, { props: { state: 'screenshot' } });
  expect(w.find('.hd-lock-card .p2-info__thumb').exists()).toBe(true);
  expect(w.find('.hd-lock-card .hd-squircle').exists()).toBe(false);
});

it('query/selection dialog backdrops are near-opaque (>= 90% black)', () => {
  const v = read('src/stories/explorations/phone2/PhoneV2.vue');
  const a = Number(v.match(/\.p2-dim \{[^}]*background: rgba\(0,0,0,(\.\d+)\)/)![1]);
  expect(a).toBeGreaterThanOrEqual(0.9);
  for (const s of ['power', 'permission', 'wifi-qr'] as const) expect(mount(PhoneV2, { props: { state: s } }).find('.p2-dim').exists(), s).toBe(true);
});

it('live update lives only in Events (pinned item with progress), never in the status bar', () => {
  const w = mount(PhoneV2, { props: { state: 'live-update' } });
  expect(w.find('.p2-strip').exists()).toBe(false);
  expect(w.find('.p2-sb').text()).not.toContain('Timer');
  const it0 = w.find('.p2-ev .hd-event');
  expect(it0.classes()).toContain('p2-live');
  expect(it0.find('.p2-prog').exists()).toBe(true);
});

it('Phone v2 Events matches the real pane: date + weather header, Notifications/Feed sections, no bottom bar; live Timer first', () => {
  for (const s of ['events-sheet', 'events-reply', 'live-update', 'dictionary-tracker'] as const) {
    const w = mount(PhoneV2, { props: { state: s } });
    expect(w.find('.hd-events-header').text(), s).toContain('Monday');
    expect(w.find('.hd-events-header__city').text()).toBe('Athens');
    expect(w.text()).toContain('Notifications');
    expect(w.text()).toContain('Feed');
    expect(w.find('.p2-ev ~ .hd-toolbar').exists(), s).toBe(false);
  }
  const w = mount(PhoneV2, { props: { state: 'live-update' } });
  expect(w.findAll('.p2-ev .hd-event')[0].classes()).toContain('p2-live');
});

it('lock screen = the real Pro1-X lock: right-aligned thin clock, full date, glance line right-aligned and tagged optional', () => {
  const v = read('src/stories/explorations/phone2/PhoneV2.vue');
  expect(v).toMatch(/\.p2-lock__clock \{ align-self: flex-end;[^}]*font: 200/);
  expect(v).toMatch(/\.p2-lock__date \{ align-self: flex-end;/);
  expect(v).toMatch(/\.p2-lock__glance \{ align-self: flex-end;[^}]*var\(--hd-c-fg-secondary\)/);
  const w = mount(PhoneV2, { props: { state: 'lock-glance' } });
  expect(w.find('.p2-lock__date').text()).toBe('Monday, 26 October 2026');
  expect(w.find('.p2-extra').exists()).toBe(true);
});

it('gallery tiles follow approved rules: per-stream rows Media/Alarm/Call (no duplicate), split-drag uses real app cards', () => {
  const v = mount(PhoneV2, { props: { state: 'volume-row' } });
  const labels = v.findAll('.p2-sm__label').map((e) => e.text());
  expect(labels).toContain('Media'); expect(labels).not.toContain('Volume');
  expect(labels.filter((l) => l === 'Media').length).toBe(1);
  const d = mount(PhoneV2, { props: { state: 'split-drag' } });
  expect(d.findAll('.p2-oa__c').length).toBe(4); // reorder: real app cards, one lifted, a dashed landing slot
  expect(d.findAll('.p2-oa__c--lift').length).toBe(1); expect(d.findAll('.p2-oa__c--gap').length).toBe(1);
  const m = mount(PhoneV2, { props: { state: 'split-merge' } });
  expect(m.findAll('.p2-oa__f').length).toBe(2); // two fingers
  expect(m.find('.p2-oa__hint').text()).toContain('spread to cancel');
  expect(read('src/stories/explorations/phone2/PhoneV2.vue')).not.toMatch(/p2-card--drag \{[^}]*rotate/);
});
