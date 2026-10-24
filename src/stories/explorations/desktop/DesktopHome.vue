<script setup lang="ts">
/**
 * D "Home is the desktop": one app full screen with the top bar. Super minimises it (slides away) to reveal the three
 * home views side by side as the desktop. Split two apps + a pop-up window. Hidden peek dock at the bottom edge.
 * Open-app cards show their close button on hover.
 */
import { ref, computed, watch } from 'vue';
import XDesktop from './XDesktop.vue';
import XTopBar from './XTopBar.vue';
import XWindow from './XWindow.vue';
import XHints from './XHints.vue';
import XCursor from './XCursor.vue';
import XDockIcon from './XDockIcon.vue';
import XMiniApp from '../parts/XMiniApp.vue';
import XEvents from '../parts/XEvents.vue';
import XAppsView from '../parts/XAppsView.vue';
import XOpenApps from '../parts/XOpenApps.vue';
import { FAVOURITES } from '../parts/data';
import { useDesktopKeys } from './useDesktopKeys';
type DState = 'app' | 'home' | 'split' | 'peek' | 'hover';
const props = withDefaults(defineProps<{ state?: DState }>(), { state: 'app' });
const st = ref<DState>(props.state);
watch(() => props.state, (v) => (st.value = v));
const away = computed(() => st.value === 'home' || st.value === 'hover');
useDesktopKeys((e) => {
  if (e.key === 'Meta' || e.key === 'OS') st.value = away.value ? 'app' : 'home';
  else if (e.metaKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) st.value = 'split';
});
function peek(on: boolean) { if (st.value === 'app' || st.value === 'peek') st.value = on ? 'peek' : 'app'; }
const OPEN = ['Browser', 'Mail', 'Messages', 'Music'];
</script>
<template>
  <XDesktop :label="{ app: 'One app, full screen', home: 'Minimised: home views are the desktop', split: 'Split + pop-up window', peek: 'Peek dock (pointer at bottom edge)', hover: 'Hover on an open-app card' }[st]">
    <XTopBar :app="away ? '' : st === 'split' ? 'Mail · Messages' : 'Browser'" :active="away ? 'overview' : null" @overview="st = away ? 'app' : 'home'" />
    <div class="x-desktop__area">
      <!-- the desktop = the three N9 home views, side by side -->
      <div class="x-dhome" :aria-hidden="away ? undefined : 'true'">
        <section class="x-dhome__col x-dhome__events" aria-label="Events"><XEvents :columns="1" :thumb="48" /></section>
        <section class="x-dhome__col" aria-label="Applications"><h2 class="x-dhome__h">Applications</h2><XAppsView :columns="5" :size="64" @open="st = 'app'" /></section>
        <section class="x-dhome__col" aria-label="Open applications"><h2 class="x-dhome__h">Open</h2>
          <XOpenApps :key="st" :apps="OPEN" :cols="2" :w="1920" :h="1052" chrome="headerbar" hover-close :force-hover="st === 'hover' ? 1 : undefined" :gap="24" @open="st = 'app'" />
        </section>
      </div>

      <!-- full-screen app layer: slides away on Super -->
      <div class="x-dapp" :class="{ 'is-away': away }">
        <template v-if="st === 'split'">
          <div class="x-dsplit">
            <div class="x-dsplit__pane"><XMiniApp name="Mail" chrome="headerbar" density="pointer" id-prefix="dd-mail" /></div>
            <div class="x-dsplit__pane"><XMiniApp name="Messages" chrome="headerbar" density="pointer" id-prefix="dd-msg" /></div>
            <span class="x-dsplit__div" role="separator" aria-label="Drag to resize"><span></span></span>
          </div>
          <XWindow title="Notes (pop-up)" app="Notes" :x="1380" :y="560" :w="460" :h="420" focused :z="10"><XMiniApp name="Notes" chrome="none" /></XWindow>
        </template>
        <XMiniApp v-else name="Browser" chrome="headerbar" density="pointer" id-prefix="dd-web" />
      </div>

      <!-- peek dock: invisible until the pointer is held at the bottom edge -->
      <div class="x-peek-zone" @mouseenter="peek(true)"></div>
      <Transition name="x-peek">
        <nav v-if="st === 'peek'" class="x-peek hd-on-chrome" aria-label="Favourites" @mouseleave="peek(false)">
          <XDockIcon v-for="f in FAVOURITES" :key="f" :name="f" :size="44" :running="f === 'Browser'" :active="f === 'Browser'" />
        </nav>
      </Transition>
      <XCursor v-if="st === 'peek'" :x="1000" :y="1030" />
      <XCursor v-if="st === 'hover'" :x="1680" :y="230" />

      <XHints v-if="st !== 'peek'" :corner="away ? 'br' : 'bl'" :items="away
        ? [['Super', 'Back to app'], ['Left+Right', 'Move'], ['Enter', 'Open'], ['Delete', 'Close app']]
        : [['Super', 'Minimise to home'], ['Super+Left', 'Split left'], ['Super+Right', 'Split right'], ['Super+P', 'Pop-up window'], ['Alt+Tab', 'Switch app']]" />
    </div>
  </XDesktop>
</template>
<style>
.x-dhome { position: absolute; inset: 0; display: grid; grid-template-columns: 460px 1fr 720px; color: var(--hd-c-fg); }
.x-dhome__col { min-width: 0; overflow: hidden; padding: 0 24px; }
.x-dhome__events { padding: 0; border-right: 1px solid var(--hd-c-divider); }
.x-dhome__col + .x-dhome__col { border-left: 1px solid var(--hd-c-divider); }
.x-dhome__h { margin: 0; padding: 18px 16px 14px; font: var(--hd-font-weight-light) var(--hd-font-size-xxlarge)/1 var(--hd-font-family-light); }
.x-dapp { position: absolute; inset: 0; z-index: 10; display: flex; background: var(--hd-surface-home); transition: transform var(--hd-motion-duration-slow) var(--hd-motion-easing-in-out), opacity var(--hd-motion-duration-slow) var(--hd-motion-easing-in-out); }
.x-dapp.is-away { transform: translateY(70%) scale(.6); opacity: 0; pointer-events: none; }
.x-dsplit { position: relative; flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.x-dsplit__pane { min-width: 0; display: flex; overflow: hidden; }
.x-dsplit__div { position: absolute; top: 0; bottom: 0; left: 50%; width: 20px; transform: translateX(-50%); display: flex; align-items: center; justify-content: center; cursor: col-resize; }
.x-dsplit__div span { width: 5px; height: 56px; border-radius: 999px; background: var(--hd-surface-home-fg); opacity: .7; }
.x-peek-zone { position: absolute; left: 0; right: 0; bottom: 0; height: 4px; z-index: 40; }
.x-peek { position: absolute; left: 50%; bottom: 10px; z-index: 41; transform: translateX(-50%); display: flex; gap: 6px; padding: 8px 12px; border-radius: 14px; background: color-mix(in srgb, var(--hd-surface-overlay) 92%, transparent); box-shadow: var(--hd-shadow-overlay), 0 0 0 1px var(--hd-c-divider); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px); }
.x-peek-enter-active, .x-peek-leave-active { transition: transform var(--hd-motion-duration-default) var(--hd-motion-easing-out), opacity var(--hd-motion-duration-default); }
.x-peek-enter-from, .x-peek-leave-to { transform: translate(-50%, 120%); opacity: 0; }
</style>
