/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/navs-tabs/
export default {
  title: 'Components/Navs',
};

const navItems = ['Home', 'Profile', 'Contact', 'Disabled'];

const navLinks = (cls = '') =>
  navItems
    .map(
      (label, i) =>
        `<li class="nav-item">
      <a class="nav-link${i === 0 ? ' active' : ''}${label === 'Disabled' ? ' disabled' : ''}" href="#">${label}</a>
    </li>`
    )
    .join('');

export const Tabs = {
  render: () => `
    <ul class="nav nav-tabs">
      ${navLinks()}
    </ul>
  `,
};

export const Pills = {
  render: () => `
    <ul class="nav nav-pills">
      ${navLinks()}
    </ul>
  `,
};

export const Fill = {
  render: () => `
    <ul class="nav nav-pills nav-fill">
      ${navLinks()}
    </ul>
  `,
};

export const Justified = {
  render: () => `
    <ul class="nav nav-tabs nav-justified">
      ${navLinks()}
    </ul>
  `,
};

export const Vertical = {
  render: () => `
    <div class="d-flex align-items-start" style="max-width:300px;">
      <div class="nav flex-column nav-pills me-3">
        ${['v-pills-home', 'v-pills-profile', 'v-pills-messages', 'v-pills-settings']
          .map(
            (id, i) => `
          <button class="nav-link${i === 0 ? ' active' : ''}" id="${id}-tab" data-bs-toggle="pill" data-bs-target="#${id}" type="button">
            ${id.replace('v-pills-', '').replace(/^\w/, (c) => c.toUpperCase())}
          </button>`
          )
          .join('')}
      </div>
      <div class="tab-content flex-grow-1">
        ${['home', 'profile', 'messages', 'settings']
          .map(
            (name, i) => `
          <div class="tab-pane fade${i === 0 ? ' show active' : ''}" id="v-pills-${name}">
            <p>Content for the <strong>${name}</strong> tab.</p>
          </div>`
          )
          .join('')}
      </div>
    </div>
  `,
};

export const TabsWithContent = {
  render: () => `
    <ul class="nav nav-tabs" id="mainTab" role="tablist">
      ${['home', 'profile', 'contact']
        .map(
          (name, i) => `
        <li class="nav-item" role="presentation">
          <button class="nav-link${i === 0 ? ' active' : ''}" id="tab-${name}" data-bs-toggle="tab" data-bs-target="#pane-${name}" type="button" role="tab">
            ${name.replace(/^\w/, (c) => c.toUpperCase())}
          </button>
        </li>`
        )
        .join('')}
    </ul>
    <div class="tab-content border border-top-0 p-3">
      ${['home', 'profile', 'contact']
        .map(
          (name, i) => `
        <div class="tab-pane fade${i === 0 ? ' show active' : ''}" id="pane-${name}" role="tabpanel">
          <p>Content for the <strong>${name}</strong> tab pane.</p>
        </div>`
        )
        .join('')}
    </div>
  `,
};
