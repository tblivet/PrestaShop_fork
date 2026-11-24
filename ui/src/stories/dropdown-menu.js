/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:DropdownMenu> renders (dropdown_menu.html.twig), for the DropdownMenu and Dropdown stories.
// icons maps each item icon name to its SVG file, imported with ?raw from ui/icons.
import uiIcon from './ui-icon';

const itemType = (item) => item.type ?? (item.href ? 'link' : 'button');

const item = (entry, icons) => {
  const type = itemType(entry);

  if (type === 'divider') {
    return '<li><hr class="dropdown-divider"></li>';
  }

  if (type === 'heading') {
    return `<li><span class="dropdown-header">${entry.label}</span></li>`;
  }

  if (type === 'text') {
    return `<li><span class="dropdown-item-text">${entry.label}</span></li>`;
  }

  const link = type === 'link';
  const classes = ['dropdown-item', 'ps-dropdown-menu__item', entry.disabled && link && 'disabled', entry.attr?.class].filter(Boolean).join(' ');
  const state = `${entry.active ? ' aria-current="true"' : ''}${entry.disabled && link ? ' aria-disabled="true"' : ''}`;
  const extra = Object.entries(entry.attr ?? {}).filter(([name]) => name !== 'class').map(([name, value]) => ` ${name}="${value}"`).join('');
  const icon = entry.icon ? uiIcon(icons[entry.icon], { size: 'lg', class: 'ps-dropdown-menu__icon' }) : '';
  const hidden = entry.external ? '<span class="visually-hidden"> (opens in a new tab)</span>' : '';
  const content = `${icon}<span class="ps-dropdown-menu__label">${entry.label}${hidden}</span>`;

  if (link) {
    const href = entry.disabled ? ' role="link"' : ` href="${entry.href}"`;
    const external = entry.external ? ' target="_blank" rel="noopener noreferrer"' : '';

    return `<li><a class="${classes}"${href}${state}${external}${extra}>${content}</a></li>`;
  }

  return `<li><button type="button" class="${classes}"${state}${entry.disabled ? ' disabled' : ''}${extra}>${content}</button></li>`;
};

// Without items, content is the HTML the menu holds (a form, text)
export default function dropdownMenu({ items = null, content = '', align = 'start', ...attributes }, icons = {}) {
  const own = ['dropdown-menu', 'ps-dropdown-menu', align === 'end' && 'dropdown-menu-end', items === null && 'ps-dropdown-menu--content'];
  const classes = [...own, attributes.class].filter(Boolean).join(' ');
  const extra = Object.entries(attributes).filter(([name]) => name !== 'class').map(([name, value]) => ` ${name}="${value}"`).join('');

  if (items === null) {
    return `<div class="${classes}"${extra}>${content}</div>`;
  }

  return `<ul class="${classes}"${extra}>${items.map((entry) => item(entry, icons)).join('')}</ul>`;
}
