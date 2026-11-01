<script setup lang="ts">
/** Desktop Chats widget: the Mail widget's panel with the latest conversations. editing: the edit chrome. */
import HdSquircle from '../../components/HdSquircle.vue';
import './XMailWidget.vue'; // the shared x-wmail panel styles
defineProps<{ editing?: boolean }>();
const CHATS = [
  { from: 'Aino', text: 'See you at 7!', when: '12:40' },
  { from: 'Mum', text: 'Call me when you can', when: '10:15' },
];
</script>
<template>
  <div class="bw bw--chats" :class="{ 'bw--editing': editing }" style="width: 360px; height: 180px" data-cells="4x2">
    <div class="bw-panel x-wmail">
      <header class="x-wmail__head">
        <HdSquircle :size="34" color="#1BA548" lighting="lit"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round" /></svg></HdSquircle>
        <b>Chats</b>
      </header>
      <ul>
        <li v-for="c in CHATS" :key="c.from"><span class="x-wmail__from">{{ c.from }}</span><span class="bw-sec">{{ c.when }}</span><span class="x-wmail__subj bw-sec">{{ c.text }}</span></li>
      </ul>
    </div>
    <template v-if="editing"><i class="bw-outline" /><HdSquircle :size="30" class="bw-close" color="linear-gradient(#F78673, #EF2C10)" role="button" aria-label="Remove widget"><svg viewBox="0 0 30 30" width="30" height="30"><path d="M9.3 9.3l11.4 11.4M20.7 9.3 9.3 20.7" stroke="#fff" stroke-width="3.9" stroke-linecap="round" /></svg></HdSquircle><i class="bw-resize" /></template>
  </div>
</template>
