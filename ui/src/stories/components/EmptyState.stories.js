/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:EmptyState> (src/PrestaShopBundle/Twig/Component/Ui/EmptyState.php) renders this markup, keep both in sync.
import inbox from '../../../icons/material-symbols/inbox.svg?raw';
import receiptLong from '../../../icons/material-symbols/receipt-long.svg?raw';
import searchOff from '../../../icons/material-symbols/search-off.svg?raw';
import shoppingBasket from '../../../icons/material-symbols/shopping-basket.svg?raw';
import emptyState, { EMPTY_STATE_DEFAULTS, EMPTY_STATE_SIZES, emptyStateButton } from '../empty-state';
import { framedNodes, withTwig } from '../twig-snippet';
import { nullableSelect, withDefaults } from '../story-defaults';

// Some <twig:ui:Icon> names an empty state can show; any icon works (Content/Icons)
const ICONS = { inbox, receipt_long: receiptLong, search_off: searchOff, shopping_basket: shoppingBasket };

const node = (props) => emptyState(props, ICONS);

// A story that shows a fixed case: its controls would change nothing
const fixed = (story) => ({ controls: { disable: true }, docs: { description: { story } } });

// Story chrome: the card or the table an empty state sits in
const inCard = (html) => `<div class="card"><div class="card-body">${html}</div></div>`;

export default {
  title: 'Components/EmptyState',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:EmptyState icon="shopping_basket" title="{{ \'You have no orders yet\'|trans({}, \'Admin.Orderscustomers.Feature\') }}">{{ message }}<twig:block name="actions"><twig:ui:Button href="{{ path(\'admin_orders_create\') }}">…</twig:ui:Button></twig:block></twig:ui:EmptyState>`. What a list or a block shows when it has nothing to show: an icon, a title, a message, its actions, centred one under the other.',
          '**Props**: `title` (required: says what is empty), `icon` (default none: a [Material Symbols](https://fonts.google.com/icons) name, decorative and neutral, not a warning: nothing went wrong), `size` (`md`, `sm`; default `md`: a list with nothing yet; `sm` inside a card or a table row, as "no results match these filters"), `headingLevel` (2 to 6, default 2: the title\'s level after the heading of the block it is in). Content: the message (text, links). Block `actions`: its buttons, centred in a row that wraps. Other attributes (`class`, `id`, `data-ps-*`) go on the root.',
          '**Do**: a title that says what is missing ("You have no orders yet"), a message that says why or what to do, one main action to start (create, import); "No results match these filters" with Clear filters when filters hide everything. **Don\'t**: a warning or error icon, the same text for "nothing yet" and "no match", an error message (an alert), more than two actions.',
          '**States**: a list with nothing yet (title, message, actions), no match (sm, in a table row), title only, a long translation.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    title: { control: 'text', type: { name: 'string', required: true }, description: 'Says what is empty' },
    icon: nullableSelect(Object.keys(ICONS), '`<twig:ui:Icon>` name, decorative and neutral'),
    size: { control: 'select', options: EMPTY_STATE_SIZES, description: 'md: a list; sm: in a card or a table row' },
    headingLevel: { control: 'select', options: [2, 3, 4, 5, 6], description: 'The title\'s heading level' },
    message: { control: 'text', description: 'Content block: the message', table: { type: { summary: 'HTML' } } },
  }, EMPTY_STATE_DEFAULTS),
  args: {
    title: 'You have no orders yet', ...EMPTY_STATE_DEFAULTS, icon: 'shopping_basket', message: 'Orders placed in your shop show here. You can also create one for a customer.',
  },
};

export const Default = withTwig((args) => node({
  ...args,
  actions: [emptyStateButton({ label: 'Add new order', href: '#orders-new' })],
}));

export const NothingYet = withTwig(() => framedNodes([node({
  id: 'credit-slip-empty',
  'data-ps-ref': 'grid-empty',
  title: 'You have no credit slips yet',
  icon: 'receipt_long',
  headingLevel: 3,
  message: '<p>A credit slip is created when you refund an order, from its page.</p>',
  actions: [emptyStateButton({ label: 'Go to orders', href: '#orders' }), emptyStateButton({ label: 'Learn more', variant: 'outline-secondary', href: '#docs' })],
})], inCard), fixed('A list with nothing yet, in its card: what is missing, why, and where to start; a second, lighter action at most. Other attributes (here `id` and `data-ps-ref`) go on the root.'));

// Story chrome: a table with its header, the empty state in its only row
const inTable = (html) => `<table class="table"><thead><tr><th scope="col">Reference</th><th scope="col">Customer</th><th scope="col">Total</th></tr></thead><tbody><tr><td colspan="3">${html}</td></tr></tbody></table>`;

export const NoMatch = withTwig(() => framedNodes([node({
  title: 'No results match these filters',
  icon: 'search_off',
  size: 'sm',
  headingLevel: 3,
  actions: [emptyStateButton({ label: 'Clear filters', variant: 'outline-secondary' })],
})], inTable), fixed('Filters hide every row: a small state in the table, under its headers, with Clear filters; not the same words as a list with nothing yet.'));

export const TitleOnly = withTwig(() => framedNodes([node({ title: 'No files attached', size: 'sm', headingLevel: 3 })], inCard), fixed('Only a title, in a small block: the rest is optional.'));

export const LongTranslation = withTwig(() => framedNodes([node({
  title: 'Vous n\'avez encore reçu aucune commande dans votre boutique',
  icon: 'inbox',
  message: 'Les commandes passées dans votre boutique s\'afficheront ici. Vous pouvez aussi en créer une pour un client depuis cette page.',
  actions: [emptyStateButton({ label: 'Ajouter une nouvelle commande', href: '#orders-new' })],
})], (html) => `<div style="max-width: 22rem">${inCard(html)}</div>`), fixed('A long French title, message and action in a narrow card: everything wraps, centred.'));
