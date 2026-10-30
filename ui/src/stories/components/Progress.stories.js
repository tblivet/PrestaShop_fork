/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/progress/

export default {
  title: 'Components/Progress',
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      defaultValue: 50,
    },
    variant: {
      control: { type: 'select' },
      options: ['', 'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info'],
      defaultValue: '',
    },
    striped: {
      control: 'boolean',
      defaultValue: false,
    },
    animated: {
      control: 'boolean',
      defaultValue: false,
    },
  },
};

export const Default = {
  args: {
    value: 50,
    variant: '',
    striped: false,
    animated: false,
  },
  render: ({ value, variant, striped, animated }) => {
    const classes = [
      'progress-bar',
      variant,
      striped || animated ? 'progress-bar-striped' : '',
      animated ? 'progress-bar-animated' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return `
      <div class="progress" role="progressbar" aria-label="Progress" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100">
        <div class="${classes}" style="width: ${value}%"></div>
      </div>
    `;
  },
};

export const Stacked = {
  render: () => `
    <div class="progress-stacked">
      <div class="progress" role="progressbar" aria-label="Segment one" aria-valuenow="15" aria-valuemin="0" aria-valuemax="100" style="width: 15%">
        <div class="progress-bar"></div>
      </div>
      <div class="progress" role="progressbar" aria-label="Segment two" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" style="width: 30%">
        <div class="progress-bar bg-success"></div>
      </div>
      <div class="progress" role="progressbar" aria-label="Segment three" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%">
        <div class="progress-bar bg-info"></div>
      </div>
    </div>
  `,
};

export const Striped = {
  render: () => `
    <div class="d-flex flex-column gap-3">
      <div class="progress" role="progressbar" aria-label="Default striped" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar progress-bar-striped" style="width: 10%"></div>
      </div>
      <div class="progress" role="progressbar" aria-label="Success striped" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar progress-bar-striped bg-success" style="width: 25%"></div>
      </div>
      <div class="progress" role="progressbar" aria-label="Info striped" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar progress-bar-striped bg-info" style="width: 50%"></div>
      </div>
      <div class="progress" role="progressbar" aria-label="Warning striped" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar progress-bar-striped bg-warning" style="width: 75%"></div>
      </div>
      <div class="progress" role="progressbar" aria-label="Danger striped" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar progress-bar-striped bg-danger" style="width: 100%"></div>
      </div>
    </div>
  `,
};

export const AnimatedStripe = {
  render: () => `
    <div class="d-flex flex-column gap-3">
      <div class="progress" role="progressbar" aria-label="Animated striped" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 75%"></div>
      </div>
      <div class="progress" role="progressbar" aria-label="Animated striped success" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" style="width: 50%"></div>
      </div>
      <div class="progress" role="progressbar" aria-label="Animated striped danger" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" style="width: 30%"></div>
      </div>
    </div>
  `,
};

export const Labels = {
  render: () => `
    <div class="d-flex flex-column gap-3">
      <div class="progress" role="progressbar" aria-label="Progress with label" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" style="width: 25%">25%</div>
      </div>
      <div class="progress" role="progressbar" aria-label="Progress with label" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar bg-success" style="width: 50%">50%</div>
      </div>
      <div class="progress" role="progressbar" aria-label="Progress with label" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar bg-warning" style="width: 75%">75%</div>
      </div>
      <div class="progress" role="progressbar" aria-label="Progress with label" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar bg-danger" style="width: 100%">100%</div>
      </div>
    </div>
  `,
};

export const ColorVariants = {
  render: () => `
    <div class="d-flex flex-column gap-3">
      <div class="progress" role="progressbar" aria-label="Primary" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar bg-primary" style="width: 60%"></div>
      </div>
      <div class="progress" role="progressbar" aria-label="Secondary" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar bg-secondary" style="width: 60%"></div>
      </div>
      <div class="progress" role="progressbar" aria-label="Success" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar bg-success" style="width: 60%"></div>
      </div>
      <div class="progress" role="progressbar" aria-label="Danger" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar bg-danger" style="width: 60%"></div>
      </div>
      <div class="progress" role="progressbar" aria-label="Warning" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar bg-warning" style="width: 60%"></div>
      </div>
      <div class="progress" role="progressbar" aria-label="Info" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar bg-info" style="width: 60%"></div>
      </div>
      <div class="progress" role="progressbar" aria-label="Dark" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar bg-dark" style="width: 60%"></div>
      </div>
    </div>
  `,
};
