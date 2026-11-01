/** Types and the injection key of the shared desktop (XShell.vue). */
import type { InjectionKey } from 'vue';
import type { IconTone } from '../../lighting';
import type { XMenuItem } from '../parts/types';
import type { WindowManager } from './windowManager';

/** an app the desktop can open: in the dock (unless pinned is false), the Overview and Search */
export interface ShellApp { id: string; title: string; icon: string; color: string; tone?: IconTone; pinned?: boolean }
export interface ShellMenu { label: string; items: XMenuItem[] }
/** what a page inside a window can do with the desktop: open another app as a window instead of leaving the desktop */
export interface ShellApi { open(id: string): void; close(id: string): void; wm: WindowManager }
export const SHELL: InjectionKey<ShellApi> = Symbol('etesian-shell');
