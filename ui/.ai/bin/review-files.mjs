#!/usr/bin/env node
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Lists the files a web integrator reviews for a /ui kit change, grouped by what to look at:
// templates, form theme, kit components, layouts, SCSS, stories and mockups, then the rest.
//
//   node ui/.ai/bin/review-files.mjs [--base <ref>] [--uncommitted] [path-filter …]
//
// Default: everything changed on the branch since its merge base with upstream/develop, plus uncommitted and
// untracked files. --uncommitted: only what is not committed yet (the rework in progress).
// Path filters keep files whose path contains one of them (e.g. "Login" "login" "password").
import {execSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {join} from 'node:path';

const root = execSync('git rev-parse --show-toplevel').toString().trim();
const git = (command) => execSync(`git ${command}`, {cwd: root}).toString().split('\n').filter(Boolean);
const argv = process.argv.slice(2);
const option = (name) => {
  const i = argv.indexOf(`--${name}`);

  return i === -1 ? null : argv.splice(i, 2)[1];
};
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);

  return i === -1 ? false : Boolean(argv.splice(i, 1));
};

const uncommitted = flag('uncommitted');
const base = option('base') || ['upstream/develop', 'origin/develop', 'develop'].find((ref) => {
  try {
    execSync(`git rev-parse --verify --quiet ${ref}`, {cwd: root, stdio: 'ignore'});

    return true;
  } catch {
    return false;
  }
});
const filters = argv;

const files = [...new Set([
  ...(uncommitted ? git('diff --name-only HEAD') : git(`diff --name-only ${git(`merge-base HEAD ${base}`)[0]}`)),
  ...git('ls-files --others --exclude-standard'),
])]
  .filter((file) => !filters.length || filters.some((filter) => file.includes(filter)))
  .sort();

const views = 'src/PrestaShopBundle/Resources/views/';
const groups = [
  {title: 'Kit components (class, template)', test: (f) => /Twig\/Component\/Ui\/(?!Layout\/)/.test(f) || f.startsWith(`${views}Admin/Component/Ui/`) && !f.includes('/Layout/')},
  {title: 'Kit layouts', test: (f) => /Twig\/Component\/Ui\/Layout\//.test(f) || f.startsWith(`${views}Admin/Component/Ui/Layout/`)},
  {title: 'Form theme', test: (f) => f.startsWith(`${views}Admin/TwigTemplateForm/ui_kit`)},
  {title: 'Page templates (Twig)', test: (f) => f.startsWith(views) && f.endsWith('.twig')},
  {title: 'SCSS', test: (f) => f.startsWith('ui/src/scss/') || f.endsWith('.scss')},
  {title: 'Storybook stories and mockups (the reference)', test: (f) => f.startsWith('ui/src/stories/') || f.startsWith('ui/src/playground/')},
  {title: 'Behaviour (JS)', test: (f) => f.startsWith('ui/src/js/') || f.startsWith('admin-dev/themes/new-theme/js/')},
  {title: 'Icons and assets', test: (f) => f.startsWith('ui/icons/') || f.startsWith('ui/public/')},
  {title: 'Lint rules', test: (f) => /stylelintrc|eslintrc/.test(f)},
];
const kitFiles = files.filter((f) => !f.startsWith('tests/') && groups.some((g) => g.test(f)));

const lines = [`# Files to review${filters.length ? ` (${filters.join(', ')})` : ''}`, ''];
const placed = new Set();
groups.forEach((group) => {
  const list = kitFiles.filter((f) => !placed.has(f) && group.test(f));
  list.forEach((f) => placed.add(f));
  if (list.length) {
    lines.push(`## ${group.title}`, '', ...list.map((f) => `- \`${f}\`${existsSync(join(root, f)) ? '' : ' (deleted)'}`), '');
  }
});

const others = files.filter((f) => !placed.has(f) && /\.(php|ts|js|twig)$/.test(f) && !f.startsWith('ui/.ai/') && !f.startsWith('.ai/') && !f.startsWith('.claude/'));
if (others.length) {
  lines.push('## Also changed (not integrator files: PHP, tests, tooling)', '', ...others.map((f) => `- \`${f}\``), '');
}

lines.push(
  'For each file: BEM + utilities + `data-ps-*` (`ui/.ai/CONVENTIONS.md`), components never placed by margins and layouts never styling their children, logical properties, translated strings, and the page matching its story.',
);
console.log(lines.join('\n'));
