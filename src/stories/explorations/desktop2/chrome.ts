/** Desktop v2: what each mock app puts in its window header bar and in the global menu bar. */
import type { XAction } from '../parts/types';
export interface WinChrome { title: string; back?: boolean; actions: XAction[]; menus: string[]; address?: string; views?: string[] }
export const CHROME: Record<string, WinChrome> = {
  Mail: { title: 'Inbox', actions: [{ icon: 'add', label: 'Compose', keys: 'Ctrl+N' }, { icon: 'search', label: 'Search', keys: 'Ctrl+F' }, { icon: 'refresh', label: 'Refresh', keys: 'F5' }],
    menus: ['File', 'Edit', 'View', 'Message', 'Help'], views: ['Inbox', 'Sent', 'Drafts', 'Archive', 'Junk'] },
  Messages: { title: 'Anna Virtanen', back: true, actions: [{ icon: 'phone', label: 'Call', keys: 'Ctrl+Shift+C' }], menus: ['File', 'Edit', 'Conversation', 'Help'] },
  Calendar: { title: 'October 2026', actions: [{ icon: 'add', label: 'New event', keys: 'Ctrl+N' }], menus: ['File', 'Edit', 'View', 'Go', 'Help'], views: ['Month', 'Week', 'Agenda'] },
  Browser: { title: 'Etesian journal', back: true, address: 'journal.example/tablet-swipe', actions: [{ icon: 'refresh', label: 'Reload', keys: 'Ctrl+R' }, { icon: 'star', label: 'Bookmark', keys: 'Ctrl+D' }], menus: ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Help'] },
  Music: { title: 'Now playing', actions: [{ icon: 'share', label: 'Share' }], menus: ['File', 'Playback', 'View', 'Help'] },
  Notes: { title: 'Tablet ideas', actions: [{ icon: 'add', label: 'New note', keys: 'Ctrl+N' }, { icon: 'share', label: 'Share' }], menus: ['File', 'Edit', 'Format', 'Help'] },
  Gallery: { title: 'Lapland', back: true, actions: [{ icon: 'share', label: 'Share' }, { icon: 'play', label: 'Slideshow', keys: 'F5' }], menus: ['File', 'Edit', 'View', 'Help'] },
  Settings: { title: 'Settings', actions: [{ icon: 'search', label: 'Search', keys: 'Ctrl+F' }], menus: ['File', 'Help'] },
};
export const chromeOf = (app: string): WinChrome => CHROME[app] ?? { title: app, actions: [], menus: ['File', 'Edit', 'Help'] };
