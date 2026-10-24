/**
 * Original line icons drawn for the Harmattan Design Language (MIT, same as this repo).
 * NOT Nokia icons. 24x24 grid, 2px stroke, round caps: an approximation of the
 * calm, thin, monochrome N9 toolbar style. Paths are stroke-only unless noted.
 */
export const icons: Record<string, string> = {
  back: 'M15 5l-7 7 7 7',
  'chevron-right': 'M9 5l7 7-7 7',
  'chevron-down': 'M5 9l7 7 7-7',
  menu: 'M6 10l6 6 6-6',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  add: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7',
  search: 'M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM15.5 15.5L20 20',
  edit: 'M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4',
  delete: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13',
  share: 'M12 4v11M7 9l5-5 5 5M5 14v6h14v-6',
  refresh: 'M19 12a7 7 0 1 1-2-4.9M19 4v4h-4',
  settings: 'M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1',
  phone: 'M6 3h3l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v3a3 3 0 0 1-3 3A15 15 0 0 1 3 6a3 3 0 0 1 3-3z',
  message: 'M4 5h16v11H9l-5 4V5z',
  mail: 'M3 6h18v12H3zM3 6l9 7 9-7',
  person: 'M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM4 21a8 8 0 0 1 16 0',
  home: 'M4 11l8-7 8 7M6 9v11h12V9',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5',
  clock: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 7v5l3 2',
  music: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  photo: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M15.5 8.5h.01',
  info: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 11v6M12 7.5h.01',
  warning: 'M12 3l10 18H2L12 3zM12 10v5M12 18h.01',
  wifi: 'M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01',
  battery: 'M3 8h16v8H3zM21 11v2',
  globe: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18',
  lock: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  bluetooth: 'M7 7l10 10-5 4V3l5 4L7 17',
  play: 'M7 4l13 8-13 8z',
};
export type IconName = keyof typeof icons;
