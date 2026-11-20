import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref, computed } from 'vue';
import XChoice from './parts/XChoice.vue';
import PhoneV2 from './phone2/PhoneV2.vue';
import XMerge from './phone2/XMerge.vue';
import XGhost from './phone2/XGhost.vue';
import HdSwitch from '../../components/HdSwitch.vue';
import { STATES, STATUS, STATUS_LABEL, CORE, SMALL, type P2State } from './phone2/states';

/** Phone / Android features: Etesian's answer to each Android 16 feature the N9 never had (vendor/etesian/docs/android-feature-gap.md), as mocks, each tagged with what became of it. */
const meta: Meta = {
  title: 'Phone/Android features',
    parameters: { layout: 'fullscreen', docs: { description: { component: 'Etesian\'s answer to each Android 16 feature the N9 never had, as a 360 × 640 phone mock (7px app-window top corners, squircles, content as is, N9 bottom bars (first / last 44 n9px from the edges, evenly spaced), Events, status menu, Belle switches). One page: every state as a section (top 10, smaller gaps), then the two interactive ones (two-finger split, ghost rows). Mocks of rows marked “(?)” carry a **Proposal** tag. Summary, priorities, the leave-out list and open questions: Guide / Phone v2 proposals.' } } },
};
export default meta;
const tabs = (ids: readonly P2State[]) => ids.map((id) => ({ id, label: STATES[id].tab }));

/** All features on one page (user 2026-11-19: no drop-down menus): the top 10, then the smaller gaps, each a scaled phone mock with what it is, what you get and what you give up. */
const FIG = `<figure v-for="s in ids" :key="s" :id="s" class="pf-fig">
  <div class="pf-phone"><div class="pf-scale"><PhoneV2 :state="s" /></div></div>
  <figcaption><b>{{ STATES[s].title }}</b>
    <span class="pf-meta">#{{ STATES[s].gaps.join(', #') }} · {{ STATES[s].pri }} · {{ STATES[s].effort }} · <b>{{ STATUS_LABEL[STATUS[s][0]] }}</b></span>
    <span>{{ STATES[s].idea }}<template v-if="STATES[s].note"> {{ STATES[s].note }}</template></span>
    <span v-if="STATES[s].gain"><b>You get</b> {{ STATES[s].gain }}</span>
    <span v-if="STATES[s].cost"><b>You give up</b> {{ STATES[s].cost }}</span></figcaption>
</figure>`;
const PF_CSS = `<component is="style">
.pf { padding: 20px; background: var(--hd-c-bg); color: var(--hd-c-fg); }
.pf h2 { font: 300 26px/1.2 var(--hd-font-family-light); margin: 8px 0 14px; }
.pf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(252px, 1fr)); gap: 28px 20px; margin-bottom: 28px; }
.pf-fig { margin: 0; min-width: 0; }
/* the 360 x 640 mock at 70%: the box is the scaled size, so the grid lays it out at the size it shows */
.pf-phone { width: 252px; height: 448px; overflow: hidden; }
.pf-scale { width: 360px; height: 640px; transform: scale(.7); transform-origin: 0 0; }
.pf-fig figcaption { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; max-width: 320px; font-size: 13px; line-height: 1.4; }
.pf-meta { color: var(--hd-c-fg-secondary); }
</component>`;
export const AllFeatures: StoryObj = {
  name: 'All features',
  parameters: { layout: 'fullscreen' },
  render: () => ({
    components: { PhoneV2, XMerge, XGhost, XChoice, HdSwitch },
    setup: () => {
      const on = ref(true), size = ref<'small' | 'big'>('small'), amount = ref('2.5'), keep = ref('12');
      const AMOUNTS = computed(() => ['0.5', '1', '1.5', '2', '2.5', '3'].filter((a) => size.value === 'big' || a !== '0.5').map((a) => ({ id: a, label: a })));
      return { CORE, SMALL, STATES, STATUS, STATUS_LABEL, on, size, amount, keep, AMOUNTS, SIZES: [{ id: 'small', label: 'Small' }, { id: 'big', label: 'Big' }], KEEP: [['1', '1 hour'], ['4', '4 hours'], ['12', '12 hours'], ['24', '24 hours'], ['0', 'Forever']].map(([id, label]) => ({ id: id!, label: label! })) };
    },
    template: `<div class="pf">${PF_CSS}
      <h2>Top 10</h2><div class="pf-grid"><template v-for="ids in [CORE]">${FIG}</template></div>
      <h2>Smaller gaps</h2><div class="pf-grid"><template v-for="ids in [SMALL]">${FIG}</template></div>
      <h2 id="two-finger-split">Try it: two-finger split</h2>
      <p class="pf-meta">Pull two cards in a row together: they light up, slide in and shrink; past the snap point they become one split card showing both covers. Spread apart to cancel; lift while merged to keep the pair. Mouse: drag a card towards its neighbour.</p>
      <XMerge :autoplay="false" />
      <h2 id="ghost-rows">Try it: ghost rows</h2>
      <p class="pf-meta">Android extra, off by default. Dismissed notifications linger, faded; tap them for Earlier, swipe to expire. Swipe a notification away to see it drop in.</p>
      <div style="display:flex;gap:28px;align-items:flex-start;flex-wrap:wrap">
        <XGhost :key="size + amount + on" :size="size" :amount="on ? Number(amount) : 0" :page="false" />
        <div class="xg-set hd-theme-dark" style="width:300px;background:#000;color:#fff;padding:12px 16px;font-size:15px">
          <h3 style="font:300 26px/1.2 var(--hd-font-family-light);margin:4px 0 12px">Ghost rows</h3>
          <div style="display:flex;justify-content:space-between;align-items:center;min-height:52px"><b>Keep dismissed notifications</b><HdSwitch v-model="on" aria-label="Keep dismissed notifications" /></div>
          <template v-if="on">
            <div style="margin:10px 0 4px;color:#A0A0A0">Size</div><XChoice v-model="size" :tabs="SIZES" label="Size" id-prefix="xg-s" />
            <div style="margin:14px 0 4px;color:#A0A0A0">Rows shown</div><XChoice v-model="amount" :tabs="AMOUNTS" label="Rows" id-prefix="xg-a" />
            <div style="margin:14px 0 4px;color:#A0A0A0">Keep for</div><XChoice v-model="keep" :tabs="KEEP" label="Keep for" id-prefix="xg-k" />
          </template>
        </div></div></div>`,
  }),
};
