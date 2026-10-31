<script setup lang="ts">
/** The N9 virtual keyboard (n9-sms-compose.png), shared by every mock: 3 letter rows (Shift + Backspace on the third), ?123 / , / space / . / Enter. */
import HdIcon from '../../components/HdIcon.vue';
const keys = ['qwertyuiop', 'asdfghjkl'];
</script>
<template>
  <div class="xm-kb" aria-label="Keyboard">
    <div v-for="r in keys" :key="r"><span v-for="k in r" :key="k" class="xm-key">{{ k }}</span></div>
    <div><span class="xm-key xm-key--fn" aria-label="Shift"><HdIcon name="shift" :size="20" /></span><span v-for="k in 'zxcvbnm'" :key="k" class="xm-key">{{ k }}</span><span class="xm-key xm-key--fn" aria-label="Backspace"><HdIcon name="backspace" :size="20" /></span></div>
    <div><span class="xm-key xm-key--fn xm-key--wide">?123</span><span class="xm-key">,</span><span class="xm-key xm-key--space"></span><span class="xm-key">.</span><span class="xm-key xm-key--fn xm-key--wide" aria-label="Enter"><HdIcon name="enter" :size="20" /></span></div>
  </div>
</template>
<style>
.xm-kb { flex: none; height: 240px; display: grid; grid-template-rows: repeat(4, 1fr); gap: 7px; padding: 8px 3px; background: linear-gradient(#202022, #050506); }
.xm-kb div { display: flex; gap: 5px; justify-content: center; }
.xm-key { flex: 0 0 31px; display: grid; place-items: center; border-radius: 6px; background: linear-gradient(#2E2E31, #161618); box-shadow: inset 0 1px 0 rgba(255,255,255,.1), 0 1px 0 #000; color: #fff; font: 400 21px/1 var(--hd-font-family-base); }
.xm-key--fn { flex-basis: 42px; background: linear-gradient(#5C5C60, #3C3C40); font: 700 17px/1 var(--hd-font-family-base); }
.xm-key--space { flex-basis: 100px; } .xm-key--wide { flex-basis: 76px; }
</style>
