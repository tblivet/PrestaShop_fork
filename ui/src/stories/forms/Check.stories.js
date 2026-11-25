/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/forms/checks-radios/
// Twig: <twig:ui:Check> (src/PrestaShopBundle/Twig/Component/Ui/Check.php) renders this markup, keep both in sync.
import check, { CHECK_DEFAULTS, CHECK_TYPES } from '../check';
import { framedNodes, joinNodes, withTwig } from '../twig-snippet';
import { nullableSelect, withDefaults } from '../story-defaults';
import { stackClasses } from '../layouts/layout-classes';

// Story chrome: the checks one under the other, in a kit stack (<twig:ui:Layout:Stack gap="sm">)
const stack = (html) => `<div class="${stackClasses({ gap: 'sm' })}">${html}</div>`;

// A story that shows a fixed case: its controls would change nothing
const fixed = (story) => ({ controls: { disable: true }, docs: { description: { story } } });

export default {
  title: 'Forms/Check',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Check label="{{ \'Send me the newsletter\'|trans({}, \'Admin.Global\') }}" name="newsletter" value="1"/>`, `<twig:ui:Check type="switch" label="{{ \'Enabled\'|trans({}, \'Admin.Global\') }}" checked/>`. Bootstrap\'s form-check: the box, then its label.',
          '**Props**: `label` (required: names the box, also when hidden), `type` (`checkbox`, `switch`; default `checkbox`: a switch turns something on or off at once, `role="switch"`), `hideLabel` (default `false`: the label is for screen readers only, where the row or the column already says it, as a grid\'s selection; it stays the box\'s 24px click target), `checked` (default `false`), `disabled` (default `false`), `name` (default none), `value` (default none: the browser sends "on"), `id` (default generated: ties the label to the box). Other attributes (`class`, `form`, `data-ps-*`, `aria-*`) go on the `<input>`. A select-all box shows "some selected" with the input\'s `indeterminate` property, set by its script.',
          '**Do**: a label that says what checking does ("Send me the newsletter"); a hidden label that still names the row ("Select order #1024"); a switch for a setting that applies at once. **Don\'t**: a switch in a form that is saved later (a checkbox), an empty or generic hidden label ("Select"), a check without a label.',
          '**States**: checkbox and switch, checked, disabled, hidden label (the 24px target), some selected (indeterminate), a long label.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    label: { control: 'text', type: { name: 'string', required: true }, description: 'Names the box, also when hidden' },
    type: { control: 'select', options: CHECK_TYPES, description: 'A switch turns something on or off at once' },
    hideLabel: { control: 'boolean', description: 'For screen readers only; stays the 24px click target' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    name: { control: 'text', table: { type: { summary: 'string' } } },
    value: { control: 'text', description: 'Sent when checked; none: "on"', table: { type: { summary: 'string' } } },
    id: nullableSelect(['check-newsletter'], 'Ties the label to the box; none: generated'),
  }, CHECK_DEFAULTS),
  args: { label: 'Send me the newsletter', ...CHECK_DEFAULTS, id: 'check-newsletter' },
};

// No id: Check.php generates one, the first on a page being ps-check-1
export const Default = withTwig((args) => check({ ...args, id: args.id ?? 'ps-check-1' }));

export const Types = withTwig(() => joinNodes([
  check({ label: 'Send me the newsletter', id: 'check-types-checkbox' }),
  check({ label: 'Enabled', type: 'switch', checked: true, id: 'check-types-switch' }),
], stack), fixed('A checkbox picks an option that is saved with the form; a switch turns something on or off at once (a status in a grid).'));

export const States = withTwig(() => joinNodes([
  check({ label: 'Not checked', id: 'check-states-off' }),
  check({ label: 'Checked', checked: true, id: 'check-states-on' }),
  check({ label: 'Disabled', disabled: true, id: 'check-states-disabled' }),
  check({ label: 'Checked and disabled', checked: true, disabled: true, id: 'check-states-checked-disabled' }),
  check({ label: 'Switch off', type: 'switch', id: 'check-states-switch-off' }),
  check({ label: 'Switch on', type: 'switch', checked: true, id: 'check-states-switch-on' }),
  check({ label: 'Switch disabled', type: 'switch', checked: true, disabled: true, id: 'check-states-switch-disabled' }),
], stack), fixed('Each state of the checkbox and of the switch.'));

// Story chrome: a table row around each box, as a grid shows it
const ROWS = [['#1024', 'Paid'], ['#1025', 'Shipped'], ['#1026', 'Canceled: cannot be selected']];
const row = (html, index) => `<table class="table"><tbody><tr><td>${html}</td><th scope="row">${ROWS[index][0]}</th><td>${ROWS[index][1]}</td></tr></tbody></table>`;

export const HiddenLabel = withTwig(() => framedNodes([
  check({ label: 'Select order #1024', hideLabel: true, name: 'order_bulk[]', value: '1024', id: 'check-hidden-1024' }),
  check({ label: 'Enable order #1025', type: 'switch', hideLabel: true, checked: true, id: 'check-hidden-1025' }),
  check({ label: 'Select order #1026', hideLabel: true, disabled: true, name: 'order_bulk[]', value: '1026', id: 'check-hidden-1026' }),
], row), fixed('In a grid, the row already says what the box is for: the label is for screen readers only ("Select order #1024") and becomes a 24px click target around the box (WCAG 2.5.8). A row that cannot be selected has its box disabled.'));

// The select-all box shows "some selected" with the input's indeterminate property, set by its script; here by a
// decorator once the story is in the page, so the docs page shows it too (play runs in the canvas only)
export const SomeSelected = {
  ...withTwig(() => check({ label: 'Select all orders on this page', hideLabel: true, id: 'check-some-selected', 'data-ps-ref': 'select-all' }), fixed('A select-all box when some rows are selected: its script sets the input\'s `indeterminate` property (there is no attribute for it).')),
  decorators: [(story) => {
    requestAnimationFrame(() => {
      const box = document.getElementById('check-some-selected');

      if (box) {
        box.indeterminate = true;
      }
    });

    return story();
  }],
};

export const LongLabel = withTwig(() => framedNodes([
  check({ label: 'Envoyer automatiquement un e-mail au client lorsque le statut de sa commande change, y compris pour les remboursements partiels', id: 'check-long-label' }),
], (html) => `<div style="max-width: 20rem">${html}</div>`), fixed('A long label (here in French) wraps under itself; the box stays on its first line.'));

