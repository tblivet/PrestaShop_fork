# /ui kit component inventory

Ranked backlog of /ui kit components, produced by the `ui-inventory` workflow over 232 Symfony back office pages inventoried in 7 batches. Refresh it by running the `ui-inventory` workflow again (args: `repo`, `outDir`, optional `baseUrl`, `visual`) when many pages have changed, then tick the checkboxes as components land. Screenshots stay out of the repository, in the workflow's `outDir` (this run: `<outDir>/`). Page counts include the pages that inherit a shared template (layout, grid, form themes). Read by the `create-ui-component` and `ui-component-design` skills. Page paths are relative to `src/PrestaShopBundle/Resources/views/Admin/`; occurrences are repository-relative.

## Form theme (decision #25)

Every visible form block gets a Bootstrap 5 version in `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/ui_kit_layout.html.twig` that calls a kit component. Blocks land with their component, in this order. Until a PrestaShop type has its block, a page using it cannot move to the kit (`migrate-page-to-ui` checks this). Source of the current markup: `prestashop_ui_kit_base.html.twig`, `bootstrap_4_layout.html.twig`, `bootstrap_4_horizontal_layout.html.twig`, `material.html.twig`, `multishop.html.twig`, `entity_search_input.html.twig`, `currency_money.html.twig`, `enriched_choice.html.twig`, `translatable_choice.html.twig`.

| # | Status | Blocks | Kit component | Notes |
|---|--------|--------|---------------|-------|
| F1 | - [x] | `widget_attributes`, `form_errors` | — | Errors and help linked to the field, form errors as `ui:Alert` (done for the login page) |
| F2 | - [ ] | `form_row`, `row_attributes`, `form_label`, `form_help`, `form_hint`, `form_errors_field`, `form_errors_other`, `form_unit`, `form_unit_prepend` | `ui:FormRow` | Label, field, help, errors, unit; horizontal and vertical variants |
| F3 | - [ ] | `form_prepend_alert`, `form_append_alert`, `form_alert`, `form_prepend_external_link`, `form_append_external_link`, `form_external_link` | `ui:Alert`, `ui:Link` | Inside `ui:FormRow` slots |
| F4a | - [x] | `password_widget` | `ui:PasswordField` | Every password field gets its show/hide button (2026-11-03) |
| F4b | - [ ] | `Helpers/password_feedback.html.twig` (an include, not a form block) | `ui:PasswordStrength` (new) | The strength meter and its `<template>` for `change-password-handler.ts`, today included by hand on the reset, Employee and Customer forms. Make it a component when those forms move to the kit, and let `ui:PasswordField` render it for new-password fields (a `strength` option on the field, set by the form type), so pages stop including it |
| F4 | - [ ] | `form_widget_simple`, `text_widget`, `email_widget`, `url_widget`, `number_widget`, `integer_widget`, `percent_widget`, `textarea_widget`, `text_with_length_counter_widget`, `text_with_recommended_length_widget`, `generatable_text_widget`, `ip_address_text_widget` | `ui:InputGroup` (prefix, suffix, counter, action) | Plain inputs keep Bootstrap `form-control` |
| F5 | - [ ] | `choice_widget`, `choice_widget_collapsed`, `choice_widget_expanded`, `choice_label`, `checkbox_widget`, `radio_widget`, `checkbox_label`, `radio_label`, `checkbox_radio_label`, `translatable_choice_widget` | `ui:Check`, `ui:Select` | Expanded choices as a `ui:Layout:Stack` of checks |
| F6 | - [ ] | `switch_widget`, `form_disabling_switch`, `toggle_children_choice_widget` | `ui:Switch`, `data-ps-toggle` | PrestaShop's `SwitchType` and its dependent fields |
| F7 | - [ ] | `translatable_fields_with_tabs`, `translatable_fields_with_dropdown`, `translatable_widget`, `translatefields_widget`, `translate_fields_widget`, `translate_text_widget`, `translate_textarea_widget` | `ui:TranslatableField` | One component, tabs or dropdown variant |
| F8 | - [ ] | `money_widget`, `currency_money_widget`, `price_reduction_widget`, `amount_currency_widget` | `ui:InputGroup` | Currency and percent units |
| F9 | - [ ] | `choice_tree_widget`, `choice_tree_item_widget`, `material_choice_tree_widget`, `material_choice_tree_item_*` | `ui:ChoiceTree` | Category trees |
| F10 | - [ ] | `material_choice_table_widget`, `material_multiple_choice_table_widget` | `ui:ChoiceTable` | |
| F11 | - [ ] | `form_modify_all_shops`, `shop_restriction_checkbox_widget`, `shop_selector_widget`, `shop_option_*` | `ui:MultistoreField` | Multistore checkboxes and selector |
| F12 | - [ ] | `date_widget`, `time_widget`, `datetime_widget`, `birthday_widget`, `date_picker_widget`, `date_range_widget` | `ui:DatePicker` (new) | |
| F13 | - [ ] | `file_widget`, `image_preview_widget`, `image_with_preview_widget`, `avatar_url_row` | `ui:FileUpload` | With preview |
| F14 | - [ ] | `button_widget`, `icon_button_widget`, `button_collection_widget`, `submittable_input_widget`, `submittable_input_button_widget` | `ui:Button`, `ui:IconButton`, `ui:Layout:Cluster` | |
| F15 | - [ ] | `entity_search_input_widget`, `entity_item_*`, `entity_search_*_layout`, `searched_customer_row` | `ui:EntitySearch` | |
| F16 | - [ ] | `collection_widget`, `tagged_item_collection_widget`, `tagged_item_collection_entry_row` | `ui:CollectionEditor`, `ui:Tag` | Keeps Symfony's prototype mechanism |
| F17 | - [ ] | `delta_quantity_widget`, `delta_quantity_*`, `submittable_delta_quantity_delta_widget` | `ui:DeltaQuantity` (new) | Stock fields |
| F18 | - [ ] | `card_row`, `accordion_widget`, `navigation_tab_widget` | `ui:Card`, `ui:Collapse`, `ui:Tabs` | Form grouping: placed by `ui:Layout:FormSection` |
| F19 | - [ ] | `enriched_choice_widget`, `color_picker_widget`, `link_preview_widget`, `text_preview_widget`, `custom_content_widget`, `unavailable_widget`, `change_password_row` | `ui:ChoiceCards`, `ui:ColorPicker`, `ui:Link`, `ui:PasswordField` | Rarer types |
| F20 | - [ ] | `search_and_reset_widget`, `integer_min_max_filter_widget`, `number_min_max_filter_widget`, `date_range_widget` (filters) | `ui:Grid` filters | With the new grid |

## Backlog

### Tooling

| Status | Name | When | What |
|--------|------|------|------|
| - [x] | Story markup parity test | With the first layouts (Stack, Cluster) | Done 2026-11-06: `StoryMarkupTest` renders each story's Twig code through the real component and compares the whole markup with the story HTML (snapshot written by `story-markup.mjs`, kept current by `story-parity.mjs` in CI). Would have caught the outdated FlashMessages story markup (2026-11-05). |

### Layouts

| # | Status | Name | Kind | Pages | Sections | Complexity | Depends on | Design workflow |
|---|--------|------|------|-------|----------|------------|------------|-----------------|
| 9 | - [x] | [`<twig:ui:Layout:Stack>`](#9-twiguilayoutstack) | layout | 140 | 4 | S | - | no |
| 10 | - [x] | [`<twig:ui:Layout:Cluster>`](#10-twiguilayoutcluster) | layout | 110 | 6 | S | - | no |
| 11 | dropped | [`<twig:ui:Layout:Columns>`](#11-twiguilayoutcolumns) | layout | 20 | 4 | S | - | no |
| 11b | - [x] | `<twig:ui:Layout:Tiles>` (equal items, from #11; steps follow the screen width: in a narrow area a page sets `--ps-tiles-columns`; revisit with container-based steps if that repeats) | layout | - | - | S | - | no |
| 20 | - [ ] | [`<twig:ui:Layout:Page>`](#20-twiguilayoutpage) | layout | 150 | 5 | XL | `<twig:ui:Header>`, `<twig:ui:SideMenu>`, `<twig:ui:Breadcrumb>`, `<twig:ui:Tabs>`, `<twig:ui:Button>`, `<twig:ui:Dropdown>`, `<twig:ui:Offcanvas>`, `<twig:ui:Alert> (extend)`, `<twig:ui:Toast>`, `<twig:ui:Layout:Cluster>` | yes |
| 21 | - [ ] | [`<twig:ui:Layout:Standalone>`](#21-twiguilayoutstandalone) | layout | 7 | 3 | M | `<twig:ui:Alert> (extend)`, `<twig:ui:Card>`, `<twig:ui:Link>`, `<twig:ui:Layout:Stack>` | no |
| 30 | - [ ] | [`<twig:ui:Layout:FormSection>`](#30-twiguilayoutformsection) | layout | 110 | 1 | S | `<twig:ui:FormRow> + ui_kit_layout form theme` | no |

### Components

| # | Status | Name | Kind | Pages | Sections | Complexity | Depends on | Design workflow |
|---|--------|------|------|-------|----------|------------|------------|-----------------|
| 1 | - [x] | [`<twig:ui:Icon>`](#1-twiguiicon) | content | 120 | 7 | S | - | no |
| 2 | - [x] | [`<twig:ui:Button>`](#2-twiguibutton) | action | 140 | 6 | M | `<twig:ui:Icon>` | no |
| 3 | - [x] | [`<twig:ui:IconButton>`](#3-twiguiiconbutton) | action | 45 | 6 | S | `<twig:ui:Button>`, `<twig:ui:Icon>` | no |
| 4 | - [x] | [`<twig:ui:Link>`](#4-twiguilink) | navigation | 30 | 5 | S | `<twig:ui:Icon>` | no |
| 5 | - [ ] | [`<twig:ui:Badge>`](#5-twiguibadge) | content | 30 | 5 | S | `<twig:ui:Icon>` | no |
| 6 | - [ ] | [`<twig:ui:HelpTip>`](#6-twiguihelptip) | feedback | 25 | 4 | S | `<twig:ui:IconButton>` | no |
| 7 | - [ ] | [`<twig:ui:Alert> (extend)`](#7-twiguialert-extend) | feedback | 75 | 6 | M | `<twig:ui:Icon>`, `<twig:ui:IconButton>` | no |
| 8 | - [ ] | [`<twig:ui:Spinner>`](#8-twiguispinner) | feedback | 12 | 5 | S | - | no |
| 12 | - [ ] | [`<twig:ui:Card>`](#12-twiguicard) | content | 120 | 5 | M | `<twig:ui:Icon>`, `<twig:ui:Badge>`, `<twig:ui:HelpTip>` | no |
| 13 | - [ ] | [`<twig:ui:Dropdown>`](#13-twiguidropdown) | action | 70 | 8 | M | `<twig:ui:Button>`, `<twig:ui:IconButton>` | no |
| 14 | - [ ] | [`<twig:ui:Breadcrumb>`](#14-twiguibreadcrumb) | navigation | 150 | 2 | S | `<twig:ui:Icon>` | no |
| 15 | - [ ] | [`<twig:ui:Tabs>`](#15-twiguitabs) | navigation | 160 | 6 | M | `<twig:ui:Badge>`, `<twig:ui:IconButton>`, `<twig:ui:Icon>` | no |
| 16 | - [ ] | [`<twig:ui:Offcanvas>`](#16-twiguioffcanvas) | overlay | 150 | 2 | S | `<twig:ui:IconButton>`, `<twig:ui:Spinner>` | no |
| 17 | - [ ] | [`<twig:ui:Toast>`](#17-twiguitoast) | feedback | 40 | 4 | S | `<twig:ui:Icon>`, `<twig:ui:IconButton>` | no |
| 18 | - [ ] | [`<twig:ui:Header>`](#18-twiguiheader) | navigation | 150 | 1 | L | `<twig:ui:IconButton>`, `<twig:ui:Dropdown>`, `<twig:ui:Modal>`, `<twig:ui:Badge>`, `<twig:ui:Tabs>` | yes |
| 19 | - [x] | [`<twig:ui:SideMenu>`](#19-twiguisidemenu) | navigation | 150 | 1 | M | `<twig:ui:IconButton>`, `<twig:ui:Icon>` | no |
| 22 | - [ ] | [`<twig:ui:Modal>`](#22-twiguimodal) | overlay | 30 | 7 | M | `<twig:ui:IconButton>`, `<twig:ui:Button>`, `<twig:ui:Spinner>`, `<twig:ui:Layout:Cluster>` | no |
| 23 | - [ ] | [`data-ps-confirm (ConfirmDialog on <twig:ui:Modal>)`](#23-data-ps-confirm-confirmdialog-on-twiguimodal) | overlay | 25 | 6 | S | `<twig:ui:Modal>`, `<twig:ui:Button>` | no |
| 24 | - [ ] | [`<twig:ui:Pagination>`](#24-twiguipagination) | navigation | 60 | 3 | M | `<twig:ui:IconButton>`, `<twig:ui:Icon>` | no |
| 25 | - [ ] | [`<twig:ui:EmptyState>`](#25-twiguiemptystate) | feedback | 30 | 4 | S | `<twig:ui:Icon>`, `<twig:ui:Button>`, `<twig:ui:Spinner>` | no |
| 26 | - [ ] | [`<twig:ui:FormRow> + ui_kit_layout form theme`](#26-twiguiformrow--ui_kit_layout-form-theme) | form | 110 | 3 | L | `<twig:ui:HelpTip>`, `<twig:ui:Alert> (extend)`, `<twig:ui:Link>` | no |
| 27 | - [ ] | [`<twig:ui:Switch>`](#27-twiguiswitch) | form | 45 | 5 | S | `<twig:ui:FormRow> + ui_kit_layout form theme` | no |
| 28 | - [ ] | [`<twig:ui:Check>`](#28-twiguicheck) | form | 60 | 5 | S | `<twig:ui:FormRow> + ui_kit_layout form theme` | no |
| 29 | - [ ] | [`<twig:ui:InputGroup>`](#29-twiguiinputgroup) | form | 45 | 4 | M | `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Button>`, `<twig:ui:IconButton>` | no |
| 31 | - [ ] | [`<twig:ui:Form>`](#31-twiguiform) | form | 100 | 3 | M | `<twig:ui:Alert> (extend)`, `<twig:ui:Button>`, `<twig:ui:Layout:FormSection>`, `<twig:ui:Layout:Cluster>` | no |
| 32 | - [ ] | [`<twig:ui:Grid>`](#32-twiguigrid) | data | 60 | 1 | XL | `<twig:ui:Card>`, `<twig:ui:Pagination>`, `<twig:ui:EmptyState>`, `<twig:ui:Dropdown>`, `<twig:ui:IconButton>`, `<twig:ui:Badge>`, `<twig:ui:Switch>`, `<twig:ui:Check>`, `<twig:ui:Modal>`, `data-ps-confirm (ConfirmDialog on <twig:ui:Modal>)`, `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Progress>` | yes |
| 33 | - [ ] | [`<twig:ui:DataTable>`](#33-twiguidatatable) | data | 20 | 4 | M | `<twig:ui:EmptyState>`, `<twig:ui:IconButton>`, `<twig:ui:Dropdown>` | no |
| 34 | - [ ] | [`<twig:ui:DescriptionList>`](#34-twiguidescriptionlist) | content | 10 | 3 | S | `<twig:ui:Badge>`, `<twig:ui:Link>` | no |
| 35 | - [ ] | [`<twig:ui:KpiRow>`](#35-twiguikpirow) | data | 8 | 3 | M | `<twig:ui:IconButton>`, `<twig:ui:Icon>`, `<twig:ui:Spinner>` | no |
| 36 | - [ ] | [`<twig:ui:TranslatableField>`](#36-twiguitranslatablefield) | form | 55 | 2 | M | `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Dropdown>`, `<twig:ui:Tabs>`, `<twig:ui:InputGroup>` | no |
| 37 | - [ ] | [`<twig:ui:ChoiceTree>`](#37-twiguichoicetree) | form | 32 | 3 | M | `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Check>`, `<twig:ui:Button>` | no |
| 38 | - [ ] | [`<twig:ui:EntitySearch>`](#38-twiguientitysearch) | form | 12 | 4 | L | `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:IconButton>`, `<twig:ui:EmptyState>`, `<twig:ui:Tag>`, `<twig:ui:Modal>` | yes |
| 39 | - [ ] | [`<twig:ui:Tag>`](#39-twiguitag) | content | 8 | 4 | S | `<twig:ui:IconButton>` | no |
| 40 | - [ ] | [`<twig:ui:ChoiceTable>`](#40-twiguichoicetable) | form | 9 | 2 | M | `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Check>` | no |
| 41 | - [ ] | [`<twig:ui:FileUpload>`](#41-twiguifileupload) | form | 22 | 3 | M | `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Button>`, `data-ps-confirm (ConfirmDialog on <twig:ui:Modal>)` | no |
| 42 | - [ ] | [`<twig:ui:Progress>`](#42-twiguiprogress) | feedback | 6 | 3 | S | - | no |
| 43 | - [ ] | [`<twig:ui:Collapse>`](#43-twiguicollapse) | content | 12 | 3 | S | `<twig:ui:Button>`, `<twig:ui:Icon>` | no |
| 44 | - [ ] | [`<twig:ui:Avatar>`](#44-twiguiavatar) | content | 6 | 4 | S | `<twig:ui:Icon>` | no |
| 45 | - [ ] | [`<twig:ui:MultistoreField>`](#45-twiguimultistorefield) | form | 25 | 2 | S | `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Check>`, `<twig:ui:Alert> (extend)`, `<twig:ui:Dropdown>` | no |
| 46 | - [ ] | [`data-ps-toggle (conditional field group behaviour)`](#46-data-ps-toggle-conditional-field-group-behaviour) | form | 20 | 2 | S | `<twig:ui:FormRow> + ui_kit_layout form theme` | no |
| 47 | - [ ] | [`<twig:ui:ShowcaseCard>`](#47-twiguishowcasecard) | content | 9 | 1 | S | `<twig:ui:IconButton>`, `<twig:ui:Link>`, `<twig:ui:Card>` | no |
| 48 | - [ ] | [`<twig:ui:CollectionEditor>`](#48-twiguicollectioneditor) | form | 6 | 1 | M | `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:IconButton>`, `<twig:ui:EmptyState>`, `<twig:ui:Button>` | no |
| 49 | - [ ] | [`<twig:ui:PasswordField>`](#49-twiguipasswordfield) | form | 5 | 3 | S | `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:IconButton>`, `<twig:ui:Progress>` | no |
| 50 | - [ ] | [`<twig:ui:Stepper>`](#50-twiguistepper) | form | 3 | 2 | L | `<twig:ui:Card>`, `<twig:ui:Button>`, `<twig:ui:Modal>`, `<twig:ui:Progress>` | yes |
| 51 | - [ ] | [`<twig:ui:MessageThread>`](#51-twiguimessagethread) | content | 2 | 2 | M | `<twig:ui:Avatar>`, `<twig:ui:Card>`, `<twig:ui:Modal>`, `<twig:ui:Button>` | no |
| 52 | - [ ] | [`<twig:ui:ModuleCard>`](#52-twiguimodulecard) | data | 4 | 2 | M | `<twig:ui:Dropdown>`, `<twig:ui:Badge>`, `<twig:ui:Check>`, `<twig:ui:EmptyState>` | no |
| 53 | - [ ] | [`<twig:ui:ChoiceCards>`](#53-twiguichoicecards) | form | 3 | 2 | S | `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Badge>`, `<twig:ui:Icon>` | no |
| 54 | - [ ] | [`<twig:ui:ColorPicker>`](#54-twiguicolorpicker) | form | 2 | 1 | S | `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Badge>` | no |

## Candidates

### 1. `<twig:ui:Icon>`

One icon element for the whole kit, decorative by default (aria-hidden) or named with a label; replaces raw <i class="material-icons"> everywhere.

Done 2026-11-12 as inline SVG, not a font (DECISIONS.md #35): every Material Symbol ships in `ui/icons/material-symbols/`, logos in `ui/icons/brand/`; used by Alert, FlashMessages, PasswordField, the password requirements and the login layout.

- Role: component, kind: content, complexity: S, pages: 120
- Sections: shell, grid, forms, cards, alerts, buttons, toolbar
- Builds on: ux:icon (local SVG files)
- Depends on: -

**Variants (props)**

- name (required)
- label: when set, role=img + aria-label; when absent, aria-hidden=true
- size: xs | sm | md | lg | xl | xxl (em of the text, centred on its capitals)
- flipRtl: bool (arrow_back, keyboard_backspace, chevrons)
- name: a Material Symbols name, or brand:… for a logo (no set prop)
- filled: bool (Material Symbols only)
- attribute pass-through (class for color tokens only, data-ps-*)

**Inconsistencies to harmonize**

- no legacy icon-* font (icon-caret-up, icon-remove, icon-download, icon-flag) and no material-icons class in kit pages
- icons in card headers, badges and buttons never read aloud as ligature words

**Problems**

- Icons everywhere are not aria-hidden: screen readers read 'settings', 'bug_report', 'add_circle'
- Legacy icon fonts (icon-caret-up, icon-remove, icon-download) mixed with Material icons
- rtl-flip applied on some back arrows and not others
- Status conveyed by icon + colour only (check/clear)

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/administration.html.twig:14`
- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Blocks/Table/empty_row.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/CustomerService/CustomerThread/Block/timeline.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Columns/Content/status.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Product/Combination/paginated_list_header.html.twig:5`
- `src/PrestaShopBundle/Resources/views/Admin/Component/Ui/alert.html.twig:13`

**Pages**

- Layout/default_layout.html.twig (shell)
- Common/Grid/* (all listing pages)
- Sell/Order/Order/view.html.twig
- Sell/Catalog/Product/edit.html.twig
- Sell/Customer/view.html.twig
- every card header and toolbar button of Configure/*, Improve/*, Sell/*

### 2. `<twig:ui:Button>`

The one button: renders <button type="button"> or <a> when href is set, with variant, size, icon, loading and disabled-with-reason states; covers every Save, Cancel, toolbar action, CTA and link-styled-as-button.

Done 2026-11-13 with `variant` (`danger` is `destructive`, the kit's solid red), `size`, `href`/`type`, `icon` + `iconPosition`, `loading` and `disabled`; kit form buttons render it through `button_widget` of `ui_kit_layout.html.twig`; used by the login pages. Not built yet: `disabledReason`, `method` + `confirm`, the copy action, the modal target, `target=_blank`.

- Role: component, kind: action, complexity: M, pages: 140
- Sections: card footers, toolbar, modals, empty states, alerts, row actions
- Builds on: Bootstrap 5 .btn (ui Button story: AllVariants, Outline, Sizes, States, WithIcon)
- Depends on: `<twig:ui:Icon>`

**Variants (props)**

- variant: primary | secondary | outline-primary | outline-secondary | danger | outline-danger | link
- size: sm | md | lg
- href: renders <a>; without href renders <button>
- type: button (default) | submit | reset; never missing
- icon + iconPosition (start|end), icon from ui:Icon
- state: loading (aria-busy, spinner, disabled) | disabled
- disabledReason: visible/describedby text explaining why it is disabled
- method + confirm props for destructive actions (POST form + data-ps-confirm instead of GET link)
- target=_blank: adds rel=noopener and a visually hidden 'opens in a new tab'
- modal target (data-bs-toggle=modal) for buttons that open a dialog
- copy action (data-ps-action=copy with live feedback) for the API secret
- attribute pass-through: id, name, value, form, data-ps-*, aria-*

**Inconsistencies to harmonize**

- BS3 btn-default, pull-right, float-right, btn-lg on modal footers, two primary buttons side by side, missing type, duplicate id=save-button

**Problems**

- Save buttons with no type attribute default to submit, also inside forms where they should not (Load/Delete mapping, memcache Add/Test)
- Destructive actions are GET <a> styled btn-primary (regenerate secret, disable modules, clear sessions)
- Links used as buttons (<a href="#">, <button href="#">, javascript:void(0))
- BS3 classes (btn-default, pull-right) and broken attribute spacing (class="…"id="save-button")
- Disabled toolbar buttons keep href=#, still focusable

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/ShopParameters/OrderStates/Blocks/form.html.twig:24`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/AdminAPI/ApiClient/edit.html.twig:11`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/Security/clear_form.html.twig:31`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Design/Theme/Blocks/delete_theme_modal.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/documents.html.twig:77`
- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Blocks/EmptyState/discount.html.twig:8`

**Pages**

- every create/edit page (Configure/*, Improve/*, Sell/*)
- every settings page
- every listing page (toolbar Add new X)
- Sell/Order/Order/view.html.twig
- Login/Ui/*.html.twig

**Visual note** (http://localhost:8001/admin-dev/index.php/login, `<outDir>/button--1.jpg`): Sign in is a full-width solid dark primary button, and the password reveal is a dark square icon button stuck to the field. 'Forgot your password?' is a small underlined right-aligned text link, not a button.

**Visual note** (http://localhost:8001/admin-dev/index.php/login (forgot password view), `<outDir>/button--2.jpg`): The actions are not full width here. A Cancel outline button and a Send reset link primary button sit together on the right, smaller than Sign in. The footer copyright is no longer underlined as a link, unlike on the sign-in view.

### 3. `<twig:ui:IconButton>`

Icon-only button or link with a required accessible label and an optional tooltip showing it; used for row actions, close, delete, edit, refresh, prev/next.

Done 2026-11-13 as a square `<twig:ui:Button>` (same `variant`, `size`, `href`/`type`, `loading`, `disabled`) with required `icon` and `label` (its `aria-label`) and `tooltip`; "ghost" is `variant="link"`. Tooltips start on first hover or focus (`ui/src/js/components/tooltips.js`). Used by the login social links. Not built yet: the close variant (Bootstrap's `.btn-close` stays for now).

- Role: component, kind: action, complexity: S, pages: 45
- Sections: grid row actions, card headers, collections, modals, pagination, order view
- Builds on: ui:Button; Bootstrap .btn-close
- Depends on: `<twig:ui:Button>`, `<twig:ui:Icon>`

**Variants (props)**

- icon (required), label (required, becomes aria-label and tooltip text)
- tooltip: bool (show label on hover/focus)
- variant: ghost | outline | primary | danger
- size: sm | md
- href -> <a>, otherwise <button type=button>
- disabled: renders aria-disabled and drops href
- close variant replacing every &times; / × close control
- attribute pass-through: data-ps-*, aria-controls, aria-expanded

**Problems**

- Accessible name only in data-original-title tooltips, not read by screen readers
- Close controls as <i>, <a href=#>×</a> or &times; with untranslated 'Close' aria-label
- Previous/next order arrows and pagination arrows without names

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Columns/Content/action.html.twig:22`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/order_navigation.html.twig:8`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/ShopParameters/Search/FormTheme/aliases.html.twig:23`
- `src/PrestaShopBundle/Resources/views/Admin/Common/Kpi/kpi_row.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Customer/Blocks/View/addresses.html.twig:12`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Product/FormTheme/categories.html.twig:22`

**Pages**

- Common/Grid/Columns/Content/action.html.twig (all listings)
- Sell/Order/Order/view.html.twig
- Sell/Customer/view.html.twig
- Improve/International/TaxRulesGroup/edit.html.twig
- Configure/ShopParameters/Search/form.html.twig
- Improve/Shipping/Carriers/form.html.twig
- Common/Kpi/kpi_row.html.twig

### 4. `<twig:ui:Link>`

Text link with optional icon; external prop adds rel=noopener and a 'opens in a new tab' cue; covers Learn more, Manage X, doc links and Back to list links.

Done 2026-11-13 with `href`, `icon` + `iconPosition`, `back` and `external` (no automatic `open_in_new` icon: add it where a new tab would surprise); used by the login back link, the copyright link and "Back to sign in". Replaces the Helpers/Icon Link story.

- Role: component, kind: navigation, complexity: S, pages: 30
- Sections: showcase cards, form rows (external_link), alerts, grid footers, view pages
- Builds on: Bootstrap icon-link
- Depends on: `<twig:ui:Icon>`

**Variants (props)**

- href (required), label/content block
- external: bool (target=_blank, rel=noopener noreferrer, hidden new-tab text, optional open_in_new icon)
- icon + iconPosition, icon flip-rtl for back links
- back: bool preset (arrow_back, rtl flip) for 'Back to list'
- attribute pass-through

**Problems**

- target=_blank without rel and without cue everywhere (Learn more, Manage X, author links, previews)
- Raw doc URLs printed as link text
- Back arrow flipped in RTL on some pages only

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Attribute/index.html.twig:19`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Design/Cms/Blocks/listing_panel_footer.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Shipping/Carriers/Blocks/information_block.html.twig:9`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/Blocks/import_panel.html.twig:17`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/International/EmailBodyTranslation/index.html.twig:10`

<details>
<summary>Pages (11 entries)</summary>

- Configure/AdvancedParameters/AdminAPI/index.html.twig
- Configure/AdvancedParameters/Webservice/index.html.twig
- Improve/Shipping/Carriers/index.html.twig
- Improve/Shipping/Carriers/form.html.twig
- Sell/Catalog/Attribute/index
- Sell/Catalog/Features/FeatureValue/index
- Sell/Catalog/Categories/index
- Improve/Design/Cms/index.html.twig
- Improve/Design/MailTheme/preview.html.twig
- Sell/Order/Order/preview.html.twig
- Error/error.html.twig

</details>

### 5. `<twig:ui:Badge>`

Small pill for a state, a count or a flag; status variant adds an icon and text so meaning is not colour only; custom colour variant for order statuses with computed contrast.

- Role: component, kind: content, complexity: S, pages: 30
- Sections: grid cells, card headers (counts), view pages, module manager, logs legend
- Builds on: Bootstrap 5 .badge (ui Badge story: AllVariants, Pill, Counter, InContext)
- Depends on: `<twig:ui:Icon>`

**Variants (props)**

- variant: neutral | primary | success | warning | danger | info | dark
- kind: status (icon + text) | count | label
- color: arbitrary hex with server-side contrast (order status), no inline text colour hack
- pill: bool
- label for counts in headings (visually hidden context: '3 linked customers')
- severity preset 0-4 for logs
- attribute pass-through

**Inconsistencies to harmonize**

- BS4 badge-* vs BS5 bg-* mix, custom BEM default-address badge, unstyled .badge

**Problems**

- Same class means state, count or emphasis
- Colour-only meaning (green/red counts on invoice statuses)
- Counts in headings read without context
- Inline background-color with only two text colours

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Columns/Content/badge.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Columns/Content/color.html.twig:8`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/history.html.twig:11`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/BusinessEntity/Blocks/View/_status_badge.html.twig:2`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/LogsPage/Blocks/severity_level.html.twig:15`
- `src/PrestaShopBundle/Resources/views/Admin/Module/Includes/card_list.html.twig:56`

<details>
<summary>Pages (11 entries)</summary>

- Common/Grid/Columns/Content/badge.html.twig, color.html.twig, severity_level.html.twig (listings)
- Sell/Order/Order/view.html.twig
- Sell/Order/Order/index.html.twig
- Sell/Customer/view.html.twig
- Sell/CustomerService/CustomerThread/view.html.twig
- Sell/BusinessEntity/view.html.twig
- Sell/BusinessEntity/edit.html.twig
- Module/manage.html.twig
- Sell/Order/Invoices/invoices.html.twig
- Configure/AdvancedParameters/LogsPage/index.html.twig
- Improve/Design/positions.html.twig

</details>

### 6. `<twig:ui:HelpTip>`

Focusable '?' help trigger opening a popover on click/focus/hover, tied to its field or section with aria-describedby; replaces help-box, label-tooltip, icon-question and pstooltip help anchors.

- Role: component, kind: feedback, complexity: S, pages: 25
- Sections: card headers, form labels, grid toolbar, order view forms
- Builds on: Common/HelpBox/helpbox.html.twig, Bootstrap 5 Popover/Tooltip (ui Popover, Tooltip stories)
- Depends on: `<twig:ui:IconButton>`

**Variants (props)**

- content (text or block), title (optional)
- label: accessible name of the trigger (default 'Help about {subject}')
- trigger: click+focus (default) | hover+focus
- placement: top | end | bottom | start
- mode: tooltip (short) | popover (rich)
- describes: id of the field it explains (aria-describedby)
- attribute pass-through

**Inconsistencies to harmonize**

- data-content escaping, sentences glued without spaces, three help markups

**Problems**

- Empty <span> with hover-only trigger: no keyboard or touch access, no accessible name
- Help text not tied to the field
- Very long concatenated text inside popovers

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/performance.html.twig:67`
- `src/PrestaShopBundle/Resources/views/Admin/Common/HelpBox/helpbox.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/macros.html.twig:39`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:166`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/ShopParameters/TrafficSeo/Meta/Blocks/url_schema_configuration.html.twig:15`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/merge_shipment_form.html.twig:21`

<details>
<summary>Pages (14 entries)</summary>

- Configure/AdvancedParameters/administration.html.twig
- Configure/AdvancedParameters/performance.html.twig
- Configure/AdvancedParameters/Security/customers.html.twig
- Configure/AdvancedParameters/Security/employees.html.twig
- Configure/ShopParameters/TrafficSeo/Meta/index
- Improve/International/Geolocation/index.html.twig
- Improve/International/Translations/translations_settings.html.twig
- Improve/Design/MailTheme/index.html.twig
- Improve/Design/positions.html.twig
- Improve/Shipping/Preferences/preferences.html.twig
- Module/alerts.html.twig
- Module/updates.html.twig
- Sell/Order/Order/view.html.twig
- TwigTemplateForm (label_help_box, label tooltip) on all forms

</details>

### 7. `<twig:ui:Alert> (extend)`

Extend the existing alert to cover every inline, flash, contextual and JS-revealed message: title, lists, actions, dismissible, live-region politeness, hidden initial state, expandable body.

- Role: component, kind: feedback, complexity: M, pages: 75
- Sections: page intros, flash messages, form errors, multistore infotips, context notices, JS feedback
- Builds on: <twig:ui:Alert> (src/PrestaShopBundle/Twig/Component/Ui/Alert.php)
- Depends on: `<twig:ui:Icon>`, `<twig:ui:IconButton>`

**Variants (props)**

- type: info | success | warning | danger (+ existing 8 types)
- title (optional heading), content block holding paragraphs or lists
- live: none (static help, no role) | polite (status) | assertive (role=alert, danger only)
- dismissible + translated close label
- hidden: rendered hidden for JS to reveal, with live region
- actions slot (Review pending, Change file, I have read the disclaimer)
- expandable: 'Read more' body with correct aria-expanded/aria-controls
- icon: default per type, or none
- list of messages (flash with several entries, form error summary)
- attribute pass-through: id, data-ps-ref, data-ps-target

**Inconsistencies to harmonize**

- p/div/span .alert-text, role=alert on static text, alert-danger for advice, untranslated 'Close'

**Problems**

- role=alert on static help announces it as urgent on load
- JS-revealed alerts not in live regions (import, email test, partner offers, order create)
- <ul> inside <p class=alert-text> is invalid HTML
- Same message with two severities on sibling pages
- Sentences built from separate translated fragments (payment mismatch)

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Component/Ui/alert.html.twig:13`
- `src/PrestaShopBundle/Resources/views/Admin/macros.html.twig:19`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:1226`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/AdminAPI/index.html.twig:9`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/payments_alert.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/BusinessEntity/list.html.twig:6`

<details>
<summary>Pages (10 entries)</summary>

- Component/Ui/flash_messages.html.twig, `<twig:ui:FlashMessages>` (was Layout/Ui/_flash_alerts.html.twig)
- Login/Ui/*.html.twig
- Common/multistore-infotip.html.twig (Backup, FeatureFlag, Permission, Profiles, RequestSql, Security, OrderStates, Tags, Meta, SearchEngines, Language, State, Tax)
- Configure/AdvancedParameters/* (AdminAPI, Backup, RequestSql, FeatureFlag, Email, Import, Webservice)
- Configure/ShopParameters/TrafficSeo/Meta/index, customer_preferences, Tags
- Improve/Design/ImageSettings, Theme, positions; Improve/International/Geolocation, Language, Currency, EmailBodyTranslation
- Improve/Payment/*, Improve/Shipping/Carriers/index, Sell/Address/index, Sell/BusinessEntity/*
- Sell/Catalog/Features, Manufacturer, Suppliers, Stock/overview, Categories, Monitoring, Product/pre_select_shop
- Sell/Customer/index, view; Sell/Order/Cart/view; Sell/Order/Order/create, view
- Security/compromised.html.twig

</details>

### 8. `<twig:ui:Spinner>`

Loading indicator with visible or visually hidden text inside role=status; used inline, in buttons and as a block loading state.

- Role: component, kind: feedback, complexity: S, pages: 12
- Sections: help sidebar, modals, JS lists, async actions, product category tree
- Builds on: Bootstrap 5 .spinner-border (ui Spinner story)
- Depends on: -

**Variants (props)**

- label (required, visually hidden by default)
- showLabel: bool
- size: sm | md
- kind: border | grow
- attribute pass-through (data-ps-ref, hidden)

**Problems**

- Spinners and loading GIFs with no text alternative
- Static 'loop'/'autorenew' icons used as loaders
- Three loading patterns on the order view page

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/Email/Blocks/test_email_sending.html.twig:18`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/system_information.html.twig:227`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/International/TaxRulesGroup/Blocks/tax_rules_list.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/products.html.twig:25`
- `src/PrestaShopBundle/Resources/views/Admin/Module/Includes/modal_import.html.twig:1`

<details>
<summary>Pages (9 entries)</summary>

- Layout/default_layout.html.twig (ajax spinner)
- Configure/AdvancedParameters/Email/index.html.twig
- Configure/AdvancedParameters/system_information.html.twig
- Module/manage.html.twig
- Improve/International/TaxRulesGroup/edit.html.twig
- Sell/Order/Order/view.html.twig
- Sell/Order/Order/create.html.twig
- Sell/Catalog/Product/edit.html.twig
- Sell/Catalog/Product/Combination/paginated_list

</details>

### 9. `<twig:ui:Layout:Stack>`

Vertical stack placing cards, alerts, grids and sections with a consistent gap; replaces mb-*/mt-3 utilities between page blocks.

- Role: layout, kind: layout, complexity: S, pages: 140
- Sections: page content, card bodies, modal bodies, side columns
- Builds on: none (Bootstrap vstack + gap utilities)
- Depends on: -

**Variants (props)**

- gap: xs | sm | md | lg | xl
- as: div | section | ul (list semantics when the items are a list)
- align: stretch | start | center
- attribute pass-through for hooks and ARIA only

**Problems**

- Spacing between page blocks set per page with mb-3/mt-3/mx-3 and <hr>
- Components carry their own outer margins (.alert, .card)

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/Backup/index.html.twig:1`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Design/ImageSettings/form-settings.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Monitoring/index.html.twig:13`
- `src/PrestaShopBundle/Resources/views/Admin/Layout/Ui/login_layout.html.twig:10`

**Pages**

- every kit page content slot (Configure/*, Improve/*, Sell/*)
- Login/Ui/*.html.twig

### 10. `<twig:ui:Layout:Cluster>`

Horizontal row of actions or inline items that wraps and aligns (start, end, between); used for card footers (Cancel + Save), toolbar actions, modal footers, filter rows and inline button groups.

- Role: layout, kind: layout, complexity: S, pages: 110
- Sections: card footers, modal footers, toolbar, alerts actions, empty state CTAs, filters
- Builds on: none (Bootstrap flex utilities)
- Depends on: -

**Variants (props)**

- justify: start | end | between | center
- gap: sm | md | lg
- wrap: bool (default true)
- stackBelow: sm | md (stack full width on mobile, DOM order = visual order)
- named slots start / end for 'Cancel left, Save right' without floats
- attribute pass-through for hooks and ARIA only

**Inconsistencies to harmonize**

- float-right, d-inline-flex + float-right, d-flex justify-content-end, justify-content-between, ml-auto, card-footer-left, clearfix &nbsp;

**Problems**

- Five markups for the same footer alignment across sibling CRUD forms
- Floated buttons: DOM order differs from visual order, no stacking on mobile
- Empty <form> wrappers used only for spacing on the order view action bar

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Improve/International/Zone/Blocks/form.html.twig:8`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/International/Locations/State/Blocks/form.html.twig:20`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/International/Currency/Blocks/form.html.twig:62`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/AdminAPI/ApiClient/form.html.twig:45`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Discount/form.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/order_actions.html.twig:22`

**Pages**

- every create/edit page (Configure/*, Improve/*, Sell/*)
- every settings page
- every modal (Helpers/bootstrap_popup.html.twig and hand-written modals)
- Component/Layout/toolbar.html.twig
- Sell/Order/Order/view.html.twig (action bar)
- Sell/Catalog/Discount/form.html.twig

### 11. `<twig:ui:Layout:Columns>`

Responsive columns for main + side panels, two equal info columns, centred narrow content and card groups; stacks under a breakpoint.

> **Dropped on 2026-11-05** (`DECISIONS.md` #34): no Columns layout. Equal items (dashboard zones, logo cards, card groups, KPI rows) go to `<twig:ui:Layout:Tiles>` (`columns` 2, 3, 4, 6). A main + side split is placed by the page, or by the layout that needs it (`<twig:ui:Layout:Page>` #20 first), with the Bootstrap grid. Rules settled while designing it, to keep wherever a split is built: the side is never wider than main (`sideWidth` quarter 9/3, third 8/4, half 6/6) and its place is a position (start, end) that the DOM order follows; one breakpoint for the whole back office; an empty side gives main the full width; the side can be an `<aside>` with an accessible name; a sticky side starts at the breakpoint, offset by `--ps-columns-sticky-top`, under dropdowns; never a `main` tag (the shell owns `<main>`).

- Role: layout, kind: layout, complexity: S, pages: 20
- Sections: page content, view pages, dashboard zones, logo cards
- Builds on: none (Bootstrap grid)
- Depends on: -

**Variants (props)**

- ratio: 1-1 | 2-1 | 1-2 | 3-1 | narrow-centred
- breakpoint: md | lg | xl (stack below)
- gap: md | lg
- slots: main / side, or repeated column blocks
- sticky side column (positions selection panel, order summary)
- attribute pass-through for hooks and ARIA only

**Inconsistencies to harmonize**

- col-md-8/4, col-md-4/8, col-lg-6/6, col-lg-2/10, col-xl-10 centred, .container wrappers

**Problems**

- Breakpoints vary from page to page for the same split
- Very narrow columns (Permission col-lg-2 role list)
- Module hook output dropped into a bare .row (customer view)

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/ImportPage/import.html.twig:10`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/system_information.html.twig:9`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/Permission/index.html.twig:13`
- `src/PrestaShopBundle/Resources/views/Admin/Dashboard/index.html.twig:34`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Design/Theme/Blocks/logo_configuration.html.twig:6`

<details>
<summary>Pages (15 entries)</summary>

- Configure/AdvancedParameters/ImportPage/import.html.twig
- Configure/AdvancedParameters/RequestSql/create.html.twig
- Configure/AdvancedParameters/RequestSql/edit.html.twig
- Configure/AdvancedParameters/system_information.html.twig
- Configure/AdvancedParameters/ImportDataConfiguration/index.html.twig
- Configure/AdvancedParameters/Permission/index.html.twig
- Dashboard/index
- Improve/Design/Theme/index.html.twig
- Improve/International/Currency/index.html.twig
- Sell/Customer/view.html.twig
- Sell/Order/Order/view.html.twig
- Sell/Order/Cart/view.html.twig
- Sell/CustomerService/CustomerThread/view.html.twig
- Sell/BusinessEntity/view.html.twig
- Sell/Order/Invoices/invoices.html.twig

</details>

### 12. `<twig:ui:Card>`

The section container: header (title with heading level, icon, count, help tip, actions slot), body, footer slot, optional collapsible; replaces card/h3.card-header, div.card-header > h3.card-header-title, CardType card_row and nested cards.

- Role: component, kind: content, complexity: M, pages: 120
- Sections: forms, settings, view pages, grid panel, side panels
- Builds on: Bootstrap 5 .card (ui Card story); TwigTemplateForm card_row block
- Depends on: `<twig:ui:Icon>`, `<twig:ui:Badge>`, `<twig:ui:HelpTip>`

**Variants (props)**

- title, subtitle, headingLevel: 2 | 3 | 4 (follows page outline)
- icon (decorative, optional)
- count: rendered as ui:Badge count with context label
- help: ui:HelpTip next to the title
- actions slot in the header (Add, Edit, View full conversation), never inside the heading element
- footer slot (holds a ui:Layout:Cluster)
- variant: default | subtle | flush (no nested card for borders)
- collapsible: bool + expanded (Required fields, history of files)
- printOnlyHeader / screen-only parts (order view details)
- as: section | article | div
- attribute pass-through: id, data-ps-*, data-role

**Inconsistencies to harmonize**

- three header markups, arbitrary icons, duplicate id configuration_fieldset_general, orphan .card-footer outside a card

**Problems**

- Three header markups for the same card
- Card titles always h3 whatever the page outline
- Icons arbitrary and repeated for unrelated sections, read aloud
- Cards nested in cards only to get a border
- Interactive Add button inside an h3.card-header

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/administration.html.twig:14`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:1593`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/basic_information.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Customer/Blocks/View/addresses.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/details_card.html.twig:5`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/ExtraPropertyDefinition/Blocks/form.html.twig:11`

**Pages**

- every create/edit and settings page (Configure/*, Improve/*, Sell/*)
- Common/Grid/grid_panel.html.twig (all listings)
- Sell/Order/Order/view.html.twig
- Sell/Order/Order/create.html.twig
- Sell/Customer/view.html.twig
- Sell/Order/Cart/view.html.twig
- Sell/BusinessEntity/view.html.twig
- TwigTemplateForm card_row (CardType forms: ExtraPropertyDefinition, Discount)

### 13. `<twig:ui:Dropdown>`

Menu of secondary actions behind a labelled toggle (text button, split button or kebab icon); items are links, buttons or POST forms with confirm, with dividers, headers and disabled items. Used for row actions, grid actions, bulk actions, More actions and module actions.

- Role: component, kind: action, complexity: M, pages: 70
- Sections: grid row actions, grid actions (settings), bulk actions, order view action bar, order create, module manager, view pages, CMS save split
- Builds on: Bootstrap 5 dropdown (ui Dropdown story: Split, Sizes, Directions, Dark, WithForms); Helpers/dropdown_menu.html.twig
- Depends on: `<twig:ui:Button>`, `<twig:ui:IconButton>`

**Variants (props)**

- trigger: button (label) | split (default action + toggle) | icon (kebab/gear, required label)
- items: link | button | form (method POST + CSRF + confirm) | divider | header
- disabled toggle (bulk actions until a row is selected) with reason
- align: start | end; direction: down | up
- responsive: collapse inline buttons into the menu under a breakpoint (CMS save + preview)
- items from a hook (actionGetAdminOrderButtons) rendered through the same item API
- attribute pass-through on trigger and items (data-ps-*)

**Inconsistencies to harmonize**

- <a> toggles without href, <div data-toggle>, <div> menu with <li>, legacy caret icons, sr-only text outside the toggle

**Problems**

- Kebab and gear toggles have no accessible name or are not focusable
- POST actions rendered as <a href=#>
- Invalid list markup in the module action menu
- Stray hidden inputs and sr-only labels outside the toggle

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Columns/Content/action.html.twig:66`
- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Blocks/grid_actions.html.twig:10`
- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Blocks/bulk_actions.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Module/Includes/action_menu.html.twig:2`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/extra_order_button_actions.html.twig:31`
- `src/PrestaShopBundle/Resources/views/Admin/Helpers/dropdown_menu.html.twig:8`

<details>
<summary>Pages (14 entries)</summary>

- Common/Grid/Columns/Content/action.html.twig, Blocks/grid_actions.html.twig, Blocks/bulk_actions.html.twig (all listings)
- Helpers/dropdown_menu.html.twig
- Sell/Order/Order/view.html.twig
- Sell/Order/Order/create.html.twig
- Module/manage.html.twig
- Module/alerts.html.twig
- Module/updates.html.twig
- Improve/Design/MailTheme/index.html.twig
- Improve/Design/MailTheme/preview.html.twig
- Improve/Design/positions.html.twig
- Improve/Design/Cms/add.html.twig
- Improve/Design/Cms/edit.html.twig
- Sell/Catalog/Manufacturer/view
- Sell/Catalog/Product/Combination/paginated_list

</details>

### 14. `<twig:ui:Breadcrumb>`

Breadcrumb trail of any depth inside <nav aria-label>, the current item is text with aria-current=page; used by the page template and by category paths (CMS, catalog categories).

- Role: component, kind: navigation, complexity: S, pages: 150
- Sections: page header, category listings
- Builds on: Bootstrap 5 breadcrumb (ui Breadcrumb story: Default, SingleItem)
- Depends on: `<twig:ui:Icon>`

**Variants (props)**

- items: [{label, href?, icon?}]; last item rendered as text
- label (translated nav name)
- item action slot (Edit on the current category) kept outside the link
- attribute pass-through

**Problems**

- Current item is a link with aria-current and class active
- Untranslated aria-label 'Breadcrumb', missing on category breadcrumbs
- Only two levels; edit context never shown
- Breadcrumb wrapped in a full card with inline styles

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Component/Layout/toolbar.html.twig:11`
- `src/PrestaShopBundle/Resources/views/Admin/Component/LegacyLayout/toolbar.html.twig:9`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Design/Cms/Blocks/breadcrumb.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Categories/Blocks/breadcrumb.html.twig:6`

**Pages**

- Component/Layout/toolbar.html.twig (all pages)
- Component/LegacyLayout/toolbar.html.twig
- Improve/Design/Cms/index.html.twig
- Sell/Catalog/Categories/index

### 15. `<twig:ui:Tabs>`

Tabs or pills in two modes: link tabs (page level-3 sub-tabs, aria-current) and in-page tab panes with full ARIA (role tab/tabpanel, aria-selected, aria-controls), error marker, counts, scroll arrows and vertical layout.

- Role: component, kind: navigation, complexity: M, pages: 160
- Sections: page header sub-tabs, form tabs (NavigationTabType), order view details, order create, theme logos, permissions
- Builds on: Bootstrap 5 nav/tab (ui Navs story: Tabs, Pills, Fill, Justified, Vertical, TabsWithContent)
- Depends on: `<twig:ui:Badge>`, `<twig:ui:IconButton>`, `<twig:ui:Icon>`

**Variants (props)**

- mode: links (navigation, aria-current=page) | panes (role=tablist)
- variant: tabs | pills
- orientation: horizontal | vertical
- items: label, icon, count (ui:Badge), notification counter, error flag with text cue
- scrollable: arrow buttons on narrow screens
- unique id per instance (no hard-coded form-nav / head_tabs)
- panes slots, print: show all panes
- extra items from hooks (displayAdminOrderTabLink/Content)
- attribute pass-through

**Problems**

- aria-selected/aria-controls wrong or missing (order view, order create, theme logos, permissions aria-controls=home)
- Error on a tab shown by colour class only
- Scroll arrows are divs
- Hard-coded ids prevent two tab sets on a page

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Component/Layout/toolbar.html.twig:128`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:1408`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/details.html.twig:19`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/Create/customer.html.twig:47`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Design/Theme/Blocks/logo_configuration.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/Permission/Blocks/profile_tabs.html.twig:6`

**Pages**

- Component/Layout/toolbar.html.twig (head tabs, all level-3 pages)
- TwigTemplateForm navigation_tab_widget (Product/edit, Improve/Shipping/Carriers/form)
- Sell/Order/Order/view.html.twig
- Sell/Order/Order/create.html.twig
- Improve/Design/Theme/index.html.twig
- Configure/AdvancedParameters/Permission/index.html.twig
- TwigTemplateForm translatable_widget use_tabs

### 16. `<twig:ui:Offcanvas>`

Side panel with dialog semantics, titled header, close button and focus management; hosts the documentation help sidebar and future side panels.

- Role: component, kind: overlay, complexity: S, pages: 150
- Sections: help sidebar, mobile menu
- Builds on: Bootstrap 5 offcanvas (ui Offcanvas story)
- Depends on: `<twig:ui:IconButton>`, `<twig:ui:Spinner>`

**Variants (props)**

- placement: end | start
- title (required, aria-labelledby)
- body: content block or iframe/object with title and loading state (ui:Spinner)
- footer slot
- backdrop: bool
- attribute pass-through (id, data-ps-*)

**Problems**

- No dialog role, no focus management
- Close is <a href=#>× with no name
- <object> without title or fallback
- Translated title not purified (filter order)

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/layout.html.twig:70`
- `src/PrestaShopBundle/Resources/views/Admin/Common/_partials/_sidebar.html.twig:5`

**Pages**

- Admin/layout.html.twig (sidebar_right, all pages with enableSidebar)
- Common/_partials/_sidebar.html.twig

### 17. `<twig:ui:Toast>`

Transient notification announced in a polite live region for async results (saved, copied, AJAX confirmation, growl), stacked in one container per page.

- Role: component, kind: feedback, complexity: S, pages: 40
- Sections: shell (ajax confirmation), async toggles, copy to clipboard, JS actions
- Builds on: Bootstrap 5 toast (ui Toast story: Stacked, ColorVariants, Placement); legacy growl and #ajax_confirmation
- Depends on: `<twig:ui:Icon>`, `<twig:ui:IconButton>`

**Variants (props)**

- type: success | info | warning | danger
- message, optional action
- autohide + delay; danger never autohides
- container placement (fixed, one per page)
- JS API through data-ps-target container

**Problems**

- Two global message containers with different markup and inline display:none
- Copy-to-clipboard and async saves give no announced feedback

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Layout/default_layout.html.twig:132`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/AdminAPI/ApiClient/form.html.twig:14`
- `ui/src/stories/components/Toast.stories.js:1`

**Pages**

- Layout/default_layout.html.twig (#ajax_confirmation, #content-message-box)
- Common/Grid/Columns/Content/toggle.html.twig (async toggle on listings)
- Configure/AdvancedParameters/AdminAPI/ApiClient/create.html.twig
- Configure/AdvancedParameters/AdminAPI/ApiClient/edit.html.twig
- Improve/Design/positions.html.twig
- Sell/Order/Order/view.html.twig
- Sell/Catalog/Product/edit.html.twig

### 18. `<twig:ui:Header>`

Back office top bar: logo and version, quick access, global search (mobile overlay), debug/maintenance state, View my store, notifications center, employee menu and the multistore context bar with shop switcher.

- Role: component, kind: navigation, complexity: L, pages: 150
- Sections: shell
- Builds on: Component/Layout Twig components (Symfony LegacyX/X), header JS (js/components/header/*)
- Depends on: `<twig:ui:IconButton>`, `<twig:ui:Dropdown>`, `<twig:ui:Modal>`, `<twig:ui:Badge>`, `<twig:ui:Tabs>`

**Variants (props)**

- debug / maintenance state badges with text, not HTML tooltips
- multistore: all shops | group | shop, colour with contrast, locked context
- notifications with tabs and counts
- mobile: search overlay, menu toggle button
- displayBackOfficeTop hook slot kept in place
- product page multistore variant

**Problems**

- Empty unlabeled ajax-spinner button
- Mobile menu toggle and avatar trigger are not buttons
- Notification button without name
- Shop switcher custom modal with wrong aria-labelledby
- Whole header duplicated in LegacyLayout

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Layout/default_layout.html.twig:28`
- `src/PrestaShopBundle/Resources/views/Admin/Component/Layout/notifications_center.html.twig:5`
- `src/PrestaShopBundle/Resources/views/Admin/Component/Layout/employee_dropdown.html.twig:5`
- `src/PrestaShopBundle/Resources/views/Admin/Component/Layout/search_form.html.twig:5`
- `src/PrestaShopBundle/Resources/views/Admin/Component/Layout/multistore_header.html.twig:6`

**Pages**

- Layout/default_layout.html.twig
- Component/Layout/*.html.twig (notifications_center, employee_dropdown, search_form, quick access, multistore_header)
- Component/LegacyLayout/*.html.twig
- Component/MultiShop/*.html.twig
- Component/quick_access_add_modal.html.twig

### 19. `<twig:ui:SideMenu>`

Collapsible main navigation with level-1 icons, category titles, level-2/3 submenus, collapse toggle persisted per employee and mobile off-canvas.

Done 2026-11-13 without the collapsed mode: `sections` (titles, items, submenus), `label`, content for the `displayAdminNavBarBeforeEnd` hook; owns its rows and buttons (no IconButton), icons through `<twig:ui:Icon>` with an `extension` fallback; a parent row opens its submenu (Bootstrap collapse); offcanvas-md drawer opened by the header. `NavBar::getSections()` feeds it on Symfony pages with `PS_UI_KIT=1`; legacy pages keep the old menu. Optional `badge` on items ("New", with the PrestaShop mark), Storybook only until tabs carry one. Not built yet: the collapsed mode (icons only, persisted per employee), the header's menu button.

- Role: component, kind: navigation, complexity: M, pages: 150
- Sections: shell
- Builds on: ui Sidebar story (Default, SubMenuExpanded); nav_bar.ts
- Depends on: `<twig:ui:IconButton>`, `<twig:ui:Icon>`

**Variants (props)**

- collapsed | expanded (persisted)
- mobile off-canvas with close button
- aria-current on the active item, aria-expanded on submenus
- category headings

**Problems**

- Collapse toggle is a <span>, close is an <i>
- No aria-expanded/aria-current
- Duplicated in LegacyLayout

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Component/Layout/nav_bar.html.twig:5`
- `ui/src/stories/components/Sidebar.stories.js:1`

**Pages**

- Component/Layout/nav_bar.html.twig
- Component/LegacyLayout/nav_bar.html.twig

### 20. `<twig:ui:Layout:Page>`

The one page template: places the header, side menu and the fixed slots title, breadcrumb, actions, tabs, flash alerts and content; light (iframe) variant without chrome; replaces layoutHeaderToolbarBtn/layoutTitle/help_link set both in Twig and in controllers.

- Role: layout, kind: layout, complexity: XL, pages: 150
- Sections: page header, toolbar, help, flash alerts, content
- Builds on: Admin/layout.html.twig + Component/Layout/Toolbar Twig component
- Depends on: `<twig:ui:Header>`, `<twig:ui:SideMenu>`, `<twig:ui:Breadcrumb>`, `<twig:ui:Tabs>`, `<twig:ui:Button>`, `<twig:ui:Dropdown>`, `<twig:ui:Offcanvas>`, `<twig:ui:Alert> (extend)`, `<twig:ui:Toast>`, `<twig:ui:Layout:Cluster>`

**Variants (props)**

- slots: title (default from menu or custom block: order 'Order #id from Customer', business entity avatar + name + status badge), subtitle, breadcrumb, actions, tabs, alerts, content
- actions: list of ui:Button (href, modal target, disabled with reason, icon) declared in one place; collapse into a menu or floating button on mobile
- help: link or ui:Offcanvas sidebar; persistent when no other action
- mode: default | light (iframe, liteDisplaying) | no-header (showContentHeader=false)
- multistore header slot
- hook slots kept in place (displayDashboardToolbarTopMenu, displayDashboardTop, displayAdminAfterHeader)
- skip link + <main> landmark, h1 always
- optional side region next to the content (order and customer summaries, permission profiles, import help): rules carried from #11 (dropped)
- print: hide chrome

**Inconsistencies to harmonize**

- toolbar buttons from template vs controller, empty layoutHeaderToolbarBtn arrays, help_link legacy tab names vs _legacy_controller, h4 subtitle

**Problems**

- Header actions declared in two places (template and controller)
- No <main> landmark, no skip link
- Toolbar <a> buttons running JS or opening modals; two data-toggle on one element
- Subtitle h4 after h1; ids built from an undefined 'table' variable
- Wording and casing of 'Add new X' / 'New X' / 'Editing X' differ
- Three near-duplicate layouts copy the <head>

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Layout/default_layout.html.twig:28`
- `src/PrestaShopBundle/Resources/views/Admin/Component/Layout/toolbar.html.twig:5`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/Employee/index.html.twig:6`
- `src/PrestaShopBundle/Controller/Admin/Configure/AdvancedParameters/PerformanceController.php:55`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/header.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/BusinessEntity/view.html.twig:2`

**Pages**

- Admin/layout.html.twig
- Layout/default_layout.html.twig
- Layout/light_layout.html.twig
- Component/Layout/toolbar.html.twig
- every Symfony page: Configure/*, Improve/*, Sell/*, Module/*, Dashboard/index

### 21. `<twig:ui:Layout:Standalone>`

Page template for pages without back office chrome: centred card with logo, title, alerts, content and footer links; used by login, reset password, required actions, error pages and the security interstitial.

- Role: layout, kind: layout, complexity: M, pages: 7
- Sections: auth, errors, security
- Builds on: Layout/Ui/login_layout.html.twig (kit login layout, the reference)
- Depends on: `<twig:ui:Alert> (extend)`, `<twig:ui:Card>`, `<twig:ui:Link>`, `<twig:ui:Layout:Stack>`

**Variants (props)**

- slots: logo, title (h1), alerts (flash), content, footer (copyright, social links), back link
- width: narrow (auth) | medium (error)
- illustration slot (error pages)
- dir=rtl, <main> landmark

**Inconsistencies to harmonize**

- three near-duplicate error templates, error403 inside the full layout, 'fluid-container', IE conditional comments

**Problems**

- Legacy login: no <main>, h1 holding only an image, untranslated copyright
- Error pages: no h1, exception never passed, back button relies on history.back()
- Security interstitial: risky action first, strings in Admin.Catalog domain

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Layout/Ui/login_layout.html.twig:10`
- `src/PrestaShopBundle/Resources/views/Admin/Layout/login_layout.html.twig:19`
- `src/PrestaShopBundle/Resources/views/Admin/Error/error.html.twig:21`
- `src/PrestaShopBundle/Resources/views/Admin/Security/compromised.html.twig:12`

**Pages**

- Login/Ui/login.html.twig
- Login/Ui/reset_password.html.twig
- Login/Ui/required_actions.html.twig
- Error/error.html.twig
- Error/error403.html.twig
- Error/error404.html.twig
- Security/compromised.html.twig

### 22. `<twig:ui:Modal>`

Dialog with title (aria-labelledby), sizes, optional close, body and footer slots, form wrapping, static/non-closable mode, AJAX-loaded body with loading state and iframe body; replaces bootstrap_popup, hand-written modals and JS-built ones.

- Role: component, kind: overlay, complexity: M, pages: 30
- Sections: confirmations, bulk forms, grid SQL query, import progress, order view actions, module manager, discount type
- Builds on: Helpers/bootstrap_popup.html.twig, js/components/modal/*.ts, Bootstrap 5 modal (ui Modal story)
- Depends on: `<twig:ui:IconButton>`, `<twig:ui:Button>`, `<twig:ui:Spinner>`, `<twig:ui:Layout:Cluster>`

**Variants (props)**

- title (required), headingLevel
- size: sm | md | lg | xl | fullscreen; scrollable; centred
- closable: bool; backdrop static + keyboard (never block Esc without reason)
- body / footer slots (footer holds ui:Layout:Cluster)
- form: wraps content in a form, or footer submit linked by form="id"
- remote body: URL loaded with ui:Spinner / skeleton and aria-busy
- iframe body (FormIframeModal, combination edit, tax rule)
- progress mode (import, bulk ajax) with ui:Progress and live status text
- states inside the body (start, processing, success, failure) announced
- rendered once on demand, not one per row/action
- attribute pass-through: id, data-ps-*

**Problems**

- No role=dialog / aria-labelledby / aria-modal on most modals; close without name
- Inline <script> per modal; malformed markup (discount modal never closes .modal)
- Hundreds of hidden modals in the module manager DOM
- Labels pointing to non-existent fields (forward modal)
- Mixed btn-lg / normal and Close vs Cancel wording

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Helpers/bootstrap_popup.html.twig:5`
- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Blocks/grid_actions.html.twig:29`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Discount/create_discount_modal.html.twig:5`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/CustomerService/CustomerThread/Block/forward_thread_modal.html.twig:5`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/Modal/split_shipment_modal.html.twig:21`
- `src/PrestaShopBundle/Resources/views/Admin/Module/Includes/modal_import.html.twig:1`

<details>
<summary>Pages (22 entries)</summary>

- Helpers/bootstrap_popup.html.twig
- Common/Grid/grid.html.twig (SQL query modal, all listings)
- Configure/AdvancedParameters/ImportDataConfiguration/index.html.twig
- Improve/International/Country/index.html.twig
- Improve/International/Locations/State/index.html.twig
- Improve/Design/ImageSettings/index.html.twig
- Improve/Design/Theme/index.html.twig
- Improve/International/Currency/create.html.twig
- Improve/International/Currency/edit.html.twig
- Improve/International/TaxRulesGroup/edit.html.twig
- Sell/Catalog/Categories/index
- Sell/Catalog/Monitoring/index
- Sell/Catalog/Discount/index
- Sell/Catalog/Product/edit
- Sell/Customer/index.html.twig
- Sell/Order/Order/index.html.twig
- Sell/Order/Order/view.html.twig
- Sell/CustomerService/CustomerThread/view.html.twig
- Sell/CustomerService/OrderReturn/edit.html.twig
- Module/manage.html.twig
- Improve/Shipping/Carriers/form.html.twig
- Component/quick_access_add_modal.html.twig

</details>

### 23. `data-ps-confirm (ConfirmDialog on <twig:ui:Modal>)`

One confirm behaviour for risky actions: attributes on a ui:Button/Dropdown item open a ui:Modal with title, message, cancel and a danger or primary confirm labelled with the action; replaces data-confirm-*, data-modal-*, btn-confirm-form and per-page ConfirmModal wiring.

- Role: component, kind: overlay, complexity: S, pages: 25
- Sections: destructive row and bulk actions, regenerate secret, feature flags, theme use/delete, delete file, module actions
- Builds on: js/components/modal/confirm-modal.ts
- Depends on: `<twig:ui:Modal>`, `<twig:ui:Button>`

**Variants (props)**

- title, message (required), confirm label (the action verb, not 'Yes'), cancel label
- tone: danger | primary
- method POST + CSRF for the confirmed action
- extra field in the body (delete image type switch, delete module folder checkbox)
- dynamic message from the row/selection

**Inconsistencies to harmonize**

- data-confirm-* vs data-modal-* attribute sets

**Problems**

- Two attribute conventions; each page wires its own ConfirmModal
- Confirm without message (Performance Disable)
- Delete theme confirm not danger and labelled 'Yes'
- Handlers bound on every open submit the wrong form after a cancel
- Destructive GET links fire without JS

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/AdminAPI/ApiClient/edit.html.twig:11`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/FeatureFlag/index.html.twig:62`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Design/ImageSettings/form-regenerate-thumbnails.html.twig:27`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Design/Theme/Blocks/delete_theme_modal.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Actions/Row/submit.html.twig:20`
- `src/PrestaShopBundle/Resources/views/Admin/Module/Includes/modal_confirm.html.twig:4`

<details>
<summary>Pages (11 entries)</summary>

- Configure/AdvancedParameters/AdminAPI/ApiClient/edit.html.twig
- Configure/AdvancedParameters/performance.html.twig
- Configure/AdvancedParameters/FeatureFlag/index.html.twig
- Improve/Design/ImageSettings/index.html.twig
- Improve/Design/Theme/index.html.twig
- Improve/International/TaxRulesGroup/edit.html.twig
- Sell/Catalog/Manufacturer/add|edit|view
- Sell/Catalog/Suppliers/add|edit
- Common/Grid/Actions/Row/*, Actions/Bulk/* (all listings)
- Module/manage.html.twig
- Sell/CustomerService/OrderReturn/edit.html.twig

</details>

### 24. `<twig:ui:Pagination>`

Pagination in <nav aria-label>: first/prev/pages/next/last, optional jump-to-page, 'x-y of z' summary and page size select; server (links) and client (JS) modes.

- Role: component, kind: navigation, complexity: M, pages: 60
- Sections: grid, JS lists, order products
- Builds on: Bootstrap 5 pagination (ui Pagination story); themes/default/js/bundle/pagination.js
- Depends on: `<twig:ui:IconButton>`, `<twig:ui:Icon>`

**Variants (props)**

- mode: links (server) | buttons (JS, data-ps-*)
- variant: full | compact (quicknav)
- showJump, showSummary, showPageSize + sizes
- aria-current on the current page, aria-disabled on disabled ends
- size: sm | md
- hidden when one page
- translated labels (Previous, Next, nav label)

**Problems**

- Non-standard nohref/psurl/psmax/pslimit attributes; legacy pagination.js on every grid page
- Hard-coded English labels
- Three divergent templates plus the order products pager
- Page numbers as spans; label for= mismatched

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Common/pagination.html.twig:5`
- `src/PrestaShopBundle/Resources/views/Admin/Common/pagination_quicknav.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Common/javascript_pagination.html.twig:11`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/products.html.twig:101`

**Pages**

- Common/Grid/Blocks/pagination.html.twig (all listings)
- Common/pagination.html.twig
- Common/pagination_quicknav.html.twig
- Common/javascript_pagination.html.twig (Product/edit combinations, specific prices, TaxRulesGroup/edit)
- Sell/Order/Order/view.html.twig

### 25. `<twig:ui:EmptyState>`

What a list or block shows when it has nothing: icon or illustration, title, message, actions; distinguishes 'nothing yet' (create CTA) from 'no match' (clear filters) and doubles as loading state.

- Role: component, kind: feedback, complexity: S, pages: 30
- Sections: grid, view page cards, JS lists, order create
- Builds on: Common/Grid/Blocks/EmptyState/*
- Depends on: `<twig:ui:Icon>`, `<twig:ui:Button>`, `<twig:ui:Spinner>`

**Variants (props)**

- kind: empty | no-results | loading | unavailable
- illustration (alt='') or icon (neutral, not 'warning')
- title, message, actions slot (primary CTA, 'or' secondary, clear filters)
- size: compact (inside a card or table row) | full
- as table row (colspan) inside ui:DataTable / ui:Grid
- attribute pass-through (hidden, data-ps-ref)

**Problems**

- Warning icon for a neutral empty result; same message for empty and no-match
- Illustrations without alt, invalid height=auto, BS3 img-responsive
- Five markups; wrong copy ('No cart is available' in Groups, 'No products has been found')
- CTA <a> without href

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Blocks/EmptyState/_default.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Blocks/EmptyState/order.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Product/Combination/empty_state.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Manufacturer/Blocks/View/products.html.twig:104`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Customer/Blocks/View/groups.html.twig:45`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/documents.html.twig:116`

<details>
<summary>Pages (12 entries)</summary>

- Common/Grid/Blocks/Table/empty_row.html.twig + EmptyState/* (all listings: attachment, credit_slip, customer, discount, order, product, supplier)
- Sell/Catalog/Product/Combination/empty_state.html.twig, empty_filters_state.html.twig, loading_state.html.twig
- Sell/Catalog/Suppliers/view
- Sell/Catalog/Manufacturer/view
- Sell/Customer/view.html.twig
- Sell/Order/Order/view.html.twig
- Sell/Order/Order/create.html.twig
- Sell/Order/Cart/view.html.twig
- Sell/CustomerService/OrderReturn/edit.html.twig
- Improve/Payment/PaymentMethods/payment_methods.html.twig
- Module/alerts.html.twig
- Configure/AdvancedParameters/AdminAPI/ApiClient/create|edit

</details>

### 26. `<twig:ui:FormRow> + ui_kit_layout form theme`

The field row and the kit form theme that renders it: label (required marker with text, help tip), widget, help, errors tied with aria-describedby/aria-invalid, prepended/appended alert and external link, disabling switch, multistore checkbox; usable as a component for hand-built rows and as the theme for form_row.

- Role: component, kind: form, complexity: L, pages: 110
- Sections: every form, grid filters, modals
- Builds on: TwigTemplateForm/ui_kit_layout.html.twig (kit BS5 theme), prestashop_ui_kit form themes, macros
- Depends on: `<twig:ui:HelpTip>`, `<twig:ui:Alert> (extend)`, `<twig:ui:Link>`

**Variants (props)**

- layout: horizontal (label column) | vertical (label above)
- label | label null (empty column) | false; labelTag (legend for groups)
- required: visible marker + text alternative
- help: text (aria-describedby) or ui:HelpTip
- errors: single inline, several listed (no hover popover), per-locale for translatable
- alert prepend/append (ui:Alert), external link prepend/append/below (ui:Link)
- readonly value row (replaces disabled inputs with fake placeholders, plaintext rows)
- action row (a button in the widget column for Clear sessions, Disable non-native modules, Update exchange rates)
- disabled with visible reason
- fieldset/legend for radios, checkboxes, switches
- attribute pass-through on the row (data-ps-*, hidden)

**Inconsistencies to harmonize**

- four row implementations, form_theme declared per form vs global, typo checboxes-widget

**Problems**

- Help and errors not tied to inputs in BS4 themes
- Several errors only readable on a hover popover
- Hand-built rows with <label> without for
- text_widget forces aria-label '%inputId% input'
- Required shown as a red * only

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit.html.twig:48`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:706`
- `src/PrestaShopBundle/Resources/views/Admin/macros.html.twig:227`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/ui_kit_layout.html.twig:9`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/ShopParameters/preferences.html.twig:21`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Address/Blocks/form.html.twig:22`

**Pages**

- TwigTemplateForm/prestashop_ui_kit.html.twig, prestashop_ui_kit_base.html.twig, bootstrap_4_horizontal_layout.html.twig, ui_kit_layout.html.twig
- Admin/macros.html.twig (form_group_row, form_widget_with_error, label_with_help)
- every create/edit and settings page
- Configure/ShopParameters/TrafficSeo/Meta/* (ps.form_group_row)
- Improve/Design/MailTheme/index, Translations, Currency exchange rates (hand-built rows)
- Sell/Order/Order/create.html.twig (hand-built rows)
- Configure/AdvancedParameters/ImportDataConfiguration (hand-built rows)

### 27. `<twig:ui:Switch>`

Yes/No toggle rendered as a real switch (role=switch or labelled radio group in a fieldset); the SwitchType widget of the kit theme and a component for hand-built switches (hook status, order create shipping, grid toggle cells).

- Role: component, kind: form, complexity: S, pages: 45
- Sections: settings forms, entity forms, grid toggle cells, positions, order create
- Builds on: TwigTemplateForm switch_widget (ps-switch), Bootstrap 5 form-switch (ui ChecksRadios story)
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`

**Variants (props)**

- label (required, visible or visually hidden in grid cells with row context)
- showChoices: Yes/No labels (translated)
- checked, disabled + reason (forced by env)
- size: sm (grid) | md
- async: data-ps-action toggles via URL with Toast feedback
- disabling switch: controls a dependent section (aria-controls)
- attribute pass-through

**Inconsistencies to harmonize**

- SwitchType vs CheckboxType for the same boolean (order states), hard-coded Off/On

**Problems**

- Radios without labels when show_choices is off
- No fieldset/legend; not exposed as a switch
- Grid toggle reads 'On radio' without row context
- Hand-written copies drift from SwitchType

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:562`
- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Columns/Content/toggle.html.twig:20`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Design/positions.html.twig:89`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/Create/shipping.html.twig:33`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/FeatureFlag/FormTheme/feature_flag_form.html.twig:6`

**Pages**

- TwigTemplateForm switch_widget (all forms with SwitchType)
- Common/Grid/Columns/Content/toggle.html.twig (listings with status toggles)
- Improve/Design/positions.html.twig
- Sell/Order/Order/create.html.twig
- Configure/AdvancedParameters/FeatureFlag/index.html.twig
- Configure/AdvancedParameters/administration, performance, Employee/index, Webservice/index
- Configure/ShopParameters/* preferences
- Sell/Customer/create|edit, Sell/Catalog/Categories, Manufacturer, Suppliers, Discount, Product/edit

### 28. `<twig:ui:Check>`

Checkbox and radio (single or group) with label, description and indeterminate state; the kit theme widget for checkbox/radio/expanded choice and the component for select-all and row selection checkboxes.

- Role: component, kind: form, complexity: S, pages: 60
- Sections: forms, grid bulk selection, choice tables, order view refund, positions
- Builds on: TwigTemplateForm md-checkbox / form-check-round; Bootstrap 5 form-check (ui ChecksRadios story)
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`

**Variants (props)**

- type: checkbox | radio
- label (required; visually hidden allowed with context, e.g. 'Select order #12')
- description / suffix slot (count badge outside the label text)
- indeterminate (select-all)
- inline group, fieldset + legend for groups
- disabled
- attribute pass-through

**Inconsistencies to harmonize**

- md-checkbox + form-check double wrapper, nested <label>

**Problems**

- Select-all and bulk checkboxes without accessible name
- Category filter radios with the name outside the label
- Nested label inside label (positions)
- Expanded choices without fieldset/legend

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:640`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:673`
- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Blocks/bulk_actions_select_all.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Invoices/Blocks/generate_by_status.html.twig:14`

**Pages**

- TwigTemplateForm checkbox_widget, radio_widget, choice_widget_expanded (all forms)
- Common/Grid/Blocks/bulk_actions_select_all.html.twig, Columns/Content/bulk_action.html.twig (all listings)
- Sell/Order/Invoices/invoices.html.twig
- Sell/Order/Order/view.html.twig
- Improve/Design/positions.html.twig
- Module/manage.html.twig
- Sell/Catalog/Discount/create|edit
- Configure/ShopParameters/OrderStates/create|edit

### 29. `<twig:ui:InputGroup>`

Input with addons: unit/currency prefix or suffix, generate button, 'add my IP', date picker button, search icon, character counter (allowed or recommended length) announced politely; the kit theme widgets for number/money/date/generatable/counter inputs.

- Role: component, kind: form, complexity: M, pages: 45
- Sections: settings forms, entity forms, grid filters, order view refund
- Builds on: TwigTemplateForm widgets; Bootstrap 5 input-group (ui InputGroup story)
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Button>`, `<twig:ui:IconButton>`

**Variants (props)**

- prepend / append: text (unit, currency, %), ui:Button (Generate, Add my IP), ui:IconButton (calendar, submit check)
- counter: allowed | recommended, position before/after, aria-describedby + polite live update
- type: text | number (inputmode) | date | search
- date range (from/to pair)
- sizes: sm | md
- attribute pass-through on the input

**Inconsistencies to harmonize**

- three counter markups, custom-select vs form-select

**Problems**

- Counters not announced nor linked to the input
- Date picker icon decorative but acts as a control
- Field names and init differ between date range forms

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:1103`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:1018`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:504`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:1064`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/form_max_length.html.twig:5`

<details>
<summary>Pages (12 entries)</summary>

- TwigTemplateForm (integer/number with unit, money, date picker, date range, generatable, IP, text with counters, form_max_length, currency_money)
- Configure/ShopParameters/maintenance, preferences, product_preferences, OrderPreferences
- Improve/Shipping/Preferences/preferences.html.twig
- Improve/Shipping/Carriers/form.html.twig
- Sell/Order/Invoices/invoices.html.twig
- Sell/Order/CreditSlip/index.html.twig
- Sell/Order/Delivery/slip.html.twig
- Sell/Catalog/Categories/create|edit (recommended length)
- Improve/Design/Cms/add|edit
- Sell/Catalog/Discount/create|edit
- Configure/AdvancedParameters/AdminAPI/ApiClient/create|edit
- Sell/Order/Order/view.html.twig

</details>

### 30. `<twig:ui:Layout:FormSection>`

Places form rows inside a section: row spacing, horizontal/vertical label alignment, column breaks and nested sub-sections (conditional groups); used inside a ui:Card for every CRUD and settings form and by the CardType/card_row theme block.

- Role: layout, kind: layout, complexity: S, pages: 110
- Sections: forms
- Builds on: TwigTemplateForm .form-wrapper / card_row
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`

**Variants (props)**

- layout: horizontal | vertical (passed to the rows it holds)
- labelWidth: sm | md (one value instead of col-md-3/col-sm-2/col-xxl-4)
- columns: 1 | 2 (column breaker)
- title / intro slot (replaces empty-label rows holding an alert, <hr> separators)
- as: div | fieldset (legend)
- attribute pass-through for hooks (data-ps-ref of a conditional group)

**Problems**

- Label/input widths vary between blocks
- <hr> and empty-label rows used as section separators
- Two markups for the same section (hand-written card vs CardType)

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:1593`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/Employee/Blocks/form.html.twig:12`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/Email/Blocks/email_configuration.html.twig:18`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/Create/summary.html.twig:62`

**Pages**

- every create/edit page (Configure/*, Improve/*, Sell/*)
- every settings page
- TwigTemplateForm card_row (ExtraPropertyDefinition, Discount)
- Sell/Order/Order/create.html.twig
- Configure/AdvancedParameters/Email/index.html.twig (SMTP/DKIM groups)

### 31. `<twig:ui:Form>`

The form element of a kit page: form_start/end, error summary at the top linked to fields and focused on submit, double-submit guard on Save, unsaved-changes warning on Cancel/navigation, scroll to first error; one per CRUD page, one per settings card.

- Role: component, kind: form, complexity: M, pages: 100
- Sections: CRUD forms, settings forms, modal forms
- Builds on: FormSubmitButton JS, form_errors, prestashop_ui_kit themes
- Depends on: `<twig:ui:Alert> (extend)`, `<twig:ui:Button>`, `<twig:ui:Layout:FormSection>`, `<twig:ui:Layout:Cluster>`

**Variants (props)**

- form (Symfony FormView), action, method, multipart
- errorSummary: bool (ui:Alert danger with links to fields, role=alert)
- guard: double-submit (replaces FormSubmitButton opt-in)
- dirtyWarning: warn before leaving with unsaved changes, and when another card's Save would drop edits
- submit buttons: Save, Save and stay, Save then add another (only one primary)
- rest: form_rest rendered once
- attribute pass-through: id, data-ps-*

**Inconsistencies to harmonize**

- form_errors above widgets on some forms, manual alert loop on others, none elsewhere; form_rest twice; wrong form variable in partials

**Problems**

- Three ways to show form-level errors on sibling CRUD pages; Employee create vs edit differ
- Several Save buttons on one page silently drop other cards' edits (payment preferences saves all four tables)
- Double-submit guard on some forms only
- Cancel loses changes without warning; javascript: Cancel URL in iframe mode

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/Employee/edit.html.twig:8`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/RequestSql/create.html.twig:10`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/ShopParameters/Tags/create.html.twig:11`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Payment/Preferences/Blocks/payment_preferences_form_block.html.twig:10`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/Email/index.html.twig:17`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Discount/form.html.twig:6`

**Pages**

- every create/edit page (Configure/AdvancedParameters/*, Configure/ShopParameters/*, Improve/*, Sell/Catalog/*, Sell/Customer/*, Sell/CustomerService/*, Sell/Address/*, Sell/BusinessEntity/*)
- every settings page (administration, performance, Security, Email, preferences, maintenance, invoices, delivery slips, credit slips, payment/shipping preferences, Localization, Geolocation, ImageSettings, MailTheme, Theme)
- Sell/Catalog/Discount/form.html.twig

### 32. `<twig:ui:Grid>`

New listing component designed from scratch: title and count, grid actions, filters (per column and quick filter links), sortable columns, typed cells, bulk selection and actions, row actions, inline toggles, position reordering, row preview, pagination and empty states, with one consistent behaviour set.

- Role: component, kind: data, complexity: XL, pages: 60
- Sections: listings
- Builds on: Common/Grid Twig blocks + js/components/grid/grid.ts and GridExtensions (stay for non-kit pages)
- Depends on: `<twig:ui:Card>`, `<twig:ui:Pagination>`, `<twig:ui:EmptyState>`, `<twig:ui:Dropdown>`, `<twig:ui:IconButton>`, `<twig:ui:Badge>`, `<twig:ui:Switch>`, `<twig:ui:Check>`, `<twig:ui:Modal>`, `data-ps-confirm (ConfirmDialog on <twig:ui:Modal>)`, `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Progress>`

**Variants (props)**

- header: title (optional), count, grid actions (ui:Dropdown: export, SQL query modal, export to SQL manager, refresh, column toggle)
- filters: per column with labels, Search/Reset, quick filter links (aria-pressed buttons), extra filter slot (product category tree)
- columns: sortable with aria-sort and keyboard, alignment, typed cells (text, link, link group, image with alt, avatar, date <time>, badge, status, colour, severity, toggle, choice, html, price, identifier)
- selection: bulk checkbox column, select all on page / all results, selected count near the bulk menu
- bulk actions: submit, button, ajax with progress modal, modal form, open tabs
- row actions: inline icon buttons + overflow menu, POST with confirm
- position column: drag handle + keyboard move up/down
- row preview (expandable row with aria-expanded)
- clickable rows (first link action)
- empty states: empty vs no match (ui:EmptyState)
- several grids on one page; caption from the title
- hooks displayAdminGridTableBefore/After kept
- footer slot (Back to list)
- one fixed extension set (no per-page lists); no legacy pagination.js
- attribute pass-through (id, data-ps-*)

**Problems**

- Every page hand-picks a different extension set, so identical grids behave differently
- Filter inputs without labels; sorting not keyboard reachable, no aria-sort
- Select-all without name, no selected count, bulk menu far from selection
- Icon-only row actions without names; POST actions as <a href=#>
- Mouse-only drag and drop
- Email embed overrides a non-existent block; tax rules copy of the whole grid
- No caption; header floats wrap badly

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/grid_panel.html.twig:10`
- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Blocks/table.html.twig:27`
- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Blocks/Table/filters_row.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/International/TaxRulesGroup/Blocks/tax_rule_grid_panel.html.twig:11`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/index.html.twig:23`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Product/Grid/grid_panel.html.twig:5`

**Pages**

- Common/Grid/grid_panel.html.twig, grid.html.twig and Blocks/*, Columns/*, Actions/*
- Configure/AdvancedParameters/* (AdminAPI, Backup, Email, Employee, ExtraPropertyDefinition, Logs, Profiles, QuickAccess, RequestSql, Security customers/employees, Webservice)
- Configure/ShopParameters/* (Contacts, Stores, Groups, Title, OrderStates, Search, Tags, Meta, SearchEngines)
- Improve/Design/Cms, ImageSettings; Improve/International/* (Country, Currency, EmailBodyTranslation, Language, State, Tax, TaxRulesGroup, Zone)
- Improve/Shipping/Carriers/index, Sell/Address/index, Sell/BusinessEntity/list
- Sell/Catalog/* (Attachment, Attribute, AttributeGroup, CatalogPriceRule, Categories, Discount, Features, FeatureValue, Manufacturer, Monitoring, Product/index, light_list, Suppliers)
- Sell/Customer/index, view; Sell/CustomerService/* (CustomerThread, OrderMessage, OrderReturn); Sell/Order/* (Order/index, Cart, CreditSlip, Outstanding)

### 33. `<twig:ui:DataTable>`

Simple table for small fixed lists outside the grid (query results, payments, documents, status history, cart lines, email themes, addresses, returned products): caption, scoped headers, named action columns, responsive wrapper, empty row, optional footer form row and expandable detail rows.

- Role: component, kind: data, complexity: M, pages: 20
- Sections: view pages, order view, settings lists, RequestSql
- Builds on: Bootstrap 5 table (ui Tables story)
- Depends on: `<twig:ui:EmptyState>`, `<twig:ui:IconButton>`, `<twig:ui:Dropdown>`

**Variants (props)**

- caption (visible or visually hidden)
- columns with scope, alignment, visually hidden header for action/image columns
- rows slot or rows array; JS row template (<template>) for client-filled tables
- detail row: expandable (aria-expanded/controls) and inline edit row
- footer: totals rows or an add form row (form outside the table, linked by form=)
- variant: striped | hover | bordered | small; responsive scroll inside its own box
- empty row (ui:EmptyState compact)
- row actions (ui:IconButton / ui:Dropdown)
- attribute pass-through (id, data-ps-*)

**Inconsistencies to harmonize**

- grid-table classes reused, id=grid-table on non-grids, N/A vs - vs empty

**Problems**

- <form> directly inside <tr> (add payment) is invalid
- Empty <th> for action columns; no caption or scope
- Inputs without labels in table rows
- No responsive wrapper on some

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/RequestSql/view.html.twig:18`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Design/MailTheme/Blocks/list_mail_themes.html.twig:15`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/payments.html.twig:19`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/documents.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Customer/Blocks/View/groups.html.twig:23`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Manufacturer/Blocks/View/addresses.html.twig:6`

<details>
<summary>Pages (15 entries)</summary>

- Configure/AdvancedParameters/RequestSql/view.html.twig
- Configure/AdvancedParameters/RequestSql/create|edit.html.twig
- Configure/AdvancedParameters/performance.html.twig
- Configure/AdvancedParameters/ImportPage/import.html.twig
- Improve/Design/MailTheme/index.html.twig
- Improve/Design/MailTheme/preview.html.twig
- Improve/Design/Theme/customize_page_layouts.html.twig
- Improve/International/TaxRulesGroup/edit.html.twig
- Sell/Catalog/Manufacturer/view
- Sell/Catalog/Suppliers/view
- Sell/Catalog/Product/edit (specific prices)
- Sell/Customer/view.html.twig
- Sell/Order/Cart/view.html.twig
- Sell/Order/Order/view.html.twig
- Sell/CustomerService/OrderReturn/edit.html.twig

</details>

### 34. `<twig:ui:DescriptionList>`

Read-only label/value pairs as <dl>, horizontal or stacked, with fallback for empty values and badge/link values; replaces <p><strong>Label:</strong>, grid rows with bold labels and disabled inputs used for display.

- Role: component, kind: content, complexity: S, pages: 10
- Sections: view pages, previews, system information
- Builds on: none
- Depends on: `<twig:ui:Badge>`, `<twig:ui:Link>`

**Variants (props)**

- items: [{label, value | block, empty}]
- layout: horizontal | stacked | columns
- empty fallback text (one wording)
- values as ui:Badge (status), ui:Link, copyable text
- colon handled by CSS, not in translated strings
- attribute pass-through

**Problems**

- Four markups, none uses <dl>; colons inside translations
- Broken markup (<p> closed by </h2>) and stray quote in order id formatting
- Colour-only status (inline color:red)

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/system_information.html.twig:20`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Customer/Blocks/View/personal_information.html.twig:22`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/basic_information.html.twig:13`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Cart/Blocks/View/customer_information.html.twig:12`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/BusinessEntity/Blocks/View/company_information.html.twig:2`

**Pages**

- Configure/AdvancedParameters/system_information.html.twig
- Sell/Customer/view.html.twig
- Sell/Order/Order/view.html.twig
- Sell/Order/Order/preview.html.twig
- Sell/Order/Cart/view.html.twig
- Sell/CustomerService/CustomerThread/view.html.twig
- Sell/BusinessEntity/view.html.twig
- Sell/BusinessEntity/edit.html.twig

### 35. `<twig:ui:KpiRow>`

Row of KPI tiles (icon, label, value, trend/sub text) with optional refresh and loading/error state; also the hand-written totals/summary strips of order create, order view and customer view.

- Role: component, kind: data, complexity: M, pages: 8
- Sections: listing tops, order totals, customer orders
- Builds on: Common/Kpi/kpi_row.html.twig + legacy KPI helper (raw HTML)
- Depends on: `<twig:ui:IconButton>`, `<twig:ui:Icon>`, `<twig:ui:Spinner>`

**Variants (props)**

- items: label, value, icon, tone, link, sub text
- variant: kpi (cards) | summary (inline totals, last emphasised)
- refreshable: ui:IconButton with label, loading via aria-busy, error state
- JS-filled values through data-ps-ref
- dl semantics for label/value
- attribute pass-through

**Problems**

- KPI items are raw legacy HTML, cannot be themed
- Refresh icon-only without label; no loading/error state
- Totals strips hand-written with nested cards and hard-coded English

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Common/Kpi/kpi_row.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/Create/summary.html.twig:19`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/products.html.twig:169`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Customer/Blocks/View/orders.html.twig:18`

<details>
<summary>Pages (10 entries)</summary>

- Common/Kpi/kpi_row.html.twig
- Sell/Customer/index.html.twig
- Sell/Order/Cart/index.html.twig
- Sell/Order/Cart/view.html.twig
- Sell/Order/Order/index.html.twig
- Sell/Catalog/Categories/index
- Improve/International/Translations/translations_settings.html.twig
- Sell/Order/Order/create.html.twig
- Sell/Order/Order/view.html.twig
- Sell/Customer/view.html.twig

</details>

### 36. `<twig:ui:TranslatableField>`

Multi-language field: one input per language with a language switcher (dropdown or tabs), error marker per locale, for text, textarea and rich text (TinyMCE); the kit theme widget for TranslatableType and the legacy TranslateType.

- Role: component, kind: form, complexity: M, pages: 55
- Sections: entity forms, settings forms
- Builds on: TwigTemplateForm translatable widgets, translatable-input.ts, translatable-field.ts
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Dropdown>`, `<twig:ui:Tabs>`, `<twig:ui:InputGroup>`

**Variants (props)**

- switcher: dropdown | tabs | hidden locales
- inner widget: text | textarea | rich text | choice | compound (store hours)
- counter (recommended length) per locale
- error per locale shown on the switcher
- copy to link_rewrite hook (data-ps-*)
- initialises itself (no initComponents per page)

**Inconsistencies to harmonize**

- TranslateType vs TranslatableType markup

**Problems**

- Positive tabindex breaks tab order
- Locale items are non-focusable spans; tabs without ARIA
- Two form types with different markup
- Each page must remember initComponents

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:873`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:897`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/translatable_choice.html.twig:1`
- `src/PrestaShopBundle/Form/Admin/Configure/ShopParameters/General/MaintenanceType.php:99`
- `src/PrestaShopBundle/Form/Admin/Catalog/Category/AbstractCategoryType.php:82`

**Pages**

- TwigTemplateForm translatable_widget, translate_text/textarea, translatable_choice (all TranslatableType fields)
- Configure/ShopParameters/* (Contacts, Stores, Title, OrderStates, OrderReturnStates, Meta, product_preferences, maintenance)
- Improve/Design/Cms/*; Improve/International/* (Country, Currency, Tax, EmailBodyTranslation)
- Improve/Shipping/Carriers/form.html.twig
- Sell/Catalog/* (Attachment, Attribute, AttributeGroup, Categories, Features, FeatureValue, Manufacturer, Suppliers, Discount, Product/edit)
- Sell/CustomerService/OrderMessage/*; Sell/Order/Invoices, Delivery, CreditSlip; Sell/CustomerService/OrderReturn/index

### 37. `<twig:ui:ChoiceTree>`

Checkbox or radio tree with expand/collapse, select children, search; for shop association, parent category, category picker and the product listing category filter.

- Role: component, kind: form, complexity: M, pages: 32
- Sections: entity forms, multistore association, product categories
- Builds on: ChoiceTree JS component, choice_tree_widget, shop selector
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Check>`, `<twig:ui:Button>`

**Variants (props)**

- selection: multiple (checkbox) | single (radio)
- autoCheckChildren: bool (always on for shop association)
- expand all / collapse all / unselect buttons
- search field (category picker)
- shop selector: colours, disabled context shop
- ARIA tree semantics (role tree/treeitem, aria-expanded)
- initialises itself

**Inconsistencies to harmonize**

- 'Shop association' vs 'Store association' label

**Problems**

- Tree initialised inconsistently or not at all (Stores, TaxRulesGroup, Country)
- No tree ARIA; radio names outside labels
- Two labels for the same field

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:342`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/material.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/multishop.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Product/FormTheme/categories.html.twig:86`
- `admin-dev/themes/new-theme/js/pages/contacts/ContactsPage.ts`

**Pages**

- TwigTemplateForm choice_tree_widget, material.html.twig, multishop.html.twig
- Configure/AdvancedParameters/Webservice/create|edit
- Configure/ShopParameters/Contact/Contacts/create|edit, Stores/create|edit
- Improve/Design/Cms/add|edit|create_category|edit_category
- Improve/International/Country, Currency, Language, Zone, TaxRulesGroup create
- Sell/Catalog/Attribute, AttributeGroup, Categories, Features, Manufacturer, Suppliers create|edit
- Sell/Catalog/Product/index (category filter), Product/edit (category picker)

### 38. `<twig:ui:EntitySearch>`

Search-as-you-type combobox (customers, products, vouchers, entities) with listbox results, selected items as list/table/tags with remove, empty and no-result states, optional 'Add new' shortcut.

- Role: component, kind: form, complexity: L, pages: 12
- Sections: entity forms, order create, order view, discount
- Builds on: entity_search_input.html.twig, entity-search-input.ts (typeahead), product-search-input.ts
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:IconButton>`, `<twig:ui:EmptyState>`, `<twig:ui:Tag>`, `<twig:ui:Modal>`

**Variants (props)**

- result template slot (card, list item, product with image)
- selected layout: list | table | tags | single
- allowDelete with confirm, allowSearch
- min chars, remote URL
- combobox ARIA (aria-expanded, aria-activedescendant), live result count
- addNew action (opens light form in ui:Modal iframe)
- label required (no placeholder-only)

**Problems**

- Four result markups; no combobox/listbox ARIA
- Search inputs with placeholder only
- Searching/no-result messages toggled with d-none, not announced
- Remove controls are <i> or <a> without names
- Fancybox iframe + window.parent.$

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/entity_search_input.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/Create/customer.html.twig:10`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/Create/cart_rules.html.twig:16`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/add_product_form.html.twig:14`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Discount/FormTheme/specific_product.html.twig:20`

**Pages**

- TwigTemplateForm/entity_search_input.html.twig
- Configure/ShopParameters/Tags/create|edit (product search)
- Sell/Catalog/Discount/create|edit
- Sell/Catalog/Product/edit (related, packed products)
- Sell/Order/Order/create.html.twig
- Sell/Order/Order/view.html.twig
- Sell/Address/add|edit (email autocomplete)
- Configure/AdvancedParameters/ExtraPropertyDefinition/create|edit (suggestion dropdowns)

### 39. `<twig:ui:Tag>`

Removable chip for a selected value (category, keyword, method, filter) with a labelled remove button.

- Role: component, kind: content, complexity: S, pages: 8
- Sections: product categories, taggable fields, entity search, module search
- Builds on: pstagger / taggable-field.ts
- Depends on: `<twig:ui:IconButton>`

**Variants (props)**

- label, removable (remove label 'Remove {label}'), selected/pressed state for chips
- variant: neutral | primary
- attribute pass-through (data-ps-*)

**Problems**

- Remove is <a href=#>x</a> without label
- Page-specific tag styles duplicate a generic pattern

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:1724`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Product/FormTheme/categories.html.twig:22`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/ExtraPropertyDefinition/FormTheme/definition_form_theme.html.twig:168`

**Pages**

- TwigTemplateForm tagged_item_collection_widget
- Sell/Catalog/Product/edit
- Improve/Design/Cms/add|edit (keywords)
- Sell/Catalog/Discount/create|edit
- Configure/AdvancedParameters/ExtraPropertyDefinition/create|edit (method chips)
- Module/manage.html.twig (search tags)

### 40. `<twig:ui:ChoiceTable>`

Checkbox table/matrix with select-all per column, sticky header and search for long lists; payment restrictions, required fields, group access, geolocation countries, webservice permissions.

- Role: component, kind: form, complexity: M, pages: 9
- Sections: settings forms, entity forms
- Builds on: choice-table.ts, multiple-choice-table.ts
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Check>`

**Variants (props)**

- columns: single | multiple
- select all (row/column), indeterminate
- search + sticky header for 200+ rows
- display total items
- caption and labelled cells

**Inconsistencies to harmonize**

- two types and two JS names for the same matrix

**Problems**

- Two components for one pattern
- No search on long country tables
- Checkboxes without row/column context

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:781`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Payment/Preferences/Blocks/payment_preferences_form_block.html.twig:23`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Address/Blocks/required_fields.html.twig:24`

**Pages**

- TwigTemplateForm material_choice_table_widget, material_multiple_choice_table_widget
- Improve/Payment/Preferences/payment_preferences.html.twig
- Sell/Address/index.html.twig
- Sell/Customer/index.html.twig
- Sell/Customer/create|edit
- Improve/Shipping/Carriers/form.html.twig
- Improve/International/Geolocation/index.html.twig
- Configure/AdvancedParameters/Webservice/create|edit

### 41. `<twig:ui:FileUpload>`

File input with Browse label, accepted formats and size hint, current file preview (image with alt, size, download) and delete with confirm; dropzone variant.

- Role: component, kind: form, complexity: M, pages: 22
- Sections: entity forms, logos, import
- Builds on: file_widget, image_with_preview_widget, ImagePreviewType
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Button>`, `data-ps-confirm (ConfirmDialog on <twig:ui:Modal>)`

**Variants (props)**

- accept + formats hint, max size hint (from config, not hard-coded)
- multiple
- preview: image (alt) | file (name, size, download link)
- canBeDeleted with ui:Button POST + confirm
- dropzone with state announcements
- dependent fields unlocked after a file is chosen (with hint)
- disabled

**Problems**

- Four markups for upload + current file
- Inline <style> per field for 'Browse'
- Thumbnails without alt; delete without confirm
- Edit pages do not show the current image (Title, Order status, Language flag)

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:968`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:1683`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Manufacturer/logo_image.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Attachment/Blocks/form.html.twig:18`
- `src/PrestaShopBundle/Resources/views/Admin/Module/Includes/modal_import.html.twig:1`

**Pages**

- TwigTemplateForm file_widget, image_with_preview_widget, image_preview_widget
- Configure/ShopParameters/Contact/Stores/create|edit, CustomerSettings/Title/create|edit, OrderStates/create|edit
- Improve/Design/Theme/import.html.twig, Theme/index.html.twig
- Improve/International/Language/create|edit
- Improve/Shipping/Carriers/form.html.twig
- Sell/Catalog/Attachment/add|edit, Manufacturer/add|edit, Suppliers/add|edit, Categories/create|edit, Attribute/create|edit, Product/edit
- Configure/AdvancedParameters/ImportPage/import.html.twig
- Module/manage.html.twig (upload module)

### 42. `<twig:ui:Progress>`

Progress bar with aria-valuenow/min/max and a label, with polite text updates; for import, bulk AJAX actions, password strength.

- Role: component, kind: feedback, complexity: S, pages: 6
- Sections: import modal, bulk progress modal, password strength
- Builds on: Bootstrap 5 progress (ui Progress story)
- Depends on: -

**Variants (props)**

- value / max, label (required)
- tone: primary | success | warning | danger
- striped / animated, indeterminate
- live text slot (x of y processed)

**Problems**

- No aria-value* attributes, progress text not announced
- Inline width style on .progress

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/ImportDataConfiguration/Blocks/import_modal.html.twig:8`
- `src/PrestaShopBundle/Resources/views/Admin/Helpers/password_feedback.html.twig:13`
- `ui/src/stories/components/Progress.stories.js:1`

**Pages**

- Helpers/bootstrap_popup.html.twig (progressbar)
- Configure/AdvancedParameters/ImportDataConfiguration/index.html.twig
- Common/Grid/Actions/Bulk/ajax.html.twig (bulk progress, listings)
- Sell/Catalog/Product/edit (combination bulk)
- Helpers/password_feedback.html.twig (Employee, Customer, Login reset)

### 43. `<twig:ui:Collapse>`

Disclosure and accordion: a toggle button with aria-expanded/controls revealing a region; single, always-open or one-at-a-time groups; used for form accordions, collapsible sub-forms, Required fields panels and advanced settings.

- Role: component, kind: content, complexity: S, pages: 12
- Sections: form accordions, collapsible settings, advanced developer fields
- Builds on: Bootstrap 5 collapse/accordion (ui Accordion story)
- Depends on: `<twig:ui:Button>`, `<twig:ui:Icon>`

**Variants (props)**

- mode: disclosure | accordion (single | always-open | one-at-a-time)
- toggle: ui:Button label (+ icon) or header (heading level prop)
- expanded initial, expand on error, open from URL hash
- error highlight on an item
- flush
- attribute pass-through

**Problems**

- aria-expanded wrong or not updated
- Empty chevron icons; icon-only togglers
- Accordion headers always h2

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:1500`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/AdminAPI/ApiClient/form_theme.html.twig:8`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Address/index.html.twig:10`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Customer/index.html.twig:37`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/Create/customer.html.twig:75`

**Pages**

- TwigTemplateForm accordion_widget
- Configure/AdvancedParameters/AdminAPI/ApiClient/create|edit (scopes)
- Configure/AdvancedParameters/performance.html.twig (add memcache server)
- Configure/AdvancedParameters/ExtraPropertyDefinition/create|edit (<details>)
- Configure/AdvancedParameters/ImportPage/import.html.twig (history)
- Sell/Address/index.html.twig
- Sell/Customer/index.html.twig
- Sell/Order/Order/create.html.twig

### 44. `<twig:ui:Avatar>`

Employee or entity avatar: image with alt or initials, sizes; for the header employee menu, thread messages, employee grid cells and business entity header.

- Role: component, kind: content, complexity: S, pages: 6
- Sections: shell, threads, grid cells, view header
- Builds on: none
- Depends on: `<twig:ui:Icon>`

**Variants (props)**

- src + alt, or initials from name (aria-hidden when the name is next to it)
- size: sm | md | lg
- fallback icon (person)

**Problems**

- Avatars without alt
- One-off initials avatar markup on business entity view

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Common/Grid/Columns/Content/employee_name_with_avatar.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/CustomerService/CustomerThread/Block/thread_messages.html.twig:13`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/BusinessEntity/view.html.twig:2`

**Pages**

- Component/Layout/employee_dropdown.html.twig
- Common/Grid/Columns/Content/employee_name_with_avatar.html.twig (Employee listing)
- Sell/CustomerService/CustomerThread/view.html.twig
- Sell/BusinessEntity/view.html.twig

### 45. `<twig:ui:MultistoreField>`

Multistore controls for settings: per-field 'modify all shops' / restriction checkbox with a visible label, per-field shop dropdown, and the shop-context notice (as ui:Alert preset).

- Role: component, kind: form, complexity: S, pages: 25
- Sections: settings forms, create pages (infotip)
- Builds on: MultistoreConfigField, MultiStoreRestrictionField JS; multistore-infotip.html.twig
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Check>`, `<twig:ui:Alert> (extend)`, `<twig:ui:Dropdown>`

**Variants (props)**

- checkbox before label (horizontal) | after widget (vertical), always labelled with its effect
- dropdown per field (shop values)
- context notice preset: create-for-all-shops | single-shop-only | not-shop-aware
- shown on create AND edit of the same entity (consistent presence)

**Problems**

- Infotip on create but not edit (Profiles, RequestSql, State, Tax, OrderStates)
- Restriction checkbox without visible label
- Same 'single shop context' message with two severities

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:101`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:1001`
- `src/PrestaShopBundle/Resources/views/Admin/macros.html.twig:268`
- `src/PrestaShopBundle/Resources/views/Admin/Common/multistore-infotip.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Design/Theme/Blocks/multishop_switch.html.twig:7`

<details>
<summary>Pages (9 entries)</summary>

- TwigTemplateForm form_modify_all_shops, shop_restriction_checkbox_widget, prestashop_ui_kit form_row checkbox
- Admin/macros.html.twig (multistore_switch)
- Common/multistore-infotip.html.twig
- Configure/ShopParameters/* preferences, maintenance, OrderPreferences, Meta
- Improve/Shipping/Preferences/preferences.html.twig
- Improve/International/Tax/index.html.twig
- Improve/Design/Theme/index.html.twig
- Sell/Order/Invoices/invoices.html.twig
- Sell/CustomerService/OrderReturn/index.html.twig

</details>

### 46. `data-ps-toggle (conditional field group behaviour)`

Declarative show/hide/enable of rows or sub-sections from another field's value, with aria-controls/aria-expanded on the controller, kept state and no flash on load; replaces per-page togglers.

- Role: component, kind: form, complexity: S, pages: 20
- Sections: settings forms, entity forms
- Builds on: FormFieldToggler, CountryStateSelectionToggler, CountryDniRequiredToggler, option handlers
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`

**Variants (props)**

- action: show | hide | enable | disable | require
- condition: value equals / in / checked
- initial state rendered server-side (no flash)
- dependent required marker updated and announced
- country/state and country/DNI presets

**Problems**

- Three toggle mechanisms for the same UX
- No aria-controls/aria-expanded; changes not announced
- Fields disabled with no explanation
- Rows flash on load

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/Email/Blocks/email_configuration.html.twig:18`
- `admin-dev/themes/new-theme/js/pages/catalog-price-rule/form/include-tax-field-visibility-handler.ts`
- `admin-dev/themes/new-theme/js/pages/attribute/form/index.ts`
- `admin-dev/themes/new-theme/js/pages/discount/form/index.ts`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Manufacturer/Address/Blocks/form.html.twig:24`

<details>
<summary>Pages (14 entries)</summary>

- Configure/AdvancedParameters/Email/index.html.twig
- Configure/ShopParameters/OrderPreferences/order_preferences
- Configure/ShopParameters/customer_preferences
- Configure/ShopParameters/CustomerSettings/Title/create|edit
- Configure/ShopParameters/OrderStates/create|edit
- Configure/ShopParameters/Contact/Stores/*
- Improve/International/Tax/index.html.twig
- Improve/International/Translations/translations_settings.html.twig
- Sell/Catalog/Attribute/create|edit
- Sell/Catalog/CatalogPriceRule/create|edit
- Sell/Catalog/Discount/create|edit
- Sell/Catalog/Manufacturer/Address/*, Suppliers/*
- Sell/Address/add|edit
- Sell/Customer/create|edit

</details>

### 47. `<twig:ui:ShowcaseCard>`

Dismissible onboarding card: illustration (alt=''), title with heading level, text, Learn more and optional CTA, close button that persists dismissal.

- Role: component, kind: content, complexity: S, pages: 9
- Sections: listing intros
- Builds on: ShowcaseCard + ShowcaseCardCloseExtension JS
- Depends on: `<twig:ui:IconButton>`, `<twig:ui:Link>`, `<twig:ui:Card>`

**Variants (props)**

- id (dismissal key), image, title, headingLevel, text
- actions slot (Learn more external ui:Link, second CTA)
- closable with labelled ui:IconButton

**Problems**

- Close is a clickable <i>
- Image without alt; invalid height=auto
- h2 among h3 cards
- Copy-pasted partials per page; mixed helper-card/showcase-card classes

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/Employee/Blocks/showcase_card.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/ShopParameters/TrafficSeo/Meta/Blocks/meta_showcase_card.html.twig:12`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Categories/Blocks/showcase_card.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Customer/Blocks/showcase_card.html.twig:7`

<details>
<summary>Pages (9 entries)</summary>

- Configure/AdvancedParameters/Employee/index.html.twig
- Configure/ShopParameters/TrafficSeo/Meta/index
- Improve/Design/Cms/index.html.twig
- Improve/Shipping/Carriers/index.html.twig
- Sell/Catalog/AttributeGroup/index
- Sell/Catalog/Categories/index
- Sell/Catalog/Features/index
- Sell/Catalog/Monitoring/index
- Sell/Customer/index.html.twig

</details>

### 48. `<twig:ui:CollectionEditor>`

Repeatable sub-forms with Add and labelled Remove, numbering, empty state, focus moved on add/remove and announcement; aliases, carrier zone costs, business entity addresses, extra property placements/constraints.

- Role: component, kind: form, complexity: M, pages: 6
- Sections: entity forms
- Builds on: CollectionType prototypes, aliases-collection-manager.ts, business-entity-address-collection.ts
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:IconButton>`, `<twig:ui:EmptyState>`, `<twig:ui:Button>`

**Variants (props)**

- item layout: inline row | card
- prototype from form, <template> rendered server-side
- add label, remove label per item, min/max items
- read-only mode (module-owned)
- count badge in the header
- per-item actions (set as default)

**Problems**

- Icon-only delete without name
- No focus move or feedback on remove
- Placeholders as labels; errors not linked
- BS3 btn-default on Add

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/ShopParameters/Search/FormTheme/aliases.html.twig:23`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Shipping/Carriers/FormTheme/costs-range.html.twig:7`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/BusinessEntity/Blocks/form.html.twig:17`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/ExtraPropertyDefinition/FormTheme/definition_form_theme.html.twig:43`

**Pages**

- Configure/ShopParameters/Search/form
- Improve/Shipping/Carriers/form.html.twig
- Sell/BusinessEntity/create.html.twig
- Sell/BusinessEntity/edit.html.twig
- Configure/AdvancedParameters/ExtraPropertyDefinition/create|edit|view

### 49. `<twig:ui:PasswordField>`

Password input with show/hide toggle, strength bar and requirements checklist in a polite live region, and confirmation mismatch message; already built for the kit login reset page.

- Role: component, kind: form, complexity: S, pages: 5
- Sections: login, employee, customer
- Builds on: Component/Ui/password_field.html.twig (`ui:PasswordField`, was Login/Ui/_password_toggle.html.twig), Helpers/password_feedback.html.twig, change-password-handler.ts
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:IconButton>`, `<twig:ui:Progress>`

**Variants (props)**

- toggle: bool (visibility button, secondary weight not btn-primary)
- feedback: none | strength | strength + requirements
- confirm field with mismatch announcement
- autocomplete current-password | new-password

**Problems**

- Toggle uses btn-primary, heavier than the field
- Big translation JSON in a data attribute per render
- Legacy reset page has no mismatch element

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Component/Ui/password_field.html.twig`
- `src/PrestaShopBundle/Resources/views/Admin/Helpers/password_feedback.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/prestashop_ui_kit_base.html.twig:1628`

**Pages**

- Login/Ui/reset_password.html.twig
- Login/Ui/login.html.twig
- Configure/AdvancedParameters/Employee/create|edit
- Sell/Customer/create|edit
- TwigTemplateForm change_password_row (My profile)

### 50. `<twig:ui:Stepper>`

Multi-step flow with a step indicator (current, done, upcoming), step panels and Back/Next actions; import (two pages + progress) and manual order creation.

- Role: component, kind: form, complexity: L, pages: 3
- Sections: import, order create
- Builds on: none
- Depends on: `<twig:ui:Card>`, `<twig:ui:Button>`, `<twig:ui:Modal>`, `<twig:ui:Progress>`

**Variants (props)**

- mode: multi-page (links) | single page (progressive reveal)
- steps: label, state, aria-current=step
- announce newly revealed step
- final progress step (ui:Modal progress)

**Problems**

- No step indicator: users do not know there are steps
- Cards appear with no announcement
- Cancel link doubling as process button

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/Blocks/import_panel.html.twig:107`
- `src/PrestaShopBundle/Resources/views/Admin/Configure/AdvancedParameters/ImportDataConfiguration/Blocks/import_data_configuration.html.twig:122`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/create.html.twig:13`

**Pages**

- Configure/AdvancedParameters/ImportPage/import.html.twig
- Configure/AdvancedParameters/ImportDataConfiguration/index.html.twig
- Sell/Order/Order/create.html.twig

### 51. `<twig:ui:MessageThread>`

Conversation as a list of messages (avatar, author, date/time, attachments/product links, body) with a labelled reply composer and optional predefined-message select.

- Role: component, kind: content, complexity: M, pages: 2
- Sections: customer service, order view messages
- Builds on: none
- Depends on: `<twig:ui:Avatar>`, `<twig:ui:Card>`, `<twig:ui:Modal>`, `<twig:ui:Button>`

**Variants (props)**

- limit + 'View full conversation' (modal)
- composer: textarea with label, predefined messages with overwrite warning, private toggle
- status actions slot
- list semantics (ol), <time> dates

**Problems**

- Avatars without alt; reply textarea without label
- h4 packing author, date and links
- Decorative icons read aloud

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Sell/CustomerService/CustomerThread/Block/thread_messages.html.twig:13`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/CustomerService/CustomerThread/Block/your_answer.html.twig:25`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Order/Order/Blocks/View/messages.html.twig:11`

**Pages**

- Sell/CustomerService/CustomerThread/view.html.twig
- Sell/Order/Order/view.html.twig

### 52. `<twig:ui:ModuleCard>`

Module row: logo, name, version/author, description with read more, badges (upgrade available), actions menu, optional bulk checkbox; payment methods and module manager lists.

- Role: component, kind: data, complexity: M, pages: 4
- Sections: module manager, payment methods
- Builds on: card_list.html.twig, ModuleCard JS
- Depends on: `<twig:ui:Dropdown>`, `<twig:ui:Badge>`, `<twig:ui:Check>`, `<twig:ui:EmptyState>`

**Variants (props)**

- variant: list | update (old -> new version, changelog) | configure (warning)
- actions: single button | ui:Dropdown split
- inactive state
- selectable (bulk) with labelled checkbox

**Problems**

- Two markups for the same module row
- Truncated text with literal '...'
- h3 names under span section titles
- Bulk checkbox without label

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/Module/Includes/card_list.html.twig:3`
- `src/PrestaShopBundle/Resources/views/Admin/Module/Includes/card_notification_update.html.twig:6`
- `src/PrestaShopBundle/Resources/views/Admin/Improve/Payment/PaymentMethods/Blocks/payment_modules_list.html.twig:31`

**Pages**

- Module/manage.html.twig
- Module/alerts.html.twig
- Module/updates.html.twig
- Improve/Payment/PaymentMethods/payment_methods.html.twig

### 53. `<twig:ui:ChoiceCards>`

Radio group where each option is a card (icon, label, help, badge), in a fieldset with a proper legend; discount type selector (modal and page), product type selector.

- Role: component, kind: form, complexity: S, pages: 3
- Sections: discount creation, product creation
- Builds on: TwigTemplateForm/enriched_choice.html.twig
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Badge>`, `<twig:ui:Icon>`

**Variants (props)**

- legend (name of the choice, warning as description)
- options: icon, label, help, badge
- columns: 1 | 2 | 3
- disabled submit until chosen, with hint

**Problems**

- Group label is a warning sentence
- Product type buttons without radio semantics
- Duplicate markup modal vs page

**Occurrences**

- `src/PrestaShopBundle/Resources/views/Admin/TwigTemplateForm/enriched_choice.html.twig:8`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Discount/create_discount_modal.html.twig:16`
- `src/PrestaShopBundle/Resources/views/Admin/Sell/Catalog/Discount/create_type_selection.html.twig:9`

**Pages**

- Sell/Catalog/Discount/index
- Sell/Catalog/Discount/create_type_selection
- Sell/Catalog/Product/create

### 54. `<twig:ui:ColorPicker>`

Colour field with swatch and hex input, contrast hint against the label text; order statuses and return statuses.

- Role: component, kind: form, complexity: S, pages: 2
- Sections: status forms
- Builds on: ColorPickerType + initColorPickers
- Depends on: `<twig:ui:FormRow> + ui_kit_layout form theme`, `<twig:ui:Badge>`

**Variants (props)**

- value hex, contrast preview with the badge it will produce
- initialises itself (no initColorPickers per page)

**Problems**

- 'HTML colors only' help with no contrast check

**Occurrences**

- `src/PrestaShopBundle/Form/Admin/Configure/ShopParameters/OrderStates/OrderStateType.php:158`
- `admin-dev/themes/new-theme/js/pages/order-return-states/form.ts`

**Pages**

- Configure/ShopParameters/OrderStates/create|edit
- Configure/ShopParameters/OrderReturnStates/create|edit

## Left as markup

| Pattern | Reason |
|---------|--------|
| Data-mapping table with column type pickers (import step 2) | Only on ImportDataConfiguration; built inside the Stepper page with ui:DataTable, ui:FormRow and ui:IconButton |
| File upload with history picker (import) | Only on the Import page; composed from ui:FileUpload, ui:DataTable and ui:Dropdown |
| Badge legend (log severity levels) | Only on Logs; a ui:Badge list, better as grid header help |
| Feature flag row (types list, forced by env) | Only on FeatureFlag; a ui:Switch with description and disabled reason |
| Download card (backup ready) | Only the Backup section (index + download view); ui:Card + ui:Button |
| Async test action with result alerts (email test) | Only on Email; ui:Button loading + ui:Alert live |
| Mail template select with preview popup | Only on Order states; preview should become a ui:Modal there |
| Robots.txt generation action card | Only on Traffic & SEO; ui:Card + ui:Button |
| Dashboard hook zones and date range bar | Only on Dashboard; ui:Layout:Columns + ui:InputGroup date range |
| Theme card gallery | Only on Theme index |
| Logo upload cards with tabs | Only on Theme index; ui:Card + ui:Tabs + ui:FileUpload |
| Module positions hook list | Only on Positions; sortable list page markup using ui:Switch, ui:Check, ui:Dropdown |
| Tax rules JS sub-list with iframe modal editing | Only on TaxRulesGroup edit; ui:DataTable + ui:Modal iframe |
| Currency symbol and format customization modal | Only on Currency create/edit (one entity) |
| Grouped multi-select exception list | Only on Hook a module |
| Address format builder | Only on Country create/edit (one entity) |
| Call-to-action info strip (theme layouts) | Only on Theme index |
| Vue app mount point (translations overview, stock) | No markup of its own; the Vue app sits in the page template content slot |
| Module filter toolbar (search + dropdown filters) | Only on the module manager |
| Module section list title with help and Update all | Module manager section only (manage/alerts/updates share one section) |
| Module upload dropzone modal | Module manager only; ui:Modal + ui:FileUpload dropzone variant |
| Iframe callback / success closer pages | No UI: a script closing the parent fancybox |
| Legacy back office shell (legacy_layout) | Legacy Smarty pages are out of scope (DECISIONS #8); they get ui:Header/ui:SideMenu through the shared shell |
| Product edit header summary and sticky footer | Only on Product edit; uses ui:Tabs, ui:Badge, ui:Layout:Cluster |
| Combinations / specific prices JS lists | Product edit only; later on ui:Grid or ui:DataTable |
| Product listing category filter dropdown | Product listing only; a ui:Grid extra filter slot holding ui:ChoiceTree |
| Product category picker (tags + tree modal) | Product edit only; ui:Tag + ui:ChoiceTree + ui:Modal |
| Order view header action bar | Order view only; ui:Layout:Page title/actions slots + ui:Dropdown |
| Activity timeline | Only on Customer thread view |
| Shipment item picker forms (split, merge, edit, fulfill) | Order view only; ui:DataTable + ui:FormRow in ui:Modal |
| Order product edit/add form | Order view only |
| Expandable grid row preview | Order listing only; a ui:Grid row preview variant |
| Print-only layout | Order view only; ui:Layout:Page print rules |
| Hook-injected content area | Not a component: renderhook calls stay in place (DECISIONS #20) |
| Customer result selection card (order create) | Order create only; result template of ui:EntitySearch |
| Loading skeleton for AJAX modal bodies | Order view only; ui:Spinner in ui:Modal remote body meanwhile |
| Business entity view custom header | One page; ui:Layout:Page title slot with ui:Avatar and ui:Badge |
| Standalone delete-mode card (categories) | Dead template, never rendered |
| Range slider / range inputs (legacy helpers) | No Symfony page in the audit renders them |
| Security interstitial and error pages as own components | Covered by ui:Layout:Standalone |
| Carousel, navbar, list group, floating labels stories | Kit stories with no back office use |
