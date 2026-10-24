<script setup lang="ts">
/**
 * ListItem / ListDelegate. N9-original: 80 n9px row (64 small), title in large light type,
 * subtitle smaller secondary, optional squircle thumbnail left, drill-down chevron right.
 * Renders as <a> (href), <button> (clickable) or <div>.
 */
import { computed, useSlots } from 'vue';
import HdThumbnail from './HdThumbnail.vue';
import HdIcon from './HdIcon.vue';
const props = withDefaults(defineProps<{
  title: string; subtitle?: string; thumbnail?: string; thumbnailIcon?: string; drilldown?: boolean;
  href?: string; clickable?: boolean; small?: boolean; disabled?: boolean; selected?: boolean;
}>(), {});
defineEmits<{ click: [e: MouseEvent] }>();
const slots = useSlots();
const tag = computed(() => (props.href ? 'a' : props.clickable || props.drilldown ? 'button' : 'div'));
</script>
<template>
  <component :is="tag" class="hd-list-item" :class="{ 'hd-list-item--small': small, 'hd-list-item--action': tag !== 'div', 'hd-focusable': tag !== 'div', 'is-selected': selected }"
    :href="href" :type="tag === 'button' ? 'button' : undefined" :disabled="tag === 'button' ? disabled : undefined"
    :aria-current="selected ? 'true' : undefined" @click="(e: MouseEvent) => !disabled && $emit('click', e)">
    <span v-if="slots.leading || thumbnail || thumbnailIcon" class="hd-list-item__leading">
      <slot name="leading"><HdThumbnail :src="thumbnail" :icon="thumbnailIcon" :size="small ? 32 : 43" /></slot>
    </span>
    <span class="hd-list-item__text">
      <span class="hd-list-item__title">{{ title }}</span>
      <span v-if="subtitle" class="hd-list-item__subtitle">{{ subtitle }}</span>
    </span>
    <span v-if="slots.trailing" class="hd-list-item__trailing"><slot name="trailing" /></span>
    <HdIcon v-if="drilldown" class="hd-list-item__chevron" name="chevron-right" :size="20" />
  </component>
</template>
<style>
.hd-list-item {
  display: flex; align-items: center; gap: var(--hd-space-xlarge); width: 100%; min-height: var(--hd-size-list-item);
  padding: var(--hd-space-medium) var(--hd-space-xlarge); border: 0; background: transparent; color: inherit;
  text-align: left; text-decoration: none; font: inherit;
}
.hd-list-item--small { min-height: var(--hd-size-list-item-small); }
.hd-list-item--action { cursor: pointer; transition: background var(--hd-motion-duration-instant) var(--hd-motion-easing-out); }
.hd-list-item--action:hover { background: var(--hd-c-pressed); }
.hd-list-item--action:active, .hd-list-item.is-selected { background: var(--hd-c-pressed); }
.hd-list-item:disabled { opacity: var(--hd-opacity-disabled); cursor: default; }
.hd-list-item__text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.hd-list-item__title { font: var(--hd-font-weight-light) var(--hd-font-size-large)/1.25 var(--hd-font-family-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hd-list-item--small .hd-list-item__title { font-size: var(--hd-font-size-default); }
.hd-list-item__subtitle { font-size: var(--hd-font-size-small); color: var(--hd-c-fg-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.hd-list-item__leading, .hd-list-item__trailing { flex: none; display: inline-flex; align-items: center; }
.hd-list-item__chevron { color: var(--hd-c-fg-secondary); }
</style>
