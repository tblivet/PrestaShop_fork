/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:Toast> and <twig:ui:ToastStack> render (toast.html.twig, toast_stack.html.twig) and their Twig
// calls, for the Toast story and the stack the Storybook preview keeps in every story, as the kit layouts do in every page
import { ALERT_ICONS, STATUS_ICONS } from './alert';
import uiIcon from './ui-icon';
import { markup, twigCall } from './twig-snippet';

// Toast.php defaults
export const TOAST_DEFAULTS = { type: 'success', autohide: true, delay: 5000 };

// Toast::TYPES
export const TOAST_TYPES = ['success', 'info', 'warning', 'danger'];

// toast.html.twig: what the icon of a type says to screen readers
const STATUS_LABELS = { danger: 'Error', info: 'Information', success: 'Success', warning: 'Warning' };

/**
 * @param {object} props the props and attributes as in Twig; content is the content block (the message)
 */
export default function toast({ type = 'success', autohide = true, delay = 5000, content = '', ...attributes }) {
  // Toast.php: a danger toast never hides by itself
  const hides = autohide && type !== 'danger';
  const classes = ['toast', 'ps-toast', `ps-toast--${type}`, attributes.class].filter(Boolean).join(' ');
  const extra = Object.entries(attributes).filter(([name]) => name !== 'class').map(([name, value]) => ` ${name}="${value}"`).join('');

  return {
    html: `<div class="${classes}" data-bs-autohide="${hides}" data-bs-delay="${delay}" data-ps-ref="toast"${extra}>
      ${uiIcon(ALERT_ICONS[STATUS_ICONS[type]], { size: 'lg', class: 'ps-toast__icon', label: STATUS_LABELS[type] })}
      <div class="toast-body ps-toast__message" data-ps-ref="toast-message">${content}</div>
      <button type="button" class="btn-close ps-toast__close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>`,
    twig: twigCall('ui:Toast', { type, autohide, delay, ...attributes }, TOAST_DEFAULTS, content ? [markup(content)] : []),
  };
}

export function toastStack(attributes = {}) {
  const { class: extraClass, ...rest } = attributes;
  const classes = ['toast-container', 'ps-toast-stack', extraClass].filter(Boolean).join(' ');
  const extra = Object.entries(rest).map(([name, value]) => ` ${name}="${value}"`).join('');
  const templates = TOAST_TYPES.map((type) => `<template data-ps-ref="toast-template" data-ps-data-type="${type}">${toast({ type }).html}</template>`).join('');

  return {
    html: `<div class="${classes}" data-ps-target="toast-stack"${extra}>${templates}</div>`,
    twig: twigCall('ui:ToastStack', attributes, {}),
  };
}
