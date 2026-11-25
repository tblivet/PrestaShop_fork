/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:Pagination> renders (pagination.html.twig) and its Twig call, for the Pagination story and the
// stories that show a list's pages (the grid). Pagination.php picks the pages shown the same way.
import chevronLeft from '../../icons/material-symbols/chevron-left.svg?raw';
import chevronRight from '../../icons/material-symbols/chevron-right.svg?raw';
import uiIcon from './ui-icon';
import { twigCall } from './twig-snippet';

// Pagination.php has no defaults: current, links and label are required
export const PAGINATION_DEFAULTS = {};

const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The links a list of `total` pages gives: the first, the last, the current one and its neighbours, as a grid builds them
export const pageLinks = (current, total, url = (page) => `#page-${page}`) => Object.fromEntries(
  [...new Set([1, current - 1, current, current + 1, total])].filter((page) => page >= 1 && page <= total).map((page) => [page, url(page)]),
);

// Pagination::getItems(): the pages shown, null where pages are left out
const items = (current, pages) => {
  const last = pages[pages.length - 1];
  const shown = pages.filter((page) => page === 1 || page === last || Math.abs(page - current) <= 1);

  return shown.flatMap((page, index) => (index > 0 && page - shown[index - 1] > 1 ? [null, page] : [page]));
};

/**
 * @param {object} props the props and attributes as in Twig: current, links (page number => URL), label
 */
export default function pagination({ current, links, label, ...attributes }) {
  const pages = Object.keys(links).map(Number).sort((a, b) => a - b);
  const twig = twigCall('ui:Pagination', { current, links, label, ...attributes }, PAGINATION_DEFAULTS);

  if (pages.length <= 1) {
    return { html: '', twig };
  }

  const last = pages[pages.length - 1];
  const classes = ['ps-pagination', attributes.class].filter(Boolean).join(' ');
  const extra = Object.entries(attributes).filter(([name]) => name !== 'class').map(([name, value]) => ` ${name}="${escape(value)}"`).join('');
  const previous = links[current - 1]
    ? `<li class="page-item ps-pagination__item ps-pagination__item--step"><a class="page-link ps-pagination__link" href="${escape(links[current - 1])}" rel="prev">${uiIcon(chevronLeft, { flipRtl: true })}<span class="visually-hidden">Previous</span></a></li>`
    : '';
  const next = links[current + 1]
    ? `<li class="page-item ps-pagination__item ps-pagination__item--step"><a class="page-link ps-pagination__link" href="${escape(links[current + 1])}" rel="next"><span class="visually-hidden">Next</span>${uiIcon(chevronRight, { flipRtl: true })}</a></li>`
    : '';
  const list = items(current, pages).map((page) => {
    if (page === null) {
      return '<li class="page-item disabled ps-pagination__item ps-pagination__item--gap ps-pagination__item--far" aria-hidden="true"><span class="page-link ps-pagination__link">…</span></li>';
    }
    if (page === current) {
      return `<li class="page-item active ps-pagination__item ps-pagination__item--current"><a class="page-link ps-pagination__link" href="${escape(links[page])}" aria-current="page"><span class="ps-pagination__number" aria-hidden="true">${page}</span><span class="ps-pagination__position">Page ${page} of ${last}</span></a></li>`;
    }

    return `<li class="page-item ps-pagination__item ps-pagination__item--far"><a class="page-link ps-pagination__link" href="${escape(links[page])}">${page}</a></li>`;
  }).join('');

  return {
    html: `<nav class="${escape(classes)}" aria-label="${escape(label)}"${extra}><ul class="pagination">${previous}${list}${next}</ul></nav>`,
    twig,
  };
}
