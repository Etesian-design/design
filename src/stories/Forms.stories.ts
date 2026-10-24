import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import HdSwitch from '../components/HdSwitch.vue';
import HdCheckBox from '../components/HdCheckBox.vue';
import HdRadioButton from '../components/HdRadioButton.vue';
import HdSlider from '../components/HdSlider.vue';
import HdTextField from '../components/HdTextField.vue';
import HdTextArea from '../components/HdTextArea.vue';
import HdSearchField from '../components/HdSearchField.vue';
import HdButton from '../components/HdButton.vue';

const meta: Meta = { title: 'Controls/Form controls', tags: ['autodocs'], parameters: { docs: { description: { component: '**N9**: Switch, CheckBox (42 n9px), RadioButton, Slider, TextField (52 n9px), TextArea. **EXT**: visible labels, helper/error text, required marker, SearchField pill, web form layout.' } } } };
export default meta;
type S = StoryObj;

export const Switch: S = { render: () => ({ components: { HdSwitch }, setup: () => ({ a: ref(true), b: ref(false) }), template: '<div style="display:grid;gap:16px"><HdSwitch v-model="a" label="Wi-Fi" /><HdSwitch v-model="b" label="Bluetooth" /><HdSwitch :model-value="true" label="Disabled" disabled /></div>' }) };
export const CheckBox: S = { render: () => ({ components: { HdCheckBox }, setup: () => ({ a: ref(true), b: ref(false) }), template: '<div style="display:grid;gap:4px"><HdCheckBox v-model="a" label="Show sender" /><HdCheckBox v-model="b" label="Mark as read" /><HdCheckBox label="Disabled" disabled /></div>' }) };
export const RadioButton: S = { render: () => ({ components: { HdRadioButton }, setup: () => ({ v: ref('beep') }), template: `<fieldset style="border:0;padding:0;margin:0;display:grid;gap:4px"><legend style="margin-bottom:8px">Profile</legend>
  <HdRadioButton v-model="v" name="profile" value="ringing" label="Ringing" /><HdRadioButton v-model="v" name="profile" value="beep" label="Beep" /><HdRadioButton v-model="v" name="profile" value="silent" label="Silent" /></fieldset>` }) };
export const Slider: S = { render: () => ({ components: { HdSlider }, setup: () => ({ v: ref(40) }), template: '<div style="max-width:360px;padding-top:32px"><HdSlider v-model="v" label="Volume" show-value /></div>' }) };
export const TextFields: S = { render: () => ({ components: { HdTextField, HdTextArea }, setup: () => ({ a: ref(''), b: ref('anna@'), c: ref('') }), template: `<div style="display:grid;gap:16px;max-width:420px">
  <HdTextField v-model="a" label="Name" placeholder="First and last name" clearable />
  <HdTextField v-model="b" label="Email" type="email" required error="Enter a valid email address" />
  <HdTextField label="Phone" helper="Include the country code" placeholder="+358" />
  <HdTextField label="Disabled" model-value="Read only" disabled />
  <HdTextArea v-model="c" label="Message" placeholder="Write a message" /></div>` }) };
export const SearchField: S = { render: () => ({ components: { HdSearchField }, setup: () => ({ q: ref('') }), template: '<div style="max-width:420px"><HdSearchField v-model="q" placeholder="Search contacts" /></div>' }) };
export const WebForm: S = {
  name: 'Web form (EXT)',
  render: () => ({ components: { HdTextField, HdCheckBox, HdButton }, setup: () => ({ email: ref(''), sent: ref(false) }),
    template: `<form style="display:grid;gap:16px;max-width:420px" @submit.prevent="sent = true" novalidate>
      <h2 style="margin:0;font-weight:300;font-size:var(--hd-font-size-xlarge)">Join the beta</h2>
      <HdTextField v-model="email" label="Email" type="email" autocomplete="email" required :error="sent && !email.includes('@') ? 'Enter a valid email address' : undefined" />
      <HdCheckBox label="Send me product news" />
      <HdButton type="submit" variant="accent" block>Sign up</HdButton></form>` }),
};
