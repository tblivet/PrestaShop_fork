/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/card/

const SUBTLE_VARIANTS = ['primary', 'green', 'purple', 'amber', 'oceanblue'];

export default {
  title: 'Components/Card',
  argTypes: {
    title: {
      control: 'text',
      description: 'Card title',
    },
    body: {
      control: 'text',
      description: 'Card body text',
    },
    variant: {
      control: 'select',
      options: ['none', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'],
      description: 'Bootstrap text-bg variant (applies to the card)',
    },
    subtleVariant: {
      control: 'select',
      options: ['none', ...SUBTLE_VARIANTS],
      description: 'Subtle variant — uses bg-subtle, text-emphasis, and border-subtle tokens',
    },
  },
  args: {
    title: 'Card title',
    body: "Some quick example text to build on the card title and make up the bulk of the card's content.",
    variant: 'none',
    subtleVariant: 'none',
  },
};

export const Default = {
  render: ({ title, body, variant, subtleVariant }) => {
    const cls = variant !== 'none' ? ` text-bg-${variant}` : subtleVariant !== 'none' ? ` card-${subtleVariant}` : '';
    const btnVariant = variant !== 'none' ? 'light' : 'primary';
    return `
      <div class="card${cls}" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${body}</p>
          <a href="#" class="btn btn-${btnVariant}">Go somewhere</a>
        </div>
      </div>
    `;
  },
};

export const SubtleVariants = {
  render: () => `
    <div class="d-flex flex-wrap gap-3">
      ${SUBTLE_VARIANTS.map(
        (color) => `
        <div class="card card-${color}" style="width: 16rem;">
          <div class="card-body">
            <h5 class="card-title">${color.charAt(0).toUpperCase() + color.slice(1)}</h5>
            <p class="card-text">Card using <code>.card-${color}</code> subtle tokens.</p>
          </div>
        </div>
      `
      ).join('')}
    </div>
  `,
};

export const WithImage = {
  render: () => `
    <div class="card" style="width: 18rem;">
      <div class="bg-secondary d-flex align-items-center justify-content-center" style="height: 180px;">
        <span class="text-white">Image placeholder</span>
      </div>
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  `,
};

export const WithListGroup = {
  render: () => `
    <div class="card" style="width: 18rem;">
      <div class="card-header">Featured</div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">An item</li>
        <li class="list-group-item">A second item</li>
        <li class="list-group-item">A third item</li>
      </ul>
      <div class="card-body">
        <a href="#" class="card-link">Card link</a>
        <a href="#" class="card-link">Another link</a>
      </div>
    </div>
  `,
};

export const WithHeader = {
  render: () => `
    <div class="d-flex flex-column gap-3">
      <div class="card">
        <div class="card-header">Featured</div>
        <div class="card-body">
          <h5 class="card-title">Special title treatment</h5>
          <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <a class="nav-link active" aria-current="true" href="#">Active</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" aria-disabled="true">Disabled</a>
            </li>
          </ul>
        </div>
        <div class="card-body">
          <h5 class="card-title">Special title treatment</h5>
          <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
      </div>
    </div>
  `,
};

export const CardGroup = {
  render: () => `
    <div class="card-group">
      <div class="card">
        <div class="bg-secondary d-flex align-items-center justify-content-center" style="height: 140px;">
          <span class="text-white">Image</span>
        </div>
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
          <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
          <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
        </div>
      </div>
      <div class="card">
        <div class="bg-secondary d-flex align-items-center justify-content-center" style="height: 140px;">
          <span class="text-white">Image</span>
        </div>
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
          <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
          <p class="card-text"><small class="text-body-secondary">Last updated 5 mins ago</small></p>
        </div>
      </div>
      <div class="card">
        <div class="bg-secondary d-flex align-items-center justify-content-center" style="height: 140px;">
          <span class="text-white">Image</span>
        </div>
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
          <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
          <p class="card-text"><small class="text-body-secondary">Last updated 11 mins ago</small></p>
        </div>
      </div>
    </div>
  `,
};

export const Horizontal = {
  render: () => `
    <div class="card" style="max-width: 540px;">
      <div class="row g-0">
        <div class="col-4">
          <div class="bg-secondary d-flex align-items-center justify-content-center h-100">
            <span class="text-white">Image</span>
          </div>
        </div>
        <div class="col-8">
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. And that's the point.</p>
            <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
          </div>
        </div>
      </div>
    </div>
  `,
};
