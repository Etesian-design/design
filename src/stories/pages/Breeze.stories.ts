import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HdIcon from '../../components/HdIcon.vue';
import HdSquircle from '../../components/HdSquircle.vue';

/* Etesian additions on the home screen and over apps, drawn from the phone (2026-11-19). None of these are N9: each
 * is off by default or optional (rule 19). Frame 360 × 640 (the phone at 1/4). */
const meta: Meta = {
  title: 'OS/Breeze, Widgets and Today',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: '**Breeze** is Etesian\'s side menu: a thick handle on one edge of the screen (clear of the curved edge\'s grip strip). A tap opens its menu, sliding out of Breeze\'s side, flush with it, its top level with it: a **strip of lit squircle buttons** (the user\'s: Back, Home, Open apps, the menu, a toggle, an app) and optional widgets (search). The screen behind dims and does not react: a tap outside only closes the menu. Held still, the handle picks up and drags: away from an edge it becomes a **floating button**, back at an edge a handle again. Every Breeze gesture vibrates. Hidden on the lock screen; light or dark.\n\nThe **Widgets** view holds Belle widgets in a column; long press is edit mode: each widget gets the red ✕ and three blue resize handles (the ✕ takes the fourth corner), with Done and Add widget at the bottom. The **Today** strip is an optional section at the top of Events.' } } },
};
// A phone screen (or part of one): centred, as big as itself.
meta.parameters = { ...meta.parameters, layout: 'centered' };
export default meta;
type S = StoryObj;

const CSS = `<component is="style">
.bz { width: 360px; height: 640px; position: relative; overflow: hidden; font-family: var(--hd-font-family-base); background: #000; color: #fff; }
.bz-app { position: absolute; inset: 0; padding: 26px 14px; }
.bz-app div { padding: 10px 0; } .bz-app b { display: block; font: 700 16px/1.2 var(--hd-font-family-base); } .bz-app small { color: #9A9A9A; font-size: 12px; }
.bz-dim { position: absolute; inset: 0; background: rgba(0,0,0,.55); }
.bz-handle { position: absolute; right: 2px; width: 14px; height: 76px; border-radius: 7px; background: linear-gradient(90deg, #EDEDED, #BDBDBD); box-shadow: 0 0 0 1px rgba(0,0,0,.4); }
.bz-menu { position: absolute; right: 22px; width: 206px; padding: 6px; border-radius: 12px; background: linear-gradient(#ECECEE, #C9C9CC); box-shadow: 0 4px 14px rgba(0,0,0,.6); }
.bz-strip { display: flex; justify-content: space-between; }
.bz-btn { width: 42px; height: 34px; border-radius: 11px; background: linear-gradient(#FFFFFF, #DCDCDF); box-shadow: inset 0 0 0 1px #A9A9AD, 0 1px 1px rgba(0,0,0,.2); display: grid; place-items: center; color: #222; }
.bz-search { margin-top: 6px; height: 24px; border-radius: 8px; background: #2A2A2A; color: #9A9A9A; display: flex; align-items: center; justify-content: space-between; padding: 0 8px; font-size: 11px; }
.bz-float { position: absolute; width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(#5A5A5E, #2A2A2E); box-shadow: inset 0 1px rgba(255,255,255,.3), 0 3px 8px rgba(0,0,0,.6); display: grid; place-items: center; }
/* widgets */
.wg { padding: 10px 8px; display: flex; flex-direction: column; gap: 8px; }
.wg-w { position: relative; border-radius: 10px; }
.wg-edit .wg-w { outline: 1px solid #3A8BE0; outline-offset: 1px; filter: brightness(.8); }
.wg-dot { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #2A86D8; border: 1.5px solid #fff; }
.wg-x { position: absolute; top: -5px; right: -5px; width: 17px; height: 17px; border-radius: 6px; background: linear-gradient(#F0504A, #C21A16); color: #fff; font: 700 11px/17px var(--hd-font-family-base); text-align: center; }
.wg-clock { height: 56px; display: flex; gap: 6px; } .wg-clock span:not([class]) { flex: 1; border-radius: 8px; background: linear-gradient(#3A3A3C, #111 50%, #2A2A2C 51%, #0A0A0A); display: grid; place-items: center; font: 700 26px/1 var(--hd-font-family-base); }
.wg-cal { height: 60px; background: linear-gradient(#F4F4F6, #DCDCE0); color: #222; text-align: center; font-size: 12px; } .wg-cal b { display: block; padding: 6px; border-bottom: 1px solid #BBB; font-weight: 400; }
.wg-notes { height: 110px; background: linear-gradient(#FBF3B8, #F2E68E); color: #333; padding: 8px; font-size: 12px; } .wg-notes b { display: block; font-size: 15px; margin-bottom: 6px; }
.wg-tg { height: 58px; background: #111; display: flex; justify-content: space-around; align-items: center; }
.wg-bar { position: absolute; left: 0; right: 0; bottom: 0; height: 40px; display: flex; gap: 6px; justify-content: center; align-items: center; background: linear-gradient(#1C1C1C, #000); border-top: 1px solid #333; }
.wg-btn { width: 102px; height: 22px; border-radius: 8px; background: linear-gradient(#3A3A3A, #151515); box-shadow: inset 0 1px rgba(255,255,255,.18); display: grid; place-items: center; font: 700 12px/1 var(--hd-font-family-base); }
/* events + today */
.ev-h { display: flex; justify-content: space-between; padding: 16px 12px 10px; } .ev-h b { font: 300 22px/1 var(--hd-font-family-light); } .ev-h small { display: block; margin-top: 4px; color: #9A9A9A; font-size: 11px; }
.ev-h span:last-child { text-align: right; font-size: 11px; } .ev-h i { font-style: normal; font: 300 18px/1.4 var(--hd-font-family-light); }
.ev-sec { display: flex; align-items: center; gap: 8px; padding: 8px 12px 4px; font: 700 11px/1 var(--hd-font-family-base); color: #A0A0A0; } .ev-sec::after { content: ''; flex: 1; height: 1px; background: #4A4A4A; }
.ev-today { display: flex; align-items: center; gap: 6px; padding: 3px 12px; font-size: 11.5px; color: #DDD; }
.ev-row { display: flex; gap: 10px; padding: 8px 12px; } .ev-row b { display: block; font: 700 13px/1.2 var(--hd-font-family-base); } .ev-row small { font-size: 11.5px; color: #BBB; }
</component>`;
const APP = `<div class="bz-app"><div><b>Network and Internet</b><small>Mobile, Wi-Fi, hotspot</small></div><div><b>Connected devices</b><small>Bluetooth, pairing</small></div><div><b>Apps</b><small>Recent apps, default apps</small></div><div><b>Notifications</b><small>History, conversations</small></div><div><b>Sound and vibration</b><small>Volume and vibration</small></div><div><b>Display</b><small>Font size, brightness</small></div></div>`;
const comps = { HdIcon, HdSquircle };

export const Handle: S = {
  name: 'Breeze: the handle',
  parameters: { docs: { description: { story: 'The handle on the right edge, over any app. Its size and side are the user\'s (it never covers more than a quarter of the screen).' } } },
  render: () => ({ components: comps, template: `${CSS}<div class="bz">${APP}<span class="bz-handle" style="top:290px"></span></div>` }),
};

export const Menu: S = {
  name: 'Breeze: the menu',
  parameters: { docs: { description: { story: 'Tap the handle: the menu slides out of Breeze\'s side, its top level with it, the screen behind dimmed and inactive. Buttons on one strip; a search widget under it.' } } },
  render: () => ({ components: comps, template: `${CSS}<div class="bz">${APP}<div class="bz-dim"></div><span class="bz-handle" style="top:290px"></span>
    <div class="bz-menu" style="top:290px"><div class="bz-strip"><span class="bz-btn"><HdIcon name="back" :size="18" /></span><span class="bz-btn"><HdIcon name="home" :size="18" /></span><span class="bz-btn"><HdIcon name="grid" :size="18" /></span><span class="bz-btn"><HdIcon name="more-vert" :size="18" /></span></div>
    <div class="bz-search">Search<HdIcon name="mic" :size="12" /></div></div></div>` }),
};

export const Floating: S = {
  name: 'Breeze: the floating button',
  parameters: { docs: { description: { story: 'Dragged away from the edge, Breeze is a floating lit squircle; dragged back to an edge it is the handle again.' } } },
  render: () => ({ components: comps, template: `${CSS}<div class="bz">${APP}<span class="bz-float" style="left:250px;top:420px"><HdIcon name="drag" :size="20" lit /></span></div>` }),
};

const widgets = (edit: boolean) => {
  const deco = edit ? '<span class="wg-x">✕</span><span class="wg-dot" style="left:-5px;top:-5px"></span><span class="wg-dot" style="left:-5px;bottom:-5px"></span><span class="wg-dot" style="right:-5px;bottom:-5px"></span>' : '';
  return `${CSS}<div class="bz"><div class="wg ${edit ? 'wg-edit' : ''}">
    <div class="wg-w wg-clock"><span>10</span><span>39</span>${deco}</div>
    <div class="wg-w wg-cal"><b>Today</b>No events for 7 days${deco}</div>
    <div class="wg-w wg-notes"><b>Notes</b>Tap + to write a note.${deco}</div>
    <div class="wg-w wg-tg">${['data', 'wifi', 'bluetooth', 'speaker'].map((i) => `<HdSquircle :size="34" color="#2E6FC0" lighting="lit"><HdIcon name="${i}" :size="18" lit /></HdSquircle>`).join('')}${deco}</div>
  </div>${edit ? '<div class="wg-bar"><span class="wg-btn">Done</span><span class="wg-btn">Add widget</span></div>' : ''}</div>`;
};
export const Widgets: S = { name: 'Widgets view', render: () => ({ components: comps, template: widgets(false) }) };
export const WidgetsEdit: S = {
  name: 'Widgets view: edit mode',
  parameters: { docs: { description: { story: 'Long press anywhere on the page: every widget is outlined, gets the red ✕ (top right) and blue resize handles on its other three corners; Done and Add widget at the bottom. Add widget opens the picker as an Etesian settings page, every app\'s widgets listed open.' } } },
  render: () => ({ components: comps, template: widgets(true) }),
};

export const Today: S = {
  name: 'Events: the Today strip',
  parameters: { docs: { description: { story: 'Optional, off by default: a **Today** section above Notifications with **one-line** items, each a lit squircle the size of the line: screen time, all-day events, birthdays, the next event. The user chooses the items.\n\n**On the phone:** Notifications\' Clear and Feed\'s Refresh are **outlined** pills; the N9\'s Refresh was a filled dark pill on the section line (rule: no outlined buttons).' } } },
  render: () => ({ components: comps, template: `${CSS}<div class="bz"><div class="ev-h"><span><b>Thursday</b><small>19 November</small></span><span>Athens<br><i>17°C</i></span></div>
    <div class="ev-sec">Today</div><div class="ev-today"><HdSquircle :size="14" color="#5C5C5C" lighting="lit"><HdIcon name="hourglass" :size="9" lit /></HdSquircle>1 h 6 min screen time · Glance 26 min</div>
    <div class="ev-today"><HdSquircle :size="14" color="#E8483F" lighting="lit"><HdIcon name="calendar" :size="9" lit /></HdSquircle>17:00 Dentist</div>
    <div class="ev-sec">Notifications</div><div class="ev-row"><HdSquircle :size="34" color="#09A7CC" lighting="lit"><HdIcon name="message" :size="20" lit /></HdSquircle><span><b>Anna</b><small>See you at seven by the lake</small></span></div></div>` }),
};
