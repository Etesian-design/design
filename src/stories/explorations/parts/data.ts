/** Shared mock data for the Explorations (tablet / desktop) mockups. All content is invented. */
export interface XApp { name: string; icon: string; color: string; tone?: 'colour' | 'light' }
export const APPS: XApp[] = [
  { name: 'Phone', icon: 'phone', color: '#62B700' }, { name: 'Messages', icon: 'message', color: '#09A7CC' },
  { name: 'Contacts', icon: 'person', color: '#007DC9' }, { name: 'Mail', icon: 'mail', color: '#0067BC' },
  { name: 'Browser', icon: 'globe', color: '#2EA8C7' }, { name: 'Gallery', icon: 'photo', color: '#821DDE' },
  { name: 'Music', icon: 'music', color: '#CC09BA' }, { name: 'Calendar', icon: 'calendar', color: '#EF5500' },
  { name: 'Clock', icon: 'clock', color: '#FFFFFF', tone: 'light' }, { name: 'Feeds', icon: 'share', color: '#FF8500' },
  { name: 'Notes', icon: 'edit', color: '#F2B111' }, { name: 'Videos', icon: 'play', color: '#D9001E' },
  { name: 'Maps', icon: 'home', color: '#60AD00' }, { name: 'Store', icon: 'star', color: '#1C51AF' },
  { name: 'Files', icon: 'info', color: '#7B7B7B' }, { name: 'Sharing', icon: 'bluetooth', color: '#0093D0' },
  { name: 'Security', icon: 'lock', color: '#505050' }, { name: 'Settings', icon: 'settings', color: '#505050' },
];
export const app = (name: string): XApp => APPS.find((a) => a.name === name) ?? APPS[0]!;
export const FAVOURITES = ['Phone', 'Messages', 'Mail', 'Browser', 'Gallery', 'Music', 'Calendar', 'Settings'];

/** Generated "photo": a small landscape as an SVG data URI (no real images ship with the library). */
export function photo(seed: number): string {
  const hues = [[205, 30], [28, 200], [140, 35], [265, 190], [12, 45], [180, 220], [320, 40], [45, 210]];
  const [h1, h2] = hues[seed % hues.length]!;
  const y = 52 + ((seed * 7) % 18);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid slice'>
<defs><linearGradient id='s' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='hsl(${h1} 70% 72%)'/><stop offset='1' stop-color='hsl(${h2} 65% 86%)'/></linearGradient></defs>
<rect width='100' height='100' fill='url(#s)'/><circle cx='${25 + ((seed * 13) % 50)}' cy='${22 + (seed % 3) * 6}' r='${7 + (seed % 4)}' fill='hsl(${h2} 90% 92%)'/>
<path d='M0 ${y}Q25 ${y - 18} 50 ${y - 4}T100 ${y - 10}V100H0Z' fill='hsl(${h1} 35% 38%)'/>
<path d='M0 ${y + 16}Q30 ${y + 2} 60 ${y + 14}T100 ${y + 10}V100H0Z' fill='hsl(${h1} 40% 24%)'/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const MAILS = [
  { id: 1, from: 'Anna Virtanen', subject: 'Lunch on Friday?', preview: 'Are we still on for lunch? I can be there by 12:30 if that works for you.', time: '12:02', unread: true },
  { id: 2, from: 'Design weekly', subject: 'Why squircles feel softer', preview: 'This week: superellipses, continuous curvature and the N9 icon grid.', time: '10:41', unread: true },
  { id: 3, from: 'Mikko Laine', subject: 'Photos from the trip', preview: 'I uploaded the rest of the photos from Lapland, have a look when you can.', time: '09:15', unread: false },
  { id: 4, from: 'Calendar', subject: 'Invitation: Design review', preview: 'Thursday 14:00 - 15:00, Room Etesian. Please confirm.', time: 'Yesterday', unread: false },
  { id: 5, from: 'Sara Koski', subject: 'Re: Tablet layout', preview: 'I like the two-pane idea, but portrait should stay a single list.', time: 'Yesterday', unread: false },
  { id: 6, from: 'Store', subject: 'Your receipt', preview: 'Thank you for your purchase of Notes Pro.', time: 'Mon', unread: false },
  { id: 7, from: 'Jussi Heikkinen', subject: 'Bluetooth keyboard', preview: 'The keyboard arrived, the Super key works out of the box.', time: 'Mon', unread: false },
  { id: 8, from: 'Feeds', subject: 'Weekly digest', preview: '12 new articles from the sources you follow.', time: 'Sun', unread: false },
];
export const PEOPLE = ['Anna Virtanen', 'Mikko Laine', 'Sara Koski', 'Jussi Heikkinen', 'Liisa Niemi', 'Olli Mäkelä'];
