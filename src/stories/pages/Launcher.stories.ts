import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HdIcon from '../../components/HdIcon.vue';
import HdSquircle from '../../components/HdSquircle.vue';

/* Applications view folders, measured from a real N9 (PR1.3, the owner's, 2026-11): n9-folder-3, n9-folder-open-apps,
 * n9-folder-edit, n9-folder-open-empty, n9-empty-folders. 480 × 854 n9px at 0.75. Icons are generic lit squircles. */
const meta: Meta = {
  title: 'OS/Applications: folders',
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Folders in the Applications grid, as on the N9. A folder is an icon like any other: a dark squircle showing its **first four apps** small (2 × 2), or a plain folder glyph when empty, named "Folder" until renamed. **Opening it does not cover the grid**: the rows below slide down and the folder opens **in place**, under its row, a band of black between two thin lines with a notch pointing at the folder icon; its name in light type, then its apps. Tap outside or the folder again to close. **Long press** (on an icon or empty space) is edit mode: the open folder\'s name becomes a field, its apps get the red ✕ (takes them out, back to the grid), everything else dims, and the bar at the bottom offers **Done** and **New folder**.' } } },
};
export default meta;
type S = StoryObj;

const CSS = `<component is="style">
.lf { width: 360px; height: 640px; overflow: hidden; background: #000; color: #fff; font-family: var(--hd-font-family-base); position: relative; display: flex; flex-direction: column; }
.lf-grid { display: grid; grid-template-columns: repeat(4, 1fr); row-gap: 14px; padding: 12px 0; }
.lf-ic { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 11.5px; color: #C8C8C8; position: relative; }
.lf-ic > span:last-child { max-width: 82px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lf-dim { opacity: .35; }
.lf-fold { width: 54px; height: 54px; border-radius: 16px; background: linear-gradient(#5A5A5E, #3A3A3E); display: grid; grid-template-columns: 1fr 1fr; gap: 3px; padding: 9px; box-sizing: border-box; box-shadow: inset 0 1px rgba(255,255,255,.25); }
.lf-fold > i { border-radius: 5px; }
.lf-fold--empty { display: grid; place-items: center; grid-template-columns: 1fr; }
.lf-fold--empty::after { content: ''; width: 28px; height: 22px; border-radius: 3px; background: linear-gradient(#FFFFFF, #D8D8DA); clip-path: polygon(0 0, 40% 0, 48% 15%, 100% 15%, 100% 100%, 0 100%); }
.lf-panel { position: relative; border-top: 1px solid #5A5A5A; border-bottom: 1px solid #5A5A5A; background: #000; padding-bottom: 8px; }
.lf-notch { position: absolute; top: -8px; width: 14px; height: 14px; background: #000; border-left: 1px solid #5A5A5A; border-top: 1px solid #5A5A5A; transform: rotate(45deg); }
.lf-name { padding: 14px 12px 4px; font: 300 18px/1 var(--hd-font-family-light); color: #D8D8D8; }
.lf-field { margin: 8px 6px 2px; height: 26px; border-radius: 9px; background: linear-gradient(#5E5E62, #48484C); padding: 0 10px; display: flex; align-items: center; font: 300 16px/1 var(--hd-font-family-light); color: #AAA; }
.lf-x { position: absolute; top: -6px; right: 8px; width: 18px; height: 18px; border-radius: 6px; background: linear-gradient(#F0504A, #C21A16); color: #fff; font: 700 12px/18px var(--hd-font-family-base); text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,.6); }
.lf-bar { position: absolute; left: 0; right: 0; bottom: 0; height: 46px; display: flex; gap: 6px; align-items: center; justify-content: center; background: linear-gradient(#1C1C1C, #000); border-top: 1px solid #333; }
.lf-btn { width: 108px; height: 26px; border-radius: 9px; background: linear-gradient(#3A3A3A, #151515); box-shadow: inset 0 1px rgba(255,255,255,.18), 0 0 0 1px #000; display: grid; place-items: center; font: 700 13px/1 var(--hd-font-family-base); }
</component>`;
const COL = ['#2F7FD8', '#E8483F', '#3DA35A', '#F2A20C', '#7A4FD1', '#09A7CC', '#C4008F', '#5C5C5C', '#E0640A', '#1C6FD1', '#8A5A3A', '#3A6E8F'];
const GL = ['phone', 'person', 'search', 'globe', 'message', 'mail', 'calendar', 'clock', 'camera', 'music', 'photo', 'rss'];
const icon = (i: number, label: string, extra = '') => `<div class="lf-ic ${extra}"><HdSquircle :size="54" color="${COL[i % 12]}" lighting="lit"><HdIcon name="${GL[i % 12]}" :size="30" lit /></HdSquircle><span>${label}</span></div>`;
const folder = (apps: number[], label = 'Folder', extra = '') => `<div class="lf-ic ${extra}"><span class="lf-fold ${apps.length ? '' : 'lf-fold--empty'}">${apps.slice(0, 4).map((a) => `<i style="background:${COL[a % 12]}"></i>`).join('')}</span><span>${label}</span></div>`;
const NAMES = ['Phone', 'Contacts', 'Search', 'Web', 'Messages', 'Mail', 'Calendar', 'Clock', 'Camera', 'Music', 'Gallery', 'Feeds'];
const row = (from: number, extra = '') => [0, 1, 2, 3].map((k) => icon(from + k, NAMES[(from + k) % 12]!, extra)).join('');

export const Closed: S = {
  name: 'Folders in the grid',
  parameters: { docs: { description: { story: 'A folder with apps shows its first four, small; an empty folder shows the folder glyph. Both are named "Folder" until renamed.' } } },
  render: () => ({ components: { HdIcon, HdSquircle }, template: `${CSS}<div class="lf"><div class="lf-grid">${row(0)}${row(4)}${icon(8, 'Camera')}${folder([1, 4, 9])}${folder([])}${folder([2, 5, 6, 10, 11], 'Tools')}</div></div>` }),
};

export const Open: S = {
  name: 'An open folder',
  parameters: { docs: { description: { story: 'The folder opens **in place** under its row; the rows after it slide down. The notch points at the folder.' } } },
  render: () => ({ components: { HdIcon, HdSquircle }, template: `${CSS}<div class="lf"><div class="lf-grid">${row(0)}${icon(8, 'Camera')}${icon(9, 'Music')}${folder([1, 4, 9], 'Folder')}${icon(11, 'Feeds')}</div>
    <div class="lf-panel"><span class="lf-notch" style="left:219px"></span><div class="lf-name">Folder</div><div class="lf-grid">${icon(1, 'Contacts')}${icon(4, 'Messages')}${icon(9, 'Music')}</div></div>
    <div class="lf-grid">${row(4)}</div></div>` }),
};

export const Editing: S = {
  name: 'Edit mode with a folder open',
  parameters: { docs: { description: { story: 'Long press: the folder\'s name is a field, its apps get the red ✕, the rest dims; **Done** and **New folder** at the bottom. Dragging an icon onto another makes a folder of the two.' } } },
  render: () => ({ components: { HdIcon, HdSquircle }, template: `${CSS}<div class="lf"><div class="lf-grid">${row(0, 'lf-dim')}${folder([1, 4, 9], 'Folder', 'lf-dim')}${icon(8, 'Camera', 'lf-dim')}${icon(9, 'Music', 'lf-dim')}${icon(10, 'Gallery', 'lf-dim')}</div>
    <div class="lf-panel" style="border-color:#777"><div class="lf-field">Folder</div><div class="lf-grid">${[1, 4, 9].map((a) => icon(a, NAMES[a]!).replace('</div>', '<span class="lf-x">✕</span></div>')).join('')}</div></div>
    <div class="lf-grid">${row(4, 'lf-dim')}</div>
    <div class="lf-bar"><span class="lf-btn">Done</span><span class="lf-btn">New folder</span></div></div>` }),
};

export const Empty: S = {
  name: 'An empty folder, open',
  parameters: { docs: { description: { story: 'An empty folder opens to its name and nothing else: no "drag apps here" text (no filler, rule 13).' } } },
  render: () => ({ components: { HdIcon, HdSquircle }, template: `${CSS}<div class="lf"><div class="lf-grid">${row(0)}${icon(8, 'Camera')}${icon(9, 'Music')}${folder([], 'Folder')}${icon(11, 'Feeds')}</div>
    <div class="lf-panel" style="height:100px"><span class="lf-notch" style="left:219px"></span><div class="lf-name">Folder</div></div><div class="lf-grid">${row(4)}</div></div>` }),
};
