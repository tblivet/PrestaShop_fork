/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/alerts/

export default {
  title: 'Components/Alert',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'],
      description: 'Bootstrap contextual variant',
    },
    message: {
      control: 'text',
      description: 'Alert message content',
    },
    dismissible: {
      control: 'boolean',
      description: 'Show dismiss button',
    },
  },
  args: {
    variant: 'primary',
    message: 'A simple alert — check it out!',
    dismissible: false,
  },
};

export const Default = {
  render: ({ variant, message, dismissible }) => `
    <div class="alert alert-${variant}${dismissible ? ' alert-dismissible fade show' : ''}" role="alert">
      ${message}
      ${dismissible ? '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' : ''}
    </div>
  `,
};

export const AllVariants = {
  render: () => `
    <div class="d-flex flex-column gap-2">
      ${['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
        .map(
          (v) => `<div class="alert alert-${v}" role="alert">A simple <strong>${v}</strong> alert — check it out!</div>`
        )
        .join('')}
    </div>
  `,
};

export const WithIcon = {
  render: () => `
    <div class="d-flex flex-column gap-2">
      <div class="alert alert-info d-flex align-items-center gap-2" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle-fill flex-shrink-0" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
        </svg>
        <div>An example alert with an icon</div>
      </div>
      <div class="alert alert-success d-flex align-items-center gap-2" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill flex-shrink-0" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
        <div>A success alert with an icon</div>
      </div>
      <div class="alert alert-warning d-flex align-items-center gap-2" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
        <div>A warning alert with an icon</div>
      </div>
      <div class="alert alert-danger d-flex align-items-center gap-2" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill flex-shrink-0" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg>
        <div>A danger alert with an icon</div>
      </div>
    </div>
  `,
};

export const Dismissible = {
  render: () => `
    <div class="d-flex flex-column gap-2">
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Holy guacamole!</strong> You should check in on some of those fields below.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Well done!</strong> You successfully read this important alert message.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Oh snap!</strong> Change a few things up and try submitting again.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    </div>
  `,
};
