/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/button-group/

export default {
  title: 'Components/ButtonGroup',
};

export const Default = {
  render: () => `
    <div class="btn-group" role="group" aria-label="Basic example">
      <button type="button" class="btn btn-primary">Left</button>
      <button type="button" class="btn btn-primary">Middle</button>
      <button type="button" class="btn btn-primary">Right</button>
    </div>
  `,
};

export const Sizes = {
  render: () => `
    <div class="d-flex flex-column gap-3">
      <div>
        <p class="text-muted small mb-2">Large</p>
        <div class="btn-group btn-group-lg" role="group" aria-label="Large button group">
          <button type="button" class="btn btn-outline-primary">Left</button>
          <button type="button" class="btn btn-outline-primary">Middle</button>
          <button type="button" class="btn btn-outline-primary">Right</button>
        </div>
      </div>
      <div>
        <p class="text-muted small mb-2">Default</p>
        <div class="btn-group" role="group" aria-label="Default button group">
          <button type="button" class="btn btn-outline-primary">Left</button>
          <button type="button" class="btn btn-outline-primary">Middle</button>
          <button type="button" class="btn btn-outline-primary">Right</button>
        </div>
      </div>
      <div>
        <p class="text-muted small mb-2">Small</p>
        <div class="btn-group btn-group-sm" role="group" aria-label="Small button group">
          <button type="button" class="btn btn-outline-primary">Left</button>
          <button type="button" class="btn btn-outline-primary">Middle</button>
          <button type="button" class="btn btn-outline-primary">Right</button>
        </div>
      </div>
    </div>
  `,
};

export const Vertical = {
  render: () => `
    <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
      <button type="button" class="btn btn-primary">Button 1</button>
      <button type="button" class="btn btn-primary">Button 2</button>
      <button type="button" class="btn btn-primary">Button 3</button>
      <button type="button" class="btn btn-primary">Button 4</button>
    </div>
  `,
};

export const Toolbar = {
  render: () => `
    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
      <div class="btn-group me-2" role="group" aria-label="First group">
        <button type="button" class="btn btn-outline-secondary">1</button>
        <button type="button" class="btn btn-outline-secondary">2</button>
        <button type="button" class="btn btn-outline-secondary">3</button>
        <button type="button" class="btn btn-outline-secondary">4</button>
      </div>
      <div class="btn-group me-2" role="group" aria-label="Second group">
        <button type="button" class="btn btn-outline-secondary">5</button>
        <button type="button" class="btn btn-outline-secondary">6</button>
        <button type="button" class="btn btn-outline-secondary">7</button>
      </div>
      <div class="btn-group" role="group" aria-label="Third group">
        <button type="button" class="btn btn-outline-secondary">8</button>
      </div>
    </div>
  `,
};

export const CheckboxGroup = {
  render: () => `
    <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
      <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off">
      <label class="btn btn-outline-primary" for="btncheck1">Checkbox 1</label>

      <input type="checkbox" class="btn-check" id="btncheck2" autocomplete="off" checked>
      <label class="btn btn-outline-primary" for="btncheck2">Checkbox 2</label>

      <input type="checkbox" class="btn-check" id="btncheck3" autocomplete="off">
      <label class="btn btn-outline-primary" for="btncheck3">Checkbox 3</label>
    </div>
  `,
};

export const RadioGroup = {
  render: () => `
    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
      <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked>
      <label class="btn btn-outline-primary" for="btnradio1">Radio 1</label>

      <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
      <label class="btn btn-outline-primary" for="btnradio2">Radio 2</label>

      <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
      <label class="btn btn-outline-primary" for="btnradio3">Radio 3</label>
    </div>
  `,
};
