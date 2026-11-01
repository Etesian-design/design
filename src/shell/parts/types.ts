export interface XMenuItem { id: string; label: string; icon?: string; keys?: string; divider?: boolean; destructive?: boolean; disabled?: boolean }
export interface XAction { icon: string; label: string; keys?: string }
export interface XTab { id: string; label: string; icon: string }
export type XChrome = 'toolbar' | 'side' | 'headerbar' | 'none';
export type XDensity = 'touch' | 'pointer';
/** Props every mock app forwards to XAppShell. */
export interface XAppProps { chrome?: XChrome; landscape?: boolean; density?: XDensity; hints?: boolean; menuOpen?: boolean; menuAt?: { x: number; y: number }; menuItems?: XMenuItem[]; idPrefix?: string }
const SHELL_KEYS = ['chrome', 'landscape', 'density', 'hints', 'menuOpen', 'menuAt', 'menuItems', 'idPrefix'] as const;
/** Only the XAppShell props (so app-specific props don't fall through as DOM attributes). */
export function shellProps(p: XAppProps): XAppProps {
  const o: Record<string, unknown> = {};
  for (const k of SHELL_KEYS) if (p[k] !== undefined) o[k] = p[k];
  return o as XAppProps;
}
