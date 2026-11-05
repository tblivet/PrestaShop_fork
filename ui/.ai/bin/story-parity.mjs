#!/usr/bin/env node
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Does every <twig:ui:*> component have a story that shows all its props? A prop is in sync when the story names it in
// its "**Props**" docs line and gives it a control (argTypes), so what a developer can pass in Twig can be tried in Storybook.
// Props that only wire markup (ids, ending in "Id") need the docs line only.
// Usage: node ui/.ai/bin/story-parity.mjs — exit 1 with the gaps.
import {readdirSync, readFileSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const files = (dir, ext) => readdirSync(join(repo, dir), {withFileTypes: true}).flatMap((entry) => {
  const path = join(dir, entry.name);

  if (entry.isDirectory()) {
    return files(path, ext);
  }

  return path.endsWith(ext) ? [path] : [];
});

// Every argTypes object of a story file (the meta's and each story's), found by matching its braces
const argTypesBlocks = (text) => [...text.matchAll(/argTypes:\s*{/g)].map((match) => {
  let depth = 0;

  for (let i = match.index + match[0].length - 1; i < text.length; i += 1) {
    depth += {'{': 1, '}': -1}[text[i]] ?? 0;

    if (depth === 0) {
      return text.slice(match.index, i + 1);
    }
  }

  return text.slice(match.index);
}).join('\n');

const stories = files('ui/src/stories', '.stories.js').map((path) => ({path, text: readFileSync(join(repo, path), 'utf8')}));
const gaps = [];

for (const path of files('src/PrestaShopBundle/Twig/Component/Ui', '.php')) {
  const php = readFileSync(join(repo, path), 'utf8');
  const name = php.match(/#\[AsTwigComponent\('(ui:[\w:]+)'/)?.[1];

  if (!name) {
    continue;
  }

  const props = [...php.matchAll(/^\s*public\s+(?!const|function)[\w?|\\[\]]+\s+\$(\w+)/gm)].map((match) => match[1]);
  // Each story names its component in its sync comment: "// Twig: <twig:ui:Name> (path) renders this markup…"
  const story = stories.find(({text}) => text.includes(`Twig: <twig:${name}>`));

  if (!story) {
    gaps.push(`${name}: no story has the sync comment "Twig: <twig:${name}>" (${relative(repo, join(repo, path))})`);
    continue;
  }

  const docs = story.text.match(/\*\*Props\*\*[^\n]*/)?.[0] ?? '';
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

if (gaps.length > 0) {
  console.log(`Twig components and stories out of sync:\n${gaps.join('\n')}`);
  process.exit(1);
}

console.log('Every Twig component prop is in its story.');
