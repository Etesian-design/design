/**
 * Quasar icon set built from the original Etesian line icons (MIT, not Nokia, not Material).
 * Uses Quasar's inline-SVG icon string format "d@@style|viewBox", so no icon font is needed.
 */
import { icons } from '../components/icons';

const STROKE = 'fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round';
/** Extra stroke paths only needed by Quasar internals (24x24, 2px stroke, same style). */
export const quasarExtraPaths: Record<string, string> = {
  'arrow-up': 'M12 19V5M6 11l6-6 6 6',
  'arrow-down': 'M12 5v14M6 13l6 6 6-6',
  'arrow-left': 'M19 12H5M11 6l-6 6 6 6',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'chevron-left': 'M15 5l-7 7 7 7',
  'chevron-up': 'M5 15l7-7 7 7',
  'caret-down': 'M8 10l4 4 4-4',
  'cancel': 'M12 3a9 9 0 1 1 0 18 9 9 0 1 1 0-18M9 9l6 6M15 9l-6 6',
  'first': 'M6 5v14M18 5l-7 7 7 7',
  'pause': 'M8 5v14M16 5v14',
  'lines': 'M4 7h16M4 12h16M4 17h16',
  'shuffle': 'M3 7h3c5 0 6 10 11 10h4M3 17h3c2 0 3-1.5 4-3M13 10c1-1.5 2-3 4-3h4M18 4l3 3-3 3M18 14l3 3-3 3',
  'repeat': 'M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4',
  'store': 'M6 8h12l-1 12H7zM9 8V6a3 3 0 0 1 6 0v2',
  'last': 'M18 5v14M6 5l7 7-7 7',
  'dot': 'M12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 1 1 0-5',
  'tune': 'M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4',
  'palette': 'M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.5S13 18 13 17s.8-1.5 1.8-1.5H17a4 4 0 0 0 4-4C21 6.8 17 3 12 3M7.5 11h.01M10 7.5h.01M14.5 7.5h.01',
  'bold': 'M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z',
  'italic': 'M14 5h-4M14 19h-4M13 5l-2 14',
  'strike': 'M5 12h14M16 7a4 3 0 0 0-8 0c0 4 8 2 8 6a4 3 0 0 1-8 1',
  'underline': 'M7 4v7a5 5 0 0 0 10 0V4M5 20h14',
  'list-ul': 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  'list-ol': 'M10 6h10M10 12h10M10 18h10M4 5l1-1v4M4 14a1 1 0 0 1 2 0l-2 2h2',
  'sub': 'M4 5l7 9M11 5l-7 9M15 19h4l-4-3.5a1.5 1.5 0 0 1 3-1.5',
  'sup': 'M4 9l7 9M11 9l-7 9M15 8h4l-4-3.5A1.5 1.5 0 0 1 18 3',
  'link': 'M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1',
  'fullscreen': 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  'quote': 'M7 7h4v5c0 3-2 4-4 5M14 7h4v5c0 3-2 4-4 5',
  'align-left': 'M4 6h16M4 10h10M4 14h16M4 18h10',
  'align-center': 'M4 6h16M7 10h10M4 14h16M7 18h10',
  'align-right': 'M4 6h16M10 10h10M4 14h16M10 18h10',
  'align-justify': 'M4 6h16M4 10h16M4 14h16M4 18h16',
  'print': 'M7 9V4h10v5M7 17H4v-7h16v7h-3M7 14h10v6H7z',
  'outdent': 'M11 6h9M11 12h9M11 18h9M7 9l-3 3 3 3',
  'indent': 'M11 6h9M11 12h9M11 18h9M4 9l3 3-3 3',
  'clear-format': 'M6 5h12M12 5l-3 14M4 20L20 4',
  'text-size': 'M4 7V5h10v2M9 5v14M14 12h6M17 12v7',
  'minus': 'M5 12h14',
  'undo': 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
  'redo': 'M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3',
  'code': 'M9 7l-5 5 5 5M15 7l5 5-5 5',
  'font': 'M5 20L12 4l7 16M8 14h8',
  'error': 'M12 3a9 9 0 1 1 0 18 9 9 0 1 1 0-18M12 8v5M12 16h.01',
  'play-right': 'M9 6l6 6-6 6',
  'cloud-up': 'M7 18a5 5 0 0 1-.5-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9M12 12v8M9 15l3-3 3 3',
  'add-box': 'M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1M12 8v8M8 12h8',
  'clear-all': 'M5 7h14M5 12h10M5 17h6',
  'done-all': 'M2 12.5l4.5 4.5L16 7M11 15.5l1.5 1.5L22 7',
  'today': 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M10 14h4v3h-4z',
};
const all: Record<string, string> = { ...icons, ...quasarExtraPaths };
/** Quasar SVG icon string for any Etesian icon name. */
export const hdIcon = (name: string): string => `${(all[name] ?? all.info!)}@@${STROKE}|0 0 24 24`;

const i = hdIcon;
/** Pass as `iconSet` to Quasar (app.use(Quasar, { iconSet: etesianIconSet })). */
export const etesianIconSet = {
  name: 'etesian',
  type: { positive: i('check'), negative: i('warning'), info: i('info'), warning: i('warning') },
  arrow: { up: i('arrow-up'), right: i('arrow-right'), down: i('arrow-down'), left: i('arrow-left'), dropdown: i('caret-down') },
  chevron: { left: i('chevron-left'), right: i('chevron-right') },
  colorPicker: { spectrum: i('palette'), tune: i('tune'), palette: i('palette') },
  pullToRefresh: { icon: i('refresh') },
  carousel: { left: i('chevron-left'), right: i('chevron-right'), up: i('chevron-up'), down: i('chevron-down'), navigationIcon: i('dot') },
  chip: { remove: i('cancel'), selected: i('check') },
  datetime: { arrowLeft: i('chevron-left'), arrowRight: i('chevron-right'), now: i('clock'), today: i('today') },
  editor: {
    bold: i('bold'), italic: i('italic'), strikethrough: i('strike'), underline: i('underline'), unorderedList: i('list-ul'), orderedList: i('list-ol'),
    subscript: i('sub'), superscript: i('sup'), hyperlink: i('link'), toggleFullscreen: i('fullscreen'), quote: i('quote'), left: i('align-left'),
    center: i('align-center'), right: i('align-right'), justify: i('align-justify'), print: i('print'), outdent: i('outdent'), indent: i('indent'),
    removeFormat: i('clear-format'), formatting: i('text-size'), fontSize: i('text-size'), align: i('align-left'), hr: i('minus'), undo: i('undo'),
    redo: i('redo'), heading: i('text-size'), code: i('code'), size: i('text-size'), font: i('font'), viewSource: i('code'),
  },
  expansionItem: { icon: i('chevron-down'), denseIcon: i('caret-down') },
  fab: { icon: i('add'), activeIcon: i('close') },
  field: { clear: i('cancel'), error: i('error') },
  pagination: { first: i('first'), prev: i('chevron-left'), next: i('chevron-right'), last: i('last') },
  rating: { icon: i('star') },
  stepper: { done: i('check'), active: i('edit'), error: i('warning') },
  tabs: { left: i('chevron-left'), right: i('chevron-right'), up: i('chevron-up'), down: i('chevron-down') },
  table: { arrowUp: i('arrow-up'), warning: i('warning'), firstPage: i('first'), prevPage: i('chevron-left'), nextPage: i('chevron-right'), lastPage: i('last') },
  tree: { icon: i('play-right') },
  uploader: { done: i('check'), clear: i('close'), add: i('add-box'), upload: i('cloud-up'), removeQueue: i('clear-all'), removeUploaded: i('done-all') },
};
