<script setup lang="ts">
/**
 * Shared desktop details: header-bar toolbar inside the window (Back left, menu button right), right-click context menu,
 * pointer density (32px rows) vs touch density (53px rows), hover / focus / pressed states, tooltips with shortcuts.
 */
import XDesktop from './XDesktop.vue';
import XTopBar from './XTopBar.vue';
import XWindow from './XWindow.vue';
import XCursor from './XCursor.vue';
import XMail from '../apps/XMail.vue';
import XKey from '../parts/XKey.vue';
import HdToolIcon from '../../../components/HdToolIcon.vue';
import HdTooltip from '../../../components/HdTooltip.vue';
import HdButton from '../../../components/HdButton.vue';
import HdListItem from '../../../components/HdListItem.vue';
import HdAvatar from '../../../components/HdAvatar.vue';
import type { XMenuItem } from '../parts/types';
const MENU: XMenuItem[] = [
  { id: 'reply', label: 'Reply', icon: 'message', keys: 'Ctrl+R' }, { id: 'fwd', label: 'Forward', icon: 'share', keys: 'Ctrl+L' },
  { id: 'unread', label: 'Mark as unread', icon: 'mail', keys: 'Ctrl+U' }, { id: 'flag', label: 'Flag', icon: 'star', keys: 'Ctrl+G' },
  { id: 'del', label: 'Delete', icon: 'delete', keys: 'Del', divider: true, destructive: true },
];
const STATES = ['Rest', 'Hover', 'Focus (keyboard)', 'Pressed / selected'];
</script>
<template>
  <XDesktop label="Shared details">
    <XTopBar app="Mail" />
    <div class="x-desktop__area">
      <p class="x-dd-cap" style="left: 40px">Pointer density · 32px rows · right-click menu</p>
      <XWindow title="Inbox" app="Mail" :x="40" :y="36" :w="900" :h="620" focused>
        <XMail chrome="headerbar" density="pointer" :menu-at="{ x: 250, y: 214 }" :menu-items="MENU" two-pane="never" id-prefix="dd-p" />
      </XWindow>
      <XCursor :x="290" :y="278" />
      <p class="x-dd-cap" style="left: 980px">Touch density · 53px rows (tablet / touchscreen laptop)</p>
      <XWindow title="Inbox" app="Mail" :x="980" :y="36" :w="900" :h="620">
        <XMail chrome="headerbar" density="touch" two-pane="never" id-prefix="dd-t" />
      </XWindow>

      <section class="x-dd-states hd-on-page" aria-label="Interaction states">
        <h2 class="x-dd-states__h">States: hover, focus, pressed, tooltips</h2>
        <div class="x-dd-grid">
          <span></span><b v-for="s in STATES" :key="s">{{ s }}</b>
          <span class="x-dd-row">Header-bar icon (Back)</span>
          <div v-for="(s, i) in STATES" :key="'b' + s" class="x-dd-cell hd-on-chrome x-dd-chrome">
            <HdToolIcon icon="back" label="Back" :class="['', 'x-f-hover', 'x-f-focus', ''][i]" :active="i === 3" />
          </div>
          <span class="x-dd-row">Menu button + tooltip</span>
          <div v-for="(s, i) in STATES" :key="'m' + s" class="x-dd-cell hd-on-chrome x-dd-chrome">
            <HdTooltip text="Menu (Alt)" placement="top" :class="{ 'x-f-tip': i === 1 }"><HdToolIcon icon="more" label="Menu" :class="['', 'x-f-hover', 'x-f-focus', ''][i]" :active="i === 3" /></HdTooltip>
          </div>
          <span class="x-dd-row">Icon-only button</span>
          <div v-for="(s, i) in STATES" :key="'i' + s" class="x-dd-cell">
            <HdTooltip text="Delete (Del)" placement="top" :class="{ 'x-f-tip': i === 1 }"><HdButton icon="delete" aria-label="Delete" :class="['', 'x-f-hover-btn', 'x-f-focus', 'x-f-pressed-btn'][i]" /></HdTooltip>
          </div>
          <span class="x-dd-row">Button</span>
          <div v-for="(s, i) in STATES" :key="'t' + s" class="x-dd-cell">
            <HdButton :variant="i === 3 ? 'accent' : 'default'" :class="['', 'x-f-hover-txt', 'x-f-focus-txt', ''][i]">Reply</HdButton><XKey v-if="i === 0" keys="Ctrl+R" />
          </div>
          <span class="x-dd-row">List row (32px)</span>
          <div v-for="(s, i) in STATES" :key="'r' + s" class="x-dd-cell x-density-pointer x-dd-list">
            <HdListItem title="Anna Virtanen" clickable :selected="i === 3" :class="['', 'x-f-row-hover', 'x-f-row-focus', ''][i]"><template #leading><HdAvatar name="Anna Virtanen" :size="22" /></template></HdListItem>
          </div>
        </div>
      </section>
    </div>
  </XDesktop>
</template>
<style>
.x-dd-cap { position: absolute; top: 8px; margin: 0; z-index: 2; font: 700 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-dd-states { position: absolute; left: 40px; right: 40px; top: 680px; bottom: 24px; padding: 14px 20px; border-radius: var(--hd-radius-card); background: var(--hd-c-bg); color: var(--hd-c-fg); box-shadow: 0 0 0 1px var(--hd-c-divider); }
.x-dd-states__h { margin: 0 0 10px; font: var(--hd-font-weight-light) var(--hd-font-size-large)/1 var(--hd-font-family-light); }
.x-dd-grid { display: grid; grid-template-columns: 220px repeat(4, 1fr); gap: 6px 12px; align-items: center; }
.x-dd-grid > b { font: 700 var(--hd-font-size-xsmall)/1 var(--hd-font-family-base); color: var(--hd-c-fg-secondary); }
.x-dd-row { font-size: var(--hd-font-size-small); }
.x-dd-cell { display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 2px 10px; }
.x-dd-chrome { background: var(--hd-surface-chrome); color: var(--hd-c-fg); border-radius: 4px; padding-top: 0; padding-bottom: 0; }
.x-dd-cell .hd-tooltip__bubble.is-top { bottom: auto; top: 50%; left: calc(100% + 50px); transform: translate(0, -50%) !important; }
.x-dd-list { padding: 0; }
.x-dd-list .hd-list-item { max-width: 320px; }
/* forced states for the static comparison */
.x-f-hover.hd-tool-icon { --hd-sq-fill: var(--hd-c-pressed); }
.x-f-focus.hd-sq { --hd-sq-ring: var(--hd-c-focus); --hd-sq-ring-width: var(--hd-size-focus-ring); --hd-sq-ring-offset: 3px; }
.x-f-hover-btn { filter: brightness(.96); }
.x-f-pressed-btn { --hd-sq-fill: var(--hd-c-pressed) !important; }
.x-f-hover-txt { filter: brightness(.96); }
.x-f-focus-txt { outline: var(--hd-size-focus-ring) solid var(--hd-c-focus); outline-offset: 2px; }
.x-f-row-hover { background: var(--hd-c-pressed); }
.x-f-row-focus { outline: 2px solid var(--hd-c-focus); outline-offset: -2px; }
.x-f-tip .hd-tooltip__bubble { opacity: 1; transform: translate(-50%, 0); }
</style>
