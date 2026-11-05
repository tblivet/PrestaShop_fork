/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/buttons/

export default {
  title: 'Components/Button',
  argTypes: {
    label: {
      control: 'text',
      description: 'Button label',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'destructive', 'warning', 'info', 'light', 'dark', 'link'],
      description: 'Bootstrap contextual variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Busy state: data-ps-state="loading" with aria-busy and aria-disabled; the spinner covers the label and the button keeps its size (set by submit-once.js on kit forms)',
    },
  },
  args: {
    label: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
  },
};

export const Default = {
  render: ({ label, variant, size, disabled, loading }) => {
    const sizeClass = size !== 'md' ? ` btn-${size}` : '';
    const disabledAttr = disabled ? ' disabled' : '';
    const loadingAttrs = loading ? ' data-ps-state="loading" aria-busy="true" aria-disabled="true"' : '';
    const spinner = loading ? '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>' : '';
    return `<button type="button" class="btn btn-${variant}${sizeClass}"${disabledAttr}${loadingAttrs}>${spinner}${label}</button>`;
  },
};

export const AllVariants = {
  render: () => `
    <div class="d-flex flex-wrap gap-2">
      ${['primary', 'secondary', 'success', 'danger', 'destructive', 'warning', 'info', 'light', 'dark', 'link']
        .map((v) => `<button type="button" class="btn btn-${v}">${v.charAt(0).toUpperCase() + v.slice(1)}</button>`)
        .join('')}
    </div>
  `,
};

export const AllOutline = {
  render: () => `
    <div class="d-flex flex-wrap gap-2">
      ${['primary', 'secondary', 'success', 'danger', 'destructive', 'warning', 'info', 'light', 'dark']
        .map(
          (v) => `<button type="button" class="btn btn-outline-${v}">${v.charAt(0).toUpperCase() + v.slice(1)}</button>`
        )
        .join('')}
    </div>
  `,
};

export const Sizes = {
  render: () => `
    <div class="d-flex flex-column gap-3">
      <div class="d-flex flex-wrap align-items-center gap-2">
        <button type="button" class="btn btn-primary btn-lg">Large button</button>
        <button type="button" class="btn btn-secondary btn-lg">Large button</button>
      </div>
      <div class="d-flex flex-wrap align-items-center gap-2">
        <button type="button" class="btn btn-primary">Default button</button>
        <button type="button" class="btn btn-secondary">Default button</button>
      </div>
      <div class="d-flex flex-wrap align-items-center gap-2">
        <button type="button" class="btn btn-primary btn-sm">Small button</button>
        <button type="button" class="btn btn-secondary btn-sm">Small button</button>
      </div>
    </div>
  `,
};

export const States = {
  render: () => `
    <div class="d-flex flex-column gap-3">
      <div>
        <p class="text-muted small mb-2">Active state</p>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="btn btn-primary active" aria-pressed="true">Primary active</button>
          <button type="button" class="btn btn-secondary active" aria-pressed="true">Secondary active</button>
        </div>
      </div>
      <div>
        <p class="text-muted small mb-2">Disabled state (button element)</p>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="btn btn-primary" disabled>Primary disabled</button>
          <button type="button" class="btn btn-secondary" disabled>Secondary disabled</button>
          <button type="button" class="btn btn-outline-primary" disabled>Outline disabled</button>
        </div>
      </div>
      <div>
        <p class="text-muted small mb-2">Busy state (data-ps-state="loading", aria-busy): the spinner covers the label, the button keeps its size</p>
        <div class="d-flex flex-wrap gap-2">
          <button type="submit" class="btn btn-primary" data-ps-state="loading" aria-busy="true" aria-disabled="true"><span class="spinner-border spinner-border-sm" aria-hidden="true"></span>Send reset link</button>
          <button type="button" class="btn btn-outline-secondary">Cancel</button>
          <button type="submit" class="btn btn-outline-primary" data-ps-state="loading" aria-busy="true" aria-disabled="true"><span class="spinner-border spinner-border-sm" aria-hidden="true"></span>Save</button>
        </div>
      </div>
      <div>
        <p class="text-muted small mb-2">Disabled state (anchor element)</p>
        <div class="d-flex flex-wrap gap-2">
          <a class="btn btn-primary disabled" role="button" aria-disabled="true">Primary link</a>
          <a class="btn btn-secondary disabled" role="button" aria-disabled="true">Secondary link</a>
        </div>
      </div>
    </div>
  `,
};

export const LinkButton = {
  render: () => `
    <div class="d-flex flex-wrap gap-2 align-items-center">
      <a href="#" class="btn btn-primary" role="button">Link</a>
      <button class="btn btn-primary" type="submit">Button</button>
      <input class="btn btn-primary" type="button" value="Input">
      <input class="btn btn-primary" type="submit" value="Submit">
      <input class="btn btn-primary" type="reset" value="Reset">
    </div>
  `,
};

export const ToggleState = {
  render: () => `
    <div class="d-flex flex-wrap gap-2">
      <button type="button" class="btn btn-primary" data-bs-toggle="button">Toggle button</button>
      <button type="button" class="btn btn-primary active" data-bs-toggle="button" aria-pressed="true">
        Active toggle button
      </button>
      <button type="button" class="btn btn-primary" data-bs-toggle="button" disabled>
        Disabled toggle button
      </button>
    </div>
  `,
};

export const WithIcon = {
  render: () => `
    <div class="d-flex flex-wrap align-items-center gap-2">
      <button type="button" class="btn btn-primary">
        <span class="icon" aria-hidden="true">add</span>
        Leading icon
      </button>
      <button type="button" class="btn btn-outline-secondary">
        Trailing icon
        <span class="icon" aria-hidden="true">arrow_forward</span>
      </button>
      <button type="button" class="btn btn-outline-secondary btn-sm">
        <span class="icon" aria-hidden="true">download</span>
        Small with icon
      </button>
      <button type="button" class="btn btn-outline-secondary" aria-label="Settings">
        <span class="icon" aria-hidden="true">settings</span>
      </button>
    </div>
  `,
};
