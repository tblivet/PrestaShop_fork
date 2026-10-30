/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://fonts.google.com/icons (Material Symbols Outlined)
// Usage: <span class="icon">icon_name</span>
// Icon names: https://fonts.google.com/icons?icon.style=Outlined
export default {
  title: 'Content/Icons',
};

const icon = (name, cls = '') => `<span class="icon ${cls}" title="${name}">${name}</span>`;

export const Overview = {
  render: () => `
    <p class="text-body-secondary mb-3 small">
      Material Symbols Outlined — variable font. Use <code>.icon</code> class with the icon name as text content.
    </p>
    <div class="d-flex flex-wrap gap-3">
      ${[
        'home',
        'search',
        'settings',
        'person',
        'star',
        'favorite',
        'check_circle',
        'cancel',
        'info',
        'warning',
        'error',
        'help',
        'add',
        'remove',
        'edit',
        'delete',
        'share',
        'download',
        'arrow_forward',
        'arrow_back',
        'menu',
        'close',
        'more_vert',
        'more_horiz',
        'mail',
        'notifications',
        'lock',
        'visibility',
        'visibility_off',
        'calendar_today',
      ]
        .map(
          (name) => `
        <div class="d-flex flex-column align-items-center gap-1 text-center" style="width:72px;">
          ${icon(name)}
          <span class="text-body-secondary" style="font-size:.65rem;word-break:break-all;">${name}</span>
        </div>
      `
        )
        .join('')}
    </div>
  `,
};

export const Sizes = {
  render: () => `
    <div class="d-flex align-items-end gap-4">
      ${[
        ['icon-sm', 'sm (.icon-sm)'],
        ['', 'default (.icon)'],
        ['icon-lg', 'lg (.icon-lg)'],
      ]
        .map(
          ([cls, label]) => `
        <div class="d-flex flex-column align-items-center gap-2">
          ${icon('home', cls)}
          <span class="text-body-secondary small">${label}</span>
        </div>
      `
        )
        .join('')}
      <div class="d-flex flex-column align-items-center gap-2">
        <span class="icon" style="font-size:3rem;">home</span>
        <span class="text-body-secondary small">inline style</span>
      </div>
    </div>
  `,
};

export const FillVariation = {
  render: () => `
    <p class="text-body-secondary small mb-3">Toggle fill axis: <code>--icon-fill: 0</code> (outline) vs <code>--icon-fill: 1</code> (filled).</p>
    <div class="d-flex gap-4">
      ${['favorite', 'star', 'bookmark', 'thumb_up', 'check_circle', 'notifications']
        .map(
          (name) => `
        <div class="d-flex gap-2">
          <span class="icon icon-lg" title="outline">${name}</span>
          <span class="icon icon-lg icon-filled" title="filled">${name}</span>
        </div>
      `
        )
        .join('')}
    </div>
  `,
};

export const WeightVariation = {
  render: () => `
    <p class="text-body-secondary small mb-3">
      Vary <code>--icon-wght</code> from 100 to 700 (matches the font's weight axis).
    </p>
    <div class="d-flex align-items-end gap-4">
      ${[100, 200, 300, 400, 500, 600, 700]
        .map(
          (w) => `
        <div class="d-flex flex-column align-items-center gap-2">
          <span class="icon icon-lg" style="--icon-wght:${w};">settings</span>
          <span class="text-body-secondary small">${w}</span>
        </div>
      `
        )
        .join('')}
    </div>
  `,
};

export const InContext = {
  render: () => `
    <div class="d-flex flex-column gap-3" style="max-width:400px;">
      <button class="btn btn-primary d-inline-flex align-items-center gap-2">
        <span class="icon">add</span> New item
      </button>
      <button class="btn btn-outline-danger d-inline-flex align-items-center gap-2">
        <span class="icon">delete</span> Delete
      </button>
      <div class="alert alert-warning d-flex align-items-center gap-2" role="alert">
        <span class="icon">warning</span>
        <span>This action cannot be undone.</span>
      </div>
      <div class="input-group">
        <span class="input-group-text"><span class="icon">search</span></span>
        <input type="text" class="form-control" placeholder="Search…">
      </div>
      <ul class="list-group">
        ${[
          ['home', 'Dashboard'],
          ['person', 'Profile'],
          ['settings', 'Settings'],
          ['lock', 'Security'],
        ]
          .map(
            ([ico, label]) => `
          <li class="list-group-item d-flex align-items-center gap-2">
            <span class="icon text-primary">${ico}</span> ${label}
          </li>`
          )
          .join('')}
      </ul>
    </div>
  `,
};
