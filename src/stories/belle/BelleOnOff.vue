<!--
  Belle on/off switch, measured from the 701's NFC widget art (nfcapplication .nvg): a wide squircle track (64 × 42, n = 3.6)
  with a soft white rim, green when on (#7EC142 → #1C6332), grey when off (#ADADAD → #464646), and a square squircle knob
  (n = 2.7, #FFFFFF → #808081) carrying the power glyph, green on / grey off. On, the knob sits at the left (as on Belle).
-->
<script setup lang="ts">
import { squircleRectPath } from '../../squircle';

defineProps<{ on?: boolean }>();
const id = `oo${Math.random().toString(36).slice(2, 8)}`;
const track = squircleRectPath(64, 42, 3.6, 1, 1);
const knobOn = squircleRectPath(38, 38, 2.7, 3, 3);
const knobOff = squircleRectPath(38, 38, 2.7, 25, 3);
const power = 'M11 3h2v9h-2zM7.05 5.64l1.41 1.42A6 6 0 1 0 15.54 7l1.41-1.41A8 8 0 1 1 7.05 5.64z';
</script>
<template>
  <svg class="boo" viewBox="0 0 66 44" role="img" :aria-label="on ? 'On' : 'Off'">
    <defs>
      <linearGradient :id="`${id}t`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" :stop-color="on ? '#7EC142' : '#ADADAD'" /><stop offset="1" :stop-color="on ? '#1C6332' : '#464646'" /></linearGradient>
      <linearGradient :id="`${id}k`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" /><stop offset="1" stop-color="#808081" /></linearGradient>
      <linearGradient :id="`${id}p`" x1="0" y1="0" x2="0" y2="1"><stop offset="0" :stop-color="on ? '#37B24A' : '#BBBDBF'" /><stop offset="1" :stop-color="on ? '#006838' : '#7A7C7F'" /></linearGradient>
    </defs>
    <path :d="track" :fill="`url(#${id}t)`" stroke="#fff" stroke-opacity=".66" stroke-width="1.2" />
    <path :d="on ? knobOn : knobOff" :fill="`url(#${id}k)`" stroke="#000" stroke-opacity=".2" />
    <path :d="power" :fill="`url(#${id}p)`" :transform="`translate(${on ? 10 : 32} 10) scale(1)`" />
  </svg>
</template>
<style scoped>.boo { display: block; width: 100%; height: 100%; }</style>
