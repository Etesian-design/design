/**
 * What a page puts in its host's header, as data: the title (or a menu of views), Back, and its actions in priority order.
 * The host is a desktop window (XWindow) or the classic layout (XClassic); both lay the actions out by one rule (as many as
 * fit, the rest in ⋮, a bottom toolbar when narrow), so a page never draws its own toolbar or decides where buttons go.
 *
 *   const chrome = useChrome({ title: 'Mail', views: ['Inbox', 'Sent'], tools: [{ icon: 'add', label: 'Write' }] });
 *   chrome.on('tool', (label) => ...); chrome.on('view', (v) => ...); chrome.on('back', () => ...);
 *
 * A browser puts its tabs in the header instead of the title, as Chrome does in its title bar: `tabs: { list, current, max }`;
 * the header sends `tab` (pick), `tab-close` and `tab-add`.
 */
import { inject, provide, reactive, onBeforeUnmount, watchEffect, type InjectionKey } from 'vue';
import type { XAction } from './types';

export interface ChromeTab { id: string; title: string; icon?: string }
export interface ChromeTabs { list: ChromeTab[]; current: string; max?: number }
export interface PageChrome { title?: string; views?: string[]; view?: string; back?: boolean; tools?: XAction[]; tabs?: ChromeTabs }
type Ev = 'tool' | 'view' | 'back' | 'tab' | 'tab-close' | 'tab-add';
export interface ChromeHost { set(c: PageChrome | null): void; on(ev: Ev, fn: (arg?: string) => void): () => void }
export const CHROME_HOST: InjectionKey<ChromeHost> = Symbol('etesian-chrome-host');

/** for a host: the page's chrome, reactive, and a way to send it the header's clicks */
export function provideChromeHost() {
  const state = reactive<{ c: PageChrome | null }>({ c: null });
  const subs: Record<Ev, Set<(arg?: string) => void>> = { tool: new Set(), view: new Set(), back: new Set(), tab: new Set(), 'tab-close': new Set(), 'tab-add': new Set() };
  provide(CHROME_HOST, {
    set: (c) => (state.c = c),
    on: (ev, fn) => { subs[ev].add(fn); return () => subs[ev].delete(fn); },
  });
  return { state, emit: (ev: Ev, arg?: string) => { for (const f of subs[ev]) f(arg); }, has: (ev: Ev) => subs[ev].size > 0 };
}

/** for a page: declare the header (a getter, so it follows the page's state); returns `on` for the header's clicks */
export function useChrome(get: () => PageChrome) {
  const host = inject(CHROME_HOST, null);
  const offs: (() => void)[] = [];
  if (host) {
    watchEffect(() => host.set({ ...get() }));
    onBeforeUnmount(() => { host.set(null); offs.forEach((o) => o()); });
  }
  return {
    /** whether a host shows this page's header (otherwise the page draws its own) */
    hosted: !!host,
    on(ev: Ev, fn: (arg?: string) => void) { if (host) offs.push(host.on(ev, fn)); },
  };
}
