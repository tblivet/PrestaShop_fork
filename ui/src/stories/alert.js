/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:Alert> renders (alert.html.twig) and its Twig call, for the Alert and FlashMessages stories and
// the playground pages that show an alert
import cancelFill from '../../icons/material-symbols/cancel-fill.svg?raw';
import checkCircleFill from '../../icons/material-symbols/check-circle-fill.svg?raw';
import infoFill from '../../icons/material-symbols/info-fill.svg?raw';
import warningFill from '../../icons/material-symbols/warning-fill.svg?raw';
import uiIcon from './ui-icon';
import { markup, twigCall } from './twig-snippet';

// Alert.php defaults
export const ALERT_DEFAULTS = { type: 'info', icon: null, dismissible: false, borderless: false };

// Alert::TYPES
export const ALERT_TYPES = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];

// Alert::STATUS_ICONS: the icon a status type shows when none is given
export const STATUS_ICONS = { danger: 'cancel', info: 'info', success: 'check_circle', warning: 'warning' };

// alert.html.twig: what the icon of a status type says to screen readers ('Error'|trans({}, 'Admin.Global')…)
const STATUS_LABELS = { danger: 'Error', info: 'Information', success: 'Success', warning: 'Warning' };

// <twig:ui:Icon> names the stories show, filled; any icon works, these are the status ones
export const ALERT_ICONS = { info: infoFill, check_circle: checkCircleFill, warning: warningFill, cancel: cancelFill };

// Only a danger alert interrupts screen readers
const role = (type) => (type === 'danger' ? 'alert' : 'status');

/**
 * @param {object} props the props and attributes as in Twig; content is the content block (HTML)
 */
export default function alert({ type = 'info', icon = null, dismissible = false, borderless = false, content, ...attributes }) {
  const shown = icon ?? STATUS_ICONS[type] ?? null;
  const classes = ['ps-alert', 'alert', `alert-${type}`];
  if (borderless) classes.push('ps-alert--borderless');
  if (dismissible) classes.push('alert-dismissible', 'fade', 'show');
  if (shown) classes.push('ps-alert--icon');
  if (attributes.class) classes.push(attributes.class);
  const extra = Object.entries(attributes).filter(([name]) => name !== 'class').map(([name, value]) => (value === true ? ` ${name}` : ` ${name}="${value}"`)).join('');
  const iconHtml = shown ? uiIcon(ALERT_ICONS[shown], { size: 'lg', class: 'ps-alert__icon', label: STATUS_LABELS[type] ?? null }) : '';

  return {
    html: `
    <div class="${classes.join(' ')}" role="${role(type)}"${extra}>
      ${iconHtml}
      <div class="ps-alert__content">${content}</div>
      ${dismissible ? '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' : ''}
    </div>`,
    // The status icon is the default: the call names an icon only when it is another one
    twig: twigCall('ui:Alert', { type, icon: icon && icon !== STATUS_ICONS[type] ? icon : undefined, dismissible, borderless, ...attributes }, ALERT_DEFAULTS, [markup(content)]),
  };
}
