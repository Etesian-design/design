import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HdToolBar from '../../components/HdToolBar.vue';
import HdToolIcon from '../../components/HdToolIcon.vue';
import HdIcon from '../../components/HdIcon.vue';

/* The N9's own apps, drawn from screenshots of a real N9 (PR1.0, 2011) at 480 × 854 n9px, shown here at 0.75 →
 * 360 × 640. Photos and album art are gradients standing in for pictures; names are samples. Where the phone (the
 * LineageOS port) still differs, the story says so ("On the phone"). */
const meta: Meta = {
  title: 'Examples/System apps (N9)',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'The system apps as the N9 drew them: what every Etesian port of them aims for. **Dark apps** (Phone\'s dial pad header, Calculator, Camera, Gallery, Music) sit on black; **content apps** (Contacts, Calendar, Clock, Documents, Notes) are light grey with a coloured title bar or none. Every action is on the bottom toolbar; a few apps (Phone, Calendar) use it as **tabs**, the current one a lighter cell. Each story notes where the phone still differs.' } } },
};
export default meta;
type S = StoryObj;
const comps = { HdToolBar, HdToolIcon, HdIcon };

const CSS = `<component is="style">
.ap { width: 360px; height: 640px; display: flex; flex-direction: column; overflow: hidden; font-family: var(--hd-font-family-base); position: relative; }
.ap--light { background: #E3E6EA; color: #191919; } .ap--dark { background: #000; color: #fff; }
.ap-body { flex: 1; min-height: 0; overflow: hidden; position: relative; }
.ap-title { flex: none; height: 48px; display: flex; align-items: center; padding: 0 12px; font: 300 22px/1 var(--hd-font-family-light); color: #fff; }
.ap-plain { flex: none; padding: 14px 12px 8px; font: 300 22px/1 var(--hd-font-family-light); }
.ap-field { margin: 8px 8px; height: 30px; display: flex; align-items: center; padding: 0 8px; border-radius: 9px; background: #fff; box-shadow: inset 0 1px 2px rgba(0,0,0,.35); color: #9A9A9A; font-size: 15px; justify-content: space-between; }
.ap-group { display: flex; align-items: center; gap: 10px; padding: 8px 12px 2px; font: 700 11px/1 var(--hd-font-family-base); color: #8C8C8C; }
.ap-group::before { content: ''; flex: 1; height: 1px; background: #C8C8C8; } .ap--dark .ap-group::before { background: #4A4A4A; }
.ap-row { display: flex; align-items: center; gap: 12px; min-height: 52px; padding: 0 12px; }
.ap-row > .ap-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.ap-row b { font: 700 17px/1.15 var(--hd-font-family-base); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ap-row small { font-size: 13px; color: #6E6E6E; } .ap--dark .ap-row small { color: #A0A0A0; }
.ap-av { flex: none; width: 34px; height: 34px; border-radius: 10px; }
.ap-tabs { flex: none; display: flex; height: 44px; background: linear-gradient(#E9E9EB, #B9B9BC); border-top: 1px solid #8E8E92; }
.ap-tabs > span { flex: 1; display: grid; place-items: center; color: #222; } .ap-tabs > span.on { background: linear-gradient(#F4F4F6, #D6D6D9); }
/* phone */
.ph-head { flex: none; height: 103px; background: linear-gradient(#2A2A2A, #111); color: #fff; padding: 0 8px; }
.ph-sel { display: flex; justify-content: space-between; align-items: center; height: 40px; font: 300 19px/1 var(--hd-font-family-light); border-bottom: 1px solid #4A4A4A; }
.ph-num { display: flex; justify-content: flex-end; align-items: center; gap: 16px; height: 60px; font: 300 48px/1 var(--hd-font-family-light); }
.ph-num span:first-child { color: #9A9A9A; } .ph-num i { font-style: normal; font-size: 18px; color: #9A9A9A; }
.ph-pad { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); align-content: space-evenly; background: linear-gradient(#D6D7DA, #C7C8CC); color: #2A2A2A; }
.ph-pad > span { height: 48px; display: flex; flex-direction: column; align-items: center; justify-content: center; font: 700 28px/1 var(--hd-font-family-base); }
.ph-pad small { font: 400 10px/1.2 var(--hd-font-family-base); color: #555; }
.ph-act { flex: none; display: flex; align-items: center; justify-content: space-between; padding: 6px 28px 10px; background: #C7C8CC; }
.ph-call { width: 100px; height: 28px; border-radius: 14px; background: linear-gradient(#7CC24A, #4E9A22); display: grid; place-items: center; color: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.4); }
.ph-add { width: 30px; height: 30px; border-radius: 9px; background: linear-gradient(#9A9A9E, #6E6E72); display: grid; place-items: center; color: #fff; }
/* contacts editor */
.ce-bar { flex: none; height: 46px; display: flex; justify-content: space-between; align-items: center; padding: 0 8px; background: linear-gradient(#EEEDEF, #E2E0E4); border-bottom: 1px solid #C8C6CA; }
.ap-pill { min-width: 74px; height: 22px; padding: 0 10px; border-radius: 11px; display: grid; place-items: center; font: 700 13px/1 var(--hd-font-family-base); }
.ap-pill--grey { background: linear-gradient(#FFFFFF, #DDDDE0); color: #111; box-shadow: inset 0 0 0 1px #B5B4B8; }
.ap-pill--blue { background: linear-gradient(#8BC0EC, #6AA6DC); color: #fff; } .ap-pill--orange { background: linear-gradient(#F7A21B, #E07B00); color: #fff; }
.ce-f { padding: 5px 8px; font-size: 15px; color: #444; } .ce-f u { color: #5A5A5A; } .ce-f b { color: #111; } .ce-f i { font-style: normal; color: #A8A8A8; }
/* calculator */
.ca-out { flex: none; display: flex; justify-content: flex-end; align-items: center; gap: 14px; height: 90px; padding: 0 22px; font: 300 46px/1 var(--hd-font-family-light); color: #F28C00; border-bottom: 1px solid #333; margin: 0 22px; }
.ca-keys { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); align-content: space-evenly; padding: 6px 12px 12px; font: 300 30px/1 var(--hd-font-family-light); }
.ca-keys span { display: grid; place-items: center; height: 44px; } .ca-keys .op { color: #BDBDBD; } .ca-keys .eq { color: #F28C00; }
/* clock */
.cl-face { flex: none; height: 240px; display: grid; place-items: center; background: #EFEFF1; border-bottom: 2px solid #C8C8CC; position: relative; }
.cl-tz { position: absolute; top: 12px; font-size: 11px; color: #777; }
.cl-dial { width: 172px; height: 172px; border-radius: 50%; background: radial-gradient(circle at 50% 35%, #F2F2F2, #D2D2D4); box-shadow: inset 0 0 0 2px #C0C0C2, 0 2px 6px rgba(0,0,0,.25); position: relative; }
.cl-dial i { position: absolute; left: 50%; top: 50%; transform-origin: 0 50%; height: 6px; border-radius: 3px; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.35); }
.cl-dial .h { width: 56px; transform: rotate(-120deg); } .cl-dial .m { width: 70px; transform: rotate(-105deg); } .cl-dial .s { width: 80px; height: 1px; background: #F05A00; transform: rotate(180deg); box-shadow: none; }
.cl-date { position: absolute; left: 14px; top: 76px; font-size: 11px; color: #555; } .cl-date b { display: block; font: 300 22px/1 var(--hd-font-family-light); color: #222; }
.ap-head2 { display: flex; justify-content: space-between; align-items: center; padding: 14px 12px 6px; font: 300 20px/1 var(--hd-font-family-light); }
.ap-plus { width: 22px; height: 22px; border-radius: 7px; background: linear-gradient(#fff, #E2E2E4); box-shadow: 0 1px 2px rgba(0,0,0,.3); display: grid; place-items: center; font-weight: 700; }
.ap-sw { flex: none; width: 34px; height: 20px; border-radius: 7px; background: linear-gradient(#C9C9CC, #E2E2E4); box-shadow: inset 0 1px 2px rgba(0,0,0,.35); position: relative; }
.ap-sw::after { content: ''; position: absolute; left: 2px; top: 2px; width: 16px; height: 16px; border-radius: 5px; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.4); }
.ap-sw.on { background: #1E7FD6; } .ap-sw.on::after { left: 16px; }
.ap-chev { font: 700 17px/1 var(--hd-font-family-base); }
.al-time { text-align: center; font: 300 30px/1 var(--hd-font-family-light); margin: 10px 0; }
.al-wheel { margin: 6px auto; width: 186px; height: 186px; border-radius: 50%; background: radial-gradient(circle, #DADADC, #B8B8BB); display: grid; place-items: center; position: relative; box-shadow: inset 0 0 0 2px #fff; }
.al-wheel::before { content: ''; width: 102px; height: 102px; border-radius: 50%; background: radial-gradient(circle at 50% 35%, #333, #111); }
.al-knob { position: absolute; width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; font-size: 14px; }
/* calendar */
.cm { flex: none; background: linear-gradient(#F4F4F6, #E3E3E6); border-bottom: 2px solid #C8C8CC; padding-bottom: 4px; }
.cm-h { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px 6px; font: 300 20px/1 var(--hd-font-family-light); } .cm-h i { color: #E86A0C; font-style: normal; font-size: 13px; }
.cm-g { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 13px; }
.cm-g .d { font: 700 9px/1 var(--hd-font-family-base); color: #555; padding-bottom: 6px; } .cm-g .we { color: #E86A0C; }
.cm-g span { height: 27px; display: grid; place-items: center; } .cm-g .o { color: #9A9A9A; }
.cm-g .t { margin: auto; width: 24px; height: 24px; border-radius: 8px; background: linear-gradient(#F59A4A, #E0640A); color: #fff; font-weight: 700; }
.cw-h { flex: none; height: 16px; background: #3A3A3A; color: #fff; font: 700 10px/16px var(--hd-font-family-base); text-align: center; border-bottom: 2px solid #E86A0C; }
.cw-day { flex: none; padding: 4px 0 4px 44px; font: 300 16px/1 var(--hd-font-family-light); background: #F4F4F6; }
.cw-row { display: flex; height: 32px; border-top: 1px solid #fff; } .cw-row > span { width: 40px; font-size: 10px; color: #555; padding: 3px; background: #EDEDF0; }
.cw-row > i { flex: 1; background: #D2D3D6; font-style: normal; } .cw-row > i.ev { background: #2A7AD6; color: #fff; font: 700 10px/1 var(--hd-font-family-base); padding: 4px; }
.cw-row.now > * { background: #E8E0D6; } .cw-row.now > span { box-shadow: inset 3px 0 #E86A0C; }
/* gallery, music, camera */
.ga-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
.ga-grid i { aspect-ratio: 1; display: block; }
.ga-bar { position: absolute; left: 0; right: 0; bottom: 0; height: 40px; display: flex; align-items: center; justify-content: space-between; padding: 0 10px 0 40px; background: rgba(0,0,0,.6); }
.ga-sel { width: 140px; height: 24px; border-radius: 8px; background: rgba(60,60,60,.85); display: flex; justify-content: space-between; align-items: center; padding: 0 10px; font: 700 13px/1 var(--hd-font-family-base); }
.ga-info { position: absolute; left: 0; right: 0; top: 0; padding: 8px 8px 10px; background: rgba(40,40,40,.85); }
.ga-info b { font: 700 16px/1.2 var(--hd-font-family-base); } .ga-info div { display: flex; justify-content: space-between; font-size: 12px; color: #ccc; margin-top: 6px; }
.mu-row { display: flex; justify-content: space-between; align-items: center; height: 34px; padding: 0 10px; font: 700 15px/1 var(--hd-font-family-base); }
.mu-now { padding: 10px; } .mu-now b { font: 700 13px/1 var(--hd-font-family-base); display: flex; justify-content: space-between; } .mu-now p { margin: 10px 0 0; font-size: 12px; color: #ccc; line-height: 1.3; }
.mu-ctl { display: flex; justify-content: space-between; align-items: center; padding: 16px 12px 10px; font-size: 18px; }
.mu-prog { margin: 6px 12px 0; height: 4px; border-radius: 2px; background: #333; position: relative; } .mu-prog::before { content: ''; position: absolute; left: 0; top: 0; height: 4px; width: 3%; background: #C4008F; border-radius: 2px; }
.mu-t { display: flex; justify-content: space-between; padding: 6px 12px; font-size: 10px; color: #aaa; }
.cam-top { position: absolute; top: 10px; left: 8px; right: 8px; display: flex; justify-content: space-between; align-items: center; }
.cam-btn { height: 26px; border-radius: 9px; border: 1px solid #555; display: flex; align-items: center; gap: 6px; padding: 0 6px; font-size: 12px; }
.cam-btn > span { width: 18px; height: 18px; border-radius: 6px; display: grid; place-items: center; } .cam-btn > span.on { background: #fff; color: #000; }
.cam-focus { position: absolute; left: 50%; top: 50%; width: 64px; height: 92px; transform: translate(-50%, -50%); border: 1px solid #fff; clip-path: polygon(0 0, 22% 0, 22% 2%, 2% 2%, 2% 16%, 0 16%, 0 84%, 2% 84%, 2% 98%, 22% 98%, 22% 100%, 78% 100%, 78% 98%, 98% 98%, 98% 84%, 100% 84%, 100% 16%, 98% 16%, 98% 2%, 78% 2%, 78% 0, 100% 0, 100% 100%, 0 100%); }
.cam-ind { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); height: 22px; border-radius: 8px; border: 1px solid #555; display: flex; gap: 10px; align-items: center; padding: 0 10px; font: 700 10px/1 var(--hd-font-family-base); }
.cs { display: flex; gap: 10px; padding: 14px 8px; height: 100%; box-sizing: border-box; }
.cs-col { display: flex; flex-direction: column; gap: 6px; width: 54px; } .cs-col h4 { margin: 0; font: 400 10px/1 var(--hd-font-family-base); color: #999; writing-mode: vertical-rl; transform: rotate(180deg); }
.cs-seg { flex: 1; display: flex; flex-direction: column; border-radius: 9px; overflow: hidden; }
.cs-seg span { flex: 1; display: grid; place-items: center; background: linear-gradient(90deg, #3A3A3A, #222); border-bottom: 1px solid #111; font: 700 11px/1 var(--hd-font-family-base); writing-mode: vertical-rl; transform: rotate(180deg); }
.cs-seg span.on { background: #2A86D8; }
/* browser */
.br-sites div { padding: 4px 10px; border-bottom: 1px solid #E2E2E4; font: 700 34px/1.05 var(--hd-font-family-base); color: #111; }
.br-sites div:nth-child(n+3) { font-weight: 300; font-size: 26px; } .br-sites b { color: #17428C; }
/* documents */
.dc-ic { flex: none; width: 36px; height: 36px; border-radius: 11px; background: linear-gradient(#EAEAEC, #CFCFD2); display: grid; place-items: center; font: 700 8px/1 var(--hd-font-family-base); color: #111; }
.dc-size { font-size: 12px; color: #6E6E6E; align-self: flex-end; padding-bottom: 8px; }
</component>`;
const app = (inner: string, cls = 'ap--light') => `${CSS}<div class="ap ${cls}">${inner}</div>`;
const PIC = ['#8A5A3A,#C9A57E', '#2F5C83,#9CC3DF', '#D6B07A,#7D4F2C', '#4E6B3C,#A9C27A', '#C9C1B8,#7C6F66', '#B03A48,#E8A0A6', '#3C4A63,#9EB0CC', '#DCCB9E,#8B7A4F', '#2B2B2B,#8D8D8D'];
const pic = (i: number) => `linear-gradient(135deg, ${PIC[i % PIC.length]})`;
const av = (i: number) => `<span class="ap-av" style="background:${pic(i)}"></span>`;
const tabs = (icons: string[], on: number) => `<div class="ap-tabs">${icons.map((ic, i) => `<span class="${i === on ? 'on' : ''}"><HdIcon name="${ic}" :size="20" /></span>`).join('')}</div>`;

export const Phone: S = {
  name: 'Phone: dial pad',
  parameters: { docs: { description: { story: 'A **dark header** with the call type ("Mobile call" ⇕, an N9 selection dialog of the call services) over the number in large light type, then the pad on light grey: **no key boxes**, bold digits with small letters under them. A wide green **call pill** and a contact-add squircle. The toolbar is three **tabs**: Call log, Dial pad, Contacts.\n\n**On the phone:** Dialer draws key boxes, a small number and a round call button, and has five tabs (Favourites and Voicemail too).' } } },
  render: () => ({ components: comps, template: app(`
    <div class="ph-head"><div class="ph-sel">Mobile call<span>⇕</span></div><div class="ph-num"><span>33</span>9<i>⌫</i></div></div>
    <div class="ph-pad">${[['1', 'oo'], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['*', '+'], ['0', ''], ['#', '']].map(([d, l]) => `<span>${d}<small>${l}</small></span>`).join('')}</div>
    <div class="ph-act"><span class="ph-call"><HdIcon name="phone" :size="16" /></span><span class="ph-add"><HdIcon name="person" :size="16" /></span></div>
    ${tabs(['list', 'grid', 'person'], 1)}`) }),
};

export const Contacts: S = {
  name: 'Contacts: list',
  parameters: { docs: { description: { story: 'A **blue title bar**, a search field, then **Favourites** (★ at the right) and the alphabet as group headers: the letter at the right end of a line. Each row a squircle picture and the name, bold. Toolbar: **+** (new contact) and the menu. Long lists get the fast-scroll bar (Lists).\n\n**On the phone:** the header has a ☰ drawer button (a top button: against rule 1); an empty list shows Material "Add account / Import" links, and the first run opens a Material "Contacts storage" radio page.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="ap-title" style="background:#1C80D6">Contacts</div>
    <div class="ap-field">Search<HdIcon name="search" :size="16" /></div>
    <div class="ap-body">
      <div class="ap-group">Favourites</div>
      <div class="ap-row">${av(0)}<span class="ap-t"><b>Anna</b></span>★</div>
      <div class="ap-row">${av(1)}<span class="ap-t"><b>Taz</b></span>★</div>
      <div class="ap-group">B</div>
      <div class="ap-row">${av(2)}<span class="ap-t"><b>Basil</b></span></div>
      <div class="ap-row">${av(3)}<span class="ap-t"><b>Betty</b></span></div>
      <div class="ap-group">D</div>
      <div class="ap-row">${av(4)}<span class="ap-t"><b>Dad</b></span></div>
    </div>
    <HdToolBar label="Contacts toolbar"><template #left><HdToolIcon icon="add" label="New contact" /></template><template #right><HdToolIcon icon="menu" label="Menu" /></template></HdToolBar>`) }),
};

export const ContactEditor: S = {
  name: 'Contacts: editor',
  parameters: { docs: { description: { story: 'Editors are **sheets**: Cancel (grey pill) and Save (blue, pale until something changed) at the top of the sheet: the one place N9 puts buttons up there, because a sheet is a separate task with its own frame. Fields are **label: value** lines, the label underlined, empty values a grey hint; a ▾ shows more fields. No toolbar.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="ce-bar"><span class="ap-pill ap-pill--grey">Cancel</span><span class="ap-pill ap-pill--blue">Save</span></div>
    <div class="ap-body">
      <div class="ap-row" style="border-bottom:1px solid #C8C8C8">${av(0)}<span class="ap-t" style="font:300 15px var(--hd-font-family-light)">Add image</span></div>
      <div class="ce-f">First name: <b>Anna</b></div><div class="ce-f">Last name: <i>Add name</i></div>
      <div class="ce-f"><u>Mobile:</u> <b>123158</b></div><div class="ce-f"><u>Home:</u> <i>Add number</i></div>
      <div class="ce-f"><u>Other:</u> <b>anna@example.org</b></div><div class="ce-f"><u>Work:</u> <i>Add email address</i></div>
      <div style="text-align:center;padding:6px;border-bottom:1px solid #C8C8C8">▾</div>
    </div>`) }),
};

export const Calculator: S = {
  name: 'Calculator',
  parameters: { docs: { description: { story: 'Black. The result in **large light orange**, ⌫ beside it, a thin line under it. Keys are **bare glyphs, no boxes**: C ÷ ×, ± − +, the digits in light white, **=** in orange. Nothing else: no scientific panel, no menu, no toolbar (minimise and close are gestures).\n\n**On the phone:** a light Material calculator with boxed keys, a blue =, AC, ( ), % and a scientific drawer. A decision: N9 exact, or keep the extra functions (a scientific row behind a swipe, in the same bare style).' } } },
  render: () => ({ components: comps, template: app(`
    <div style="height:24px"></div><div class="ca-out">3,630<span style="font-size:20px;color:#777">⌫</span></div>
    <div class="ca-keys">${['C', '÷', '×', '±', '−', '+'].map((k) => `<span class="op">${k}</span>`).join('')}${['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((k) => `<span>${k}</span>`).join('')}<span class="eq">=</span></div>`, 'ap--dark') }),
};

export const Clock: S = {
  name: 'Clock and alarms',
  parameters: { docs: { description: { story: 'One page: the **analogue clock** (white hands, an orange second hand, the day and date on its left, the time zone above) over **Alarms**, a list of switch + time + name rows ending in ›, with a + squircle by the title. No tabs and no toolbar items: the N9 clock has only alarms.\n\n**On the phone:** DeskClock opens on a separate clock tab with an orange floating + pill, and has five tabs (alarms, world clock, timer, stopwatch, settings): the extra tabs are Android features worth keeping, so they stay as toolbar tabs, but the first tab should be this page.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="cl-face"><span class="cl-tz">Athens GMT+2:00</span><div class="cl-dial"><i class="h"></i><i class="m"></i><i class="s"></i><span class="cl-date">THU<b>19</b></span></div></div>
    <div class="ap-head2">Alarms<span class="ap-plus">+</span></div>
    <div class="ap-row"><span class="ap-sw"></span><span class="ap-t"><b>07:30</b><small>Work days</small></span><span class="ap-chev">›</span></div>
    <div class="ap-row"><span class="ap-sw on"></span><span class="ap-t"><b>09:00</b><small>Weekend</small></span><span class="ap-chev">›</span></div>`) }),
};

export const AlarmEditor: S = {
  name: 'Clock: alarm editor',
  parameters: { docs: { description: { story: 'A sheet: Cancel and an **orange Save** (the N9 positive colour in editors). A title field, the time in light type, and the **time wheel**: drag the dark minute knob round the outer ring and the light hour knob round the inner one. Then More options › (repeat, snooze, tone as N9 selection rows).' } } },
  render: () => ({ components: comps, template: app(`
    <div class="ce-bar"><span class="ap-pill ap-pill--grey">Cancel</span><span class="ap-pill ap-pill--orange">Save</span></div>
    <div class="ap-field" style="margin:10px 8px">Alarm title</div>
    <div class="al-time">18:04</div>
    <div class="al-wheel"><span class="al-knob" style="top:6px;left:110px;background:#2A2420;color:#fff">04</span><span class="al-knob" style="bottom:42px;background:radial-gradient(#F2F2F2,#BEBEC0);color:#222">18</span></div>
    <div class="ap-row" style="margin-top:14px;border-bottom:1px solid #C8C8C8"><span class="ap-t"><b>More options</b></span><span class="ap-chev">›</span></div>`) }),
};

const MONTH = Array.from({ length: 42 }, (_, i) => i - 2);
export const CalendarMonth: S = {
  name: 'Calendar: month',
  parameters: { docs: { description: { story: 'The calendar opens on the **month**: orange ◀ ▶ around a light month name, weekday initials with **Saturday and Sunday in orange**, today an **orange squircle**, other months\' days grey. Under it, the chosen day\'s events (title bold, times, the calendar\'s colour mark). Toolbar tabs: + (new event), Month, Week, Agenda, menu.\n\n**On the phone:** Etar opens on the week, and its bottom toolbar is empty.' } } },
  render: () => ({ components: comps, setup: () => ({ MONTH }), template: app(`
    <div class="cm"><div class="cm-h"><i>◀</i>November 2026<i>▶</i></div>
      <div class="cm-g">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => `<span class="d ${i > 4 ? 'we' : ''}">${d}</span>`).join('')}
        <span v-for="n in MONTH" :key="n" :class="{ o: n < 1 || n > 30, t: n === 19 }">{{ n < 1 ? 31 + n : n > 30 ? n - 30 : n }}</span></div></div>
    <div class="ap-body"><div class="ap-row"><span class="ap-t"><b>Dentist</b><small>17:00 – 17:45</small></span><span style="width:4px;height:16px;background:#2A7AD6"></span></div></div>
    ${tabs(['add', 'grid', 'calendar', 'list', 'menu'], 1)}`) }),
};

export const CalendarWeek: S = {
  name: 'Calendar: day in the week',
  parameters: { docs: { description: { story: 'The week tab: a dark strip "Week 47 · November 2026" with an **orange rule**, the day in light type, hours on a lighter column; events are **solid blue** blocks with bold white titles; the current hour a warm beige band with an orange mark.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="cw-h">Week 47 · November 2026</div><div class="cw-day">Thursday 19</div>
    <div class="ap-body">${['14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].map((h, i) => `<div class="cw-row ${i === 9 ? 'now' : ''}"><span>${h}</span><i class="${i === 1 ? 'ev' : ''}">${i === 1 ? 'Meeting' : ''}</i></div>`).join('')}</div>
    ${tabs(['add', 'grid', 'calendar', 'list', 'menu'], 2)}`) }),
};

export const Gallery: S = {
  name: 'Gallery: grid',
  parameters: { docs: { description: { story: 'Black, the pictures **edge to edge, square, no gaps**. The toolbar floats translucent over them: the **view selector** (Collection ⇕: Captures, My videos, Other images, Favourites, Tags, an N9 selection dialog) and the menu.\n\n**On the phone:** Glimpse\'s grid is right, its toolbar is empty.' } } },
  render: () => ({ components: comps, setup: () => ({ pic }), template: app(`
    <div class="ap-body"><div class="ga-grid"><i v-for="i in 18" :key="i" :style="{ background: pic(i) }"></i></div>
    <div class="ga-bar"><span class="ga-sel">Collection<span>⇕</span></span><HdIcon name="menu" :size="20" /></div></div>`, 'ap--dark') }),
};

export const Photo: S = {
  name: 'Gallery: one picture',
  parameters: { docs: { description: { story: 'The picture fills the screen; a tap shows a translucent **info band** on top (name bold, date, place) and the toolbar: Back, ★, Share, Delete, menu. Another tap hides both.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="ap-body" style="background:${pic(1)}"><div class="ga-info"><b>IMG_0412</b><div><span>9 May 2026 10:56</span><span>Athens, Greece</span></div></div></div>
    <HdToolBar back variant="dark" label="Picture toolbar"><template #right><HdToolIcon icon="star" label="Favourite" /><HdToolIcon icon="share" label="Share" /><HdToolIcon icon="delete" label="Delete" /><HdToolIcon icon="menu" label="Menu" /></template></HdToolBar>`, 'ap--dark') }),
};

export const Music: S = {
  name: 'Music',
  parameters: { docs: { description: { story: 'The top is a wall of **square album art**, edge to edge (the first tile "All songs"); under it bold rows Artists, Albums, Songs, Playlists › and the store, on a dark vignette. No toolbar until something plays. Album art stays square (rule 22). Now playing: the art, the title bold with "1/1", artist and album, bare ⏮ ⏸ ⏭, a thin **magenta** progress line, times; toolbar Back, ★, repeat.\n\n**On the phone:** matches (Twelve); with no music the art tiles are empty dark squares.' } } },
  render: () => ({ components: comps, setup: () => ({ pic }), template: app(`
    <div class="ap-body" style="background:radial-gradient(circle at 50% 70%, #2A2A2A, #000)"><div class="ga-grid"><i v-for="i in 9" :key="i" :style="{ background: pic(i + 3) }"></i></div>
    ${['Artists', 'Albums', 'Songs', 'Playlists'].map((r) => `<div class="mu-row">${r}<span>›</span></div>`).join('')}<div class="mu-row">Store<HdIcon name="bag" :size="16" /></div></div>`, 'ap--dark') }),
};

export const NowPlaying: S = {
  name: 'Music: now playing',
  render: () => ({ components: comps, template: app(`
    <div class="ap-body"><div style="aspect-ratio:1;background:${pic(5)}"></div>
      <div class="mu-now"><b>No more blues<span>1/1</span></b><p>Sample artist<br>Sample album</p></div>
      <div class="mu-ctl"><span>⏮</span><span>⏸</span><span>⏭</span></div><div class="mu-prog"></div><div class="mu-t"><span>00:01</span><span>03:57</span></div></div>
    <HdToolBar back variant="dark" label="Now playing toolbar"><template #right><HdToolIcon icon="star" label="Favourite" /><HdToolIcon icon="restart" label="Repeat" /></template></HdToolBar>`, 'ap--dark') }),
};

export const Camera: S = {
  name: 'Camera',
  parameters: { docs: { description: { story: 'The viewfinder is all picture. Three outlined controls: the gallery (top left), the **mode switch** photo/video (top right, the current one white), and at the bottom the **settings summary**: resolution, scene, flash, ISO, face detection; tapping it opens the settings. Capture is a tap anywhere (or the key); no shutter button, no toolbar.\n\n**On the phone:** Aperture has a Material control panel (shutter circle, mode tabs, zoom chips) and the system toolbar with Back.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="ap-body" style="background:linear-gradient(#111,#222)"><div class="cam-top"><span class="cam-btn"><HdIcon name="photo" :size="14" /></span><span class="cam-btn"><span class="on"><HdIcon name="camera" :size="12" /></span><span><HdIcon name="record" :size="12" /></span></span></div>
    <span class="cam-focus"></span><span class="cam-ind"><span>8M</span><span>A</span><span>⚡A</span><span>ISO</span><span>☺</span></span></div>`, 'ap--dark') }),
};

export const CameraSettings: S = {
  name: 'Camera: settings',
  parameters: { docs: { description: { story: 'Settings are **vertical segmented columns** read in landscape: each a label and its choices stacked, the current one **blue** (Light sensitivity, Aspect ratio, Resolution, Face detection as a switch). One tap sets it; ↓ goes back.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="ap-body"><div class="cs">${[['Light sensitivity', ['Automatic', 'ISO 100', 'ISO 200', 'ISO 400', 'ISO 800'], 1], ['Aspect ratio', ['16:9', '4:3', '3:2'], 1], ['Resolution', ['High 8 Mpx', 'Medium 6 Mpx', 'Low 3 Mpx'], 0]].map(([h, o, on]) => `<div class="cs-col"><h4>${h}</h4><div class="cs-seg">${(o as string[]).slice().reverse().map((x, i, a) => `<span class="${a.length - 1 - i === on ? 'on' : ''}">${x}</span>`).join('')}</div></div>`).join('')}</div></div>`, 'ap--dark') }),
};

export const Browser: S = {
  name: 'Browser: start page',
  parameters: { docs: { description: { story: 'The start page is **Top sites** as huge type, each site its name set large (bold for the first, light after). The address field "Go to web address or search" is the only thing on top. On a page, the N9 browser put Back, the address and its menu in a bar at the top that scrolls away: **Etesian moves those to the bottom toolbar** (rule 1); the toolbar hides as you scroll down and comes back as you scroll up.\n\n**On the phone:** Jelly has the address bar at the top with a Material suggestion list.' } } },
  render: () => ({ components: comps, template: app(`
    <div class="ap-field" style="margin:10px 8px">Go to web address or search</div><div class="ap-group" style="padding-top:2px">Top sites</div>
    <div class="ap-body br-sites" style="background:#fff"><div>Example News</div><div>Example Blog</div><div>Latest on <b>Etesian</b></div><div><b>Etesian</b> Features</div><div><b>Etesian</b> Support</div></div>
    <HdToolBar label="Browser toolbar"><template #left><HdToolIcon icon="window" label="Windows" /></template><template #right><HdToolIcon icon="menu" label="Menu" /></template></HdToolBar>`) }),
};

export const Documents: S = {
  name: 'Documents',
  parameters: { docs: { description: { story: 'An **orange title bar**, then every document, newest first, grouped by **age** ("Today", "Yesterday", "5 years ago" at the right end of a line). Each row: a light squircle with the file type, the name bold, the kind under it, the size at the right. No folders, no tabs. Toolbar: the menu only.\n\n**On the phone:** DocumentsUI is a Material folder browser (device name header, type chips, folder rows, five toolbar icons).' } } },
  render: () => ({ components: comps, template: app(`
    <div class="ap-title" style="background:#F07A1E">Documents</div>
    <div class="ap-body"><div class="ap-group">Today</div>
      ${[['PDF', 'Report 2026', 'PDF', '139 kB'], ['XLS', 'Budget', 'Spreadsheet', '22 kB']].map(([t, n, k, s]) => `<div class="ap-row"><span class="dc-ic">${t}</span><span class="ap-t"><b>${n}</b><small>${k}</small></span><span class="dc-size">${s}</span></div>`).join('')}
      <div class="ap-group">Yesterday</div>
      <div class="ap-row"><span class="dc-ic">TXT</span><span class="ap-t"><b>Notes for the trip</b><small>Text file</small></span><span class="dc-size">1 kB</span></div></div>
    <HdToolBar label="Documents toolbar"><template #right><HdToolIcon icon="menu" label="Menu" /></template></HdToolBar>`) }),
};
