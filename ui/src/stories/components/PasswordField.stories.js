/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:PasswordField> (src/PrestaShopBundle/Twig/Component/Ui/PasswordField.php) renders this markup, keep both in sync.
// The kit form theme (ui_kit_layout.html.twig, password_widget) renders every PasswordType through it.

const field = ({ id, invalid = false, message = '' }) => `
  <label for="${id}" class="form-label">Password</label>
  <div class="ps-password-field input-group has-validation">
    <input type="password" id="${id}" class="form-control${invalid ? ' is-invalid' : ''}" autocomplete="current-password"${invalid ? ` aria-invalid="true" aria-describedby="${id}_error"` : ''}>
    <button class="ps-password-field__toggle btn btn-primary d-inline-flex align-items-center justify-content-center" type="button" aria-label="Show password" aria-controls="${id}" aria-pressed="false" data-ps-action="toggle-password">
      <span class="ps-password-field__icon material-symbols-outlined fs-5 lh-1" aria-hidden="true">visibility</span>
      <span class="ps-password-field__icon ps-password-field__icon--shown material-symbols-outlined fs-5 lh-1" aria-hidden="true">visibility_off</span>
    </button>
  </div>
  ${invalid ? `<div id="${id}_error" class="invalid-feedback d-block"><span class="d-block">${message}</span></div>` : ''}`;

export default {
  title: 'Components/PasswordField',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: nothing to write in a form, `{{ form_widget(form.password) }}` renders it through the kit form theme. By hand: `<twig:ui:PasswordField inputId="my_password"><input type="password" id="my_password" class="form-control"></twig:ui:PasswordField>`.',
          '**Props**: `inputId` (required): the id of the input given as content, which the button shows or hides. Other attributes go on the input group.',
          '**Do**: let the form theme render it, so every password field behaves the same. **Don\'t**: write the input group and the button by hand, or put the error message inside the group (it follows the group).',
          '**States**: default, value shown (click the button: the icon follows `aria-pressed`), in error. Behaviour: `ui/src/js/components/password-toggle.js`. The button is part of the field, not a generic icon button.',
        ].join('\n\n'),
      },
    },
  },
};

export const Default = { render: () => field({ id: 'story_password' }) };

export const WithError = { render: () => field({ id: 'story_password_error', invalid: true, message: 'This field cannot be shorter than 8 characters' }) };
