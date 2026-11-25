/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:Check> renders (check.html.twig) and its Twig call, for the Forms/Check story and the stories that
// show a checkbox or a switch (the grid's selection and toggles).
import { twigCall } from './twig-snippet';

// Check.php defaults; label is required, id is generated when none is given (the stories always give one)
export const CHECK_DEFAULTS = {
  type: 'checkbox', hideLabel: false, checked: false, disabled: false, name: null, value: null, id: null,
};

export const CHECK_TYPES = ['checkbox', 'switch'];

const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * @param {object} props the props and attributes as in Twig: label, type, hideLabel, checked, disabled, name, value, id;
 *   other attributes (class, data-ps-*, aria-*) go on the <input>
 */
export default function check({
  label, type = 'checkbox', hideLabel = false, checked = false, disabled = false, id, ...props
}) {
  // A text control cleared in Storybook gives '': no attribute, as twigCall leaves it out of the Twig call
  const unset = (text) => (text === undefined || text === '' ? null : text);
  const { name: givenName, value: givenValue, ...attributes } = props;
  const [name, value] = [unset(givenName), unset(givenValue)];
  const { class: extraClass, ...extra } = attributes;
  const input = [
    ['class', `form-check-input ps-check__input${extraClass ? ` ${extraClass}` : ''}`],
    ['type', 'checkbox'],
    ['id', id],
    type === 'switch' ? ['role', 'switch'] : null,
    name !== null ? ['name', name] : null,
    value !== null ? ['value', value] : null,
    checked ? ['checked', true] : null,
    disabled ? ['disabled', true] : null,
    ...Object.entries(extra),
  ].filter(Boolean).map(([attribute, attributeValue]) => (attributeValue === true ? ` ${attribute}` : ` ${attribute}="${escape(attributeValue)}"`)).join('');
  const classes = ['form-check', 'ps-check', type === 'switch' && 'form-switch', hideLabel && 'ps-check--label-hidden'].filter(Boolean).join(' ');
  const text = hideLabel ? `<span class="visually-hidden">${escape(label)}</span>` : escape(label);

  return {
    html: `<div class="${classes}"><input${input}><label class="form-check-label ps-check__label" for="${escape(id)}">${text}</label></div>`,
    twig: twigCall('ui:Check', { label, type, hideLabel, checked, disabled, name, value, id, ...attributes }, CHECK_DEFAULTS),
  };
}
