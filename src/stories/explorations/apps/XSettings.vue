<script setup lang="ts">
/** Settings mock: grouped list with switches. */
import { ref } from 'vue';
import XAppShell from '../parts/XAppShell.vue';
import HdListItem from '../../../components/HdListItem.vue';
import HdSectionHeader from '../../../components/HdSectionHeader.vue';
import HdSwitch from '../../../components/HdSwitch.vue';
import HdThumbnail from '../../../components/HdThumbnail.vue';
import { shellProps, type XAppProps } from '../parts/types';
const props = withDefaults(defineProps<XAppProps>(), { hints: true });
const wifi = ref(true), bt = ref(true), flight = ref(false);
</script>
<template>
  <XAppShell title="Settings" v-bind="shellProps(props)">
    <div class="x-settings">
      <HdSectionHeader title="Connectivity" />
      <HdListItem title="Flight mode"><template #leading><HdThumbnail icon="globe" :size="32" /></template><template #trailing><HdSwitch v-model="flight" aria-label="Flight mode" /></template></HdListItem>
      <HdListItem title="Wi-Fi" subtitle="Home network"><template #leading><HdThumbnail icon="wifi" :size="32" color="#007DC9" /></template><template #trailing><HdSwitch v-model="wifi" aria-label="Wi-Fi" /></template></HdListItem>
      <HdListItem title="Bluetooth" subtitle="Keyboard connected"><template #leading><HdThumbnail icon="bluetooth" :size="32" color="#0093D0" /></template><template #trailing><HdSwitch v-model="bt" aria-label="Bluetooth" /></template></HdListItem>
      <HdSectionHeader title="Device" />
      <HdListItem title="Display" subtitle="Brightness, orientation" drilldown><template #leading><HdThumbnail icon="photo" :size="32" /></template></HdListItem>
      <HdListItem title="Keyboard" subtitle="Layout, shortcuts" drilldown><template #leading><HdThumbnail icon="edit" :size="32" /></template></HdListItem>
    </div>
  </XAppShell>
</template>
<style>
.x-settings { flex: 1; min-height: 0; overflow: hidden; background: var(--hd-c-bg); }
</style>
