/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/pagination/
// Twig: <twig:ui:Pagination> (src/PrestaShopBundle/Twig/Component/Ui/Pagination.php) renders this markup, keep both in sync.
import pagination, { PAGINATION_DEFAULTS, pageLinks } from '../pagination';
import { framedNodes, joinNodes, withTwig } from '../twig-snippet';
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
          '**Twig usage**: `<twig:ui:Pagination :current="3" :links="links" label="{{ \'Pages of the Orders list\'|trans({}, \'Admin.Orderscustomers.Feature\') }}"/>`. Links to the pages of a list, Bootstrap\'s pagination in a named `<nav>`. The caller builds the links (the grid from its offset and limit).',
          '**Props**: `current` (required: the page shown), `links` (required: page number => URL; at least the first, the last, the current page and its neighbours, the current one always), `label` (required: names the navigation for screen readers, which list\'s pages), `jumpUrl` (default none: a field to type the page to go to, for a long list; the URL of any page with `{page}`, or with `{offset}` and `perPage`), `perPage` (default none: the rows a page has, for `{offset}`). It shows the first, the last, the current page and its neighbours among the links, a gap where pages are left out, Previous and Next only where they lead somewhere (no disabled arrows), nothing for a single page. In a nav narrower than 24rem (a phone, a narrow card): Previous, "Page 3 of 25", Next. Other attributes (`class`, `id`) go on the `<nav>`.',
          '**Do**: one pagination under its list, with the list\'s name in the label when the page has several lists. **Don\'t**: a pagination for one page, links that are not real URLs (the keyboard and a new tab use them), "Pagination" as the label.',
          '**States**: a few pages, a field to go to a page, many pages at the start, in the middle and at the end, two pages, one page (nothing), the compact form in a phone\'s width.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    current: { control: { type: 'number', min: 1 }, type: { name: 'number', required: true }, description: 'The page shown' },
    links: { control: 'object', type: { name: 'object', required: true }, description: 'Page number => URL: the first, the last, the current page and its neighbours at least', table: { type: { summary: 'array<int, string>' } } },
    label: { control: 'text', type: { name: 'string', required: true }, description: 'Names the navigation' },
    jumpUrl: { control: 'text', description: 'The URL of any page, with {page}, or {offset} and perPage: a field to type the page to go to', table: { type: { summary: 'string' } } },
    perPage: { control: { type: 'number', min: 1 }, description: 'Rows a page has, for {offset} in jumpUrl', table: { type: { summary: 'int' } } },
  }, PAGINATION_DEFAULTS),
  args: { current: 3, links: pageLinks(3, 25), label: LABEL, ...PAGINATION_DEFAULTS },
};

// The links are rebuilt around the current page, up to the highest one given, and the jump props kept to what the
// component accepts: whatever the controls, Show code gives Twig that renders
export const Default = withTwig(({
  current, links, label, jumpUrl, perPage,
}) => {
  const total = Math.max(1, ...Object.keys(links ?? {}).map(Number));
  const page = Math.min(Math.max(1, current), total);

  // As Pagination.php accepts them: a jumpUrl with {page} or {offset}, an {offset} one with rows a page (50 if none)
  const url = jumpUrl && /\{(page|offset)\}/.test(jumpUrl) ? jumpUrl : null;
  const rows = url?.includes('{offset}') ? Math.max(1, Math.trunc(perPage || 50)) : null;

  return pagination({
    current: page, links: pageLinks(page, total), label, jumpUrl: url, perPage: rows,
  });
});

export const FewPages = withTwig(() => pagination({ current: 2, links: pageLinks(2, 3), label: LABEL }), fixed('Three pages: all of them, no gap.'));

export const ManyPages = withTwig(() => joinNodes([
  pagination({ current: 1, links: pageLinks(1, 1000), label: 'Pages of the Orders list' }),
  pagination({ current: 500, links: pageLinks(500, 1000), label: 'Pages of the Customers list' }),
  pagination({ current: 1000, links: pageLinks(1000, 1000), label: 'Pages of the Carts list' }),
], stack), fixed('A thousand pages, at the start, in the middle and at the end: the first, the last, the current page and its neighbours, a gap for the others; no Previous on the first page, no Next on the last.'));

export const TwoPages = withTwig(() => pagination({ current: 1, links: pageLinks(1, 2), label: LABEL }), fixed('Two pages, on the first: Next only.'));

export const OnePage = withTwig(() => pagination({ current: 1, links: pageLinks(1, 1), label: LABEL }), fixed('One page: nothing is rendered (this story is empty).'));

export const WithJump = withTwig(() => pagination({
  current: 12, links: pageLinks(12, 1000), label: LABEL, jumpUrl: '#orders?offset={offset}', perPage: 50,
}), fixed('A field to go to any page, for a long list: type 640 and Go (or Enter); a number beyond the ends goes to the first or the last page, anything else puts the current page back. Its name reads "Page 12 of 1000". Here the list pages by offset: `jumpUrl` has `{offset}` and `perPage` is 50.'));

// Story chrome: the width of a phone's content
const phone = (html) => `<div style="max-width: 23.4375rem">${html}</div>`;

export const Compact = withTwig(() => framedNodes([
  pagination({ current: 12, links: pageLinks(12, 25), label: LABEL }),
  pagination({ current: 12, links: pageLinks(12, 25), label: 'Pages of the Customers list', jumpUrl: '#page-{page}' }),
], phone), fixed('In a nav narrower than 24rem (a phone, a narrow card): Previous, "Page 12 of 25", Next; with a field to go to a page, the field takes the place of "Page 12 of 25". The nav is a container, so it follows its own width, not the screen\'s. Screen readers hear the position at every width.'));
