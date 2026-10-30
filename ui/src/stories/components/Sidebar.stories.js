/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Custom sidebar menu component built on nav-pills — https://getbootstrap.com/docs/5.3/components/navs-tabs/#pills
// Sub-menus use Bootstrap collapse — https://getbootstrap.com/docs/5.3/components/collapse/
const ITEMS = [
  { section: null, links: [{ label: 'Dashboard', icon: 'home' }] },
  {
    section: 'Sell',
    links: [
      {
        label: 'Orders',
        icon: 'shopping_basket',
        children: [
          { label: 'Orders' },
          { label: 'Invoices', badged: true },
          { label: 'Credit slips' },
          { label: 'Delivery slips' },
          { label: 'Shopping carts' },
        ],
      },
      { label: 'Products', icon: 'store' },
      { label: 'Customers', icon: 'group' },
    ],
  },
  {
    section: 'Configure',
    links: [
      { label: 'Shop settings', icon: 'settings' },
      { label: 'Advanced settings', icon: 'tune' },
    ],
  },
];

const linkAttrs = (active) => `class="nav-link${active ? ' active' : ''}"${active ? ' aria-current="page"' : ''}`;

// Fixed "P Plus" plan badge — bg-oceanblue matches the monogram's background so the image blends in
const badge = () => `
  <span class="badge rounded-pill bg-oceanblue text-dark text-uppercase d-inline-flex align-items-center gap-1">
    <img src="/playground/badge-monogram.png" alt="PrestaShop" height="12" />
    Plus
  </span>`;

const link = ({ label, icon, children }, { activeItem }) => {
  if (children) {
    const id = `sidebar-subnav-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const open = children.some((child) => child.label === activeItem);
    return `
      <li class="nav-item">
        <button
          class="nav-link sidebar-toggle${open ? '' : ' collapsed'}"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#${id}"
          aria-expanded="${open}"
          aria-controls="${id}"
        >
          <span class="icon">${icon}</span>
          ${label}
        </button>
        <div class="collapse${open ? ' show' : ''}" id="${id}">
          <ul class="nav nav-pills flex-column sidebar-subnav">
            ${children
              .map(
                (child) => `
              <li class="nav-item">
                <a ${linkAttrs(child.label === activeItem)} href="#">
                  ${child.label}
                  ${child.badged ? badge() : ''}
                </a>
              </li>`
              )
              .join('')}
          </ul>
        </div>
      </li>`;
  }
  return `
    <li class="nav-item">
      <a ${linkAttrs(label === activeItem)} href="#">
        <span class="icon">${icon}</span>
        ${label}
      </a>
    </li>`;
};

const section = ({ section: heading, links }, args) => `
  <div>
    ${heading && args.withHeadings ? `<h2 class="sidebar-heading">${heading}</h2>` : ''}
    <ul class="nav nav-pills flex-column">
      ${links.map((l) => link(l, args)).join('')}
    </ul>
  </div>`;

export default {
  title: 'Components/Sidebar',
  args: { activeItem: 'Dashboard', withHeadings: true },
  argTypes: {
    activeItem: {
      control: 'select',
      // Parents with children are collapse toggles, not pages — only leaf links can be active
      options: ITEMS.flatMap((s) => s.links.flatMap((l) => l.children?.map((c) => c.label) ?? [l.label])),
    },
    withHeadings: { control: 'boolean' },
  },
};

export const Default = {
  render: (args) => `
    <div class="vh-100 d-flex">
      <nav class="sidebar" aria-label="Main menu">
        ${ITEMS.map((s) => section(s, args)).join('')}
      </nav>
    </div>
  `,
};

export const SubMenuExpanded = {
  args: { activeItem: 'Invoices' },
  render: Default.render,
};
