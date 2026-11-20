import type { Meta, StoryObj } from '@storybook/vue3-vite';
import * as N9 from './n9apps';
import { CSS, comps } from './n9apps';

/* The N9's system apps at 480 x 854 n9px, shown at css = n9px x 2/3. Pictures are gradients; names are samples. */
const meta: Meta = {
  title: 'Examples/System apps (N9)',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'The system apps as the N9 draws them at 480 × 854, shown at 2/3 scale. **Dark apps** (Phone\'s dial pad header, Calculator, Camera, Gallery, Music) sit on black; **content apps** (Contacts, Calendar, Clock, Documents) are light grey (#DEE2E6) under a coloured 72px title bar or none. Every action is on the bottom toolbar (72px); a few apps (Phone, Calendar, Gallery) use it as **tabs**, the current one a lighter cell.' } } },
};
// A phone screen: centred, as big as itself.
meta.parameters = { ...meta.parameters, layout: 'centered' };
export default meta;
type S = StoryObj;
/* The screens (styles, glyphs, templates) live in n9apps.ts; the camera below reuses CSS and comps. */

export const Phone: S = { name: 'Phone: dial pad', parameters: { docs: { description: { story: N9.DOCS.phone } } }, render: () => ({ components: comps, template: N9.phone() }) };

export const Contacts: S = { name: 'Contacts: list', parameters: { docs: { description: { story: N9.DOCS.contacts } } }, render: () => N9.contacts() };

export const ContactEditor: S = { name: 'Contacts: editor', parameters: { docs: { description: { story: N9.DOCS.contactEditor } } }, render: () => ({ components: comps, template: N9.contactEditor() }) };

export const Calculator: S = { name: 'Calculator', parameters: { docs: { description: { story: N9.DOCS.calculator } } }, render: () => ({ components: comps, template: N9.calculator() }) };

export const Clock: S = { name: 'Clock and alarms', parameters: { docs: { description: { story: N9.DOCS.clock } } }, render: () => ({ components: comps, template: N9.clock() }) };

export const AlarmEditor: S = { name: 'Clock: alarm editor', parameters: { docs: { description: { story: N9.DOCS.alarmEditor } } }, render: () => ({ components: comps, template: N9.alarmEditor() }) };

export const CalendarMonth: S = { name: 'Calendar: month', parameters: { docs: { description: { story: N9.DOCS.month } } }, render: () => N9.calendarMonth() };

export const CalendarWeek: S = { name: 'Calendar: day in the week', parameters: { docs: { description: { story: N9.DOCS.week } } }, render: () => ({ components: comps, template: N9.calendarWeek() }) };

export const CalendarAgenda: S = { name: 'Calendar: agenda', parameters: { docs: { description: { story: N9.DOCS.agenda } } }, render: () => ({ components: comps, template: N9.calendarAgenda() }) };

export const CalendarMenu: S = { name: 'Calendar: menu open', parameters: { docs: { description: { story: N9.DOCS.calendarMenu } } }, render: () => ({ components: comps, template: N9.calendarMenu() }) };

export const Gallery: S = { name: 'Gallery: grid', parameters: { docs: { description: { story: N9.DOCS.gallery } } }, render: () => N9.gallery() };

export const Photo: S = { name: 'Gallery: one picture', parameters: { docs: { description: { story: N9.DOCS.photo } } }, render: () => ({ components: comps, template: N9.photo() }) };

export const Music: S = { name: 'Music', parameters: { docs: { description: { story: N9.DOCS.music } } }, render: () => ({ components: comps, template: N9.music() }) };

export const NowPlaying: S = { name: 'Music: now playing', parameters: { docs: { description: { story: N9.DOCS.nowPlaying } } }, render: () => ({ components: comps, template: N9.nowPlaying() }) };

export const Browser: S = { name: 'Browser: start page', parameters: { docs: { description: { story: N9.DOCS.browser } } }, render: () => ({ components: comps, template: N9.browser() }) };

export const Documents: S = { name: 'Documents', parameters: { docs: { description: { story: N9.DOCS.documents } } }, render: () => ({ components: comps, template: N9.documents() }) };

export const Settings: S = { name: 'Settings', parameters: { docs: { description: { story: N9.DOCS.settings } } }, render: () => ({ components: comps, template: N9.settings() }) };

/* ---- Camera (PR1.3), measured from the user's own N9 captures (n9-ref/camera, SPEC.md), in N9 px. ----
   Every control is drawn as an SVG n = 2.8 squircle (pills: squircle-half ends), dark see-through with a thin light
   outline; glyphs are Etesian's own (the same paths as the Aperture patch's vector drawables). */
const SQN = 2.8;
/** A squircle path in w x h; with ends, squircle halves on the short side pulled apart (a pill). */
const sqPath = (w: number, h: number, ends = false, inset = 0) => {
  const pts: string[] = [];
  const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number) => {
    for (let a = a0; a <= a1 + 1e-6; a += 4) {
      const t = (a * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
      pts.push(`${(cx + rx * Math.sign(c) * Math.abs(c) ** (2 / SQN)).toFixed(2)} ${(cy - ry * Math.sign(s) * Math.abs(s) ** (2 / SQN)).toFixed(2)}`);
    }
  };
  const W = w - 2 * inset, H = h - 2 * inset, x = inset, y = inset;
  if (!ends || Math.abs(W - H) < 1) arc(x + W / 2, y + H / 2, W / 2, H / 2, 0, 360);
  else if (W > H) { arc(x + H / 2, y + H / 2, H / 2, H / 2, 90, 270); arc(x + W - H / 2, y + H / 2, H / 2, H / 2, 270, 450); }
  else { arc(x + W / 2, y + W / 2, W / 2, W / 2, 0, 180); arc(x + W / 2, y + H - W / 2, W / 2, W / 2, 180, 360); }
  return `M${pts.join('L')}Z`;
};
/** A squircle face behind a control: fill + a thin rim (1.5 N9 px), or a gradient. */
const face = (w: number, h: number, o: { ends?: boolean; fill?: string; rim?: string; grad?: [string, string] } = {}) => {
  const id = `g${Math.random().toString(36).slice(2, 8)}`;
  const fill = o.grad ? `url(#${id})` : (o.fill ?? 'rgba(0,0,0,.55)');
  return `<svg class="cf" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${o.grad ? `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.grad[0]}"/><stop offset="1" stop-color="${o.grad[1]}"/></linearGradient></defs>` : ''}<path d="${sqPath(w, h, o.ends, 0.75)}" fill="${fill}" stroke="${o.rim ?? 'rgba(255,255,255,.35)'}" stroke-width="1.5"/></svg>`;
};
const GLYPHS: Record<string, [string, string]> = {
  'back': ['0 0 24 24', '<path d="M20,12H5 M11,5l-7,7 7,7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'],
  'camera': ['0 0 24 24', '<path d="M9,3L7.2,5H4C2.9,5 2,5.9 2,7v11c0,1.1 0.9,2 2,2h16c1.1,0 2,-0.9 2,-2V7c0,-1.1 -0.9,-2 -2,-2h-3.2L15,3H9zM12,17.5c-2.5,0 -4.5,-2 -4.5,-4.5s2,-4.5 4.5,-4.5 4.5,2 4.5,4.5 -2,4.5 -4.5,4.5zM12,10.2a2.8,2.8 0,1 0,0 5.6a2.8,2.8 0,1 0,0 -5.6z" fill="currentColor"/>'],
  'exposure': ['0 0 24 24', '<path d="M12,3a9,9 0,1 1,0 18a9,9 0,1 1,0 -18z M6.5,17.5l11,-11 M7,9.5h4 M9,7.5v4 M13,15h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'],
  'face': ['0 0 24 24', '<path d="M4,8V4h4 M16,4h4v4 M20,16v4h-4 M8,20H4v-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12,7a2.7,2.7 0,1 1,0 5.4a2.7,2.7 0,1 1,0 -5.4z M7,17.5c0,-2.3 2.2,-3.6 5,-3.6s5,1.3 5,3.6z" fill="currentColor"/>'],
  'filter_mono': ['0 0 24 24', '<path d="M12,4a8,8 0,1 1,0 16a8,8 0,1 1,0 -16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12,4a8,8 0,0 1,0 16z" fill="currentColor"/>'],
  'filter_negative': ['0 0 24 24', '<path d="M12,4a8,8 0,1 1,0 16a8,8 0,1 1,0 -16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8,12h8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'],
  'filter_off': ['0 0 24 24', '<path d="M12,4a8,8 0,1 1,0 16a8,8 0,1 1,0 -16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'],
  'filter_posterize': ['0 0 24 24', '<path d="M12,3.5a8.5,8.5 0,1 1,0 17a8.5,8.5 0,1 1,0 -17z M12,7a5,5 0,1 1,0 10a5,5 0,1 1,0 -10z M12,10.3a1.7,1.7 0,1 1,0 3.4a1.7,1.7 0,1 1,0 -3.4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'],
  'filter_sepia': ['0 0 24 24', '<path d="M12,4a8,8 0,1 1,0 16a8,8 0,1 1,0 -16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12,7c-1.8,2.6 -3,4.3 -3,6a3,3 0,0 0,6 0c0,-1.7 -1.2,-3.4 -3,-6z" fill="currentColor"/>'],
  'filter_solarise': ['0 0 24 24', '<path d="M12,2l2,4.2 4.5,-1.5 -1,4.6 4.3,2.2 -4.3,2.2 1,4.6 -4.5,-1.5L12,22l-2,-4.2 -4.5,1.5 1,-4.6L2.2,12.5l4.3,-2.2 -1,-4.6 4.5,1.5z" fill="currentColor"/>'],
  'gallery': ['0 0 24 24', '<path d="M3.5,5.5h17v13h-17z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5,16.5l4,-5 3,3.5 2.5,-2.5 3.5,4z M15.5,8a1.5,1.5 0,1 1,0 3a1.5,1.5 0,1 1,0 -3z" fill="currentColor"/>'],
  'redeye': ['0 0 24 24', '<path d="M2.5,12C5,7.5 19,7.5 21.5,12C19,16.5 5,16.5 2.5,12z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12,9.3a2.7,2.7 0,1 1,0 5.4a2.7,2.7 0,1 1,0 -5.4z" fill="currentColor"/>'],
  'scene_auto': ['0 0 24 24', '<path d="M3.5,5.5h17v13h-17z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9,16l3,-8 3,8 M10.1,13.2h3.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'],
  'scene_landscape': ['0 0 24 24', '<path d="M2,19.5l6.5,-10 4,6 2.5,-3.5 7,7.5z M17,4.5a2,2 0,1 1,0 4a2,2 0,1 1,0 -4z" fill="currentColor"/>'],
  'scene_macro': ['0 0 24 24', '<path d="M12,13c-3.3,0 -5.5,-2.6 -5.5,-7.5c2,0.3 3.8,1.3 5.5,3.3c1.7,-2 3.5,-3 5.5,-3.3C17.5,10.4 15.3,13 12,13z" fill="currentColor"/><path d="M12,13v8 M12,18c-1.5,-2.2 -3.5,-2.6 -5,-2.4 M12,17c1.5,-2 3.3,-2.4 5,-2.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'],
  'scene_night': ['0 0 24 24', '<path d="M14.5,2.5A9.5,9.5 0,1 0,21.5 15A7.5,7.5 0,0 1,14.5 2.5z" fill="currentColor"/>'],
  'scene_portrait': ['0 0 24 24', '<path d="M12,3.5a4,4 0,1 1,0 8a4,4 0,1 1,0 -8z M4,20.5c0,-4.4 3.6,-7 8,-7s8,2.6 8,7z" fill="currentColor"/>'],
  'scene_sports': ['0 0 24 24', '<path d="M15.5,2.5a2,2 0,1 1,0 4a2,2 0,1 1,0 -4z" fill="currentColor"/><path d="M13.5,8l-3,5 4,2.5 -1,5.5 M10.5,13l-3,4.5 -3.5,0 M12.5,9l4,2.5 3,-1 M12.5,9l-4,0.5 -2,2.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'],
  'torch_off': ['0 0 24 24', '<path d="M8,9h8v2.5l-1.5,2V21h-5v-7.5L8,11.5z M8,5h8v3H8z" fill="currentColor"/>'],
  'torch_on': ['0 0 24 24', '<path d="M8,9h8v2.5l-1.5,2V21h-5v-7.5L8,11.5z M8,5h8v3H8z" fill="currentColor"/><path d="M4,4l2,1.5 M20,4l-2,1.5 M12,1v2 M3.5,9h2 M18.5,9h2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'],
  'video': ['0 0 24 24', '<path d="M16,10.5V7c0,-0.55 -0.45,-1 -1,-1H3c-0.55,0 -1,0.45 -1,1v10c0,0.55 0.45,1 1,1h12c0.55,0 1,-0.45 1,-1v-3.5l5,4v-11l-5,4z" fill="currentColor"/>'],
  'wb_auto': ['0 0 24 24', '<path d="M10,8.2a3,3 0,1 1,0 6a3,3 0,1 1,0 -6z M10,2.5v2 M10,18v2 M2.5,11.2h2 M4.6,5.8l1.4,1.4 M15.4,5.8l-1.4,1.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M15,21.5l2.5,-7 2.5,7 M15.9,19.2h3.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'],
  'wb_cloudy': ['0 0 24 24', '<path d="M7,19h10.5a3.5,3.5 0,0 0,0 -7h-0.3A5,5 0,0 0,7.5 13.3A2.9,2.9 0,0 0,7 19z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'],
  'wb_fluorescent': ['0 0 24 24', '<path d="M4,10h16v4H4z M6,6.5l1,1.5 M12,5v2 M18,6.5l-1,1.5 M6,17.5l1,-1.5 M12,19v-2 M18,17.5l-1,-1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'],
  'wb_incandescent': ['0 0 24 24', '<path d="M9.5,21h5 M9.5,18h5 M12,3a5.8,5.8 0,0 0,-3.5 10.4V15.5h7v-2.1A5.8,5.8 0,0 0,12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'],
  'wb_sunny': ['0 0 24 24', '<path d="M12,8.5a3.5,3.5 0,1 1,0 7a3.5,3.5 0,1 1,0 -7z M12,2.5v2.2 M12,19.3v2.2 M2.5,12h2.2 M19.3,12h2.2 M5.3,5.3l1.5,1.5 M17.2,17.2l1.5,1.5 M5.3,18.7l1.5,-1.5 M17.2,6.8l1.5,-1.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'],
  'flash_auto': ['0 0 960 960', '<path d="M280,624L408,440L294,440L374,160L160,160L160,480L280,480L280,624ZM200,880L200,560L80,560L80,80L480,80L400,360L560,360L200,880ZM280,480L280,480L160,480L160,480L280,480L280,480L280,480L280,480ZM585,440L720,80L784,80L921,440L859,440L827,348L679,348L647,440L585,440ZM697,296L807,296L754,146L752,146L697,296Z" fill="currentColor"/>'],
  'flash_on': ['0 0 960 960', '<path d="M480,624L608,440L494,440L574,160L360,160L360,480L480,480L480,624ZM400,880L400,560L280,560L280,80L680,80L600,360L760,360L400,880ZM480,480L480,480L360,480L360,480L480,480L480,480L480,480L480,480Z" fill="currentColor"/>'],
  'flash_off': ['0 0 960 960', '<path d="M280,80L680,80L600,360L760,360L643,529L586,472L608,440L554,440L507,393L574,160L360,160L360,246L280,166L280,80ZM400,880L400,560L280,560L280,394L55,169L112,112L848,848L791,905L550,664L400,880ZM473,359L473,359L473,359L473,359L473,359L473,359L473,359L473,359Z" fill="currentColor"/>'],
  'location_on': ['0 0 24 24', '<path d="M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zM7,9c0,-2.76 2.24,-5 5,-5s5,2.24 5,5c0,2.88 -2.88,7.19 -5,9.88C9.92,16.21 7,11.85 7,9z" fill="currentColor"/><path d="M12,9m-2.5,0a2.5,2.5 0,1 1,5 0a2.5,2.5 0,1 1,-5 0" fill="currentColor"/>'],
};

const g = (name: string, size = 30, color = '#fff') => { const [vb, body] = GLYPHS[name]; return `<svg class="cg" width="${size}" height="${size}" viewBox="${vb}" style="color:${color}">${body}</svg>`; };
/** A control at (x, y) or right/bottom offsets, size w x h, with a squircle face and centred contents. */
const ctl = (pos: string, w: number, h: number, inner: string, o: Parameters<typeof face>[2] = {}, cls = '') =>
  `<span class="cc ${cls}" style="${pos};width:${w}px;height:${h}px">${face(w, h, o)}<span class="ci">${inner}</span></span>`;
const BOXA = `<span class="cbox">A</span>`;

const CAM_CSS = `<component is="style">
.cam { flex: 1; position: relative; overflow: hidden; background: radial-gradient(120% 70% at 30% 35%, #3A3A3A, #1C1C1C 55%, #0E0E0E), #111; }
.cam--warm { background: linear-gradient(170deg, #2A2622 0%, #4E4232 45%, #8A7458 70%, #A88E6A 100%); }
.cc { position: absolute; display: grid; place-items: center; color: #fff; }
.cc .cf { position: absolute; inset: 0; }
.cc .ci { position: relative; display: flex; align-items: center; gap: 17px; font: 700 22px/1 var(--hd-font-family-base); }
.ci > * { display: inline-grid; transition: transform .26s ease-in-out; }
.cbox { border: 2.5px solid #fff; border-radius: 2px; padding: 1px 3px; font: 700 14px/1 var(--hd-font-family-base); }
.cam-focus { position: absolute; left: 172px; top: 330px; width: 136px; height: 193px; --c: #fff;
  background: linear-gradient(var(--c),var(--c)) 0 0 / 19px 3px, linear-gradient(var(--c),var(--c)) 0 0 / 3px 19px, linear-gradient(var(--c),var(--c)) 100% 0 / 19px 3px, linear-gradient(var(--c),var(--c)) 100% 0 / 3px 19px,
    linear-gradient(var(--c),var(--c)) 0 100% / 19px 3px, linear-gradient(var(--c),var(--c)) 0 100% / 3px 19px, linear-gradient(var(--c),var(--c)) 100% 100% / 19px 3px, linear-gradient(var(--c),var(--c)) 100% 100% / 3px 19px; background-repeat: no-repeat; }
.cam-focus.locked { --c: #268CE1; }
.cam-strip { position: absolute; right: 18px; top: 95px; width: 59px; height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 8px 0; }
.cam-strip .cf { position: absolute; inset: 0; }
.cam-strip > span { position: relative; display: grid; place-items: center; height: 60px; }
.cam-rec { position: absolute; left: 16px; top: 16px; height: 30px; padding: 0 12px 0 10px; display: flex; align-items: center; gap: 9px; color: #fff; font: 400 19px/1 var(--hd-font-family-base); }
.cam-rec .cf { position: absolute; inset: 0; } .cam-rec > * { position: relative; } .cam-rec i { width: 11px; height: 11px; border-radius: 50%; background: #E0262A; }
.cam-card { flex: 1; display: flex; perspective: 1600px; } .cam-card > div { flex: 1; display: flex; position: relative; transform-style: preserve-3d; transition: transform .36s ease-in-out; }
.cam-card .cam { position: absolute; inset: 0; backface-visibility: hidden; } .cam-card .cam--back { transform: rotateY(180deg); }
.cam-card.is-video > div { transform: rotateY(180deg); }
@media (prefers-reduced-motion: reduce) { .cam-card > div { transition: none; } .cam-card .cam { transition: opacity .18s; } }
/* settings page */
.cs { flex: 1; padding: 0 16px; background: #000; color: #fff; overflow: hidden; position: relative; }
.cs-in { position: absolute; left: 16px; right: 16px; }
.cs h3 { margin: 14px 0 22px; font: 300 32px/1.1 var(--hd-font-family-light); }
.cs h4 { display: flex; align-items: center; gap: 44px; margin: 22px 0 18px; font: 700 15px/1 var(--hd-font-family-base); color: #8C8C8C; } .cs h4::after { content: ''; flex: 1; height: 1.5px; background: #3A3A3A; }
.cs-tiles { display: grid; grid-template-columns: repeat(3, 1fr); row-gap: 20px; text-align: center; font: 400 17px/1 var(--hd-font-family-base); color: #DDD; }
.cs-tiles > span { display: flex; flex-direction: column; align-items: center; gap: 12px; } .cs-tiles .t { position: relative; width: 62px; height: 62px; display: grid; place-items: center; } .cs-tiles .t .cf { position: absolute; inset: 0; } .cs-tiles .t .cg { position: relative; }
.cs-row { display: flex; align-items: center; gap: 16px; height: 80px; } .cs-row .t { position: relative; flex: none; width: 62px; height: 62px; display: grid; place-items: center; } .cs-row .t .cf { position: absolute; inset: 0; } .cs-row .t .cg { position: relative; }
.cs-row b { display: block; font: 700 26px/1.15 var(--hd-font-family-base); } .cs-row small { display: block; margin-top: 2px; font: 400 21px/1.1 var(--hd-font-family-base); color: #9A9A9A; }
.cs-seg { width: 320px; margin: 0 auto; border-radius: 12px; overflow: hidden; } .cs-seg span { display: grid; place-items: center; height: 50px; background: linear-gradient(#323232, #1C1C1C); border-top: 1px solid #000; font: 700 21px/1 var(--hd-font-family-base); }
.cs-seg span.on { background: #268CE1; } .cs-seg span:first-child { border-top: 0; }
.cs-hseg { display: flex; border-radius: 12px; overflow: hidden; } .cs-hseg span { flex: 1; display: grid; place-items: center; height: 48px; background: linear-gradient(#323232, #1C1C1C); border-left: 1px solid #000; font: 700 21px/1 var(--hd-font-family-base); } .cs-hseg span.on { background: #268CE1; } .cs-hseg span:first-child { border-left: 0; }
.cs-sw { display: flex; align-items: center; min-height: 64px; font: 700 26px/1.1 var(--hd-font-family-base); } .cs-sw > b { flex: 1; } .cs-sw .cg { margin-right: 26px; }
.cs-note { font: 400 21px/1.5 var(--hd-font-family-base); color: #EEE; margin: 0 0 10px; }
.cs-field { position: relative; height: 44px; display: flex; align-items: center; padding: 0 16px; font: 400 21px/1 var(--hd-font-family-base); color: #999; } .cs-field .cf { position: absolute; inset: 0; } .cs-field span { position: relative; }
.cs-lab { font: 400 20px/1 var(--hd-font-family-base); color: #9A9A9A; margin: 14px 0 10px; }
/* panels over the picture */
.cp { position: absolute; left: 0; right: 0; bottom: 0; padding: 12px 16px 14px; background: rgba(0,0,0,.5); color: #fff; }
.cp h4 { display: flex; align-items: center; gap: 44px; margin: 8px 0 16px; font: 700 15px/1 var(--hd-font-family-base); color: #9A9A9A; } .cp h4::after { content: ''; flex: 1; height: 1.5px; background: #6A6A6A; }
.cp .cs-tiles { color: #EEE; }
.cev { position: relative; height: 112px; font: 400 21px/1 var(--hd-font-family-base); }
.cev .lab { position: absolute; top: 4px; transform: translateX(-50%); } .cev .lab.on { color: #268CE1; }
.cev .tk { position: absolute; top: 34px; width: 1.5px; height: 10px; background: #fff; } .cev .tk.big { top: 30px; height: 14px; }
.cev .tr { position: absolute; left: 12px; right: 12px; top: 72px; height: 7px; border-radius: 4px; background: rgba(150,150,150,.6); } .cev .tr i { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 4px; background: #268CE1; }
.cev .hd { position: absolute; top: 56px; width: 40px; height: 40px; transform: translateX(-50%); } .cev .hd .cf { position: absolute; inset: 0; }
/* the dark toolbar, Back only */
.cam-tb { flex: none; height: 72px; display: flex; align-items: center; padding: 0 18px; background: linear-gradient(#141214, #070607); border-top: 1px solid #222; }
.cam-tb .cc { position: relative; }
</component>`;

const GRAD_BLUE: [string, string] = ['#3B9BEA', '#1678D2'];
const GRAD_TILE: [string, string] = ['#4A4A4A', '#262626'];
const camTb = `<div class="cam-tb">${ctl('', 52, 50, g('back', 30), { grad: ['#3A3A3A', '#1A1A1A'], rim: 'rgba(255,255,255,.18)' })}</div>`;
const camApp = (inner: string, extra = '') => `${CSS}${CAM_CSS}<div class="ap hd-squircle-free ap--dark ${extra}">${inner}</div>`;

/** The viewfinder, portrait, in N9 px: photo or video; flags for the strip, recording, blue focus. */
const viewfinder = (o: { video?: boolean; strip?: boolean; recording?: boolean; locked?: boolean; torch?: boolean; warm?: boolean; back?: boolean } = {}) => {
  const pill = o.video ? `<span class="cbox" style="font-size:15px;padding:2px 4px">HD</span>${BOXA}` : `${g('face', 30)}${BOXA}<span>7M</span>`;
  const flash = o.video ? g(o.torch ? 'torch_on' : 'torch_off', 30) : g(o.strip ? 'redeye' : 'flash_auto', 30);
  const rec = o.recording;
  return `<div class="cam ${o.warm ? 'cam--warm' : ''} ${o.back ? 'cam--back' : ''}">
    <span class="cam-focus ${o.locked ? 'locked' : ''}"></span>
    ${rec ? `<span class="cam-rec">${face(108, 30, { ends: true, fill: 'rgba(0,0,0,.45)' })}<i></i><span>00:03</span></span>` : ctl('left:16px;top:16px', 147, 47, pill, { ends: true })}
    ${rec ? '' : ctl('right:17px;top:17px', 59, 57, flash, o.strip ? { fill: '#3D8FE0', rim: '#3D8FE0' } : {})}
    ${o.strip ? `<span class="cam-strip">${face(59, 280, { ends: true, fill: 'rgba(150,150,150,.45)', rim: 'transparent' })}<span>${g('flash_auto', 30)}</span><span>${g('flash_on', 30)}</span><span>${g('flash_off', 30)}</span><span>${g('redeye', 30, '#268CE1')}</span></span>` : ''}
    ${rec ? '' : `<span class="cc" style="left:16px;bottom:32px;width:117px;height:57px">${face(117, 57, { ends: true })}<span class="ci" style="gap:12px;margin-left:6px">${o.video ? `<span style="position:relative;width:50px;height:50px;display:grid;place-items:center">${face(50, 50, { fill: '#fff', rim: '#fff' })}<span style="position:relative">${g('video', 30, '#000')}</span></span><span style="width:50px;display:grid;place-items:center">${g('camera', 30)}</span>` : `<span style="width:50px;display:grid;place-items:center">${g('video', 30)}</span><span style="position:relative;width:50px;height:50px;display:grid;place-items:center">${face(50, 50, { fill: '#fff', rim: '#fff' })}<span style="position:relative">${g('camera', 30, '#000')}</span></span>`}</span></span>`}
    ${ctl('left:197px;bottom:18px', 86, 88, g(o.video ? 'video' : 'camera', 38))}
    ${rec ? '' : ctl('right:17px;bottom:32px', 59, 58, g('gallery', 32))}
  </div>`;
};

export const Camera: S = {
  name: 'Camera',
  parameters: { docs: { description: { story: 'The viewfinder (n9vf-a): all picture, no toolbar, no status bar. Top left the strip pill (face detection, scene "A", 7M), top right the flash; bottom left the photo/video switch (the current one a white squircle inset), the **shutter** bottom centre (the largest control, 86 × 88), the gallery bottom right. Every control is a dark see-through **n = 2.8 squircle** with a thin light outline; the pills have squircle-half ends. Tapping the picture **focuses** (never shoots): the white brackets move there.' } } },
  render: () => ({ components: comps, template: camApp(viewfinder()) }),
};

export const CameraFocused: S = {
  name: 'Camera: focus locked',
  parameters: { docs: { description: { story: 'The brackets turn **blue** when the focus locks (n9vf-b).' } } },
  render: () => ({ components: comps, template: camApp(viewfinder({ locked: true })) }),
};

export const CameraFlash: S = {
  name: 'Camera: flash strip',
  parameters: { docs: { description: { story: 'Photo flash (n9fl-a): a tap turns the button **blue** (showing the current choice) and a see-through strip slides out along the long edge: Auto, On, Off, Red-eye reduction. The current choice is drawn blue, the others white, with no tile behind them. Picking one closes the strip. Rule: two values toggle straight from the button, three or more open a strip.' } } },
  render: () => ({ components: comps, template: camApp(viewfinder({ strip: true, warm: true })) }),
};

export const CameraVideo: S = {
  name: 'Camera: video',
  args: { torch: false },
  argTypes: { torch: { control: 'boolean' } },
  parameters: { docs: { description: { story: 'Video ready (n9vid-a, n9tor): the strip shows the quality (HD) and the scene, the shutter a video camera, the switch has video selected. The flash is a plain **torch toggle**: no menu, the button never turns blue, only its icon changes at once (a plain lamp off, with rays on).' } } },
  render: (args: { torch?: boolean }) => ({ components: comps, setup: () => ({ args }), template: `<div><div v-if="args.torch">${camApp(viewfinder({ video: true, torch: true, warm: true }))}</div><div v-else>${camApp(viewfinder({ video: true, warm: true }))}</div></div>` }),
} as S;

export const CameraRecording: S = {
  name: 'Camera: recording',
  parameters: { docs: { description: { story: 'Recording (n9vid-b): **everything hides except the shutter**; a small see-through pill with a red dot and the time sits in the strip\'s corner. The focus brackets stay (tap to focus still works). No pause button.' } } },
  render: () => ({ components: comps, template: camApp(viewfinder({ video: true, recording: true, warm: true })) }),
};

export const CameraFlip: S = {
  name: 'Camera: photo ↔ video',
  args: { video: false },
  argTypes: { video: { control: 'boolean' } },
  parameters: { docs: { description: { story: 'Toggle **video**: the whole screen turns over like a card in 3D, video on its back (rotateY with perspective; the camera changes over when the card is edge-on). With reduce motion it is a short crossfade instead.' } } },
  render: (args: { video?: boolean }) => ({ components: comps, setup: () => ({ args }), template: `${CSS}${CAM_CSS}<div class="ap hd-squircle-free ap--dark"><div class="cam-card" :class="{ 'is-video': args.video }"><div>${viewfinder()}${viewfinder({ video: true, back: true, warm: true })}</div></div></div>` }),
} as S;

const tilesHtml = (items: [string, string, boolean][], glass = false) => `<div class="cs-tiles">${items.map(([n, ic, on]) => `<span><span class="t">${face(62, 62, on ? { grad: GRAD_BLUE, rim: '#7FC0F6' } : glass ? { fill: 'rgba(255,255,255,.28)', rim: 'transparent' } : { grad: GRAD_TILE, rim: 'transparent' })}${g(ic, 34)}</span>${n}</span>`).join('')}</div>`;
const rowHtml = (ic: string, b: string, s: string) => `<div class="cs-row"><span class="t">${face(62, 62, { grad: GRAD_BLUE, rim: 'transparent' })}${g(ic, 36)}</span><span><b>${b}</b><small>${s}</small></span></div>`;
const segHtml = (items: string[], on = 0) => `<div class="cs-seg">${items.map((t, i) => `<span class="${i === on ? 'on' : ''}">${t}</span>`).join('')}</div>`;
const swHtml = (b: string, on: boolean, ic = '') => `<div class="cs-sw"><b>${b}</b>${ic ? g(ic, 30) : ''}<svg width="63" height="39" viewBox="0 0 63 39">${on ? '<defs><linearGradient id="swg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4195DE"/><stop offset="1" stop-color="#107DD6"/></linearGradient></defs>' : ''}<path d="${sqPath(63, 39, true)}" fill="${on ? 'url(#swg)' : '#2D2E2D'}"/><g transform="translate(${on ? 29 : 5},5)"><path d="${sqPath(29, 29)}" fill="#fff"/></g></svg></div>`;
const SCENES: [string, string, boolean][] = [['Automatic', 'scene_auto', true], ['Macro', 'scene_macro', false], ['Landscape', 'scene_landscape', false], ['Portrait', 'scene_portrait', false], ['Night', 'scene_night', false], ['Sports', 'scene_sports', false]];
const settingsPage = () => `<h3>Image capture settings</h3><h4>Scene</h4>${tilesHtml(SCENES)}<div style="height:16px"></div>
  ${rowHtml('wb_auto', 'White balance', 'Automatic')}${rowHtml('exposure', 'Exposure compensation', '0.0')}${rowHtml('filter_off', 'Colour filter', 'Off')}
  <h4>Self-timer</h4>${segHtml(['Disabled', '2 seconds', '10 seconds'])}
  <h4>Light sensitivity</h4>${segHtml(['Automatic', 'ISO 100', 'ISO 200', 'ISO 400', 'ISO 800'])}
  <h4>Aspect ratio</h4>${segHtml(['16:9', '4:3', '3:2'])}
  <h4>Resolution</h4>${segHtml(['High 7 Mpx', 'Medium 6 Mpx', 'Low 3 Mpx'])}
  <div style="height:8px"></div>${swHtml('Face detection', true, 'face')}${swHtml('Continuous shutter mode', false)}
  <p class="cs-note">In continuous shutter mode (until the capture button is released) several images are captured in quick sequence. Some camera settings and image resolutions are limited in continuous mode.</p>
  <h3 style="margin-top:22px">Camera settings</h3><h4>Show captured content</h4>${segHtml(['Disabled', '2 seconds', '5 seconds', 'No time-out'])}
  <div style="height:6px"></div>${swHtml('Show grid lines', false)}<div class="cs-lab">Creator name</div>
  <div class="cs-field">${face(448, 44, { ends: true, fill: '#E6E6E6', rim: '#B4B4B4' })}<span>Name or copyright</span></div>
  <div style="height:8px"></div>${swHtml('Use GPS', false, 'location_on')}
  <p class="cs-note">GPS coordinates will be attached to images and videos if GPS is available. If images or videos are shared, location data might be visible to third parties.</p>`;

export const CameraSettings: S = {
  name: 'Camera: settings',
  args: { scroll: 0 },
  argTypes: { scroll: { control: { type: 'range', min: 0, max: 1700, step: 50 } } },
  parameters: { docs: { description: { story: 'Opened from the strip pill (n9cam-0..6b). **Image capture settings** and later **Camera settings** in the large light style; section titles small bold grey with a rule. Scene: tiles 3 per row (the current one blue). White balance / Exposure compensation / Colour filter: blue icon rows with their value, each opening a panel over the live picture. Segmented groups stacked, centred, 320 of 480 wide, the selected one flat blue: Self-timer, Light sensitivity, Aspect ratio, Resolution. Switch rows (Face detection with its icon; Continuous shutter mode with its note), then Camera settings: Show captured content, Show grid lines, Creator name (a light squircle-half field), Use GPS with the privacy note. The dark toolbar has only Back. Use **scroll** to see the whole page.' } } },
  render: (args: { scroll?: number }) => ({ components: comps, setup: () => ({ args }), template: camApp(`<div class="cs"><div class="cs-in" :style="{ top: -(args.scroll || 0) + 'px' }">${settingsPage()}</div></div>${camTb}`) }),
} as S;

export const CameraSettingsLandscape: S = {
  name: 'Camera: settings, landscape',
  parameters: { docs: { description: { story: 'Landscape (n9cam-1, 4a-c, 5a-b): the scene tiles in one row, the icon rows in two columns, the segmented groups one full-width row of equal segments; switch rows full width.' } } },
  render: () => ({ components: comps, template: `${CSS}${CAM_CSS}<div class="ap hd-squircle-free ap--dark" style="width:854px;height:480px"><div class="cs"><div class="cs-in" style="top:0">
    <h3>Image capture settings</h3><h4>Scene</h4><div class="cs-tiles" style="grid-template-columns:repeat(6,1fr)">${tilesHtml(SCENES).replace('<div class="cs-tiles">', '').replace(/<\/div>$/, '')}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;margin-top:10px">${rowHtml('wb_auto', 'White balance', 'Automatic')}${rowHtml('exposure', 'Exposure compensation', '0.0')}${rowHtml('filter_off', 'Colour filter', 'Off')}</div>
    <h4>Self-timer</h4><div class="cs-hseg"><span class="on">Disabled</span><span>2 seconds</span><span>10 seconds</span></div></div></div>${camTb}</div>` }),
};

const panel = (inner: string) => camApp(`<div class="cam cam--warm"><div class="cp">${inner}</div></div>${camTb}`);
export const CameraWhiteBalance: S = {
  name: 'Camera: white balance panel',
  parameters: { docs: { description: { story: 'White balance (n9cam-7a): back on the **live picture** with a dark see-through panel at the bottom, above the Back bar: a small grey title with a rule and tiles in their see-through look (lighter grey over a picture; solid dark on the page), the current one blue.' } } },
  render: () => ({ components: comps, template: panel(`<h4>White balance</h4>${tilesHtml([['Automatic', 'wb_auto', true], ['Sunny', 'wb_sunny', false], ['Cloudy', 'wb_cloudy', false], ['Fluorescent', 'wb_fluorescent', false], ['Incandescent', 'wb_incandescent', false]], true)}`) }),
};
export const CameraExposure: S = {
  name: 'Camera: exposure panel',
  args: { ev: 0 },
  argTypes: { ev: { control: { type: 'range', min: -6, max: 6, step: 1 } } },
  parameters: { docs: { description: { story: 'Exposure compensation (n9cam-8a/b): a stepped slider, -2 -1 0 +1 +2 above, a tick every third of a step, the current label blue, the track blue up to the white squircle handle and grey after. **ev** is in thirds.' } } },
  render: (args: { ev?: number }) => ({ components: comps, setup: () => ({ args, x: (v: number) => 24 + ((v + 6) / 12) * 400 }), template: panel(`<h4>Exposure compensation</h4><div class="cev">
    <span v-for="v in [-6,-3,0,3,6]" :key="'l'+v" class="lab" :class="{ on: v === (args.ev || 0) }" :style="{ left: x(v) + 'px' }">{{ v === 0 ? '0' : (v > 0 ? '+' : '') + v / 3 }}</span>
    <span v-for="v in 13" :key="'t'+v" class="tk" :class="{ big: (v - 7) % 3 === 0 }" :style="{ left: x(v - 7) + 'px' }"></span>
    <span class="tr"><i :style="{ width: (x(args.ev || 0) - 12) + 'px' }"></i></span>
    <span class="hd" :style="{ left: x(args.ev || 0) + 'px' }">${face(40, 40, { fill: '#fff', rim: 'rgba(0,0,0,.2)' })}</span></div>`) }),
} as S;
export const CameraColourFilter: S = {
  name: 'Camera: colour filter panel',
  parameters: { docs: { description: { story: 'Colour filter (n9cam-9a/b): Off, Black & white, Sepia, Vivid, Negative, Solarise as see-through tiles over the live picture.' } } },
  render: () => ({ components: comps, template: panel(`<h4>Colour filter</h4>${tilesHtml([['Off', 'filter_off', true], ['Black &amp; white', 'filter_mono', false], ['Sepia', 'filter_sepia', false], ['Vivid', 'filter_posterize', false], ['Negative', 'filter_negative', false], ['Solarise', 'filter_solarise', false]], true)}`) }),
};

export const CameraTurned: S = {
  name: 'Camera: device turned',
  args: { turned: true },
  argTypes: { turned: { control: 'boolean' } },
  parameters: { docs: { description: { story: 'Toggle **turned** (n9vfl, n9fl-a): nothing moves relative to the device; only the icons and text inside each control turn a quarter, animated (260 ms), to read upright.' } } },
  render: (args: { turned?: boolean }) => ({ components: comps, setup: () => ({ args }), template: `${CSS}${CAM_CSS}<component is="style">.cam-r.is-turned .ci > *, .cam-r.is-turned .cam-strip > span > * { transform: rotate(90deg); }</component>
    <div class="ap hd-squircle-free ap--dark cam-r" :class="{ 'is-turned': args.turned }">${viewfinder()}</div>` }),
} as S;
