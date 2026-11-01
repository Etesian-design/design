import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import HdSiteHeader from '../components/HdSiteHeader.vue';
import HdFooter from '../components/HdFooter.vue';
import HdHero from '../components/HdHero.vue';
import HdCard from '../components/HdCard.vue';
import HdGrid from '../components/HdGrid.vue';
import HdContainer from '../components/HdContainer.vue';
import HdTable from '../components/HdTable.vue';
import HdPagination from '../components/HdPagination.vue';
import HdButton from '../components/HdButton.vue';

const meta: Meta = { title: 'Web/Components', excludeStories: ['links'], tags: ['autodocs'], parameters: { docs: { description: { component: 'All **EXT**: web extrapolations in the N9 spirit. Resize the viewport (toolbar) to see the SiteHeader collapse into a bottom toolbar, the Table reflow into list items and Pagination compact below 600px.' } } } };
export default meta;
type S = StoryObj;
export const links = [{ label: 'Home', href: '#', icon: 'home', current: true }, { label: 'Features', href: '#features', icon: 'star' }, { label: 'Pricing', href: '#pricing', icon: 'globe' }, { label: 'Contact', href: '#contact', icon: 'mail' }];

export const SiteHeader: S = { render: () => ({ components: { HdSiteHeader, HdButton }, setup: () => ({ links }), template: '<HdSiteHeader brand="Etesian" :links="links" :sticky="false"><template #actions><HdButton variant="accent">Get started</HdButton></template></HdSiteHeader><main id="main" style="height:200px"></main>' }) };
export const SiteHeaderChrome: S = { name: 'Site header, dark', render: () => ({ components: { HdSiteHeader, HdButton }, setup: () => ({ links }), template: '<HdSiteHeader brand="Etesian" tone="chrome" :links="links" :sticky="false"><template #logo><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="7" fill="#4591FF"/></svg></template><template #actions><HdButton variant="accent">Get started</HdButton></template></HdSiteHeader><main id="main" style="height:200px;background:#000"></main>' }) };
export const Hero: S = { render: () => ({ components: { HdHero, HdButton }, template: '<HdHero eyebrow="Design language" title="The content is the interface." lead="Calm, light, gesture-first design from the Nokia N9, rebuilt for the web."><template #actions><HdButton variant="accent">Read the guide</HdButton><HdButton>Components</HdButton></template></HdHero>' }) };
export const HeroColored: S = { render: () => ({ components: { HdHero, HdButton }, template: '<HdHero colored accent="#0067BC" title="Mail, made calm." lead="One inbox for every account."><template #actions><HdButton>Download</HdButton></template></HdHero>' }) };
export const Cards: S = { render: () => ({ components: { HdCard, HdGrid, HdButton }, template: `<HdGrid min="240px">
  <HdCard title="Swipe" text="Edge swipes replace the home button." icon="back" accent="#62B700" href="#" />
  <HdCard title="Squircles" text="Every thumb-sized object shares one shape." icon="star" accent="#821DDE" href="#" />
  <HdCard title="Light type" text="Big, light, calm typography." icon="edit" accent="#EF5500"><template #actions><HdButton variant="plain">Learn more</HdButton></template></HdCard></HdGrid>` }) };
export const GridAndContainer: S = { render: () => ({ components: { HdGrid, HdContainer }, template: `<HdContainer><HdGrid>
  <div v-for="n in 12" :key="n" style="--span:1;--span-md:1;--span-lg:1;background:var(--hd-accent);opacity:.25;height:48px"></div>
  <div style="--span:4;--span-md:4;--span-lg:8;background:var(--hd-c-surface);padding:16px">8 / 12</div>
  <div style="--span:4;--span-md:4;--span-lg:4;background:var(--hd-c-surface);padding:16px">4 / 12</div></HdGrid></HdContainer>` }) };
const rows = [{ id: 1, name: 'Nokia N9', year: 2011, price: 659 }, { id: 2, name: 'Nokia N950', year: 2011, price: 0 }, { id: 3, name: 'F(x)tec Pro1-X', year: 2022, price: 869 }, { id: 4, name: 'PinePhone', year: 2020, price: 199 }];
export const Table: S = { render: () => ({ components: { HdTable }, setup: () => ({ rows, cols: [{ key: 'name', label: 'Device', sortable: true }, { key: 'year', label: 'Year', numeric: true, sortable: true }, { key: 'price', label: 'Price (EUR)', numeric: true, sortable: true }] }),
  template: '<HdTable caption="Devices" :columns="cols" :rows="rows" />' }) };
export const Pagination: S = { render: () => ({ components: { HdPagination }, setup: () => ({ p: ref(4) }), template: '<HdPagination v-model:page="p" :total="12" />' }) };
export const Footer: S = { render: () => ({ components: { HdFooter }, template: `<HdFooter note="Etesian Design Language. Not affiliated with Nokia." :columns="[{ title: 'Guide', links: [{ label: 'Principles', href: '#p' }, { label: 'Colour', href: '#c' }] }, { title: 'Project', links: [{ label: 'Source', href: '#s' }, { label: 'Contributing', href: '#k' }] }]" />` }) };
