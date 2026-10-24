<script setup lang="ts">
/** Applications home view: HdAppGrid + HdAppIcon. Optional type-to-search filter (desktop). */
import { computed } from 'vue';
import HdAppGrid from '../../../components/HdAppGrid.vue';
import HdAppIcon from '../../../components/HdAppIcon.vue';
import { APPS, type XApp } from './data';
const props = withDefaults(defineProps<{ columns?: number; size?: number; query?: string; apps?: XApp[]; loading?: string }>(), { columns: 6, size: 64, query: '' });
const emit = defineEmits<{ open: [name: string] }>();
const list = computed(() => (props.apps ?? APPS).filter((a) => !props.query || a.name.toLowerCase().includes(props.query.toLowerCase())));
</script>
<template>
  <div class="x-apps">
    <HdAppGrid :columns="columns" class="x-apps__grid">
      <li v-for="a in list" :key="a.name">
        <HdAppIcon :label="a.name" :icon="a.icon" :color="a.color" :tone="a.tone" :size="size" :loading="loading === a.name"
          :badge="a.name === 'Messages' ? 2 : a.name === 'Mail' ? 3 : undefined" @click="emit('open', a.name)" />
      </li>
    </HdAppGrid>
    <p v-if="!list.length" class="x-apps__none">No apps match “{{ query }}”</p>
  </div>
</template>
<style>
.x-apps { color: var(--hd-c-fg); }
.x-apps__grid { row-gap: 28px; }
.x-apps .hd-app-icon { width: auto; min-width: 84px; }
.x-apps .hd-app-icon:hover .hd-app-icon__shape { transform: translateY(-2px); }
.x-apps__none { margin: 24px; color: var(--hd-c-fg-secondary); text-align: center; }
</style>
