/**
 * Builds the four published packages from src/ into packages/<name>/dist:
 *   @etesian-design/tokens  src/tokens.ts, src/fonts.ts, src/styles/*.css (tokens/tokens.json)
 *   @etesian-design/vue     src/index.ts, src/components, src/composables, src/lighting.ts, src/squircle.ts
 *   @etesian-design/quasar  src/quasar
 *   @etesian-design/shell   src/shell (desktop, phone parts, mini apps, Belle widgets)
 * Every module keeps its own file (preserveModules), so a package can be imported whole or one file at a time
 * (@etesian-design/vue/components/HdIcon.vue). An import that crosses into another package becomes an import of that
 * package, in the JavaScript and in the type declarations, so nothing is bundled twice.
 *   node scripts/build-packages.mjs
 */
import { build } from 'vite';
import vue from '@vitejs/plugin-vue';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..'), SRC = join(ROOT, 'src');
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const rel = (f) => relative(SRC, f).split(sep).join('/');

/** which package a source file belongs to, and the root its published paths are relative to */
const PKG = {
  tokens: { root: SRC, owns: (r) => /^(tokens|fonts|design-tokens)\.ts$/.test(r) || r.startsWith('styles/') || r.startsWith('../tokens/') },
  vue: { root: SRC, owns: (r) => r === 'index.ts' || /^(components|composables)\//.test(r) || /^(lighting|squircle)\.ts$/.test(r) },
  quasar: { root: join(SRC, 'quasar'), owns: (r) => r.startsWith('quasar/') },
  shell: { root: join(SRC, 'shell'), owns: (r) => r.startsWith('shell/') },
};
const owner = (file) => Object.keys(PKG).find((k) => PKG[k].owns(rel(file)));
/** the specifier another package imports a file by: the package name and its path in that package, without .ts */
const spec = (file) => {
  const k = owner(file), p = relative(PKG[k].root, file).split(sep).join('/');
  if (p.startsWith('styles/')) return `@etesian-design/${k}/${p}`;
  return `@etesian-design/${k}/${p.replace(/\.ts$/, '').replace(/^index$/, '')}`.replace(/\/$/, '');
};
const resolveFile = (from, s) => {
  const p = resolve(dirname(from), s.split('?')[0]);
  return [p, p + '.ts', p + '.vue', join(p, 'index.ts')].find((c) => existsSync(c) && statSync(c).isFile());
};

/** relative imports into another package become imports of that package */
const crossing = (pkg) => ({
  name: 'etesian-package-boundaries', enforce: 'pre',
  resolveId(s, importer) {
    if (!importer || !s.startsWith('.') || importer.includes('\0')) return null;
    const f = resolveFile(importer.split('?')[0], s); if (!f) return null;
    const k = owner(f);
    return k && k !== pkg ? { id: spec(f), external: true } : null;
  },
});

const entries = (pkg) => walk(PKG[pkg].root === SRC ? SRC : PKG[pkg].root)
  .filter((f) => /\.(ts|vue)$/.test(f) && !f.endsWith('.d.ts') && owner(f) === pkg)
  .reduce((m, f) => ({ ...m, [relative(PKG[pkg].root, f).split(sep).join('/').replace(/\.(ts|vue)$/, (x) => (x === '.vue' ? '.vue' : ''))]: f }), {});

execFileSync('node', ['scripts/build-tokens.ts'], { cwd: ROOT, stdio: 'inherit' });
execFileSync('node', ['scripts/build-font-css.ts'], { cwd: ROOT, stdio: 'inherit' });

/* the type declarations, once for all of src/ (not the stories), then shared out */
const TYPES = join(ROOT, 'node_modules/.cache/etesian-types');
rmSync(TYPES, { recursive: true, force: true });
execFileSync('npx', ['vue-tsc', '-p', 'tsconfig.build.json', '--outDir', TYPES], { cwd: ROOT, stdio: 'inherit' });

for (const pkg of Object.keys(PKG)) {
  const out = join(ROOT, 'packages', pkg, 'dist');
  rmSync(out, { recursive: true, force: true });
  await build({
    configFile: false, logLevel: 'warn', root: ROOT,
    plugins: [crossing(pkg), vue()],
    build: {
      outDir: out, emptyOutDir: true, copyPublicDir: false, minify: false, cssCodeSplit: false,
      lib: { entry: entries(pkg), formats: ['es'], cssFileName: 'style' },
      rollupOptions: {
        external: (id) => id === 'vue' || id === 'quasar' || id.startsWith('quasar/') || id.startsWith('@fontsource/') || id.startsWith('@etesian-design/'),
        output: { preserveModules: true, preserveModulesRoot: PKG[pkg].root, entryFileNames: '[name].js' },
      },
    },
  });
  /* plain files the package ships as they are */
  if (pkg === 'tokens') { cpSync(join(SRC, 'styles'), join(out, 'styles'), { recursive: true }); cpSync(join(ROOT, 'tokens/tokens.json'), join(out, 'tokens.json')); }
  if (pkg === 'quasar') for (const f of ['etesian-quasar.css', 'quasar-variables.scss']) cpSync(join(SRC, 'quasar', f), join(out, f));
  /* declarations: this package's files, with imports of other packages pointed at them */
  for (const d of walk(TYPES).filter((f) => f.endsWith('.d.ts'))) {
    const src = join(SRC, relative(TYPES, d)).replace(/\.d\.ts$/, '');
    const file = [src + '.ts', src].find((c) => existsSync(c));
    if (!file || owner(file) !== pkg) continue;
    const text = readFileSync(d, 'utf8').replace(/((?:from|import)\s*\(?\s*['"])(\.{1,2}\/[^'"]+)(['"])/g, (m, a, s, b) => {
      const f = resolveFile(file, s); if (!f) return m;
      const k = owner(f); return k && k !== pkg ? a + spec(f) + b : m;
    });
    const to = join(out, relative(PKG[pkg].root, d.replace(TYPES, SRC)));
    mkdirSync(dirname(to), { recursive: true }); writeFileSync(to, text);
  }
  console.log(`@etesian-design/${pkg}: ${walk(out).length} files`);
}
