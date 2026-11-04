---
name: ui-seed
description: >
  Puts the local dev shop in a reversible data scenario to review a /ui kit screen: full listings
  (customers, products), maximum-length names, a limited employee, another back office language,
  multistore. Trigger: "seed {scenario}", "fill the customers grid", "review {page} with a limited
  employee", "undo the seed".
needs: []
produces: "the shop in the scenario, recorded in var/ui-seed/<scenario>.json, and undone afterwards"
---

# Seed review data

Script: `ui/.ai/bin/seed.php`, run **in the PrestaShop container as the web user** (files under `var/` must stay writable by the web server):

```bash
docker exec -u www-data -w /var/www/html <prestashop container> php ui/.ai/bin/seed.php list
docker exec -u www-data -w /var/www/html <prestashop container> php ui/.ai/bin/seed.php up customers --count=1000
docker exec -u www-data -w /var/www/html <prestashop container> php ui/.ai/bin/seed.php down customers
docker exec -u www-data -w /var/www/html <prestashop container> php ui/.ai/bin/seed.php status
```

## Scenarios

| Scenario | Shows | Options |
|----------|-------|---------|
| `customers` | Full customer listing, pagination, filters, active/inactive mix | `--count` (1000) |
| `products` | Full catalog listing, stock 0, inactive products | `--count` (200) |
| `long-names` | Long customer and product names, huge price, long shop name (header, back link) | |
| `limited-employee` | An employee who can only read Dashboard, Orders and Customers: hidden menus, denied pages | credentials in `var/ui-seed/limited-employee.json` |
| `employee-language` | The back office in another installed language (long translations, untranslated strings) | `--iso` (fr) |
| `multistore` | Multistore on with a second shop: shop selector, per-shop fields (experimental: no copied data) | |

States that need no data stay out of the seeder: an **empty listing** is an entity with no rows locally or a filter matching nothing; a **config-gated** state is a `prestashop:config get` then `set`, restored afterwards; **emails** go to MailDev.

## Rules

- Dev shops only (the script refuses otherwise), local test data only: addresses `ui-seed-…@example.test`, generated passwords written to the state file, never printed or committed.
- Always `down` what you put `up`, also after a failed review, then check `status` says nothing is up. Scenarios are independent and can be stacked; undo them in any order.
- Sign in as the limited employee only on the local shop, reading the credentials from its state file.
- A new scenario goes in `seed.php` as an `up<Name>()` function that records every created object (`created()`) and changed global value (`setConfiguration()`) before moving on, so a failure half way can still be undone; add it to the table above.
