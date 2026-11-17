/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:HeaderAction> renders (header_action.html.twig) and its Twig call, for the HeaderAction and Header
// stories. icons maps the icon names used (action and menu items) to their SVG files, imported with ?raw from ui/icons.
import keyboardArrowDown from '../../icons/material-symbols/keyboard-arrow-down.svg?raw';
import dropdownMenu from './dropdown-menu';
import uiIcon from './ui-icon';
import { twigCall } from './twig-snippet';

// HeaderAction.php defaults; label and icon are required, and an href or items
export const HEADER_ACTION_DEFAULTS = { href: null, external: false, items: null, description: null, align: 'end', iconOnly: false, warning: false };

export default function headerAction({ label, icon, href = null, external = false, items = null, description = null, align = 'end', iconOnly = false, warning = false, ...attributes }, icons = {}) {
  const picture = uiIcon(icons[icon], { size: 'xl', class: 'ps-header-action__icon' });
  const hidden = external ? '<span class="visually-hidden"> (opens in a new tab)</span>' : '';
  const content = `${picture}<span class="ps-header-action__label">${label}${hidden}</span>`;
  const extra = Object.entries(attributes).filter(([name]) => name !== 'class').map(([name, value]) => ` ${name}="${value}"`).join('');
  let html;

  const own = ['ps-header-action', warning && 'ps-header-action--warning', iconOnly && 'ps-header-action--icon-only'].filter(Boolean).join(' ');

  if (items === null) {
    const classes = [own, attributes.class].filter(Boolean).join(' ');
    const titled = iconOnly && description;
    const tooltip = titled ? `<strong class="ps-header-action-tooltip__title">${label}</strong>${description}` : (iconOnly ? label : description);
    const escape = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const tooltipAttributes = tooltip
      ? `${titled ? ' data-bs-html="true"' : ''} data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-custom-class="ps-header-action-tooltip" data-bs-title="${escape(tooltip)}"`
      : '';
    const link = `${external ? ' target="_blank" rel="noopener noreferrer"' : ''}${tooltipAttributes}`;
    html = `<a class="${classes}" href="${href}"${link}${extra}>${content}</a>`;
  } else {
    const classes = ['dropdown', attributes.class].filter(Boolean).join(' ');
    const arrow = uiIcon(keyboardArrowDown, { class: 'ps-header-action__arrow' });
    html = `<div class="${classes}"${extra}><button type="button" class="${own}" data-bs-toggle="dropdown" aria-expanded="false">${content}${arrow}</button>${dropdownMenu({ items, align }, icons)}</div>`;
  }

  return {
    html,
    twig: twigCall('ui:HeaderAction', { icon, label, href, external, items, description, align: items === null ? undefined : align, iconOnly, warning, ...attributes }, HEADER_ACTION_DEFAULTS),
  };
}
