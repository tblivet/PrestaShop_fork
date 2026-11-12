/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Every icon <twig:ui:Icon> can show: the Material Symbols of ui/icons/material-symbols (synced from Google's package
// by ui/.ai/bin/sync-icons.mjs) and the logos of ui/icons/brand. Only the icons on screen are loaded.
const files = import.meta.glob('../../../icons/{material-symbols,brand}/*.svg', { query: '?raw', import: 'default' });

// Template names: arrow_back for material-symbols/arrow-back.svg, brand:github for brand/github.svg; filled styles are
// the filled prop, not separate names
// A filled style is the "-fill" file of an icon that exists without it (format_color_fill is an icon of its own)
const icons = Object.keys(files)
  .filter((path) => !(path.endsWith('-fill.svg') && files[path.replace(/-fill\.svg$/, '.svg')]))
  .map((path) => {
    const [, set, file] = path.match(/\/(material-symbols|brand)\/([^/]+)\.svg$/);

    return { path, name: set === 'brand' ? `brand:${file}` : file.replaceAll('-', '_') };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const LIMIT = 120;

const sized = (svg) => svg.replace('<svg ', '<svg class="ps-icon" aria-hidden="true" ');

export default {
  title: 'Content/Icons',
  parameters: {
    docs: {
      description: {
        component: [
          `**${icons.length} icons** ship with the back office: every [Material Symbols](https://fonts.google.com/icons) icon (outlined, and filled with the \`filled\` prop) and a few brand logos. Use them with \`<twig:ui:Icon name="…"/>\` (see Components/Icon); never with an icon font.`,
          'They are SVG files: a page shows them with its first paint, at their size, and only reads the icons it uses. After a bump of `@material-symbols/svg-400`, run `node ui/.ai/bin/sync-icons.mjs` and commit `ui/icons/material-symbols`.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: {
    filled: { control: 'boolean', description: 'Show the filled style' },
  },
  args: { filled: false },
};

export const Search = {
  render: ({ filled }) => {
    const root = document.createElement('div');
    root.innerHTML = `
      <label class="form-label" for="icon-search">Search ${icons.length} icons</label>
      <input id="icon-search" type="search" class="form-control mb-2" placeholder="arrow, delete, brand…" autocomplete="off">
      <p class="small text-body-secondary mb-3" aria-live="polite" data-ps-ref="count"></p>
      <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0" data-ps-ref="results"></ul>`;

    const input = root.querySelector('input');
    const count = root.querySelector('[data-ps-ref="count"]');
    const results = root.querySelector('[data-ps-ref="results"]');
    let search = 0;

    const show = async () => {
      const current = ++search;
      const words = input.value.trim().toLowerCase().split(/[\s_-]+/).filter(Boolean);
      const matches = icons.filter(({ name }) => words.every((word) => name.includes(word)));
      const shown = matches.slice(0, LIMIT);
      let svgs;

      try {
        svgs = await Promise.all(shown.map(({ path, name }) => {
          const filledPath = path.replace(/\.svg$/, '-fill.svg');

          return (filled && !name.startsWith('brand:') && files[filledPath] ? files[filledPath] : files[path])();
        }));
      } catch (error) {
        count.textContent = `Icons could not be loaded: ${error.message}`;

        return;
      }

      if (current !== search) {
        return;
      }

      count.textContent = matches.length > LIMIT ? `${matches.length} icons, the first ${LIMIT} shown: refine the search` : `${matches.length} ${matches.length === 1 ? 'icon' : 'icons'}`;
      results.innerHTML = shown.map(({ name }, index) => `
        <li class="d-flex flex-column align-items-center gap-1 text-center p-2 border" style="width: 7.5rem">
          <span class="fs-3">${sized(svgs[index])}</span>
          <code class="small text-break">${name}</code>
        </li>`).join('');
    };

    input.addEventListener('input', show);
    show();

    return root;
  },
};
