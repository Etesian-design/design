<script setup lang="ts">
/** Renders a mock app by name (used for live Open-app cards, windows and split panes). Extra props are forwarded. */
import XMail from '../apps/XMail.vue';
import XMessages from '../apps/XMessages.vue';
import XCalendar from '../apps/XCalendar.vue';
import XMusic from '../apps/XMusic.vue';
import XGallery from '../apps/XGallery.vue';
import XNotes from '../apps/XNotes.vue';
import XBrowser from '../apps/XBrowser.vue';
import XSettings from '../apps/XSettings.vue';
defineOptions({ inheritAttrs: false });
defineProps<{ name: string }>();
const MAP: Record<string, unknown> = { Mail: XMail, Messages: XMessages, Calendar: XCalendar, Music: XMusic, Gallery: XGallery, Notes: XNotes, Browser: XBrowser, Settings: XSettings };
</script>
<template><component :is="MAP[name] ?? XNotes" v-bind="$attrs" /></template>
