import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HdIcon from '../../components/HdIcon.vue';
import HdSwitch from '../../components/HdSwitch.vue';

/* The standby screen: what an AMOLED N9 shows while locked. Drawn in N9 pixels (480 x 854) at css = n9px x 2/3, as the
 * System apps. Measured on the user's N9 with Billboard (2026-11-19): a battery glyph over a 104px light clock, then
 * the lines right-aligned to the clock's right edge, 20px regular type 33px apart, a 176 x 10 battery bar. */
const meta: Meta = {
  title: 'OS/Standby screen',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'The **standby screen**: when the device locks, an AMOLED screen does not go dark. It shows the **clock** and the **notification icons** in white on black, lit only where there is something to read, and the whole block **moves to a new place every minute** so no pixel stays lit. A tap or the power key wakes the device as usual.\n\nIts contents are the user\'s: **lines** built from items (the date, the song playing, battery, network, profile, uptime, memory, load, storage…) and their own words, with the colour, size and alignment, all set on one settings page with a live preview. With nothing added it is the N9\'s own: the clock, the date and the icons.' } } },
};
meta.parameters = { ...meta.parameters, layout: 'centered' };
export default meta;
type S = StoryObj;
const comps = { HdIcon, HdSwitch };

const CSS = `<component is="style">
.sb { width: 480px; height: 854px; zoom: .666667; position: relative; overflow: hidden; background: #000; color: #fff; font-family: var(--hd-font-family-base); }
.sb-block { position: absolute; display: flex; flex-direction: column; transition: left .4s, top .4s; }
.sb-block.r { align-items: flex-end; text-align: right; } .sb-block.c { align-items: center; text-align: center; } .sb-block.l { align-items: flex-start; }
.sb-bat { width: 32px; height: 22px; border: 2px solid currentColor; border-radius: 3px; position: relative; display: grid; place-items: center; font: 700 15px/1 sans-serif; margin: 0 6px 6px 0; }
.sb-bat::after { content: ''; position: absolute; right: -6px; top: 5px; width: 3px; height: 6px; background: currentColor; }
.sb-clock { font: 300 104px/1 var(--hd-font-family-light); letter-spacing: -1px; margin-bottom: 78px; }
.sb-line { font: 400 22px/33px var(--hd-font-family-base); white-space: pre; }
.sb-bar { width: 176px; height: 10px; box-sizing: border-box; border: 1px solid currentColor; margin: 12px 0 10px; position: relative; }
.sb-bar i { position: absolute; left: 0; top: 0; bottom: 0; background: currentColor; }
.sb-icons { display: flex; gap: 22px; margin-top: 30px; }
.sb-icons span { display: flex; align-items: center; gap: 6px; font: 400 22px/1 var(--hd-font-family-base); }
.sb-date { font: 400 22px/1 var(--hd-font-family-base); margin-top: -50px; }
/* settings */
.ss { width: 480px; height: 854px; zoom: .666667; display: flex; flex-direction: column; overflow: hidden; background: #000; color: #fff; font-family: var(--hd-font-family-base); }
.ss-sb { flex: none; height: 36px; display: flex; align-items: center; justify-content: flex-end; padding: 0 8px; font: 700 20px/1 var(--hd-font-family-base); color: #E6E2E6; }
.ss-body { flex: 1; overflow: hidden; padding: 0 16px; }
.ss h3 { margin: 18px 0 14px; font: 300 32px/1 var(--hd-font-family-light); }
.ss h4 { display: flex; align-items: center; gap: 12px; margin: 18px 0 8px; font: 700 17px/1 var(--hd-font-family-base); color: #8C8C8C; } .ss h4::after { content: ''; flex: 1; height: 1px; background: #3A3A3A; }
.ss-prev { position: relative; height: 270px; border-radius: 14px; background: #000; box-shadow: inset 0 0 0 1px #2E2E2E; overflow: hidden; }
.ss-prev .sb-block { zoom: .55; }
.ss-row { display: flex; align-items: center; gap: 12px; min-height: 64px; border-bottom: 1px solid #1E1E1E; }
.ss-row > b { flex: 1; font: 700 24px/1.2 var(--hd-font-family-base); }
.ss-chips { flex: 1; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 10px 0; font: 400 20px/1 var(--hd-font-family-base); color: #DDD; }
.ss-chip { padding: 7px 12px; background: linear-gradient(#2F6FB8, #1F5A9E); color: #fff; }
.ss-chips .ss-if { color: #8C8C8C; font-size: 17px; }
.ss-sw { width: 66px; height: 41px; position: relative; background: linear-gradient(#4195DE, #1280D8); }
.ss-sw::after { content: ''; position: absolute; right: 5px; top: 5px; width: 30px; height: 30px; background: #fff; }
.ss-seg { display: flex; } .ss-seg span { flex: 1; text-align: center; padding: 12px 0; background: linear-gradient(#3A3A3A, #1E1E1E); border-left: 1px solid #000; font: 700 20px/1 var(--hd-font-family-base); } .ss-seg span.on { background: #268CE1; }
.ss-col { display: flex; gap: 14px; padding: 10px 0; } .ss-col i { width: 40px; height: 40px; display: block; box-shadow: inset 0 0 0 1px #444; } .ss-col i.on { box-shadow: 0 0 0 3px #268CE1; }
.ss-tb { flex: none; height: 72px; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; color: #fff; background: linear-gradient(#5A5A5A 0 1px, #3A3A3A 1px, #1C1C1C); }
.ss-chev { color: #8C8C8C; font: 700 28px/1 var(--hd-font-family-base); }
</component>`;

/** The user's Billboard on their N9, measured: right-aligned at x = 344 (of 480), the clock's top at 190. */
const BILLBOARD = (left: number, top: number, color = '#fff') => `<div class="sb-block r" style="left:${left}px;top:${top}px;color:${color}">
  <span class="sb-bat">✓</span><span class="sb-clock">20:56</span>
  <span class="sb-line">Thursday, 19 November 2026</span><span class="sb-line">192.168.1.217</span><span class="sb-line">Battery: 98%</span>
  <span class="sb-bar"><i style="width:98%"></i></span><span class="sb-line">No media</span></div>`;

export const Billboard: S = {
  name: 'With the user\'s lines (Billboard)',
  parameters: { docs: { description: { story: 'The user\'s setup from their N9, rebuilt with Etesian\'s items: the battery over the clock, then **Full date**, **IP address**, "Battery: " **Battery %** "%", **Battery bar**, and **Artist – Title** with "No media" when nothing plays. Right-aligned, white, 22px. (Their weather block came from MeeCast, a separate app; Etesian has no weather source, so it is not an item.)' } } },
  render: () => ({ components: comps, template: `${CSS}<div class="sb">${BILLBOARD(20, 150)}</div>` }),
};

export const Classic: S = {
  name: 'The N9\'s own (nothing added)',
  parameters: { docs: { description: { story: 'With no lines added it is the N9\'s standby: the clock, the date under it, and the **notification icons** with their counts (missed calls, messages, email, anything else that notifies), centred.' } } },
  render: () => ({ components: comps, template: `${CSS}<div class="sb"><div class="sb-block c" style="left:0;right:0;top:250px">
    <span class="sb-clock">20:56</span><span class="sb-date">Thu 19 Nov</span>
    <span class="sb-icons"><span><HdIcon name="phone" :size="26" />2</span><span><HdIcon name="message" :size="26" />5</span><span><HdIcon name="mail" :size="26" />12</span></span></div></div>` }),
};

export const Moved: S = {
  name: 'Every minute, a new place',
  args: { minute: 1 },
  argTypes: { minute: { control: { type: 'range', min: 0, max: 5 } } },
  parameters: { docs: { description: { story: 'Each minute the whole block moves to a new place anywhere on the screen (never off it; the N9 jumped as far, every five minutes), so no pixel stays lit for long. The lines never change order or alignment; only the block moves.' } } },
  render: (a: { minute?: number }) => ({ components: comps, setup: () => ({ a }), template: `${CSS}<div class="sb">${BILLBOARD(0, 0)
    .replace('style="left:0px;top:0px;color:#fff"', ':style="{ left: [20, 104, 52, 130, 8, 76][a.minute ?? 0] + \'px\', top: [150, 344, 412, 40, 300, 210][a.minute ?? 0] + \'px\' }"')}</div>` }),
} as S;

export const Settings: S = {
  name: 'Settings',
  parameters: { docs: { description: { story: 'One page, Etesian settings → Standby screen. **Preview first** (rule 20), live. Then the **lines**: each a row of items (blue) and the user\'s own words between them; tap a line to add items from a selection sheet or type text; **long press** for edit mode (reorder, ✕ to remove); **+** on the toolbar adds a line. A line can say what to show **when its items are empty** ("No media"), or hide. **Presets** fill the lines in one tap (The N9, Billboard, Everything). Then **Appearance**: colour, size, alignment, and whether the clock, the battery glyph and the notification icons show. Every item: Time, Compact date, Full date, Song artist, Song title, Artist – Title, Network, Connection, IP address, Battery %, Battery bar, Battery state, Profile, Uptime, Memory used, System load, Storage used, Next alarm, Notifications.' } } },
  render: () => ({ components: comps, template: `${CSS}<div class="ss"><div class="ss-sb">20:56</div><div class="ss-body">
    <h3>Standby screen</h3>
    <div class="ss-row"><b>On while locked</b><HdSwitch :model-value="true" aria-label="On while locked" /></div>
    <h4>Preview</h4><div class="ss-prev">${BILLBOARD(130, 10)}</div>
    <h4>Lines</h4>
    <div class="ss-row"><span class="ss-chips"><span class="ss-chip hd-sqm">Full date</span></span><span class="ss-chev">›</span></div>
    <div class="ss-row"><span class="ss-chips"><span class="ss-chip hd-sqm">IP address</span></span><span class="ss-chev">›</span></div>
    <div class="ss-row"><span class="ss-chips">Battery: <span class="ss-chip hd-sqm">Battery %</span>%</span><span class="ss-chev">›</span></div>
    <div class="ss-row"><span class="ss-chips"><span class="ss-chip hd-sqm">Artist – Title</span><span class="ss-if">empty: “No media”</span></span><span class="ss-chev">›</span></div>
    <h4>Appearance</h4>
    <div class="ss-col">${['#fff', '#3D9BF0', '#33C46B', '#F2A33A', '#E5484D'].map((c, i) => `<i class="hd-squircle ${i ? '' : 'on'}" style="background:${c}"></i>`).join('')}</div>
    <div class="ss-seg"><span>Left</span><span>Centre</span><span class="on">Right</span></div>
  </div><div class="ss-tb"><HdIcon name="back" :size="36" /><HdIcon name="add" :size="36" /><HdIcon name="menu" :size="36" /></div></div>` }),
};
