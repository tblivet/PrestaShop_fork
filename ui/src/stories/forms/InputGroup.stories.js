/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/forms/input-group/

export default {
  title: 'Forms/InputGroup',
};

export const Basic = {
  render: () => `
    <div>
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1">@</span>
        <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
      </div>

      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2">
        <span class="input-group-text" id="basic-addon2">@example.com</span>
      </div>

      <div class="mb-3">
        <label for="basic-url" class="form-label">Your vanity URL</label>
        <div class="input-group">
          <span class="input-group-text" id="basic-addon3">https://example.com/users/</span>
          <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3 basic-addon4">
          <span class="input-group-text" id="basic-addon4">.html</span>
        </div>
      </div>

      <div class="input-group mb-3">
        <span class="input-group-text">$</span>
        <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
        <span class="input-group-text">.00</span>
      </div>

      <div class="input-group">
        <span class="input-group-text">With textarea</span>
        <textarea class="form-control" aria-label="With textarea"></textarea>
      </div>
    </div>
  `,
};

export const ButtonAddons = {
  render: () => `
    <div>
      <div class="input-group mb-3">
        <button class="btn btn-outline-secondary" type="button" id="button-addon1">Button</button>
        <input type="text" class="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1">
      </div>

      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username with two button addons" aria-describedby="button-addon2">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2">Button</button>
      </div>

      <div class="input-group mb-3">
        <button class="btn btn-outline-secondary" type="button">Button</button>
        <button class="btn btn-outline-secondary" type="button">Button</button>
        <input type="text" class="form-control" placeholder="" aria-label="Example text with two button addons">
      </div>

      <div class="input-group">
        <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username with two button addons">
        <button class="btn btn-outline-secondary" type="button">Button</button>
        <button class="btn btn-outline-secondary" type="button">Button</button>
      </div>
    </div>
  `,
};

export const LargeSmall = {
  render: () => `
    <div>
      <div class="input-group input-group-lg mb-3">
        <span class="input-group-text" id="inputGroup-sizing-lg">Large</span>
        <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg">
      </div>

      <div class="input-group mb-3">
        <span class="input-group-text" id="inputGroup-sizing-default">Default</span>
        <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
      </div>

      <div class="input-group input-group-sm">
        <span class="input-group-text" id="inputGroup-sizing-sm">Small</span>
        <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
      </div>
    </div>
  `,
};

export const MultipleInputs = {
  render: () => `
    <div>
      <div class="input-group">
        <span class="input-group-text">First and last name</span>
        <input type="text" aria-label="First name" class="form-control" placeholder="First name">
        <input type="text" aria-label="Last name" class="form-control" placeholder="Last name">
      </div>
    </div>
  `,
};

export const MultipleAddons = {
  render: () => `
    <div>
      <div class="input-group mb-3">
        <span class="input-group-text">$</span>
        <span class="input-group-text">0.00</span>
        <input type="text" class="form-control" aria-label="Dollar amount (with dot and two decimal places)">
      </div>

      <div class="input-group">
        <input type="text" class="form-control" aria-label="Dollar amount (with dot and two decimal places)">
        <span class="input-group-text">$</span>
        <span class="input-group-text">0.00</span>
      </div>
    </div>
  `,
};

export const WithCheckbox = {
  render: () => `
    <div>
      <div class="input-group mb-3">
        <div class="input-group-text">
          <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input">
        </div>
        <input type="text" class="form-control" aria-label="Text input with checkbox">
      </div>

      <div class="input-group">
        <div class="input-group-text">
          <input class="form-check-input mt-0" type="radio" value="" aria-label="Radio button for following text input">
        </div>
        <input type="text" class="form-control" aria-label="Text input with radio button">
      </div>
    </div>
  `,
};

export const WithDropdown = {
  render: () => `
    <div>
      <div class="input-group mb-3">
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Action</a></li>
          <li><a class="dropdown-item" href="#">Another action</a></li>
          <li><a class="dropdown-item" href="#">Something else here</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#">Separated link</a></li>
        </ul>
        <input type="text" class="form-control" aria-label="Text input with dropdown button">
      </div>

      <div class="input-group">
        <input type="text" class="form-control" aria-label="Text input with segmented dropdown button">
        <button type="button" class="btn btn-outline-secondary">Action</button>
        <button type="button" class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
          <span class="visually-hidden">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="#">Action</a></li>
          <li><a class="dropdown-item" href="#">Another action</a></li>
          <li><a class="dropdown-item" href="#">Something else here</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#">Separated link</a></li>
        </ul>
      </div>
    </div>
  `,
};
