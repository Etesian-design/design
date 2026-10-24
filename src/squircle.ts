/**
 * Squircle (superellipse |x|^4 + |y|^4 = 1). N9 rule: every thumb-sized shape
 * (app icons, avatars, thumbnails, the busy ring) uses this shape, never a
 * circle or a rounded rectangle.
 */
/** Pre-computed 100x100 path (64 samples). */
export const SQUIRCLE_PATH_100 = 'M100 50L99.88 65.65L99.52 72.08L98.91 76.94L98.06 80.93L96.96 84.33L95.59 87.27L93.96 89.82L92.04 92.04L89.82 93.96L87.27 95.59L84.33 96.96L80.93 98.06L76.94 98.91L72.08 99.52L65.65 99.88L50 100L34.35 99.88L27.92 99.52L23.06 98.91L19.07 98.06L15.67 96.96L12.73 95.59L10.18 93.96L7.96 92.04L6.04 89.82L4.41 87.27L3.04 84.33L1.94 80.93L1.09 76.94L0.48 72.08L0.12 65.65L0 50L0.12 34.35L0.48 27.92L1.09 23.06L1.94 19.07L3.04 15.67L4.41 12.73L6.04 10.18L7.96 7.96L10.18 6.04L12.73 4.41L15.67 3.04L19.07 1.94L23.06 1.09L27.92 0.48L34.35 0.12L50 0L65.65 0.12L72.08 0.48L76.94 1.09L80.93 1.94L84.33 3.04L87.27 4.41L89.82 6.04L92.04 7.96L93.96 10.18L95.59 12.73L96.96 15.67L98.06 19.07L98.91 23.06L99.52 27.92L99.88 34.35Z';

/** Generate a superellipse path for any size / exponent. n = 4 is the N9 squircle. */
export function squirclePath(size = 100, n = 4, samples = 96, inset = 0): string {
  const r = size / 2 - inset;
  const c = size / 2;
  const pts: string[] = [];
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    const ct = Math.cos(t);
    const st = Math.sin(t);
    const x = Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n);
    const y = Math.sign(st) * Math.pow(Math.abs(st), 2 / n);
    pts.push(`${(c + r * x).toFixed(2)} ${(c + r * y).toFixed(2)}`);
  }
  return 'M' + pts.join('L') + 'Z';
}

/** CSS mask-image value (data URI) clipping an element to the squircle. */
export const SQUIRCLE_MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='${SQUIRCLE_PATH_100}'/%3E%3C/svg%3E")`;
