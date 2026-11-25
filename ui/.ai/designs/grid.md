# `<twig:ui:Grid>`: final design

2026-11-25. This is the reference the build follows. The listing component for all kit list pages (about 60). The first page is Sell > Orders.

## Decision

**Base: the bootstrap-first proposal.** It has the best total score, 22.5 out of 30. accessibility-first scored 20.5 and daily-use 17.5.

| Proposal | merchant-a11y | kit-and-code | migration-risk | Total |
|---|---|---|---|---|
| bootstrap-first | 7 | 8 | 7.5 | **22.5** |
| accessibility-first | 8 | 6 | 6.5 | 20.5 |
| daily-use | 6 | 6 | 5.5 | 17.5 |

Why bootstrap-first: it adds the fewest new parts, keeps the most legacy ids and keeps every request contract. Its only PHP is in the kit layer. It also leans most on native HTML (links, `form`/`formaction` submits) and on Bootstrap's own `data-bs-*` plugins, which is the "change the PHP as little as possible, but cleanly" brief.

**Grafted from the other proposals and the judges:**
- From accessibility-first:
  - one `<th scope="row">` per row, and every row control named with its row through `aria-labelledby`;
  - a focusable results summary that gets focus after a reload, through a URL fragment and `load-focus.js`;
  - the generic `data-ps-confirm` + `<twig:ui:ConfirmDialog>` (INVENTORY #23) in place of a confirm modal private to the grid;
  - toggles through `fetch` with `redirect: 'manual'`;
  - a positions payload built in JS, exactly as PositionExtension builds it today.
- From daily-use:
  - bulk checkboxes stay inside the filter form, and bulk actions submit that form with `formaction`, so bulk request bodies do not change;
  - the selected row is styled by its checkbox state;
  - the list of PHP changes rejected because the front can do them.
- From the judges:
  - the display hooks stay outside the filter form;
  - `icon()` checks the icon registry, because a missing icon fails the render (#35);
  - rows per page is a menu of links;
  - Move up and Move down buttons as the single-pointer alternative to drag;
  - status and boolean cells show visible text;
  - menus inside `.table-responsive` use the fixed popper strategy.

**Dropped (judge rejections):**
- From bootstrap-first:
  - a per-grid confirm modal;
  - toggles that count any ok response as success;
  - one hidden form per position move;
  - bulk ids moved to a separate empty form;
  - the root carrying both `{id}_grid_panel` and `{id}_grid`;
  - an id passed to `ui:Dropdown` and expected on its button.
- From accessibility-first:
  - a collapsed filter panel at 1280;
  - `d-md-none` duplicated row actions;
  - a PHP `cellTemplate()`;
  - renamed ids;
  - Move to top/bottom.
- From daily-use:
  - `aria-selected` on `<tr>`;
  - a bulk bar that is hidden until something is selected;
  - a `<select>` that navigates on change;
  - Alt+Arrow as the only alternative to drag;
  - a scroll box with a capped height;
  - hooks inside the form;
  - a `title` prop;
  - events nothing consumes;
  - grid-specific blocks in the global form theme.

**Disagreements settled:**

| Point | Settled as | Reason |
|---|---|---|
| Filters at 1280 | The per-column filter row is always visible | Filtering is the most frequent task. A toggle costs a click every time. |
| Filters at 375 | The filter row scrolls with its columns, and Search/Reset stay in the toolbar | No extra JS or panel. Collapsing below md is left as open question 2. |
| Removable filter chips | Not in v1 | They need extra parts and JS, and the filter row already shows the values. |
| Confirmation | Generic ConfirmDialog | One way to confirm across the kit. Row, bulk and grid actions all use it. |
| Focus after reload | Results summary `#{id}_grid_results` (`tabindex=-1`) | It also replaces the footer "range" text, so it adds no second part. |
| Sticky columns and header | Not in v1 | Two judges rejected them. Open question 3 covers the sticky row header column at 375. |
| Switch | `ui:Check type="switch"`, not a separate `ui:Switch` | Bootstrap treats a switch as a form-check variant. Open question 1 asks you to confirm this. |
| Preview row | A hidden `<tr>` per record, toggled by `grid-preview.js` | Bootstrap Collapse cannot animate a `<tr>`. `aria-controls` needs the row to exist already. The module fetches the content anyway. |
| Icon not in the registry | `icon()` returns null, and that action goes to the overflow menu as a text item | `more_horiz` as a stand-in would mislead. An icon-only button needs an icon. |

## API

### Calls

```twig
{# Plain listing page (V1, about 43 pages) #}
<twig:ui:Grid :grid="orderGrid"/>

{# Grid inside a view-page card (V8: customer view, order shipments, blockwishlist) #}
<twig:ui:Grid :grid="customerOrdersGrid" embedded headingLevel="3"/>

{# Page with slots #}
<twig:ui:Grid :grid="attributeGrid">
  <twig:block name="empty">
    <twig:ui:EmptyState icon="shopping_basket" title="{{ 'You have no orders yet'|trans({}, 'Admin.Orderscustomers.Feature') }}">
      {{ 'Orders placed in your store appear here.'|trans({}, 'Admin.Orderscustomers.Feature') }}
      <twig:block name="actions">
        <twig:ui:Button :href="path('admin_orders_create')" icon="add">{{ 'Add new order'|trans({}, 'Admin.Orderscustomers.Feature') }}</twig:ui:Button>
      </twig:block>
    </twig:ui:EmptyState>
  </twig:block>
  <twig:block name="footer">
    <twig:ui:Link back :href="path('admin_attribute_groups_index')">{{ 'Back to list'|trans({}, 'Admin.Actions') }}</twig:ui:Link>
  </twig:block>
</twig:ui:Grid>
```

### Props

`src/PrestaShopBundle/Twig/Component/Ui/Grid.php` checks the props in `preMount()` with an OptionsResolver, as `Kpi.php` does.

| Prop | Type | Default | Meaning |
|---|---|---|---|
| `grid` | array | required | The `GridPresenter::present()` result, as the controller passes it. It must have `id`, `name`, `columns`, `data`, `pagination`, `sorting`, `filter_form`, `column_filters`, `actions`, `attributes` and `form_prefix`. |
| `embedded` | bool | `false` | The grid sits inside another card: no card, no visible header (title, count, grid actions). The caption names the table. |
| `headingLevel` | int 2–6 | `2` | Level of the title. The page h1 belongs to PageHead. Use 3 in view pages or below section titles. |

There are no other props, so no per-page behaviour options.

`view_options` is read from the definition:
- `display_name=false` makes the panel title visually hidden.
- `pagination_view=quicknav` and `empty_state_without_headers` are ignored on kit pages, because there is one pagination and one empty behaviour (recorded in CHANGELOG-UI).

Attributes pass through to the root `<section>` with `attributes.defaults()`, for `data-ps-*` and `aria-*` only.

### Blocks (named, all optional)

| Block | Where | Replaces |
|---|---|---|
| `before` | Body, after `displayAdminGridTableBefore`, before the toolbar | `grid_panel_body` override (Monitoring alert, V4) |
| `toolbar` | Toolbar, between the bulk group and Search/Reset. It sits outside the filter form, so it may hold its own form. | `grid_bulk_actions_block` override (Products category tree, V5) |
| `empty` | Body, in place of the toolbar, table and footer pagination, when `attributes.is_empty_state` is true. Default: `<twig:ui:EmptyState icon="inbox" title="No records yet">` | `Blocks/EmptyState/{gridId}.html.twig`. The 7 per-grid templates move into each page's `empty` block when the page migrates. |
| `footer` | Card footer, after pagination | `grid_panel_footer` (Back to list, V2). This also fixes Email logs, which overrides a `grid_footer` block that does not exist. |

Page modals (Orders change status, delete customers, and the like) are not slots. The page places them beside the grid.

### Internal templates (owned by the Grid, not public components)

The root template is `src/PrestaShopBundle/Resources/views/Admin/Component/Ui/grid.html.twig`. Under `Component/Ui/Grid/`:
- `cell/{type}.html.twig`, `cell/_fallback.html.twig` (calls `column_content(record, column, grid)`)
- `action/row/{link,submit}.html.twig`, `action/bulk/{submit,button,modal_form_submit}.html.twig`, `action/grid/{link,simple,submit}.html.twig`, `action/_fallback.html.twig` (includes the legacy `Common/Grid/Actions/{Row|Bulk|Grid}/{type}.html.twig`)
- `query_modal.html.twig`

Cells resolve in Twig, with no PHP lookup:

```twig
{{ include([
  '@PrestaShop/Admin/Component/Ui/Grid/cell/' ~ grid.id ~ '_' ~ column.id ~ '_' ~ column.type ~ '.html.twig',
  '@PrestaShop/Admin/Component/Ui/Grid/cell/' ~ grid.id ~ '_' ~ column.type ~ '.html.twig',
  '@PrestaShop/Admin/Component/Ui/Grid/cell/' ~ column.type ~ '.html.twig',
  '@PrestaShop/Admin/Component/Ui/Grid/cell/_fallback.html.twig',
], {record, column, grid, rowHeaderId, component: this}) }}
```

Actions resolve the same way: kit `action/{kind}/{type}`, else `action/_fallback`.

### `Grid.php` helpers (read-only, called as `this.*`)

Constructor dependencies:
- `RequestStack`
- `UrlGeneratorInterface`
- `#[Autowire(service: '.ux_icons.icon_registry')] IconRegistryInterface`, the same service SideMenu uses.

| Helper | Returns |
|---|---|
| `state()` | `'list'`, `'no-match'` (`records_total == 0` and not empty) or `'empty'` (`attributes.is_empty_state`) |
| `rowHeaderColumnId()` | The first `identifier` column, else the first `data` or `link` column |
| `sortHref(columnId)` | The sort URL for that column |
| `sortState(columnId)` | `ascending`, `descending` or null |
| `pageLinks()` | `array<int,string>` of page number to href: 1, current−1..current+1, last |
| `currentPage()`, `pageCount()` | The current page and the number of pages |
| `limitItems()` | DropdownMenu link items from `LIMITS = [10, 20, 50, 100, 300, 1000]`, with the current one `active` |
| `range()` | `[from, to]` |
| `searchAndReset()`, `quickFilters()`, `filtersFor(columnId)` | FormView children, picked by `block_prefixes` and `column_filters` |
| `rowActions(record, column)` | `{inline, primary, menu}`, filtered by `isApplicable(record)` (the same split as `action.html.twig`). An action whose icon resolves to null goes to `menu`. |
| `icon(?legacyName)` | A Material Symbols name, or null. Uses an alias map (`clear`→`close`, `remove_red_eye`→`visibility`, `add_circle_outline`→`add_circle`, …), then strips `_outline`, then checks the registry. |
| `hookParams()` | `{grid, legacy_controller, controller}` |

How URLs are built:
- They come from `_route` and `_route_params` plus the current query, with `{form_prefix}[orderBy|sortOrder|offset|limit]`. There is no prefix when `form_prefix` is `''`.
- They carry the fragment `#{id}_grid_results`.
- This is what `TableSorting` and `paginationAction` do today.

### Public JS surface

Bubbling CustomEvents on the root `[data-ps-ref="grid"]`. These are the only two events, because each has a real consumer:
- `ps:grid-bulk-action`, detail `{gridId, actionId, ids}`. It fires for `button`-type bulk actions. Orders uses it to open tabs.
- `ps:grid-preview-loaded`, detail `{gridId, row, previewRow}`. Orders' products toggler listens to it.

## Data

### What it reads (no change)

- **The presented array**, under the page's existing variable (Orders: `orderGrid`):
  - `id`, `name`, `form_prefix`, `filter_form` (FormView)
  - `columns[]` with `options`. `options.actions` is the RowActionCollection of objects.
  - `column_filters`, `actions.grid[]`, `actions.bulk[]`
  - `data.records`, `data.records_total`, `data.query`
  - `pagination.offset|limit`, `sorting.order_by|order_way`, `filters`
  - `attributes.is_empty_state`, `view_options.display_name`
- **Request attributes**: `_route`, `_route_params`, `_legacy_controller`, `_controller` and the query string.
- **Twig functions that exist today**: `is_ordering_column`, `column_content` (fallback only), `is_color_bright`, `renderhook`, `path`/`url`, `csrf_token`, and the `array_pluck` filter.
- **Page extras stay with the page**: `changeOrdersStatusForm`, `orderKpi`.

### Server contracts reused as they are

| Interaction | Contract |
|---|---|
| Filter | POST `{id}[…]` + `{id}[_token]` to `filter_form.vars.action` (searchAction → redirect). The kit appends `#{id}_grid_results` to the action. |
| Reset | POST `admin_common_reset_search_by_filter_id` (JSON), then `location.assign(redirect_url + '#{id}_grid_results')` |
| Sort, page, limit | GET `{prefix}[orderBy|sortOrder|offset|limit]` |
| Bulk submit | The filter form (filters, `_token`, `{id}_{colId}[]`) sent to `path(submit_route, route_params)` with `formaction`/`formmethod`. The body is identical to what SubmitBulkActionExtension sends. |
| Row submit | POST through `#{id}_grid_action_form`. The submitter carries `name="_method" value="DELETE"` for DELETE/PUT/PATCH (`http_method_override: true`). |
| Choice | POST `value` (the submitter's name and value) to `path(column.options.route, …)` |
| Positions | POST `positions[i][rowId|oldPosition|newPosition]` (+ `_method`) to `update_route`, built for the page's rows exactly as PositionExtension does |
| Toggle | POST to the toggle URL. The response is either JSON `{status, message}` or a redirect with a flash. |
| Preview | GET JSON `{preview}` |
| SQL Manager | POST `sql` + `name` to `admin_sql_requests_create` |

### PHP changes

All of them are in the kit layer. Core/Grid, GridExtension, GridPresenter, GridFactory, the definition factories, CommonController and OrderController stay unchanged. The Orders page switches with `{% extends ui_kit ? '@PrestaShop/Admin/Sell/Order/Order/Ui/index.html.twig' : … %}`.

1. **New** `src/PrestaShopBundle/Twig/Component/Ui/Grid.php`.
   - Why: URL building with bracketed prefixes, the page window, the row-action split and the icon resolution are logic, and a template should not compute them. `column_content()` cannot serve kit cells, because its base path is hardwired and its cache key ignores the theme.
   - BC: a new class that only kit templates use.
2. **Changed** `src/PrestaShopBundle/Twig/Component/Ui/DropdownMenu.php`: `ITEM_TYPES` (today `['button','divider','heading','link','text']`) gains `submit`. The template is updated to match.
   - The item renders `<button type="submit">` and requires `attr.form`. Optional: `formaction`, `formmethod`, `name`, `value`. `href` and `external` are rejected.
   - Why: `dropdown_menu.html.twig` prints `type="button"`, and an `attr.type` cannot override it.
   - BC: an added value on a kit component that has not been released.
3. **New** kit components `Ui/Check.php`, `Ui/Pagination.php`, `Ui/EmptyState.php` and `Ui/ConfirmDialog.php`, listed under Components to create first.
   - BC: new classes.

**Twig only, not PHP:**
- `TwigTemplateForm/ui_kit_layout.html.twig` gains `date_range_widget`, `integer_min_max_filter_widget` and `number_min_max_filter_widget`. Each is a `<fieldset>` with a visually hidden `<legend>` (the column name) and two labelled inputs (From/To or Min/Max).
- `search_and_reset`, `filter_link` and `reorder_positions_button` children are rendered by the Grid itself and marked with `setRendered()`, so the global theme gets no grid-specific blocks.
- `Sell/Order/Order/preview.html.twig` gets a `ui_kit` branch. This is Orders page work.

**Considered and rejected, because the front can do it right:**
- a `base_path` option on `column_content()`: the Twig `include([...])` does the lookup;
- a kit presenter shape: the array is read as it is;
- the pagination sub-request: Grid.php builds the links;
- JSON responses for the 24 redirecting toggle routes: `redirect: 'manual'` handles both kinds;
- a "select all N results" server contract: it does not exist, so selection is per page;
- a shared limit constant in Core: the list is duplicated in `Grid::LIMITS` and pinned by a test.

## Markup

The BEM block is `ps-grid` (`ui/src/scss/components/_grid.scss`). Bootstrap appears only as components: `card`, `table`, `table-responsive`, `form-check-input`, `pagination`, `dropdown-menu` and `visually-hidden`. There are no layout or spacing utilities (#38).

```html
<section id="order_grid_panel" class="ps-grid card" data-ps-ref="grid" data-ps-data-grid-id="order"
         aria-labelledby="order_grid_title">
  <!-- not embedded -->
  <header class="ps-grid__header card-header">
    <!-- ui:Layout:Cluster justify=between align=center -->
    <h2 id="order_grid_title" class="ps-grid__title">Orders
      <!-- ui:Badge secondary -->1,234<span class="visually-hidden"> results</span></h2>
    <!-- grid actions: explicit toggle + menu, so the kept id lands on the button -->
    <div class="dropdown">
      <!-- ui:IconButton id="order-grid-actions-button" icon=settings label="List actions"
           data-bs-toggle=dropdown aria-expanded=false -->
      <!-- ui:DropdownMenu align=end items:
           link → Export to CSV; link → Refresh list (current URL);
           button data-bs-toggle=modal data-bs-target=#order_grid_common_show_query_modal → Show SQL query;
           submit form=order_grid_action_form formaction=… data-ps-confirm=… → submit-type actions -->
    </div>
  </header>

  <div id="order_grid" class="ps-grid__body card-body">
    {{ renderhook('displayAdminGridTableBefore', this.hookParams) }}
    {% block before %}{% endblock %}

    <!-- state == empty: {% block empty %} and nothing below except the hook After -->

    <!-- ui:Layout:Stack -->
    <div class="ps-grid__toolbar"><!-- ui:Layout:Cluster justify=between wrap -->
      <!-- ui:Layout:Cluster: bulk group, only when actions.bulk is not empty -->
      <div class="dropdown" data-ps-ref="grid-bulk-actions">
        <!-- ui:Button variant=outline-secondary data-bs-toggle=dropdown disabled → "Bulk actions" -->
        <!-- ui:DropdownMenu items:
             submit form=order_filter_form formaction=… formmethod=post (+ data-ps-confirm) ;
             button data-ps-action=grid-bulk-modal data-bs-toggle=modal data-bs-target=#changeOrdersStatusModal ;
             button data-ps-action=grid-bulk-button data-ps-data-action-id=open_tabs -->
      </div>
      <p class="ps-grid__selection" role="status" data-ps-ref="grid-selection-count"
         data-ps-data-none="No rows selected" data-ps-data-some="%count% selected">No rows selected</p>
      {% block toolbar %}{% endblock %}
      <!-- ui:Layout:Cluster: Search first in tree order (implicit submission) -->
      <!-- ui:Button type=submit form=order_filter_form icon=search variant=outline-primary → Search -->
      <!-- when show_reset_button: ui:Button variant=link data-ps-action=grid-reset-filters
           data-ps-data-url=reset_url data-ps-data-redirect=redirect_url → Clear filters -->
      <!-- when a reorder button child exists and not sorted by position: ui:Button href=sortHref(position) icon=swap_vert → Reorder -->
    </div>

    <!-- quick filters (Discounts), after Search in tree order -->
    <div class="ps-grid__quick-filters btn-group" role="group" aria-label="{{ filter.vars.label }}">
      <input type="hidden" form="discount_filter_form" name="discount[type]" value="all">
      <button type="submit" form="discount_filter_form" class="btn btn-outline-secondary"
              name="discount[type]" value="cart" aria-pressed="false">Cart</button>
    </div>

    <p id="order_grid_results" class="ps-grid__summary" tabindex="-1" data-ps-ref="grid-results">
      51–100 of 1,234 · sorted by Date, descending</p>

    {{ form_start(grid.filter_form, {attr: {id: 'order_filter_form', class: 'ps-grid__form', novalidate: true}}) }}
    <div class="ps-grid__scroll table-responsive ps-scroll-fade" data-ps-action="scroll-fade"
         role="region" tabindex="0" aria-labelledby="order_grid_caption">
      <table id="order_grid_table" class="ps-grid__table table table-hover" aria-describedby="order_grid_results">
        <caption id="order_grid_caption" class="visually-hidden">Orders</caption>
        <thead>
          <tr class="ps-grid__headers">
            <th scope="col" class="ps-grid__heading ps-grid__heading--select">
              <!-- ui:Check id=order_grid_bulk_action_select_all hideLabel
                   label="Select all 50 rows on this page" data-ps-action=grid-select-all -->
            </th>
            <th scope="col" id="order_col_date_add" class="ps-grid__heading ps-grid__heading--end" aria-sort="descending">
              <a class="ps-grid__sort" href="…?order[orderBy]=date_add&order[sortOrder]=asc#order_grid_results">
                Date<!-- ui:Icon arrow_downward | arrow_upward | unfold_more --></a>
            </th>
            <th scope="col" class="ps-grid__heading">Payment</th>
            <th scope="col" class="ps-grid__heading ps-grid__heading--actions"><span class="visually-hidden">Actions</span></th>
          </tr>
          <tr class="ps-grid__filters"><!-- only when column_filters is not empty -->
            <td class="ps-grid__filter">
              {{ form_label(child, null, {label_attr: {class: 'visually-hidden'}}) }}
              {{ form_widget(child, {attr: {class: 'form-control-sm'}}) }}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr class="ps-grid__row">
            <td class="ps-grid__cell ps-grid__cell--select">
              <!-- ui:Check name="order_id_order[]" value=42 id=order_grid_select_42 hideLabel
                   aria-labelledby="order_grid_select_label order_grid_rowhead_42" data-ps-action=grid-select-row -->
            </td>
            <th scope="row" id="order_grid_rowhead_42" class="ps-grid__cell ps-grid__cell--identifier">
              <a class="ps-grid__row-link" href="/sell/orders/42/view?_token=…" data-ps-ref="grid-row-link">42</a>
              <button type="button" class="ps-grid__preview-toggle btn btn-link btn-sm" aria-expanded="false"
                      aria-controls="order_grid_preview_42" aria-labelledby="order_grid_preview_label order_grid_rowhead_42"
                      data-ps-action="grid-preview" data-ps-data-url="/sell/orders/42/preview?_token=…">
                <!-- ui:Icon expand_more (rotated by [aria-expanded=true] in CSS) --></button>
            </th>
            <td class="ps-grid__cell ps-grid__cell--clickable" data-ps-action="grid-open-row">…</td>
            <td class="ps-grid__cell ps-grid__cell--actions">
              <!-- inline/primary: ui:IconButton icon label aria-describedby=order_grid_rowhead_42 -->
              <div class="dropdown">
                <!-- ui:IconButton icon=more_vert label="More actions" variant=link aria-describedby=order_grid_rowhead_42
                     data-bs-toggle=dropdown data-bs-popper-config='{"strategy":"fixed"}' -->
                <!-- ui:DropdownMenu align=end items:
                     link → {type: link, href};
                     submit → {type: submit, attr: {form: 'order_grid_action_form', formaction, name: '_method', value: 'DELETE',
                               'data-ps-confirm': message, 'data-ps-data-confirm-variant': 'danger'}} -->
              </div>
            </td>
          </tr>
          <tr id="order_grid_preview_42" class="ps-grid__preview" hidden data-ps-ref="grid-preview">
            <td colspan="9"><div data-ps-target="grid-preview-content"></div></td>
          </tr>
          <!-- no-match: one row -->
          <tr class="ps-grid__no-match"><td colspan="9">
            <!-- ui:EmptyState size=sm icon=search_off title="No results match these filters"
                 actions: ui:Button variant=outline-secondary data-ps-action=grid-reset-filters → Clear filters -->
          </td></tr>
        </tbody>
      </table>
    </div>
    {{ form_end(grid.filter_form) }}

    <span id="order_grid_select_label" hidden>Select</span>
    <span id="order_grid_preview_label" hidden>Preview</span>
    <form id="order_grid_action_form" method="post" hidden></form>

    {{ renderhook('displayAdminGridTableAfter', this.hookParams) }}
  </div>

  <!-- when records_total > 10 or offset > 0 or footer block has content -->
  <footer class="ps-grid__footer card-footer">
    <!-- ui:Layout:Cluster justify=between -->
    <!-- ui:Pagination :current :links=this.pageLinks label="Pages of the Orders list" -->
    <!-- ui:Dropdown label="50 per page" size=sm direction=up :items=this.limitItems -->
    {% block footer %}{% endblock %}
  </footer>

  <!-- when the definition has common_show_query or common_export_sql_manager -->
  <!-- ui:Modal id=order_grid_common_show_query_modal title="SQL query":
       <form id="order_common_show_query_modal_form" method="post" action="{{ path('admin_sql_requests_create') }}">
       label + readonly textarea name=sql, hidden name=name value=grid.name, ui:Button type=submit "Export to SQL Manager" -->
</section>
```

**Embedded** (`embedded`):
- The root is `<section class="ps-grid ps-grid--embedded" aria-labelledby="{id}_grid_caption">`, with no `card`, no header, and `ps-grid__body` without `card-body`.
- The footer renders only when it is needed.

**Key cells** (`Grid/cell/*.html.twig`):

| Cell | Markup |
|---|---|
| `bulk_action` | ui:Check as above. Inside the filter form, so bulk submits carry it. |
| `identifier` | `<th scope="row">`, the row link when a clickable link action exists, plus the preview toggle when `options.preview` is set |
| `data` | Text. With `max_displayed_characters`, the cut text is `aria-hidden` and the full text is `visually-hidden`. |
| `boolean`, `status` | `ui:Icon` `check_circle` / `cancel` plus visible text: `true_name`/`false_name`, or Yes/No |
| `badge` | `ui:Badge`. A colour from data goes in `style="--ps-grid-badge-color: …"`, with the text colour from `is_color_bright` set as a modifier class. |
| `color` | A swatch plus the hex value as text |
| `date_time` | `<time datetime>` |
| `link`, `disableable_link` | A real `<a>`. When disabled, plain text. |
| `html` | `|raw`, as today |
| `image` | `alt` from the options, else `alt=""` |
| `choice` (Orders status) | A `button.ps-grid__choice` (swatch `--ps-grid-choice-color` plus the status name), `data-bs-toggle=dropdown` with fixed popper, then `ui:DropdownMenu` submit items `{form: '{id}_grid_action_form', formaction, name: 'value', value}`, with `active` on the current one (`aria-current`) |
| `toggle` | `ui:Check type="switch"` `aria-labelledby="{colHeaderId} {rowHeaderId}"`, `data-ps-action="grid-toggle"`, `data-ps-data-url` |
| `position_handle` | `span.ps-grid__handle` (`data-ps-action="grid-drag-row"`, `data-ps-data-id`, `-position`, `-update-url`, `-update-method`), plus ui:IconButton "Move up" / "Move down" (`data-ps-action="grid-move"`, `data-ps-data-to="up|down"`, `aria-describedby` the row header, disabled on the first and last row of the page) |
| `action` | inline, primary, then overflow, as above |
| unknown type | `_fallback`, that is `column_content()` |

## States and variants

- **List (default)**: card, header (title, count badge, list actions), toolbar (bulk group, status line, Search/Clear filters), quick filters if any, summary, table with headers and filter row, footer (pagination, rows per page, footer slot).
- **Embedded**: no card or header. The caption names the table. Used by the customer view grids, order shipments and blockwishlist tabs.
- **Panel with `display_name=false`**: the title is visually hidden but still names the section.
- **Empty** (`is_empty_state`): the header stays, because export and refresh are still useful. The body shows only the `empty` block (the page's EmptyState, or the default). No toolbar, table, summary or pagination.
- **No match** (no records, filters set): toolbar, headers and filter row stay, and the sort links are hidden. A single row holds a small EmptyState "No results match these filters" with Clear filters. The summary reads "0 results match your filters".
- **Filters active**: the fields show their values, and Clear filters is shown (`show_reset_button`).
- **No filters** (`column_filters` empty): no filter row, no Search or Clear filters.
- **Sorted column**: `aria-sort` on its `th`, and an `arrow_upward` / `arrow_downward` icon (shape, not colour). Other sortable columns show `unfold_more`. Non-sortable headers are plain text.
- **Selection none**: the bulk toggle is natively `disabled`, and the status reads "No rows selected".
- **Selection some**: the bulk toggle is enabled. The status reads "3 selected". Select-all is `indeterminate` (announced as mixed). Selected rows get a tint and an inline-start border through `.ps-grid__row:has(.ps-grid__check:checked)`, with no JS and no `aria-selected`.
- **Selection all on the page**: select-all is checked, and its label says "on this page". There is no across-pages selection.
- **Bulk submit**: posts the filter form with `formaction`. With `confirm_message`, ConfirmDialog opens first. The button shows busy through `busy-button.js`.
- **Bulk modal form** (Orders change status, Countries, States): the page's modal opens, and on its submit the checked ids are added through `data-prototype`.
- **Bulk button** (Orders open tabs): `ps:grid-bulk-action` fires and the page acts.
- **Bulk ajax** (Products only, later): ConfirmDialog, then a ui:Modal with ui:Progress and a status line, an error list and Stop.
- **Row actions**:
  - inline IconButtons (`use_inline_display`), then the primary one, then the overflow menu;
  - an action that is not applicable is not rendered;
  - when no action applies, the cell is empty but keeps its header.
- **Row action with confirm**: ConfirmDialog (danger variant for delete). Confirm re-submits the trigger, or follows the link. Cancel or Escape returns focus.
- **Clickable row**: a mouse click on a `clickable` cell follows the row link, unless the click lands on a control or text is being selected. The keyboard uses the link itself.
- **Toggle**: on or off. While saving: `data-ps-state="loading"` and disabled. On a JSON success, it stays and the message is announced. On failure, it reverts and the error is announced. On a redirect, the page reloads and the flash gets focus (#31).
- **Choice**: posts and reloads. Focus goes to the flash.
- **Preview**: collapsed (`aria-expanded=false`, row `hidden`), then loading (spinner, `aria-busy`), then open (the HTML), or error (inline ui:Alert with Retry, and focus stays on the toggle).
- **Position mode** (`is_ordering_column`): a handle column with drag plus Move up/down. During a drag the dragged row has `data-ps-state="dragging"`.
- **Position column present but not sorted by position**: no handles, and a Reorder link in the toolbar.
- **Quick filters**: a `btn-group` of submit buttons with `aria-pressed`. The pressed one also shows a check icon.
- **Pagination**:
  - hidden when `records_total <= 10` and offset is 0 (the footer still renders if the `footer` block has content);
  - otherwise first, last, current±1, and ellipses with hidden text;
  - Previous and Next are absent at the ends;
  - below `sm`: Previous, "Page 3 of 25" and Next.
- **Unknown module column, action or filter type**: rendered through the legacy template or `form_widget`. It is visible but no kit JS is wired to it.
- **Several grids on one page**: each is its own named section, and every id is derived from `grid.id`.
- **Fragment render** (shipments JSON html, light list): the grid renders without page context, and the delegated JS works on inserted grids.
- **Long content**: text wraps in cells, and the table scrolls inside its own box.

## Behaviour

Native first. These need no JS:
- sorting, pagination and rows per page (links);
- search (form submit; Enter uses Search, the first submit in tree order);
- quick filters (submit buttons with name and value);
- bulk submit (`formaction`/`formmethod` on the filter form);
- row submit, choice and grid submit (submitter on `{id}_grid_action_form`);
- refresh and export (links);
- the SQL modal and Export to SQL Manager (a form rendered with the query and `grid.name`, which fixes today's empty name on kit pages);
- dropdowns and modals (Bootstrap `data-bs-*`).

Modules live in `ui/src/js/components/grid/`, are registered once in `ui/src/js/main.js`, with their selectors in `ui/src/js/selectors.js`. Each is delegated on `document`, so grids inserted later and pages with several grids work. Nothing is chosen per page.

| Module | Hooks | Does | Replaces |
|---|---|---|---|
| `confirm-dialog.js` (generic kit) | `[data-ps-confirm]` on submit buttons and links; `data-ps-data-confirm-title`, `-confirm-label`, `-confirm-variant` (from `confirm_message`, `modal_options`, `dynamic_message_field`) | Stops the click and opens the single `<twig:ui:ConfirmDialog>`. On confirm: `form.requestSubmit(trigger)`, or follows the href. Escape or Cancel returns focus. | `window.confirm` in LinkRowAction, ConfirmModal in SubmitRowAction, SubmitBulk and SubmitGridAction |
| `grid-selection.js` | `grid-select-all`, `grid-select-row`, `grid-selection-count`, `grid-bulk-actions` | Checks the page's rows; sets select-all to checked or indeterminate; writes the count into the status line; enables or disables the bulk toggle | BulkActionCheckboxExtension |
| `grid-filters.js` | `grid-reset-filters` | `fetch(url, {method: 'POST'})` with a busy state, then `location.assign(redirect + '#{id}_grid_results')` | FiltersResetExtension. FiltersSubmitButtonEnablerExtension is dropped: Search is always enabled. FilterLinkGroup is replaced by native submits. |
| `grid-toggle.js` | `change` on `grid-toggle` | `fetch(url, {method: 'POST', redirect: 'manual', headers: {Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest'}})`. JSON: keep or revert the switch, then `announce(message)`. `opaqueredirect`: `location.reload()` so the real flash shows. Anything else: revert and announce a generic error. | ColumnTogglingExtension and AsyncToggleColumnExtension, merged into one behaviour |
| `grid-preview.js` | `click` on `grid-preview` | Fetches once, fills `grid-preview-content`, toggles `hidden` and `aria-expanded`, manages `aria-busy` and the error Alert with Retry. Dispatches `ps:grid-preview-loaded`. Scoped to its own table. | PreviewExtension (and its document-wide binding bug) |
| `grid-row-link.js` | `click` on `grid-open-row` | Ignores clicks on a link, button or input, or when text is selected. Otherwise clicks the row's `grid-row-link`. Ctrl/Cmd opens a new tab. | LinkRowActionExtension |
| `grid-bulk.js` | `grid-bulk-modal`, `grid-bulk-button` | Modal: on the target modal form's `submit`, appends one input per checked id from its `[data-prototype]`. Button: dispatches `ps:grid-bulk-action`. | ModalFormSubmitExtension, BulkOpenTabsExtension (its logic moves to `order_ui`) |
| `grid-position.js` | `grid-drag-row` (pointer events), `grid-move` | Reorders the page's rows (by drag, or one step with the buttons), then builds the same `positions[i][rowId|oldPosition|newPosition]` form PositionExtension posts (offset-aware) and submits it to the handle's update URL. The drag animation is off under reduced motion. | PositionExtension and tableDnD. CategoryPosition moves with Categories. |
| `load-focus.js` (extended) | `[data-ps-ref="grid-results"]` | After the #31 error and flash checks: when `location.hash` names a results summary, focus it | the scroll-only `#table-id` hash of TableSorting |
| reused | `scroll-fade.js`, `tooltips.js`, `busy-button.js`, `announcer.js` | | |

Later, with Products: `grid-bulk-ajax.js` (chunked POSTs with `request_param_name` and `bulk_chunk_size`, ui:Progress), which replaces AjaxBulkActionExtension.

Retired on kit pages: the per-page `new Grid(id)` lists, `table-sorting.ts`, `filter-link-group.ts` and `themes/default/js/bundle/pagination.js` (not loaded by `Ui/` templates). All of them stay untouched for PS_UI_KIT=0.

The Orders kit entry `admin-dev/themes/new-theme/js/pages/order/index-ui.ts` (webpack `order_ui`, added to `uiKitFiles` in ESLint) keeps only page logic:
- the products toggler, on `ps:grid-preview-loaded`;
- open tabs through the Router, on `ps:grid-bulk-action`.

## Accessibility

- **Region and name**:
  - each grid is a `<section aria-labelledby>`, pointing to its real heading (`headingLevel`), or to its caption when embedded;
  - the `<table>` has a visually hidden `<caption>`, so pages with up to 7 grids (Monitoring) keep each one apart;
  - the scroll box is a named, focusable `role="region"`, so the keyboard can scroll it.
- **Table semantics**:
  - `th scope="col"`, plus one `th scope="row"` per row (the identifier, or the first data or link column);
  - native table, with no `role="grid"` and no `aria-selected`.
- **Row-aware names**: every row control includes its row.
  - Checkbox: `aria-labelledby="{select label} {row header}"` → "Select 42".
  - Switch: column header id plus row header id → "Enabled 42".
  - Icon buttons and the overflow menu: their label plus `aria-describedby` the row header.
  - Preview: "Preview 42".
- **Filters**:
  - every widget has a real `<label>` (visually hidden) from `vars.label`, and placeholders are only hints;
  - date range and min/max are a fieldset with a legend;
  - Search is a real submit that is never disabled, and Enter submits;
  - quick filters are `<button aria-pressed>` in a named `role="group"`.
- **Sorting**: an `<a href>` in the `th` (focusable, works with Enter and middle-click) and `aria-sort` on the sorted `th`. The icon is decorative.
- **Selection**:
  - the `role="status"` line exists from the first render, sits next to the bulk menu and comes before the table in DOM order;
  - select-all is tri-state and named "Select all N rows on this page";
  - the bulk toggle is natively disabled until something is checked.
- **Actions**:
  - icon-only actions are ui:IconButton with a required label, and the tooltip shows the same name;
  - POST and DELETE actions are `<button type="submit">`, never `<a href="#">`;
  - confirmations go through ConfirmDialog (focus trap, Escape, focus back to the trigger);
  - menus are Bootstrap dropdowns with arrow keys.
- **Focus after a round trip**:
  - search, clear, sort, page and rows per page land on the results summary (fragment kept across the redirect, then `load-focus.js`);
  - actions with a flash land on the flash (#31);
  - a reorder reloads with the flash, or with the summary.
- **Async results**: toggle, preview and reset go through the page's single Announcer. Errors restore the control.
- **Not colour alone**: status and boolean cells show an icon shape plus visible text. Choice cells show the status name with a swatch, and the text colour comes from `is_color_bright` (4.5:1). Selected rows get a border as well as a tint.
- **Alternatives to dragging** (WCAG 2.5.7): visible Move up and Move down buttons for keyboard, touch and single pointer.
- **No change of context on input**: rows per page is a menu of links. No select auto-submits.
- **Preview**: the toggle is always visible, never shown only on hover. It has `aria-expanded` and `aria-controls`, and the loading state has `aria-busy`.
- **Truncated text**: the full value stays available to screen readers.
- **Targets**: at least 24×24px, with the checkbox hit area padded across its cell.
- **Reduced motion**: drag animation and transitions stop.

## Responsive

**1280 (design target)**
- The page goes full width: `ui/src/scss/layout/_layout.scss` line 95 becomes `:has(.ps-grid-panel, .ps-grid:not(.ps-grid--embedded))`. `.ps-grid-panel` stays only while old grids still render on kit pages.
- Header: one Cluster row, with the title and count at the start and list actions at the end.
- Toolbar: one row, with the bulk group and status line at the start, then the toolbar slot, then Search, Clear filters and Reorder at the end.
- Orders (about 9 columns) fits without scrolling:
  - cell padding comes from `$table-cell-padding-*` in `_variables.scss`;
  - filter inputs are `form-control-sm` / `form-select-sm`, with a minimum inline size on `.ps-grid__filter`.
- Footer: pagination, rows per page, footer slot.

**375 (fully usable, #14)**
- No horizontal page scroll. Every Cluster wraps: the title wraps above the actions button, and the toolbar stacks the bulk group, the status line and Search/Clear filters.
- The table scrolls inside `.table-responsive`, a named focusable region with scroll fade. The filter row scrolls with its columns. Search stays in the toolbar, reachable without scrolling.
- Menus inside the table use `data-bs-popper-config='{"strategy":"fixed"}'`, so they are not clipped.
- Pagination below `sm`: Previous, "Page 3 of 25" and Next. The far pages are hidden by the `ps-pagination__item--far` modifier in `_pagination.scss`. Rows per page opens upward.
- Targets are at least 24px. Tooltips are skipped on touch (tooltips.js), and names are carried by labels.
- The preview row spans every column and scrolls with the table.
- Drag does not run on touch; Move up and Move down cover it.
- Long modals (SQL, change status) use the ui:Modal `fullscreen` size below `sm`.

## Modules

With PS_UI_KIT=0, or on any page not yet moved, everything below keeps working exactly as today (#12). On kit pages, the Grid never includes `Common/Grid/*`. Every rename or drop is recorded in `ui/.ai/CHANGELOG-UI.md` in the step that ships it.

| Extension point | On kit pages |
|---|---|
| `action{Id}GridDefinitionModifier`, `GridQueryBuilderModifier`, `GridDataModifier`, `GridFilterFormModifier`, `GridPresenterModifier` | Unchanged and honoured, because the kit reads their output. Known column and action types render as kit templates. Unknown types fall back to `column_content()` or `Common/Grid/Actions/{kind}/{type}` (visible, not wired). Added filters render in their column with `form_widget` plus a hidden label. Unmapped extras go through `form_rest`. Extra presenter keys are ignored. |
| `displayAdminGridTableBefore` / `After` | Kept, outside the filter form as today, with the same params `{grid, legacy_controller, controller}` |
| Module overrides through `views/PrestaShop/Admin/Common/Grid/…` | Still apply to non-kit pages. On kit pages they apply only through the fallbacks (unknown types). `{gridId}_{colId}_{type}` overrides of core types, `Blocks/EmptyState/{gridId}` and ps_linklist's `grid_panel` override no longer apply. That also ends its side effect of stripping `ps-grid-panel`. New documented override path: `views/PrestaShop/Admin/Component/Ui/Grid/cell/{gridId}_{colId}_{type}.html.twig` (and `action/…`), with no PHP. |
| Twig blocks `grid_panel_header`, `grid_actions_block`, `grid_panel_body`, `grid_view_block`, `grid_panel_footer`, `grid_panel_extra_content`, `grid_header_row`, `grid_bulk_actions_block`, `grid_table_row`, `grid_footer_row`, `grid_extra_content`, `grid_table_head`, `grid_table_body`, `grid_table_footer`, `grid_pagination`, `link` | Stay in the old templates. On kit pages they are replaced by the slots `before`, `toolbar`, `empty` and `footer`, or by page markup (modals). Module pages that embed `grid_panel` are unaffected until they opt in. |
| Twig functions `column_content`, `column_header`, `is_ordering_column` | Unchanged. The kit uses `column_content` (fallback) and `is_ordering_column`. |
| Ids kept | `#{id}_grid_panel` (root), `#{id}_grid` (body), `#{id}_grid_table`, `#{id}_filter_form`, `#{id}_grid_bulk_action_select_all`, `#{id}-grid-actions-button` (on the button), `#{id}_grid_common_show_query_modal`, `#{id}_common_show_query_modal_form` |
| Ids dropped | `#{id}-grid-actions-dropdown-menu`, `#{id}_grid_bulk_action_{action}`, `#{id}-grid-action-{action}` / `#{id}_grid_action_{action}`, `#{id}-grid-confirm-modal` (replaced by the single ConfirmDialog), `#paginator_select_page_limit`, `#pagination_next_url`, and `#{id}_grid_delete_*_modal` until those pages move |
| Ids new | `#{id}_grid_action_form`, `#{id}_grid_results`, `#{id}_grid_caption`, `#{id}_grid_title`, `#{id}_grid_rowhead_{rowId}`, `#{id}_grid_preview_{rowId}` |
| Classes and attributes the old JS binds to (`js-grid*`, `js-bulk-*`, `js-*-row-action`, `ps-togglable-row`, `ps-switch`, `preview-toggle`, `column-headers`, `column-filters`, `ps-sortable-column`, `grid-search-button`, `js-reset-search`, `js-drag-handle`, `{type}-type`, `column-{id}`, `clickable`, `grid-ordering-column`, `data-toggle-url`, `data-preview-data-url`, `data-sort-*`, `data-confirm-message`, `psurl`, …) | Not rendered. Kit hooks are `data-ps-*` only. CHANGELOG-UI gets an old → new table. |
| `window.prestashop.component.Grid` / `GridExtensions` | Still exposed (theme-ui.ts). On a kit grid, `new Grid(id)` finds `#{id}_grid`, but the extensions find none of their classes, so they do nothing and throw nothing. The replacements are `ps:grid-bulk-action`, `ps:grid-preview-loaded` and the `data-ps-*` hooks, documented in the Grid story docs and CHANGELOG-UI. |
| Request contracts (filter POST, `{prefix}[…]`, `{gridId}_{col}[]`, `value`, `positions[]`, `_method`, preview JSON, reset POST, ajax bulk `request_param_name`/`bulk_chunk_size`) | Unchanged, so module controllers behind core grids keep working |
| UI tests (ui-testing-library page objects) | Kept ids still match. Selectors on dropped classes move to roles and labels ("Select all…", "Bulk actions", the caption, "Clear filters") in the final pass (#7), driven by the CHANGELOG |

## Components to create first

In this order:

1. **`<twig:ui:Check>`** (INVENTORY #28, absorbing #27 Switch; see open question 1).
   - Files: `Check.php`, `check.html.twig`, story, tests.
   - Props: `label` (required), `type` `checkbox|switch` (switch adds `form-switch` and `role="switch"`), `hideLabel`, `checked`, `disabled`, `name`, `value`, `id` (generated when missing).
   - Attributes pass through to the `<input class="form-check-input ps-grid__check">`, the BEM class being set by the caller through attributes.
   - Supports `indeterminate` (JS property) and `data-ps-state="loading"`.
   - Hit area of at least 24px.
2. **`<twig:ui:EmptyState>`** (INVENTORY #25).
   - Props: `title` (required), `icon`, `size` `md|sm`, `headingLevel`.
   - The content block is the message. An `actions` block holds CTAs, laid out by an inner `ui:Layout:Cluster`.
3. **`<twig:ui:Pagination>`** (INVENTORY #24).
   - Props: `current`, `links` (`array<int,string>`), `label`.
   - Renders `<nav aria-label>` with Bootstrap `.pagination`, `aria-current="page"`, ellipses with hidden text, Previous/Next absent at the ends, and the compact mode below `sm` in `_pagination.scss`.
   - Generic: callers compute the links.
4. **`<twig:ui:ConfirmDialog>` + `confirm-dialog.js`** (INVENTORY #23).
   - One `ui:Modal`-based dialog, placed once by the kit layouts next to the Announcer.
   - Driven by `data-ps-confirm`. Focus starts on Cancel for the danger variant.
5. **`DropdownMenu` `submit` item type**, with a story state and a test.
6. **Kit form theme filter blocks** in `ui_kit_layout.html.twig`: `date_range_widget`, `integer_min_max_filter_widget`, `number_min_max_filter_widget`.

Reused unchanged:
- `ui:Dropdown` (rows per page)
- `ui:DropdownMenu` (list actions, bulk, row overflow, choice)
- `ui:IconButton` (inline actions, toggles of menus, move buttons)
- `ui:Button` (Search, Clear filters, Reorder)
- `ui:Badge` (count, badge cells)
- `ui:Modal` (SQL query, page modals)
- `ui:Alert` (preview error)
- `ui:Icon`, `ui:Link` (back links in the footer slot)
- `ui:Announcer`
- `ui:Layout:Stack`, `ui:Layout:Cluster`
- `scroll-fade.js`, `tooltips.js`, `busy-button.js`

Not used:
- `ui:Card`: the grid owns its card regions, and `embedded` drops them.
- `ui:FormRow`: filters are a widget plus a hidden label.

Later, with Products: `ui:Progress`.

## Build plan

Each step ships on its own and ends with its checks green. A component step means: PHP class, template, BEM partial if needed, a story with `withTwig`, a StoryMarkup snapshot, a ComponentTest, `story-parity.mjs`, then `ui-component-review` at 375/768/1280.

1. **ui:Check** (checkbox and switch).
   - Story: every prop, indeterminate, switch, loading, long label.
   - Tests: the label is required, `role=switch`, the generated id, attributes passed through.
   - Check: axe clean, target ≥24px.
2. **ui:EmptyState and ui:Pagination**.
   - Stories: long title, sm size, with and without actions; 1 page, 3 pages, 1000 pages, current at each end, compact at 375.
   - Tests: ellipsis placement, `aria-current`, Previous/Next absent at the ends.
3. **ui:ConfirmDialog + `confirm-dialog.js`**, placed in the kit layouts.
   - Story: a submit button with `formaction` and `name/value`, and a link.
   - Tests: render.
   - Check: a keyboard pass (confirm, cancel, Escape, focus return), and `requestSubmit` keeps the submitter's name/value.
4. **DropdownMenu `submit` item**.
   - Story state.
   - Tests: the resolver rejects `href`, and `form` is required.
   - Check: a submit item posts its `form` with `formaction` and `name/value`.
5. **Kit form theme filter blocks**.
   - Tests: a Twig integration test that renders `OrderGridDefinitionFactory`'s filter form with the kit theme. Every child has a label, there is no BS4 class, and the field names are identical to the BS4 theme's.
   - Check: the Orders date filter posts the same values as today.
6. **ui:Grid, read-only**.
   - Scope:
     - `Grid.php` (state, sort, page links, limits, range, filter pickers, rowActions, icon, hookParams);
     - `grid.html.twig` with header, embedded, toolbar Search/Clear filters, filter row, summary, the typed cells `data`, `identifier`, `link`, `disableable_link`, `boolean`, `status`, `badge`, `color`, `date_time`, `order_price`, `image`, `html`, `link_group`, `severity_level` and `_fallback`;
     - sorting, pagination, rows per page, empty and no-match, both hooks;
     - `query_modal`, `_grid.scss`, `grid-filters.js`, the `load-focus.js` extension, the `_layout.scss` rule.
   - Story: `Grid.stories.js` fed by a presented-grid fixture, with the states list, list, empty, no match, filtered, embedded, display_name false, module type fallback, several grids.
   - Tests: PHP unit tests for `sortHref`/`pageLinks` (`{prefix}[…]`, empty prefix, fragment), `rowActions`, `icon` (alias, registry miss → null) and `LIMITS` equal to CommonController's default. GridComponentTest: aria-sort, `column_content` fallback, both hooks outside the form, kept ids.
   - Check: `ui-component-review` at 375/768/1280, axe, keyboard pass.
7. **Selection and bulk**.
   - Scope: the `bulk_action` cell, select-all, the status line, bulk items `submit` / `modal_form_submit` / `button`, `grid-selection.js`, `grid-bulk.js`, the selected-row style.
   - Story states: none, some, all.
   - Check: a bulk action posts a body identical to today's (filter fields, `_token`, `{gridId}_{col}[]`), compared in the network panel. Indeterminate is announced. The keyboard pass works.
8. **Row actions and clickable rows**.
   - Scope: the `action` cell (inline, primary, overflow with the fixed popper), kit `link` and `submit` templates through `{id}_grid_action_form` with `_method`, `data-ps-confirm` mapping (static and `dynamic_message_field`), `grid-row-link.js`, list actions (link, refresh, show query, export to SQL Manager, submit with confirm).
   - Check:
     - a DELETE row action reaches its controller;
     - names include the row;
     - the menu is not clipped at 375;
     - Export to SQL Manager opens RequestSql pre-filled with the grid name and query.
9. **Orders cells and playground** (checkpoint 2 of migrate-page-to-ui).
   - Scope: the `choice` cell (submit items posting `value`), the `preview` cell, the preview row, `grid-preview.js`.
   - Story: `ui/src/playground/pages/orders/orders.stories.js` shows the real grid under the KPI row, with a status choice, preview and bulk.
   - Check: approval of the mockup.
10. **Orders page on the kit**.
    - Scope:
      - `Sell/Order/Order/Ui/index.html.twig` (KPI row, `<twig:ui:Grid :grid="orderGrid">` with its `empty` block, the change-status modal as a kit Modal keeping `#changeOrdersStatusModal` and its `data-prototype`, no `pagination.js`);
      - the `ui_kit` branch of `preview.html.twig`;
      - the `order_ui` entry (open tabs, products toggler);
      - CHANGELOG-UI entries, new strings via `missing-translations.mjs`, page objects updated.
    - Check:
      - `ui-review` at 375/768/1280 with the `ui-seed` full listing, then `ui-screen-review` (done gates #18);
      - Orders with PS_UI_KIT=0 unchanged;
      - the Orders Playwright campaign green.
11. **Toggle cell + `grid-toggle.js`**.
    - Check: Customers (JSON) toggles in place and announces success and failure. Zones (redirect) reloads with its flash focused. An error response reverts the switch.
12. **Position**.
    - Scope: the handle cell, Move up/down, `grid-position.js`.
    - Check: a Behat or Playwright test on Attribute groups shows that drag and the Move buttons post a `positions[]` body identical to PositionExtension's, page 2 (offset) included. Move is disabled at the page edges.
13. **Plain grid pages (V1)** one by one with `migrate-page-to-ui`. Each is a template switch plus removing the page's grid JS init.
    - Check per page: a quick `ui-review` and its UI tests.
14. **Rare variants as their pages move**.
    - Scope:
      - quick filters (Discounts, with a test pinning the hidden-plus-button value order);
      - the `before` slot (Monitoring) and the `footer` slot (Attributes, Feature values, CMS, Categories, Email logs);
      - several grids (Order states, CMS, Brands, Monitoring);
      - Products (category tree in `toolbar`, shop-preview sub-rows, `grid-bulk-ajax.js` + ui:Progress);
      - domain row and bulk types as kit action templates on ConfirmDialog or a page Modal (Customers, Categories, Image settings, Business entities, shipments).
    - Check: each page's `ui-screen-review` and UI tests.

## Settled questions

Settled on 2026-11-25 with the recommendations (DECISIONS.md #43):

1. **One `ui:Check` with `type: checkbox|switch`**, no separate `ui:Switch`: Bootstrap treats a switch as a form-check variant; the switch only adds `role="switch"` and a class. INVENTORY #27 folds into #28.
2. **The filter row scrolls with the table at 375** in v1: each filter stays under its column, Search is always in the toolbar. Revisited if the 375 `ui-review` of Orders shows it is hard to use.
3. **No sticky columns at 375 in v1.** Added as a CSS-only change if the 375 review asks, with an opaque background and a visible focus ring (2.4.11).
4. **`pagination_view=quicknav` and `empty_state_without_headers` are ignored on kit pages**: one pagination (compact below sm), one empty behaviour. Recorded in CHANGELOG-UI when the grid lands.
5. **The per-grid empty states move into each page's `empty` block**: module overrides of `Blocks/EmptyState/{gridId}` no longer show on kit pages. Recorded in CHANGELOG-UI when the grid lands.

## Left aside

- **Selection across all pages ("select all 1,234 results")**: no server contract exists, so adding one is a feature, not a UI rework.
- **Active-filter chips, a collapsible filter panel, sticky thead with a capped-height scroll box, a sticky bulk bar, a Save/Cancel position bar**: they add parts and JS without a proven need, and two judges rejected them for v1. They can come back if a review asks for them.
- **Move to top/bottom**: it needs positions beyond the current page.
- **Events with no consumer** (`selection-change`, `toggled`, `positions-saved`, `row-action`), and a `title` prop: nothing needs them, and the brief says nothing "just in case".
- **JSON responses for the 24 redirecting toggle routes**: a PHP change outside the UI scope. `redirect: 'manual'` covers both kinds of route.
- **A shared limit-choices constant in Core**: a Core change. The list is duplicated in `Grid::LIMITS` and pinned by a test.
- **Translated labels for legacy Material icon names**: the visible or accessible text always comes from the action or column name, never from the icon.
- **`tax_rule_grid_panel.html.twig`**: dead code. It is not migrated; its removal belongs to a separate cleanup.
- **Kit templates for module custom types**: modules ship them through the documented override path. The core provides the fallback only.
