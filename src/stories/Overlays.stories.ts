import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';
import HdSheet from '../components/HdSheet.vue';
import HdQueryDialog from '../components/HdQueryDialog.vue';
import HdSelectionDialog from '../components/HdSelectionDialog.vue';
import HdMenu from '../components/HdMenu.vue';
import HdButton from '../components/HdButton.vue';
import HdTextField from '../components/HdTextField.vue';
import HdToolBar from '../components/HdToolBar.vue';
import HdSquircle from '../components/HdSquircle.vue';
import HdIcon from '../components/HdIcon.vue';

const frame = 'position:relative;height:480px;max-width:420px;overflow:hidden;border:1px solid var(--hd-c-divider)';
const meta: Meta = { title: 'Overlays/Dialogs & menus', tags: ['autodocs'], parameters: { docs: { description: { component: '**N9**: Sheet (Reject/Accept bar), QueryDialog, SelectionDialog (always inverted), Menu/ContextMenu rising from the toolbar. **EXT**: focus trap, Escape, focus restore, centred sheet on wide screens. Stories render `inline` inside a frame.' } } } };
export default meta;
type S = StoryObj;

export const Sheet: S = { render: () => ({ components: { HdSheet, HdButton, HdTextField }, setup: () => ({ o: ref(true), name: ref('') }),
  template: `<div style="${frame}"><div style="padding:16px"><HdButton @click="o = true">New contact</HdButton></div>
  <HdSheet v-model:open="o" inline title="New contact" accept-label="Save" :accept-disabled="!name"><div style="display:grid;gap:16px">
  <HdTextField v-model="name" label="Name" /><HdTextField label="Phone" type="tel" /></div></HdSheet></div>` }) };
export const QueryDialog: S = { render: () => ({ components: { HdQueryDialog, HdButton, HdSquircle, HdIcon }, setup: () => ({ o: ref(true) }),
  template: `<div style="${frame}"><div style="padding:16px"><HdButton variant="negative" @click="o = true">Delete</HdButton></div>
  <HdQueryDialog v-model:open="o" inline title="Delete conversation?" message="All 12 messages will be deleted." accept-label="Delete" reject-label="Cancel" destructive>
  <template #icon><HdSquircle :size="64" color="#DA201E"><HdIcon name="delete" :size="32" /></HdSquircle></template></HdQueryDialog></div>` }) };
export const SelectionDialog: S = { render: () => ({ components: { HdSelectionDialog, HdButton }, setup: () => ({ o: ref(true), i: ref(1), opts: ['Ringing', 'Beep', 'Silent'] }),
  template: `<div style="${frame}"><div style="padding:16px"><HdButton @click="o = true">Profile: {{ opts[i] }}</HdButton></div>
  <HdSelectionDialog v-model:open="o" v-model="i" inline title="Profile" :options="opts" /></div>` }) };
export const Menu: S = { render: () => ({ components: { HdMenu, HdToolBar }, setup: () => ({ o: ref(true), last: ref('') }),
  template: `<div style="${frame};display:flex;flex-direction:column"><p style="flex:1;padding:16px">Selected: {{ last || 'nothing' }}</p>
  <HdToolBar back menu @menu="o = true" />
  <HdMenu v-model:open="o" inline :items="[{ id: 'mark', label: 'Mark all as read' }, { id: 'settings', label: 'Settings' }, { id: 'sync', label: 'Sync now', disabled: true }, { id: 'del', label: 'Delete all', destructive: true }]" @select="last = $event" /></div>` }) };
export const ContextMenu: S = { render: () => ({ components: { HdMenu }, setup: () => ({ o: ref(true) }),
  template: `<div style="${frame}"><p style="padding:16px">Long-press (or right-click / Shift+F10) an item opens a ContextMenu.</p>
  <HdMenu v-model:open="o" inline title="Anna Virtanen" :items="[{ id: 'call', label: 'Call' }, { id: 'sms', label: 'Send message' }, { id: 'edit', label: 'Edit' }]" /></div>` }) };
