/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:PasswordField> (src/PrestaShopBundle/Twig/Component/Ui/PasswordField.php) renders this markup, keep both in sync.
// The kit form theme (ui_kit_layout.html.twig, password_widget) renders every PasswordType through it.
import visibility from '../../../icons/material-symbols/visibility.svg?raw';
import visibilityOff from '../../../icons/material-symbols/visibility-off.svg?raw';
import uiIcon from '../ui-icon';
import { markup, twigCall, withTwig } from '../twig-snippet';

// The markup around and inside password_field.html.twig, and the hand-written Twig call (the label and the error stay outside)
const field = ({ id, label = 'Password', invalid = false, message = '' }) => {
  const input = `<input type="password" id="${id}" class="form-control${invalid ? ' is-invalid' : ''}" autocomplete="current-password"${invalid ? ` aria-invalid="true" aria-describedby="${id}_error"` : ''}>`;
  const labelTag = `<label for="${id}" class="form-label">${label}</label>`;
  const error = invalid ? `<div id="${id}_error" class="invalid-feedback d-block"><span class="d-block">${message}</span></div>` : '';

  return {
    html: `
  ${labelTag}
  <div class="ps-password-field input-group has-validation">
    ${input}
    <button class="ps-password-field__toggle btn btn-primary d-inline-flex align-items-center justify-content-center" type="button" aria-label="${label ? `Show password: ${label}` : 'Show password'}" aria-controls="${id}" aria-pressed="false" data-ps-action="toggle-password">
      ${uiIcon(visibility, { size: 'xl', class: 'ps-password-field__icon' })}
      ${uiIcon(visibilityOff, { size: 'xl', class: 'ps-password-field__icon ps-password-field__icon--shown' })}
    </button>
  </div>
  ${error}`,
    twig: [labelTag, twigCall('ui:PasswordField', { inputId: id, label }, {}, [markup(input)]), error].filter(Boolean).join('\n'),
  };
};

export default {
  title: 'Components/PasswordField',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: nothing to write in a form, `{{ form_widget(form.password) }}` renders it through the kit form theme. By hand: `<twig:ui:PasswordField inputId="my_password"><input type="password" id="my_password" class="form-control"></twig:ui:PasswordField>`.',
          '**Props**: `inputId` (required): the id of the input given as content, which the button shows or hides. `label`: the field label, added to the button name ("Show password: New password") so two password fields have distinct buttons; the form theme passes it. Other attributes go on the input group.',
          '**Do**: let the form theme render it, so every password field behaves the same. **Don\'t**: write the input group and the button by hand, or put the error message inside the group (it follows the group).',
          '**States**: default, value shown (click the button: the icon follows `aria-pressed`), in error. Behaviour: `ui/src/js/components/password-toggle.js`. The button is part of the field, not a generic icon button.',
        ].join('\n\n'),
      },
    },
  },
};

export const Default = {
  argTypes: { label: { control: 'text', description: 'Field label, in the button name; empty: "Show password"' } },
  args: { label: 'Password' },
  ...withTwig(({ label }) => field({ id: 'story_password', label })),
};

export const WithError = withTwig(() => field({ id: 'story_password_error', invalid: true, message: 'Use between 8 and 72 characters.' }));
