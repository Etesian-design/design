import { onMounted, onBeforeUnmount } from 'vue';
/** Listen to keydown on the story window (mockup shortcuts such as Super, Escape, Super+Arrow). */
export function useDesktopKeys(handler: (e: KeyboardEvent) => void) {
  onMounted(() => typeof window !== 'undefined' && window.addEventListener('keydown', handler));
  onBeforeUnmount(() => typeof window !== 'undefined' && window.removeEventListener('keydown', handler));
}
