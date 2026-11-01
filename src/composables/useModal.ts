import { nextTick, onBeforeUnmount, ref, watch, useId as vueId, type Ref } from 'vue';
const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
/** A unique id for a component's elements; call it in setup. Vue's useId: the same on the server and in the browser,
 * so pages rendered ahead (SSR / SSG) hydrate without id mismatches. */
export const useId = (p = 'hd') => `${p}-${vueId()}`;
/** Focus trap + Escape + focus restore for dialogs/sheets/menus (extrapolated a11y behaviour). */
export function useModal(open: Ref<boolean>, panel: Ref<HTMLElement | undefined>, close: () => void) {
  const prev = ref<HTMLElement | null>(null);
  function onKey(e: KeyboardEvent) {
    if (!open.value || !panel.value) return;
    if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
    if (e.key !== 'Tab') return;
    const els = [...panel.value.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (!els.length) { e.preventDefault(); return; }
    const first = els[0]!, last = els[els.length - 1]!;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  watch(open, async (v) => {
    if (typeof document === 'undefined') return;
    if (v) {
      prev.value = document.activeElement as HTMLElement;
      document.addEventListener('keydown', onKey, true);
      await nextTick();
      const target = panel.value?.querySelector<HTMLElement>('[autofocus], ' + FOCUSABLE) ?? panel.value;
      target?.focus();
    } else {
      document.removeEventListener('keydown', onKey, true);
      prev.value?.focus?.();
    }
  }, { immediate: true });
  onBeforeUnmount(() => typeof document !== 'undefined' && document.removeEventListener('keydown', onKey, true));
}
