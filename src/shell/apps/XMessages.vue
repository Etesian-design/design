<script setup lang="ts">
/** Messages mock: one conversation with bubbles and a reply field. */
import XAppShell from '../parts/XAppShell.vue';
import HdAvatar from '../../components/HdAvatar.vue';
import HdTextField from '../../components/HdTextField.vue';
import HdButton from '../../components/HdButton.vue';
import { shellProps, type XAppProps } from '../parts/types';
const props = withDefaults(defineProps<XAppProps>(), { hints: true });
const msgs = [
  { me: false, t: 'Are we still on for lunch?' }, { me: true, t: 'Yes! 12:30 at the usual place?' },
  { me: false, t: 'Perfect. Bring the tablet mockups, I want to see the split view.' }, { me: true, t: 'Will do. The pop-up window is my favourite.' },
  { me: false, t: 'See you soon' },
];
</script>
<template>
  <XAppShell title="Anna Virtanen" v-bind="shellProps(props)" :actions="[{ icon: 'phone', label: 'Call', keys: 'Ctrl+Shift+C' }]">
    <div class="x-msg" style="--hd-accent: #09A7CC">
      <header class="x-msg__head"><HdAvatar name="Anna Virtanen" :size="43" /><div><b>Anna Virtanen</b><br /><span>Online</span></div></header>
      <div class="x-msg__list">
        <div v-for="(m, i) in msgs" :key="i" class="x-msg__row" :class="{ 'is-me': m.me }">
          <HdAvatar v-if="!m.me" name="Anna Virtanen" :size="32" />
          <p class="x-msg__bubble">{{ m.t }}</p>
        </div>
      </div>
      <div class="x-msg__reply"><HdTextField placeholder="Write a message" aria-label="Message" /><HdButton variant="accent" icon="message" aria-label="Send" /></div>
    </div>
  </XAppShell>
</template>
<style>
.x-msg { flex: 1; min-height: 0; display: flex; flex-direction: column; background: var(--hd-c-bg); }
.x-msg__head { display: flex; gap: 11px; align-items: center; padding: 10px 16px; border-bottom: 1px solid var(--hd-c-divider); font-size: var(--hd-font-size-small); color: var(--hd-c-fg-secondary); }
.x-msg__head b { color: var(--hd-c-fg); font-size: var(--hd-font-size-default); }
.x-msg__list { flex: 1; min-height: 0; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; gap: 10px; padding: 16px; }
.x-msg__row { display: flex; gap: 8px; align-items: flex-end; max-width: 80%; }
.x-msg__row.is-me { align-self: flex-end; }
.x-msg__bubble { margin: 0; padding: 8px 12px; border-radius: 14px; background: var(--hd-surface-card); color: var(--hd-surface-card-fg); font-size: var(--hd-font-size-default); line-height: 1.35; box-shadow: 0 0 0 1px var(--hd-c-divider); }
.x-msg__row.is-me .x-msg__bubble { background: var(--hd-accent); color: #fff; box-shadow: none; }
.x-msg__reply { display: flex; gap: 8px; align-items: flex-start; padding: 10px 16px; border-top: 1px solid var(--hd-c-divider); }
.x-msg__reply .hd-field { flex: 1; }
</style>
