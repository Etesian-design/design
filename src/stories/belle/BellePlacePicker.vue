<script setup lang="ts">
/**
 * Belle Weather's place picker, matched to the ROM (WeatherPlaceActivity.kt): "Place" title, a town field, "Current location"
 * (accent while it is the one used), then the matches with "region, country" under each (Open-Meteo geocoding, up to 10).
 * The mock searches a fixed list; picking emits the place (null = the phone's location again).
 */
import { computed, ref } from 'vue';
export interface Place { name: string; detail: string }
const props = defineProps<{ current?: string }>();
const emit = defineEmits<{ pick: [Place | null] }>();
const PLACES: Place[] = [
  { name: 'Tampere', detail: 'Pirkanmaa, Finland' }, { name: 'Oulu', detail: 'North Ostrobothnia, Finland' },
  { name: 'Oulu', detail: 'Wisconsin, United States' }, { name: 'Oulujoki', detail: 'North Ostrobothnia, Finland' },
  { name: 'Oulunsalo', detail: 'North Ostrobothnia, Finland' }, { name: 'Athens', detail: 'Attica, Greece' },
  { name: 'Athens', detail: 'Georgia, United States' }, { name: 'Athens', detail: 'Ohio, United States' },
  { name: 'Helsinki', detail: 'Uusimaa, Finland' }, { name: 'Espoo', detail: 'Uusimaa, Finland' },
];
const query = ref(props.current ?? '');
const q = computed(() => query.value.trim().toLowerCase());
const found = computed(() => (q.value.length < 2 ? [] : PLACES.filter((p) => p.name.toLowerCase().startsWith(q.value)).slice(0, 10)));
</script>

<template>
  <div class="bpp">
    <h1 class="bpp__title">Place</h1>
    <input v-model="query" class="bpp__field" placeholder="Town or city" enterkeyhint="search" />
    <div class="bpp__list">
      <button class="bpp__row" @click="emit('pick', null)">
        <span :class="['bpp__name', { 'bpp__name--on': !current }]">Current location</span><span class="bpp__sub">Where the phone is</span>
      </button>
      <p v-if="q.length >= 2 && !found.length" class="bpp__note">No places called “{{ query.trim() }}”</p>
      <button v-for="p in found" :key="p.name + p.detail" class="bpp__row" @click="emit('pick', p)">
        <span class="bpp__name">{{ p.name }}</span><span class="bpp__sub">{{ p.detail }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* dp → px 1:1 on a 360px screen: 16px sides, 40px top, 26sp light title, 64dp rows (19sp name, 15sp detail) */
.bpp { width: 360px; height: 640px; box-sizing: border-box; padding: 40px 16px 16px; background: #000; color: #fff;
  font-family: var(--hd-font-family-default); display: flex; flex-direction: column; }
.bpp__title { margin: 0 0 12px; font: 300 26px/1.2 var(--hd-font-family-light); }
.bpp__field { background: none; border: 0; border-bottom: 2px solid var(--hd-color-accent-default, #2A86D8); color: #fff;
  font: inherit; font-size: 19px; padding: 8px 4px; outline: none; }
.bpp__field::placeholder { color: #8C8C8C; }
.bpp__list { flex: 1; overflow-y: auto; }
.bpp__row { display: flex; flex-direction: column; justify-content: center; min-height: 64px; width: 100%; padding: 0; border: 0;
  background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.bpp__name { font-size: 19px; } .bpp__name--on { color: #2A86D8; }
.bpp__sub, .bpp__note { font-size: 15px; color: #8C8C8C; }
.bpp__note { font-size: 17px; min-height: 56px; display: flex; align-items: center; margin: 0; }
</style>
