#!/usr/bin/env node
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Lists the translatable strings of the given Twig/PHP files that no catalogue knows yet: a new or reworded
// string shows in English on a translated shop until the catalogues get it.
//
//   node ui/.ai/bin/missing-translations.mjs [--base upstream/develop] [--locale fr-FR] [file …]
//
// Without files, checks the .twig and .php files changed since the merge base with --base (and untracked ones).
// translations/default is the extracted catalogue in git; --locale also checks an installed language's catalogue.
import {execSync} from 'node:child_process';
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

const root = execSync('git rev-parse --show-toplevel').toString().trim();
const argv = process.argv.slice(2);
const option = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);

  return i === -1 ? fallback : argv.splice(i, 2)[1];
};
// The remote branch first: a local develop that is behind would bring in other people's strings
const defaultBase = ['upstream/develop', 'origin/develop', 'develop'].find((ref) => {
  try {
    execSync(`git rev-parse --verify --quiet ${ref}`, {cwd: root, stdio: 'ignore'});

    return true;
  } catch {
    return false;
  }
});
const base = option('base', defaultBase);
const locale = option('locale', null);

const changedFiles = () => {
  const mergeBase = execSync(`git merge-base HEAD ${base}`, {cwd: root}).toString().trim();
  const changed = execSync(`git diff --name-only ${mergeBase}`, {cwd: root}).toString();
  const untracked = execSync('git ls-files --others --exclude-standard', {cwd: root}).toString();

  return `${changed}\n${untracked}`.split('\n').filter((f) => /\.(twig|php)$/.test(f) && !f.startsWith('tests/') && existsSync(join(root, f)));
};
const files = argv.length ? argv : changedFiles();

// Reads a quoted literal starting at `i`, returns [value, index after it]
const readString = (src, i) => {
  const quote = src[i];
  let value = '';

  for (let j = i + 1; j < src.length; j += 1) {
    if (src[j] === '\\') {
      value += src[j + 1] === quote || src[j + 1] === '\\' ? src[j + 1] : `\\${src[j + 1]}`;
      j += 1;
    } else if (src[j] === quote) {
      return [value, j + 1];
    } else {
      value += src[j];
    }
  }

  return [null, src.length];
};

// Skips one argument (balanced brackets, strings), returns the index of the comma or closing paren after it
const skipArgument = (src, i) => {
  let depth = 0;

  for (let j = i; j < src.length; j += 1) {
    const c = src[j];

    if (c === '\'' || c === '"') {
      [, j] = readString(src, j);
      j -= 1;
    } else if ('([{'.includes(c)) {
      depth += 1;
    } else if (')]}'.includes(c)) {
      if (depth === 0) {
        return j;
      }
      depth -= 1;
    } else if (c === ',' && depth === 0) {
      return j;
    }
  }

  return src.length;
};

const skipSpaces = (src, i) => {
  let j = i;
  while (/\s/.test(src[j] ?? '')) j += 1;

  return j;
};

// Domain literal as the argument number `position` (0-based) after the opening paren at `open`
const readDomain = (src, open, position) => {
  let i = open + 1;

  for (let n = 0; n < position; n += 1) {
    i = skipArgument(src, skipSpaces(src, i));
    if (src[i] !== ',') return null;
    i += 1;
  }
  i = skipSpaces(src, i);

  return src[i] === '\'' || src[i] === '"' ? readString(src, i)[0] : null;
};

const extract = (file) => {
  const src = readFileSync(join(root, file), 'utf8');
  const found = [];

  if (file.endsWith('.php')) {
    // ->trans('message', [params], 'Domain')
    for (const match of src.matchAll(/->trans\(\s*(['"])/g)) {
      const start = match.index + match[0].length - 1;
      const [message, end] = readString(src, start);
      const comma = skipSpaces(src, end);
      // The comma after the message stands for the opening paren: the params come first, then the domain
      const domain = message !== null && src[comma] === ',' ? readDomain(src, comma, 1) : null;

      if (domain) found.push({message, domain, file});
    }
  } else {
    // 'message'|trans({params}, 'Domain')
    for (const match of src.matchAll(/(['"])((?:\\.|(?!\1).)*)\1\s*\|\s*trans\s*\(/g)) {
      const open = match.index + match[0].length - 1;
      const domain = readDomain(src, open, 1);
      if (domain) found.push({message: readString(src, match.index)[0], domain, file});
    }
  }

  return found;
};

const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, '\'').replace(/&amp;/g, '&');
const catalogues = new Map();
const catalogue = (dir, domain) => {
  const name = domain.replace(/\./g, '') + (dir === 'default' ? '.xlf' : `.${dir}.xlf`);
  const path = join(root, 'translations', dir, name);

  if (!catalogues.has(path)) {
    const sources = existsSync(path)
      ? [...readFileSync(path, 'utf8').matchAll(/<source>([\s\S]*?)<\/source>/g)].map((m) => decode(m[1]))
      : [];
    catalogues.set(path, new Set(sources));
  }

  return catalogues.get(path);
};

const seen = new Set();
const missing = [];

files.flatMap(extract).forEach((entry) => {
  const key = `${entry.domain}\u0000${entry.message}`;
  if (seen.has(key)) return;
  seen.add(key);

  const inDefault = catalogue('default', entry.domain).has(entry.message);
  const inLocale = locale ? catalogue(locale, entry.domain).has(entry.message) : true;

  if (!inDefault || !inLocale) {
    missing.push({...entry, where: [!inDefault && 'default', !inLocale && locale].filter(Boolean).join(', ')});
  }
});

if (!missing.length) {
  console.log(`All ${seen.size} strings of ${files.length} file(s) are in the catalogues.`);
  process.exit(0);
}

console.log(`${missing.length} of ${seen.size} strings are missing from a catalogue:\n`);
missing
  .sort((a, b) => a.domain.localeCompare(b.domain))
  .forEach(({message, domain, file, where}) => console.log(`- [${domain}] "${message}"  (missing in ${where}; ${file})`));
process.exit(1);
