/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:ShowcaseModal> (src/PrestaShopBundle/Twig/Component/Ui/ShowcaseModal.php) renders this markup, keep both in sync.
import edit from '../../../icons/material-symbols/edit.svg?raw';
import showcaseModal, { SHOWCASE_MODAL_DEFAULTS } from '../showcase-modal';
import uiIcon from '../ui-icon';
import { withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

// The nine cards of the back office (their partials' title, illustration and text), by name: the name control shows each
const CARDS = {
  attributes_card: ['Create attributes', 'attributes', 'Color, dimension, size, disk space... think about attributes as properties that change from one product to another. As a consequence, attributes allow you to build product combinations.'],
  carriers_card: ['Manage your carriers', 'carrier', 'Create carriers to let your customers choose their best shipping option in terms of delivery dates or fees. Start with editing/deleting the default "My carrier", and add as many options as you need.'],
  categories_card: ['Set categories', 'category', 'Categories are essential, as they enable you to group equivalent products. This helps customers find their way through the variety of your catalog.'],
  'cms-pages_card': ['Create meaningful content', 'content', 'Because it is not just selling products but also creating a universe, build pages to tell stories and catch your visitors’ interest, to turn them into loyal customers.'],
  customers_card: ['Administrate your customers', 'customer', 'Taking good care of your customers starts with making sure their profiles contain all the information needed to have their packages shipped without mishap.'],
  employees_card: ['Manage your team', 'team', 'Create roles for your employees with specific rights. SuperAdmin can access the entire store while other people can only be dedicated to the catalog or orders pages.'],
  features_card: ['Set features', 'features', 'Features are your product\'s intrinsic characteristics. If you sell tee-shirts, their cotton composition is considered a feature because it remains the same, unlike colors or sizes.'],
  monitoring_card: ['Focus on your catalog', 'monitoring', 'Empty categories, disabled products, items that lack image or price... check the monitoring section to optimize your products management and make sure you forgot nothing.'],
  'seo-urls_card': ['Improve your SEO', 'seo', 'Edit information about your pages to gain visibility and therefore reach more visitors. We advise you to start with the index page, it stands for your homepage.'],
};

// The card of the name, its title, image or text replaced by the controls that are set
const props = ({ name, title, image, text, ...rest }) => {
  const [cardTitle, illustration, cardText] = CARDS[name];

  return { name, title: title || cardTitle, image: image || `/helper-card/${illustration}@3x.svg`, text: text || `<p>${cardText}</p>`, ...rest };
};


// Story chrome: shown open in place, so the docs page shows it too
const inPlace = (node) => ({
  ...node,
  html: `<div class="bg-body-tertiary p-3">${node.html.replace('class="modal fade ps-modal', 'class="modal ps-modal d-block position-static')}</div>`,
  rendered: node.html,
});

// The page opens it when it loads (showcase-modal.ts); here the story does
const open = ({ canvasElement }) => {
  window.bootstrap.Modal.getOrCreateInstance(canvasElement.querySelector('.modal')).show();
};

export default {
  title: 'Components/ShowcaseModal',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: the introduction of a page (what attributes are, how categories work), rendered while its card is not closed. The content block is its text.',
          '```twig\n{% if not isShowcaseCardClosed %}\n  <twig:ui:ShowcaseModal\n    name="attributes_card"\n    title="{{ \'Create attributes\'|trans({}, \'Admin.Catalog.Feature\') }}"\n    image="{{ asset(\'themes/new-theme/public/helper-card/attributes@3x.svg\') }}"\n    learnMore="{{ documentation_link(\'attribute\') }}"\n  >\n    <p>…</p>\n  </twig:ui:ShowcaseModal>\n{% endif %}\n```',
          '**Props**: `name` (required: the showcase card, one of `ShowcaseCard::SUPPORTED_NAMES`, the key its closing is stored under), `title` (required), `image` (required: the illustration\'s URL, decorative), `learnMore` (default none: the documentation, opened in a new tab). Other attributes go on the modal. Content: the text. Block `actions`: a secondary button to where to start, before "Got it".',
          '**Behaviour**: `showcase-modal.ts` opens it when the page loads. It is static: a click outside does not close it; its close button, "Got it" or Escape do, and record it closed for the shop (`admin_close_showcase_card`), so the page renders it no more, for any employee.',
          '**Do**: one per page, rendered only while the card is open (`isShowcaseCardClosed`); at most one secondary button to where to start, in the `actions` block, before "Got it" (SEO & URLs: "Configure index page"). **Don\'t**: a form or a link to an action in the text; repeat the page title as its title.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    name: { control: 'select', options: Object.keys(CARDS), type: { name: 'string', required: true }, description: 'Showcase card name (ShowcaseCard::SUPPORTED_NAMES): its closing is stored under it. Here it also shows that card\'s title, illustration and text' },
    title: { control: 'text', type: { name: 'string', required: true }, description: 'Title (empty: the card\'s)' },
    image: { control: 'text', type: { name: 'string', required: true }, description: 'Illustration URL (empty: the card\'s)' },
    learnMore: { control: 'text', description: 'Documentation URL, opened in a new tab', table: { type: { summary: 'string' }, defaultValue: { summary: 'none' } } },
    text: { control: 'text', description: 'Content block: the text, HTML (empty: the card\'s)' },
  }, SHOWCASE_MODAL_DEFAULTS),
  args: { name: 'attributes_card', learnMore: 'https://docs.prestashop-project.org/' },
};

export const Default = withTwig((args) => inPlace(showcaseModal(props(args))));

export const WithoutLearnMore = {
  ...withTwig((args) => inPlace(showcaseModal(props(args)))),
  args: { name: 'features_card', learnMore: null },
};

// The actions block: a button to where to start, before "Got it"
const configureIndex = {
  html: `<a class="btn btn-secondary ps-button" href="#index-page">${uiIcon(edit, { size: 'lg' })}<span class="ps-button__label">Configure index page</span></a>`,
  twig: '<twig:ui:Button variant="secondary" icon="edit" href="#index-page">Configure index page</twig:ui:Button>',
};

export const WithAction = {
  ...withTwig((args) => inPlace(showcaseModal({ ...props(args), actions: configureIndex })), {
    docs: { description: { story: 'SEO & URLs: the actions block puts a button to where to start before "Got it".' } },
  }),
  args: { name: 'seo-urls_card' },
};

// The real behaviour: opened over the page with its backdrop; not on the docs page, where it would cover it
export const OpenedOnLoad = {
  ...withTwig((args) => showcaseModal(props(args))),
  tags: ['!autodocs'],
  play: open,
};
