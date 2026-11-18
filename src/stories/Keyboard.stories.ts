import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import HdKeyboard, { type HdKeyboardShift } from '../components/HdKeyboard.vue';

const meta: Meta<typeof HdKeyboard> = {
  title: 'OS/Keyboard', component: HdKeyboard, tags: ['autodocs'],
  parameters: { docs: { description: { component: '**Canon** (matched to the ROM keyboard, see docs/20-phone.md § Keyboard): lower-case letters; Shift once gives one capital; a double tap on Shift is caps lock and turns the key plain white; the globe between the comma and the space bar switches language; keys are lit like the icons and sink in when pressed; every key clicks.' } } },
};
export default meta;
type S = StoryObj<typeof HdKeyboard>;
const frame = (inner: string) => `<div style="width:360px;background:#000">${inner}</div>`;

export const LowerCase: S = { args: { shift: 'off' }, render: (a) => ({ components: { HdKeyboard }, setup: () => ({ a }), template: frame('<HdKeyboard v-bind="a" />') }) };
export const ShiftOnce: S = { args: { shift: 'once' }, render: (a) => ({ components: { HdKeyboard }, setup: () => ({ a }), template: frame('<HdKeyboard v-bind="a" />') }),
  parameters: { docs: { description: { story: 'Shift tapped once: capitals for the next letter only, then back to lower case.' } } } };
export const CapsLock: S = { args: { shift: 'locked' }, render: (a) => ({ components: { HdKeyboard }, setup: () => ({ a }), template: frame('<HdKeyboard v-bind="a" />') }),
  parameters: { docs: { description: { story: 'Shift double-tapped: caps lock. The Shift key is plain white, without the lighting of the other keys, with a black arrow.' } } } };
export const KeyPressed: S = { args: { pressed: 'g' }, render: (a) => ({ components: { HdKeyboard }, setup: () => ({ a }), template: frame('<HdKeyboard v-bind="a" />') }),
  parameters: { docs: { description: { story: 'A key held down sinks in: darker, its gradient turned over (lighter at the bottom), its top rim in shadow.' } } } };
/** Type on it: Shift once / double tap behave as on the phone. */
export const Interactive: S = { render: () => ({ components: { HdKeyboard }, setup: () => {
  const text = ref(''); const shift = ref<HdKeyboardShift>('once'); let lastShift = 0;
  const key = (k: string) => {
    if (k === 'shift') { const now = Date.now(); shift.value = now - lastShift < 300 ? 'locked' : shift.value === 'off' ? 'once' : 'off'; lastShift = now; return; }
    if (k === 'backspace') { text.value = text.value.slice(0, -1); return; }
    if (k === 'space') { text.value += ' '; return; }
    if (k.length !== 1) return;
    text.value += shift.value === 'off' ? k : k.toUpperCase();
    if (shift.value === 'once') shift.value = 'off';
  };
  return { text, shift, key };
}, template: frame('<div style="background:#fff;padding:10px 12px;font:16px/1.4 var(--hd-font-family-base);min-height:24px" data-testid="typed">{{ text }}</div><HdKeyboard :shift="shift" @key="key" />') }) };
