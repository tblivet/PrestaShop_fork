# /ui kit — changes for others

What a rework changes for code that is not the kit: modules (classes, ids, hooks they target), the Bootstrap 4 theme, the Playwright campaigns and `ui-testing-library` (adapted in one pass at the end, `DECISIONS.md` #7), and translators. Every rework adds an entry; newest last.

Each entry: the page or component, then only the sections that apply.

- **Markup**: classes, ids and elements removed or renamed (old → new), new `data-ps-*` hooks tests can use.
- **Hooks**: moved or removed hooks.
- **Behaviour**: what a user or a test sees work differently.
- **Strings**: old → new, per domain. New strings are listed by `node ui/.ai/bin/missing-translations.mjs`.
- **Old theme**: what breaks with `PS_UI_KIT=0`.

## Login, password reset and required actions — 2026-10-30 to 2026-11-03

`Login/Ui/{login,reset_password,required_actions}.html.twig`, `Layout/Ui/login_layout.html.twig`, `LoginController`, `Form/Admin/Login/*Type`.

**Markup**
- Kit pages: Bootstrap 5 markup with the `ps-login` block; no `.alert-text`, `#login-footer` or prestakit classes. Flash alerts are `<twig:ui:Alert>` with `data-ps-ref="flash-alert"`.
- New hooks, rendered by the form types in both themes: `data-ps-ref` `login-form`, `forgot-password-form`, `reset-password-form`, `new-password`, `new-password-confirmation`, `reset-password-submit`; `data-ps-action` `show-forgot-password`, `cancel-forgot-password`, `toggle-password`; `data-ps-target="password-mismatch"`. Existing ids (`#login_form`, `#forgot_password_form`, `#forgot-password-link`, `#reset_password_new_password_first`…) are kept.
- Password feedback helper (`Helpers/password_feedback.html.twig`, also on the Employee and Customer forms): `password-strength-feedback`, `progress-container`, `progress-bar`, `password-strength-text`, `password-requirements*` and `#password-feedback` → `ps-password-feedback` BEM block with `data-ps-ref` hooks (`password-feedback`, `password-strength-bar`, `password-strength-text`, `password-requirement-length`, `password-requirement-score`) and `data-ps-state` (`met`, `unmet`, `failed`; bar `weak`, `average`, `strong`).
- Reset confirmation field: `data-invalid-password` → `data-ps-data-mismatch`.
- Kit form errors: field errors are `#<field id>_error` linked by `aria-describedby`, fields in error carry `aria-invalid="true"`; form-level errors (CSRF) are an alert `#<form id>_error`.
- Alerts (`<twig:ui:Alert>`): `role="status"` except `danger` (`role="alert"`); icon `size="lg"` (20px) centred on the first line by `.ps-alert__icon`.
- Logo `alt` is "PrestaShop" (was the shop name); social links have translated `aria-label`.

**Behaviour**
- The reset button is never disabled; an invalid submit is blocked and moves focus to the first field to fix.
- The password mismatch shows under the confirmation field when it loses focus or on submit (client), and under the confirmation field from the server (was above the fields).
- A too-long password fails the length rule and hides the strength label.
- The password field state is `aria-invalid`, no more `border-success` / `border-danger` classes (Employee and Customer forms too).
- A throttled reset request shows the same "Check your inbox" message as a sent link (was a throttle error revealing that the account exists).

**Strings** (`Admin.Login.Feature`, `Admin.Login.Notification`, `Admin.Advparameters.*`, `Admin.Notifications.Error`)
- "Log in" → "Sign in"; "Stay logged in" → "Stay signed in"; "I forgot my password" → "Forgot your password?"; new title "Sign in to your back office".
- "The employee does not exist, or the password provided is incorrect." → "The email address or password is incorrect."
- "Please, check your mailbox." + "If this email address has been registered in our store, you will receive a link to reset your password." → "Check your inbox." + "If an account exists for this email address, you'll receive a link to reset your password." + "You can request a new link every %count% hours." (or hour / minutes / minute).
- "You can reset your password every %interval% minute(s) only. Please try again later." → removed (see Behaviour).
- "The password has been changed successfully." → "Your password has been changed. You can now sign in."
- "Your password reset request expired. Please start again." → "Your reset link has expired. Request a new one."
- "An error occurred while attempting to reset your password." → "We couldn't reset your password. Try again later."
- "Password should be at least %num% characters long." (help) → "Use between %d and %d characters"; "Confirm password" → "Confirm new password"; "The confirmation password doesn't match." → "The passwords don't match." (also the server message).
- Required actions: "For security reasons, you cannot connect to the back office until you have:" → "For security reasons, do the following before you sign in:"; "deleted the /install folder" → "Delete the /install folder."; "renamed the /admin folder (e.g. %s)" → "Rename the /admin folder, for example to %s"; "SSL is activated. Please connect using the following link to [1]log in to secure mode (https://)[/1]" → "SSL is on: [1]sign in over a secure connection (https://)[/1]."; new title "Finish securing your shop".
- "SSL is activated. However, your IP is allowed to enter unsecure mode for maintenance or local IP issues." → "SSL is on, but your IP address is allowed to sign in without it, for maintenance or local access."
- CSRF error on the reset forms → "This page has expired. Try again."

**Old theme**
- The Bootstrap 4 login pages use the same form types and scripts: they get the new strings and behaviour, not the new look. Not re-checked with `PS_UI_KIT=0` since 2026-11-03.

## Flash messages component — 2026-11-03

`<twig:ui:FlashMessages>` (`Twig/Component/Ui/FlashMessages.php`, `Admin/Component/Ui/flash_messages.html.twig`) replaces `Admin/Layout/Ui/_flash_alerts.html.twig`.

**Markup**
- `Layout/Ui/_flash_alerts.html.twig` removed: include `<twig:ui:FlashMessages/>` instead.
- The alerts are now wrapped in `<div class="ps-flash-messages" data-ps-ref="flash-messages">`, which spaces them; each alert keeps `data-ps-ref="flash-alert"` and loses its bottom margin. Nothing is rendered when there is no message.
- Login SCSS targets `.ps-flash-messages` instead of `.alert` after the title.

**Old theme**
- Unchanged: `Admin/layout.html.twig` and `Layout/login_layout.html.twig` keep their own flash macros.

## Password field and the `password_widget` block — 2026-11-03

`<twig:ui:PasswordField>` (`Twig/Component/Ui/PasswordField.php`, `Admin/Component/Ui/password_field.html.twig`, `ui/src/scss/components/_password-field.scss`): a password input with its own show/hide button. The kit form theme renders every `PasswordType` through it (`password_widget` block in `ui_kit_layout.html.twig`).

**Markup**
- `Login/Ui/_password_toggle.html.twig` removed; the login and reset templates no longer write the input group or the button: `{{ form_widget(form.password) }}` renders both.
- The group gets the `ps-password-field` block, the button `ps-password-field__toggle` (plus `justify-content-center`). It holds both icons (`visibility`, and `visibility_off` with `ps-password-field__icon--shown`); CSS shows one from `aria-pressed`, and `password-toggle.js` only flips `aria-pressed` and the input type (it used to rewrite the icon found by `[aria-hidden="true"]`).
- Reset page: the password mismatch message moved out of the input group, right after it; the kit shows it through `.input-group:has(> .form-control[aria-invalid="true"]) ~ .invalid-feedback`.

**Behaviour**
- Every password field rendered by a kit form has the show/hide button, not only the login and reset pages.

## SCSS block names and the login page root — 2026-11-04

**Markup**
- Login pages: `<main class="ps-page ps-page--bg-subtle ps-page--login">` → `<main class="ps-page ps-page--bg-subtle ps-page--login ps-login">`. `ps-page--login` stays as the page wrapper's name, unstyled; the padding moved to the `ps-login` block.

## Login review: the 4 major findings — 2026-11-04

**Markup**
- Login page: the "Forgot your password?" trigger is a `<button type="button" class="btn btn-link …">` with `aria-controls` (was an `<a href="#forgotten_password">`); its id and `data-ps-action="show-forgot-password"` are kept.
- Kit form theme (`email_widget`): every email field is followed by an empty `<div class="invalid-feedback" id="<id>_client_error" role="status" data-ps-target="email-error">`, linked by `aria-describedby`.
- Password feedback helper: the strength tip is a `<p class="ps-password-feedback__tip" data-ps-ref="password-tip">` right under the "Minimum strength required" requirement, indented to its text (it was a Bootstrap popover on the field); `data-ps-data-translations` keeps the 5 strength labels, the tips moved to `data-ps-data-feedback`, keyed by @zxcvbn-ts ids. Employee and Customer forms get the same.
- Kit CSS: `aria-invalid` fields show Bootstrap's error icon; empty `.invalid-feedback` slots are hidden; buttons get a focus ring with a gap in the page color, then the button color at 50% (`DECISIONS.md` #29).

**Behaviour**
- Password tips show again: they never did with @zxcvbn-ts v3, whose sentences did not match the translation keys. One line, the warning (why) then the first suggestion (how), while the strength requirement is unmet. The warning is also announced.
- Below the required strength, the strength label names it: "Average (Strong required)" (new string `%s (%s required)`, `Admin.Advparameters.Feature`).
- Kit login page: an invalid email shows its message under the field and sets `aria-invalid`, on change and on a blocked submit; the Bootstrap 4 page keeps `EmailInput` (moved to `pages/login/index.ts`).
- Opening the forgot-password panel moves focus to its email field; Cancel moves it back to the trigger.


## Login review 4: every finding — 2026-11-04

`ui:Alert`, `ui:PasswordField`, kit JS (`submit-once`, `alert-dismiss-focus`, `server-error-focus`), `_icon-link.scss`, login pages, `LoginController`, `ResetPasswordType`.

**Markup**
- `ui:Alert`: root gets `ps-alert`, the text next to the icon `ps-alert__content`; no outer margin any more (`$alert-margin-bottom: 0`, kit-wide), so `mb-0` on alerts and the `.ps-flash-messages > .alert` reset are gone. Long words break inside the box; links in a message take the alert link color.
- `ui:PasswordField`: new `label` prop, set by the form theme; the button name is "Show password: <label>" (was "Show password" for every field).
- Login pages: the submit buttons are `btn-primary w-100` (`ps-login__submit` removed); `ps-login__form-group--end` → `text-end`; `ps-login__form-actions` → `d-flex flex-column flex-sm-row justify-content-sm-end gap-2` (stacked in reading order on mobile, so focus follows what is seen); layout utilities replace the logo, copyright, social and back link styles. Forms carry `data-ps-action="submit-once"`.
- Forgot panel: new intro line `ps-login__intro`, linked to the email field. Reset page: "Back to sign in" link, and an empty `#<new password id>_policy` slot (`data-ps-target="password-policy-error"`). Required actions: a "Check again" button under the alert.
- Password checklist: items align their icon with the first line (`align-items-start`); the icon really gets its 1.125em size now (the icon font used to override it), so the tip indent is 1.375rem.
- Icon links (kit-wide): the icon is sized to the text (1.25em) and stays on the first line when the text wraps.

**Behaviour**
- A focused alert shows the kit focus ring.
- Kit, every page: a busy submit button (spinner, `aria-busy`, `aria-disabled`) on `submit-once` forms, and a second submit is ignored; after the server renders a form with errors, focus goes to the first invalid field, otherwise to the danger alert in the form; closing an alert moves focus to the next focusable element.
- Expired reset link and a failed reset-link email: back on the forgot password panel (`/login?forgot_password=1`), not the sign-in panel.
- Email check: on submit, then live once shown (no message on blur that moves the button being clicked).
- New password: red only once the field is left or a submit blocked, never while typing a first value or when empty; a submit blocked by the policy says "Choose a password that meets the requirements."

**Strings** (`Admin.Login.Feature`, `Admin.Login.Notification`, `Admin.Actions`)
- Send failure: "We couldn't reset your password. Try again later." → "We couldn't send the reset link. Try again later." (the reset failure keeps the former).
- "Rename the /admin folder, for example to %s" → "…%s." with the name in `<code>`; "Check your inbox." is bold.
- Server length errors "This field cannot be shorter/longer than %limit% characters" → "Use between %min% and %max% characters."
- New: "Enter your email address and we'll send you a link to reset your password.", "Check again", "Back to sign in", "Choose a password that meets the requirements.", "Show password: %label%".

**Old theme**
- `Login/reset_password.html.twig` and the Employee and Customer forms share the password handler: the invalid state also waits for the field to be left there.

## Login review 5: code contrast, button order, email error — 2026-11-04

**Markup**
- Kit alerts: `code` takes the alert text color (Bootstrap's pink was 3.88:1 on the warning tint).
- Required actions: the alert and the "Check again" button sit in a `d-flex flex-column gap-3` stack (was `d-grid`, whose column grew with the long folder name and overflowed the card at 375 px).
- Forgot panel: the stacked buttons on mobile follow the reading order (Cancel, then Send reset link), like the focus order.

**Strings** (`Admin.Notifications.Error`)
- Sign-in and forgot password email fields: "Invalid email address." (client) and Symfony's "This value is not a valid email address." (server) → "Enter a valid email address, like name@example.com." for both.


## Kit rules #30-32 on the login pages — 2026-11-05

Kit form theme (`ui_kit_layout.html.twig`), kit JS (`form-validation.js`, `load-focus.js`, was `server-error-focus.js`), login layout and pages, login form types.

**Markup**
- Every kit form gets `novalidate` and `validate` in its `data-ps-action` (a token list now: "submit-once validate"; kit selectors use `~=`).
- Email and password fields of kit forms: one client error slot, `#<id>_client_error` with `data-ps-target="client-error"` (was `data-ps-target="email-error"` on email fields only), linked by `aria-describedby`; its words come from the field's `data-required-message` / `data-invalid-message`.
- Login panels: `h1` gets `data-ps-ref="panel-title"`. Kit login pages: `<title>` is "<page title> • <shop name>" (was the shop name); the old theme keeps the shop name.

**Behaviour**
- No browser validation bubble on kit forms: an empty required field or a malformed email gets the kit message under the field on submit, then live while typing. `login-page.ts` no longer has its own email check.
- After a submit or a redirect, focus goes to the first field in error, otherwise to the first flash message of any type (was danger alerts only), so "Check your inbox" and "Your password has been changed" are read.
- Switching between sign in and forgot password updates the document title.

**Strings** (`Admin.Notifications.Error`)
- New: "Enter your email address.", "Enter your password.", "Enter a new password.", "Confirm your new password.", and the kit default "This field is required.". Server: `NotBlank` with the same words on the forgot password email and the new password.

## Stories in sync with the Twig components — 2026-11-05

**Markup**
- Alert story: controls named after the props (`type`, `icon`, `dismissible`, content; was `variant`, `message`), docs in the Twig usage / Props / Do-Don't / States form, new state with a first sentence in `<strong>` (no title prop: emphasis is message content).
- FlashMessages story: current alert markup (`ps-alert`, `ps-alert__content`), a `types` control, the info type.
- PasswordField story: a `label` control.
- `node ui/.ai/bin/story-parity.mjs` checks that every component prop is in its story; the lint CI runs it.

## Password filled without typing, alert line breaks — 2026-11-05

**Behaviour**
- Password strength and policy (reset page, Employee and Customer forms, the Employee change-password control): checked on `input` (was `keyup`), so a paste, a password manager, a suggested password or dictation is checked too; such a password was refused as not meeting the requirements.
- Alerts: `text-wrap: pretty`, so a short last word does not sit alone on its line.
- Busy buttons (kit-wide): `data-ps-state="loading"` on the button (set by `submit-once.js`, usable by any script) lays the spinner over the label, which stays in place with a transparent text fill, so the button keeps its size and the buttons beside it do not move (the spinner used to be inserted before the label and widen the button). Shown in the Button "States" story.

## Stories show their Twig code, checked against the components — 2026-11-06

**Markup**
- Every story of a `<twig:ui:*>` component (Alert, FlashMessages, PasswordField, Layout:Stack, Layout:Cluster, Layout:Tiles) shows its Twig call under the HTML in "Show code", and the controls table shows each prop's default.
- `StoryMarkupTest` renders each story's Twig code through the real component and fails when the story HTML differs; `node ui/.ai/bin/story-markup.mjs` rewrites its snapshot after a story or template change, and `story-parity.mjs` (lint CI) fails when the snapshot is stale or a story has no Twig code.

## Login pages on the layouts — 2026-11-06

`Layout/Ui/login_layout.html.twig`, `Login/Ui/{login,reset_password,required_actions}.html.twig`, `pages/_login.scss`, the login playground mockup.

**Markup**
- `.ps-login__container` and `.ps-login__card-body` are `<twig:ui:Layout:Stack>` (gap `xl` and `md`), `.ps-login__social` a `<twig:ui:Layout:Cluster>`, grouped with `.ps-login__copyright` in a new `.ps-login__footer` (`<twig:ui:Layout:Stack gap="lg">`); each form holds a header stack (title, flash messages, form errors, intro) and a fields stack inside a `gap="lg"` stack; the forgot password buttons are a `<twig:ui:Layout:Cluster stackBelow="sm">`. Classes, ids and `data-ps-*` hooks are kept.
- The `displayAdminLogin` hook moves from under the card into it, as the card body's last block in `.ps-login__modules` (top border), printed only when a module returns content. Module markup that relied on sitting outside the card now gets the card's padding and width.
- An emptied `<twig:ui:FlashMessages>` (last alert closed, or removed by the login script) is hidden, so it no longer leaves a gap in its layout.
- `.ps-login__form` no longer lays out its children (no grid); `.ps-login__title`, `.ps-login__intro`, `.ps-login__logo-big` and `.ps-login__copyright` have no margins (titles and intro get `mb-0`).

**Behaviour**
- Spacing on the gap scale: title to first field 2rem → 1.5rem, a flash message to the first field 1rem → 1.5rem, logo to title 0.75rem → 1rem, card to copyright 2rem → 3rem, copyright to social links unchanged (1.5rem), required actions title to alert 2rem → 1.5rem.

## Icons as SVG: `<twig:ui:Icon>` — 2026-11-12

`Twig/Component/Ui/Icon.php`, `Component/Ui/icon.html.twig`, `components/_icon.scss`, `ui/icons/`, and every kit icon: Alert, FlashMessages, PasswordField, the password requirements, the login layout.

**Markup**
- Kit icons are inline `<svg class="ps-icon …">` instead of `<i>`/`<span class="material-symbols-outlined">` (back link, password toggle, password requirements) or `<svg>` from `bi:*` files (alerts, flash messages, social links).
- `<twig:ui:Alert icon="…">` takes a Material Symbols name, shown filled: `bi:x-circle-fill` → `cancel`, `bi:check-circle-fill` → `check_circle`, `bi:exclamation-triangle-fill` → `warning`, `bi:info-circle-fill` → `info`. FlashMessages uses those four.
- `ui/icons/bi/` is removed; the social logos moved to `ui/icons/brand/` (`bi:github` → `brand:github`, also in the old theme's login layout).
- PasswordField icons: `fs-5 lh-1` → `ps-icon--xl`. Password requirements render three icons (`ps-password-feedback__icon--unmet`, `--met`, `--failed`) shown by the requirement's `data-ps-state`; the kit no longer has `data-ps-ref="password-requirement-icon"` (the old theme keeps it).
- `.icon-link` rules target `.ps-icon` instead of `.material-symbols-outlined`.

**Behaviour**
- Kit pages no longer download the Material Symbols font (3.96 MB): icons show with the first paint and do not shift the layout.
- Icon sizes follow the text (em): the password toggle icon is 21px (was 20px), the requirement icons 1.25em (was 1.125em), with the tip indent following.
- Icons are drawn at weight 600 (the old font was 400); alert and flash message icons are 1.25em (20px, was 16px).
- A missing icon name fails the render (Iconify fallback off) instead of being fetched from api.iconify.design.

**Old theme**
- Unchanged, apart from the social logos' new names.

## Buttons: `<twig:ui:Button>` — 2026-11-13

`Twig/Component/Ui/Button.php`, `Component/Ui/button.html.twig`, `button_widget` in `TwigTemplateForm/ui_kit_layout.html.twig`, `components/_buttons.scss`, the login pages.

**Markup**
- Kit form buttons (`SubmitType`, `ButtonType`, `ResetType`) render `<twig:ui:Button>`: the page passes `variant` (and `size`, `icon`) to `form_widget` instead of `btn-*` classes. Ids, names and `data-ps-*` attributes are unchanged.
- Sign in and Set new password lose their `.ps-login__form-group` wrapper and `w-100`: the stack makes them full width. "Forgot your password?", "Back to sign in" and "Check again" are `<twig:ui:Button>` with the same classes.
- A button with an icon is laid out by `.btn:has(> .ps-icon)` (flex, gap); a busy button hides its icon with its label.

- Icon links with the icon before the text take `icon-link-hover-start` (the login back link): on hover the icon moves toward the start of the line instead of the end. Icon links move with `translate` instead of `transform`.

**Behaviour**
- None visible on the login pages, apart from the back link's arrow, which now moves left on hover (right in right-to-left languages, where it also stays mirrored: the hover used to undo the mirroring).

## Links: `<twig:ui:Link>` — 2026-11-13

`Twig/Component/Ui/Link.php`, `Component/Ui/link.html.twig`, the login layout and the reset password page.

**Markup**
- The login back link is `<twig:ui:Link back>`: same classes (`icon-link icon-link-hover icon-link-hover-start`) and icon.
- The copyright link is `<twig:ui:Link external>`: it gains a visually hidden "(opens in a new tab)".
- "Back to sign in" (reset password page) is a plain link with `link-secondary small`, no longer `btn btn-link p-0`: same look, 2px shorter (no button border).
- The Helpers/Icon Link story is removed: Components/Link shows icon links.

**Strings** (`Admin.Global`)
- New: "(opens in a new tab)".

## Icon buttons: `<twig:ui:IconButton>` — 2026-11-13

`Twig/Component/Ui/IconButton.php`, `Component/Ui/icon_button.html.twig`, `components/_icon-button.scss`, `ui/src/js/components/tooltips.js`, the login layout.

**Markup**
- Login social links: `link-secondary d-flex … ps-login__social-link` → `<twig:ui:IconButton variant="link" size="sm">` (`btn btn-link btn-sm ps-icon-button link-secondary`); `.ps-login__social-link` is removed. Same `aria-label`, `target` and `rel`.
- `[data-bs-toggle="tooltip"]` elements get their Bootstrap tooltip on first hover or focus, on every kit page.

**Behaviour**
- Login social links: 31px squares (were 32px), icons 17.5px (were 16px), the button focus ring.
- A tooltip that repeats its element's `aria-label` is not linked with `aria-describedby`, so screen readers read it once.

## Main menu: `<twig:ui:SideMenu>` — 2026-11-13

`Twig/Component/Ui/SideMenu.php`, `Component/Ui/side_menu.html.twig`, `components/_side-menu.scss`, `NavBar::getSections()`, `Component/Layout/nav_bar.html.twig` (kit branch in `Component/Layout/Ui/nav_bar.html.twig`).

**Markup**
- With `PS_UI_KIT=1`, Symfony pages render `<nav id="ps-side-menu" class="ps-side-menu offcanvas-md offcanvas-start">` instead of `nav.nav-bar`: `.main-menu`, `.link-levelone`, `.link-leveltwo`, `.category-title`, `.has_submenu`, `#tab-*`, `#subtab-*`, `#collapse-*`, `.menu-collapse` and the logo block are gone. Hooks for scripts and tests: `aria-current="page"` on the current link, `aria-expanded` on submenu buttons.
- A parent row is a `<button>` that opens its submenu; it is no longer a link to its first sub-page.
- `displayAdminNavBarBeforeEnd` keeps its place at the end of the menu.
- Legacy (Smarty) pages keep the old menu.
- Kit CSS: `.sidebar`, `.sidebar-heading`, `.sidebar-toggle`, `.sidebar-subnav` (`layout/_sidebar.scss`) are removed; the Components/Sidebar story is replaced by Components/SideMenu, the playground menu uses `ps-side-menu`.

**Behaviour**
- No collapsed mode yet (icons only): the menu is always expanded from md up, a drawer below md.
- Tab icons without an SVG file show `extension`; `assessment` and `payment` show `analytics` and `credit_card`.
- Core tabs take the kit icons of the playground menu, by class name in `NavBar` (the `tab` table and the old theme keep theirs): Dashboard `home` (was `trending_up`), Customers `group` (`account_circle`), Customer service `support_agent` (`chat`), Stats `monitoring` (`assessment`), Design `palette` (`desktop_mac`), Payment `payments` (`payment`), International `public` (`language`), Advanced parameters `tune` (`settings_applications`). Module tabs keep their icon.
- Items without children and sub-items take an optional `badge` (`{label, logo}`; refused on a parent): a pill after the label, with the PrestaShop mark (`brand:p-monogram`) when `logo` is true. Shown in Storybook only: `NavBar` does not pass badges yet.

**Strings** (`Admin.Navigation.Menu`)
- New: "Main menu".

## Dropdowns: `<twig:ui:Dropdown>` and `<twig:ui:DropdownMenu>` — 2026-11-16

`Twig/Component/Ui/Dropdown.php`, `DropdownMenu.php`, `Component/Ui/dropdown.html.twig`, `dropdown_menu.html.twig`, `components/_dropdown-menu.scss`.

**Markup**
- Trigger: a `<twig:ui:Button>` with a `keyboard_arrow_down` (or `_up`) icon, or a `<twig:ui:IconButton>`; no `.dropdown-toggle` class, so no icon-font caret.
- Menu: `ul.dropdown-menu.ps-dropdown-menu`, items `dropdown-item ps-dropdown-menu__item` with `ps-dropdown-menu__icon` and `ps-dropdown-menu__label`; the chosen item has `aria-current="true"` (styled like Bootstrap's `.active`, without the class), a disabled link loses its `href`; an external link says "(opens in a new tab)".
- The Components/Dropdown story (Bootstrap examples) is replaced by the component story; Components/DropdownMenu is new.

**Behaviour**
- Menus are at most 20rem wide: long labels wrap instead of stretching past the screen.

## Header: `<twig:ui:Header>` and `<twig:ui:HeaderAction>` — 2026-11-16

`Twig/Component/Ui/Header.php`, `HeaderAction.php`, `Twig/Component/Header.php` (feeds it), `Component/Ui/header.html.twig`, `header_action.html.twig`, `Component/Layout/Ui/header.html.twig`, `Layout/default_layout.html.twig`, `components/_header.scss`, `components/_header-action.scss`, `ui/src/js/components/header-search.js`.

**Markup**
- With `PS_UI_KIT=1`, Symfony pages render `<header class="ps-header">` in a `ps-layout` grid (header, side menu, `main.ps-layout__content`) instead of `#header`, `#header_infos`, `.main-header`, `#header_logo`, `#shop_version`, `#header_search`, `.component-search`, `#header-employee-container`, `.employee-dropdown`, `#header_logout`, `.mobile-layer`.
- Search: the field keeps `name="bo_query"` and posts to AdminSearch; the type picker is a `<twig:ui:DropdownMenu>` of buttons filling the hidden `bo_search_type` (hooks `data-ps-ref="header-search"`, `header-search-type`, `header-search-input`, `header-search-scope`, `data-ps-action="set-search-type"`). Below md it is a panel sliding from the top (`#ps-header-search`, Bootstrap offcanvas-md).
- Header entries are `<twig:ui:HeaderAction>`: debug mode, maintenance mode, View my shop, the employee menu (a `<button>`, not a `div`, opening a `<twig:ui:DropdownMenu>`). Modules writing to `displayBackOfficeTop` can render the same entry.
- `displayBackOfficeEmployeeMenu` links become menu items between "Your profile" and "Sign out"; an icon with no SVG file is left out. `displayBackOfficeTop` keeps its place at the end of the bar.
- Not on kit pages until their kit version: the multistore bar (quick access and notifications: see their own entries). The kit build (`theme-ui.ts`) no longer runs the old `NavBar` and `Header` scripts nor `components/header/search-form`.
- Kit CSS: `layout/_header.scss` (playground classes, icon font) is replaced by the component partials. Dropdown menus are as wide as their longest label (`width: max-content`, still at most 20rem). Side menu section headings start with a small `oceanblue-500` bar that marks each group. Their text is 14px (`$dropdown-font-size`), items are 30px high in a .5rem inset (`$dropdown-item-padding-y`, `$dropdown-padding-x|y`), their icons use the tertiary text color at rest, the label color when hovered, focused, chosen or disabled.
- The version is a `<twig:ui:Badge variant="oceanblue">` (`#shop_version` → `.ps-header__version`); search types show their icon as before. Everything on the dark bar (logo, field, type picker, submit, entries) has the same focus ring, the buttons' ring in white at 50% after a gap the color of the bar; its menus keep the default one. Like a Bootstrap button, hover lightens, pressed (`:active`) or open lightens more, keyboard focus adds the ring. The logo has the ring only, no hover or pressed state. The search field and its two buttons sit on a background 10% lighter than the bar (`--psk-header-search-bg`, 15% on hover and focus, 20% pressed or open); the field's clear button is a close icon in the text color.
- Storybook: Components/Header and Components/HeaderAction are new; Playground/Pages/Home is now Playground/Layout/Page, the playground header uses the new markup. Story Twig code writes array and object props as Twig literals (`{label: 'Edit'}`).

**Behaviour**
- Below md: a menu button opens the side menu, a search button opens the search panel and focuses the field; actions show their icon only (label kept for screen readers) until lg.
- Debug and maintenance modes are amber icon buttons (`<twig:ui:HeaderAction warning iconOnly>`); their tooltip, below the bar, has the mode as a bold title then what it means; their link goes to the page that turns them off. View my shop is an icon button (`iconOnly`) with its name in the tooltip. Icon buttons of the bar and the search button are square.
- The employee menu shows the first name and the last name's initial ("Marc B."); the menu opens on the full name (a `dropdown-header`).
- Between md and xl the search type button shows the chosen type's icon instead of its label (which stays its name for screen readers); elsewhere the label alone. Everywhere takes `all_inclusive`, not `search`, which the search button already shows, updated by `header-search.js` (`data-ps-ref="header-search-scope-icon"`).

**Strings** (`Admin.Navigation.Header`, `Admin.Navigation.Notification`)
- "What are you looking for?" → "Products, orders, customers…"
- "Product name, reference, etc." → "Product name or reference"
- "Name" (customer search placeholder) → "Customer name"
- "Customers" + "by name" / "by ip address" (concatenated) → "Customers by name", "Customers by IP address"
- "Searchbar", "SEARCH" → "Search"
- "Your shop is in debug mode." + "All the PHP errors and messages are displayed. When you no longer need it, [1]turn off[/1] this mode." → "All PHP errors and messages are shown. Turn debug mode off when you no longer need it."
- "Your store is in maintenance mode." + "Your visitors and customers cannot access your store while in maintenance mode." + "To manage the maintenance settings, go to Shop Parameters > Maintenance tab." → "Your shop is closed to visitors and customers. Turn maintenance mode off when you are ready."
- "Admins can access the store front office without storing their IP." → "Signed-in employees can still see it."
- "View my store" → "View my shop" (the old pages keep "View my store" until they move to the kit)
- New: "Open the menu", "Search in".

## Badge: `<twig:ui:Badge>` — 2026-11-16

`Twig/Component/Ui/Badge.php`, `Component/Ui/badge.html.twig`, `components/_badge.scss`.

**Markup**
- `<span class="badge ps-badge ps-badge--{variant}">`, variants `primary`… `dark` (subtle background, emphasis text) and the kit palette colors `oceanblue`, `purple`, `amber` (subtle background, 800 text); `ps-badge--pill`, `ps-badge--counter`, `ps-badge__icon`. Square corners unless `pill`. Font size and padding are in em (`$badge-font-size: .75em`, `$badge-padding-y|x: .25em .5em`, were `.875em` and `.5rem .75rem`): a badge follows the text around it; a counter keeps its rem size.
- Kit CSS: `.badge-counter` → `.ps-badge--counter` (used by no page yet).

## Modal: `<twig:ui:Modal>` — 2026-11-16

`Twig/Component/Ui/Modal.php`, `Component/Ui/modal.html.twig`, `components/_modal.scss`.

**Markup**
- `<div id="{id}" class="modal fade ps-modal" aria-labelledby="{id}-title">` with an `h2.modal-title.ps-modal__title` (level set by `headingLevel`), a named close button (`.btn-close`, "Close"), `.modal-body` and an optional `.modal-footer` (block `footer`). Sizes `sm`, `md`, `lg`, `xl`, `fullscreen`; centred by default; `scrollable`; `static` adds `data-bs-backdrop="static"`; `closable: false` adds `data-bs-keyboard="false"` and drops the close button.
- Kit CSS: the title is `$h5-font-size`, semibold; the header is Bootstrap's own (the close button centred on the title), its cross drawn smaller (`background-size: .75em`) in the same 32px box.
- Cancel in a dialog footer is a `link` button (quick access dialogs, Modal stories).
- No `centered` prop any more: every dialog is vertically centred.
- `headingLevel` is not set by default (was 2): the title is a `<p class="modal-title">`, not a heading of the page, still the dialog's name through `aria-labelledby`; pass 2 to 6 to make it a heading.
- New props `icon` (a round tinted badge before the title) and `variant` (`info` light blue, `success` green, `danger` red; only with an icon, none means `info`): `ps-modal__icon`, `ps-modal__icon--{variant}`. The quick access dialogs take `bookmark_add` (info) and `bookmark_remove` (danger, now at the default width).
- 24px around header, body and footer (`$modal-inner-padding: 1.5rem`), no lines between them (`$modal-header-border-width`, `$modal-footer-border-width`: 0); close buttons are darker (`$btn-close-opacity: .85`, 1 on hover), in dialogs and dismissible alerts.
- Storybook: Components/Modal is rebuilt on the component (it showed raw Bootstrap markup).

**Behaviour**
- Bootstrap modal: focus moves in and stays in, Esc closes it (unless not closable), focus goes back to what opened it.

## Quick access in the kit header — 2026-11-16

`Component/Layout/Ui/quick_access.html.twig` (kit branch of `Component/Layout/quick_access.html.twig`), `Component/Layout/Ui/quick_access_modals.html.twig`, `ui/src/js/components/quick-access.js`, `<twig:ui:Header>` block `start`, `<twig:ui:HeaderAction>` prop `align`.

**Markup**
- With `PS_UI_KIT=1`, quick access follows the logo: a `<twig:ui:HeaderAction>` menu (`data-ps-ref="quick-access"`, icon `bookmarks`) instead of `#quick-access-container`, `.quick-accesses`, `#quick_select`, `.quick-row-link`, `#quick-add-link`, `#quick-remove-link`, `#quick-manage-link`, `.js-quick-link`. Shortcuts carry `data-ps-ref="quick-access-link"` (the current page `aria-current="true"`); actions `data-ps-action="add-quick-access"`, `remove-quick-access`.
- The dialogs are `<twig:ui:Modal>` at the end of the page: `#ps-quick-access-add` (`data-ps-ref="quick-access-add"`, form `quick-access-add-form`, fields `quick-access-name`, `quick-access-new-tab`, error `quick-access-error`) and `#ps-quick-access-remove` (`data-ps-action="confirm-remove-quick-access"`), instead of `#quick-access-add-modal` and the `ConfirmModal` built by `header.ts`.
- Below sm, the PrestaShop mark (`brand:p-monogram`, named "PrestaShop") replaces the logo, so the bar keeps its buttons on one line at 375px.

**Behaviour**
- Same endpoints and data as before (`admin_quick_accesses_ajax_add|delete`, or AdminQuickAccesses without the feature flag). Adding or removing rebuilds the shortcuts in place, without reloading; the result is announced (`role="status"`) and focus goes back to the quick access button.
- An empty name is stopped by the kit form check (`data-ps-action="validate"`); a server error shows in the dialog.

**Strings** (`Admin.Navigation.Header`, `Admin.Actions`)
- "Quick Access" → "Quick access"
- "Add current page to Quick Access" → "Add this page to quick access"
- "Remove from Quick Access" → "Remove this page from quick access" (menu), "Remove from quick access?" (dialog title)
- "Manage your quick accesses" → "Manage quick access"
- "Add to Quick Access" → "Add to quick access"
- "Shortcut name is required" → "Enter a name for the shortcut."
- "Open in new window" → "Open in a new tab"
- "Are you sure you want to remove "%name%" from Quick Access?" → ""%name%" will no longer be in your quick access."
- Save → Add (the add dialog's button)
- New: "This page is now in your quick access.", "This page is no longer in your quick access."

## Notifications in the kit header — 2026-11-16

`Component/Layout/Ui/notifications_center.html.twig` (kit branch of `Component/Layout/notifications_center.html.twig`), `ui/src/js/components/notifications.js`, `components/_notifications.scss`, `Component/Ui/header.html.twig`.

**Markup**
- With `PS_UI_KIT=1`, the bell is an icon button of the header (`data-ps-ref="notifications"`, toggle `notifications-toggle`) with a `<twig:ui:Badge counter>` total (`notifications-total`), opening a panel: a row of filters that are tabs of the list (`role="tablist"`, each `role="tab"` `data-ps-action="filter-notifications"`, All then one per kind, the shown one `aria-selected="true"`, counts `notifications-count`; the list and empty state are their `role="tabpanel"`, `notifications-panel`), one list (`notifications-list`, grouped by kind under All, each group heading with the side menu's blue mark: `ps-heading-mark()` in `scss/_mixins.scss`, shared with `.ps-side-menu__heading`) and one empty state (`notifications-empty`, its sentence from the pressed filter, a kind's tip `notifications-empty-tip`). See DECISIONS.md #36 for kinds added by modules later. Gone: `#notif`, `.notification-center`, `.js-notification`, `#notifications-total`, `#orders-tab`, `#_nb_new_orders_`, `.notification-elements`, the `<script type="text/html">` templates.
- Kept for modules: `#header-notifications-container` on the bell, and `#header_infos` on the header actions. AskAI mounts its app in `#header_infos` and its button before `#header-notifications-container`: without them it does not show on kit pages.

**Behaviour**
- Keyboard, as tabs: Tab reaches the selected filter then the list; ←/→ move to the previous or next filter and show it (wrapping, reversed right to left), Home and End to the first and last. An empty panel takes the focus itself.
- Same endpoints as before (`admin_common_notifications`, `admin_common_notifications_ack`): loaded on page load, every two minutes and when the panel closes; the kinds shown while it was open are marked seen when it closes, and it opens again on All.
- Module entries (`displayBackOfficeTop`) come first in the header actions, in `.ps-header__modules` (`display: contents`) which keeps the old `.header-list.component` classes: AskAI puts its button before it.
- Lines are built with the DOM (no HTML from the server), linking to the order, the customer or the thread.

**Strings** (`Admin.Navigation.Notification`)
- "No new order for now :(" → "No new orders."
- "No new customer for now :(" → "No new customers."
- "No new message for now." → "No new messages."
- "Registered on:" + date → "Registered on %date%"
- Empty tips, kit only (the old theme keeps its own): "Have you checked your [1][2]abandoned carts[/2][/1]?[3]Your next order could be hiding there!" → "Check your [1]abandoned carts[/1]: your next order may be waiting there."; "Are you active on social media these days?" → "Share your shop on social media to bring in new customers."; "Seems like all your customers are happy :)" → "Your customers have no questions for now."
- Message status: the raw value (open, pending1…) → the Customer service labels "Opened", "Closed", "Pending 1", "Pending 2" (`Admin.Catalog.Feature`, existing)
- New: "Notifications", "Messages", "Filter notifications" (the filters' group name), "Nothing new for now."

## Buttons: the secondary is drawn like the primary's outline — 2026-11-16

`components/_buttons.scss`, DECISIONS.md #37.

**Markup**
- None: buttons keep `btn-secondary`.

**Behaviour**
- `<twig:ui:Button>` defaults to `primary` (was `secondary`): a button alone is the action of its area; pass `variant="secondary"` for the others. `<twig:ui:IconButton>`, `<twig:ui:Dropdown>` and non-submit form buttons stay `secondary` by default.
- Kit `btn-secondary` buttons (the default of `<twig:ui:IconButton>` and `<twig:ui:Dropdown>`: Cancel in the quick access dialogs and in the forgot password form, which used `outline-secondary` and now takes the default; dropdown triggers) are transparent with a black border and text, with a light grey background on hover and focus, instead of a grey fill. Screenshot tests of kit pages need new references.
- `outline-secondary` is lighter, a step below `secondary`: the fields' light border (`$border-color`) and grey text (`tint-color($gray-600, 10%)`, #6e6e6e, 5.1:1), a light grey background on hover, focus and press instead of a dark grey fill (2026-11-17).
- `link` buttons take the same weight as the others (`$btn-font-weight`, was normal).

## Switch: larger, green when on — 2026-11-16

`_variables.scss` (`$form-switch-width`, `$form-switch-color`, `$form-switch-focus-color`, `$form-switch-checked-color`, `$ps-form-switch-off-bg`, `$ps-form-switch-off-border-color`), `forms/_form-check.scss`.

**Markup**
- None: Bootstrap's `.form-switch` markup.

**Behaviour**
- Kit switches are 2.5em × 1.25em (were 2em × 1em), centred on the label's first line, a white knob; off: a dark grey track (`$gray-700`, 10.6:1 against the page); on: a green one (`--psk-success`, 5:1). Checkboxes, radios and switches take the buttons' focus ring (`$form-check-input-focus-box-shadow`: a 2px gap in the page color, then the ring). Screenshot tests of kit pages with a switch need new references.


## Alert: the type's colors, borderless — 2026-11-17

`Twig/Component/Ui/Alert.php`, `Component/Ui/alert.html.twig`, `_variables.scss` (`$ps-alert-colors`), `components/_alert.scss`.

**Markup**
- New prop `borderless` (default `false`): adds `ps-alert--borderless` after `alert-{type}`; the border is transparent, the alert keeps its size.

**Behaviour**
- Light mode, types `primary`, `secondary`, `success`, `info`, `warning`, `danger` (set through Bootstrap's `--psk-alert-*` variables from `$ps-alert-colors`):
  - the text and its links are in the body color (were the type's dark emphasis color);
  - the background is the palette's 50 shade (lighter than `-bg-subtle`);
  - the border is the type's color (was the light `-border-subtle`);
  - the icon is in the type's color (`--ps-alert-icon-color`); warning alerts are orange (new `$orange` scale, Bootstrap's `#fd7e14`; were yellow), their icon `$orange-600`, since the 500 orange is under 3:1 on its tint.
- Dark mode keeps Bootstrap's background and border, the icon takes the type's `-text-emphasis`. `light` and `dark` alerts are unchanged.
- Screenshot tests of kit pages with an alert need new references.
- Kit pages need no change: the login, password reset and required actions pages, form errors and flash messages use `<twig:ui:Alert>` and take the new colors. The quick access error alert gets the `cancel` icon like every other danger alert; its message goes into a new `data-ps-ref="quick-access-error-message"` inside it (the alert itself keeps `quick-access-error`).
- An alert with an icon carries `ps-alert--icon` instead of the `d-flex align-items-start gap-2` utilities (same layout): the utility's `!important` display beat `hidden`, so a hidden alert with an icon showed empty (the quick access error).
- `<twig:ui:Badge>` defaults to `variant="primary"` (was `secondary`). Every badge in the back office sets its variant, so none changes; a module badge without one turns from grey to the primary color.
- `<twig:ui:IconButton>`: new prop `tooltipPlacement` (`top`, `bottom`, `start`, `end`; default `top`; only with `tooltip`), rendered as `data-bs-placement` (`start` → `left`, `end` → `right`, which Bootstrap swaps in right-to-left languages); nothing is added for `top`.
- `<twig:ui:IconButton>` defaults to `primary` (was `secondary`), like `<twig:ui:Button>`. Kit pages are unchanged: the login links pass `link`, `<twig:ui:Dropdown>` passes its own variant (still `secondary`).
- `<twig:ui:Dropdown>` defaults to `primary` too (was `secondary`); no kit page relied on it.
- Icon story: the `filled` control works for every icon of the story (it only knew 4 filled files and broke on the others) and is ignored for brand logos; the Default story starts on `info`, whose filled style shows. The docs say line icons (`arrow_back`, `add`, `search`) look the same filled.
- Storybook: a Direction switch in the toolbar (Left to right / Right to left) sets `dir` on the preview page, so `flipRtl` and the kit's logical properties can be checked in RTL on any story. Bootstrap's own physical utilities do not flip with it: `ui.css` is Bootstrap's left-to-right build (DECISIONS.md #4, RTL later).
- Layouts in BEM (DECISIONS #38): `<twig:ui:Layout:Stack>`, `Cluster` and `Tiles` render their own classes instead of Bootstrap utilities: the block, then a modifier per prop away from its default (`ps-stack--gap-lg`, `ps-stack--align-start`, `ps-cluster--justify-between`, `ps-cluster--align-baseline`, `ps-cluster--nowrap`, `ps-cluster--stack-below-sm`, `ps-tiles--gap-sm`; `--list` when rendered as `ul`/`ol`, replacing `list-unstyled mb-0`). New `layout/_stack.scss` and `_cluster.scss`, `_tiles.scss` gets its gaps; one gap scale `$ps-layout-gaps` (`_variables.scss`, `Gap.php`). A layout resets the block margins of its direct children, so the `mb-0` on the Login titles and intro are gone. Same rendering (checked on the sign-in page). Anything that selected `d-flex`, `gap-*`, `flex-*` or `align-items-*` on these layouts must use their BEM classes.
- Header and side menu, after a UI review (the header now fits a 320px phone without per-width rules):
  - `<twig:ui:Header>`: no `version` prop and no `start` block any more; its blocks are `search` and `actions`.
  - The page shell's actions are all icon only, in this order: the shop state, then quick access, notifications and the employee menu.
  - Shop state: while debug or maintenance mode is on, one amber `<twig:ui:HeaderAction icon="warning" warning iconOnly>` menu, first. Each mode that is on is a link to where it is turned off, followed by what it means as a `text` item. It replaces the two amber squares. New string: "Shop state".
  - Quick access leaves the `start` block for the end of the bar, `iconOnly`; its menu does not change.
  - `<twig:ui:HeaderAction>`: `iconOnly` works on a menu too: a square, no arrow, the label its name for screen readers and in a tooltip on hover or focus, hidden while the menu is open (`tooltips.js`: the tooltip is asked for with `data-ps-action="tooltip"` on the `.dropdown` box, not on the toggle, as Bootstrap 5 keeps one component per element: a tooltip on the toggle left its menu unable to close on an outside click).
  - View my shop and the version leave the header for `<twig:ui:SideMenu>`: new `shopUrl` and `version` props, one row pinned under the menu (`ps-side-menu__footer`): View my shop (new tab, `ps-side-menu__external` icon), then the version badge, read "PrestaShop 9.3.0". The side menu is now a flex column: the body scrolls under the footer and fades just above it.
  - Menu `text` items (`dropdown-item-text` in `ps-dropdown-menu`) are smaller and grey: they explain the item above them.
  - The playground header, sidebar and page mockups show the new shell. Screenshot tests of kit pages need new references.
  - After the shell screen review (`ui/.ai/reviews/shell.json`):
    - Quick access: the remove dialog names the shortcut alone (`data-ps-data-name` on each link), not its hidden "(opens in a new tab)"; a failed removal shows a danger alert (announced) above the question instead of replacing it; Add and Remove stay focusable while they wait (busy spinner, `aria-busy`, `setButtonBusy()` exported from `submit-once.js`) instead of being disabled, which dropped the keyboard focus. The dialogs lay out their content with `<twig:ui:Layout:Stack>` (no `mb-3` / `mb-0`).
    - New `ps-scroll-fade` (`_scroll-fade.scss`, `scroll-fade.js`, story Helpers/Scroll Fade): on a box that scrolls (`ps-scroll-fade--x` or `--y`, with `data-ps-action="scroll-fade"`), an end fades out while content is hidden there and fades back in once scrolled to it (`data-ps-state` `more-before` / `more-after`, a mask, the box's borders never fade, RTL, reduced motion). Used by the notification filters and list and by the side menu body, whose footer loses its fixed gradient: the menu now fades only while links are hidden below.
    - Notifications: one list per kind, named by its heading under All (`ps-notifications__items`, `aria-labelledby`), instead of `role="presentation"` headings inside the list (axe "list"); the list box is a `div` without utilities. The bell's count is smaller (`1rem`, `.625rem` text) so the bell stays visible.
- `<twig:ui:HeaderSearch>` on phones: the search type and search buttons keep the field's border on hover and press (a `.btn` without variant made it transparent, showing the white panel) and take the light grey hover of the secondary buttons; from md up, on the dark bar, their states are set the same way (`--psk-btn-*` variables instead of hover, active and focus rules, which Bootstrap's `.btn:first-child:active` outranked).
- `<twig:ui:HeaderSearch>` on phones: the panel has a close button (Bootstrap `btn-close`, below md only, `data-bs-target` as `offcanvas-md` is not the `.offcanvas` Bootstrap looks for); the search type shows its icon below xl (was between md and xl only), so the field keeps the width.
- `<twig:ui:Modal>` is `scrollable` by default (was not): a long body scrolls inside, the title and the buttons stay in view; `:scrollable="false"` for the old behaviour. The quick access dialogs get `modal-dialog-scrollable`; their content is short, so they look the same.
- New `<twig:ui:HeaderSearch>` (`HeaderSearch.php`, `header_search.html.twig`, `_header-search.scss`, a story): the header search, taken out of `<twig:ui:Header>`. Its props are the old `search` keys: `action`, `query`, `type`, `types`. Same markup and behaviour; its classes move from `ps-header__search*` to their own block: `ps-header-search`, `__form`, `__input`, `__scope`, `__scope-icon`, `__scope-label`, `__submit`, `__toggle`. The `data-ps-ref` hooks and `#ps-header-search` do not change.
- `<twig:ui:HeaderSearch>`: `types` is required, with at least one type, as the back office always gives them; the search without a type menu (and its "Search" placeholder) is gone.
- `<twig:ui:Header>`: no `search` prop any more; three named blocks, each optional: `start`, `search` (a `<twig:ui:HeaderSearch>`), `actions` (was the unnamed content, which is no longer shown). The page shell (`Component/Layout/Ui/header.html.twig`) uses them.
- `<twig:ui:Header>`: the version, the quick access and the search are always shown, as on every back office page: `version` is required, the `.ps-header__start` box is always rendered, and the story without search and version is gone.
- `.ps-header-action__label` is cut at `6rem` (was `12rem`), from lg up: a long label or employee name ends with an ellipsis sooner; screen readers still read it whole.
- The employee menu is its own component again, like the notifications: `EmployeeDropdown` (the old header's) renders `Component/Layout/Ui/employee_dropdown.html.twig` on kit pages and gives it the employee and the module links (`getModuleItems()`, moved from `Header.php`, which now only reads the search). Same markup as before, except the avatar class: `ps-header-action__image` → `ps-employee-dropdown__avatar` (`_employee-dropdown.scss`); the root gets the old header's id `header-employee-container`.
- `<twig:ui:HeaderAction>`: no `image` prop any more, `icon` is required. The avatar, sent by the core, was the only picture, and only the employee menu needs it.
- `<twig:ui:DropdownMenu>`: `items` is optional. Without it, the menu holds its content, any markup (a short form, text), in a `<div class="dropdown-menu ps-dropdown-menu ps-dropdown-menu--content">` with Bootstrap's dropdown padding variables set to `$spacer` and a 16rem minimum width; a trigger around a form takes `data-bs-auto-close="outside"`. New item type `text` (`dropdown-item-text`), a line of plain text. The "no form inside the menu" rule of its docs is now "no long form".
- The menu and search toggles share the `ps-header-bar-button` mixin (`_mixins.scss`).
- Story Twig code binds numbers (`:type="3"`, `:headingLevel="3"`) instead of passing them as text.

## Button: busy state, label — 2026-11-20

`Component/Ui/button.html.twig`, `Button.php`, `ui/src/js/components/busy-button.js` (new), `submit-once.js`, `quick-access.js`, `_buttons.scss`. From the `ui-component-review` of Button.

**Markup**
- Every `<button>` rendered by `<twig:ui:Button>` (so `IconButton`, `Dropdown` toggles and kit form buttons too) carries `data-ps-data-busy-label` (the translated "Loading..."), read by `busy-button.js`.
- A busy button ends with `<span class="visually-hidden" role="status" data-ps-ref="busy-status">Loading...</span>`, as Bootstrap's loading buttons.
- Every kit button gets the `ps-button` BEM block beside Bootstrap's classes (`btn btn-primary ps-button`; `IconButton`: `… ps-button ps-icon-button`). Beside an icon, the label is wrapped in `<span class="ps-button__label">` (also the `Dropdown` text trigger).
- A busy button no longer has `aria-busy`: it made screen readers hold back the status inside the button. The busy state is `data-ps-state="loading"` with `aria-disabled="true"`.
- `setButtonBusy` moved from `submit-once.js` to `busy-button.js`.

**Behaviour**
- A busy button ignores clicks, Enter and Space: before, only the pointer was blocked.
- Screen readers hear "Loading..." when a button becomes busy.
- `<twig:ui:Button>` without text and without `aria-label` throws: an icon alone is `<twig:ui:IconButton>`.
- A label with no space to break at wraps instead of overflowing; a wrapped label stays against its icon.

**Strings**
- `Loading...` (`Admin.Global`), existing string.

## No dark mode in the kit — 2026-11-20

`ui/src/scss` (`_variables.scss`, `_maps.scss`, `main.scss`, `components/_buttons.scss`, `_alert.scss`, `_accordion.scss`, `_card.scss`, `forms/_form-select.scss`), `ui/.storybook/preview.js`. Applies `DECISIONS.md` #5.

**Markup**
- `ui.css` no longer reacts to `data-bs-theme="dark"`: `$enable-dark-mode: false`, the kit's dark rules and `_variables-dark.scss` are removed. Bootstrap's own `.navbar-dark` / `.navbar[data-bs-theme=dark]` component still works.

**Behaviour**
- Storybook has no Light/Dark switch anymore.

## Announcer — 2026-11-20

`Ui/announcer.html.twig` (`<twig:ui:Announcer>`), `ui/src/js/components/announcer.js`, `Layout/default_layout.html.twig`, `Layout/Ui/login_layout.html.twig`, `busy-button.js`, `quick-access.js`.

**Markup**
- New: one `<div class="visually-hidden" role="status" aria-atomic="true" data-ps-target="announcer">` at the end of `<body>` on kit pages (shell and sign-in pages), empty until a script writes in it.
- Button rendered busy: the hidden "Loading..." text has no `role="status"` any more, and its hook is `data-ps-ref="busy-text"` (was `busy-status`). A button made busy by a script gets no status inside it.
- Quick access: the hidden `data-ps-ref="quick-access-status"` region is removed; its two messages are `data-ps-data-added` / `data-ps-data-removed` on `data-ps-ref="quick-access"`.

**Behaviour**
- Scripts tell screen readers what changed with `announce(message)`, or `document.dispatchEvent(new CustomEvent('ps:announce', {detail: {message}}))` outside the kit bundle (new-theme pages, modules). The same message twice is said twice.
- A button made busy by a script says "Loading..." through the announcer; adding or removing a quick access page says its result through it.

## No icon font in the kit — 2026-11-20

`_custom.scss`, `_fonts.scss`, `_variables.scss`, `components/_breadcrumb.scss`, `_buttons.scss`, `_pagination.scss`, `components/_dropdown.scss` (removed), `ui/package.json`.

**Markup**
- Removed: the `.icon`, `.icon-filled`, `.icon-sm`, `.icon-lg` and `.material-symbols-outlined` classes, the `--icon-fill` / `--icon-wght` / `--icon-grad` / `--icon-opsz` variables and the Material Symbols font itself (`@font-face`, npm `material-symbols`). Icons are `<twig:ui:Icon>` SVGs only (`DECISIONS.md` #35); a module still writing `<span class="icon">name</span>` on a kit page shows the icon's name as text.
- Pagination arrows: `.ps-icon` instead of `.icon`.

**Behaviour**
- Breadcrumb divider: an SVG chevron (`$breadcrumb-divider`), pointing left in right-to-left pages; it was a font glyph.
- A raw Bootstrap `.dropdown-toggle` shows Bootstrap's own caret again (it was a font glyph); `<twig:ui:Dropdown>` keeps its SVG arrow.

## Button: busyLabel — 2026-11-20

`Ui/button.html.twig`, `Button.php`, `IconButton.php`, `Ui/icon_button.html.twig`.

**Markup**
- New prop `busyLabel` on `<twig:ui:Button>` and `<twig:ui:IconButton>` (not with `href`): what screen readers hear while the button is busy, in `data-ps-data-busy-label` and, rendered `loading`, in the hidden `busy-text`. Default unchanged: "Loading..." (`Admin.Global`). Pages pass a translated string ("Installing...") instead of setting the attribute.

## Alert: review fixes — 2026-11-20

`Ui/alert.html.twig`, `Alert.php`, `components/_alert.scss`, `flash_messages.html.twig`, `ui_kit_layout.html.twig` (form_errors), `Login/Ui/required_actions.html.twig`, `load-focus.js`, `alert-dismiss-focus.js`, `selectors.js`.

**Markup**
- The message is always in `<div class="ps-alert__content">`, with or without an icon. Its last paragraph or list has no bottom margin: callers drop `mb-0` (flash messages, form-level errors, required actions).
- `danger`, `warning`, `success` and `info` show their status icon when none is given (`cancel`, `warning`, `check_circle`, `info`); the icon of a status type is `role="img"` with the type as its name ("Error", "Warning", "Success", "Information"), no longer `aria-hidden`.
- Types `light` and `dark` are removed (they were outside the kit's alert colors).
- Form-level error alert: `data-ps-ref="form-error"`; load-focus.js finds it by this hook instead of `form [role="alert"]`.
- The wrapping, link, `<code>` and focus rules apply to `.ps-alert` only, no longer to every `.alert` on the page.

**Behaviour**
- Screen readers hear the type before the message ("Error, The email address or password is incorrect.").
- A focused alert (load-focus.js) has Bootstrap's focus ring and a transparent outline, so forced-colors mode shows where the focus is.

**Strings** (`Admin.Global`)
- New in the alert: "Error", "Information", "Success" ("Warning" already exists).

## Page head, showcase modal, mobile shell — 2026-11-20

`Component/Layout/toolbar.html.twig` (kit branch `Layout/Ui/toolbar.html.twig`), `<twig:ui:PageHead>`, `<twig:ui:ShowcaseModal>`, `Toolbar.php`, `Layout/default_layout.html.twig`, `Common/Grid/grid_panel.html.twig`, the 9 showcase card partials, `side_menu.html.twig`, `showcase-modal.js`.

**Markup** (kit pages only)
- The page head is `<header class="ps-page-head">`: no `.header-toolbar`, `.title-row`, `.toolbar-icons`, `#head_tabs`, `.page-head-tabs`, `.btn-floating`, no breadcrumb (`nav[aria-label="Breadcrumb"]`, `actionAdminBreadcrumbModifier` has no visible effect on kit pages). The title is still the page's `h1`; on a sub-page it is the name of their group (the menu's parent entry, e.g. "Attributes & Features"), not `layoutTitle`: a test reading the `h1` of a sub-page gets the group. An add, edit or view page under it keeps its own title. The `<title>` is unchanged.
- Toolbar buttons (`layoutHeaderToolbarBtn`) keep their id `page-header-desc-configuration-<key or imgclass>`; their non-`btn` classes, `data_attributes`, `modal_target` (now also `data-bs-toggle="modal"`), `js` (onclick) and `help` (a `title`) are kept. On a phone they are also items of the "More actions" menu (`.ps-page-head__more`), with the same attributes but the id, which stays unique on the button: a script binding a button by id does not reach its menu item.
- The title is the `h1` itself (`h1.ps-page-head__title`), no wrapper; the "More actions" menu is a `<twig:ui:Dropdown>` (`div.dropdown.ps-page-head__more`).
- Module buttons: on a kit page, `actionGetAdminToolbarButtons` is also dispatched on Symfony pages (its `controller` is `null` there: there is no legacy controller); its buttons are page actions like the others, in the "More actions" menu on a phone. A module that fails in it (expecting the controller) has its buttons left out. `displayDashboardToolbarTopMenu` (HTML) is not rendered on kit pages any more: its content could not go in the phone menu; no core module uses it.
- The sub-pages (`#subtab-<class>` links) are `nav.ps-page-head__pages` links, the current one `aria-current="page"`; the notification counters they had are gone.
- New: `layoutIcon` (a Material Symbols name) for the title's icon (when the page sets none, the icon of its menu entry from `Toolbar::KIT_TITLE_ICONS`, its group's on a sub-page; module pages have none), `layoutFluid` (true: full width, false: centred) for the page width; a page with a grid (`.ps-grid-panel`, added to `grid_panel.html.twig`) takes the full width.
- The page content is in `.ps-layout__container` inside `main.ps-layout__content`.
- `<twig:ui:DropdownMenu>`: an item's `attr.class` joins `dropdown-item ps-dropdown-menu__item` instead of making a second, ignored `class` attribute (the phone menu's "Add new product" kept no `new-product-button` and opened the full page instead of the modal).
- To do when Products moves to the kit: its "Add new product" is bound by class (`.new-product-button`, `admin-dev/themes/new-theme/js/pages/product/product-map.ts`); it becomes `data-ps-action="new-product"`, the class kept a while for modules.
- SEO & URLs: the card's "Configure index page" button is a secondary button in the modal's footer, before "Got it" (`<twig:ui:ShowcaseModal>` block `actions`).
- Showcase cards: `<twig:ui:ShowcaseModal>` (`data-ps-ref="showcase-modal"`, id `ps-showcase-<name>`) instead of `#…ShowcaseCard .helper-card`.
- Side menu: `offcanvas-lg` (was `offcanvas-md`); the header shows the monogram and the menu button under lg.

**Behaviour**
- Under 768px every page action and Help are in the "More actions" menu. Help opens in a new tab.
- Under 992px the side menu is a drawer opened by the header's menu button.
- A showcase modal opens when the page loads while its card is not closed; its close button, "Got it" or Escape record it closed for the shop, a click outside does not close it.

**Strings** (`Admin.Global`, `Admin.Actions`)
- New: "Got it" (`Admin.Actions`).

## Flash messages, skip link, page spacing — 2026-11-24

`Admin/layout.html.twig` (`session_alert`, `sidebar_right`), `Layout/default_layout.html.twig`, `layout/_layout.scss`.

**Markup** (kit pages only)
- Session messages are `<twig:ui:FlashMessages/>` (`div.ps-flash-messages[data-ps-ref="flash-messages"]`, one `.ps-alert` per type): no `.alert-text`, no `button.close[data-dismiss]`. A page that overrides `session_alert` or `content_header` keeps its own.
- New first element of the body: `a.ps-layout__skip-link[href="#main-content"]`; the content area is `main#main-content[tabindex="-1"]`.
- The page content (`.content-div`) is `.ps-layout__page`: its blocks are spaced by the layout (1.5rem). An empty box there (`#content-message-box` until a script fills it) is hidden, so it takes no gap.
- No `nav#right-sidebar` (the old theme's help sidebar) on kit pages: Help opens the documentation.

**Behaviour**
- The alerts close with their button (Bootstrap 5), each type with its icon.
- The first Tab shows "Skip to main content" over the header; it moves the focus to the page, the next Tab reaches the page head.

**Strings** (`Admin.Navigation.Header`)
- New: "Skip to main content".

## KPI — 2026-11-24

`<twig:ui:Kpi>`, `Common/Kpi/Ui/kpi_row.html.twig`, `CommonController::renderKpiRowAction`, `src/Core/Kpi/KpiData.php`, `KpiDataInterface`, `src/Adapter/Kpi/HelperKpiTrait.php` (the 15 core KPIs), `kpi.js`.

**Markup** (kit pages only: Orders, Carts, a cart, Categories, Customers, Translations)
- The row is `div.ps-kpi-row[role="region"][tabindex="0"]` (no `.card-kpis`, `.kpi-row`, `.kpi-refresh`, `.refresh-kpis`); each core KPI is `.card.ps-kpi.ps-kpi--{colour}[data-ps-ref="kpi"]`, an `a` when linked, with its id kept (`#box-conversion-rate`…): no `.kpi-container`, `.box-stats`, `.kpi-content`, `.title`, `.value`, `.subtitle`, no inline `<script>` nor `refresh_box_*()` functions. The value is `[data-ps-ref="kpi-value"]`.
- A module's KPI in the row keeps its HTML, in a tile.

**Behaviour**
- The colour is the KPI's place in the row (no more `color1`…`color4`).
- An out-of-date value is fetched on load (`data-ps-data-refresh-url`, same AdminStats endpoint); no refresh button. Until it comes the value is a Bootstrap placeholder (`.placeholder-wave`, `aria-busy`), not the cached value; if none comes, a long dash.
- On a phone the KPIs scroll sideways (the next one shows, the hidden edge fades); from md up a grid of two, three or four a line.

**Strings** (`Admin.Global`)
- New: "Key figures" (the name of the KPI row).

**PHP**
- New `KpiDataInterface::getKpiData(): KpiData`, implemented by the core KPIs; `KpiInterface::render()` is unchanged. A module's KPI can implement it to be rendered by the kit.

## KPI review fixes — 2026-11-25

`<twig:ui:Kpi>`, `kpi_row.html.twig`, `_kpi.scss`, new `_kpi-row.scss`, `kpi.js`, `KpiData`, the Kpi stories.

**Markup**
- No tooltip on a KPI any more: no `tooltip` prop, no info button (`.ps-kpi__info`, `[data-ps-ref="kpi-info"]`), no `data-bs-toggle="tooltip"` on a linked card. No core KPI of a kit page has one (only the old product KPIs did); `KpiData::$tooltip` is gone too.
- The row's modifier is its count up to four: `.ps-kpi-row--1` (new: a lone KPI, the whole width at every size, nothing to scroll), `--2`, `--3`, `--4`. Only a row of two or more is focusable (`tabindex="0"`).
- A loading value has a visually hidden "Loading..." beside its placeholder.
- A blank value is a long dash, as a missing one.

**Look**
- The row has its own partial (`_kpi-row.scss`); the card no longer sets its height (the row's grid does) nor its colour (`.card` does).
- A linked card's focus is Bootstrap's focus ring (`$focus-ring-box-shadow`), square, outside the card: the colour line stays.
- `.placeholder` looks like the back office's skeleton (new-theme `_skeleton.scss`): square, on its grey `$gray-400` (`$ps-placeholder-bg`) instead of the text colour, opaque (`$placeholder-opacity-max: 1`); the KPI's sweeps with Bootstrap's `.placeholder-wave` (instead of `.placeholder-glow`), its band's peak `$gray-300` (`$placeholder-opacity-min: .5`).

**Behaviour**
- `kpi.js` sets the value only (no tooltip); `initKpis(root = document)`, run by Storybook on each story too.

**Strings** (`Admin.Global`)
- Reused: "Loading..." (already translated).

## KPI row on real pages — 2026-11-25

From the `ui-screen-review` of the KPI row (Orders, Cart #1, Categories). `kpi.html.twig`, `kpi_row.html.twig`, `kpi.js`, `scroll-fade.js`, `_kpi.scss`, `_kpi-row.scss`, `_scroll-fade.scss`, `HelperKpiTrait`, the Kpi stories.

**Markup**
- The row has no `tabindex` in the template any more: `scroll-fade.js` makes a named region (`role="region"`) a tab stop only while it overflows (a phone), and takes it back when it does not.
- No value: `<span aria-hidden="true">—</span><span class="visually-hidden">No value</span>`, from Twig and from `kpi.js`.
- Loading: `.placeholder-wave` moved from the value to a wrapper of the placeholder (`<span class="placeholder-wave" aria-hidden="true"><span class="placeholder ps-kpi__placeholder"></span></span>`); the value carries `data-ps-data-no-value` (the translated "No value" for `kpi.js`).
- HelperKpi texts are decoded (`html_entity_decode`) into `KpiData`, and `kpi.js` reads a refreshed value as text: `&infin;%` shows `∞%`.

**Look**
- A focused scroll-fade box (`:focus-visible`) drops its mask and shows Bootstrap's focus ring inside its edge (`inset 0 0 0 $focus-ring-width $focus-ring-color`).
- `.ps-kpi__title` is a plain paragraph (its flex, for the old tooltip button, is gone).
- `.ps-kpi__value` breaks a word only when it does not fit (`overflow-wrap: break-word`, was `anywhere`): a negative figure keeps its sign.
- `_kpi-row.scss`: `--1` first, the two-a-line rule on `--2`, `--3`, `--4` only; no rule depends on its order any more.
- Values from Bootstrap: `$focus-ring-width` (set in the kit's variables) for `$ps-kpi-row-focus-room` and `$ps-page-head-focus-room`; the KPI line is `$border-widths` step 3 (`$ps-kpi-line-width: 3`).

**Behaviour**
- `scroll-fade.js`: an item focused inside a box is scrolled into view clear of the fade (`scrollIntoView` with the box's `scroll-padding`).
- `kpi.js` sets the value and removes `aria-busy` only; no class to remove.

**Stories**
- Conversion Rate's icon is `monitoring`, as on the page (`assessment` is `monitoring` in the kit).

**Strings** (core KPIs: the old theme shows them too; short, a KPI is read at a glance)
- New (`Admin.Global`): "No value".
- Abandoned Carts subtitle: "From %date1% to %date2% per unique visitors" (`Admin.Orderscustomers.Feature`) → "Yesterday" (`Admin.Global`); the window is fixed (the day before the last 24 hours). `AbandonedCartKpi` no longer takes `LanguageContext` (final, autowired).
- Average Order Value: the value is the amount only (was "%amount% tax excl.", as the refreshed value already was); its subtitle "30 days" → "30 days, tax excl." (`Admin.Orderscustomers.Feature`).
- Categories: "Average number of products per category" → "Products per category" (`Admin.Catalog.Feature`).

## Design tokens in Storybook, square radius tokens — 2026-11-25

**Look**
- The radius tokens are 0 (`$border-radius`, `-sm`, `-lg`, `-xl`, `-xxl`): `.rounded`, `.rounded-{side}` and `.rounded-{1…5}` are square, as the components already were (`$enable-rounded: false`). `.rounded-pill` and `.rounded-circle` stay round.

**Stories**
- The token and utility stories read the kit's CSS variables (`--psk-…`, the `$prefix`), not `--bs-…`: the colour, border, motion, shadow, spacing and typography previews show again.
- Design Tokens/Colors: palettes with each step's value and text contrast, the theme colours on real buttons and badges, a card for the surface and text tokens, the subtle trios as real alerts, the category colours on KPI cards and badges.
- Design Tokens/Borders: square corners, the kit's focus ring (the brand at 50%, DECISIONS #29); no dark mode mentions (DECISIONS #5).

## Side menu footer: View my shop on one line — 2026-11-25

`side_menu.html.twig`, `_side-menu.scss`, the SideMenu story and the sidebar mockup.

**Markup**
- The new tab icon (`.ps-side-menu__external`, now `size="sm"`) moved inside `.ps-side-menu__label`, after the visually hidden "(opens in a new tab)": it follows the label's last word instead of taking a column at the end of the row.
- The version is under the link, `<p class="ps-side-menu__version">PrestaShop <span class="badge ps-badge ps-badge--oceanblue">9.3.0</span></p>`: "PrestaShop" is visible text (it was only for screen readers), the number keeps its `oceanblue` badge; `.ps-side-menu__version` moved from the badge to the paragraph.

**Look**
- The footer is a centred block under a top border (`--psk-side-menu-border-color`): View my shop, then the version in small muted text with its number in a badge; .25rem between them, .5rem above and below. The label has 174px instead of 99px: View my shop fits one line in en, fr, de, es, it, nl, pl, pt, ru (it wrapped in all but en and es).

## `<twig:ui:Check>`: checkbox and switch — 2026-11-25

Step 1 of the grid's build plan (`ui/.ai/designs/grid.md`, DECISIONS #43). New `Check.php`, `check.html.twig`, `_check.scss`, the Forms/Check story and its helper `ui/src/stories/check.js`. Forms/ChecksRadios keeps Bootstrap's markup only for radios, inline checks and toggle buttons, with a note to use `<twig:ui:Check>`; its checkbox, switch and no-label examples are gone.

**Markup**
- `<div class="form-check ps-check[ form-switch][ ps-check--label-hidden]"><input class="form-check-input ps-check__input" type="checkbox" id="…"[ role="switch"]…><label class="form-check-label ps-check__label" for="…">…</label></div>`. The label is required; with `hideLabel` it is wrapped in `.visually-hidden` and becomes a 24px click target around the box (`$ps-check-target-size`). Other attributes go on the `<input>`. A missing `id` is generated (`ps-check-N`).

**Look**
- `.ps-check` has no bottom margin (Bootstrap's `.form-check` has one): a component never places itself.
- The switch's off track is set through Bootstrap's `--psk-form-check-bg` instead of `background-color` (`forms/_form-check.scss`). `components/check` is imported after the forms partials so a hidden-label switch drops the labelled switch's top margin.

**Storybook**
- The docs pages no longer show the first story twice (at the top, then in the list): `Stories` with `includePrimary: false` in `.storybook/preview.js`, so an id in it does not clash.

## `<twig:ui:EmptyState>` and `<twig:ui:Pagination>` — 2026-11-25

Step 2 of the grid's build plan (`ui/.ai/designs/grid.md`). New `EmptyState.php`, `Pagination.php`, their templates, `_empty-state.scss`, the `ps-pagination` block in `_pagination.scss`, their stories and helpers (`empty-state.js`, `pagination.js`).

**Markup**
- `<div class="ps-empty-state[ ps-empty-state--sm]">`: an optional decorative icon, the title as a heading (`headingLevel`, default 2), the content block as `.ps-empty-state__message`, the `actions` block in a centred `<twig:ui:Layout:Cluster>`.
- `<nav class="ps-pagination" aria-label="…"><ul class="pagination">`: the caller's links (page number => URL); the first, the last, the current page and its neighbours, a gap (`aria-hidden`) where pages are left out; Previous and Next (`rel="prev"`, `rel="next"`) only where they lead somewhere, never disabled; the current page `aria-current="page"` with its number for the eye and "Page 3 of 25" for screen readers; nothing for a single page.
- Components/Pagination was Bootstrap's raw markup; it is now the component's story.

- Each `<li>` is `.ps-pagination__item` (`--step` for Previous and Next, `--current`, `--gap`, `--far` for what a narrow nav hides), each link `.ps-pagination__link`. Pagination.php checks the links: the first page, the current one and its neighbours.

**Look**
- `_pagination.scss` sets Bootstrap's Sass variables (`$pagination-*` in `_variables.scss`) instead of redeclaring its CSS variables, and styles its BEM elements instead of `:has(.ps-icon)`; the `.pagination-sm` and `.pagination-lg` overrides and the unprefixed `--pagination-item-size` / `--pagination-item-px` are gone (`$ps-pagination-item-size`, `$ps-pagination-item-padding-x`). No -1px overlap between items (`$pagination-margin-start: 0`).
- The nav is a container: narrower than 24rem (`$ps-pagination-full-min-width`) it shows Previous, "Page 3 of 25", Next; wider, every page shown, the current one a circle that grows into a pill for a long number.
- The focus ring is the buttons' (DECISIONS #29): a 2px gap in the page colour, then the brand at 50%. The gap ("…") is `$gray-600`, the muted text colour.

**Strings** (`Admin.Global`)
- New: "Page %current% of %total%". Reused: "Previous", "Next".

## `<twig:ui:Pagination>`: a field to go to a page — 2026-11-25

Step 2b of the grid's build plan: the old grids had it (`paginator_jump_page`), a long list needs it.

**Markup**
- New props `jumpUrl` (the URL of any page, with `{page}`, or with `{offset}` and `perPage` for a list that pages by offset) and `perPage`. With them the nav is `.ps-pagination--jump` and ends with `<form class="ps-pagination__jump" data-ps-action="pagination-jump" data-ps-data-url data-ps-data-last[ data-ps-data-per-page] novalidate>`: the field inside its label (`Page <input name="page" inputmode="numeric" pattern="[0-9]*"> of 25`, read "Page 12 of 25") and a small `outline-secondary` Go button.

**Look**
- A page link shows its focus ring on `:focus-visible` only, as the buttons (Bootstrap rings it on `:focus`, a mouse click too).
- The nav lays out the pages and the form in a row that wraps. In a narrow nav the field takes the place of "Page 12 of 25": Previous, Next, then "Page [12] of 25 Go".

**Behaviour**
- `pagination-jump.js`: on submit, goes to the page typed, kept between 1 and the last page; something that is not a number puts the current page back, sets `aria-invalid` until the next key and the page's Announcer says "Enter a page number from 1 to 25" (`data-ps-data-invalid-message`). Enter submits; nothing happens while typing.

**Strings**
- New (`Admin.Global`): "of %total%", "Enter a page number from 1 to %last%". Reused: "Page" (`Admin.Global`), "Go" (`Admin.Actions`).

## `<twig:ui:ConfirmDialog>` and `data-ps-confirm` — 2026-11-25

Step 3 of the grid's build plan: one confirmation for the whole kit, in place of the grid's `ConfirmModal`, `window.confirm` in link row actions, and each page's own confirm modal (INVENTORY #23). New `ConfirmDialog.php`, `confirm_dialog.html.twig`, `_confirm-dialog.scss`, `confirm-dialog.js`, the ConfirmDialog story and its helper.

**Markup**
- The kit layout (`default_layout.html.twig`, `ui_kit` branch) places one `<twig:ui:ConfirmDialog/>` after the Announcer: a `<twig:ui:Modal id="ps-confirm-dialog" class="ps-confirm-dialog" data-ps-ref="confirm-dialog" aria-describedby="ps-confirm-dialog-message">` (md size) titled "Are you sure?", an empty `.ps-confirm-dialog__message` (`data-ps-target="confirm-message"`), Cancel (link, `data-ps-ref="confirm-cancel"`) then Confirm (`data-ps-ref="confirm-accept"`).
- `<twig:ui:Modal>`: its title has `data-ps-ref="modal-title"`, for a script that renames it.
- A trigger: `data-ps-confirm="question"` on a button or a link, with `data-ps-data-confirm-title`, `data-ps-data-confirm-label` (the action's verb) and `data-ps-data-confirm-variant="danger"` when needed.

**Behaviour**
- `confirm-dialog.js` holds the trigger's click and fills the dialog (the title and the label back to their defaults when the trigger has none; a danger action red, `btn-destructive`, the focus on Cancel). Confirm submits the trigger's form with it (`requestSubmit`: its name, value and formaction go along), follows a link, or clicks a plain button again once; a link opens in its `target`. Cancel, Esc or a click outside do nothing; focus goes back to the trigger, or to the toggle of the dropdown menu it was in (the menu closes). While it asks, other triggers are held, so a double click confirms one action; a Confirm during the fade-in still closes it. Bootstrap's `show` and `shown` events carry the trigger as `relatedTarget`. A trigger does not go inside another dialog. It keeps Bootstrap's `role="dialog"`: `aria-describedby` reads the question when it opens.

**Strings**
- Reused: "Are you sure?" (`Admin.Notifications.Warning`), "Cancel" and "Confirm" (`Admin.Actions`).

## `<twig:ui:DropdownMenu>`: submit items — 2026-11-25

Step 4 of the grid's build plan: a menu item that sends a form, for a grid's status choice and row actions.

**Markup**
- New item type `submit`: `{type: 'submit', label, attr: {form, formaction, name, value}}` renders `<button type="submit" class="dropdown-item ps-dropdown-menu__item" form="…">`. `attr.form` is required (the menu sits anywhere, the form elsewhere); `href` and `external` are refused. With `data-ps-confirm` in `attr`, the page's ConfirmDialog asks first.

**Storybook**
- A modal opened on a docs page goes to `<body>` while open and back once closed (`.storybook/preview.js`): the docs box around each story clipped it.
- The Modal and ShowcaseModal stories show their dialog open in place without Bootstrap's `show` (and `fade`): a `.modal.show` with no instance made Bootstrap fail to open another modal on the same page.

## Kit form theme: range filters and dates — 2026-11-25

Step 5 of the grid's build plan. `ui_kit_layout.html.twig` (the kit pages' form theme) and `forms/_filter-range.scss`.

**Markup**
- `date_range_widget`, `integer_min_max_filter_widget`, `number_min_max_filter_widget`: `<fieldset class="ps-filter-range">` with a visually hidden `<legend>` (the filter's label, the column), then each field in `.ps-filter-range__field` with its own visually hidden label ("Start date", "End date"; "Min", "Max" from their placeholder). No Bootstrap 4 `input-group`, `col-md-*` or Material icon; the field names are the same as in the other themes, so a filter posts the same values.
- `date_picker_widget`: the browser's `<input type="date">` when the format is `YYYY-MM-DD` (what it sends), a text field otherwise; the old datepicker's `.input-group.datepicker` and its icon are not rendered on kit pages.

**Look**
- The two fields of a range share the line, as wide as each other; narrower than 6rem each (`$ps-filter-range-field-min-width`), they go one under the other.

## Menus in the top layer — 2026-11-26

**Markup**: `<twig:ui:DropdownMenu>`'s `ul` (or `div` with content) and the notifications panel get `popover="manual"`.

**Behaviour**: `dropdown-top-layer.js` shows a menu in the browser's top layer while Bootstrap shows it (DECISIONS #46): a grid row's actions, the Orders status menu, the bulk menu, rows per page and the header's menus are no longer cut by the box around them (the grid's scrolling table, its fade mask). Keyboard, Escape and an outside click close it as before.

**Look**: `.dropdown-menu[popover]` resets the browser's popover box (`inset`, `overflow`).

## `<twig:ui:Grid>`: the bulk bar, 14px tables, no vertical scroll — 2026-11-26

Second review pass on Countries.

**Markup**
- The bulk actions left the toolbar: `div.ps-grid__bulk[role=group][data-ps-ref="grid-bulk"][hidden]`, first in a new `.ps-grid__table-area` before the table, holds a second select-all `<twig:ui:Check>` (`#{id}_grid_bulk_select_all`), the count `p.ps-grid__selection` (no longer `role=status`), the "Bulk actions" `<twig:ui:Dropdown>` (now `secondary`, always enabled) and "Clear selection" (`data-ps-action="grid-clear-selection"`). The toolbar keeps the `toolbar` block and Rearrange only.
- A checked row's tint is the tertiary grey (was the light oceanblue); its blue line stays.

**Look**
- While a row is checked, the bar lies over the headings and filters, as tall as they are, edged in grey with a blue line under it; it is sticky in the scrolling content, so it follows a long list down to its end, the same look stuck or not.
- The table's text (headings, filters, cells) is 14px (`$ps-grid-font-size`).
- The table scrolls sideways only: no vertical scroll (`overflow-y: hidden` on `.ps-grid__scroll`), no height limit.

**Behaviour** (`grid-selection.js`)
- The bar shows while a row is checked; the headings' and filters' controls it covers leave the tab order (the headings stay for screen readers); the count is announced through the page's announcer on each change.
- Clear selection, or clearing from the bar's select-all, unchecks the rows and moves the focus to the headings' select-all.
- The bar's height follows the headings' (`--ps-grid-head-height`, a ResizeObserver).

**Strings**: new "Clear selection" (`Admin.Actions`).

## `<twig:ui:Grid>`: first review pass on Countries — 2026-11-26

Adjustments asked while reviewing Countries, the reference list page; every kit grid gets them.

**Markup**
- The header's count badge is `oceanblue` (was `secondary`).
- Search moved from the toolbar to the results line, after "1–50 of 241", just above the table; it is now "Filter" with the `filter_alt` icon (not the header search's magnifier). The toolbar holds the bulk actions, the `toolbar` block and Rearrange only, and is not rendered when empty.
- The filter row's first cell, when it has no filter (the select column), is a `th scope="row"` with the same `filter_alt` icon and "Filters" for screen readers.
- The table has Bootstrap's `table-hover`.

**Look**
- The title is a step smaller (`$ps-grid-title-font-size`, 1.125rem); the list actions' icon larger (`$ps-grid-list-actions-icon-size`, 1.5em); more room between Bulk actions and the selection line.
- The filter row on the tertiary background, read as one zone.
- The sorted column's arrow in a small round oceanblue badge (DECISIONS #45).
- A checked row's start line is `oceanblue-500` (was primary); a row is tinted under the pointer and while its check has the keyboard focus; a checked row keeps its own tint.
- The select column's checks are flex blocks, centred on the row's text (they sat 1.5–2px low), the heading's check centred in its cell.

**Behaviour**
- The results summary takes the focus after sorting, paging or filtering, not on a reload; the `#…_grid_results` fragment is dropped from the address once used.
- A bulk action shows its definition's icon (`setIcon()`) in the menu; none is made up for the others.

**Strings**: new "Filter" (`Admin.Actions`), "Filters" (`Admin.Global`).

## `<twig:ui:Grid>`: quick filters — 2026-11-25

Part of step 14. `Grid::getQuickFilters()`; a QuickFilter story.

**Markup**: a `FilterLinkFilterType` filter (Discounts' period) is a `div.ps-grid__quick-filters.btn-group[role=group]` in the toolbar, named by the filter, after Search: a hidden field with the current value, then one submit button per choice (`form="{id}_filter_form"`, its name and value, `aria-pressed`, the pressed one `active` with a check icon). The hidden field comes first so that the clicked button's value, sent after it, wins. The filter's own hidden field and the old `js-filter-link-field` links are not rendered.

## `<twig:ui:Grid>`: domain columns, unnamed actions, grids' own empty states — 2026-11-25

Part of step 14 of the grid's build plan. Discounts, Logs, Search aliases and Currencies now render on the kit grid.

**Markup**
- New cells: `currency_name` (the name, a "Unofficial" person mark or "(Edited)"), `employee_name_with_avatar` (`.ps-grid__person`: the picture, decorative, and the name; "N/A" without an employee), `aliases` (an inactive alias struck through and said "Disabled"), `discount_usage` ("3 / ∞", the sign read "Unlimited"). The old `employee_avatar_small`, `unofficial` Material icon are not kept.
- An action without a name (Currencies' edit) is named after its id ("Edit", "Delete", "View", "Duplicate", else the id in words): an icon button needs a name.
- A grid's own empty state: when the page gives no `empty` block, the grid looks for `Component/Ui/Grid/empty/{gridId}.html.twig` (a module may add one) before the default. Kit versions of the old `Blocks/EmptyState/*` for attachment (Files), credit_slip, supplier, discount (its Create discount opens the page's `#createDiscountModal`), customer and product, as `<twig:ui:EmptyState>` with their messages and actions; their illustrations are replaced by an icon.

**Look**: a person's picture is round, as in the header.

**Strings**: reused "Unofficial", "Edited" (`Admin.International.Feature`), "Disabled", "Unlimited", "N/A", "(opens in a new tab)" (`Admin.Global`), the empty states' own strings.

## List pages on `<twig:ui:Grid>` — 2026-11-25

Step 13 of the grid's build plan. The list pages include `Common/Grid/Ui/grid_panel.html.twig` instead of `Common/Grid/grid_panel.html.twig`: with PS_UI_KIT on it renders `<twig:ui:Grid>` when the kit has a template for every type of the grid (`Grid::renders()`, `unknownTypes()`; Twig `ui_kit_renders_grid(grid)`), the old panel otherwise and with the kit off. The switch is not in `Common/Grid/grid_panel.html.twig` itself: the native module ps_linklist overrides that template for the whole back office.

**Pages on the kit grid** (45 templates switched): Shopping carts, Credit slips, Brands (and addresses), Suppliers, Catalog price rules, Files, Features, Attributes, Monitoring (most of its grids), Merchandise returns, Order messages, Customer service, Outstanding, Addresses, Business entities, Admin API, Customer and employee sessions, Webservice, Profiles, Extra properties, Backups, Employees, Quick access, SQL Manager, Titles, Search engines, Customer groups, SEO & URLs, Contacts, Stores, Tags, Pages (CMS), Carriers, Languages, States, Email body translations, Countries, Tax rules, Zones, Taxes.

**Still on the old grid** (a column type of their own, step 14): Discounts (`discount_usage`), Logs (`employee_name_with_avatar`), Search aliases (`aliases`), Currencies (`currency_name`); and the pages that do not include the panel this way (Orders has its own kit template, Customers, Categories, Products, Image settings, Email logs, the view pages' grids).

**Behaviour**: the pages' own scripts still load; their old grid extensions find none of their classes on a kit grid and do nothing. Each page still needs its review (`ui-review`) and its UI tests updated.

## `<twig:ui:Grid>`: toggles and positions — 2026-11-25

Steps 11 and 12 of the grid's build plan. `Grid::toggleUrl()`, `getReorderField()`, `getOrderingColumnId()`, `getReorder()`, `positionUpdateUrl()`; `Grid/cell/toggle.html.twig`, `position.html.twig`, `position_handle.html.twig`; `grid-toggle.js`, `grid-position.js`; a Carriers fixture and its stories (Toggles and positions, Positions not sorted).

**Markup**
- A `toggle` cell: `<twig:ui:Check type="switch" hideLabel>` `#{id}_grid_{column}_{key}`, named by its column's heading and the row's header (`aria-labelledby`: "Status 2"), `data-ps-action="grid-toggle"`, `data-ps-data-url` (the route with `route_param_name`/`primary_field` and `extra_route_params`). The old `ps-switch`, `ps-togglable-row`, `data-toggle-url`, the two radios and their ids are not kept.
- A `position` cell: the position from 1 (`display_offset`), plain.
- The `position_handle` column (added by the presenter when the list is sorted by position): its heading "Move" for screen readers; each cell `div.ps-grid__position[data-ps-ref="grid-position"]` with `data-ps-data-id`, `-position`, `-url`, `-method`, a drag handle (`data-ps-action="grid-drag"`, hidden from screen readers) and "Move up" / "Move down" icon buttons described by the row's header, off at the page's first and last rows. The old `position-drag-handle`, `js-{id}-position`, `js-drag-handle`, `data-update-url`, the `row_{id}_{position}` row ids are not kept.
- Rearrange (`ReorderPositionsButtonType`, the position column's filter) is no longer a filter-row button: the toolbar has a link "Rearrange" (sorts by position) or, while sorted by it, "Done" (back to the first other sortable column). The old `js-btn-reorder-positions` is not kept.
- The grid's action form gets `data-ps-ref="grid-action-form"`.

**Look**
- A dragged row is faded; the handle shows the grab pointer; the handle and actions cells are as narrow as their content.

**Behaviour**
- `grid-toggle.js`: a flipped switch posts at once (`redirect: 'manual'`), busy and off meanwhile. A JSON answer `{status, message}`: the message announced, the switch flipped back on a false status; a redirect: the page reloads with its flash; any failure flips it back and announces the error. The old green and red growl messages are replaced by announcements.
- `grid-position.js`: a row moves by its handle (drag over the page's rows) or by Move up / Move down; then the page's positions are posted as before (`positions[i][rowId]`, `[oldPosition]`, `[newPosition]`, `_method` for other methods) through the action form, and the page reloads. Moves stay within the page.

**Strings**: new "The change could not be saved. Try again." (`Admin.Notifications.Error`), "Move" (`Admin.Actions`); reused "Move up", "Move down", "Rearrange", "Done" (`Admin.Actions`).

## Orders on the kit — 2026-11-25

Step 10 of the grid's build plan. With PS_UI_KIT on, `Sell/Order/Order/index.html.twig` includes `Ui/index.html.twig` and `preview.html.twig` includes `Ui/preview.html.twig`; the old markup is unchanged with the kit off.

**Markup**
- The page: the KPI row (kit), `<twig:ui:Grid :grid="orderGrid">` with the Orders empty state in its `empty` block (`<twig:ui:EmptyState icon="receipt_long">` "Manage your orders" and its message, replacing `Blocks/EmptyState/order.html.twig`), and the change-status modal as a `<twig:ui:Modal id="changeOrdersStatusModal">` (id kept): its form `#change_orders_status_form` keeps `data-bulk-inputs-id` and the `order_ids` prototype, the field labelled "Status", Cancel and Update status in the footer (`form=`). The `orders_kpi` and `order_grid_row` blocks are not rendered on the kit: a module that overrides them does not show there.
- The preview: `.ps-order-preview` (`data-role="preview-row"` kept, and `shipping-details`, `email`, `invoice-details`, `product-table`): a description list of carrier, tracking number (a new-tab link said so), shipping details, email and invoice details with kit icons, the addresses on their own lines; the products table with a hidden caption, the stock location column only when a product has one (server side), past the limit the rows `hidden` with "(N more)" (`data-ps-action="order-preview-more"`), and Open details as a kit button. `displayOrderPreview` is still rendered after it. The old `js-product-preview-more`, `js-preview-more-products-btn`, `js-cell-product-stock-location`, Material icons are not kept.
- Scripts: `order_ui.bundle.js` (`js/pages/order/order-list.ts`) replaces `order.bundle.js` and `pagination.js`; `orders.css` is not loaded.

**Look**
- `ui/src/scss/pages/_orders.scss`: the preview's details beside its products when the grid is wide enough (a container query on the grid's scrolling box), under them otherwise. The grid's preview row keeps to the visible width of the scrolling table (`_grid.scss`).

**Behaviour**
- Open in new tabs: on `ps:grid-bulk-action` (`open_tabs`), each checked order's page in a tab from the button's `data-route` and `data-route-param-name`; the browser's own alert, as before, when tabs are blocked.
- "(N more)" shows the other products and moves the focus to the first of them.

**Not done**: `order_ui.bundle.js` could not be built here (no node in the PHP container): run `make admin-new-theme` once node is back. The Orders UI tests and page objects still use the old selectors.

## `<twig:ui:Grid>`: clickable rows, status choice, preview; Orders playground — 2026-11-25

The end of step 8 (clickable rows, submit list actions) and step 9 of the grid's build plan. `Grid::rowLink()`, `choice()`, `previewUrl()`, `getPreviewColumnId()`; `Grid/cell/choice.html.twig`, `identifier.html.twig`; `grid-row-link.js`, `grid-preview.js`; the Orders fixture gets the real status choice, preview and clickable row; the Orders playground page shows the grid.

**Markup**
- A row whose first link action has `clickable_row` (Orders' View): `data-ps-action="grid-row-link"` and `data-ps-data-href`; its `clickable` columns' cells get `ps-grid__cell--clickable`. Not when the action asks first. The old `td.clickable`, `cursor-pointer` and `data-clickable-row` are not kept.
- A `submit` list action (Email logs' Erase all): a submit item sending the grid's action form to `submit_route` with the old token as the button's name and value (`{id}[_token]`), asking first with its `confirm_message`. The old `js-grid-action-submit-btn`, `data-url`, `data-method`, `data-csrf` are not kept.
- A `choice` cell (Orders' status): a `<twig:ui:Button size="sm">` in the record's colour (text dark or light by contrast, as the badge), "Status: Payment accepted" for screen readers, described by the row's header; a menu with every status as a submit item posting `value` to the column's route through the action form, the current one `aria-current`. The old `js-choice-options`, `js-dropdown-item`, `data-url`, `coloured` are not kept.
- An identifier with a `preview` (Orders): the value in `span#{id}_grid_rowhead_N` (the row's name, the `th` keeps no id), then a "Preview" `<twig:ui:IconButton>` with `aria-expanded`, `aria-controls="{id}_grid_preview_N"`, `data-ps-action="grid-preview"`, `data-ps-data-url`; each row is followed by `tr#{id}_grid_preview_N.ps-grid__preview[hidden]` spanning the columns. The old `preview-toggle`, `js-expand`/`js-collapse`, `data-preview-data-url`, `preview-row` are not kept.

**Look**
- Clickable cells show the pointer. The status button stays on one line. The preview row on the tertiary background; the toggle's arrow turns up when open.

**Behaviour**
- `grid-row-link.js`: a click on a clickable cell follows the row's link (Ctrl/Cmd, Shift or the middle button: a new tab); not on a control, nor when text is selected. The keyboard uses the action's link.
- `grid-preview.js`: the toggle shows or hides the preview row; the first open fetches it (JSON `{preview}`), the row busy with a spinner meanwhile; on failure a danger alert with Try again; once loaded, `ps:grid-preview-loaded` on the grid (`{gridId, row, previewRow}`). Several previews can be open.
- A choice posts and reloads, as before.

**Strings**: new "The preview could not be loaded." (`Admin.Notifications.Error`); reused "Preview", "Try again" (`Admin.Actions`), "Loading..." (`Admin.Global`).

## `<twig:ui:Grid>`: row and list actions — 2026-11-25

Step 8 of the grid's build plan. `Grid::getGridItems()`, `hasQueryModal()`, `rowActions()`, `Grid/cell/action.html.twig`; the fixture gets an actions column (view, invoice, delete), the list's actions and its query.

**Markup**
- The header holds the list's actions: `div.dropdown.ps-grid__list-actions`, a `<twig:ui:IconButton>` "List actions" (settings icon; the old grids' id `#{id}-grid-actions-button` kept) and a `<twig:ui:DropdownMenu>`: `link` actions to their route, Refresh list a link to the current URL, Show SQL query opens `#{id}_grid_common_show_query_modal`, Export to SQL Manager submits its form; other `simple` actions a button `data-ps-action="grid-action"` `data-ps-data-action-id` (keeps `js-{id}-grid-action`). With `display_name: false` the band stays for them, the title visually hidden. `submit` grid actions are not on kit grids yet.
- The SQL query: a `<twig:ui:Modal>` "SQL query" (lg), a form `#{id}_common_show_query_modal_form` posting `sql` (read-only textarea `#{id}_grid_query`) and `name` (the list's name) to the SQL Manager; Cancel and Export to SQL Manager. The old `#{id}_grid_common_show_query_modal` id kept.
- An `action` column: `div.ps-grid__actions`, the actions with `use_inline_display` and the first other one as `<twig:ui:IconButton size="sm" tooltip>` described by the row's header; the rest in a More actions menu (`more_vert`, fixed popper so the scroll box does not clip it). An action whose icon the kit has not goes to the menu; one that does not apply (`accessibility_checker`) is left out. Links go to their route (`route_param_name`/`field`, `extra_route_params`); submits send a hidden `form#{id}_grid_action_form` (`form`, `formaction`, `formmethod`, `name="_method"` for DELETE and other methods); both ask first with `data-ps-confirm` (static or `dynamic_message_field`) and `modal_options`. The old grids' `.js-link-row-action`, `.js-submit-row-action` and `data-confirm-*` are not kept.
- The search and reset filter (associated with the actions column) is no longer looked for in the filter row: the toolbar renders it.

**Look**
- The header is a flex row, the list actions at its end; the actions cell as narrow as its buttons; the query in the monospace font.

**Strings** (`Admin.Global`): new "List actions"; reused "More actions", "SQL query", "Export to SQL Manager" and "Cancel" (`Admin.Actions`).

## `<twig:ui:Grid>`: selection and bulk actions — 2026-11-25

Step 7 of the grid's build plan. `Grid::getBulkItems()`, `Grid/cell/bulk_action.html.twig`, `grid-selection.js`, `grid-bulk.js`; the fixture gets a selection column and three bulk actions.

**Markup**
- A `bulk_action` column: in its heading a `<twig:ui:Check hideLabel>` "Select all N rows on this page" (`#{id}_grid_bulk_action_select_all`, `data-ps-action="grid-select-all"`); in each row a `<twig:ui:Check>` named `{id}_{column}[]` (as the old grids, inside the filter form so a bulk action sends it), `#{id}_grid_select_{value}`, `data-ps-action="grid-select-row"`, named "Select 1024" by `aria-labelledby` (a hidden "Select" and the row's header). None on a row with `disabled_field` or `disableBulkCheckbox`.
- The toolbar starts with `.ps-grid__bulk`: a `<twig:ui:Dropdown>` "Bulk actions", disabled, `data-ps-ref="grid-bulk-actions"`, and a status line `p.ps-grid__selection[role=status]` (`data-ps-ref="grid-selection-count"`) "No rows selected" / "N selected". Not rendered when there is no row.
- Bulk actions as menu items: `submit` sends the filter form to its route (`form`, `formaction`, `formmethod`), with `confirm_message` and `modal_options` as `data-ps-confirm`, `-title`, `-label`, `-variant`; `button` keeps its class and attributes, `data-ps-action="grid-bulk-button"` and `data-ps-data-action-id`; `modal_form_submit` opens the page's modal (`data-bs-toggle="modal"`, `data-ps-action="grid-bulk-modal"`). `ajax` and modules' types are not on kit grids yet. The ids `#{id}_grid_bulk_action_{action}` are not kept.

**Look**
- A checked row: Bootstrap's table state tint in the light brand blue (`oceanblue-bg-subtle`) and a line on its start edge.

**Behaviour**
- `grid-selection.js`: select-all checks or clears the page's rows and shows "some" (indeterminate); the status line counts; the bulk menu is off until a row is checked; per grid, and again on load.
- `grid-bulk.js`: a bulk button dispatches `ps:grid-bulk-action` on the grid (`{gridId, actionId, ids}`); a modal form gets one input per checked row from its `[data-prototype]` block (`data-bulk-inputs-id`), as the old grids.

**Strings** (`Admin.Global`): new "Select all %count% rows on this page", "No rows selected", "%count% selected"; reused "Bulk actions", "Select" (`Admin.Actions`).

## `<twig:ui:Grid>`: the list, read only — 2026-11-25

Step 6 of the grid's build plan (`ui/.ai/designs/grid.md`). New `Grid.php`, `grid.html.twig`, the cells in `Component/Ui/Grid/cell/`, `_grid.scss`, `grid-filters.js`, the Grid story, its helper `grid.js` and its fixture `ui/src/stories/fixtures/order-grid.json`. Selection, bulk and row actions, toggles, positions and the row preview come in the next steps; no page uses it yet.

**Markup**
- `<section id="{id}_grid_panel" class="ps-grid card" data-ps-ref="grid" data-ps-data-grid-id="{id}" aria-labelledby="{id}_grid_title">`: a header with the title (`headingLevel`, visually hidden with `display_name: false`) and the count in a badge; the body with `displayAdminGridTableBefore`/`After` (same parameters as the old grids), the `before` and `toolbar` blocks, Search (`form="{id}_filter_form"`) and Clear filters (`data-ps-action="grid-reset-filters"`), the results summary `#{id}_grid_results` (`tabindex="-1"`, `data-ps-ref="grid-results"`), the filter form `#{id}_filter_form` around a scrolling region `.ps-grid__scroll` (a named `role="region"`, ps-scroll-fade) and `table#{id}_grid_table` with a hidden caption; a footer with the pagination (a field to go to a page past five pages) and rows per page (a menu of links). `embedded`: no card, no header, named by the caption.
- Headings: `th scope="col" id="{id}_col_{column}"`, a sortable one a link with `aria-sort` on the sorted one and an arrow, both ways on the others. Filters: each field with its hidden label (the column's name), a range a fieldset. Rows: one `th scope="row"` each (the identifier, else the first data or link column).
- Cells: `data` (a cut text whole for screen readers), `identifier`, `link`, `disableable_link`, `boolean` and `status` (an icon and a word), `badge` (a theme badge or the record's colour), `color` (a swatch and the value), `date_time` (`<time>`, local), `order_price`, `image`, `html`, `link_group` (named icon buttons), `severity_level`; any other type through the old grids' template (`column_content`). A page or a module overrides a cell in `Component/Ui/Grid/cell/{gridId}_{column}_{type}.html.twig`.
- Nothing yet (`is_empty_state`): the header and the `empty` block (default: an EmptyState). No match: the headings without sort links, the filters, and a small EmptyState with Clear filters. Not rendered on kit grids: `pagination_view: quicknav`, `empty_state_without_headers`, `Blocks/EmptyState/{gridId}` (the page's `empty` block replaces them).
- The kit form theme gets a `text_widget`: the global theme's `aria-label="{id} input"` no longer replaces a field's label on kit pages.

**Look**
- A page with a grid (not embedded) takes the full width (`_layout.scss`). The filter row's fields are Bootstrap's small size.

**Behaviour**
- Sorting, pages and rows per page are links on the current URL with the grid's prefix (`order[orderBy]`, `order[offset]`, `order[limit]`), as the old grids'. They and Search land on `#{id}_grid_results`, which `load-focus.js` now focuses after the reload (after an invalid field or a flash). `grid-filters.js`: Clear filters posts the reset, then goes to the list on its summary.

**Strings**
- New (`Admin.Global`): "results", "%from%–%to% of %total%", "No results match these filters", "Pages of %list%", "%limit% per page"; (`Admin.Actions`): "Clear filters". Reused: "No records found", "Search", "Yes", "No", "Deleted customer".

**Review fixes** (`ui-component-review`, 2026-11-25)
- The section is always named by its title `#{id}_grid_title`: with `embedded` or `display_name: false` a visually hidden heading and no header band (was: the caption, which an empty embedded grid did not render). The scrolling region is named "{name} table".
- No match: the small EmptyState is under the table (`.ps-grid__no-match`), not in a table row that scrolled out of sight on a phone; the summary reads "0 results" (it repeated the empty state's sentence). The header's count reads "1 result" / "N results".
- Filter fields take Bootstrap's `form-control-sm` / `form-select-sm` (a range passes `small` to its fields, `ps_filter_range` in the kit form theme) instead of sizes written by hand, which took a select's arrow room.
- A badge in the record's colour is a `<twig:ui:Badge variant="light">` with `.ps-grid__badge--ink-dark|light`: its text picked by its WCAG contrast (`Grid::inkOn()`), not by `is_color_bright`, which let some statuses fail.
- A link cell with `target="_blank"` says it opens a new tab; severity words are translated where written; Clear filters announces a failure (`data-ps-data-error`); sort links show the kit focus ring; an embedded grid's footer has room above it.

**Strings**: new (`Admin.Global`) "result", "%list% table"; (`Admin.Notifications.Error`) "The filters could not be cleared. Try again."

## Grid: row actions in one menu, a clearer summary — 2026-11-26

`Component/Ui/Grid/cell/action.html.twig`, `Grid::rowActions()`, `grid.html.twig`, `_dropdown-menu.scss`.

**Markup**
- A row's actions are all in one menu: one `more_vert` icon button labelled "Actions" (described by the row header) in `div.dropdown.ps-grid__actions`. No more inline icon buttons for the first action or `use_inline_display` ones; the "More actions" button is gone.
- Dangerous actions (an id containing `delete`, or a danger confirm) come last, after a divider.
- `Grid::rowActions()` returns a list of `<twig:ui:DropdownMenu>` items (was `{buttons, menu}`).
- New hooks: `data-ps-action="grid-apply-filters"` on the Filter button, `data-ps-ref="grid-filter-row"` on the filter row.

**Behaviour**
- The main action is reached by clicking the row (as before) or as the menu's first item: one more click with the keyboard.
- Filter (small, outlined) ends the filter row, in the actions column's filter cell (the definition's `search_and_reset`); it left the results line, where only Clear filters stays. A grid whose `search_and_reset` is on no column keeps it in the results line.
- Clear filters has the close icon, like Clear selection.
- The last row keeps its bottom border (it was cut by the scroll box).
- Enter in a filter field sends Filter (`grid-filters.js`): the browser would otherwise send the first submit button of the filter form, a bulk action or a quick filter's choice, both earlier in the page.

**Strings**
- Admin.Global: "More actions" → "Actions" (row menu button).
- Admin.Global: "%from%–%to% of %total%" → "%from%–%to% of %total% results"; with one record, "1 result".

**Old theme**: not affected.
