import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import HdBusyIndicator from '../components/HdBusyIndicator.vue';
import HdProgressBar from '../components/HdProgressBar.vue';
import HdCountBubble from '../components/HdCountBubble.vue';
import HdInfoBanner from '../components/HdInfoBanner.vue';
import HdNotificationBanner from '../components/HdNotificationBanner.vue';
import HdToast from '../components/HdToast.vue';
import HdToastStack from '../components/HdToastStack.vue';
import HdStatusState from '../components/HdStatusState.vue';
import HdTooltip from '../components/HdTooltip.vue';
import HdButton from '../components/HdButton.vue';
import HdToolIcon from '../components/HdToolIcon.vue';

const meta: Meta = { title: 'Overlays/Feedback', tags: ['autodocs'], parameters: { docs: { description: { component: '**N9**: BusyIndicator 24/32/96 n9px, ProgressBar, CountBubble, InfoBanner (3s, scale 200ms), notification banner from the top. **Canon**: busy ring follows the squircle. **EXT**: Toast, Tooltip, reduced-motion handling.' } } } };
export default meta;
type S = StoryObj;

export const BusyIndicator: S = { render: () => ({ components: { HdBusyIndicator }, template: `<div style="display:flex;gap:32px;align-items:center">
  <HdBusyIndicator size="small" /><HdBusyIndicator /><HdBusyIndicator size="large" />
  <HdBusyIndicator variant="classic" size="small" /><HdBusyIndicator variant="classic" /><HdBusyIndicator variant="classic" size="large" /></div>` }) };
export const ProgressBar: S = { render: () => ({ components: { HdProgressBar }, template: '<div style="display:grid;gap:24px;max-width:360px"><HdProgressBar :value="35" label="Downloading" /><HdProgressBar indeterminate label="Connecting" /></div>' }) };
export const CountBubble: S = { render: () => ({ components: { HdCountBubble }, template: '<div style="display:flex;gap:16px;align-items:center"><HdCountBubble :value="3" /><HdCountBubble :value="42" /><HdCountBubble :value="1200" large /></div>' }) };
export const InfoBanner: S = { render: () => ({ components: { HdInfoBanner, HdButton }, setup: () => ({ o: ref(true) }), template: '<HdButton @click="o = true">Show banner</HdButton><div style="margin-top:16px"><HdInfoBanner v-model:open="o" inline icon="check" text="Contact saved" /></div>' }) };
export const NotificationBanner: S = { render: () => ({ components: { HdNotificationBanner, HdButton }, setup: () => ({ o: ref(true) }), template: '<HdButton @click="o = true">Simulate message</HdButton><div style="margin-top:16px;max-width:480px"><HdNotificationBanner v-model:open="o" inline title="Anna Virtanen" body="Are we still on for lunch?" accent="#09A7CC" /></div>' }) };
export const Toast: S = { render: () => ({ components: { HdToast, HdButton }, setup: () => ({ o: ref(true), w: ref(true) }), template: `<div style="display:grid;gap:16px"><HdButton @click="o = true">Archive</HdButton>
  <HdToast v-model:open="o" inline text="Conversation archived" action="Undo" :timeout="0" /><HdToast v-model:open="w" inline tone="warning" text="Could not send. Check your connection." :timeout="0" /></div>` }) };
export const ToastStack: S = { render: () => ({ components: { HdToastStack }, setup: () => { const t = ref([{ id: 1, text: 'Contact saved', timeout: 0 }, { id: 2, text: 'Contact deleted', action: 'Undo', timeout: 0 }]); return { t }; },
  template: '<HdToastStack inline :toasts="t" @close="(id) => (t = t.filter((x) => x.id !== id))" />' }) };
export const StatusState: S = { render: () => ({ components: { HdStatusState, HdButton }, template: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
  <HdStatusState icon="mail" title="No mail" text="New messages show here." /><HdStatusState state="loading" title="Loading" />
  <HdStatusState state="error" title="Could not load" text="The server did not answer."><HdButton>Try again</HdButton></HdStatusState></div>` }) };
export const Tooltip: S = { render: () => ({ components: { HdTooltip, HdToolIcon }, template: '<div style="padding:48px"><HdTooltip text="Share this page"><HdToolIcon icon="share" label="Share" /></HdTooltip></div>' }) };
