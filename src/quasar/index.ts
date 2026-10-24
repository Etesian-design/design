/**
 * Harmattan Design Language for Quasar 2.
 *
 *   import { Quasar, Notify, Dialog, Loading, BottomSheet } from 'quasar';
 *   import 'quasar/dist/quasar.css';
 *   import 'harmattan-design/style.css';
 *   import 'harmattan-design/quasar/theme.css';
 *   import { harmattanQuasarOptions, HarmattanQuasar } from 'harmattan-design/quasar';
 *   app.use(Quasar, harmattanQuasarOptions({ plugins: { Notify, Dialog, Loading, BottomSheet } }));
 *   app.use(HarmattanQuasar);
 */
import type { App, Component } from 'vue';
import { watch } from 'vue';
import { tokens } from '../tokens';
import { harmattanIconSet, hdIcon, quasarExtraPaths } from './icon-set';
import HdQSpinnerSquircle from './HdQSpinnerSquircle';
import { quasarCoverage } from './coverage';

export { harmattanIconSet, hdIcon, quasarExtraPaths, HdQSpinnerSquircle, quasarCoverage };

/** Quasar brand colours mapped to Harmattan tokens (light "blanco"). */
export const harmattanBrand = {
  primary: tokens.color.accent.default,
  secondary: tokens.color.palette['link-active'],
  accent: tokens.color.accent.conversations,
  dark: tokens.theme.dark.surface,
  'dark-page': tokens.theme.dark.bg,
  positive: tokens.color.accent.phone,
  negative: tokens.color.palette.warning,
  info: tokens.color.accent.default,
  warning: tokens.color.palette.attention,
} as const;

type AnyObj = Record<string, any>;
/** Build the options object for app.use(Quasar, ...): brand, icon set, dark mode, plugin defaults. */
export function harmattanQuasarOptions(extra: AnyObj = {}): AnyObj {
  const { config = {}, ...rest } = extra;
  return {
    iconSet: harmattanIconSet,
    ...rest,
    config: {
      brand: { ...harmattanBrand },
      dark: 'auto',
      ripple: false,
      // Notify = InfoBanner (top, 3000 ms, dark translucent box; styled in theme.css)
      notify: { position: 'top', timeout: 3000, textColor: 'white', actions: [], progress: false, ...(config.notify ?? {}) },
      loading: { spinner: HdQSpinnerSquircle, spinnerSize: 64, spinnerColor: 'white', backgroundColor: 'transparent', ...(config.loading ?? {}) },
      loadingBar: { color: 'primary', size: '3px', ...(config.loadingBar ?? {}) },
      ...config,
    },
  };
}

/** Default props applied to Quasar components so markup stays short (N9: flat, sentence case). */
export const harmattanDefaultProps: Record<string, AnyObj> = {
  QBtn: { noCaps: true, unelevated: true, ripple: false },
  QBtnDropdown: { noCaps: true, unelevated: true, ripple: false },
  QBtnToggle: { noCaps: true, unelevated: true, ripple: false, toggleColor: 'primary' },
  QBtnGroup: { unelevated: true },
  QTab: { noCaps: true, ripple: false },
  QRouteTab: { noCaps: true, ripple: false },
  QTabs: { noCaps: true, indicatorColor: 'transparent' },
  QCard: { flat: true },
  QInput: { outlined: true },
  QSelect: { outlined: true },
  QFile: { outlined: true },
  QField: { outlined: true },
  QChip: { ripple: false },
  QSlider: { thumbSize: '28px', trackSize: '6px' },
  QRange: { thumbSize: '28px', trackSize: '6px' },
  QFab: { unelevated: true, ripple: false },
  QFabAction: { unelevated: true, ripple: false },
  QDate: { flat: true, minimal: false },
  QTime: { flat: true },
  QStepper: { flat: true },
  QUploader: { flat: true },
  QPagination: { unelevated: true, ripple: false },
  QHeader: {},
  QToolbar: {},
};

function patchDefaults(app: App, defaults: Record<string, AnyObj>) {
  for (const [name, values] of Object.entries(defaults)) {
    const comp = app.component(name) as (Component & { props?: AnyObj }) | undefined;
    if (!comp || !comp.props) continue;
    for (const [prop, value] of Object.entries(values)) {
      const def = comp.props[prop];
      if (def === undefined) continue;
      comp.props[prop] = typeof def === 'object' && def !== null && !Array.isArray(def) ? { ...def, default: value } : { type: def, default: value };
    }
  }
}

export interface HarmattanQuasarOptions {
  /** add .hd-quasar to <body> (default true) */
  bodyClass?: boolean;
  /** apply harmattanDefaultProps (default true; needs Quasar components registered globally) */
  defaults?: boolean | Record<string, AnyObj>;
  /** keep [data-hd-theme] on <html> in sync with Quasar Dark (default true) */
  syncDark?: boolean;
}

/** Vue plugin: install AFTER Quasar. */
export const HarmattanQuasar = {
  install(app: App, opts: HarmattanQuasarOptions = {}) {
    const { bodyClass = true, defaults = true, syncDark = true } = opts;
    if (defaults) patchDefaults(app, defaults === true ? harmattanDefaultProps : defaults);
    app.component('HdQSpinnerSquircle', HdQSpinnerSquircle);
    if (typeof document === 'undefined') return;
    if (bodyClass) document.body.classList.add('hd-quasar');
    const $q = app.config.globalProperties.$q as AnyObj | undefined;
    if (syncDark && $q?.dark) {
      watch(() => $q.dark.isActive as boolean, (dark) => { document.documentElement.setAttribute('data-hd-theme', dark ? 'dark' : 'light'); }, { immediate: true });
    }
  },
};
export default HarmattanQuasar;
