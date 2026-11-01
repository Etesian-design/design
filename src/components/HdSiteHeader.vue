<script setup lang="ts">
/**
 * SiteHeader / NavBar (extrapolated, web). >= 600px: top bar with brand + links + actions.
 * < 600px: the links collapse into an N9-style dark bottom ToolBar (icons + tiny labels), one-handed; the brand and the
 * actions stay in the top bar (the actions as compact buttons), so it is never an empty strip.
 * tone="chrome": the N9 dark toolbar colour instead of the page's, to run into a dark hero below it.
 * The `logo` slot goes before the brand name.
 */
import HdIcon from './HdIcon.vue';
export interface HdNavLink { label: string; href: string; icon?: string; current?: boolean }
withDefaults(defineProps<{ brand: string; links: HdNavLink[]; brandHref?: string; sticky?: boolean; tone?: 'page' | 'chrome' }>(), { brandHref: '#', sticky: true, tone: 'page' });
</script>
<template>
  <header class="hd-site-header" :class="{ 'is-sticky': sticky, 'hd-site-header--chrome': tone === 'chrome' }">
    <a class="hd-site-header__skip" href="#main">Skip to content</a>
    <div class="hd-site-header__bar">
      <a class="hd-site-header__brand hd-focusable" :href="brandHref"><slot name="logo" />{{ brand }}</a>
      <nav class="hd-site-header__nav hd-inverted-mobile" aria-label="Main">
        <a v-for="l in links" :key="l.href" :href="l.href" class="hd-site-header__link hd-focusable" :aria-current="l.current ? 'page' : undefined">
          <HdIcon :name="l.icon ?? 'chevron-right'" :size="22" class="hd-site-header__icon" /><span>{{ l.label }}</span>
        </a>
      </nav>
      <div class="hd-site-header__actions"><slot name="actions" /></div>
    </div>
  </header>
</template>
<style>
.hd-site-header { background: var(--hd-c-bg); border-bottom: 1px solid var(--hd-c-divider); z-index: var(--hd-z-toolbar); }
.hd-site-header.is-sticky { position: sticky; top: 0; }
.hd-site-header__skip { position: absolute; left: 8px; top: 8px; padding: 8px 12px; background: var(--hd-c-fg); color: var(--hd-c-bg); border-radius: 6px; z-index: 2;
  /* Hidden until focused with the keyboard (not just moved off-screen, which can peek out). */
  clip-path: inset(50%); width: 1px; height: 1px; overflow: hidden; white-space: nowrap; }
.hd-site-header__skip:focus { clip-path: none; width: auto; height: auto; overflow: visible; }
.hd-site-header__bar { display: flex; align-items: center; gap: 24px; max-width: calc(var(--hd-container-default) + 64px); margin: 0 auto; height: 56px; padding: 0 var(--hd-space-page); }
.hd-site-header__brand { display: inline-flex; align-items: center; gap: 8px; color: inherit; text-decoration: none; font: var(--hd-font-weight-bold) var(--hd-font-size-default)/1 var(--hd-font-family-base); text-transform: uppercase; letter-spacing: .02em; border-radius: 4px; }
.hd-site-header__nav { display: flex; gap: 4px; flex: 1; min-width: 0; overflow-x: auto; scrollbar-width: none; }
.hd-site-header__link { display: inline-flex; align-items: center; min-height: 40px; padding: 0 12px; border-radius: var(--hd-radius-control); color: var(--hd-c-fg); text-decoration: none; font-weight: 400; transition: background var(--hd-motion-duration-instant); }
.hd-site-header__link:hover { background: var(--hd-c-pressed); }
.hd-site-header__link[aria-current='page'] { color: var(--hd-c-accent-text); font-weight: 700; }
.hd-site-header__icon { display: none; }
.hd-site-header__actions { display: flex; gap: 8px; margin-left: auto; }
/* By the window, not a container: a container would also become the bottom bar's frame. */
@media (max-width: 599.98px) {
  .hd-site-header__nav { position: fixed; left: 0; right: 0; bottom: 0; height: var(--hd-size-toolbar); justify-content: space-around; gap: 0;
    background: var(--hd-surface-chrome); padding-bottom: env(safe-area-inset-bottom); }
  .hd-site-header__link { flex-direction: column; justify-content: center; gap: 2px; padding: 0 8px; color: var(--hd-surface-chrome-fg); font-size: 11px; opacity: .7; min-height: 48px; }
  .hd-site-header__link:hover { background: var(--hd-c-pressed); }
  .hd-site-header__link[aria-current='page'] { color: var(--hd-surface-chrome-fg); opacity: 1; }
  .hd-site-header__icon { display: block; }
  .hd-site-header__bar { gap: 12px; }
  .hd-site-header__actions .hd-button { min-height: 36px; padding: 0 14px; font-size: var(--hd-font-size-small); }
}
/* the dark toolbar version */
.hd-site-header--chrome { background: var(--hd-surface-chrome); color: var(--hd-surface-chrome-fg); border-bottom-color: rgba(255,255,255,.08); color-scheme: dark; }
.hd-site-header--chrome .hd-site-header__link { color: var(--hd-surface-chrome-fg-secondary); }
.hd-site-header--chrome .hd-site-header__link:hover { background: rgba(255,255,255,.1); color: var(--hd-surface-chrome-fg); }
.hd-site-header--chrome .hd-site-header__link[aria-current='page'] { color: var(--hd-surface-chrome-fg); }
</style>
