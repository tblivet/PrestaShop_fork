#!/usr/bin/env node
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Does every <twig:ui:*> component have a story that shows all its props? A prop is in sync when the story names it in
// its "**Props**" docs line and gives it a control (argTypes), so what a developer can pass in Twig can be tried in Storybook.
// Props that only wire markup (ids, ending in "Id") need the docs line only. A prop with a default in PHP has the same
// value in the story's DEFAULTS (it fills the controls table "Default" column and the args, see ui/src/stories/story-defaults.js).
// Every story of a component shows its Twig code, and the markup snapshot (story-markup.mjs) is up to date, so
// StoryMarkupTest compares the components with what the stories show today.
// Usage: node ui/.ai/bin/story-parity.mjs — exit 1 with the gaps.
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {SNAPSHOT, serialize, storyMarkup} from './story-markup.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const files = (dir, ext) => readdirSync(join(repo, dir), {withFileTypes: true}).flatMap((entry) => {
  const path = join(dir, entry.name);

  if (entry.isDirectory()) {
    return files(path, ext);
  }

  return path.endsWith(ext) ? [path] : [];
});

// The object literal opened by each match of the pattern (ending with "{"), found by matching its braces
const objectBlocks = (text, pattern) => [...text.matchAll(pattern)].map((match) => {
  let depth = 0;

  for (let i = match.index + match[0].length - 1; i < text.length; i += 1) {
    depth += {'{': 1, '}': -1}[text[i]] ?? 0;

    if (depth === 0) {
      return text.slice(match.index, i + 1);
    }
  }

  return text.slice(match.index);
});

// Every argTypes object of a story file (the meta's and each story's)
const argTypesBlocks = (text) => objectBlocks(text, /argTypes:\s*(?:withDefaults\(\s*)?{/g).join('\n');

// Scalar or empty-array literal, without quotes, so PHP 'sm' and 3 compare with JS 'sm' and '3'
const LITERAL = String.raw`'[^']*'|"[^"]*"|true|false|null|-?\d+|\[\]`;
const unquote = (literal) => literal.replace(/^['"]|['"]$/g, '');
const storyDefaults = (text) => {
  const block = objectBlocks(text, /const DEFAULTS\s*=\s*{/g)[0];

  return block === undefined
    ? null
    : Object.fromEntries([...block.matchAll(new RegExp(String.raw`(\w+):\s*(${LITERAL})`, 'g'))].map((m) => [m[1], unquote(m[2])]));
};

const stories = files('ui/src/stories', '.stories.js').map((path) => ({path, text: readFileSync(join(repo, path), 'utf8')}));
const gaps = [];

for (const path of files('src/PrestaShopBundle/Twig/Component/Ui', '.php')) {
  const php = readFileSync(join(repo, path), 'utf8');
  const name = php.match(/#\[AsTwigComponent\('(ui:[\w:]+)'/)?.[1];

  if (!name) {
    continue;
  }

  const props = [...php.matchAll(/^\s*public\s+(?!const|function)[\w?|\\[\]]+\s+\$(\w+)/gm)].map((match) => match[1]);
  const phpDefaults = Object.fromEntries([...php.matchAll(new RegExp(String.raw`^\s*public\s+(?!const|function)[\w?|\\[\]]+\s+\$(\w+)\s*=\s*(${LITERAL});`, 'gm'))]
    .map((match) => [match[1], unquote(match[2])]));
  // Each story names its component in its sync comment: "// Twig: <twig:ui:Name> (path) renders this markup…"
  const story = stories.find(({text}) => text.includes(`Twig: <twig:${name}>`));

  if (!story) {
    gaps.push(`${name}: no story has the sync comment "Twig: <twig:${name}>" (${relative(repo, join(repo, path))})`);
    continue;
  }

  const docs = story.text.match(/\*\*Props\*\*[^\n]*/)?.[0] ?? '';
  const defaults = storyDefaults(story.text);
  const declared = Object.entries(phpDefaults).filter(([, value]) => value !== 'null');

  if (declared.length > 0 && defaults === null) {
    gaps.push(`${name}: no "const DEFAULTS = {…}" in ${story.path} (PHP defaults: ${declared.map(([prop, value]) => `${prop}=${value}`).join(', ')})`);
  }

  for (const [prop, value] of declared) {
    if (defaults !== null && defaults[prop] !== value) {
      gaps.push(`${name}: default of "${prop}" is ${value} in PHP, ${defaults[prop] ?? 'missing'} in the DEFAULTS of ${story.path}`);
    }
  }
  const argTypes = argTypesBlocks(story.text);

  for (const prop of props) {
    if (!docs.includes(`\`${prop}\``)) {
      gaps.push(`${name}: prop "${prop}" missing from the **Props** line of ${story.path}`);
    }

    if (!prop.endsWith('Id') && !new RegExp(`\\b${prop}\\s*:\\s*{`).test(argTypes)) {
      gaps.push(`${name}: prop "${prop}" has no control (argTypes) in ${story.path}`);
    }
  }
}

const {snapshot, missing} = await storyMarkup();

gaps.push(...missing);

if (!existsSync(SNAPSHOT) || readFileSync(SNAPSHOT, 'utf8') !== serialize(snapshot)) {
  gaps.push(`${relative(repo, SNAPSHOT)} is not what the stories show: run node ui/.ai/bin/story-markup.mjs and commit it`);
}

if (gaps.length > 0) {
  console.log(`Twig components and stories out of sync:\n${gaps.join('\n')}`);
  process.exit(1);
}

console.log('Every Twig component prop is in its story, every story shows its Twig code, the markup snapshot is up to date.');
