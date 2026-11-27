/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/pagination/
// Twig: <twig:ui:Pagination> (src/PrestaShopBundle/Twig/Component/Ui/Pagination.php) renders this markup, keep both in sync.
import pagination, { PAGINATION_DEFAULTS, pageLinks } from '../pagination';
import { joinNodes, withTwig } from '../twig-snippet';
import { stackClasses } from '../layouts/layout-classes';
import { withDefaults } from '../story-defaults';

// A story that shows a fixed case: its controls would change nothing
const fixed = (story) => ({ controls: { disable: true }, docs: { description: { story } } });

// Story chrome: the paginations one under the other
const stack = (html) => `<div class="${stackClasses({})}">${html}</div>`;

const LABEL = 'Pages of the Orders list';

export default {
  title: 'Components/Pagination',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Pagination :current="3" :links="links" label="{{ \'Pages of the Orders list\'|trans({}, \'Admin.Orderscustomers.Feature\') }}"/>`. Previous, the page shown and Next, Bootstrap\'s pagination in a named `<nav>`. The caller builds the links (the grid from its offset and limit).',
          '**Props**: `current` (required: the page shown), `links` (required: page number => URL; at least the first, the last, the current page and its neighbours, the current one always), `label` (required: names the navigation for screen readers, which list\'s pages), `jumpUrl` (default none: a field to type the page to go to, for a long list; the URL of any page with `{page}`, or with `{offset}` and `perPage`), `perPage` (default none: the rows a page has, for `{offset}`). It shows Previous, "Page 3 of 25" and Next; with `jumpUrl`, the page shown is a field to go to any page ("Page [3] of 25 Go"). No page numbers: the arrows go to the neighbours, the field anywhere, so the bar is as narrow on a phone as on a desktop and never moves. On the first and the last page, the arrow that leads nowhere stays in place, disabled and hidden from screen readers. Nothing for a single page. Other attributes (`class`, `id`, `aria-describedby`) go on the `<nav>`.',
          '**Do**: one pagination under its list, with the list\'s name in the label when the page has several lists. **Don\'t**: a pagination for one page, links that are not real URLs (the keyboard and a new tab use them), "Pagination" as the label.',
          '**States**: a field to go to a page, the first, a middle and the last page, the text without a field, one page (nothing).',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    current: { control: { type: 'number', min: 1, step: 1 }, type: { name: 'number', required: true }, description: 'The page shown' },
    links: { control: 'object', type: { name: 'object', required: true }, description: 'Page number => URL: the first, the last, the current page and its neighbours at least', table: { type: { summary: 'array<int, string>' } } },
    label: { control: 'text', type: { name: 'string', required: true }, description: 'Names the navigation' },
    jumpUrl: { control: 'text', description: 'The URL of any page, with {page}, or {offset} and perPage: a field to type the page to go to', table: { type: { summary: 'string' } } },
    perPage: { control: { type: 'number', min: 1 }, description: 'Rows a page has, for {offset} in jumpUrl', table: { type: { summary: 'int' } } },
  }, PAGINATION_DEFAULTS),
  args: { current: 3, links: pageLinks(3, 25), label: LABEL, ...PAGINATION_DEFAULTS },
};

// The links are rebuilt around the current page (a whole number), up to the highest one given, with the URLs given, the
// label never empty and the jump props kept to what the component accepts: whatever the controls, Show code gives Twig
// that renders
export const Default = withTwig(({
  current, links, label, jumpUrl, perPage,
}) => {
  const total = Math.max(1, ...Object.keys(links ?? {}).map(Number).filter(Number.isInteger));
  const page = Math.min(Math.max(1, Math.trunc(Number(current) || 1)), total);
  // Pagination.php refuses an empty label: the story's own then
  const name = label?.trim() ? label : LABEL;

  // As Pagination.php accepts them: a jumpUrl with {page} or {offset}, an {offset} one with rows a page (50 if none)
  const url = jumpUrl && /\{(page|offset)\}/.test(jumpUrl) ? jumpUrl : null;
  const rows = url?.includes('{offset}') ? Math.max(1, Math.trunc(perPage || 50)) : null;

  return pagination({
    current: page, links: pageLinks(page, total, (number) => links?.[number] ?? `#page-${number}`), label: name, jumpUrl: url, perPage: rows,
  });
});

export const Ends = withTwig(() => joinNodes([
  pagination({ current: 1, links: pageLinks(1, 1000), label: 'Pages of the Orders list', jumpUrl: '#page-{page}' }),
  pagination({ current: 500, links: pageLinks(500, 1000), label: 'Pages of the Customers list', jumpUrl: '#page-{page}' }),
  pagination({ current: 1000, links: pageLinks(1000, 1000), label: 'Pages of the Carts list', jumpUrl: '#page-{page}' }),
], stack), fixed('The first, a middle and the last page of a thousand: on the first page Previous is disabled, on the last Next is; they stay in place, so the field never moves.'));

export const WithJump = withTwig(() => pagination({
  current: 12, links: pageLinks(12, 1000), label: LABEL, jumpUrl: '#orders?offset={offset}', perPage: 50,
}), fixed('A field to go to any page: type 640 and Go (or Enter); a number beyond the ends goes to the first or the last page, anything else puts the current page back. Its name reads "Page 12 of 1000". Here the list pages by offset: `jumpUrl` has `{offset}` and `perPage` is 50.'));

export const WithoutJump = withTwig(() => pagination({ current: 3, links: pageLinks(3, 25), label: LABEL }), fixed('Without `jumpUrl`: the page shown as text, "Page 3 of 25", between the arrows.'));

export const OnePage = withTwig(() => pagination({ current: 1, links: pageLinks(1, 1), label: LABEL }), fixed('One page: nothing is rendered (this story is empty).'));
