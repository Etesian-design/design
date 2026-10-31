import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, computed } from 'vue';
import XChoice from './parts/XChoice.vue';
import XStage from './parts/XStage.vue';
import PhoneV2 from './phone2/PhoneV2.vue';
import XMerge from './phone2/XMerge.vue';
import XGhost from './phone2/XGhost.vue';
import HdSwitch from '../../components/HdSwitch.vue';
import { STATES, CORE, SMALL, type P2State } from './phone2/states';

/** Explorations: Phone v2, the Android 16 feature-gap proposals (vendor/etesian/docs/android-feature-gap.md). Mockups only. */
const meta: Meta = {
  title: 'Explorations/Phone v2',
  excludeStories: ['one'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Every N9-style proposal from the Android 16 feature-gap survey as a 360 × 640 phone mock (7px app-window top corners, squircles, content as is, N9 bottom bars (first / last 44 n9px from the edges, evenly spaced), Events, status menu, Belle switches). Pick a state with the switcher; one story per state below; the small proposals are also in *Gallery*. Mocks of rows marked “(?)” carry a **Proposal** tag. Summary, priorities, the leave-out list and open questions: Guide / Phone v2 proposals.' } } },
};
export default meta;
const tabs = (ids: readonly P2State[]) => ids.map((id) => ({ id, label: STATES[id].tab }));

export const Tour: StoryObj<{ state: P2State }> = {
  name: 'Phone v2',
  args: { state: 'status-more' },
  argTypes: { state: { control: { type: 'select' }, options: [...CORE, ...SMALL] } },
  render: (args) => ({
    components: { XStage, XChoice, PhoneV2 },
    setup: () => { const s = ref<P2State>(args.state); return { s, info: computed(() => STATES[s.value]), CT: tabs(CORE), ST: tabs(SMALL) }; },
    template: `<XStage :title="info.title + ' (gap ' + info.gaps.map((g) => '#' + g).join(', ') + ', ' + info.pri + ', ' + info.effort + ')'" :idea="info.idea + (info.note ? ' ' + info.note : '')" :gain="info.gain" :cost="info.cost"><template #controls>
        <XChoice v-model="s" :tabs="CT" label="Top 10" id-prefix="p2c" /><XChoice v-model="s" :tabs="ST" label="Smaller gaps" id-prefix="p2s" />
      </template><PhoneV2 :key="s" :state="s" /></XStage>`,
  }),
};
export const one = (state: P2State): StoryObj => ({
  name: STATES[state].title,
  parameters: { layout: 'centered', docs: { description: { story: `Gap ${STATES[state].gaps.map((g) => '#' + g).join(', ')} · ${STATES[state].pri} · ${STATES[state].effort}${STATES[state].proposal ? ' · **Proposal (unverified)**' : ''}. ${STATES[state].idea}` } } },
  render: () => ({ components: { PhoneV2 }, setup: () => ({ state }), template: '<PhoneV2 :state="state" />' }),
});
export const StatusMore = one('status-more');
export const StatusRingLow = one('status-ring-low');
export const StatusBrightness = one('status-brightness');
export const StatusMoreOpen = one('status-more-open');
export const StatusEdit = one('status-edit');
export const StatusEditEmpty = one('status-edit-empty');
export const StatusNoStrip = one('status-no-strip');
export const TogglesEditor = one('toggles-editor');
export const StatusTwoRows = one('status-two-rows');
export const StatusSettings = one('status-settings');
export const EventsSheet = one('events-sheet');
export const EventsReply = one('events-reply');
export const LockMusic = one('lock-music');
export const EventsReplyHw = one('events-reply-hw');
export const EventsReplyHwLand = one('events-reply-hw-land');
export const DictionaryTracker = one('dictionary-tracker');
export const DictionaryList = one('dictionary-list');
export const DictionaryHwkb = one('dictionary-hwkb');
export const StatusMusic = one('status-music');
export const StatusMusicOutput = one('status-music-output');
export const Banner = one('banner');
export const Profiles = one('profiles');
export const ModeDetail = one('mode-detail');
export const Share = one('share');
export const ShareFilter = one('share-filter');
export const SharePeople = one('share-people');
export const Privacy = one('privacy');
export const Screenshot = one('screenshot');
export const Power = one('power');
export const Permission = one('permission');
export const Pinning = one('pinning');
export const LiveUpdate = one('live-update');
export const LockGlance = one('lock-glance');
export const Extras = one('extras');
export const Gallery: StoryObj = {
  name: 'Gallery: smaller gaps',
  parameters: { layout: 'fullscreen' },
  render: () => ({ components: { PhoneV2 }, setup: () => ({ SMALL, STATES }), template: `<div style="display:flex;flex-wrap:wrap;gap:20px;padding:16px;background:var(--hd-c-bg);color:var(--hd-c-fg)">
    <figure v-for="s in SMALL" :key="s" style="margin:0;width:252px"><div style="width:252px;height:448px;overflow:hidden"><div style="transform:scale(.7);transform-origin:0 0"><PhoneV2 :state="s" /></div></div>
      <figcaption style="font-size:12px;line-height:1.35;margin-top:6px"><b>{{ STATES[s].title }}</b><br>#{{ STATES[s].gaps.join(', #') }} · {{ STATES[s].pri }} · {{ STATES[s].effort }}<span v-if="STATES[s].proposal" style="color:#E07A12"> · Proposal</span></figcaption></figure></div>` }),
};

/** Interactive: try the two-finger split. Touch: one finger on each card. Mouse: drag a card towards its neighbour. */
export const TwoFingerSplit: StoryObj<{ autoplay: boolean; at?: number }> = {
  name: 'Try it: two-finger split',
  args: { autoplay: false },
  argTypes: { at: { control: { type: 'number', step: 0.1 } } },
  parameters: { layout: 'centered', docs: { description: { story: 'Pull two cards in a row together: they light up, slide in and shrink; past the snap point they become one split card showing both covers. Spread apart to cancel; lift while merged to keep the pair. Mouse: drag a card towards its neighbour.' } } },
  render: (args) => ({ components: { XMerge }, setup: () => ({ args }), template: '<XMerge :autoplay="args.autoplay" :at="args.at" />' }),
};

/** Interactive: ghost rows (dismissed notifications linger, faded). Swipe a notification away to see it drop in; tap the ghost rows for Earlier; swipe them to expire. */
export const GhostRows: StoryObj<{ size: 'small' | 'big'; amount: number; page: boolean }> = {
  name: 'Try it: ghost rows',
  args: { size: 'small', amount: 2.5, page: false },
  argTypes: { size: { control: { type: 'inline-radio' }, options: ['small', 'big'] }, amount: { control: { type: 'select' }, options: [0.5, 1, 1.5, 2, 2.5, 3] } },
  parameters: { layout: 'centered', docs: { description: { story: 'Android extra, off by default. Settings: size (small one-line or big), how many rows (0.5 big only, 1–3 in halves; a half row is cut and almost gone), how long they stay (hours or forever). The rows act as one item: tap opens Earlier, swipe expires them all. Dismiss a notification (swipe it) to see it fold out and drop in as the top ghost row.' } } },
  render: (args) => ({
    components: { XGhost, XChoice, HdSwitch },
    setup: () => {
      const on = ref(true), size = ref(args.size), amount = ref(String(args.amount)), keep = ref('12');
      const AMOUNTS = computed(() => ['0.5', '1', '1.5', '2', '2.5', '3'].filter((a) => size.value === 'big' || a !== '0.5').map((a) => ({ id: a, label: a })));
      return { args, on, size, amount, keep, AMOUNTS, SIZES: [{ id: 'small', label: 'Small' }, { id: 'big', label: 'Big' }], KEEP: [['1', '1 hour'], ['4', '4 hours'], ['12', '12 hours'], ['24', '24 hours'], ['0', 'Forever']].map(([id, label]) => ({ id: id!, label: label! })) };
    },
    template: `<div style="display:flex;gap:28px;align-items:flex-start;flex-wrap:wrap">
      <XGhost :key="size + amount + on" :size="size" :amount="on ? Number(amount) : 0" :page="args.page" />
      <div class="xg-set hd-theme-dark" style="width:300px;background:#000;color:#fff;padding:12px 16px;font-size:15px">
        <h3 style="font:300 26px/1.2 var(--hd-font-family-light);margin:4px 0 12px">Ghost rows</h3>
        <div style="display:flex;justify-content:space-between;align-items:center;min-height:52px"><b>Keep dismissed notifications</b><HdSwitch v-model="on" aria-label="Keep dismissed notifications" /></div>
        <template v-if="on">
          <div style="margin:10px 0 4px;color:#A0A0A0">Size</div><XChoice v-model="size" :tabs="SIZES" label="Size" id-prefix="xg-s" />
          <div style="margin:14px 0 4px;color:#A0A0A0">Rows shown</div><XChoice v-model="amount" :tabs="AMOUNTS" label="Rows" id-prefix="xg-a" />
          <div style="margin:14px 0 4px;color:#A0A0A0">Keep for</div><XChoice v-model="keep" :tabs="KEEP" label="Keep for" id-prefix="xg-k" />
        </template>
      </div></div>`,
  }),
};
