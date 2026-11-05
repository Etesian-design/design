// Publishes @etesian-design/tokens, vue, quasar and shell to GitHub Packages at one version, dependencies first.
// Run by semantic-release (.releaserc.json, @semantic-release/exec) with the version it has just worked out.
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const v = process.argv[2]?.replace(/^v/, '');
if (!v) throw new Error('usage: node scripts/publish-packages.mjs <version>');
const PACKAGES = ['tokens', 'vue', 'quasar', 'shell'];
for (const p of PACKAGES) {
  const f = `packages/${p}/package.json`, d = JSON.parse(readFileSync(f, 'utf8'));
  d.version = v;
  for (const k of Object.keys(d.dependencies ?? {})) if (k.startsWith('@etesian-design/')) d.dependencies[k] = `^${v}`;
  writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
}
execSync('npm run build', { stdio: 'inherit' });
// From the root, so npm reads the root .npmrc (registry and token); inside packages/<p> it would not.
for (const p of PACKAGES) execSync(`npm publish ./packages/${p}`, { stdio: 'inherit' });
