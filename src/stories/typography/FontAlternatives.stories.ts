import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { FONT_ALTERNATIVES, fontVars } from '../../fonts';
import HdListItem from '../../components/HdListItem.vue';
import HdButton from '../../components/HdButton.vue';
// Nokia Pure is never bundled, so a live specimen here would show some other font: these pictures are the same specimen
// rendered with the real Nokia Pure Text (scripts/nokia-pure-specimen.mjs, on a machine that has it).
import nokiaPureHybrid from '../../assets/nokia-pure-specimen-hybrid.png';
import nokiaPureDark from '../../assets/nokia-pure-specimen-dark.png';

const meta = {
  title: 'Guide/Font alternatives',
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Free look-alikes for **Nokia Pure** (proprietary: bring your own, never bundled). Each specimen uses the metric-adjusted alias (size-adjust from tokens `font.alternatives.*`) so it lines up with Nokia Pure Text.' } } },
} satisfies Meta;
export default meta;
type S = StoryObj<typeof meta>;

const SCALE: [number, number][] = [[32, 300], [28, 300], [24, 300], [22, 700], [20, 400], [18, 400], [16, 400]];
const specimen = (keys: string[], mode = 'hybrid') => ({
  components: { HdListItem, HdButton },
  setup: () => ({ fonts: FONT_ALTERNATIVES.filter((f) => keys.length === 0 || keys.includes(f.key)), fontVars, SCALE, nokiaPure: mode === 'dark' ? nokiaPureDark : nokiaPureHybrid }),
  template: `<div style="display:grid;gap:24px;padding:16px">
    <section v-for="f in fonts" :key="f.key" :style="fontVars(f.key)" style="border-bottom:1px solid var(--hd-c-divider);padding-bottom:24px">
      <div style="font:700 12px/1.4 sans-serif;letter-spacing:0;opacity:.7;text-transform:uppercase">{{ f.family }} · {{ f.licence }} · score {{ f.score }}<span v-if="f.key === 'nokia-pure'"> · a picture of the real font, which is not bundled</span></div>
      <img v-if="f.key === 'nokia-pure'" :src="nokiaPure" alt="The specimen set in Nokia Pure Text: a large 17:29 clock, sizes 32 to 16 px in Light, Regular and Bold, two list rows, a button and a paragraph" data-test="nokia-pure-picture" style="display:block;width:1168px;max-width:100%;height:auto" />
      <div v-else style="display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start">
        <div style="font-family:var(--hd-font-family-light);font-weight:300;font-size:96px;line-height:1">17:29</div>
        <div style="min-width:280px;flex:1">
          <div v-for="[px, w] in SCALE" :key="px" :style="{ fontFamily: 'var(--hd-font-family-base)', fontSize: px + 'px', fontWeight: w, lineHeight: 1.3 }">{{ px }}px {{ w === 300 ? 'Light' : w === 700 ? 'Bold' : 'Regular' }} Settings</div>
          <div style="font-family:var(--hd-font-family-base);font-size:20px;display:flex;gap:16px;margin-top:8px"><span style="font-weight:300">Light aet gy</span><span style="font-weight:400">Regular aet gy</span><span style="font-weight:700">Bold aet gy</span></div>
        </div>
        <div style="width:320px">
          <HdListItem title="Wi-Fi" subtitle="Home network" />
          <HdListItem title="Bluetooth" subtitle="Off" />
          <div style="margin-top:8px"><HdButton>Delete message</HdButton></div>
          <p style="font-family:var(--hd-font-family-base);font-size:16px;line-height:1.5;margin:12px 0 0">The content is the interface. Swipe from the edge to go home; calm, light and gesture-first. 0123456789</p>
        </div>
      </div>
    </section></div>`,
});
export const AllFonts: S = { render: (_, { globals }) => specimen([], globals.mode) };
export const Recommended: S = { render: (_, { globals }) => specimen(['nokia-pure', 'fira-sans', 'ubuntu-sans'], globals.mode) };
