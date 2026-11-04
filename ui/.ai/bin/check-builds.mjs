#!/usr/bin/env node
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Are the built assets newer than their sources? A review of stale assets judges code that is not the one in the tree.
// Usage: node ui/.ai/bin/check-builds.mjs — exit 0 when every bundle is current, 1 with the make targets to run otherwise.
import {readdirSync, statSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

const BUNDLES = [
  {target: 'make admin-ui', sources: ['ui/src/scss', 'ui/src/js'], output: 'ui/dist'},
  {target: 'make admin-new-theme', sources: ['admin-dev/themes/new-theme/js', 'admin-dev/themes/new-theme/scss'], output: 'admin-dev/themes/new-theme/public'},
];

// Newest modification time under a directory, with the file it belongs to
const newest = (dir) => {
  let found = {time: 0, file: null};

  for (const entry of readdirSync(join(repo, dir), {withFileTypes: true})) {
    const path = join(dir, entry.name);
    const candidate = entry.isDirectory() ? newest(path) : {time: statSync(join(repo, path)).mtimeMs, file: path};

    if (candidate.time > found.time) {
      found = candidate;
    }
  }

  return found;
};

const stale = BUNDLES.flatMap(({target, sources, output}) => {
  const built = newest(output);
  const changed = sources.map(newest).reduce((a, b) => (b.time > a.time ? b : a));

  return changed.time > built.time ? [`${target}: ${changed.file} changed after the last build (${built.file || output})`] : [];
});

if (stale.length > 0) {
  console.log(`Stale builds, run first:\n${stale.join('\n')}`);
  process.exit(1);
}

console.log('Builds are current.');
