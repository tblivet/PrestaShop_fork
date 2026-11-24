/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:PageHead> renders (page_head.html.twig) and its Twig call, for the PageHead story and the
// playground pages. Its icons: the names the stories use, Help and the "More actions" menu.
import add from '../../icons/material-symbols/add.svg?raw';
import anchor from '../../icons/material-symbols/anchor.svg?raw';
import arrowBack from '../../icons/material-symbols/arrow-back.svg?raw';
import contactMail from '../../icons/material-symbols/contact-mail.svg?raw';
import download from '../../icons/material-symbols/download.svg?raw';
import help from '../../icons/material-symbols/help.svg?raw';
import home from '../../icons/material-symbols/home.svg?raw';
import inventory2 from '../../icons/material-symbols/inventory-2.svg?raw';
import moreVert from '../../icons/material-symbols/more-vert.svg?raw';
import openInNew from '../../icons/material-symbols/open-in-new.svg?raw';
import refresh from '../../icons/material-symbols/refresh.svg?raw';
import translate from '../../icons/material-symbols/translate.svg?raw';
import style from '../../icons/material-symbols/style.svg?raw';
import upload from '../../icons/material-symbols/upload.svg?raw';
import dropdownMenu from './dropdown-menu';
import uiIcon from './ui-icon';
import { twigCall } from './twig-snippet';

// PageHead.php defaults; title is required
export const PAGE_HEAD_DEFAULTS = { icon: null, pages: [], pagesLabel: null, actions: [], help: null };

export const PAGE_HEAD_ICONS = {
  add, anchor, arrow_back: arrowBack, contact_mail: contactMail, download, help, home, inventory_2: inventory2, more_vert: moreVert, open_in_new: openInNew, refresh, style, translate, upload,
};

// The story imports only the icons above: another name a control is given shows an empty icon instead of failing
const MISSING = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"></svg>';
const ICONS = new Proxy(PAGE_HEAD_ICONS, { get: (icons, name) => icons[name] ?? MISSING });

const NEW_TAB = '(opens in a new tab)';
const BUSY_LABEL = 'Loading...';

const html = (attributes) => Object.entries(attributes).map(([name, value]) => (value === true ? ` ${name}` : ` ${name}="${value}"`)).join('');

// A page action: a small <twig:ui:Button> with its icon, a link when it has an href
const actionButton = ({ label, icon, href = null, external = false, disabled = false, attr = {} }, variant) => {
  const { class: extraClass, ...rest } = attr;
  const classes = ['btn', `btn-${variant}`, 'btn-sm', 'ps-button', extraClass].filter(Boolean);
  let own;

  if (href === null) {
    own = { type: 'button', 'data-ps-data-busy-label': BUSY_LABEL, ...(disabled ? { disabled: true } : {}) };
  } else if (disabled) {
    classes.push('disabled');
    own = { role: 'link', 'aria-disabled': 'true' };
  } else {
    own = { href };
  }

  const tag = href === null ? 'button' : 'a';
  const newTab = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const hidden = external ? `<span class="visually-hidden"> ${NEW_TAB}</span>` : '';

  return `<${tag} class="${classes.join(' ')}"${html({ ...own, ...newTab, ...rest })}>${uiIcon(ICONS[icon], { size: 'lg' })}<span class="ps-button__label">${label}${hidden}</span></${tag}>`;
};

/**
 * @param {object} props the props as in Twig: title, icon, pages [{label, href, current}], pagesLabel,
 *   actions [{label, icon, href, external, disabled, attr}] (the main one first), help (a URL)
 */
export default function pageHead({ title, icon = null, pages = [], pagesLabel = null, actions = [], help = null }) {
  const iconHtml = icon ? uiIcon(ICONS[icon], { class: 'ps-page-head__icon' }) : '';
  const nav = pages.length === 0 ? '' : `<nav class="ps-page-head__pages ps-scroll-fade ps-scroll-fade--x" data-ps-action="scroll-fade" aria-label="${pagesLabel}"><ul class="nav nav-underline">${pages.map((page) => `<li class="nav-item"><a class="nav-link${page.current ? ' active' : ''}" href="${page.href}"${page.current ? ' aria-current="page"' : ''}>${page.label}</a></li>`).join('')}</ul></nav>`;
  const items = [
    ...actions.map(({ label, icon: name, href = null, external = false, disabled = false, attr = {} }) => ({
      label, icon: name, href, external, disabled, attr: Object.fromEntries(Object.entries(attr).filter(([attribute]) => attribute !== 'id')),
    })),
    ...(help ? [...(actions.length ? [{ type: 'divider' }] : []), { label: 'Help', icon: 'help', href: help, external: true }] : []),
  ];
  const buttons = actions.map((action, index) => `<span class="${index === 0 ? 'ps-page-head__main-action' : 'ps-page-head__extra'}">${actionButton(action, index === 0 ? 'primary' : 'secondary')}</span>`).join('');
  const helpButton = help ? `<span class="ps-page-head__extra"><a class="btn btn-secondary btn-sm ps-button ps-icon-button" href="${help}" aria-label="Help" data-bs-toggle="tooltip" data-bs-title="Help" data-bs-placement="bottom" target="_blank" rel="noopener noreferrer">${uiIcon(ICONS.help, { size: 'lg' })}</a></span>` : '';
  const menu = items.length === 0 ? '' : `<div class="dropdown ps-page-head__more"><button class="btn btn-secondary btn-sm ps-button ps-icon-button" type="button" data-ps-data-busy-label="${BUSY_LABEL}" aria-label="More actions" data-bs-toggle="dropdown" aria-expanded="false">${uiIcon(ICONS.more_vert, { size: 'lg' })}</button>${dropdownMenu({ items, align: 'end' }, ICONS)}</div>`;
  const actionsHtml = items.length === 0 ? '' : `<div class="ps-page-head__actions">${buttons}${helpButton}${menu}</div>`;

  return {
    html: `<header class="ps-page-head${pages.length ? ' ps-page-head--with-pages' : ''}"><h1 class="ps-page-head__title">${iconHtml}${title}</h1>${nav}${actionsHtml}</header>`,
    twig: twigCall('ui:PageHead', { title, icon, pages, pagesLabel, actions, help }, PAGE_HEAD_DEFAULTS),
  };
}
