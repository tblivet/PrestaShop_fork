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

// HeaderAction.php defaults; label is required, and an icon or an image, an href or items
export const HEADER_ACTION_DEFAULTS = { icon: null, image: null, href: null, external: false, items: null, description: null, align: 'end' };

export default function headerAction({ label, icon = null, image = null, href = null, external = false, items = null, description = null, align = 'end', ...attributes }, icons = {}) {
  const picture = image
    ? `<img class="ps-header-action__image" src="${image}" alt="" width="24" height="24">`
    : uiIcon(icons[icon], { size: 'xl', class: 'ps-header-action__icon' });
  const hidden = external ? '<span class="visually-hidden"> (opens in a new tab)</span>' : '';
  const content = `${picture}<span class="ps-header-action__label">${label}${hidden}</span>`;
  const extra = Object.entries(attributes).filter(([name]) => name !== 'class').map(([name, value]) => ` ${name}="${value}"`).join('');
  let html;

  if (items === null) {
    const classes = ['ps-header-action', attributes.class].filter(Boolean).join(' ');
    const link = `${external ? ' target="_blank" rel="noopener noreferrer"' : ''}${description ? ` data-bs-toggle="tooltip" data-bs-title="${description}"` : ''}`;
    html = `<a class="${classes}" href="${href}"${link}${extra}>${content}</a>`;
  } else {
    const classes = ['dropdown', attributes.class].filter(Boolean).join(' ');
    const arrow = uiIcon(keyboardArrowDown, { class: 'ps-header-action__arrow' });
    html = `<div class="${classes}"${extra}><button type="button" class="ps-header-action" data-bs-toggle="dropdown" aria-expanded="false">${content}${arrow}</button>${dropdownMenu({ items, align }, icons)}</div>`;
  }

  return {
    html,
    twig: twigCall('ui:HeaderAction', { icon, image, label, href, external, items, description, align: items === null ? undefined : align, ...attributes }, HEADER_ACTION_DEFAULTS),
  };
}
