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
- Alerts (`<twig:ui:Alert>`): `role="status"` except `danger` (`role="alert"`); icon alignment `align-items-start` + `mt-1`.
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
