import type { Meta, StoryObj } from '@storybook/vue3-vite';
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
// Measured 2026-10-31 from the Nokia 701's own vector art (.nvg, decoded for reference only; nothing of it ships).
import { squircleRectPath, squirclePath } from '../squircle';
const shape = (d: string, w: number, h: number, label: string, fill = '#4591FF') => `<figure style="margin:0;text-align:center;font-size:12px"><svg viewBox="-1 -1 ${w + 2} ${h + 2}" width="${w + 2}" height="${h + 2}"><path d="${d}" fill="${fill}"/></svg><figcaption>${label}</figcaption></figure>`;
export const WhatSquircleMeans: S = {
  name: 'What the squircle is (from the 701 art)',
  parameters: { docs: { description: { story: 'Belle draws its icon squircle as four cubic curves from edge middle to edge middle, handles 0.7408 × the half-size: within 0.7% of n = 2.8 everywhere. Larger faces (analog dial, toggle caps, torch) measure n ≈ 2.9–2.95 and are often **not square** (72 × 82): the squircle stretches to its box. The on/off track is a wide squircle (64 × 42, n ≈ 3.6). None of them is ever a rounded rectangle, a circle or a pill: the last column shows what that wrong shape looks like.' } } },
  render: () => ({ template: `<div style="display:flex;gap:24px;align-items:end;flex-wrap:wrap">${[
    shape(squirclePath(80, 2.8), 80, 80, 'App icon 80 × 80, n 2.8'),
    shape(squircleRectPath(126, 126, 2.9), 126, 126, 'Clock face 126, n 2.9', '#41413C'),
    shape(squircleRectPath(72, 82, 2.95), 72, 82, 'Toggle cap 72 × 82, n 2.95', '#7D8A99'),
    shape(squircleRectPath(64, 42, 3.6), 64, 42, 'Switch track 64 × 42, n 3.6', '#4F9A3A'),
    `<figure style="margin:0;text-align:center;font-size:12px"><div style="width:72px;height:82px;border-radius:20px;background:#C33;margin:1px"></div><figcaption>Wrong: rounded rectangle</figcaption></figure>`,
  ].join('')}</div>` }),
};
