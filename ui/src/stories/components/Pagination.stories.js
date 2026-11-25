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
          '**Props**: `current` (required: the page shown), `links` (required: page number => URL; at least the first, the last, the current page and its neighbours, the current one always), `label` (required: names the navigation for screen readers, which list\'s pages). It shows the first, the last, the current page and its neighbours among the links, a gap where pages are left out, Previous and Next only where they lead somewhere (no disabled arrows), nothing for a single page. In a nav narrower than 24rem (a phone, a narrow card): Previous, "Page 3 of 25", Next. Other attributes (`class`, `id`) go on the `<nav>`.',
          '**Do**: one pagination under its list, with the list\'s name in the label when the page has several lists. **Don\'t**: a pagination for one page, links that are not real URLs (the keyboard and a new tab use them), "Pagination" as the label.',
          '**States**: a few pages, many pages at the start, in the middle and at the end, two pages, one page (nothing), the compact form in a phone\'s width.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    current: { control: { type: 'number', min: 1 }, type: { name: 'number', required: true }, description: 'The page shown' },
    links: { control: 'object', type: { name: 'object', required: true }, description: 'Page number => URL: the first, the last, the current page and its neighbours at least', table: { type: { summary: 'array<int, string>' } } },
    label: { control: 'text', type: { name: 'string', required: true }, description: 'Names the navigation' },
  }, PAGINATION_DEFAULTS),
  args: { current: 3, links: pageLinks(3, 25), label: LABEL },
};

// The links are rebuilt around the current page, up to the highest one given: changing current alone stays valid
export const Default = withTwig(({ current, links, label }) => {
  const total = Math.max(1, ...Object.keys(links ?? {}).map(Number));
  const page = Math.min(Math.max(1, current), total);

  return pagination({ current: page, links: pageLinks(page, total), label });
});

export const FewPages = withTwig(() => pagination({ current: 2, links: pageLinks(2, 3), label: LABEL }), fixed('Three pages: all of them, no gap.'));

export const ManyPages = withTwig(() => joinNodes([
  pagination({ current: 1, links: pageLinks(1, 1000), label: 'Pages of the Orders list' }),
  pagination({ current: 500, links: pageLinks(500, 1000), label: 'Pages of the Customers list' }),
  pagination({ current: 1000, links: pageLinks(1000, 1000), label: 'Pages of the Carts list' }),
], stack), fixed('A thousand pages, at the start, in the middle and at the end: the first, the last, the current page and its neighbours, a gap for the others; no Previous on the first page, no Next on the last.'));

export const TwoPages = withTwig(() => pagination({ current: 1, links: pageLinks(1, 2), label: LABEL }), fixed('Two pages, on the first: Next only.'));

export const OnePage = withTwig(() => pagination({ current: 1, links: pageLinks(1, 1), label: LABEL }), fixed('One page: nothing is rendered (this story is empty).'));

// Story chrome: the width of a phone's content
const phone = (html) => `<div style="max-width: 23.4375rem">${html}</div>`;

export const Compact = withTwig(() => framedNodes([pagination({ current: 12, links: pageLinks(12, 25), label: LABEL })], phone), fixed('In a nav narrower than 24rem (a phone, a narrow card): Previous, "Page 12 of 25", Next. The nav is a container, so it follows its own width, not the screen\'s. Screen readers hear the position at every width.'));
