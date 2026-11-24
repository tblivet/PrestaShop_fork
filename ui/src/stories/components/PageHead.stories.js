/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:PageHead> (src/PrestaShopBundle/Twig/Component/Ui/PageHead.php) renders this markup, keep both in sync.
import pageHead, { PAGE_HEAD_DEFAULTS, PAGE_HEAD_ICONS } from '../page-head';
import { withTwig } from '../twig-snippet';
import { nullableSelect, withDefaults } from '../story-defaults';

const HELP = 'https://docs.prestashop-project.org/';

const ATTRIBUTES = {
  title: 'Attributes & Features',
  icon: 'style',
  pages: [{ label: 'Attributes', href: '#attributes', current: true }, { label: 'Features', href: '#features' }],
  pagesLabel: 'Attributes & Features',
  actions: [{ label: 'Add new attribute', icon: 'add', href: '#new-attribute' }, { label: 'Add new value', icon: 'add', href: '#new-value' }],
  help: HELP,
};

// Story chrome: the head sits in the content area of a page, its band reaching the area's edges
const frame = (html) => `<div class="ps-layout__content"><div class="ps-layout__container ps-layout__container--fluid">${html}</div></div>`;
const framed = (node) => ({ ...node, html: frame(node.html), rendered: node.html });

export default {
  title: 'Components/PageHead',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          '**Twig usage**: every kit page gets it from the layout (`Layout/Ui/toolbar.html.twig`), filled from the page: `layoutTitle` (or the menu entry; on a page with sub-pages, the name of their group, the same on each), `layoutIcon` (to override the icon of the page\'s menu entry, `Toolbar::KIT_TITLE_ICONS`; on a sub-page, its group\'s), `layoutHeaderToolbarBtn` (its buttons), the help link, and the menu\'s sibling sub-pages. A module adds a button with `actionGetAdminToolbarButtons`, as on a legacy page. A page does not render it itself. Called directly:',
          '```twig\n<twig:ui:PageHead\n  title="Attributes & Features"\n  icon="style"\n  :pages="[…]"\n  pagesLabel="Attributes & Features"\n  :actions="[{label: \'Add new attribute\', icon: \'add\', href: path(\'admin_attribute_groups_create\')}]"\n  help="…"\n/>\n```',
          '**Props**: `title` (required: the h1), `icon` (default none: a [Material Symbols](https://fonts.google.com/icons) name before the title, decorative), `pages` (default none: the sibling sub-pages, `{label, href, current}`), `pagesLabel` (required with `pages`: what they are part of, the name of their navigation), `actions` (default none: `{label, icon, href, external, disabled, attr}`, the main one first; `attr` goes on the button: `id`, `data-*`, a modal toggle), `help` (default none: the page\'s help, an icon button opening it in a new tab).',
          '**Layout**: a white band across the content area. The sub-pages sit on its bottom edge and scroll sideways when they do not fit, with a fade on the edge that hides more; they come before the actions in the markup, so the keyboard reaches them first. Every action is a small button with its icon and its label, the main one filled; Help alone is an icon button, its tooltip under it. Under the md breakpoint (768px) every action, the main one first, and Help are in the "More actions" menu. A title keeps at least 10rem: narrower, the actions go under it.',
          '**Do**: an icon on every action, the main action first, a label that says the action ("Add new attribute"). **Don\'t**: a breadcrumb (the side menu says where the page is), more than three actions, an action that only links to the help.',
          '**States**: a title only, with its icon, the sub-pages (2, 4 and 15), up to three actions, a disabled action, an action opening a new tab; resize to a phone for the actions menu.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    title: { control: 'text', description: 'The page title (h1)' },
    icon: nullableSelect(Object.keys(PAGE_HEAD_ICONS), '`<twig:ui:Icon>` name before the title, decorative'),
    pages: { control: 'object', description: 'Sibling sub-pages: {label, href, current}' },
    pagesLabel: { control: 'text', description: 'What the sub-pages are part of; required with pages', table: { type: { summary: 'string' } } },
    actions: { control: 'object', description: 'Page actions, the main one first: {label, icon, href, external, disabled, attr}' },
    help: { control: 'text', description: 'Help URL, opened in a new tab', table: { type: { summary: 'string' } } },
  }, PAGE_HEAD_DEFAULTS),
  args: { ...ATTRIBUTES },
};

export const Default = withTwig((args) => framed(pageHead(args)));

export const TitleOnly = withTwig(() => framed(pageHead({ title: 'Maintenance' })), {
  docs: { description: { story: 'No sub-page, no action: the band holds the title alone.' } },
});

export const WithIcon = withTwig(() => framed(pageHead({
  title: 'Products', icon: 'inventory_2', actions: [{ label: 'Add new product', icon: 'add', href: '#new-product' }], help: HELP,
})), { docs: { description: { story: 'A listing page: its icon, its one action and Help.' } } });

export const SubPages = withTwig(() => framed(pageHead(ATTRIBUTES)), {
  docs: { description: { story: 'The sibling sub-pages of the menu, the current one underlined, on the band\'s edge; the title names their group, so it stays the same from one to the other.' } },
});

export const FourSubPages = withTwig(() => framed(pageHead({
  title: 'Localization',
  pages: ['Localization', 'Languages', 'Currencies', 'Geolocation'].map((label, index) => ({ label, href: `#${label.toLowerCase()}`, current: index === 0 })),
  pagesLabel: 'Localization',
  actions: [{ label: 'Import a localization pack', icon: 'download', href: '#import' }],
  help: HELP,
})), { docs: { description: { story: 'International > Localization, the most sub-pages of the back office today.' } } });

export const ManySubPages = withTwig(() => framed(pageHead({
  title: 'Traffic & SEO',
  pages: ['SEO & URLs', 'Search engines', 'Referrers', 'Robots file', 'Sitemaps', 'Redirections', 'Canonical URLs', 'Meta tags', 'Social sharing', 'Structured data', 'Hreflang', 'Pagination', 'Images', 'Performance', 'Logs']
    .map((label, index) => ({ label, href: `#page-${index}`, current: index === 0 })),
  pagesLabel: 'Traffic & SEO',
  actions: [{ label: 'Add new page', icon: 'add', href: '#new-page' }],
  help: HELP,
})), { docs: { description: { story: 'Fifteen sub-pages (a module may add some): they scroll sideways, the edge that hides more fades.' } } });

export const ThreeActions = withTwig(() => framed(pageHead({
  title: 'Configure: Newsletter',
  actions: [
    { label: 'Back', icon: 'arrow_back', href: '#back' },
    { label: 'Translate', icon: 'translate', attr: { 'data-bs-toggle': 'modal', 'data-bs-target': '#translate' } },
    { label: 'Manage hooks', icon: 'anchor', href: '#hooks' },
  ],
  help: HELP,
})), { docs: { description: { story: 'The most actions a page has today (configure a module); "Translate" opens a modal: a button, its toggle in `attr`.' } } });

export const DisabledAction = withTwig(() => framed(pageHead({
  title: 'Orders', icon: 'inventory_2', actions: [{ label: 'Add new order', icon: 'add', href: '#new-order', disabled: true, attr: { title: 'Select a shop to add an order' } }], help: HELP,
})), { docs: { description: { story: 'Not available in this context (all shops): disabled, its reason in a title.' } } });

export const ExternalAction = withTwig(() => framed(pageHead({
  title: 'Module manager', actions: [{ label: 'Marketplace', icon: 'open_in_new', href: 'https://addons.prestashop.com/', external: true }], help: HELP,
})), { docs: { description: { story: 'An action that opens a new tab says so to screen readers.' } } });

