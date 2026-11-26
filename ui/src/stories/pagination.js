/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:Pagination> renders (pagination.html.twig) and its Twig call, for the Pagination story and the
// stories that show a list's pages (the grid).
import chevronLeft from '../../icons/material-symbols/chevron-left.svg?raw';
import chevronRight from '../../icons/material-symbols/chevron-right.svg?raw';
import uiIcon from './ui-icon';
import { twigCall } from './twig-snippet';

// Pagination.php defaults; current, links and label are required
export const PAGINATION_DEFAULTS = { jumpUrl: null, perPage: null };

const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The links a list of `total` pages gives: the first, the last, the current one and its neighbours, as a grid builds them
export const pageLinks = (current, total, url = (page) => `#page-${page}`) => Object.fromEntries(
  [...new Set([1, current - 1, current, current + 1, total])].filter((page) => page >= 1 && page <= total).map((page) => [page, url(page)]),
);

/**
 * @param {object} props the props and attributes as in Twig: current, links (page number => URL), label
 */
export default function pagination({
  current, links, label, jumpUrl = null, perPage = null, ...attributes
}) {
  const pages = Object.keys(links).map(Number).sort((a, b) => a - b);
  const twig = twigCall('ui:Pagination', { current, links, label, jumpUrl, perPage, ...attributes }, PAGINATION_DEFAULTS);

  if (pages.length <= 1) {
    return { html: '', twig };
  }

  const last = pages[pages.length - 1];
  const classes = ['ps-pagination', attributes.class].filter(Boolean).join(' ');
  const extra = Object.entries(attributes).filter(([name]) => name !== 'class').map(([name, value]) => ` ${name}="${escape(value)}"`).join('');
  // The arrow that leads nowhere stays in place, disabled and hidden from screen readers
  const step = (page, rel, label, icon) => (links[page]
    ? `<li class="page-item ps-pagination__item ps-pagination__item--step"><a class="page-link ps-pagination__link" href="${escape(links[page])}" rel="${rel}">${rel === 'prev' ? `${icon}<span class="visually-hidden">${label}</span>` : `<span class="visually-hidden">${label}</span>${icon}`}</a></li>`
    : `<li class="page-item disabled ps-pagination__item ps-pagination__item--step" aria-hidden="true"><span class="page-link ps-pagination__link">${icon}</span></li>`);
  const previous = step(current - 1, 'prev', 'Previous', uiIcon(chevronLeft, { flipRtl: true }));
  const next = step(current + 1, 'next', 'Next', uiIcon(chevronRight, { flipRtl: true }));

  // The field inside its label, read "Page 12 of 25"; a <twig:ui:Button> to go. Without jumpUrl, the text
  const position = jumpUrl
    ? `<form class="ps-pagination__jump" data-ps-action="pagination-jump" data-ps-data-url="${escape(jumpUrl)}" data-ps-data-last="${last}" data-ps-data-invalid-message="Enter a page number from 1 to ${last}"${perPage ? ` data-ps-data-per-page="${perPage}"` : ''} novalidate>`
      + `<label class="ps-pagination__jump-field">Page <input class="form-control form-control-sm ps-pagination__jump-input" type="text" inputmode="numeric" pattern="[0-9]*" name="page" value="${current}" autocomplete="off"> of ${last}</label>`
      + '<button class="btn btn-outline-secondary btn-sm ps-button" type="submit" data-ps-data-busy-label="Loading...">Go</button></form>'
    : `<span class="ps-pagination__position" aria-current="page">Page ${current} of ${last}</span>`;

  return {
    html: `<nav class="${escape(classes)}" aria-label="${escape(label)}"${extra}><ul class="pagination">${previous}<li class="ps-pagination__item ps-pagination__item--position">${position}</li>${next}</ul></nav>`,
    twig,
  };
}
