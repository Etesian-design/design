import type { Meta, StoryObj } from '@storybook/vue3';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import * as Hd from '../../index';
import { apps } from '../Home.stories';
import { links } from '../Web.stories';

const meta: Meta = { title: 'Examples/Full pages', parameters: { layout: 'fullscreen' } };
export default meta;
type S = StoryObj;
const components = { ...Object.fromEntries(Object.entries(Hd).filter(([k]) => k.startsWith('Hd'))) } as any;

export const OSSettings: S = {
  name: 'OS: Settings page',
  render: () => ({
    components,
    setup() {
      const titles = ref(['Settings']);
      const wifi = ref(true), bt = ref(false), flight = ref(false), vol = ref(60), profile = ref(1), pick = ref(false), banner = ref(false);
      const profiles = ['Ringing', 'Beep', 'Silent'];
      return { titles, wifi, bt, flight, vol, profile, pick, banner, profiles, push: (t: string) => titles.value.push(t), pop: () => titles.value.length > 1 && titles.value.pop() };
    },
    template: `<div style="max-width:400px;height:720px;margin:0 auto;display:flex;flex-direction:column;position:relative;overflow:hidden;border-inline:1px solid var(--hd-c-divider)">
      <HdStatusBar time="12:45" />
      <HdPageStack :titles="titles" style="flex:1" @back="pop">
        <template #default="{ depth }">
          <template v-if="depth === 1">
            <HdSectionHeader title="Connectivity" />
            <HdListItem title="Flight mode"><template #trailing><HdSwitch v-model="flight" aria-label="Flight mode" /></template></HdListItem>
            <HdListItem title="Wi-Fi" :subtitle="wifi ? 'Home network' : 'Off'" drilldown @click="push('Wi-Fi')" />
            <HdListItem title="Bluetooth"><template #trailing><HdSwitch v-model="bt" aria-label="Bluetooth" /></template></HdListItem>
            <HdSectionHeader title="Sounds" />
            <HdListItem title="Profile" :subtitle="profiles[profile]" clickable @click="pick = true" />
            <div style="padding:0 16px 8px"><HdSlider v-model="vol" label="Ringing volume" /></div>
            <HdSectionHeader title="Device" />
            <HdListItem title="Display" subtitle="Brightness, lock" drilldown @click="push('Display')" />
            <HdListItem title="About product" drilldown @click="push('About product')" />
          </template>
          <template v-else-if="titles[titles.length - 1] === 'Wi-Fi'">
            <HdListItem title="Wi-Fi"><template #trailing><HdSwitch v-model="wifi" aria-label="Wi-Fi" /></template></HdListItem>
            <HdSectionHeader title="Networks" />
            <HdListItem v-for="n in ['Home network', 'Cafe Harmattan', 'Office']" :key="n" :title="n" :subtitle="n === 'Home network' ? 'Connected' : 'Secured'" clickable @click="banner = true">
              <template #leading><HdThumbnail icon="wifi" :size="32" /></template></HdListItem>
          </template>
          <div v-else style="padding:16px"><HdBusyIndicator size="large" label="Loading" /></div>
        </template>
      </HdPageStack>
      <HdSelectionDialog v-model:open="pick" v-model="profile" inline title="Profile" :options="profiles" />
      <HdInfoBanner v-model:open="banner" text="Connecting..." icon="wifi" style="position:absolute" />
    </div>`,
  }),
};

export const OSLockScreen: S = {
  name: 'OS: Lock screen',
  render: () => ({
    components,
    template: `<div class="hd-on-home" style="max-width:400px;height:720px;margin:0 auto;display:flex;flex-direction:column;background:linear-gradient(160deg,color-mix(in srgb,#1d6bba 35%,var(--hd-surface-home)),var(--hd-surface-home));color:var(--hd-c-fg)">
      <HdStatusBar transparent time="12:45" />
      <div style="text-align:right;padding:32px 24px 0"><div style="font:300 72px/1 var(--hd-font-family-light);font-variant-numeric:tabular-nums">12:45</div>
        <div style="font:300 var(--hd-font-size-large)/1.4 var(--hd-font-family-light);color:var(--hd-c-fg-secondary)">Monday 24 October</div></div>
      <div style="margin-top:auto;display:grid;gap:8px;padding:16px">
        <HdLockScreenNotificationCard message="Are we still on for lunch?" source="Anna Virtanen" time="12:02" accent="#09A7CC" />
        <HdLockScreenNotificationCard message="2 missed calls" source="Phone" time="11:40" icon="phone" accent="#62B700" :count="2" />
        <p style="margin:4px 0 0;text-align:right;color:var(--hd-c-fg-secondary);font-size:var(--hd-font-size-small)">More</p>
        <p style="margin:16px 0 0;text-align:center;color:var(--hd-c-fg-secondary);font-size:var(--hd-font-size-xsmall)">Swipe sideways to unlock</p></div></div>`,
  }),
};

export const OSHome: S = {
  name: 'OS: Home (Applications view)',
  render: () => ({
    components, setup: () => ({ apps, view: ref(1) }),
    template: `<div class="hd-on-home" style="max-width:400px;height:720px;margin:0 auto;display:flex;flex-direction:column;background:var(--hd-surface-home);color:var(--hd-c-fg)">
      <HdStatusBar time="12:45" />
      <div style="flex:1;min-height:0;overflow:auto"><HdAppGrid><li v-for="a in apps" :key="a[0]"><HdAppIcon :label="a[0]" :icon="a[1]" :color="a[2]" :loading="a[0]==='Music'" /></li></HdAppGrid></div>
      <div style="display:flex;justify-content:center;padding:16px"><HdPageIndicator :total="3" :current="view" interactive label="Home views" @select="view = $event" /></div></div>`,
  }),
};

export const WebLanding: S = {
  name: 'Web: Landing page',
  render: () => ({
    components,
    setup() {
      const email = ref(''), toast = ref(false), page = ref(1);
      const rows = [{ id: 1, plan: 'Personal', seats: 1, price: 0 }, { id: 2, plan: 'Team', seats: 10, price: 49 }, { id: 3, plan: 'Studio', seats: 50, price: 199 }];
      const cols = [{ key: 'plan', label: 'Plan' }, { key: 'seats', label: 'Seats', numeric: true }, { key: 'price', label: 'EUR / month', numeric: true }];
      return { links, email, toast, rows, cols, page, apps };
    },
    template: `<div>
      <HdSiteHeader brand="Harmattan" :links="links"><template #actions><HdButton variant="accent" @click="toast = true">Get started</HdButton><HdToolIcon icon="search" label="Search" /></template></HdSiteHeader>
      <main id="main">
        <HdHero eyebrow="Design language" title="The content is the interface." lead="A calm, light, gesture-first design system inspired by the Nokia N9, for apps and the web.">
          <template #actions><HdButton variant="accent" @click="toast = true">Get started</HdButton><HdButton>Read the guide</HdButton></template>
          <template #media><HdAppGrid class="hd-on-home" style="background:var(--hd-surface-home);border-radius:var(--hd-radius-card)">
            <li v-for="a in apps.slice(0, 8)" :key="a[0]"><HdAppIcon :label="a[0]" :icon="a[1]" :color="a[2]" /></li></HdAppGrid></template>
        </HdHero>
        <section id="features" style="padding:48px 0"><HdContainer>
          <h2 style="font:300 var(--hd-font-size-xxlarge)/1.1 var(--hd-font-family-light);margin:0 0 32px">Three ideas</h2>
          <HdGrid min="260px">
            <HdCard title="Swipe" text="No home button. Edge swipes minimise, top swipe closes." icon="back" accent="#62B700" href="#swipe" />
            <HdCard title="Squircle" text="Avatars, icons and thumbnails share one superellipse." icon="star" accent="#821DDE" href="#squircle" />
            <HdCard title="Light type" text="Large, light typography and generous whitespace." icon="edit" accent="#EF5500" href="#type" />
          </HdGrid></HdContainer></section>
        <section id="pricing" style="padding:48px 0;background:var(--hd-c-surface)"><HdContainer size="prose">
          <HdTable caption="Pricing" :columns="cols" :rows="rows" />
          <div style="display:flex;justify-content:center;margin-top:24px"><HdPagination v-model:page="page" :total="3" /></div></HdContainer></section>
        <section id="contact" style="padding:48px 0"><HdContainer size="prose">
          <form style="display:grid;gap:16px" @submit.prevent="toast = true">
            <h2 style="font:300 var(--hd-font-size-xxlarge)/1.1 var(--hd-font-family-light);margin:0">Stay in touch</h2>
            <HdTextField v-model="email" label="Email" type="email" autocomplete="email" />
            <HdButton type="submit" variant="accent">Subscribe</HdButton></form></HdContainer></section>
      </main>
      <HdFooter note="Harmattan Design Language. Unaffiliated with Nokia; no Nokia assets included." :columns="[{ title: 'Guide', links: [{ label: 'Principles', href: '#p' }, { label: 'Components', href: '#c' }] }, { title: 'Project', links: [{ label: 'Source', href: '#s' }, { label: 'Contributing', href: '#k' }] }]" />
      <HdToast v-model:open="toast" text="Thanks! Check your inbox." action="Undo" />
    </div>`,
  }),
};
