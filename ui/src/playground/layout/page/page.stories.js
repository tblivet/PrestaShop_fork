/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The page shell every back office page shares: header, side menu and the content area, the page head
// (<twig:ui:PageHead>) on top. A page with a grid takes the full width, the others the centred container (layoutFluid
// overrides it).
import { playgroundMeta } from '../../playground.meta.js';
import { boLayout } from '../bo-layout.js';
import pageHead from '../../../stories/page-head';
import showcaseModal from '../../../stories/showcase-modal';

export default {
  title: 'Playground/Layout/Page',
  // tags must be a literal array here — the CSF static indexer cannot follow import spreads
  tags: ['!autodocs'],
  ...playgroundMeta,
};

const HELP = 'https://docs.prestashop-project.org/';

// Story chrome: what the page's content will be
const placeholder = '<div class="card flex-grow-1"><div class="card-body text-body-secondary"><p>Page content goes here.</p></div></div>';

const listing = (title, columns, rows) => `
  <div class="card ps-grid-panel">
    <div class="card-body">
      <h2 class="h5">${title} (${rows.length})</h2>
      <table class="table">
        <thead><tr>${columns.map((column) => `<th scope="col">${column}</th>`).join('')}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>
  </div>`;

const dashboard = pageHead({
  title: 'Dashboard',
  icon: 'home',
  actions: [{ label: 'Refresh', icon: 'refresh', href: '#refresh' }],
  help: HELP,
}).html;

export const Default = {
  render: () => boLayout(dashboard + placeholder),
};

export const FullWidth = {
  render: () => boLayout(dashboard + placeholder, { fluid: true }),
};

// The page's introduction: it opens by itself until someone closes it (stored for the shop), then never again
const attributesShowcase = showcaseModal({
  name: 'attributes_card',
  title: 'Create attributes',
  image: '/helper-card/attributes@3x.svg',
  learnMore: HELP,
  text: '<p>Color, dimension, size, disk space... think about attributes as properties that change from one product to another. As a consequence, attributes allow you to build product combinations.</p>',
}).html;

export const AttributesListing = {
  render: () => boLayout(pageHead({
    title: 'Attributes & Features',
    icon: 'style',
    pages: [{ label: 'Attributes', href: '#attributes', current: true }, { label: 'Features', href: '#features' }],
    pagesLabel: 'Attributes & Features',
    actions: [{ label: 'Add new attribute', icon: 'add', href: '#new-attribute' }, { label: 'Add new value', icon: 'add', href: '#new-value' }],
    help: HELP,
  }).html + listing('Attributes', ['ID', 'Name', 'Values', 'Position'], [[1, 'Size', 4, 1], [2, 'Color', 14, 2], [3, 'Dimension', 3, 3], [4, 'Paper Type', 4, 4]]) + attributesShowcase),
  play: ({ canvasElement }) => {
    window.bootstrap.Modal.getOrCreateInstance(canvasElement.querySelector('[data-ps-ref="showcase-modal"]')).show();
  },
};

export const ContactsListing = {
  render: () => boLayout(pageHead({
    title: 'Contact',
    icon: 'contact_mail',
    pages: [{ label: 'Contacts', href: '#contacts', current: true }, { label: 'Stores', href: '#stores' }],
    pagesLabel: 'Contact',
    actions: [{ label: 'Add new contact', icon: 'add', href: '#new-contact' }],
    help: HELP,
  }).html + listing('Contacts', ['ID', 'Title', 'Email address', 'Description'], [[1, 'Webmaster', 'admin@prestashop.com', 'If a technical problem occurs on this website'], [2, 'Customer service', 'admin@prestashop.com', 'For any question about a product, an order']])),
};

// A settings page: the centred container, no action but Help
export const SettingsCentred = {
  render: () => boLayout(pageHead({ title: 'Product Settings', help: HELP }).html
    + '<div class="card"><div class="card-body"><h2 class="h5">General</h2><p>Settings form goes here.</p></div></div>'),
};
