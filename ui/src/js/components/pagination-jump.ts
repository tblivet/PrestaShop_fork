/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';
import { announce } from './announcer';

// <twig:ui:Pagination jumpUrl="…"> (pagination.html.twig): its form goes to the page typed, kept between 1 and the last
// page, at the URL with {page}, or with {offset} for a list that pages by offset (data-ps-data-per-page rows a page).
// Something that is not a number puts the current page back, marks the field invalid until the next key, shows what is
// expected under it (data-ps-data-invalid-message, Bootstrap's invalid tooltip, the field described by it, aria-invalid
// styled by the kit's forms) and the
// page's Announcer says it.
export const jumpUrl = (template: string, page: number, perPage?: number | null): string =>
  template.replaceAll('{page}', String(page)).replaceAll('{offset}', String((page - 1) * (perPage ?? 1)));

let errors = 0;

// The message under the field, made once per form
const errorOf = (form: HTMLFormElement): HTMLElement => {
  let error = form.querySelector<HTMLElement>('.ps-pagination__error');

  if (!error) {
    errors += 1;
    error = document.createElement('span');
    error.id = `ps-pagination-error-${errors}`;
    error.className = 'invalid-tooltip ps-pagination__error';
    error.hidden = true;
    error.textContent = form.dataset.psDataInvalidMessage ?? '';
    form.append(error);
  }

  return error;
};

const setInvalid = (input: HTMLInputElement, invalid: boolean): void => {
  if (!input.form) {
    return;
  }
  const error = errorOf(input.form);

  error.hidden = !invalid;
  if (invalid) {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', error.id);
  } else {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }
};

export default function initPaginationJump(): void {
  document.addEventListener('input', (event) => {
    if (event.target instanceof HTMLInputElement && event.target.form?.matches(selectors.paginationJump)) {
      setInvalid(event.target, false);
    }
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;

    if (!(form instanceof HTMLFormElement) || !form.matches(selectors.paginationJump)) {
      return;
    }

    event.preventDefault();
    const input = form.elements.namedItem('page');

    if (!(input instanceof HTMLInputElement)) {
      return;
    }
    const typed = Number.parseInt(input.value.trim(), 10);

    if (Number.isNaN(typed)) {
      input.value = input.defaultValue;
      setInvalid(input, true);
      input.select();
      announce(form.dataset.psDataInvalidMessage ?? '');

      return;
    }

    const page = Math.min(Math.max(typed, 1), Number(form.dataset.psDataLast));
    const perPage = form.dataset.psDataPerPage ? Number(form.dataset.psDataPerPage) : null;

    window.location.assign(jumpUrl(form.dataset.psDataUrl ?? '', page, perPage));
  });
}
