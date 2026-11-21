/**
 * App art: the drawings on Etesian's app icons. Original drawings for this project (AGPL-3.0-only), not Nokia's and not any icon
 * pack's. Each is a filled object on a 24 px grid, drawn at about two thirds of the squircle (HdAppIcon, and the Plasma
 * icon theme generated from this file), lit like the N9's icons: the object in the off-white `ink` gradient, cut-outs in
 * the tile's own dark colour (`cut`), and at most one or two small accents from the palette.
 * Rules: chunky shapes (no stroke under 1.6), the object fills the grid's middle 20 px, no text.
 */
export interface ArtPaint { ink: string; cut: string; red: string; yellow: string; green: string; blue: string; white: string }

/** The accents, from the app palette (src/shell/parts/data.ts). */
export const ART_ACCENTS = { red: '#D9001E', yellow: '#EFBB00', green: '#62B700', blue: '#0093D0', white: '#FFFFFF' } as const;

/** A gear of n teeth around (12, 12): outer radius ro, root radius ri. */
function gear(n: number, ro: number, ri: number): string {
  const pts: string[] = [];
  for (let i = 0; i < n * 4; i++) {
    const a = (i / (n * 4)) * 2 * Math.PI - Math.PI / 2, r = i % 4 === 1 || i % 4 === 2 ? ro : ri;
    pts.push(`${(12 + r * Math.cos(a)).toFixed(2)},${(12 + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}

const handset = 'M6.6 3h2.5c.7 0 1.2.4 1.4 1l1 3.3c.2.6 0 1.3-.5 1.7l-1.5 1.1a11.5 11.5 0 0 0 5 5l1.1-1.5c.4-.5 1.1-.7 1.7-.5l3.3 1c.6.2 1 .8 1 1.4v2.5c0 1.6-1.3 2.9-2.9 2.9C10.4 20.9 3.1 13.6 3.1 6 3.1 4.3 4.4 3 6 3z';

export const APP_ART: Record<string, (k: ArtPaint) => string> = {
  // --- the phone's apps ---
  phone: (k) => `<path d="${handset}" fill="${k.ink}"/>`,
  message: (k) => `<path d="M7 4h10a4.5 4.5 0 0 1 4.5 4.5v4A4.5 4.5 0 0 1 17 17h-6l-4.5 3.5V17A4.5 4.5 0 0 1 2.5 12.5v-4A4.5 4.5 0 0 1 7 4z" fill="${k.ink}"/>
<circle cx="8" cy="10.5" r="1.4" fill="${k.cut}"/><circle cx="12" cy="10.5" r="1.4" fill="${k.cut}"/><circle cx="16" cy="10.5" r="1.4" fill="${k.cut}"/>`,
  person: (k) => `<circle cx="12" cy="8" r="4.6" fill="${k.ink}"/><path d="M3.5 21c0-4.6 3.8-7.6 8.5-7.6s8.5 3 8.5 7.6z" fill="${k.ink}"/>`,
  mail: (k) => `<rect x="2.5" y="5" width="19" height="14" rx="2.2" fill="${k.ink}"/><path d="M3.6 6.6 12 13l8.4-6.4" fill="none" stroke="${k.cut}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>`,
  globe: (k) => `<circle cx="12" cy="12" r="9.5" fill="${k.ink}"/>
<path d="M2.5 12h19M12 2.5c3.1 3.4 3.1 15.6 0 19M12 2.5c-3.1 3.4-3.1 15.6 0 19M4 7h16M4 17h16" fill="none" stroke="${k.cut}" stroke-width="1.6" opacity=".55"/>`,
  photo: (k) => `<rect x="2.5" y="4" width="19" height="16" rx="2.2" fill="${k.ink}"/><rect x="4.5" y="6" width="15" height="12" rx="1" fill="${k.cut}" opacity=".45"/>
<path d="M4.5 18l5-6 3.5 4 2-2.2 4.5 4.2z" fill="${k.ink}"/><circle cx="16" cy="9.5" r="1.8" fill="${k.yellow}"/>`,
  music: (k) => `<path d="M9 5.8 20 3v12.2" fill="none" stroke="${k.ink}" stroke-width="2.4" stroke-linejoin="round"/><path d="M9 5.8V18" stroke="${k.ink}" stroke-width="2.4"/>
<ellipse cx="6.4" cy="18" rx="3.4" ry="2.8" fill="${k.ink}"/><ellipse cx="17.4" cy="15.2" rx="3.4" ry="2.8" fill="${k.ink}"/>`,
  calendar: (k) => `<rect x="3" y="4.5" width="18" height="16.5" rx="2.2" fill="${k.ink}"/><path d="M3 9.5V6.7c0-1.2 1-2.2 2.2-2.2h13.6c1.2 0 2.2 1 2.2 2.2v2.8z" fill="${k.cut}"/>
<rect x="7" y="2.5" width="2.2" height="4.5" rx="1.1" fill="${k.ink}"/><rect x="14.8" y="2.5" width="2.2" height="4.5" rx="1.1" fill="${k.ink}"/>
<path d="M6 12.5h2.4v2.4H6zM10.8 12.5h2.4v2.4h-2.4zM15.6 12.5H18v2.4h-2.4zM6 16.8h2.4v2.4H6zM10.8 16.8h2.4v2.4h-2.4z" fill="${k.cut}" opacity=".5"/><path d="M15.6 16.8H18v2.4h-2.4z" fill="${k.red}"/>`,
  clock: (k) => `<circle cx="12" cy="12" r="9.5" fill="${k.ink}"/>
<path d="M12 4.2v1.6M12 18.2v1.6M4.2 12h1.6M18.2 12h1.6" stroke="${k.white}" stroke-width="1.6" stroke-linecap="round"/>
<path d="M12 12V7M12 12l3.6 2.2" stroke="${k.white}" stroke-width="1.9" stroke-linecap="round"/><path d="M12 12l-3.8 4.6" stroke="${k.red}" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="1.3" fill="${k.red}"/>`,
  feeds: (k) => `<circle cx="5.8" cy="18.2" r="2.6" fill="${k.ink}"/><path d="M3.5 10.6a9.9 9.9 0 0 1 9.9 9.9M3.5 4a16.5 16.5 0 0 1 16.5 16.5" fill="none" stroke="${k.ink}" stroke-width="3" stroke-linecap="round"/>`,
  notes: (k) => `<rect x="3.5" y="3" width="14" height="18" rx="1.8" fill="${k.ink}"/><path d="M6.5 8h8M6.5 11.5h8M6.5 15h5" stroke="${k.cut}" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>
<path d="M20.6 8.4 13.4 15.6l-.9 3.1 3.1-.9 7.2-7.2z" fill="${k.cut}"/><path d="M20.6 8.4l2.2 2.2" stroke="${k.ink}" stroke-width="1.6"/>`,
  videos: (k) => `<rect x="2.5" y="9" width="19" height="12" rx="1.8" fill="${k.ink}"/><path d="M2.6 4.6 20.2 2.2l.6 4.6L3.2 9.2z" fill="${k.ink}"/>
<path d="M6.2 4.1 8.4 8.6M11 3.5l2.2 4.5M15.8 2.8l2.2 4.5" stroke="${k.cut}" stroke-width="1.8"/><path d="M10 12.2v5.6l4.8-2.8z" fill="${k.cut}"/>`,
  maps: (k) => `<path d="M2.5 6.5 8.5 4l7 2.5 6-2.5v13.5l-6 2.5-7-2.5-6 2.5z" fill="${k.ink}"/><path d="M8.5 4v13.5M15.5 6.5V20" stroke="${k.cut}" stroke-width="1.6" opacity=".45"/>
<path d="M15.5 4.5a3.6 3.6 0 0 1 3.6 3.6c0 2.7-3.6 6.4-3.6 6.4s-3.6-3.7-3.6-6.4a3.6 3.6 0 0 1 3.6-3.6z" fill="${k.red}"/><circle cx="15.5" cy="8.1" r="1.3" fill="${k.white}"/>`,
  store: (k) => `<path d="M8 8V6.8a4 4 0 0 1 8 0V8" fill="none" stroke="${k.ink}" stroke-width="2.2"/><path d="M4.5 8h15l-1 12.2c-.1 1-.9 1.8-1.9 1.8H7.4c-1 0-1.8-.8-1.9-1.8z" fill="${k.ink}"/>
<path d="M12 10.8l1.3 2.7 2.9.4-2.1 2 .5 2.9-2.6-1.4-2.6 1.4.5-2.9-2.1-2 2.9-.4z" fill="${k.yellow}"/>`,
  files: (k) => `<path d="M2.5 6.2c0-1 .8-1.7 1.7-1.7h5l2 2.2h8.6c1 0 1.7.8 1.7 1.7V18c0 1-.8 1.7-1.7 1.7H4.2c-1 0-1.7-.8-1.7-1.7z" fill="${k.ink}" opacity=".7"/>
<path d="M2.5 9.7c0-.9.8-1.7 1.7-1.7h15.6c1 0 1.7.8 1.7 1.7V18c0 1-.8 1.7-1.7 1.7H4.2c-1 0-1.7-.8-1.7-1.7z" fill="${k.ink}"/>`,
  sharing: (k) => `<path d="M6.5 7.5l10 9-4.5 4V3.5l4.5 4-10 9" fill="none" stroke="${k.ink}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`,
  security: (k) => `<path d="M7.5 10.5V7.8a4.5 4.5 0 0 1 9 0v2.7" fill="none" stroke="${k.ink}" stroke-width="2.6"/><rect x="4.5" y="10" width="15" height="11.5" rx="2.2" fill="${k.ink}"/>
<circle cx="12" cy="14.6" r="1.8" fill="${k.cut}"/><path d="M12 15.5v3" stroke="${k.cut}" stroke-width="1.8" stroke-linecap="round"/>`,
  settings: (k) => `<path d="${gear(8, 9.8, 7.6)}" fill="${k.ink}" stroke="${k.ink}" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.3" fill="${k.cut}"/>`,
  camera: (k) => `<path d="M8.5 5.5 10 3.5h4l1.5 2H19c1.4 0 2.5 1.1 2.5 2.5v10c0 1.4-1.1 2.5-2.5 2.5H5c-1.4 0-2.5-1.1-2.5-2.5V8c0-1.4 1.1-2.5 2.5-2.5z" fill="${k.ink}"/>
<circle cx="12" cy="13" r="5" fill="${k.cut}"/><circle cx="12" cy="13" r="3" fill="${k.ink}" opacity=".35"/><circle cx="10.6" cy="11.6" r="1" fill="${k.white}"/><circle cx="18.3" cy="8.4" r="1" fill="${k.cut}"/>`,
  // --- desktop apps ---
  terminal: (k) => `<rect x="2.5" y="4" width="19" height="16" rx="2.2" fill="${k.ink}"/><path d="M2.5 8V6.2c0-1.2 1-2.2 2.2-2.2h14.6c1.2 0 2.2 1 2.2 2.2V8z" fill="${k.cut}" opacity=".55"/>
<path d="M6.5 11.5l3 2.5-3 2.5M11.5 17h6" fill="none" stroke="${k.cut}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`,
  calculator: (k) => `<rect x="4.5" y="2.5" width="15" height="19" rx="2.2" fill="${k.ink}"/><rect x="6.5" y="4.5" width="11" height="4.2" rx=".8" fill="${k.cut}"/>
<path d="M6.8 11h2.4v2.2H6.8zM10.8 11h2.4v2.2h-2.4zM6.8 14.6h2.4v2.2H6.8zM10.8 14.6h2.4v2.2h-2.4zM6.8 18.2h2.4v1.6H6.8zM10.8 18.2h2.4v1.6h-2.4z" fill="${k.cut}" opacity=".55"/>
<rect x="14.8" y="11" width="2.4" height="8.8" rx=".6" fill="${k.red}"/>`,
  document: (k) => `<path d="M5 2.5h9.5l4.5 4.5v13c0 .8-.7 1.5-1.5 1.5h-12c-.8 0-1.5-.7-1.5-1.5V4c0-.8.7-1.5 1.5-1.5z" fill="${k.ink}"/><path d="M14.5 2.5V7H19z" fill="${k.cut}" opacity=".5"/>
<path d="M7.5 11h9M7.5 14h9M7.5 17h6" stroke="${k.cut}" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>`,
  info: (k) => `<circle cx="12" cy="12" r="9.5" fill="${k.ink}"/><circle cx="12" cy="7.6" r="1.6" fill="${k.cut}"/><path d="M12 11v6.5" stroke="${k.cut}" stroke-width="2.6" stroke-linecap="round"/>`,
  help: (k) => `<circle cx="12" cy="12" r="9.5" fill="${k.ink}"/><path d="M9.2 9.4a2.9 2.9 0 1 1 4.3 2.5c-.9.5-1.5 1.1-1.5 2.1v.4" fill="none" stroke="${k.cut}" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="17.4" r="1.4" fill="${k.cut}"/>`,
  weather: (k) => `<circle cx="15" cy="8.5" r="4.5" fill="${k.yellow}"/><path d="M7.5 20h10a4 4 0 0 0 .3-8 5.5 5.5 0 0 0-10.6 1.2A3.4 3.4 0 0 0 7.5 20z" fill="${k.ink}"/>`,
  monitor: (k) => `<rect x="2.5" y="3.5" width="19" height="13.5" rx="2" fill="${k.ink}"/><path d="M5 13.5l3.4-4 2.8 2.6 3.5-5 3.3 3.6" fill="none" stroke="${k.green}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M9 21h6M12 17v4" stroke="${k.ink}" stroke-width="2.2" stroke-linecap="round"/>`,
  chat: (k) => `<path d="M5.5 3h9A3.5 3.5 0 0 1 18 6.5v3.5a3.5 3.5 0 0 1-3.5 3.5H10l-3.5 3v-3h-1A3.5 3.5 0 0 1 2 10V6.5A3.5 3.5 0 0 1 5.5 3z" fill="${k.ink}" opacity=".7"/>
<path d="M11 9.5h8a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3v2.8l-3.4-2.8H11a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3z" fill="${k.ink}"/>`,
  wallet: (k) => `<rect x="2.5" y="6" width="19" height="14" rx="2.2" fill="${k.ink}"/><path d="M4.5 6 15 2.8c.9-.3 1.8.4 1.8 1.4V6" fill="${k.ink}" opacity=".7"/>
<rect x="14" y="11" width="7.5" height="4.5" rx="1.2" fill="${k.cut}"/><circle cx="16.4" cy="13.25" r="1" fill="${k.yellow}"/>`,
  // --- KDE and other desktop apps the N9 had no counterpart for ---
  archive: (k) => `<rect x="2.5" y="3.5" width="19" height="5.5" rx="1.4" fill="${k.ink}"/><path d="M3.8 10h16.4v9.2c0 1-.8 1.8-1.8 1.8H5.6c-1 0-1.8-.8-1.8-1.8z" fill="${k.ink}"/>
<rect x="10.6" y="10" width="2.8" height="11" fill="${k.cut}"/><path d="M10.6 12h1.4M12 14h1.4M10.6 16h1.4M12 18h1.4" stroke="${k.ink}" stroke-width="1.6"/><rect x="9.8" y="5.3" width="4.4" height="2" rx="1" fill="${k.cut}"/>`,
  brush: (k) => `<path d="M3 21.5c3.2-.2 6.6-1.8 10.2-5.4" fill="none" stroke="${k.yellow}" stroke-width="3" stroke-linecap="round"/>
<path d="M21 3 13.4 10.6" stroke="${k.ink}" stroke-width="3.4" stroke-linecap="round"/><path d="M14.3 9.7 12.2 7.6l-1.7 1.7 2.1 2.1z" fill="${k.cut}"/>
<path d="M10.8 10.8c1.2 1.2 1.2 3-.2 4.4-1.5 1.5-4.1 2-6.5 1.4.7-1.8 1-3.7 2.5-5.2 1.4-1.4 3.1-1.7 4.2-.6z" fill="${k.ink}"/>`,
  film: (k) => `<rect x="2" y="4.5" width="20" height="15" rx="1.8" fill="${k.ink}"/>
<path d="M4 6.5h2v2H4zM8 6.5h2v2H8zM12 6.5h2v2h-2zM16 6.5h2v2h-2zM4 15.5h2v2H4zM8 15.5h2v2H8zM12 15.5h2v2h-2zM16 15.5h2v2h-2z" fill="${k.cut}"/><path d="M9.8 9.6v4.8l4.4-2.4z" fill="${k.red}"/>`,
  cards: (k) => `<g transform="rotate(-14 9 13)"><rect x="3" y="4.5" width="11" height="15.5" rx="1.6" fill="${k.ink}"/><rect x="4.6" y="6.1" width="7.8" height="12.3" rx=".9" fill="${k.cut}" opacity=".55"/></g>
<g transform="rotate(10 15 12)"><rect x="9.5" y="3.5" width="11" height="15.5" rx="1.6" fill="${k.ink}"/>
<path d="M15 15.4c-2.6-1.9-3.8-3.2-3.8-4.6a1.9 1.9 0 0 1 3.8-.6 1.9 1.9 0 0 1 3.8.6c0 1.4-1.2 2.7-3.8 4.6z" fill="${k.red}"/></g>`,
  mine: (k) => `<path d="M10 4v2.5M10 17.5V20M2 12h2.5M15.5 12H18M4.3 6.3l1.8 1.8M13.9 15.9l1.8 1.8M4.3 17.7l1.8-1.8M13.9 8.1l1.8-1.8" stroke="${k.ink}" stroke-width="2.4" stroke-linecap="round"/>
<circle cx="10" cy="12" r="6" fill="${k.ink}"/><circle cx="10" cy="12" r="6" fill="${k.cut}" opacity=".35"/><circle cx="8.2" cy="10.2" r="1.7" fill="${k.ink}"/>
<path d="M19.5 21.5V4.5" stroke="${k.ink}" stroke-width="1.8" stroke-linecap="round"/><path d="M19.5 4.5l3.5 2.2-3.5 2.2z" fill="${k.red}"/>`,
  tiles: (k) => `<rect x="9" y="2.5" width="12" height="16" rx="2" fill="${k.ink}" opacity=".7"/><rect x="3" y="5.5" width="12" height="16" rx="2" fill="${k.ink}"/>
<circle cx="6.7" cy="9.7" r="1.7" fill="${k.green}"/><circle cx="11.3" cy="9.7" r="1.7" fill="${k.blue}"/><circle cx="9" cy="13.5" r="1.7" fill="${k.red}"/>
<circle cx="6.7" cy="17.3" r="1.7" fill="${k.blue}"/><circle cx="11.3" cy="17.3" r="1.7" fill="${k.green}"/>`,
  sudoku: (k) => `<rect x="2.5" y="2.5" width="19" height="19" rx="2" fill="${k.ink}"/><path d="M8.8 2.5v19M15.2 2.5v19M2.5 8.8h19M2.5 15.2h19" stroke="${k.cut}" stroke-width="1.6" opacity=".55"/>
<rect x="9.6" y="9.6" width="4.8" height="4.8" rx=".6" fill="${k.blue}"/><circle cx="5.6" cy="5.6" r="1.3" fill="${k.cut}"/><circle cx="18.4" cy="18.4" r="1.3" fill="${k.cut}"/>`,
  dice: (k) => `<g transform="rotate(-8 12 12)"><rect x="3.5" y="3.5" width="17" height="17" rx="3.6" fill="${k.ink}"/>
<circle cx="8" cy="8" r="1.6" fill="${k.cut}"/><circle cx="16" cy="8" r="1.6" fill="${k.cut}"/><circle cx="12" cy="12" r="1.6" fill="${k.red}"/><circle cx="8" cy="16" r="1.6" fill="${k.cut}"/><circle cx="16" cy="16" r="1.6" fill="${k.cut}"/></g>`,
  letter: (k) => `<rect x="2.5" y="2.5" width="19" height="19" rx="3" fill="${k.ink}"/><path d="M7 18l5-12 5 12M8.8 14h6.4" fill="none" stroke="${k.cut}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  log: (k) => `<rect x="4" y="2.5" width="16" height="19" rx="2" fill="${k.ink}"/>
<path d="M7 7h1.6M7 11h1.6M7 15h1.6" stroke="${k.cut}" stroke-width="1.8" stroke-linecap="round"/><path d="M11 7h6M11 11h6M11 15h4" stroke="${k.cut}" stroke-width="1.8" stroke-linecap="round" opacity=".55"/><path d="M7 19h1.6" stroke="${k.red}" stroke-width="1.8" stroke-linecap="round"/>`,
  remote: (k) => `<rect x="2" y="3" width="20" height="14" rx="2" fill="${k.ink}"/><path d="M9 21h6M12 17v4" stroke="${k.ink}" stroke-width="2.2" stroke-linecap="round"/>
<rect x="9" y="6.5" width="10" height="7" rx="1" fill="${k.cut}" opacity=".55"/><path d="M5 12.5 9.5 8M9.5 8H6.5M9.5 8v3" fill="none" stroke="${k.blue}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  download: (k) => `<path d="M12 2.5v11" stroke="${k.ink}" stroke-width="3" stroke-linecap="round"/><path d="M6.5 9.5 12 15l5.5-5.5" fill="none" stroke="${k.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 15.5v3.3c0 1.5 1.2 2.7 2.7 2.7h12.6c1.5 0 2.7-1.2 2.7-2.7v-3.3" fill="none" stroke="${k.ink}" stroke-width="2.6" stroke-linecap="round"/>`,
  usb: (k) => `<rect x="7" y="9" width="10" height="13" rx="2" fill="${k.ink}"/><path d="M8.5 2.5h7V9h-7z" fill="${k.ink}" opacity=".7"/>
<rect x="10" y="4.5" width="1.4" height="1.8" fill="${k.cut}"/><rect x="12.6" y="4.5" width="1.4" height="1.8" fill="${k.cut}"/><circle cx="12" cy="15.5" r="1.8" fill="${k.green}"/>`,
  menu: (k) => `<rect x="2.5" y="3" width="19" height="18" rx="2.2" fill="${k.ink}"/><path d="M6.5 8h11M6.5 12h7M6.5 16h11" stroke="${k.cut}" stroke-width="2" stroke-linecap="round"/><circle cx="17.5" cy="12" r="1.5" fill="${k.blue}"/>`,
  bug: (k) => `<path d="M3.5 9.5 7 11M20.5 9.5 17 11M3 14.5h4M21 14.5h-4M4 20l3.5-2.5M20 20l-3.5-2.5M9 4.5l1.6 2M15 4.5l-1.6 2" stroke="${k.ink}" stroke-width="1.8" stroke-linecap="round"/>
<ellipse cx="12" cy="14.5" rx="5.2" ry="6.5" fill="${k.ink}"/><path d="M8 8.8a4 4 0 0 1 8 0z" fill="${k.ink}"/><path d="M12 9v12" stroke="${k.cut}" stroke-width="1.6"/>
<circle cx="9.8" cy="13" r="1" fill="${k.cut}"/><circle cx="14.2" cy="17" r="1" fill="${k.cut}"/>`,
  vm: (k) => `<rect x="2" y="3" width="20" height="14" rx="2" fill="${k.ink}"/><path d="M9 21h6M12 17v4" stroke="${k.ink}" stroke-width="2.2" stroke-linecap="round"/>
<rect x="6" y="6" width="12" height="8" rx="1" fill="${k.cut}"/><rect x="7.6" y="7.6" width="8.8" height="4.8" rx=".6" fill="${k.ink}" opacity=".85"/><path d="M7.6 9h8.8" stroke="${k.blue}" stroke-width="1.4"/>`,
  package: (k) => `<path d="M12 2.5 21 7v10l-9 4.5L3 17V7z" fill="${k.ink}"/><path d="M3 7l9 4.5L21 7M12 11.5v10" fill="none" stroke="${k.cut}" stroke-width="1.6" opacity=".55" stroke-linejoin="round"/>
<path d="M7.5 4.7l9 4.5v3.3" fill="none" stroke="${k.yellow}" stroke-width="2" stroke-linejoin="round"/>`,
  qr: (k) => `<rect x="2.5" y="2.5" width="19" height="19" rx="2.6" fill="${k.ink}"/>
<path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5z" fill="${k.cut}"/><path d="M6.6 6.6h1.8v1.8H6.6zM15.6 6.6h1.8v1.8h-1.8zM6.6 15.6h1.8v1.8H6.6z" fill="${k.ink}"/>
<path d="M14 14h2.2v2.2H14zM16.8 16.8H19V19h-2.2zM14 17.6h1.4V19H14zM17.6 14H19v1.4h-1.4z" fill="${k.cut}"/>`,
  formula: (k) => `<rect x="2.5" y="2.5" width="19" height="19" rx="3" fill="${k.ink}"/><path d="M16.5 7H7.5l4.5 5-4.5 5h9" fill="none" stroke="${k.cut}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  sheet: (k) => `<rect x="2.5" y="3" width="19" height="18" rx="2" fill="${k.ink}"/><path d="M2.5 7.2V5c0-1.1.9-2 2-2h15c1.1 0 2 .9 2 2v2.2z" fill="${k.cut}" opacity=".55"/>
<path d="M2.5 11.5h19M2.5 16h19M9 7.2V21M15 7.2V21" stroke="${k.cut}" stroke-width="1" opacity=".55"/><rect x="9" y="11.5" width="6" height="4.5" fill="${k.green}"/>
<path d="M16.6 20v-2.4M18.3 20v-3.6M20 20v-1.6" stroke="${k.blue}" stroke-width="1.6"/>`,
  slides: (k) => `<rect x="2" y="3" width="20" height="14" rx="2" fill="${k.ink}"/><path d="M12 17v4M8.5 21.5 12 19l3.5 2.5" fill="none" stroke="${k.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.5 7.5h7M5.5 11h5" stroke="${k.cut}" stroke-width="1.8" stroke-linecap="round" opacity=".6"/><path d="M16 6.5a3.8 3.8 0 1 1-3.8 3.8H16z" fill="${k.red}"/>`,
  shapes: (k) => `<rect x="2.5" y="12" width="9" height="9" rx="1.2" fill="${k.ink}"/><path d="M16.5 2.5 22 12H11z" fill="${k.ink}"/><circle cx="17.5" cy="17.5" r="4" fill="${k.yellow}"/>`,
  shield: (k) => `<path d="M12 2.5 20 5.5v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10v-6z" fill="${k.ink}"/><path d="M8.5 12l2.5 2.5 4.6-4.8" fill="none" stroke="${k.green}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  emoji: (k) => `<circle cx="12" cy="12" r="9.5" fill="${k.ink}"/><circle cx="8.8" cy="9.8" r="1.5" fill="${k.cut}"/><circle cx="15.2" cy="9.8" r="1.5" fill="${k.cut}"/>
<path d="M7.5 13.8c1 2.2 2.7 3.4 4.5 3.4s3.5-1.2 4.5-3.4z" fill="${k.cut}"/>`,
  bell: (k) => `<path d="M12 3a6 6 0 0 1 6 6v4.5l2 2.8v1.2H4v-1.2l2-2.8V9a6 6 0 0 1 6-6z" fill="${k.ink}"/><path d="M9.5 19.5a2.5 2.5 0 0 0 5 0z" fill="${k.ink}"/><circle cx="18" cy="5" r="2.6" fill="${k.red}"/>`,
  pen: (k) => `<path d="M17.2 2.8l4 4L9 19l-5.5 1.5L5 15z" fill="${k.ink}"/><path d="M15 5l4 4" stroke="${k.cut}" stroke-width="1.6"/><path d="M5 15l4 4-5.5 1.5z" fill="${k.cut}" opacity=".6"/>`,
  keyboard: (k) => `<rect x="1.5" y="6" width="21" height="13" rx="2.2" fill="${k.ink}"/>
<path d="M4.5 9h2v2h-2zM8 9h2v2H8zM11.5 9h2v2h-2zM15 9h2v2h-2zM18.5 9h1.5v2h-1.5zM5.5 12.5h2v2h-2zM9 12.5h2v2H9zM12.5 12.5h2v2h-2zM16 12.5h2v2h-2z" fill="${k.cut}" opacity=".55"/>
<rect x="7" y="16" width="10" height="1.8" rx=".9" fill="${k.cut}"/>`,
  font: (k) => `<path d="M3 20 9 4h2.6l6 16h-3.2l-1.4-4H7.6l-1.4 4zM8.5 13.2h4.6L10.8 6.6z" fill="${k.ink}" fill-rule="evenodd"/><circle cx="18.5" cy="17.5" r="3.5" fill="${k.ink}" opacity=".7"/>`,
  disk: (k) => `<circle cx="12" cy="12" r="9.5" fill="${k.ink}"/><path d="M12 12V2.5A9.5 9.5 0 0 1 20.2 16.8z" fill="${k.blue}"/><circle cx="12" cy="12" r="2.4" fill="${k.cut}"/>`,
  scanner: (k) => `<path d="M5 12.5 6.5 6c.2-.9 1-1.5 1.9-1.5h7.2c.9 0 1.7.6 1.9 1.5L19 12.5z" fill="${k.ink}" opacity=".7"/><rect x="2.5" y="12" width="19" height="7.5" rx="1.8" fill="${k.ink}"/>
<path d="M5 12h14" stroke="${k.green}" stroke-width="1.6"/><rect x="5.5" y="15.2" width="5" height="1.6" rx=".8" fill="${k.cut}"/>`,
  rss: (k) => `<rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="${k.ink}"/><circle cx="7.6" cy="16.4" r="1.9" fill="${k.cut}"/>
<path d="M6 10.6a7.4 7.4 0 0 1 7.4 7.4M6 5.8A12.2 12.2 0 0 1 18.2 18" fill="none" stroke="${k.cut}" stroke-width="2.3" stroke-linecap="round"/>`,
  alarm: (k) => `<circle cx="12" cy="13" r="8" fill="${k.ink}"/><path d="M3.5 6.5l3.5-3M20.5 6.5 17 3.5" stroke="${k.ink}" stroke-width="2.4" stroke-linecap="round"/>
<path d="M12 9v4.2l2.8 1.8" stroke="${k.cut}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 21l1.5-1.6M18 21l-1.5-1.6" stroke="${k.ink}" stroke-width="2" stroke-linecap="round"/>`,
  hourglass: (k) => `<path d="M5.5 2.5h13M5.5 21.5h13" stroke="${k.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M7 3.5h10v2.6c0 2.3-2 4.3-3.6 5.9 1.6 1.6 3.6 3.6 3.6 5.9v2.6H7v-2.6c0-2.3 2-4.3 3.6-5.9C9 10.4 7 8.4 7 6.1z" fill="${k.ink}"/>
<path d="M9.2 19h5.6c-.4-1.6-1.6-2.6-2.8-3.6-1.2 1-2.4 2-2.8 3.6zM10 7h4c-.5.9-1.2 1.7-2 2.5-.8-.8-1.5-1.6-2-2.5z" fill="${k.yellow}"/>`,
  accessibility: (k) => `<circle cx="12" cy="12" r="9.5" fill="${k.ink}"/><circle cx="12" cy="7" r="1.7" fill="${k.cut}"/>
<path d="M7 9.8l5 1.2 5-1.2M12 11v3.5l-2.6 4.5M12 14.5l2.6 4.5" fill="none" stroke="${k.cut}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`,
  wrench: (k) => `<path d="M15.2 2.6a5.4 5.4 0 0 0-5 7.3L3.5 16.6a2.2 2.2 0 0 0 3.1 3.1l6.7-6.7a5.4 5.4 0 0 0 7.3-5L17.4 11l-3.1-.8-.8-3.1 3.2-3.2c-.5-.2-1-.3-1.5-.3z" fill="${k.ink}"/><circle cx="5.3" cy="18.1" r="1" fill="${k.cut}"/>`,
  search: (k) => `<circle cx="10" cy="10" r="7" fill="${k.ink}"/><circle cx="10" cy="10" r="4.6" fill="${k.cut}" opacity=".45"/><path d="M15.2 15.2l5.6 5.6" stroke="${k.ink}" stroke-width="3.4" stroke-linecap="round"/>
<path d="M7.6 8.2a3 3 0 0 1 2.2-1.6" stroke="${k.white}" stroke-width="1.6" stroke-linecap="round"/>`,
  split: (k) => `<rect x="2" y="3.5" width="9" height="17" rx="1.6" fill="${k.ink}"/><rect x="13" y="3.5" width="9" height="17" rx="1.6" fill="${k.ink}"/>
<path d="M4.5 8h4M4.5 11h4M4.5 14h4M15.5 8h4M15.5 14h4M15.5 17h4" stroke="${k.cut}" stroke-width="1.6" stroke-linecap="round" opacity=".5"/><path d="M15.5 11h4" stroke="${k.green}" stroke-width="1.6" stroke-linecap="round"/><path d="M4.5 17h4" stroke="${k.red}" stroke-width="1.6" stroke-linecap="round"/>`,
  power: (k) => `<circle cx="12" cy="12" r="9.5" fill="${k.ink}"/><path d="M12 6.5v5.5M8.3 8.8a5 5 0 1 0 7.4 0" fill="none" stroke="${k.cut}" stroke-width="2.2" stroke-linecap="round"/>`,
  webfiles: (k) => `<circle cx="11" cy="11" r="8.5" fill="${k.ink}"/>
<path d="M2.5 11h17M11 2.5c2.8 3.1 2.8 13.9 0 17M11 2.5c-2.8 3.1-2.8 13.9 0 17" fill="none" stroke="${k.cut}" stroke-width="1.4" opacity=".55"/>
<path d="M13.5 14.6c0-.6.5-1.1 1.1-1.1h2.6l1.2 1.2h3c.6 0 1.1.5 1.1 1.1v4.6c0 .6-.5 1.1-1.1 1.1h-6.8c-.6 0-1.1-.5-1.1-1.1z" fill="${k.yellow}"/>`,
};

/** The art's names. */
export const APP_ART_NAMES = Object.keys(APP_ART);

/** The art drawn into a box `size` px wide, as an SVG fragment: a short cast shadow, then the art. `paint` gives the
 *  paints; the shadow draws the same art in black. */
export function appArtFragment(name: string, paint: ArtPaint, size = 48): string {
  const art = APP_ART[name];
  if (!art) return '';
  const s = (size * 0.6) / 20, o = size / 2 - 12 * s, dy = size * 0.016;
  const black: ArtPaint = { ink: '#000', cut: '#000', red: '#000', yellow: '#000', green: '#000', blue: '#000', white: '#000' };
  return `<g transform="translate(${o.toFixed(2)} ${(o + dy).toFixed(2)}) scale(${s.toFixed(4)})" opacity=".22">${art(black)}</g>`
    + `<g transform="translate(${o.toFixed(2)} ${o.toFixed(2)}) scale(${s.toFixed(4)})">${art(paint)}</g>`;
}
