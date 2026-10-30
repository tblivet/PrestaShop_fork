/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/list-group/
export default {
  title: 'Components/ListGroup',
};

const items = ['An item', 'A second item', 'A third item', 'A fourth item', 'And a fifth one'];

export const Default = {
  render: () => `
    <ul class="list-group" style="max-width:360px;">
      ${items.map((t) => `<li class="list-group-item">${t}</li>`).join('')}
    </ul>
  `,
};

export const Flush = {
  render: () => `
    <ul class="list-group list-group-flush" style="max-width:360px;">
      ${items.map((t) => `<li class="list-group-item">${t}</li>`).join('')}
    </ul>
  `,
};

export const Numbered = {
  render: () => `
    <ol class="list-group list-group-numbered" style="max-width:360px;">
      ${items.map((t) => `<li class="list-group-item">${t}</li>`).join('')}
    </ol>
  `,
};

export const WithBadges = {
  render: () => `
    <ul class="list-group" style="max-width:360px;">
      ${[
        ['Cras justo odio', 14],
        ['Dapibus ac facilisis in', 2],
        ['Morbi leo risus', 1],
      ]
        .map(
          ([label, count]) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${label}
          <span class="badge text-bg-primary rounded-pill">${count}</span>
        </li>
      `
        )
        .join('')}
    </ul>
  `,
};

export const Actionable = {
  render: () => `
    <div class="list-group" style="max-width:360px;">
      <a href="#" class="list-group-item list-group-item-action active">Active link</a>
      <a href="#" class="list-group-item list-group-item-action">A second link</a>
      <a href="#" class="list-group-item list-group-item-action">A third link</a>
      <a class="list-group-item list-group-item-action disabled" aria-disabled="true">Disabled link</a>
    </div>
  `,
};

export const Horizontal = {
  render: () => `
    <ul class="list-group list-group-horizontal">
      ${['An item', 'A second item', 'A third item'].map((t) => `<li class="list-group-item">${t}</li>`).join('')}
    </ul>
  `,
};

export const ColorVariants = {
  render: () => `
    <ul class="list-group" style="max-width:360px;">
      ${['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map((v) => `<li class="list-group-item list-group-item-${v}">A ${v} list group item</li>`).join('')}
    </ul>
  `,
};

export const WithCheckboxes = {
  render: () => `
    <ul class="list-group" style="max-width:360px;">
      ${['First checkbox', 'Second checkbox', 'Third checkbox']
        .map(
          (label, i) => `
        <li class="list-group-item">
          <input class="form-check-input me-1" type="checkbox" id="listcheck${i}">
          <label class="form-check-label" for="listcheck${i}">${label}</label>
        </li>
      `
        )
        .join('')}
    </ul>
  `,
};
