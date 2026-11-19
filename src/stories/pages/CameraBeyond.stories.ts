import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HdIcon from '../../components/HdIcon.vue';
import HdTabBar from '../../components/HdTabBar.vue';

/* 2026-11-19 (user): "Camera is a bit weird because we need to think about features that didn't exist in the N9 and how
 * we can introduce them in the same UI." Proposals, each kept inside the N9's four controls and its settings columns.
 * Where there is a real choice the alternatives are separate stories (A / B) for the owner to pick. Frame 360 x 640. */
const meta: Meta = {
  title: 'OS/Camera: beyond the N9',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'How a modern camera\'s features fit the N9 camera without adding chrome. The rules: **the picture stays the shutter**; the N9\'s four controls stay where they are (gallery, front/back, mode switch, settings strip); anything new is either a **gesture with a readout**, a **segment in the mode switch**, a **column in the settings**, or a **card that appears only when it has something to say**. The settings strip shows a value only when it differs from the default, so it grows only when the user changes things. Turning the device rotates only the contents of the controls (as the N9).' } } },
};
export default meta;
type S = StoryObj;

const CSS = `<component is="style">
.cb { width: 360px; height: 640px; position: relative; overflow: hidden; background: linear-gradient(160deg, #2B3540, #46505A 40%, #1E2226); color: #fff; font-family: var(--hd-font-family-base); }
.cb-top { position: absolute; top: 12px; left: 10px; right: 10px; display: flex; justify-content: space-between; align-items: center; }
.cb-btn { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; background: rgba(0,0,0,.6); box-shadow: inset 0 0 0 1px rgba(255,255,255,.4); }
.cb-btn--big { width: 52px; height: 44px; border-radius: 14px; }
.cb-strip { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); height: 30px; border-radius: 10px; display: flex; gap: 12px; align-items: center; padding: 0 12px; background: rgba(0,0,0,.6); box-shadow: inset 0 0 0 1px rgba(255,255,255,.4); font: 700 11px/1 var(--hd-font-family-base); white-space: nowrap; }
.cb-read { position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%); padding: 6px 12px; border-radius: 10px; background: rgba(0,0,0,.6); font: 300 22px/1 var(--hd-font-family-light); }
.cb-card { position: absolute; left: 14px; right: 14px; bottom: 58px; border-radius: 12px; background: rgba(20,20,20,.9); box-shadow: inset 0 0 0 1px rgba(255,255,255,.25); padding: 10px 12px; display: flex; gap: 10px; align-items: center; font-size: 13px; }
.cb-card b { display: block; font-size: 14px; } .cb-card small { color: #BDBDBD; }
.cb-card .go { margin-left: auto; padding: 6px 12px; border-radius: 9px; background: linear-gradient(#3A3A3A, #151515); box-shadow: inset 0 1px rgba(255,255,255,.18); font-weight: 700; }
.cb-rec { display: flex; align-items: center; gap: 6px; height: 30px; padding: 0 10px; border-radius: 10px; background: rgba(0,0,0,.6); font: 700 13px/1 var(--hd-font-family-base); }
.cb-rec i { width: 10px; height: 10px; border-radius: 50%; background: #E53935; }
.cb-qr { position: absolute; left: 50%; top: 40%; width: 120px; height: 120px; transform: translate(-50%, -50%); border: 2px solid #F2C200; border-radius: 12px; }
.cb-cols { position: absolute; inset: 0; display: flex; gap: 12px; padding: 14px 10px; background: #000; }
.cb-col { display: flex; gap: 6px; } .cb-col h4 { margin: 0; font: 700 10px/1 var(--hd-font-family-base); color: #8C8C8C; writing-mode: vertical-rl; transform: rotate(180deg); }
.cb-seg { width: 38px; display: flex; flex-direction: column; border-radius: 9px; overflow: hidden; gap: 1px; background: #111; }
.cb-seg span { flex: 1; display: grid; place-items: center; background: linear-gradient(90deg, #434343, #181818); font: 700 13px/1 var(--hd-font-family-base); writing-mode: vertical-rl; transform: rotate(180deg); }
.cb-seg span + span { box-shadow: inset 0 -1px 0 rgba(255,255,255,.14); } .cb-seg span.on { background: #268CE1; box-shadow: none; }
.cb-new { outline: 2px dashed #F2C200; outline-offset: 3px; }
</component>`;
const comps = { HdIcon, HdTabBar };
const MODES2 = `[{ id: 'photo', label: 'Photo', icon: 'camera' }, { id: 'video', label: 'Video', icon: 'record' }]`;
const top = (mode = 'photo', tabs = MODES2, centre = '<span class="cb-btn cb-btn--big" aria-label="Front camera"><HdIcon name="camera" :size="20" /></span>') =>
  `<div class="cb-top"><span class="cb-btn" aria-label="Gallery"><HdIcon name="photo" :size="18" /></span>${centre}<HdTabBar variant="overlay" label="Mode" model-value="${mode}" :tabs="${tabs.replace(/"/g, "'")}" /></div>`;
const strip = (items = '<span>8M</span><span>⚡A</span>') => `<span class="cb-strip" aria-label="Settings">${items}</span>`;
const story = (name: string, text: string, inner: string): S => ({ name, parameters: { docs: { description: { story: text } } }, render: () => ({ components: comps, template: `${CSS}<div class="cb">${inner}</div>` }) });

export const Zoom = story('Zoom: a gesture with a readout',
  'Pinch, or the volume keys (the N9 zoomed with them). While zooming, the level is shown in the middle and fades a second after; the lenses (0.6×, 1×, 2×, 5×) are steps the zoom passes through, not chips on screen. **Nothing is added at rest.**',
  `${top()}<span class="cb-read">2.0×</span>${strip()}`);

export const ModesA = story('More modes, A: segments in the mode switch',
  '**A.** Night, Portrait and Scan become segments of the mode switch, after Photo and Video; each can be turned off in settings, so a user who wants the N9 keeps two. The switch stays one control in the same place; the new segments are outlined in yellow here only to point them out.',
  `${top('photo', `[{ id: 'photo', label: 'Photo', icon: 'camera' }, { id: 'video', label: 'Video', icon: 'record' }, { id: 'night', label: 'Night', icon: 'moon' }, { id: 'scan', label: 'Scan', icon: 'qr' }]`)}${strip()}`);

export const ModesB = story('More modes, B: a column in the settings',
  '**B.** The switch stays the N9\'s photo/video; Night and Portrait are a **Mode** column in the settings (one more segmented column, as Light sensitivity), and the strip shows the mode when it is not Normal. Fewer controls on the picture; one more tap to change.',
  `<div class="cb-cols">${[['Mode', ['Normal', 'Night', 'Portrait'], 0], ['Light sensitivity', ['Automatic', 'ISO 100', 'ISO 200', 'ISO 400'], 0], ['Aspect ratio', ['16:9', '4:3'], 1], ['Timer', ['Off', '3 s', '10 s'], 0]].map(([h, o, on], i) => `<div class="cb-col ${i === 0 ? 'cb-new' : ''}"><h4>${h}</h4><div class="cb-seg">${(o as string[]).slice().reverse().map((x, j, a) => `<span class="${a.length - 1 - j === on ? 'on' : ''}">${x}</span>`).join('')}</div></div>`).join('')}</div>`);

export const Qr = story('QR codes: a card when one is seen',
  'No Scan mode is needed: in Photo, a code in view gets a yellow frame and a card above the strip says what it is, with one action. The card goes when the code leaves the picture; a tap on the picture still takes the photo.',
  `${top()}<span class="cb-qr"></span><div class="cb-card"><HdIcon name="globe" :size="22" /><span><b>example.org</b><small>Web address</small></span><span class="go">Open</span></div>${strip()}`);

export const Settings = story('Timer, grid, HDR: columns, shown in the strip only when changed',
  'Every new setting is a column in the settings (Timer, Grid, HDR, Video quality, Frame rate, Microphone), the N9\'s way. The strip at the bottom is a **summary**: it shows only what differs from the default, so at rest it is short (here: 8M, flash auto, timer 3 s, grid).',
  `${top()}${strip('<span>8M</span><span>⚡A</span><span class="cb-new">⏱ 3 s</span><span class="cb-new">#</span>')}`);

export const Recording = story('Recording video',
  'In Video, a tap on the picture starts and stops recording (as the N9). While recording, the centre control becomes the red dot and the time (the one red dot for recording, rule 21), and the gallery button becomes **Pause**, a new action in an existing place.',
  `${top('video', MODES2, '<span class="cb-rec" aria-label="Recording, 00:42"><i></i>00:42</span>').replace('aria-label="Gallery"><HdIcon name="photo"', 'aria-label="Pause"><HdIcon name="pause"')}${strip('<span>1080p</span><span>30</span>')}`);
