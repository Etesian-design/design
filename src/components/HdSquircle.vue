<script setup lang="ts">
/**
 * Base squircle shape (|x|^2.8+|y|^2.8=1). Used by Avatar, AppIcon, Thumbnail.
 * `lighting="lit"` applies the N9 top-lit emboss to an icon tile (gradient from `color`,
 * top rim, faint bottom line, soft outer shadow; child glyphs get a cast shadow).
 * Photos (`src`) are never re-lit. `tone="light"` is the white-tile variant.
 */
import { computed } from 'vue';
import { litVars, type IconLighting, type IconTone } from '../lighting';
const props = withDefaults(defineProps<{ size?: number | string; src?: string; alt?: string; color?: string; tag?: string; lighting?: IconLighting; tone?: IconTone }>(), { size: 43, tag: 'span', lighting: 'flat', tone: 'colour' });
const px = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size));
const lit = computed(() => props.lighting === 'lit' && !props.src);
const style = computed(() => {
  if (!lit.value) return { width: px.value, height: px.value, background: props.color };
  return { width: px.value, height: px.value, ...litVars(props.tone === 'light' ? undefined : props.color, undefined), '--hd-icon-size': px.value };
});
</script>
<template>
  <span v-if="lit" class="hd-icon-lit-shadow" :style="{ '--hd-icon-size': px }">
    <component :is="tag" class="hd-squircle hd-squircle-box hd-icon-lit" :class="{ 'hd-icon-lit--light': tone === 'light' }" :style="style"
      :role="alt ? 'img' : undefined" :aria-label="alt">
      <slot />
    </component>
  </span>
  <component :is="tag" v-else class="hd-squircle hd-squircle-box" :style="style"
    :role="src || alt ? 'img' : undefined" :aria-label="!src ? alt : undefined">
    <img v-if="src" :src="src" :alt="alt ?? ''" />
    <slot v-else />
  </component>
</template>
<style>
.hd-squircle-box { position: relative; display: inline-flex; align-items: center; justify-content: center; flex: none; overflow: hidden; background: var(--hd-c-surface-raised); color: #fff; }
.hd-squircle-box img { width: 100%; height: 100%; object-fit: cover; display: block; }
</style>
