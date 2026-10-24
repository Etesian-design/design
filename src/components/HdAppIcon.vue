<script setup lang="ts">
/**
 * AppIcon. N9-original: 80x80 n9px squircle icons, label below in small light type.
 * `loading` draws the launch ring around the squircle edge (canon) until the app has drawn.
 */
import HdSquircle from './HdSquircle.vue';
import HdIcon from './HdIcon.vue';
import HdBusyIndicator from './HdBusyIndicator.vue';
import type { IconLighting, IconTone } from '../lighting';
withDefaults(defineProps<{ label: string; icon?: string; src?: string; color?: string; size?: number; loading?: boolean; badge?: number; href?: string; lighting?: IconLighting; tone?: IconTone }>(), { size: 54, color: '#4591FF', lighting: 'lit', tone: 'colour' });
defineEmits<{ click: [e: MouseEvent] }>();
</script>
<template>
  <component :is="href ? 'a' : 'button'" :href="href" :type="href ? undefined : 'button'" class="hd-app-icon hd-focusable"
    :aria-busy="loading ? 'true' : undefined" @click="(e: MouseEvent) => $emit('click', e)">
    <span class="hd-app-icon__shape" :style="{ width: `${size}px`, height: `${size}px` }">
      <HdSquircle :size="size" :src="src" :color="src ? undefined : color" :lighting="lighting" :tone="tone">
        <HdIcon v-if="icon" :name="icon" :size="Math.round(size * 0.5)" :lit="lighting === 'lit' ? (tone === 'light' ? 'dark' : true) : false" />
      </HdSquircle>
      <HdBusyIndicator v-if="loading" variant="squircle" class="hd-app-icon__ring" :size="size + 8" label="Opening" />
      <span v-if="badge" class="hd-app-icon__badge" aria-hidden="true">{{ badge }}</span>
    </span>
    <span class="hd-app-icon__label">{{ label }}<span v-if="badge" class="hd-visually-hidden">, {{ badge }} new</span></span>
  </component>
</template>
<style>
.hd-app-icon {
  display: inline-flex; flex-direction: column; align-items: center; gap: var(--hd-space-medium); width: 84px; max-width: 100%; min-width: 0; padding: 4px 0;
  border: 0; background: none; color: inherit; font: inherit; text-decoration: none; cursor: pointer; border-radius: var(--hd-radius-card);
}
.hd-app-icon:active .hd-app-icon__shape { transform: scale(.94); }
.hd-app-icon__shape { position: relative; display: inline-flex; align-items: center; justify-content: center; transition: transform var(--hd-motion-duration-instant) var(--hd-motion-easing-out); }
.hd-app-icon__ring { position: absolute; inset: -4px; color: var(--hd-c-fg); }
.hd-app-icon__badge { position: absolute; top: -4px; right: -6px; min-width: 20px; height: 20px; padding: 0 5px; border-radius: 999px; background: var(--hd-color-palette-warning); color: #fff; font: 700 12px/20px var(--hd-font-family-base); text-align: center; }
.hd-app-icon__label { font-size: var(--hd-font-size-xsmall); line-height: 1.2; text-align: center; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
