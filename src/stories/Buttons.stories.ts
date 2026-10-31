import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import HdButton from '../components/HdButton.vue';
import HdToolIcon from '../components/HdToolIcon.vue';
import HdIcon from '../components/HdIcon.vue';
import HdToolBar from '../components/HdToolBar.vue';
import HdTaskEditBar from '../components/HdTaskEditBar.vue';

const meta: Meta<typeof HdButton> = {
  title: 'Controls/Button',
  component: HdButton,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: '**N9**: bold 22 n9px label, white blanco button, pressed text #8C8C8C, 322 n9px fixed width in dialogs, Positive/Negative styles from com.nokia.extras. **EXT**: hover tint, focus ring, 40px min height, `plain` link-style variant, href rendering. **Measured** (N9 + ROM): `variant="dark"` #1C1C1C → #101010 → #080808 with a 1px #393839 rim; `size="bar"` 180×41 n9px edit-bar button. All buttons are top-lit, corners ≈21% of the height. See *All button kinds* for sizes and do / don\'t.' } } },
  argTypes: { variant: { control: 'select', options: ['default', 'accent', 'negative', 'plain', 'dark'] }, size: { control: 'select', options: ['default', 'small', 'bar'] } },
  args: { variant: 'default', disabled: false },
  render: (args) => ({ components: { HdButton }, setup: () => ({ args }), template: '<HdButton v-bind="args">Button</HdButton>' }),
};
export default meta;
type S = StoryObj<typeof HdButton>;
export const Default: S = {};
export const Accent: S = { args: { variant: 'accent' } };
export const Negative: S = { args: { variant: 'negative' } };
export const Disabled: S = { args: { disabled: true } };
export const WithIcon: S = { args: { icon: 'phone', variant: 'accent' } };
export const IconOnly: S = { render: () => ({ components: { HdButton }, template: '<HdButton icon="add" aria-label="Add" />' }) };
export const FixedWidthStack: S = {
  name: 'Fixed width (dialog stack)',
  render: () => ({ components: { HdButton }, template: '<div style="display:flex;flex-direction:column;gap:8px;align-items:center"><HdButton fixed-width variant="accent">Accept</HdButton><HdButton fixed-width>Reject</HdButton></div>' }),
};
export const Toggle: S = {
  render: () => ({ components: { HdButton }, setup: () => ({ on: ref(false) }), template: '<HdButton :checked="on" @click="on = !on">Mute: {{ on ? "on" : "off" }}</HdButton>' }),
};
export const AllVariants: S = {
  render: () => ({ components: { HdButton }, template: `<div style="display:flex;flex-wrap:wrap;gap:12px">
    <HdButton>Default</HdButton><HdButton variant="accent">Accent</HdButton><HdButton variant="negative">Delete</HdButton>
    <HdButton variant="plain">Plain</HdButton><HdButton disabled>Disabled</HdButton><HdButton variant="accent" disabled>Accent disabled</HdButton></div>` }),
};

export const ToolIcons: StoryObj<typeof HdToolIcon> = {
  name: 'ToolIcon',
  render: () => ({ components: { HdToolIcon }, template: `<div class="hd-inverted" style="display:flex;gap:8px;padding:8px;background:#111;color:#fff">
    <HdToolIcon icon="back" label="Back" /><HdToolIcon icon="add" label="New" /><HdToolIcon icon="search" label="Search" />
    <HdToolIcon icon="message" label="Messages" :badge="3" /><HdToolIcon icon="delete" label="Delete" disabled /><HdToolIcon icon="menu" label="Menu" /></div>` }),
};
export const Icons: StoryObj<typeof HdIcon> = {
  render: () => ({ components: { HdIcon }, template: '<p>See Guide / Iconography for the full gallery.</p><HdIcon name="phone" label="Phone" :size="32" /> <HdIcon name="mail" :size="32" />' }),
};

export const Dark: S = { args: { variant: 'dark' }, decorators: [() => ({ template: '<div style="background:#000;padding:16px"><story /></div>' })] };

/* every kind seen on the N9 and in the ROM; n9px → px is × 2/3 (72 n9px = 48px) */
const kinds = [
  ['Dialog / page button', 'default', '322 × 60', '215 × 40', 'Blanco white, black bold 22 n9px label; fixed width in dialogs. Accent / Negative from com.nokia.extras.'],
  ['Dark button', 'dark', 'auto × 60', 'auto × 40', 'Sheets, dark pages, the ROM. #1C1C1C → #101010 → #080808, 1px #393839 rim.'],
  ['Edit-bar button', 'bar', '180 × 41', '120 × 27.5', 'Done / Close all / Add widget. 8 n9px apart, centred in the 72 n9px black bar (1px #2A2A2A top rule).'],
  ['Toolbar Back', 'back', '51 × 49', '34 × 33', 'Lit squircle on the left of the bottom bar, 11 n9px above / 12 below. Never a bare chevron.'],
  ['Tool icon', 'tool', '66 × 66 cell, 32 icon', '44 × 44, 24 icon', 'No frame; the pressed / selected highlight is a squircle (n = 2.8).'],
  ['Icon-only button', 'icon', '60 × 60', '40 × 40', 'Squircle, never a circle or rounded square.'],
  ['Small button', 'small', 'auto × 45', 'auto × 30', 'Inline actions in lists and section headers (Clear, Refresh).'],
];
export const Kinds: S = {
  name: 'All button kinds (sizes, states, do / don\'t)',
  render: () => ({ components: { HdButton, HdToolIcon, HdToolBar, HdTaskEditBar }, setup: () => ({ kinds }), template: `<div style="display:grid;gap:24px;max-width:900px">
  <table class="hd-btn-kinds" style="border-collapse:collapse;width:100%;font-size:13px">
    <thead><tr><th>Kind</th><th>Sample</th><th>n9px</th><th>CSS px</th><th>Notes</th></tr></thead>
    <tbody><tr v-for="k in kinds" :key="k[0]">
      <td><b>{{ k[0] }}</b></td>
      <td :style="{ background: k[1] === 'dark' || k[1] === 'bar' ? '#000' : undefined, padding: '8px' }">
        <HdButton v-if="k[1] === 'default'" variant="default">OK</HdButton>
        <HdButton v-else-if="k[1] === 'dark'" variant="dark">Save</HdButton>
        <HdButton v-else-if="k[1] === 'bar'" variant="dark" size="bar">Done</HdButton>
        <HdToolBar v-else-if="k[1] === 'back'" back style="width:120px" />
        <HdToolIcon v-else-if="k[1] === 'tool'" icon="search" label="Search" />
        <HdButton v-else-if="k[1] === 'icon'" icon="add" aria-label="Add" />
        <HdButton v-else size="small">Clear</HdButton></td>
      <td>{{ k[2] }}</td><td>{{ k[3] }}</td><td>{{ k[4] }}</td></tr></tbody></table>
  <section><h3 style="margin:0 0 8px">States</h3><div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding:12px;background:#ddd">
    <HdButton>Normal</HdButton><HdButton pressed>Pressed</HdButton><HdButton disabled>Disabled</HdButton>
    <HdButton variant="accent">Accent</HdButton><HdButton variant="accent" pressed>Pressed</HdButton></div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding:12px;background:#000">
    <HdButton variant="dark">Normal</HdButton><HdButton variant="dark" pressed>Pressed</HdButton><HdButton variant="dark" disabled>Disabled</HdButton>
    <HdButton variant="dark" size="bar">Done</HdButton><HdButton variant="dark" size="bar" pressed>Done</HdButton></div>
    <p style="font-size:13px">Pressed: the top light goes (darker, flatter face) and the label dims to #8C8C8C. Disabled: the whole button at the disabled opacity, no light change.</p></section>
  <section><h3 style="margin:0 0 8px">Bottom bar layout</h3>
    <p style="font-size:13px;margin:0 0 8px">Measured on the N9 (480 n9px): the first and last buttons’ centres are always 44 n9px (29.33px) from the bar edges, whatever the number of items (Back’s squircle starts ~18 n9px in); the items between are evenly spaced (space-between with that edge inset), not equal-width slots. A lone button sits at its side at the same position (Back, + left; ≡ right). Action buttons are their squircle only. Real tabs (Store) fill the bar in equal full-height cells.</p>
    <div style="display:grid;gap:8px;width:360px"><HdToolBar back><HdToolIcon icon="add" label="New" /><HdToolIcon icon="search" label="Search" /><HdToolIcon icon="menu" label="Menu" /></HdToolBar>
      <HdToolBar back /><HdToolBar align="end"><template #right><HdToolIcon icon="menu" label="Menu" /></template></HdToolBar></div></section>
  <section><h3 style="margin:0 0 8px">Edit bar (72 n9px, buttons centred)</h3><div style="width:360px;background:#000"><HdTaskEditBar done-label="Done" close-all-label="Add widget" /></div></section>
  <section style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:13px">
    <div><h3 style="margin:0 0 8px;color:#3a8a1a">Do</h3><ul style="margin:0;padding-left:18px">
      <li>Light every button from the top: lighter top edge, darker bottom, 1px rim.</li>
      <li>Corners ≈21% of the button height (radius scales with size).</li>
      <li>Bold label (22 n9px / 15px); centre edit-bar buttons, fixed 180 n9px width.</li>
      <li>Keep Back a lit squircle with its 11 / 12 n9px padding inside the bar.</li>
      <li>Use squircles for icon-only buttons and tool icon highlights.</li></ul></div>
    <div><h3 style="margin:0 0 8px;color:#c0281e">Don't</h3><ul style="margin:0;padding-left:18px">
      <li>No outlined / ghost buttons and no full pills: the N9 has filled, lit buttons only.</li>
      <li>No circular icon buttons (round buttons belong to Belle home widgets only).</li>
      <li>Don't stretch edit-bar buttons to the full bar height or width.</li>
      <li>Don't group bar buttons left / centre / right with gaps; don't give action buttons a slot-wide pressed area.</li>
      <li>Don't light from below or add drop shadows under bar buttons.</li>
      <li>Don't mix the white blanco button into dark bars; use <code>variant="dark"</code>.</li></ul></div></section>
  </div>
  <component is="style">.hd-btn-kinds th, .hd-btn-kinds td { text-align: left; vertical-align: middle; padding: 6px 8px; border-bottom: 1px solid var(--hd-c-divider); }</component>` }),
};
