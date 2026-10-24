<script setup lang="ts">
/**
 * Events view header (canon, ROM + original N9): day (large) and date (small, grey) on the left; weather on the right with
 * the city small bold CENTRED over a thin rule and the temperature plus weather icon centred under it.
 */
withDefaults(defineProps<{ day: string; date: string; city?: string; temperature?: string; weather?: 'sun' | 'cloud' | 'partly' | 'rain' }>(), { weather: 'partly' });
</script>
<template>
  <header class="hd-events-header">
    <div class="hd-events-header__when"><span class="hd-events-header__day">{{ day }}</span><span class="hd-events-header__date">{{ date }}</span></div>
    <div v-if="city" class="hd-events-header__wx" :aria-label="`${city}, ${temperature}`">
      <span class="hd-events-header__city">{{ city }}</span>
      <span class="hd-events-header__now">
        <span class="hd-events-header__temp">{{ temperature }}</span>
        <svg width="44" height="34" viewBox="0 0 44 34" aria-hidden="true">
          <circle v-if="weather !== 'cloud' && weather !== 'rain'" :cx="weather === 'sun' ? 22 : 27" :cy="weather === 'sun' ? 17 : 12" :r="weather === 'sun' ? 11 : 8" fill="#FFC21A" />
          <path v-if="weather !== 'sun'" d="M10 31h22a7 7 0 0 0 .6-14 9 9 0 0 0-17.2 2.6A5.7 5.7 0 0 0 10 31z" fill="#F2F2F2" stroke="rgba(0,0,0,.25)" stroke-width=".8" />
          <path v-if="weather === 'rain'" d="M15 33l-2 3m9-3l-2 3m9-3l-2 3" stroke="#6CB6FF" stroke-width="2" stroke-linecap="round" />
        </svg>
      </span>
    </div>
  </header>
</template>
<style>
.hd-events-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 24px 16px 12px; color: var(--hd-c-fg); }
.hd-events-header__when { display: flex; flex-direction: column; gap: 6px; }
.hd-events-header__day { font: 700 2rem/1.05 var(--hd-font-family-base); }
.hd-events-header__date { font: 700 1rem/1.2 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.hd-events-header__wx { display: flex; flex-direction: column; align-items: center; min-width: 160px; }
.hd-events-header__city { align-self: stretch; padding-bottom: 6px; border-bottom: 1px solid var(--hd-c-divider); text-align: center; font: 700 .875rem/1.2 var(--hd-font-family-base); }
.hd-events-header__now { display: flex; align-items: center; justify-content: center; gap: 12px; padding-top: 6px; }
.hd-events-header__temp { font: 700 1.75rem/1 var(--hd-font-family-base); }
</style>
