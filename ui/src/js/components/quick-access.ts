/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';
import { announce } from './announcer';
import { setButtonBusy } from './busy-button';

// The header's quick access (Component/Layout/Ui/quick_access.html.twig and quick_access_modals.html.twig): adds this
// page with a name, or removes it after a confirmation, then rebuilds the shortcuts in place, so nothing typed on the
// page is lost. The server answers with the employee's shortcuts, or {has_errors: true, 0: message}.

const NAME_MAX_LENGTH = 32;

// A shortcut as the server lists it
interface Shortcut {
  id_quick_access: number | string;
  name: string;
  link: string;
  active: boolean;
  new_window: number | string;
}

// A link item of <twig:ui:DropdownMenu> (dropdown_menu.html.twig), built with the DOM so names are never read as HTML
const linkItem = (shortcut: Shortcut, newTabLabel: string | undefined): HTMLLIElement => {
  const item = document.createElement('li');
  const link = document.createElement('a');
  const label = document.createElement('span');

  link.className = 'dropdown-item ps-dropdown-menu__item';
  link.href = shortcut.link;
  link.dataset.psRef = 'quick-access-link';
  // Its name alone, for the remove dialog: the label also holds the hidden new-tab hint
  link.dataset.psDataName = shortcut.name;
  if (shortcut.active) {
    link.setAttribute('aria-current', 'true');
  }
  label.className = 'ps-dropdown-menu__label';
  label.textContent = shortcut.name;
  if (Number(shortcut.new_window) === 1) {
    const hidden = document.createElement('span');

    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    hidden.className = 'visually-hidden';
    hidden.textContent = ` ${newTabLabel}`;
    label.append(hidden);
  }
  link.append(label);
  item.append(link);

  return item;
};

const dividerItem = (): HTMLLIElement => {
  const item = document.createElement('li');
  const divider = document.createElement('hr');

  divider.className = 'dropdown-divider';
  item.append(divider);

  return item;
};

// The shortcuts first, then a divider when there are some, then the actions
const renderShortcuts = (root: HTMLElement, shortcuts: Shortcut[]): void => {
  const menu = root.querySelector('ul');
  const add = root.querySelector<HTMLElement>(selectors.addQuickAccess);
  const remove = root.querySelector<HTMLElement>(selectors.removeQuickAccess);

  if (!menu || !add || !remove) {
    return;
  }
  const divider = menu.querySelector(':scope > li > hr')?.parentElement;

  menu.querySelectorAll(selectors.quickAccessLink).forEach((link) => link.parentElement?.remove());
  divider?.remove();

  if (shortcuts.length > 0) {
    menu.prepend(...shortcuts.map((shortcut) => linkItem(shortcut, root.dataset.psDataNewTab)), dividerItem());
  }

  const current = shortcuts.find((shortcut) => shortcut.active);
  root.dataset.psDataId = current ? String(current.id_quick_access) : '';
  add.hidden = Boolean(current);
  remove.hidden = !current;
};

const send = async (url: string, fields: Record<string, string>): Promise<Shortcut[]> => {
  const response = await fetch(url, {
    method: 'POST',
    body: new URLSearchParams(fields),
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const data: Shortcut[] | Record<string, unknown> = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(
      Object.values(data)
        .filter((value) => typeof value === 'string')
        .join(' ')
    );
  }

  return data;
};

export default function initQuickAccess(Modal: typeof import('bootstrap').Modal): void {
  const root = (): HTMLElement | null => document.querySelector<HTMLElement>(selectors.quickAccess);

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;

    if (target?.closest(selectors.addQuickAccess)) {
      const dialog = document.querySelector<HTMLElement>(selectors.quickAccessAdd);
      const error = dialog?.querySelector<HTMLElement>(selectors.quickAccessError);
      const name = dialog?.querySelector<HTMLInputElement>(selectors.quickAccessName);
      const newTab = dialog?.querySelector<HTMLInputElement>(selectors.quickAccessNewTab);
      const errorMessage = error?.querySelector(selectors.quickAccessErrorMessage);

      if (!dialog || !error || !name || !newTab || !errorMessage) {
        return;
      }
      name.value = (root()?.dataset.psDataPageName ?? '').slice(0, NAME_MAX_LENGTH);
      newTab.checked = false;
      error.hidden = true;
      errorMessage.textContent = '';
      Modal.getOrCreateInstance(dialog).show();

      return;
    }

    if (target?.closest(selectors.removeQuickAccess)) {
      const dialog = document.querySelector<HTMLElement>(selectors.quickAccessRemove);
      const message = dialog?.querySelector<HTMLElement>(selectors.quickAccessRemoveMessage);
      const removeError = dialog?.querySelector<HTMLElement>(selectors.quickAccessRemoveError);
      const current = root()?.querySelector<HTMLElement>(`${selectors.quickAccessLink}[aria-current="true"]`);
      const name = current?.dataset.psDataName ?? root()?.dataset.psDataPageName ?? '';

      if (!dialog || !message || !removeError) {
        return;
      }
      message.textContent = (message.dataset.psDataMessage ?? '').replace('%name%', name);
      removeError.hidden = true;
      Modal.getOrCreateInstance(dialog).show();

      return;
    }

    const confirm = target?.closest<HTMLButtonElement>(selectors.confirmRemoveQuickAccess);

    if (confirm && !confirm.matches(selectors.busyButton)) {
      const quickAccess = root();
      const dialog = document.querySelector<HTMLElement>(selectors.quickAccessRemove);
      const error = dialog?.querySelector<HTMLElement>(selectors.quickAccessRemoveError);
      const errorMessage = error?.querySelector(selectors.quickAccessRemoveErrorMessage);

      if (!quickAccess || !dialog || !error || !errorMessage) {
        return;
      }
      error.hidden = true;
      setButtonBusy(confirm, true);
      send(quickAccess.dataset.psDataRemoveUrl ?? '', {
        method: 'remove',
        id_quick_access: quickAccess.dataset.psDataId ?? '',
      })
        .then((shortcuts) => {
          renderShortcuts(quickAccess, shortcuts);
          Modal.getOrCreateInstance(dialog).hide();
          // Says what happened once the dialog closes
          announce(quickAccess.dataset.psDataRemoved ?? '');
        })
        .catch((reason: Error) => {
          // A danger alert (role="alert"): shown, then filled, so screen readers announce the message
          error.hidden = false;
          errorMessage.textContent = reason.message;
        })
        .finally(() => {
          setButtonBusy(confirm, false);
        });
    }
  });

  // Runs after form-validation.ts, which stops an empty name before it gets here
  document.addEventListener('submit', (event) => {
    const form = event.target;

    if (!(form instanceof HTMLFormElement) || !form.matches(selectors.quickAccessAddForm)) {
      return;
    }

    event.preventDefault();
    const quickAccess = root();
    const dialog = form.closest<HTMLElement>(selectors.quickAccessAdd);
    const error = form.querySelector<HTMLElement>(selectors.quickAccessError);
    const errorMessage = error?.querySelector(selectors.quickAccessErrorMessage);
    const name = form.querySelector<HTMLInputElement>(selectors.quickAccessName);
    const newTab = form.querySelector<HTMLInputElement>(selectors.quickAccessNewTab);
    const submit = document.querySelector<HTMLButtonElement>(`[form="${form.id}"][type="submit"]`);

    if (submit?.matches(selectors.busyButton)) {
      return;
    }
    if (!quickAccess || !dialog || !error || !errorMessage || !name || !newTab) {
      return;
    }

    error.hidden = true;
    if (submit) {
      setButtonBusy(submit, true);
    }
    send(quickAccess.dataset.psDataAddUrl ?? '', {
      method: 'add',
      url: quickAccess.dataset.psDataPageUrl ?? '',
      name: name.value.trim(),
      icon: quickAccess.dataset.psDataPageIcon ?? '',
      new_window: newTab.checked ? '1' : '0',
    })
      .then((shortcuts) => {
        renderShortcuts(quickAccess, shortcuts);
        Modal.getOrCreateInstance(dialog).hide();
        announce(quickAccess.dataset.psDataAdded ?? '');
      })
      .catch((reason: Error) => {
        error.hidden = false;
        errorMessage.textContent = reason.message;
      })
      .finally(() => {
        if (submit) {
          setButtonBusy(submit, false);
        }
      });
  });

  document.addEventListener('shown.bs.modal', (event) => {
    if (event.target instanceof Element && event.target.matches(selectors.quickAccessAdd)) {
      event.target.querySelector<HTMLInputElement>(selectors.quickAccessName)?.select();
    }
  });

  // Opened from the menu, not by a data-bs-toggle button: Bootstrap does not bring focus back, so it goes to the quick
  // access button the menu came from
  document.addEventListener('hidden.bs.modal', (event) => {
    if (
      event.target instanceof Element &&
      event.target.matches(`${selectors.quickAccessAdd}, ${selectors.quickAccessRemove}`)
    ) {
      root()?.querySelector<HTMLElement>(selectors.dropdownToggle)?.focus();
    }
  });
}
