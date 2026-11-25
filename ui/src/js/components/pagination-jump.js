/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';
import { announce } from './announcer';

// <twig:ui:Pagination jumpUrl="…"> (pagination.html.twig): its form goes to the page typed, kept between 1 and the last
// page, at the URL with {page}, or with {offset} for a list that pages by offset (data-ps-data-per-page rows a page).
// Something that is not a number puts the current page back, marks the field invalid until the next key, and the page's
// Announcer says what is expected (data-ps-data-invalid-message).
export const jumpUrl = (template, page, perPage) => template
  .replaceAll('{page}', String(page))
  .replaceAll('{offset}', String((page - 1) * (perPage ?? 1)));

export default function initPaginationJump() {
  document.addEventListener('input', (event) => {
    if (event.target instanceof HTMLInputElement && event.target.form?.matches(selectors.paginationJump)) {
      event.target.removeAttribute('aria-invalid');
    }
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;

    if (!(form instanceof HTMLFormElement) || !form.matches(selectors.paginationJump)) {
      return;
    }

    event.preventDefault();
    const input = form.elements.namedItem('page');
    const typed = Number.parseInt(input.value.trim(), 10);

    if (Number.isNaN(typed)) {
      input.value = input.defaultValue;
      input.setAttribute('aria-invalid', 'true');
      input.select();
      announce(form.dataset.psDataInvalidMessage);

      return;
    }

    const page = Math.min(Math.max(typed, 1), Number(form.dataset.psDataLast));
    const perPage = form.dataset.psDataPerPage ? Number(form.dataset.psDataPerPage) : null;

    window.location.assign(jumpUrl(form.dataset.psDataUrl, page, perPage));
  });
}
