/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/forms/checks-radios/

// Bootstrap's raw markup, kept as a reference for what no kit component renders yet (radios, inline checks, toggle
// buttons). A checkbox or a switch in a template is <twig:ui:Check> (Forms/Check).
export default {
  title: 'Forms/ChecksRadios',
  parameters: {
    docs: {
      description: {
        component: '**In a template, a checkbox or a switch is `<twig:ui:Check>`** (Forms/Check): it names the box, also when its label is hidden, and keeps a 24px click target. This page is Bootstrap\'s raw markup for what no kit component renders yet: radios, inline checks, toggle buttons. Every check has a label.',
      },
    },
  },
};

export const Radios = {
  render: () => `
    <div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
        <label class="form-check-label" for="flexRadioDefault1">Default radio</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
        <label class="form-check-label" for="flexRadioDefault2">Default checked radio</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDisabled" id="flexRadioDisabled" disabled>
        <label class="form-check-label" for="flexRadioDisabled">Disabled radio</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDisabled" id="flexRadioCheckedDisabled" checked disabled>
        <label class="form-check-label" for="flexRadioCheckedDisabled">Disabled checked radio</label>
      </div>
    </div>
  `,
};

export const Inline = {
  render: () => `
    <div>
      <h6>Inline checkboxes</h6>
      <div class="mb-3">
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1">
          <label class="form-check-label" for="inlineCheckbox1">1</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2">
          <label class="form-check-label" for="inlineCheckbox2">2</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3" disabled>
          <label class="form-check-label" for="inlineCheckbox3">3 (disabled)</label>
        </div>
      </div>

      <h6>Inline radios</h6>
      <div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1">
          <label class="form-check-label" for="inlineRadio1">1</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2">
          <label class="form-check-label" for="inlineRadio2">2</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3" disabled>
          <label class="form-check-label" for="inlineRadio3">3 (disabled)</label>
        </div>
      </div>
    </div>
  `,
};

export const ToggleButtons = {
  render: () => `
    <div>
      <h6>Checkbox toggle buttons</h6>
      <div class="mb-3">
        <input type="checkbox" class="btn-check" id="btn-check" autocomplete="off">
        <label class="btn btn-primary" for="btn-check">Single toggle</label>
      </div>
      <div class="mb-3">
        <input type="checkbox" class="btn-check" id="btn-check-2" checked autocomplete="off">
        <label class="btn btn-primary" for="btn-check-2">Checked</label>
      </div>
      <div class="mb-3">
        <input type="checkbox" class="btn-check" id="btn-check-3" autocomplete="off" disabled>
        <label class="btn btn-primary" for="btn-check-3">Disabled</label>
      </div>

      <h6>Outlined styles</h6>
      <div class="mb-3">
        <input type="checkbox" class="btn-check" id="btn-check-outlined" autocomplete="off">
        <label class="btn btn-outline-primary" for="btn-check-outlined">Single toggle</label>
      </div>
      <div class="mb-3">
        <input type="checkbox" class="btn-check" id="btn-check-2-outlined" checked autocomplete="off">
        <label class="btn btn-outline-secondary" for="btn-check-2-outlined">Checked</label>
      </div>

      <h6>Radio toggle buttons</h6>
      <div class="btn-group">
        <input type="radio" class="btn-check" name="options" id="option1" autocomplete="off" checked>
        <label class="btn btn-secondary" for="option1">Active</label>

        <input type="radio" class="btn-check" name="options" id="option2" autocomplete="off">
        <label class="btn btn-secondary" for="option2">Radio</label>

        <input type="radio" class="btn-check" name="options" id="option3" autocomplete="off" disabled>
        <label class="btn btn-secondary" for="option3">Disabled</label>

        <input type="radio" class="btn-check" name="options" id="option4" autocomplete="off">
        <label class="btn btn-secondary" for="option4">Radio</label>
      </div>
    </div>
  `,
};
