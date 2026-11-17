/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:HeaderSearch> (src/PrestaShopBundle/Twig/Component/Ui/HeaderSearch.php) renders this markup, keep both in sync.
// Below md the field is a Bootstrap offcanvas-md panel, the search type menu a Bootstrap dropdown.
import headerSearch, { SEARCH_ICONS, SEARCH_TYPES } from '../header-search';
import { framedNodes, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

// HeaderSearch.php defaults; action and types are required
const DEFAULTS = { query: '', type: 0 };

const search = (props) => headerSearch(props, SEARCH_ICONS);

// Story chrome: the dark bar the search sits in, with room for its open menu
const bar = (html) => `<div style="min-height: 16rem"><div class="ps-header">${html}</div></div>`;

export default {
  title: 'Components/HeaderSearch',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:block name="search"><twig:ui:HeaderSearch action="{{ legacy_path(\'AdminSearch\') }}" query="{{ searchQuery }}" :type="searchType" :types="[…]"/></twig:block>`. The search of `<twig:ui:Header>`, in its `search` block: a field in the bar from md up; below md, a button that opens it as a panel sliding from the top. Rendered once by the page shell (`Component/Layout/Ui/header.html.twig`).',
          '**Props**: `action` (required: where the form posts `bo_query` and `bo_search_type`), `query` (default empty: the text searched), `type` (default `0`: the chosen type\'s value, the hidden `bo_search_type`; one not in `types` falls back to the first), `types` (required, at least one: a list of `{value, label, placeholder, icon}`, `icon` optional, picked in a menu after the field; the chosen one sets the placeholder and, between md and xl, the button shows its icon instead of its label). Other attributes (a `class`, `data-ps-*`) go on the panel.',
          '**Do**: a placeholder that says what to type ("Order ID"), a label that says where it looks. **Don\'t**: more than one per page, a search of the page\'s own list (that is the grid filter).',
          '**States**: with its types, a chosen type and a query, a long label. Below md (use the viewport toolbar): the search button opens the panel.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    action: { control: 'text', description: 'Where the form posts (required)' },
    query: { control: 'text', description: 'The text searched' },
    type: { control: 'select', options: SEARCH_TYPES.map((item) => item.value), description: 'The chosen type\'s value' },
    types: { control: 'object', description: 'Where to search: {value, label, placeholder, icon} (required)' },
  }, DEFAULTS),
  args: { action: '#search', ...DEFAULTS, types: SEARCH_TYPES },
};

export const Default = withTwig((args) => framedNodes([search(args)], bar));

export const ChosenType = withTwig(() => framedNodes([search({ action: '#search', query: '12', type: 3, types: SEARCH_TYPES })], bar), {
  docs: { description: { story: 'After a search: the field keeps the query, the button the chosen type, which sets the placeholder.' } },
});

export const LongLabels = withTwig(() => framedNodes([search({
  action: '#search',
  type: 2,
  types: [...SEARCH_TYPES.slice(0, 2), { value: 2, label: 'Kunden nach Namen', placeholder: 'Vor- oder Nachname des Kunden', icon: 'group' }],
})], bar), { docs: { description: { story: 'A German label: the field shrinks first; between md and xl the button shows the icon.' } } });
