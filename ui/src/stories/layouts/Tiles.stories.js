/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:Layout:Tiles> (src/PrestaShopBundle/Twig/Component/Ui/Layout/Tiles.php) renders this markup, keep both in sync.
import { GAPS, TILES_COLUMNS, tilesClasses } from './layout-classes';
import { markup, twigCall, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

const card = (title, lines = 2) => [
  '<div class="card">',
  '  <div class="card-body">',
  `    <h2 class="h6">${title}</h2>`,
  ...Array.from({ length: lines }, () => '    <p class="mb-1 text-body-secondary">Content line</p>'),
  '  </div>',
  '</div>',
].join('\n');

// Tiles.php defaults (columns as text: the control's options)
const DEFAULTS = { columns: '3', gap: 'md', as: 'div' };

export default {
  title: 'Layouts/Tiles',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: equal columns for repeated items (cards, KPIs, logo blocks): one per line on phones, more as the width grows. The items are its direct children. Renders its own BEM classes (`layout/_tiles.scss`): the block, then one modifier per prop away from its default (`ps-tiles--gap-lg`; `ps-tiles--{columns}` is always there); its direct children lose their block margins, so a `p` or a heading needs no `mb-0`.',
          '```twig\n<twig:ui:Layout:Tiles columns="3" as="ul">\n  {% for theme in themes %}\n    <li><div class="card">…</div></li>\n  {% endfor %}\n</twig:ui:Layout:Tiles>\n```',
          '**Props**: `columns` (`2`, `3`, `4`, `6`: items per line at full width; default `3`), `gap` (`none`, `xs`, `sm`, `md`, `lg`, `xl`: the same scale as every layout; default `md`), `as` (`div`, `section`, `ul`, `ol`; default `div`; with a list, write each item as an `<li>`). Other attributes (`id`, `class`, `data-ps-*`, `aria-*`) go on the tiles.',
          '**Steps** (built in, no breakpoint prop): `2` → 1, then 2 from `md`; `3` → 1, then 3 from `lg`; `4` → 1, 2 from `md`, 4 from `xl`; `6` → 2, 3 from `md`, 6 from `xl` (small items). Items in a line share its height, so cards line up.',
          '**Tuning on one page**: the steps follow the screen width and suit full-width areas. When a page needs another count (or the tiles sit in a narrow area: a side column, a modal, an offcanvas), it adds its own class and sets `--ps-tiles-columns`, the number of tiles per line; no other override. A need that comes back on a second page goes into Tiles.',
          '```twig\n<twig:ui:Layout:Tiles columns="4" class="ps-dashboard__zones">…</twig:ui:Layout:Tiles>\n```',
          '```scss\n.ps-dashboard__zones {\n  @include media-breakpoint-up(lg) { --ps-tiles-columns: 3; }\n}\n```',
          '**Do**: dashboard zones, KPI rows, card groups, logo or theme cards; a list (`as="ul"`) when the items are a list. **Don\'t**: use it for a main + side split (the page or the layout that needs it places that with the Bootstrap grid), give items `col-*` or widths, or put a single item in it.',
          '**States**: each column count, as a list, uneven content (the items of a line keep the same height), a long unbreakable word, a page class setting `--ps-tiles-columns`.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    columns: { control: 'select', options: TILES_COLUMNS, description: 'Items per line at full width' },
    gap: { control: 'select', options: Object.keys(GAPS), description: 'Space between items, across and down' },
    as: { control: 'select', options: ['div', 'section', 'ul', 'ol'], description: 'Element of the tiles' },
  }, DEFAULTS),
  args: DEFAULTS,
};

// The markup of tiles.html.twig; in Twig the caller writes the <li> of a list
const tiles = ({ as = 'div', extraClass = '', ...props }, items) => {
  const list = as === 'ul' || as === 'ol';
  const nodes = items
    .map((item) => markup(item))
    .map((node) => (list ? { html: `<li>${node.html}</li>`, twig: `<li>\n${node.twig.replace(/^/gm, '  ')}\n</li>` } : node));

  return {
    html: `<${as} class="${tilesClasses({ ...props, as })}${extraClass ? ` ${extraClass}` : ''}">${nodes.map((node) => node.html).join('')}</${as}>`,
    twig: twigCall('ui:Layout:Tiles', { ...props, as, class: extraClass }, DEFAULTS, nodes),
  };
};

const cards = (count) => Array.from({ length: count }, (_, i) => card(`Card ${i + 1}`));

export const Default = withTwig((args) => tiles(args, cards(6)));

export const ColumnCounts = {
  parameters: { docs: { description: { story: 'Narrow the viewport to see each count step down.' } } },
  ...withTwig(() => {
    const grids = TILES_COLUMNS.map((columns) => ({ columns, node: tiles({ columns }, cards(Number(columns))) }));

    return {
      html: grids.map(({ columns, node }) => `
        <p class="small text-body-secondary mt-3 mb-1">columns="${columns}"</p>
        ${node.html}`).join(''),
      twig: grids.map(({ node }) => node.twig).join('\n\n'),
      rendered: grids.map(({ node }) => node.html).join(''),
    };
  }),
};

export const AsList = {
  args: { columns: '4', as: 'ul' },
  ...withTwig((args) => tiles(args, cards(4))),
};

export const UnevenContent = withTwig((args) => tiles(args, [card('Short', 1), card('Long', 6), card('Medium', 3), card('Reinitialisationdumotdepassedelaboutique', 1)]));

export const PageTuning = {
  parameters: { docs: { description: { story: 'A page class sets `--ps-tiles-columns`: 4 tiles become 3 from `lg` (here inline, on a page it lives in the page SCSS).' } } },
  ...withTwig(() => {
    const node = tiles({ columns: '4', extraClass: 'ps-story-tuned' }, cards(6));

    return {
      html: `<style>@media (min-width: 992px) { .ps-story-tuned { --ps-tiles-columns: 3; } }</style>${node.html}`,
      rendered: node.html,
      twig: `{# The page SCSS: .ps-story-tuned { @include media-breakpoint-up(lg) { --ps-tiles-columns: 3; } } #}\n${node.twig}`,
    };
  }),
};
