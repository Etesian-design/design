<script setup lang="ts">
/** Settings → Events and notifications → Over apps: the style of notifications over apps, a live preview on top
 *  (the page's preview row), the Belle strip's transparency only while Belle is chosen. */
import { ref } from 'vue';
import NotifOver, { type OverStyle, type BelleShade } from './NotifOver.vue';

const look = ref<OverStyle>('n9');
const shade = ref<BelleShade>('medium');
const kind = ref<'message' | 'system'>('message');
const STYLES: { id: OverStyle; title: string; sum: string }[] = [
  { id: 'n9', title: 'Discreet (N9)', sum: 'One line over the status bar; system notices as a small banner' },
  { id: 'belle', title: 'Strip (Belle)', sum: 'A dark strip across the top of the screen' },
  { id: 'card', title: 'Card', sum: 'The lock screen card under the status bar' },
  { id: 'colour', title: 'Colour', sum: 'A bubble in the app’s colour' },
];
const SHADES: { id: BelleShade; title: string }[] = [
  { id: 'light', title: 'Light' }, { id: 'medium', title: 'Medium' }, { id: 'dark', title: 'Dark' }, { id: 'solid', title: 'Solid' },
];
</script>

<template>
  <div class="nos">
    <div class="nos-sb"><span class="nos-sb__sp" />14:20</div>
    <div class="nos-page">
      <div class="nos-head">Events and notifications</div>
      <div class="nos-prev">
        <div class="nos-prev__phone"><NotifOver :look="look" :shade="shade" :kind="kind" /></div>
        <div class="nos-prev__kind" role="radiogroup" aria-label="Preview">
          <button v-for="k in (['message', 'system'] as const)" :key="k" type="button" role="radio" :aria-checked="kind === k" class="nos-chip hd-sqm" :class="{ 'is-on': kind === k }" @click="kind = k">{{ k === 'message' ? 'Message' : 'System' }}</button>
        </div>
      </div>
      <div class="nos-cat">Over apps</div>
      <div role="radiogroup" aria-label="Notifications over apps">
        <label v-for="s in STYLES" :key="s.id" class="nos-row">
          <span class="nos-row__t"><span>{{ s.title }}</span><small>{{ s.sum }}</small></span>
          <input v-model="look" type="radio" name="nos-look" :value="s.id" class="nos-radio" />
        </label>
      </div>
      <template v-if="look === 'belle'">
        <div class="nos-cat">Strip transparency</div>
        <div role="radiogroup" aria-label="Strip transparency">
          <label v-for="s in SHADES" :key="s.id" class="nos-row nos-row--short">
            <span class="nos-row__t"><span>{{ s.title }}</span></span>
            <input v-model="shade" type="radio" name="nos-shade" :value="s.id" class="nos-radio" />
          </label>
        </div>
      </template>
      <p class="nos-note">The lock screen keeps its cards whatever is chosen here.</p>
    </div>
  </div>
</template>

<style>
.nos { width: 360px; height: 640px; display: flex; flex-direction: column; overflow: hidden; background: #000; color: #fff; font-family: var(--hd-font-family-base); }
.nos-sb { flex: none; height: 22px; display: flex; align-items: center; padding: 0 6px; font-size: 13px; } .nos-sb__sp { flex: 1; }
.nos-page { flex: 1; overflow-y: auto; scrollbar-width: none; }
.nos-head { padding: 18px 16px 10px; font-size: 26px; }
.nos-prev { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 6px 0 12px; border-bottom: 1px solid #333; }
.nos-prev__phone { width: 180px; height: 320px; overflow: hidden; border: 1px solid #333; }
.nos-prev__phone > .no { transform: scale(.5); transform-origin: 0 0; }
.nos-prev__kind { display: flex; gap: 6px; }
.nos-chip { height: 28px; padding: 0 14px; border: 0; background: #2A2A2A; color: #ccc; font: inherit; font-size: 13px; cursor: pointer; }
.nos-chip.is-on { background: var(--hd-accent, #09A7CC); color: #fff; }
.nos-cat { padding: 16px 16px 4px; color: #8C8C8C; font-size: 14px; }
.nos-row { display: flex; align-items: center; gap: 12px; min-height: 64px; padding: 6px 16px; cursor: pointer; }
.nos-row--short { min-height: 48px; }
.nos-row__t { flex: 1; display: flex; flex-direction: column; font-size: 18px; } .nos-row__t small { font-size: 14px; color: #8C8C8C; }
.nos-radio { width: 22px; height: 22px; accent-color: var(--hd-accent, #09A7CC); }
.nos-note { margin: 12px 16px 24px; color: #8C8C8C; font-size: 14px; }
</style>
