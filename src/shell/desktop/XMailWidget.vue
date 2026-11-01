<script setup lang="ts">
/** Desktop Mail widget (Belle panel style): the section's lit squircle, the unread count, the latest three mails. editing: the edit chrome. */
import HdSquircle from '../../components/HdSquircle.vue';
defineProps<{ editing?: boolean }>();
const MAIL = [
  { from: 'Aino Virtanen', subject: 'Tickets for Saturday', when: '12:31' },
  { from: 'Hub calendar', subject: 'Reminder: dentist at 15:00', when: '11:02' },
  { from: 'Mikko', subject: 'Photos from the lake', when: '09:47' },
];
</script>
<template>
  <div class="bw bw--mail" :class="{ 'bw--editing': editing }" style="width: 360px; height: 270px" data-cells="4x3">
    <div class="bw-panel x-wmail">
      <header class="x-wmail__head">
        <HdSquircle :size="34" color="#2F7FD6" lighting="lit"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 6h16v12H4z M4 7l8 6 8-6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round" /></svg></HdSquircle>
        <b>Mail</b><span class="x-wmail__count">3 unread</span>
      </header>
      <ul>
        <li v-for="m in MAIL" :key="m.subject"><span class="x-wmail__from">{{ m.from }}</span><span class="bw-sec">{{ m.when }}</span><span class="x-wmail__subj bw-sec">{{ m.subject }}</span></li>
      </ul>
    </div>
    <template v-if="editing"><i class="bw-outline" /><HdSquircle :size="30" class="bw-close" color="linear-gradient(#F78673, #EF2C10)" role="button" aria-label="Remove widget"><svg viewBox="0 0 30 30" width="30" height="30"><path d="M9.3 9.3l11.4 11.4M20.7 9.3 9.3 20.7" stroke="#fff" stroke-width="3.9" stroke-linecap="round" /></svg></HdSquircle><i class="bw-resize" /></template>
  </div>
</template>
<style>
/* the panel the Mail and Chats widgets share */
.x-wmail { display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; color: #fff; }
.x-wmail__head { display: flex; align-items: center; gap: 10px; font-size: 18px; }
.x-wmail__count { margin-left: auto; padding: 2px 10px; border-radius: 12px; background: #2F7FD6; font-size: 13px; font-weight: 700; }
.x-wmail ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.x-wmail li { display: grid; grid-template-columns: 1fr auto; column-gap: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,.12); }
.x-wmail__from { font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.x-wmail__subj { grid-column: 1 / -1; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
