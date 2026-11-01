/**
 * Etesian Design Language for Quasar 2.
 *
 *   import { Quasar, Notify, Dialog, Loading, BottomSheet } from 'quasar';
 *   import 'quasar/dist/quasar.css';
 *   import '@etesian-design/vue/style.css';
 *   import '@etesian-design/quasar/theme.css';
 *   import { etesianQuasarOptions, EtesianQuasar } from '@etesian-design/quasar';
 *   app.use(Quasar, etesianQuasarOptions({ plugins: { Notify, Dialog, Loading, BottomSheet } }));
 *   app.use(EtesianQuasar);
 */
import type { App, Component } from 'vue';
import { watch } from 'vue';
import { tokens } from '../tokens';
import { etesianIconSet, hdIcon, quasarExtraPaths } from './icon-set';
import HdQSpinnerSquircle from './HdQSpinnerSquircle';
import { quasarCoverage } from './coverage';

export { etesianIconSet, hdIcon, quasarExtraPaths, HdQSpinnerSquircle, quasarCoverage };

/** Quasar brand colours mapped to Etesian tokens (light "blanco"). */
export const etesianBrand = {
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
export function etesianQuasarOptions(extra: AnyObj = {}): AnyObj {
  const { config = {}, ...rest } = extra;
  return {
    iconSet: etesianIconSet,
    ...rest,
    config: {
      brand: { ...etesianBrand },
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
export const etesianDefaultProps: Record<string, AnyObj> = {
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

export interface EtesianQuasarOptions {
  /** add .hd-quasar to <body> (default true) */
  bodyClass?: boolean;
  /** apply etesianDefaultProps (default true; needs Quasar components registered globally) */
  defaults?: boolean | Record<string, AnyObj>;
  /** keep [data-hd-mode] on <html> in sync with Quasar Dark (default true): dark when $q.dark is active, else `mode` */
  syncDark?: boolean;
  /** colour mode when Quasar Dark is off: 'hybrid' (default, N9), 'light' or 'auto' */
  mode?: 'hybrid' | 'light' | 'auto';
}

/** Vue plugin: install AFTER Quasar. */
export const EtesianQuasar = {
  install(app: App, opts: EtesianQuasarOptions = {}) {
    const { bodyClass = true, defaults = true, syncDark = true, mode = 'hybrid' } = opts;
    if (defaults) patchDefaults(app, defaults === true ? etesianDefaultProps : defaults);
    app.component('HdQSpinnerSquircle', HdQSpinnerSquircle);
    if (typeof document === 'undefined') return;
    if (bodyClass) document.body.classList.add('hd-quasar');
    const $q = app.config.globalProperties.$q as AnyObj | undefined;
    if (syncDark && $q?.dark) {
      watch(() => $q.dark.isActive as boolean, (dark) => { document.documentElement.setAttribute('data-hd-mode', dark ? 'dark' : mode); }, { immediate: true });
    }
  },
};
export default EtesianQuasar;
