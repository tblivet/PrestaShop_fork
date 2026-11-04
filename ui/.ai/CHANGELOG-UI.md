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

