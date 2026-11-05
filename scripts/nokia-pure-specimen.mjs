// Renders the Font alternatives specimen with the real Nokia Pure Text and saves it as a picture, so Storybook can show how
// Nokia Pure looks without shipping the font (it is proprietary and never bundled). Run it on a machine that has the font:
//   NOKIA_PURE_DIR=<folder with NokiaPureText_Lt/Rg/Bd.ttf> STORYBOOK=http://localhost:6110 node scripts/nokia-pure-specimen.mjs
// Writes src/assets/nokia-pure-specimen-hybrid.png and -dark.png.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = process.env.NOKIA_PURE_DIR;
const SB = process.env.STORYBOOK || 'http://localhost:6110';
const OUT = process.env.OUT || 'src/assets';
if (!DIR) throw new Error('NOKIA_PURE_DIR is required');
const files = { Lt: 'NokiaPureText_Lt.ttf', Rg: 'NokiaPureText_Rg.ttf', Bd: 'NokiaPureText_Bd.ttf' };

const url = (k) => `url(data:font/ttf;base64,${readFileSync(join(DIR, files[k])).toString('base64')})`;
const browser = await chromium.launch();
for (const mode of ['hybrid', 'dark']) // the light mode's specimen looks the same as hybrid's {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
  await page.goto(`${SB}/iframe.html?id=guide-font-alternatives--recommended&viewMode=story&globals=mode:${mode};font:nokia-pure`);
  await page.addStyleTag({ content: `
    @font-face { font-family: "NP Real"; font-weight: 300; src: ${url('Lt')}; }
    @font-face { font-family: "NP Real"; font-weight: 400; src: ${url('Rg')}; }
    @font-face { font-family: "NP Real"; font-weight: 700; src: ${url('Bd')}; }
    @font-face { font-family: "NP Real Light"; src: ${url('Lt')}; }` });
  const section = page.locator('section', { hasText: 'Nokia Pure' }).first();
  await section.waitFor();
  // the page's own "Nokia Pure Text" only looks for an installed copy: point the specimen at the files instead
  await section.evaluate((el) => { el.style.setProperty('--hd-font-family-base', '"NP Real", sans-serif'); el.style.setProperty('--hd-font-family-light', '"NP Real Light", "NP Real", sans-serif'); });
  await page.evaluate(async () => { for (const w of [300, 400, 700]) await document.fonts.load(`${w} 20px "NP Real"`); });
  const ok = await page.evaluate(() => [300, 400, 700].every((w) => document.fonts.check(`${w} 20px "NP Real"`)));
  if (!ok) throw new Error('Nokia Pure did not load');
  await section.evaluate((el) => { el.firstElementChild.style.display = 'none'; el.style.borderBottom = 'none'; }); // the story prints its own caption
  await page.waitForTimeout(300);
  await section.screenshot({ path: `${OUT}/nokia-pure-specimen-${mode}.png` });
  console.log(`${OUT}/nokia-pure-specimen-${mode}.png`);
  await page.close();
}
await browser.close();
