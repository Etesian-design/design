// jsdom lacks matchMedia (Quasar Dark 'auto' and Screen use it).
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (q: string) => ({ matches: false, media: q, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false }) as unknown as MediaQueryList;
}
class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
const g = globalThis as any;
g.ResizeObserver ??= NoopObserver;
g.IntersectionObserver ??= NoopObserver;
if (typeof document !== 'undefined' && !document.execCommand) (document as any).execCommand = () => false;
if (typeof Element !== 'undefined' && !Element.prototype.scrollTo) (Element.prototype as any).scrollTo = function () {};
if (typeof SVGElement !== 'undefined') {
  const p = SVGElement.prototype as any;
  p.pauseAnimations ??= function () {}; p.unpauseAnimations ??= function () {};
}
