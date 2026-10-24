<script setup lang="ts">
/** Story layout for an exploration: title, the idea, what you get, what you give up, state switchers, then the device(s). */
defineProps<{ title: string; idea: string; gain: string; cost: string }>();
</script>
<template>
  <section class="x-stage">
    <header class="x-stage__head">
      <div class="x-stage__text">
        <h1 class="x-stage__title">{{ title }}</h1>
        <p class="x-stage__idea">{{ idea }}</p>
        <p class="x-stage__tradeoff"><span class="x-stage__gain"><b>You get</b> {{ gain }}</span><span class="x-stage__cost"><b>You give up</b> {{ cost }}</span></p>
      </div>
      <div v-if="$slots.controls" class="x-stage__controls"><slot name="controls" /></div>
    </header>
    <div class="x-stage__frames"><slot /></div>
  </section>
</template>
<style>
.x-stage { display: flex; flex-direction: column; gap: 12px; height: 100vh; padding: 12px 16px 10px; background: var(--hd-c-bg); color: var(--hd-c-fg); }
.hd-root .hd-root .x-stage { height: calc(100vh - 50px); padding: 0; }
.x-stage__head { display: flex; flex-wrap: wrap; gap: 8px 24px; align-items: flex-end; justify-content: space-between; }
.x-stage__text { flex: 1 1 520px; min-width: 0; }
.x-stage__title { margin: 0; font: var(--hd-font-weight-light) var(--hd-font-size-xlarge)/1.2 var(--hd-font-family-light); }
.x-stage__idea { margin: 2px 0 0; font-size: var(--hd-font-size-small); line-height: 1.4; }
.x-stage__tradeoff { margin: 4px 0 0; display: flex; flex-wrap: wrap; gap: 2px 20px; font-size: var(--hd-font-size-small); line-height: 1.4; color: var(--hd-c-fg-secondary); }
.x-stage__tradeoff b { font-weight: 700; color: var(--hd-c-fg); margin-right: 4px; }
.x-stage__controls { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; }
.x-stage__controls .hd-tab-bar { min-width: 0; }
.x-stage__controls .hd-tab-button { flex: 0 0 auto; white-space: nowrap; min-height: 30px; padding: 0 12px; }
.x-stage__frames { flex: 1 1 auto; min-height: 0; display: flex; gap: 20px; align-items: stretch; }
</style>
