import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Component styles are global: two components that both style the same class paint each other. A desktop Mail *widget* once
// reused `.x-mail` and turned the Mail app's text white on its white page. Every class a component styles on its own must be
// owned by one file. Rules that are byte-for-byte the same in several files (a shared transition) are allowed.
function vueFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? vueFiles(p) : p.endsWith('.vue') ? [p] : []; });
}
describe('component CSS', () => {
  it('no class is styled on its own by two components', () => {
    const owners = new Map<string, Map<string, string>>();
    for (const f of vueFiles('src')) {
      const src = readFileSync(f, 'utf8');
      for (const [, css] of src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
        // one rule per `}`; inside @media / @container the at-rule's own `{` is skipped by taking the text after the last `{`-less head
        for (const chunk of css!.replace(/\/\*[\s\S]*?\*\//g, '').split('}')) {
          const i = chunk.lastIndexOf('{');
          if (i < 0) continue;
          const sel = chunk.slice(chunk.lastIndexOf('{', i - 1) + 1, i), body = chunk.slice(i + 1);
          if (sel.includes('@')) continue;
          for (const part of sel!.split(',')) {
            const m = part.trim().match(/^\.([a-z][\w-]*)$/);
            if (!m) continue;
            const by = owners.get(m[1]!) ?? new Map<string, string>();
            by.set(f, (by.get(f) ?? '') + body!.trim());
            owners.set(m[1]!, by);
          }
        }
      }
    }
    const clashes = [...owners].filter(([, by]) => by.size > 1 && new Set(by.values()).size > 1).map(([c, by]) => `.${c}: ${[...by.keys()].join(', ')}`);
    expect(clashes).toEqual([]);
  });
});
