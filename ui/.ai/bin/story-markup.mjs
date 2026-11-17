#!/usr/bin/env node
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Snapshot of what every story of a <twig:ui:*> component shows: its Twig code, the HTML that code must render and the
// session data it reads. StoryMarkupTest (PHP) renders each Twig call through the real component and compares it with
// the HTML, so a story that no longer shows what the component renders fails the build; story-parity.mjs fails when
// the snapshot is older than the stories.
// Usage: node ui/.ai/bin/story-markup.mjs — rewrites the snapshot after a story change.
import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {register} from 'node:module';
import {dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const storiesDir = join(repo, 'ui/src/stories');

export const SNAPSHOT = join(repo, 'tests/Integration/PrestaShopBundle/Twig/Component/Ui/story-markup.json');

// Load stories the way Vite does: imports without extension, "?raw" files as text
register(`data:text/javascript,${encodeURIComponent(`
  import {readFileSync} from 'node:fs';
  import {fileURLToPath} from 'node:url';
  export async function resolve(specifier, context, next) {
    if (specifier.startsWith('.') && !/\\.\\w+(\\?raw)?$/.test(specifier)) {
      return next(specifier + '.js', context);
    }
    return next(specifier, context);
  }
  export async function load(url, context, next) {
    if (url.endsWith('?raw')) {
      const text = readFileSync(fileURLToPath(url.slice(0, -4)), 'utf8');
      return {format: 'module', source: 'export default ' + JSON.stringify(text), shortCircuit: true};
    }
    return next(url, context);
  }
`)}`);

const storyFiles = (dir) => readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
  const path = join(dir, entry.name);

  if (entry.isDirectory()) {
    return storyFiles(path);
  }

  return path.endsWith('.stories.js') ? [path] : [];
});

/**
 * @returns {Promise<{snapshot: object, missing: string[]}>} the snapshot, and the stories of a component without Twig code
 */
export const storyMarkup = async () => {
  const snapshot = {};
  const missing = [];

  for (const path of storyFiles(storiesDir)) {
    const component = readFileSync(path, 'utf8').match(/Twig: <twig:(ui:[\w:]+)>/)?.[1];

    if (!component) {
      continue;
    }

    const module = await import(pathToFileURL(path).href);
    const meta = module.default;

    for (const [name, story] of Object.entries(module)) {
      if (name === 'default') {
        continue;
      }

      if (typeof story.parameters?.twigParity !== 'function') {
        missing.push(`${component}: story "${name}" of ${relative(repo, path)} has no Twig code (build it with withTwig, see twig-snippet.js)`);
        continue;
      }

      snapshot[`${meta.title}/${name}`] = {component, ...story.parameters.twigParity(mapArgs({...meta.args, ...story.args}, {...meta.argTypes, ...story.argTypes}))};
    }
  }

  return {snapshot, missing};
};

// What Storybook does before rendering: a control value with a mapping (nullableSelect's "none") becomes the mapped one
function mapArgs(args, argTypes) {
  return Object.fromEntries(Object.entries(args).map(([name, value]) => {
    const mapping = argTypes[name]?.mapping;

    return [name, mapping && value in mapping ? mapping[value] : value];
  }));
}

export const serialize = (snapshot) => `${JSON.stringify(snapshot, null, 2)}\n`;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const {snapshot, missing} = await storyMarkup();

  writeFileSync(SNAPSHOT, serialize(snapshot));
  console.log(`${Object.keys(snapshot).length} stories written to ${relative(repo, SNAPSHOT)}`);

  if (missing.length > 0) {
    console.log(`Stories without Twig code:\n${missing.join('\n')}`);
    process.exit(1);
  }
}
