import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import HdButton from '../components/HdButton.vue';
import HdToolIcon from '../components/HdToolIcon.vue';
import HdIcon from '../components/HdIcon.vue';

const meta: Meta<typeof HdButton> = {
  title: 'Controls/Button',
  component: HdButton,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: '**N9**: bold 22 n9px label, white blanco button, pressed text #8C8C8C, 322 n9px fixed width in dialogs, Positive/Negative styles from com.nokia.extras. **EXT**: hover tint, focus ring, 40px min height, `plain` link-style variant, href rendering.' } } },
  argTypes: { variant: { control: 'select', options: ['default', 'accent', 'negative', 'plain'] } },
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
