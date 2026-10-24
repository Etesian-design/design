/** Quasar install used by Storybook (preview.ts) and the tests: every component + UI plugins + Harmattan options. */
import * as QuasarAll from 'quasar';
import { Quasar, Notify, Dialog, Loading, BottomSheet } from 'quasar';
import type { App } from 'vue';
import { harmattanQuasarOptions, HarmattanQuasar } from '../../quasar';

export const quasarComponents = Object.fromEntries(Object.entries(QuasarAll).filter(([k]) => /^Q[A-Z]/.test(k)));
export function installQuasar(app: App) {
  app.use(Quasar, harmattanQuasarOptions({ components: quasarComponents, plugins: { Notify, Dialog, Loading, BottomSheet } }));
  app.use(HarmattanQuasar, { syncDark: false });
}
export const quasarPlugin = { install: installQuasar };
