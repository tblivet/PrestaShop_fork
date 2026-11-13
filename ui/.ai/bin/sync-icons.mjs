#!/usr/bin/env node
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Copies every Material Symbols icon (outlined, and its "-fill" style) from npm @material-symbols/svg-600 into
// ui/icons/material-symbols/, where <twig:ui:Icon> and the stories read it. Icons are SVG files, never a font: a page
// shows them with its first paint, at their size (no flash, no layout shift), and only the icons it uses are read.
// The whole set ships so that core pages and modules can use any icon without adding files to the core.
//
//   node ui/.ai/bin/sync-icons.mjs [--check]
//   Run it after bumping @material-symbols/svg-600 in ui/package.json, then commit ui/icons/material-symbols.
//   --check exits 1 when the committed icons differ from the package (CI).
import {existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ui = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const source = join(ui, 'node_modules/@material-symbols/svg-600/outlined');
const target = join(ui, 'icons/material-symbols');
const check = process.argv.includes('--check');

if (!existsSync(source)) {
  console.log('Run npm install in ui/ first: @material-symbols/svg-600 is missing.');
  process.exit(1);
}

// ux:icon names allow no underscore: arrow_back is material-symbols:arrow-back. Sized by the text around it and
// painted with its color.
const icons = new Map(readdirSync(source).filter((file) => file.endsWith('.svg')).map((file) => [
  file.replaceAll('_', '-'),
  `${readFileSync(join(source, file), 'utf8').trim().replace(/ width="\d+" height="\d+"/, ' width="1em" height="1em" fill="currentColor"')}\n`,
]));

const current = existsSync(target) ? readdirSync(target).filter((file) => file.endsWith('.svg')) : [];

if (check) {
  const stale = current.filter((file) => !icons.has(file) || readFileSync(join(target, file), 'utf8') !== icons.get(file));
  const missing = [...icons.keys()].filter((file) => !current.includes(file));

  if (stale.length + missing.length > 0) {
    console.log(`${relative(ui, target)} is out of date (${stale.length} changed or removed, ${missing.length} missing): run node ui/.ai/bin/sync-icons.mjs`);
    process.exit(1);
  }

  console.log(`${icons.size} icons up to date`);
  process.exit(0);
}

mkdirSync(target, {recursive: true});
current.filter((file) => !icons.has(file)).forEach((file) => rmSync(join(target, file)));
icons.forEach((svg, file) => writeFileSync(join(target, file), svg));
console.log(`${icons.size} icons written to ${relative(ui, target)}`);
