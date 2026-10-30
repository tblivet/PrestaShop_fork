/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/forms/select/

export default {
  title: 'Forms/Select',
};

const options = `
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
`;

export const Default = {
  render: () => `
    <div>
      <label for="exampleSelect1" class="form-label">Default select</label>
      <select class="form-select" id="exampleSelect1" aria-label="Default select example">
        ${options}
      </select>
    </div>
  `,
};

export const Multiple = {
  render: () => `
    <div>
      <label for="exampleSelectMultiple" class="form-label">Multiple select</label>
      <select class="form-select" multiple aria-label="Multiple select example" id="exampleSelectMultiple">
        <option selected>Open this select menu</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </select>

      <label for="exampleSelectSize" class="form-label mt-3">Size select (shows 3 items)</label>
      <select class="form-select" size="3" aria-label="size 3 select example" id="exampleSelectSize">
        <option selected>Open this select menu</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </select>
    </div>
  `,
};

export const Sizing = {
  render: () => `
    <div>
      <label class="form-label">Large</label>
      <select class="form-select form-select-lg mb-3" aria-label="Large select example">
        ${options}
      </select>

      <label class="form-label">Default</label>
      <select class="form-select mb-3" aria-label="Default select example">
        ${options}
      </select>

      <label class="form-label">Small</label>
      <select class="form-select form-select-sm" aria-label="Small select example">
        ${options}
      </select>
    </div>
  `,
};

export const Disabled = {
  render: () => `
    <div>
      <label for="disabledSelect" class="form-label">Disabled select menu</label>
      <select class="form-select" id="disabledSelect" disabled>
        ${options}
      </select>
    </div>
  `,
};
