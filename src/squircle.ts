/**
 * Squircle (superellipse |x|^2.8 + |y|^2.8 = 1). N9 rule: every thumb-sized shape
 * (app icons, avatars, thumbnails, the busy ring) uses this shape, never a
 * circle or a rounded rectangle.
 */
/** N9 squircle exponent, measured from real N9 icons. n = 4/5 reads as a rounded square: wrong. */
export const SQUIRCLE_EXPONENT = 2.8;

/** Pre-computed 100x100 path (n = 2.8, 96 samples). */
export const SQUIRCLE_PATH_100 = 'M100.00 50.00L99.92 57.13L99.69 61.68L99.31 65.56L98.78 69.04L98.09 72.23L97.25 75.18L96.26 77.92L95.12 80.48L93.82 82.86L92.38 85.08L90.78 87.13L89.04 89.04L87.13 90.78L85.08 92.38L82.86 93.82L80.48 95.12L77.92 96.26L75.18 97.25L72.23 98.09L69.04 98.78L65.56 99.31L61.68 99.69L57.13 99.92L50.00 100.00L42.87 99.92L38.32 99.69L34.44 99.31L30.96 98.78L27.77 98.09L24.82 97.25L22.08 96.26L19.52 95.12L17.14 93.82L14.92 92.38L12.87 90.78L10.96 89.04L9.22 87.13L7.62 85.08L6.18 82.86L4.88 80.48L3.74 77.92L2.75 75.18L1.91 72.23L1.22 69.04L0.69 65.56L0.31 61.68L0.08 57.13L0.00 50.00L0.08 42.87L0.31 38.32L0.69 34.44L1.22 30.96L1.91 27.77L2.75 24.82L3.74 22.08L4.88 19.52L6.18 17.14L7.62 14.92L9.22 12.87L10.96 10.96L12.87 9.22L14.92 7.62L17.14 6.18L19.52 4.88L22.08 3.74L24.82 2.75L27.77 1.91L30.96 1.22L34.44 0.69L38.32 0.31L42.87 0.08L50.00 0.00L57.13 0.08L61.68 0.31L65.56 0.69L69.04 1.22L72.23 1.91L75.18 2.75L77.92 3.74L80.48 4.88L82.86 6.18L85.08 7.62L87.13 9.22L89.04 10.96L90.78 12.87L92.38 14.92L93.82 17.14L95.12 19.52L96.26 22.08L97.25 24.82L98.09 27.77L98.78 30.96L99.31 34.44L99.69 38.32L99.92 42.87Z';

/** Generate a superellipse path for any size / exponent. n = 2.8 is the N9 squircle (measured from 108 stock N9 icons, fit range 2.74-2.82). */
export function squirclePath(size = 100, n = SQUIRCLE_EXPONENT, samples = 96, inset = 0): string {
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

/**
 * Belle (Symbian, the N9's sibling) draws the icon squircle as four cubic curves, edge-midpoint to edge-midpoint, with handles
 * BELLE_HANDLE × the half-size (decoded from the 701's own .nvg icons: 80 px icons, handles 29.63 px of 40). It is within 0.7%
 * of n = 2.8 everywhere. Larger faces (the analog clock, the toggle caps, the torch) measure n ≈ 2.9–2.95, and are often not
 * square (72 × 82): the squircle stretches to its box (squircleRectPath), it never becomes a rounded rectangle or a pill. The
 * on/off switch track is a wide squircle (64 × 42, n ≈ 3.6).
 */
export const BELLE_HANDLE = 0.7408;
/** Squircle exponent of Belle's larger faces (analog dial, toggle caps). */
export const FACE_EXPONENT = 2.9;

/** A squircle stretched to a w × h box at (x, y): |x/a|^n + |y/b|^n = 1. */
export function squircleRectPath(w: number, h: number, n = SQUIRCLE_EXPONENT, x = 0, y = 0, samples = 96): string {
  const pts: string[] = [];
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    const ct = Math.cos(t), st = Math.sin(t);
    pts.push(`${(x + w / 2 + (w / 2) * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n)).toFixed(2)} ${(y + h / 2 + (h / 2) * Math.sign(st) * Math.pow(Math.abs(st), 2 / n)).toFixed(2)}`);
  }
  return 'M' + pts.join('L') + 'Z';
}

/** CSS mask-image value (data URI) clipping an element to the squircle. */
export const SQUIRCLE_MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='${SQUIRCLE_PATH_100}'/%3E%3C/svg%3E")`;
