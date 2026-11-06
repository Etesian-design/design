<script setup lang="ts">
/**
 * Settings, split: on a wide window (container 760 px+) a left panel of groups with squircle icons and search, the page on
 * the right, as iPad and macOS settings; narrower, the same list drills down N9-style (the list, tap, the page, Back).
 * Admin groups (Connections, Devices, Catalogue) sit in the same panel and hide for devices that are not the owner.
 * A host brings the real pages through the `page` slot ({ page }) and follows the choice with v-model:page; without the slot
 * the mock pages show (Storybook). Narrow, the page has a Back link to the list.
 */
import { ref, computed, watch } from 'vue';
import HdIcon from '../../components/HdIcon.vue';
import HdListItem from '../../components/HdListItem.vue';
import HdSectionHeader from '../../components/HdSectionHeader.vue';
import HdSearchField from '../../components/HdSearchField.vue';
import HdSwitch from '../../components/HdSwitch.vue';
import HdThumbnail from '../../components/HdThumbnail.vue';
import HdSlider from '../../components/HdSlider.vue';
export interface SettingsPage { id: string; title: string; icon: string; color: string; subtitle?: string; admin?: boolean }
export interface SettingsGroup { title: string; pages: SettingsPage[] }
const props = withDefaults(defineProps<{ groups?: SettingsGroup[]; page?: string; owner?: boolean; narrowPage?: boolean }>(), { owner: true, narrowPage: false });
const emit = defineEmits<{ open: [id: string]; 'update:page': [id: string] }>();
const DEFAULT: SettingsGroup[] = [
  { title: 'This device', pages: [
    { id: 'appearance', title: 'Appearance', icon: 'moon', color: '#3E4A5C', subtitle: 'Match system' },
    { id: 'data', title: 'Data use', icon: 'data', color: '#0093D0', subtitle: 'Picture quality 70' },
    { id: 'pair', title: 'Pair a new device', icon: 'qr', color: '#5AA21C', subtitle: 'One-time code' } ] },
  { title: 'Your server', pages: [
    { id: 'connections', title: 'Connections', icon: 'split', color: '#2F7D1E', subtitle: '3 accounts', admin: true },
    { id: 'devices', title: 'Devices', icon: 'window', color: '#E2701C', subtitle: '4 paired', admin: true },
    { id: 'catalogue', title: 'Catalogue', icon: 'bag', color: '#1F4FA8', subtitle: 'Apps and services', admin: true },
    { id: 'android', title: 'Android', icon: 'phone', color: '#5AA21C', subtitle: 'Running', admin: true } ] },
];
const q = ref('');
const groups = computed(() => (props.groups ?? DEFAULT).map((g) => ({ ...g, pages: g.pages.filter((p) => (props.owner || !p.admin) && p.title.toLowerCase().includes(q.value.toLowerCase())) })).filter((g) => g.pages.length));
const current = ref(props.page ?? 'connections');
watch(() => props.page, (p) => { if (p) { current.value = p; showPage.value = true; } });
const showPage = ref(props.narrowPage);
// the open page stays while the list is searched or the owner is still being checked: the filters narrow the list, not the page
const cur = computed(() => (props.groups ?? DEFAULT).flatMap((g) => g.pages).find((p) => p.id === current.value));
function open(id: string) { current.value = id; showPage.value = true; emit('open', id); emit('update:page', id); }
const grey = ref(false), quality = ref(70);
</script>
<template>
  <div class="x-sset" :class="{ 'is-page': showPage }">
    <nav class="x-sset__side" aria-label="Settings">
      <div class="x-sset__search"><HdSearchField v-model="q" placeholder="Search settings" /></div>
      <template v-for="g in groups" :key="g.title">
        <HdSectionHeader :title="g.title" />
        <HdListItem v-for="p in g.pages" :key="p.id" :title="p.title" :subtitle="p.subtitle" small drilldown :selected="p.id === current" @click="open(p.id)">
          <template #leading><HdThumbnail :icon="p.icon" :size="32" :color="p.color" /></template>
        </HdListItem>
      </template>
    </nav>
    <section v-if="cur" class="x-sset__page" :aria-label="cur.title">
      <button type="button" class="x-sset__back hd-sqh hd-focusable" @click="showPage = false"><HdIcon name="back" :size="18" />Settings</button>
      <slot v-if="$slots.page" name="page" :page="cur.id" />
      <template v-else>
      <h2 class="x-sset__title">{{ cur.title }}</h2>
      <template v-if="cur.id === 'connections'">
        <HdSectionHeader title="Accounts" />
        <HdListItem title="Work mail" subtitle="IMAP · copies mail, contacts, calendars" drilldown><template #leading><HdThumbnail icon="mail" :size="32" color="#1C6FD1" /></template></HdListItem>
        <HdListItem title="Matrix" subtitle="@me:example.org · encrypted" drilldown><template #leading><HdThumbnail icon="message" :size="32" color="#0DBD8B" /></template></HdListItem>
        <HdListItem title="Telegram" subtitle="Signed in" drilldown><template #leading><HdThumbnail icon="message" :size="32" color="#2AABEE" /></template></HdListItem>
        <HdListItem title="Add an account" clickable><template #leading><HdThumbnail icon="add" :size="32" /></template></HdListItem>
        <HdSectionHeader title="Messaging" />
        <HdListItem title="Phone logins" subtitle="n9, e7" drilldown />
        <HdListItem title="Rules" subtitle="Numbers go out as SMS" drilldown />
      </template>
      <template v-else-if="cur.id === 'data'">
        <HdListItem title="Picture quality" :subtitle="String(quality)" />
        <div class="x-sset__pad"><HdSlider v-model="quality" :min="10" :max="100" label="Picture quality" /></div>
        <HdListItem title="Grayscale pictures" subtitle="Fewer bytes; text stays sharp"><template #trailing><HdSwitch v-model="grey" aria-label="Grayscale pictures" /></template></HdListItem>
      </template>
      <template v-else>
        <HdListItem :title="cur.title" :subtitle="cur.subtitle" />
      </template>
      </template>
    </section>
  </div>
</template>
<style>
.x-sset { flex: 1; min-height: 0; display: grid; grid-template-columns: 300px 1fr; background: var(--hd-c-bg); color: var(--hd-c-fg); }
/* the window body (or the page) is the container: the split follows the window, not the screen */
.x-sset__side { min-height: 0; overflow: auto; border-right: 1px solid var(--hd-c-divider); background: color-mix(in srgb, var(--hd-c-fg) 4%, var(--hd-c-bg)); }
.x-sset__search { padding: 10px 12px 2px; }
.x-sset__page { min-height: 0; overflow: auto; padding: 0 24px 24px; }
.x-sset__title { margin: 18px 0 4px; font: var(--hd-font-weight-light) 28px/1.2 var(--hd-font-family-light); }
.x-sset__back { display: none; align-items: center; gap: 4px; margin: 10px 0 0; padding: 6px 10px 6px 4px; border: 0; border-radius: 16px; background: none; color: var(--hd-c-accent-text); font: 400 var(--hd-font-size-default)/1 var(--hd-font-family-base); cursor: pointer; }
.x-sset__back:hover { background: var(--hd-c-pressed); }
.x-sset__pad { padding: 0 12px 8px 60px; }
@container (max-width: 759px) {
  .x-sset { grid-template-columns: 1fr; }
  .x-sset__side { border: 0; background: none; }
  .x-sset.is-page .x-sset__side, .x-sset:not(.is-page) .x-sset__page { display: none; }
  .x-sset__page { padding: 0 12px 16px; }
  .x-sset__back { display: inline-flex; }
}
</style>
