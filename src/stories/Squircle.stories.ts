import type { Meta, StoryObj } from '@storybook/vue3';
import HdAvatar from '../components/HdAvatar.vue';
import HdAppIcon from '../components/HdAppIcon.vue';
import HdThumbnail from '../components/HdThumbnail.vue';
import HdSquircle from '../components/HdSquircle.vue';

const meta: Meta = { title: 'OS/Squircle shapes', tags: ['autodocs'], parameters: { docs: { description: { component: '**Canon (squircle rule)**: avatars, app icons, thumbnails, file icons and the loading ring are superellipses (|x|^2.8+|y|^2.8=1). Images in these stories are generated gradients (no third-party photos).' } } } };
export default meta;
type S = StoryObj;
const img = (a: string, b: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="10" height="10" fill="url(#g)"/></svg>`)}`;

export const Avatars: S = { render: () => ({ components: { HdAvatar }, setup: () => ({ src: img('#f6d365', '#fda085') }), template: '<div style="display:flex;gap:16px;align-items:end"><HdAvatar name="Anna Virtanen" :size="32" /><HdAvatar name="Mikko Laine" /><HdAvatar name="Sara K" :size="64" /><HdAvatar name="Photo person" :src="src" :size="64" /></div>' }) };
export const AppIcons: S = { render: () => ({ components: { HdAppIcon }, template: `<div style="display:flex;gap:8px;flex-wrap:wrap">
  <HdAppIcon label="Phone" icon="phone" color="#62B700" /><HdAppIcon label="Messages" icon="message" color="#09A7CC" :badge="2" />
  <HdAppIcon label="Mail" icon="mail" color="#0067BC" /><HdAppIcon label="Music" icon="music" color="#CC09BA" /><HdAppIcon label="Calendar" icon="calendar" color="#EF5500" />
  <HdAppIcon label="Opening..." icon="photo" color="#821DDE" loading /></div>` }) };
export const LaunchRing: S = { name: 'App launch ring (loading)', render: () => ({ components: { HdAppIcon }, template: '<HdAppIcon label="Clock" icon="clock" color="#F77219" loading :size="80" />' }) };
export const Thumbnails: S = { render: () => ({ components: { HdThumbnail }, setup: () => ({ src: img('#43e97b', '#38f9d7') }), template: '<div style="display:flex;gap:16px"><HdThumbnail :src="src" alt="Beach" /><HdThumbnail icon="music" /><HdThumbnail icon="info" color="#F2B111" /></div>' }) };
export const Base: S = { render: () => ({ components: { HdSquircle }, template: '<HdSquircle :size="120" color="var(--hd-accent)" />' }) };
