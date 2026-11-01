/**
 * The Etesian logo: wind blowing right to left, its curls drawing a lower-case e, on the N9 squircle. Writes brand/:
 * etesian-deep.svg (the main logo: light backgrounds, the GitHub org), etesian-pearl.svg (dark backgrounds),
 * etesian-favicon*.svg (simplified for 32 px and below) and etesian-avatar.svg (fills the square for round crops).
 * Checks that no two strokes or leaves touch and that everything stays inside the squircle's margin.
 *   node scripts/logo.mjs [--preview sheet.html]
 */
import { readFileSync, writeFileSync } from 'node:fs';
const sq = readFileSync(new URL('../src/squircle.ts', import.meta.url), 'utf8').match(/SQUIRCLE_PATH_100 = '([^']+)'/)[1];
const F = new URL('../node_modules/@fontsource/fira-sans/files/', import.meta.url).pathname;
/* one smooth curve per stroke: centripetal Catmull-Rom through the points, resampled to even spacing */
function curve(P, step = 0.35) {
  const raw = [];
  const tj = (a, b) => Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1]), 0.5) || 1e-6;
  const ext = [[2 * P[0][0] - P[1][0], 2 * P[0][1] - P[1][1]], ...P, [2 * P.at(-1)[0] - P.at(-2)[0], 2 * P.at(-1)[1] - P.at(-2)[1]]];
  for (let i = 1; i < ext.length - 2; i++) {
    const [p0, p1, p2, p3] = [ext[i - 1], ext[i], ext[i + 1], ext[i + 2]];
    const t0 = 0, t1 = t0 + tj(p0, p1), t2 = t1 + tj(p1, p2), t3 = t2 + tj(p2, p3);
    for (let k = 0; k < 60; k++) {
      const t = t1 + (t2 - t1) * k / 60, L = (a, b, ta, tb) => [0, 1].map((j) => ((tb - t) * a[j] + (t - ta) * b[j]) / (tb - ta));
      const A1 = L(p0, p1, t0, t1), A2 = L(p1, p2, t1, t2), A3 = L(p2, p3, t2, t3), B1 = L(A1, A2, t0, t2), B2 = L(A2, A3, t1, t3);
      raw.push(L(B1, B2, t1, t2));
    }
  }
  raw.push(P.at(-1));
  const out = [raw[0]]; let acc = 0;
  for (let i = 1; i < raw.length; i++) { acc += Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]); if (acc >= step) { out.push(raw[i]); acc = 0; } }
  if (out.at(-1) !== raw.at(-1)) out.push(raw.at(-1));
  return out;
}
/* width: thin at the start, rises steadily to one peak, falls steadily to a point (never thins and swells again) */
function ribbon(pts, w, peak) {
  const n = pts.length, L = [], R = [], hs = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), u = t < peak ? t / peak : (1 - t) / (1 - peak);
    const h = (w / 2) * Math.max(Math.pow(Math.sin(u * Math.PI / 2), 0.9), 0.04);
    const a = pts[Math.max(0, i - 2)], b = pts[Math.min(n - 1, i + 2)]; let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    hs.push(h); L.push([pts[i][0] - dy * h, pts[i][1] + dx * h]); R.push([pts[i][0] + dy * h, pts[i][1] - dx * h]);
  }
  const f = (p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2);
  return { d: 'M' + L.map(f).join('L') + 'L' + R.reverse().map(f).join('L') + 'Z', pts, hs };
}
/* gusts: a long, nearly straight run from a fine point, then one wide open curl ending in a short hook (laid out on a
 * 1000 grid and fitted into the squircle). Each rises to one peak width near the turn and thins into the hook. */
const g = (P) => curve(P.map(([x, y]) => [19.4 + (x - 90) * 0.08, 15 + (y - 60) * 0.08]));
const build = (m = 1) => ({
  outer: ribbon(g([[90, 548], [330, 545], [560, 528], [700, 480], [800, 390], [855, 280], [850, 170], [780, 95], [670, 70], [560, 100], [490, 160], [470, 220], [492, 278]]), 5.2 * m, 0.62),
  inner: ribbon(g([[425, 490], [560, 465], [680, 410], [755, 320], [770, 230], [730, 165], [660, 140], [600, 160], [565, 205], [568, 260]]), 3.6 * m, 0.6),
  small: ribbon(g([[110, 485], [240, 480], [330, 465], [390, 425], [408, 375], [385, 338], [340, 326], [303, 342], [292, 372]]), 2.6 * m, 0.6),
  lower: ribbon(g([[100, 602], [330, 597], [520, 607], [645, 650], [705, 720], [718, 800], [680, 875], [600, 922], [520, 920], [475, 885], [470, 845], [485, 822]]), 4.6 * m, 0.6),
  hook: ribbon(g([[115, 660], [290, 656], [410, 664], [482, 688], [515, 724], [508, 760], [472, 782], [432, 780], [408, 758], [408, 732]]), 3.2 * m, 0.6),
});
const S = build(), SF = build(1.9); // SF: the favicon, thicker strokes
const T = { outer: 'dark', inner: 'light', small: 'light', lower: 'light', hook: 'dark' };
/* leaves: base (stem end) on the 1000 grid, the angle the tip points to, length */
const lf = (bx, by, tx, ty) => { const [x, y] = [19.4 + (bx - 90) * 0.08, 15 + (by - 60) * 0.08], [x2, y2] = [19.4 + (tx - 90) * 0.08, 15 + (ty - 60) * 0.08]; const k = 1; return [x, y, Math.atan2(y2 - y, x2 - x) * 180 / Math.PI, k * Math.hypot(x2 - x, y2 - y) / 16]; };
const LEAVES = [lf(405, 252, 325, 207), lf(738, 625, 910, 523)];
/* clearance: strokes 1.6 apart, leaves 4 apart; every outline checked against every other */
{
  const leafLine = ([x, y, rot, sc]) => { const r = rot * Math.PI / 180, pts = [], hs = []; for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push([x + Math.cos(r) * 16 * sc * u, y + Math.sin(r) * 16 * sc * u]); hs.push(16 * sc * 0.2 * Math.sin(u * Math.PI)); } return { pts, hs, leaf: true }; };
  const all = { ...S, ...Object.fromEntries(LEAVES.map((l, i) => ['leaf' + i, leafLine(l)])) }, k = Object.keys(all), bad = [];
  for (let i = 0; i < k.length; i++) for (let j = i + 1; j < k.length; j++) {
    const A = all[k[i]], B = all[k[j]], need = A.leaf || B.leaf ? 4 : 1.6; let g = Infinity, at;
    A.pts.forEach((p, a) => B.pts.forEach((q, b) => { const v = Math.hypot(p[0] - q[0], p[1] - q[1]) - A.hs[a] - B.hs[b]; if (v < g) { g = v; at = p.map(Math.round); } }));
    if (g < need) bad.push(`${k[i]}/${k[j]} ${g.toFixed(1)} (need ${need}) at ${at}`);
  }
  // inside the squircle with a margin
  for (const [n, A] of Object.entries(all)) A.pts.forEach((p, a) => { const m = Math.pow(Math.abs(p[0] - 50) / 50, 2.8) + Math.pow(Math.abs(p[1] - 50) / 50, 2.8); if (m > Math.pow(0.86, 2.8)) bad.push(`${n} near the edge at ${p.map(Math.round)}`); });
  console.log(bad.length ? 'PROBLEMS:\n ' + [...new Set(bad)].slice(0, 12).join('\n ') : 'clear: no strokes or leaves touch, all inside the margin');
}
const grad = (id, a, b, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const leafSvg = ([x, y, rot, s], id) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
  <path d="M0 0 L 2.4 0" stroke="#4E7A1E" stroke-width=".55" stroke-linecap="round"/>
  <path d="M2.2 0 C 4 -4.2, 11 -4.6, 16 0 C 11 3.4, 4.6 3.6, 2.2 0 Z" fill="url(#${id}lf)"/>
  <path d="M2.4 0 C 7 -.3, 11 -.3, 15.6 0 M6 -.2 L 8.4 -2.6 M9 -.2 L 11.2 -2.4 M7.4 .2 L 9.4 2 M10.4 .2 L 12.2 1.8" stroke="#4E7A1E" stroke-width=".38" fill="none" opacity=".75"/></g>`;
/* o.simple: the favicon (outer curl, inner curl, the long lower line; thick; no leaves). o.bleed: fills the square (avatars) */
function mark(id, theme, o = {}) {
  const dark = theme === 'deep', ST = o.simple ? SF : S;
  const bg = dark ? ['#2C6FD9', '#0F3B8C'] : ['#FFFFFF', '#E3EAF3'];
  const s1 = dark ? ['#FFFFFF', '#D7ECFF'] : ['#2584D8', '#145FB0'], s2 = dark ? ['#9FD4FF', '#6FB8F5'] : ['#7FD0F2', '#4FB4E6'];
  const echo = dark ? '#0A2A66' : '#C6DDF4', all = o.simple ? ['outer', 'inner', 'lower'] : Object.keys(ST), main = all.filter((k) => T[k] === 'dark');
  const shape = o.bleed ? 'M0 0H100V100H0Z' : sq;
  const inner = o.bleed ? 'translate(50 50) scale(.86) translate(-50 -50) translate(100 0) scale(-1 1)' : 'translate(100 0) scale(-1 1)';
  return `<defs>${grad(id + 'bg', ...bg)}<radialGradient id="${id}hl" cx=".5" cy="0" r=".75"><stop offset="0" stop-color="#fff" stop-opacity="${dark ? .28 : .9}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    ${grad(id + 's1', ...s1, 1, 1)}${grad(id + 's2', ...s2, 1, 1)}${grad(id + 'lf', '#9BD12E', '#5E9418', 1, 1)}<clipPath id="${id}c"><path d="${shape}"/></clipPath>
    <filter id="${id}sh" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.1"/></filter></defs>
  <path d="${shape}" fill="url(#${id}bg)"/><path d="${shape}" fill="url(#${id}hl)"/>
  <g clip-path="url(#${id}c)"><g transform="${inner}">
    <g transform="translate(-1.1 1.5)" fill="${echo}" opacity="${dark ? .55 : .9}">${all.map((k) => `<path d="${ST[k].d}"/>`).join('')}</g>
    ${o.simple ? '' : `<g transform="translate(-.5 2.3)" fill="#000" opacity="${dark ? .25 : .12}" filter="url(#${id}sh)">${all.map((k) => `<path d="${ST[k].d}"/>`).join('')}</g>`}
    ${all.map((k) => `<path d="${ST[k].d}" fill="url(#${id}${main.includes(k) ? 's1' : 's2'})"/>`).join('')}
    ${o.simple ? '' : LEAVES.map((l) => leafSvg(l, id)).join('')}
  </g></g>${o.bleed ? '' : `<path d="${sq}" fill="none" stroke="${dark ? '#fff' : '#000'}" stroke-opacity="${dark ? .18 : .08}" stroke-width=".8"/>`}`;
}
/* standalone files */
import { mkdirSync } from 'node:fs';
const file = (t, o) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${mark('e', t, o)}</svg>\n`;
{
  const D = new URL('../brand', import.meta.url).pathname; mkdirSync(D, { recursive: true });
  writeFileSync(D + '/etesian-deep.svg', file('deep')); writeFileSync(D + '/etesian-pearl.svg', file('pearl'));
  writeFileSync(D + '/etesian-favicon.svg', file('deep', { simple: true })); writeFileSync(D + '/etesian-favicon-pearl.svg', file('pearl', { simple: true })); writeFileSync(D + '/etesian-avatar.svg', file('deep', { bleed: true }));
}
let n = 0; const svg = (t, s) => `<svg width="${s}" height="${s}" viewBox="0 0 100 100">${mark('m' + n++, t)}</svg>`;
const svgS = (t, s) => `<svg width="${s}" height="${s}" viewBox="0 0 100 100">${mark('m' + n++, t, { simple: true })}</svg>`, svgB = (t, s) => `<svg width="${s}" height="${s}" viewBox="0 0 100 100">${mark('m' + n++, t, { bleed: true })}</svg>`;
const row = (t, name) => `<section><h2>${name}</h2><div class="r"><div>${svg(t, 300)}</div><div class="col">
  <div class="cell light">${svg(t, 72)}<span class="wm">Etesian</span></div><div class="cell dark">${svg(t, 72)}<span class="wm">Etesian</span></div>
  <div class="row2"><div class="circle">${svg(t, 104)}</div><div class="cell dark sm">${svg(t, 48)}${svgS(t, 32)}${svgS(t, 16)}</div><div class="circle">${svgB(t, 120)}</div></div></div></div></section>`;
const pi = process.argv.indexOf('--preview');
if (pi > 0) writeFileSync(process.argv[pi + 1], `<html><head><style>@font-face{font-family:Fira;font-weight:300;src:url(file://${F}fira-sans-latin-300-normal.woff2)}@font-face{font-family:Fira;font-weight:500;src:url(file://${F}fira-sans-latin-500-normal.woff2)}
body{margin:0;padding:24px;background:#eceef1;font-family:Fira}h2{font:500 18px Fira;color:#333;margin:10px 0}.r{display:flex;gap:24px;align-items:flex-start}.col{display:flex;flex-direction:column;gap:12px}
.cell{display:flex;align-items:center;gap:16px;padding:16px 26px;border-radius:14px}.light{background:#fff;color:#111}.dark{background:#0e1418;color:#fff}.wm{font:300 46px Fira}
.row2{display:flex;gap:12px;align-items:center}.circle{width:120px;height:120px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 0 0 1px #ccc}.sm{gap:12px}
</style></head><body>${row('pearl', 'Pearl')}${row('deep', 'Deep blue')}</body></html>`);
