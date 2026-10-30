/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/dropdowns/
export default {
  title: 'Components/Dropdown',
};

const wrap = (html) => `<div style="padding:2rem;min-height:200px;">${html}</div>`;

export const Default = {
  render: () =>
    wrap(`
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">Dropdown button</button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div>
  `),
};

export const Split = {
  render: () =>
    wrap(`
    <div class="btn-group">
      <button type="button" class="btn btn-danger">Action</button>
      <button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown">
        <span class="visually-hidden">Toggle dropdown</span>
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div>
  `),
};

export const Sizes = {
  render: () =>
    wrap(`
    <div class="d-flex gap-3 flex-wrap">
      <div class="btn-group">
        <button class="btn btn-secondary btn-lg dropdown-toggle" type="button" data-bs-toggle="dropdown">Large</button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Action</a></li>
          <li><a class="dropdown-item" href="#">Another action</a></li>
        </ul>
      </div>
      <div class="btn-group">
        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">Small</button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Action</a></li>
          <li><a class="dropdown-item" href="#">Another action</a></li>
        </ul>
      </div>
    </div>
  `),
};

export const Directions = {
  render: () =>
    wrap(`
    <div class="d-flex gap-3 flex-wrap" style="margin-top:4rem;">
      ${[
        ['dropup', 'Dropup'],
        ['dropend', 'Dropend'],
        ['dropstart', 'Dropstart'],
      ]
        .map(
          ([cls, label]) => `
        <div class="${cls}">
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">${label}</button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
          </ul>
        </div>
      `
        )
        .join('')}
    </div>
  `),
};

export const Dark = {
  render: () =>
    wrap(`
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">Dark dropdown</button>
      <ul class="dropdown-menu dropdown-menu-dark">
        <li><a class="dropdown-item active" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#">Something else</a></li>
      </ul>
    </div>
  `),
};

export const WithForms = {
  render: () =>
    wrap(`
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">Dropdown with form</button>
      <div class="dropdown-menu p-3" style="min-width:220px;">
        <div class="mb-2">
          <label class="form-label" for="dd-email">Email</label>
          <input type="email" class="form-control form-control-sm" id="dd-email" placeholder="email@example.com">
        </div>
        <div class="mb-2">
          <label class="form-label" for="dd-pass">Password</label>
          <input type="password" class="form-control form-control-sm" id="dd-pass">
        </div>
        <button type="submit" class="btn btn-primary btn-sm w-100">Sign in</button>
      </div>
    </div>
  `),
};
