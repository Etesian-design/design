<script setup lang="ts">
/** T6: a Sheet (new event) as a centred panel over the app (tablet) vs. covering the whole screen (phone behaviour). */
import { ref } from 'vue';
import XMiniApp from '../../../shell/parts/XMiniApp.vue';
import HdSheet from '../../../components/HdSheet.vue';
import HdTextField from '../../../components/HdTextField.vue';
import HdListItem from '../../../components/HdListItem.vue';
import HdSwitch from '../../../components/HdSwitch.vue';
import HdSectionHeader from '../../../components/HdSectionHeader.vue';
import HdButton from '../../../components/HdButton.vue';
const props = withDefaults(defineProps<{ orientation?: 'landscape' | 'portrait'; variant?: 'centred' | 'full' }>(), { orientation: 'landscape', variant: 'centred' });
const open = ref(true);
const allDay = ref(false);
</script>
<template>
  <div class="x-tsheet hd-on-page" :class="`x-tsheet--${variant}`">
    <XMiniApp name="Calendar" :landscape="orientation === 'landscape'" id-prefix="x-tsheet" />
    <HdButton v-if="!open" class="x-tsheet__again" variant="accent" @click="open = true">New event</HdButton>
    <HdSheet v-model:open="open" inline title="New event" accept-label="Save" reject-label="Cancel">
      <div class="x-tsheet__form">
        <HdTextField label="Title" model-value="Design review" />
        <HdTextField label="Location" model-value="Room Etesian" />
        <HdListItem title="All day"><template #trailing><HdSwitch v-model="allDay" aria-label="All day" /></template></HdListItem>
        <HdSectionHeader title="When" />
        <HdListItem title="Starts" subtitle="Thursday 29 October, 14:00" drilldown />
        <HdListItem title="Ends" subtitle="Thursday 29 October, 15:00" drilldown />
        <HdListItem title="Reminder" subtitle="15 minutes before" drilldown />
      </div>
    </HdSheet>
  </div>
</template>
<style>
.x-tsheet { position: relative; flex: 1; min-height: 0; display: flex; }
.x-tsheet .hd-sheet { background: var(--hd-surface-scrim); }
.x-tsheet--centred .hd-sheet { align-items: center; }
.x-tsheet--centred .hd-sheet__panel { width: 640px; max-width: calc(100% - 64px); height: auto; max-height: calc(100% - 64px); border-radius: var(--hd-radius-card); overflow: hidden; }
.x-tsheet--full .hd-sheet { align-items: flex-end; }
.x-tsheet--full .hd-sheet__panel { width: 100%; max-width: none; height: 100%; max-height: none; border-radius: 0; }
.x-tsheet__form { display: grid; gap: 12px; }
.x-tsheet__form .hd-list-item { padding-inline: 0; }
.x-tsheet__again { position: absolute; left: 50%; top: 40%; transform: translateX(-50%); }
</style>
