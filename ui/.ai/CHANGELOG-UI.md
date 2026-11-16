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
- Not on kit pages until their kit version: notifications, the multistore bar (quick access: see its own entry). The kit build (`theme-ui.ts`) no longer runs the old `NavBar` and `Header` scripts nor `components/header/search-form`.
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
- Kit CSS: the title is `$h5-font-size`; the close button stays on the title's first line.
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

