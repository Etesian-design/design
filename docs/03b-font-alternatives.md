# Font alternatives (free look-alikes for Nokia Pure)

Nokia Pure (Dalton Maag for Nokia, 2011) is **proprietary** (Nokia Pure Font EULA). HDL never bundles it:
if the user provides the N9 font files it is used via `local()`, otherwise one of the free fonts below is used.

## How they were measured

Measured with fontTools + Pillow against the stock N9 `NokiaPureText_Lt/Rg/Bd.ttf` (analysis only, not in the repo):
x-height and cap height (from the `x` and `H` outlines), x/cap ratio, advance width of a 82-character
sample normalised to equal cap height, vertical stem of `l` in Light and Regular at 400 px, tabular figures
(`tnum`), and a side-by-side render of the lock-screen clock "17:29", a page title, a list row and a paragraph,
reviewed by eye for the a/e/t terminals, `g`, `y` and the numerals.

Nokia Pure Text reference: x-height 0.500 em, cap 0.703 em, x/cap 0.711, Light stem 0.060 em, Regular 0.090 em,
proportional figures by default with a `tnum` feature (plus separate Tabular files), single-storey `g`,
straight-tailed `y`, angled-cut terminals on a/e/t, open apertures.

## Ranking

Score 0-100: 60% metrics (x/cap ratio, width at equal cap height, Light and Regular stem) + 40% letterform review.

| # | Font | Licence | Score | x/cap | Width vs Pure | Stems L/R (em) | Notes |
|---|---|---|---|---|---|---|---|
| ref | Nokia Pure Text | Proprietary EULA | 100 | 0.711 | 0 | 0.060 / 0.090 | bring your own |
| 1 | **Fira Sans** | OFL-1.1 (RFN "Fira") | 83 | 0.765 | +0.6% | 0.060 / 0.093 | humanist; width and stems almost identical; Light is the closest clock; taller x-height |
| 2 | **Ubuntu Sans** | Ubuntu Font Licence 1.0 | 83 | 0.747 | +1.1% | 0.060 / 0.075 | Dalton Maag (same studio); same open apertures and cut terminals; Regular slightly light, variable 100-800 |
| 3 | Ubuntu | Ubuntu Font Licence 1.0 | 79 | 0.750 | +2.1% | 0.065 / 0.093 | Dalton Maag; curled `t`/`l` tails are more Ubuntu than Nokia |
| 4 | Hind | OFL-1.1 | 76 | 0.754 | -1.3% | 0.060 / 0.078 | close shapes, no Bold-quality hinting; tall Devanagari line metrics |
| 5 | Lato | OFL-1.1 | 73 | 0.707 | -3.3% | 0.048 / 0.090 | best x/cap match but semi-geometric, very thin Light |
| 6 | Public Sans | OFL-1.1 | 72 | 0.715 | +1.0% | 0.078 / 0.093 | metrics close, grotesque terminals, Light too heavy |
| 7 | Inter | OFL-1.1 | 70 | 0.750 | +3.2% | 0.068 / 0.090 | neutral grotesque, wide; good screen rendering |
| 8 | Signika | OFL-1.1 | 68 | 0.731 | -3.4% | 0.073 / 0.100 | low contrast, heavier |
| 9 | Noto Sans | OFL-1.1 | 67 | 0.751 | +2.7% | 0.058 / 0.088 | double-storey `g`; best script coverage |
| 10 | Open Sans | OFL-1.1 | 66 | 0.750 | +1.7% | 0.050 / 0.083 | previous fallback; double-storey `g` |
| 11 | Source Sans 3 | OFL-1.1 | 63 | 0.741 | -2.0% | 0.045 / 0.083 | small caps height (+7% size needed), double-storey `g` |
| 12 | Nunito Sans | OFL-1.1 | 59 | 0.689 | +1.1% | 0.063 / 0.083 | rounded terminals, off-brand |

Every font here has a licence allowing redistribution and bundling in open-source firmware (OFL-1.1 or UFL-1.0).
Sources: tokens `font.alternatives.*.$info.source`.

## Metric adjustments (tokens)

`font.alternatives.<key>.{family,size-adjust,letter-spacing,line-height}`:

- **size-adjust** = Pure cap height / font cap height (applied in the `@font-face` alias `"HD <Family>"`, `src/styles/font-alternatives.css`).
- **letter-spacing** = per-character width difference at that size (em), applied by `fontVars(key)`.
- **line-height** = ratio of hhea line spacing, informational: HDL sets explicit line heights so no change is required.

Use: `import { fontVars, FONT_ALTERNATIVES } from 'harmattan-design'` and spread it on a root element's style.
The Storybook toolbar **Font** switch does exactly that.

## Firmware recommendation

Ship **Fira Sans** as the default UI font when the user provides no N9 files, with **Ubuntu Sans** as the
alternative option (closest in construction, same designers as Nokia Pure).

- Weights: Light 300 (default text, clock, titles), Regular 400, Bold 700. Italic is not needed by the N9 UI.
  Add Fira Sans' `tnum` feature for clocks/counters (it has one; so does Ubuntu Sans).
- **Fira Sans, SIL OFL 1.1**: include `OFL.txt` (the licence text with the copyright notice) next to the fonts,
  e.g. `/system/fonts/` + `NOTICE`; the fonts can't be sold alone; modified versions must not use the reserved
  name "Fira". Shipping unmodified TTF/OTF is fine.
- **Ubuntu Sans, Ubuntu Font Licence 1.0**: include `LICENCE.txt` and the copyright notice; modified versions
  must be renamed and must not use "Ubuntu" in the name; may be bundled and redistributed, not sold alone.
- Do not subset or rename unless you also rename the family (both licences treat that as a modification).
