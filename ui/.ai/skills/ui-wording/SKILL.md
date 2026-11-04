---
name: ui-wording
description: >
  Rewrites the strings of a /ui kit page or component to the PrestaShop tone of voice, keeps terms
  consistent across the back office, lists the new strings for translators and records old → new in
  CHANGELOG-UI.md. Trigger: "reword {page}", "check the wording of {component}", "make these messages
  clearer", "tone of voice pass on {page}".
needs: []
produces: "the reworded strings in templates and PHP, the list to approve, a CHANGELOG-UI.md Strings section"
---

# Reword a kit screen

Rewording is welcome on the rework (`ui/.ai/DECISIONS.md` #19): AI rewrites, the developer approves the list at the plan checkpoint of `ui-rework`. When the Notion connector is available, the `ps-translate:brand-translate` skill holds the official tone of voice and termbase: follow it over the rules below.

## Rules

- **Plain and active**, addressed to the user as "you": "Your reset link has expired. Request a new one.", not "Your password reset request expired. Please start again."
- **Say what happened, then what to do**: every error and warning ends with the next step. No blame ("you entered an invalid…"), no "please", no exclamation marks, no jargon ("CSRF token", "unsecure mode").
- **Buttons and links are verbs** naming the result: "Send reset link", "Sign in", "Reset password". One verb per action across the back office.
- **Sentence case** everywhere (titles, buttons, labels), periods on full sentences only.
- **Consistent terms**: sign in (not log in), email address, back office, shop. When a term differs from the rest of the back office, list it in the plan rather than picking silently.
- **Placeholders stay**: `%name%` parameters, `[1]…[/1]` markup, sprintf `%s` / `%d`. The translator has no plural forms: write one string per case ("every hour", "every %count% hours").
- **Do not reveal** what a user should not learn (whether an account exists, why a login failed).
- **One string, one meaning**: do not reuse a key whose meaning differs; do not reword only to reuse an old key.

## Steps

1. List every visible and announced string of the target (templates, controller flashes, form type labels, help and constraint messages, `aria-label`s, JS strings handed through `data-ps-data-*`).
2. Propose old → new with the rule each change applies; keep the domain (`Admin.{Section}.{Feature|Notification|Help}`).
3. After approval, change them in code, then run `node ui/.ai/bin/missing-translations.mjs --locale fr-FR` and report the list.
4. Add the old → new pairs to the entry's **Strings** section in `ui/.ai/CHANGELOG-UI.md` (UI tests and translators rely on it).
