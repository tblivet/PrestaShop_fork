/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:HeaderSearch> renders (header_search.html.twig) and its Twig call, for the HeaderSearch and Header
// stories. icons maps the search types' icon names to their SVG files, imported with ?raw from ui/icons.
import allInclusive from '../../icons/material-symbols/all-inclusive.svg?raw';
import group from '../../icons/material-symbols/group.svg?raw';
import keyboardArrowDown from '../../icons/material-symbols/keyboard-arrow-down.svg?raw';
import search from '../../icons/material-symbols/search.svg?raw';
import shoppingBasket from '../../icons/material-symbols/shopping-basket.svg?raw';
import store from '../../icons/material-symbols/store.svg?raw';
import dropdownMenu from './dropdown-menu';
import uiIcon from './ui-icon';
import { twigCall } from './twig-snippet';

// HeaderSearch.php defaults; action and types are required
export const HEADER_SEARCH_DEFAULTS = { query: '', type: 0 };

// The search types of the stories, and their icons
export const SEARCH_TYPES = [
  { value: 0, label: 'Everywhere', placeholder: 'Products, orders, customers…', icon: 'all_inclusive' },
  { value: 1, label: 'Catalog', placeholder: 'Product name or reference', icon: 'store' },
  { value: 2, label: 'Customers by name', placeholder: 'Customer name', icon: 'group' },
  { value: 3, label: 'Orders', placeholder: 'Order ID', icon: 'shopping_basket' },
];

export const SEARCH_ICONS = { all_inclusive: allInclusive, store, group, shopping_basket: shoppingBasket };

export default function headerSearch({ action, query = '', type = 0, types, ...attributes }, icons = {}) {
  // An unknown type falls back to the first, like HeaderSearch.php
  const chosen = types.some((item) => item.value === type) ? type : types[0].value;
  const current = types.find((item) => item.value === chosen);
  const items = types.map((item) => ({
    label: item.label,
    icon: item.icon ?? null,
    active: item.value === chosen,
    attr: { 'data-ps-action': 'set-search-type', 'data-ps-value': item.value, 'data-ps-data-placeholder': item.placeholder },
  }));
  const scope = '<button type="button" class="btn ps-header-search__scope" data-bs-toggle="dropdown" aria-expanded="false">'
    + '<span class="visually-hidden">Search in </span>'
    + `${current.icon ? uiIcon(icons[current.icon], { size: 'lg', class: 'ps-header-search__scope-icon', 'data-ps-ref': 'header-search-scope-icon' }) : ''}`
    + `<span class="ps-header-search__scope-label" data-ps-ref="header-search-scope">${current.label}</span>${uiIcon(keyboardArrowDown, { size: 'lg' })}</button>`
    + dropdownMenu({ items, align: 'end' }, icons);
  const classes = ['ps-header-search', 'offcanvas-md', 'offcanvas-top', attributes.class].filter(Boolean).join(' ');
  const extra = Object.entries(attributes).filter(([name]) => name !== 'class').map(([name, value]) => ` ${name}="${value}"`).join('');

  return {
    html: `<div id="ps-header-search" class="${classes}"${extra} tabindex="-1">`
      + `<form class="ps-header-search__form" method="post" action="${action}" role="search" data-ps-ref="header-search">`
      + `<input type="hidden" name="bo_search_type" value="${chosen}" data-ps-ref="header-search-type">`
      + '<div class="input-group">'
      + `<input type="search" name="bo_query" value="${query}" class="form-control ps-header-search__input" placeholder="${current.placeholder}" aria-label="Search" data-ps-ref="header-search-input">`
      + `${scope}<button type="submit" class="btn ps-header-search__submit" aria-label="Search">${uiIcon(search, { size: 'lg' })}</button>`
      + '</div></form></div>'
      + '<button type="button" class="ps-header-search__toggle" data-bs-toggle="offcanvas" data-bs-target="#ps-header-search" aria-controls="ps-header-search" aria-label="Search">'
      + `${uiIcon(search, { size: 'xl' })}</button>`,
    twig: twigCall('ui:HeaderSearch', { action, query, type, types, ...attributes }, HEADER_SEARCH_DEFAULTS),
  };
}
