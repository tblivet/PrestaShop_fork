<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Integration\PrestaShopBundle\Twig\Component\Ui;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;
use Twig\Loader\ArrayLoader;
use Twig\Loader\ChainLoader;

/**
 * The rendered markup must match ui/src/stories/components/Grid.stories.js.
 */
class GridComponentTest extends KernelTestCase
{
    public function testANamedSectionWithTheOldGridsIds(): void
    {
        $html = $this->render();

        $this->assertStringStartsWith('<section id="order_grid_panel" class="ps-grid card" data-ps-ref="grid" data-ps-data-grid-id="order" aria-labelledby="order_grid_title">', $html);
        $this->assertStringContainsString('<h2 id="order_grid_title" class="ps-grid__title">Orders', $html);
        foreach (['order_grid', 'order_grid_table', 'order_filter_form', 'order_grid_results', 'order_grid_caption'] as $id) {
            $this->assertStringContainsString('id="' . $id . '"', $html);
        }
    }

    public function testAnEmbeddedGridIsNamedByItsCaption(): void
    {
        $html = $this->render([], ' embedded :headingLevel="3"');

        $this->assertStringStartsWith('<section id="order_grid_panel" class="ps-grid ps-grid--embedded" data-ps-ref="grid" data-ps-data-grid-id="order" aria-labelledby="order_grid_title"><h3 id="order_grid_title" class="visually-hidden">Orders</h3>', $html);
        $this->assertStringNotContainsString('card-header', $html);
        $this->assertStringNotContainsString('card-body', $html);
    }

    public function testTheSortedColumnSaysItAndEverySortableOneIsALink(): void
    {
        $html = $this->render();

        $this->assertMatchesRegularExpression('#<th scope="col" id="order_col_date_add" class="ps-grid__heading" aria-sort="descending"><a class="ps-grid__sort" href="\?order%5BorderBy%5D=date_add&amp;order%5BsortOrder%5D=asc\#order_grid_results">#', $html);
        $this->assertStringContainsString('<th scope="col" id="order_col_new" class="ps-grid__heading">New client</th>', $html);
        $this->assertSame(1, substr_count($html, 'aria-sort='));
    }

    public function testFiltersAreNamedByTheirColumnAndPostTheSameFields(): void
    {
        $html = $this->render();

        $this->assertStringContainsString('<label class="visually-hidden form-label" for="order_reference">Reference</label>', $html);
        $this->assertMatchesRegularExpression('#<input type="text" id="order_reference" name="order\[reference\]" class="form-control-sm form-control"\s*/?>#', $html);
        $this->assertStringContainsString('<fieldset class="ps-filter-range" id="order_date_add"><legend class="visually-hidden">Date</legend>', $html);
        $this->assertStringNotContainsString(' input"', $html);
        $this->assertStringContainsString('action="/sell/orders/filter#order_grid_results"', $html);
    }

    public function testEachRowHasItsHeader(): void
    {
        $html = $this->render();

        $this->assertStringContainsString('<th scope="row" class="ps-grid__cell ps-grid__cell--identifier"><span id="order_grid_rowhead_1">1024</span>', $html);
        $this->assertSame(3, substr_count($html, 'scope="row"'));

        $html = $this->render(['columns' => $this->columns(fn (array $column): array => 'id_order' === $column['id'] ? ['options' => ['preview' => null] + $column['options']] + $column : $column)]);
        $this->assertStringContainsString('<th scope="row" id="order_grid_rowhead_1" class="ps-grid__cell ps-grid__cell--identifier">1024</th>', $html);
        $this->assertStringNotContainsString('ps-grid__preview', $html);
    }

    public function testARowsPreviewIsToggledIntoTheRowUnderIt(): void
    {
        $html = $this->render();

        $this->assertMatchesRegularExpression('#<button class="btn btn-link btn-sm ps-button ps-icon-button ps-grid__preview-toggle" type="button" data-ps-data-busy-label="Loading..." aria-label="Preview" aria-expanded="false" aria-controls="order_grid_preview_1" aria-describedby="order_grid_rowhead_1" data-ps-action="grid-preview" data-ps-data-url="/sell/orders/1024/preview[^"]*" data-ps-data-loading="Loading..." data-ps-data-error="The preview could not be loaded." data-ps-data-retry="Try again">#', $html);
        $this->assertStringContainsString('<tr id="order_grid_preview_1" class="ps-grid__preview" hidden data-ps-ref="grid-preview">', $html);
        $this->assertStringContainsString('<td colspan="9"><div class="ps-grid__preview-content" data-ps-target="grid-preview-content"></div></td>', $html);
    }

    public function testAStatusChoicePostsItsValueThroughTheActionForm(): void
    {
        $html = $this->render();

        $this->assertStringContainsString('<button class="btn btn-outline-secondary btn-sm ps-button ps-grid__choice ps-grid__choice--ink-dark" type="button" data-ps-data-busy-label="Loading..." style="--psk-grid-choice-color: #3498D8" data-bs-toggle="dropdown" aria-expanded="false" data-bs-popper-config="{&quot;strategy&quot;:&quot;fixed&quot;}" aria-describedby="order_grid_rowhead_1"><span class="ps-button__label"><span class="visually-hidden">Status: </span>Payment accepted</span>', $html);
        $this->assertStringContainsString('<button type="submit" class="dropdown-item ps-dropdown-menu__item" aria-current="true" form="order_grid_action_form" formaction="/sell/orders/list/1024/status" name="value" value="2">', $html);
        $this->assertStringContainsString('<button type="submit" class="dropdown-item ps-dropdown-menu__item" form="order_grid_action_form" formaction="/sell/orders/list/1024/status" name="value" value="5">', $html);
        $this->assertStringContainsString('ps-grid__choice--ink-light" type="button" data-ps-data-busy-label="Loading..." style="--psk-grid-choice-color: #34209E"', $html);
    }

    public function testAToggleIsASwitchNamedByItsColumnAndRow(): void
    {
        $html = $this->render([], '', true, 'carrier-grid');

        $this->assertStringContainsString('<input class="form-check-input ps-check__input ps-grid__toggle" type="checkbox" id="carrier_grid_active_1" role="switch" checked aria-labelledby="carrier_col_active carrier_grid_rowhead_1" data-ps-action="grid-toggle" data-ps-data-url="/improve/shipping/carriers/1/toggle-status" data-ps-data-error="The change could not be saved. Try again.">', $html);
        $this->assertStringContainsString('id="carrier_grid_is_free_2" role="switch" aria-labelledby="carrier_col_is_free carrier_grid_rowhead_2"', $html);
    }

    public function testSortedByPositionEachRowMovesAndDoneGoesBack(): void
    {
        $html = $this->render([], '', true, 'carrier-grid');

        $this->assertStringContainsString('<th scope="col" id="carrier_col_position_handle" class="ps-grid__heading ps-grid__heading--select"><span class="visually-hidden">Move</span></th>', $html);
        $this->assertStringContainsString('<div class="ps-grid__position" data-ps-ref="grid-position" data-ps-data-id="1" data-ps-data-position="0" data-ps-data-url="/improve/shipping/carriers/update-position" data-ps-data-method="POST">', $html);
        $this->assertMatchesRegularExpression('#type="button" data-ps-data-busy-label="Loading..." disabled aria-label="Move up" aria-describedby="carrier_grid_rowhead_1" data-ps-action="grid-move" data-ps-data-direction="up">#', $html);
        $this->assertMatchesRegularExpression('#disabled aria-label="Move down" aria-describedby="carrier_grid_rowhead_4"#', $html);
        $this->assertSame(2, substr_count($html, ' disabled aria-label="Move'));
        $this->assertMatchesRegularExpression('#<td class="ps-grid__cell ps-grid__cell--position">\s*1\s*</td>#', $html);
        $this->assertMatchesRegularExpression('#<a class="btn btn-outline-secondary ps-button" href="\?carrier%5BorderBy%5D=id_carrier&amp;carrier%5BsortOrder%5D=asc\#carrier_grid_results">.*?Done</span></a>#s', $html);
        $this->assertStringNotContainsString('js-btn-reorder-positions', $html);
    }

    public function testNotSortedByPositionRearrangeSortsByIt(): void
    {
        $html = $this->render(['sorting' => ['order_by' => 'id_carrier', 'order_way' => 'asc'], 'columns' => array_values(array_filter($this->columns(fn (array $column): array => $column, 'carrier-grid'), fn (array $column): bool => 'position_handle' !== $column['type']))], '', true, 'carrier-grid');

        $this->assertMatchesRegularExpression('#href="\?carrier%5BorderBy%5D=position&amp;carrier%5BsortOrder%5D=asc\#carrier_grid_results">.*?Rearrange</span></a>#s', $html);
        $this->assertStringNotContainsString('grid-position', $html);
    }

    public function testAQuickFilterSubmitsItsChoiceAfterItsHiddenField(): void
    {
        $fixture = json_decode(file_get_contents(__DIR__ . '/../../../../../../ui/src/stories/fixtures/order-grid.json'), true, 512, JSON_THROW_ON_ERROR);
        $fixture['filters'][] = ['name' => 'period_filter', 'type' => 'filter_link', 'options' => ['default_value' => 'all', 'filter_options' => ['all' => 'All', 'active' => 'Active', 'expired' => 'Expired']]];
        $html = $this->render(['filters' => $fixture['filters'], 'filter_data' => ['period_filter' => 'active']]);

        $this->assertMatchesRegularExpression('#<div class="ps-grid__quick-filters btn-group" role="group" aria-label="Period filter">\s*<input type="hidden" form="order_filter_form" name="order\[period_filter\]" value="active">#', $html);
        $this->assertMatchesRegularExpression('#<button type="submit" form="order_filter_form" class="btn btn-outline-secondary" name="order\[period_filter\]" value="all" aria-pressed="false">\s*All\s*</button>#', $html);
        $this->assertMatchesRegularExpression('#<button type="submit" form="order_filter_form" class="btn btn-outline-secondary active" name="order\[period_filter\]" value="active" aria-pressed="true"><svg[^>]*>.*?</svg>\s*Active\s*</button>#s', $html);
        $this->assertSame(1, substr_count($html, 'name="order[period_filter]" value="active"') - substr_count($html, 'type="submit" form="order_filter_form" class="btn btn-outline-secondary active" name="order[period_filter]" value="active"'));
        $this->assertStringNotContainsString('js-filter-link-field', $html);
    }

    public function testAGridsOwnEmptyStateReplacesTheDefault(): void
    {
        $html = $this->render(['id' => 'supplier', 'is_empty_state' => true, 'records' => [], 'records_total' => 0, 'pagination' => ['offset' => 0, 'limit' => 50]]);

        $this->assertStringContainsString('Keep in touch with your suppliers', $html);
        $this->assertStringNotContainsString('No records found', $html);
        $this->assertMatchesRegularExpression('#<h3 [^>]*>\s*Keep in touch with your suppliers#', $html);
    }

    public function testARowWithAClickableLinkFollowsItFromItsClickableCells(): void
    {
        $html = $this->render();

        $this->assertStringContainsString('<tr class="ps-grid__row" data-ps-action="grid-row-link" data-ps-data-href="/sell/orders/1024/view">', $html);
        $this->assertStringContainsString('class="ps-grid__cell ps-grid__cell--boolean ps-grid__cell--clickable"', $html);
        $this->assertStringContainsString('class="ps-grid__cell ps-grid__cell--data"', $html);
    }

    public function testNoMatchKeepsTheHeadingsWithoutSortLinks(): void
    {
        $html = $this->render(['filter_data' => ['reference' => 'ZZZ'], 'records' => [], 'records_total' => 0, 'pagination' => ['offset' => 0, 'limit' => 50]]);

        $this->assertStringContainsString('<div class="ps-empty-state ps-empty-state--sm ps-grid__no-match">', $html);
        $this->assertStringContainsString('0 results</p>', $html);
        $this->assertStringNotContainsString('ps-grid__sort', $html);
        $this->assertStringContainsString('data-ps-action="grid-reset-filters" data-ps-data-url="/common/reset_search/order" data-ps-data-redirect="/sell/orders" data-ps-data-fragment="order_grid_results" data-ps-data-error="The filters could not be cleared. Try again."', $html);
        $this->assertStringNotContainsString('ps-grid__footer', $html);
    }

    public function testNothingYetShowsTheEmptyStateOnly(): void
    {
        $html = $this->render(['records' => [], 'records_total' => 0, 'pagination' => ['offset' => 0, 'limit' => 50], 'is_empty_state' => true]);

        $this->assertStringContainsString('class="ps-empty-state"', $html);
        $this->assertStringNotContainsString('<table', $html);
        $this->assertStringContainsString('ps-grid__header', $html);
    }

    public function testThePagesAndRowsPerPage(): void
    {
        $html = $this->render();

        $this->assertStringContainsString('<nav class="ps-pagination ps-pagination--jump ps-grid__pagination" aria-label="Pages of Orders">', $html);
        $this->assertStringContainsString('data-ps-data-url="?order%5Boffset%5D={offset}&amp;order%5Blimit%5D=50#order_grid_results"', $html);
        $this->assertStringContainsString('<span class="ps-button__label">50 per page</span>', $html);
        $this->assertStringNotContainsString('ps-pagination', $this->render(['records_total' => 3, 'pagination' => ['offset' => 0, 'limit' => 50]]));
    }

    public function testALinkCellAndAColumnTypeOfAModule(): void
    {
        $columns = [
            ['id' => 'reference', 'name' => 'Reference', 'type' => 'link', 'options' => ['field' => 'reference', 'route' => 'admin_orders_view', 'route_param_name' => 'orderId', 'route_param_field' => 'id_order', 'sortable' => false]],
            ['id' => 'module', 'name' => 'Module', 'type' => 'html', 'options' => ['field' => 'html']],
        ];
        $records = [['id_order' => 1024, 'reference' => 'XKBKNABJK', 'html' => '<strong>Hi</strong>']];
        $html = $this->render(['columns' => $columns, 'filters' => [], 'records' => $records, 'records_total' => 1, 'pagination' => ['offset' => 0, 'limit' => 50]]);

        $this->assertMatchesRegularExpression('#<a class="ps-grid__link" href="[^"]*/sell/orders/1024/view[^"]*">XKBKNABJK</a>#', $html);
        $this->assertStringContainsString('<strong>Hi</strong>', $html);
        $this->assertStringContainsString('<th scope="row" id="order_grid_rowhead_1" class="ps-grid__cell ps-grid__cell--link">', $html);
    }

    public function testTheCellsOfEachType(): void
    {
        $columns = [
            ['id' => 'id', 'name' => 'ID', 'type' => 'identifier', 'options' => ['identifier_field' => 'id']],
            ['id' => 'active', 'name' => 'Enabled', 'type' => 'status', 'options' => []],
            ['id' => 'color', 'name' => 'Colour', 'type' => 'color', 'options' => ['field' => 'name', 'color_field' => 'color']],
            ['id' => 'customer', 'name' => 'Customer', 'type' => 'disableable_link', 'options' => ['field' => 'customer', 'disabled_field' => 'deleted', 'route' => 'admin_orders_view', 'route_param_name' => 'orderId', 'route_param_field' => 'id']],
            ['id' => 'logo', 'name' => 'Logo', 'type' => 'image', 'options' => ['src_field' => 'logo', 'alt_field' => 'name']],
            ['id' => 'links', 'name' => 'Links', 'type' => 'link_group', 'options' => ['links' => [['route' => 'admin_orders_view', 'route_param_name' => 'orderId', 'route_param_field' => 'id', 'icon' => 'remove_red_eye', 'is_link_available_field' => 'viewable', 'label' => 'View']]]],
            ['id' => 'severity', 'name' => 'Severity', 'type' => 'severity_level', 'options' => ['with_message' => true]],
            ['id' => 'state', 'name' => 'State', 'type' => 'badge', 'options' => ['field' => 'state', 'badge_type' => 'success']],
            ['id' => 'module', 'name' => 'Module', 'type' => 'empty', 'options' => ['empty_value' => 'n/a']],
        ];
        $records = [
            ['id' => 7, 'active' => true, 'name' => 'Red', 'color' => '#E74C3C', 'customer' => 'J. Doe', 'deleted' => true, 'logo' => '/img/red.png', 'viewable' => true, 'severity' => 3, 'state' => 'Paid'],
        ];
        $html = $this->render(['columns' => $columns, 'filters' => [], 'records' => $records, 'records_total' => 1, 'pagination' => ['offset' => 0, 'limit' => 50]]);

        $this->assertMatchesRegularExpression('#<span class="ps-grid__state ps-grid__state--on">\s*<svg[^>]*ps-grid__state-icon[^>]*>.*?</svg>Yes</span>#s', $html);
        $this->assertStringContainsString('<span class="ps-grid__color"><span class="ps-grid__swatch" style="--psk-grid-swatch-color: #E74C3C"></span>Red</span>', $html);
        $this->assertStringContainsString('Deleted customer', $html);
        $this->assertStringContainsString('<img class="ps-grid__image" src="/img/red.png" alt="Red">', $html);
        $this->assertMatchesRegularExpression('#<a class="btn btn-link btn-sm ps-button ps-icon-button" href="[^"]*/sell/orders/7/view[^"]*"[^>]*aria-label="View"#', $html);
        $this->assertMatchesRegularExpression('#<span class="badge ps-badge ps-badge--danger ps-badge--pill">\s*Error \(3\)\s*</span>#', $html);
        $this->assertStringContainsString('<span class="badge ps-badge ps-badge--success">Paid</span>', $html);
        $this->assertMatchesRegularExpression('#ps-grid__cell--empty">\s*n/a\s*</td>#', $html);
    }

    public function testARecordsColourBadgeReadsDarkOrLightText(): void
    {
        $html = $this->render(['columns' => $this->columns(fn (array $column): array => 'osname' === $column['id'] ? ['type' => 'badge', 'options' => ['field' => 'osname', 'color_field' => 'color']] + $column : $column)]);

        $this->assertStringContainsString('<span class="badge ps-badge ps-badge--light ps-grid__badge ps-grid__badge--ink-dark" style="--psk-grid-badge-color: #3498D8">Payment accepted</span>', $html);
        $this->assertStringContainsString('ps-grid__badge--ink-light" style="--psk-grid-badge-color: #34209E"', $html);
    }

    public function testAPageOverridesACellOfItsGrid(): void
    {
        self::bootKernel();
        $loader = static::getContainer()->get('twig')->getLoader();
        $override = new ArrayLoader(['@PrestaShop/Admin/Component/Ui/Grid/cell/order_reference_data.html.twig' => '<mark>{{ record.reference }}</mark>']);
        static::getContainer()->get('twig')->setLoader(new ChainLoader([$override, $loader]));

        $html = $this->render([], '', false);

        $this->assertStringContainsString('<td class="ps-grid__cell ps-grid__cell--data"><mark>XKBKNABJK</mark></td>', $html);
    }

    public function testTheHeadingLevelOfTheTitleAndItsEmptyStates(): void
    {
        $this->assertStringContainsString('<h3 id="order_grid_title" class="ps-grid__title">Orders', $this->render([], ' :headingLevel="3"'));
        $this->assertStringContainsString('<h4 class="ps-empty-state__title">No records found</h4>', $this->render(['records' => [], 'records_total' => 0, 'pagination' => ['offset' => 0, 'limit' => 50], 'is_empty_state' => true], ' :headingLevel="3"'));
    }

    public function testATitleNotShownIsForScreenReadersWithoutAHeaderBand(): void
    {
        $html = $this->render(['view_options' => ['display_name' => false], 'grid_actions' => []]);

        $this->assertStringContainsString('<h2 id="order_grid_title" class="visually-hidden">Orders</h2>', $html);
        $this->assertStringNotContainsString('ps-grid__header', $html);
    }

    public function testATitleNotShownKeepsTheBandForTheListActions(): void
    {
        $html = $this->render(['view_options' => ['display_name' => false]]);

        $this->assertMatchesRegularExpression('#<header class="ps-grid__header card-header">\s*<h2 id="order_grid_title" class="ps-grid__title visually-hidden">Orders #', $html);
        $this->assertStringContainsString('ps-grid__list-actions', $html);
    }

    public function testTheListActionsAreAMenuInTheHeader(): void
    {
        $html = $this->render();

        $this->assertStringContainsString('aria-label="List actions" id="order-grid-actions-button" data-bs-toggle="dropdown" aria-expanded="false"', $html);
        $this->assertMatchesRegularExpression('#<a class="dropdown-item ps-dropdown-menu__item" href="/sell/orders/">.*?Export</span></a>#', $html);
        $this->assertMatchesRegularExpression('#<a class="dropdown-item ps-dropdown-menu__item" href="\?\#order_grid_results">.*?Refresh list</span></a>#', $html);
        $this->assertStringContainsString('<button type="button" class="dropdown-item ps-dropdown-menu__item" data-bs-toggle="modal" data-bs-target="#order_grid_common_show_query_modal">', $html);
        $this->assertStringContainsString('<button type="submit" class="dropdown-item ps-dropdown-menu__item" form="order_common_show_query_modal_form">', $html);
    }

    public function testTheQueryModalSendsTheQueryToTheSqlManager(): void
    {
        $html = $this->render();

        $this->assertStringContainsString('id="order_grid_common_show_query_modal"', $html);
        $this->assertMatchesRegularExpression('#<form id="order_common_show_query_modal_form" class="ps-grid__query" method="post" action="[^"]*">#', $html);
        $this->assertStringContainsString('<label class="form-label" for="order_grid_query">SQL query</label>', $html);
        $this->assertStringContainsString('id="order_grid_query" name="sql" rows="10" readonly>SELECT o.id_order, o.reference FROM ps_orders o ORDER BY o.date_add DESC LIMIT 50, 50</textarea>', $html);
        $this->assertStringContainsString('<input type="hidden" name="name" value="Orders">', $html);
        $this->assertMatchesRegularExpression('#<button class="btn btn-primary ps-button" type="submit"[^>]* form="order_common_show_query_modal_form">#', $html);
    }

    public function testNoQueryModalWithoutAQueryAction(): void
    {
        $html = $this->render(['grid_actions' => []]);

        $this->assertStringNotContainsString('_common_show_query_modal', $html);
        $this->assertStringNotContainsString('ps-grid__list-actions', $html);
    }

    public function testARowShowsItsFirstActionsAsButtonsAndTheRestInAMenu(): void
    {
        $html = $this->render();

        $this->assertStringContainsString('<a class="btn btn-link btn-sm ps-button ps-icon-button" href="/sell/orders/1024/view" aria-label="View" data-bs-toggle="tooltip" data-bs-title="View" aria-describedby="order_grid_rowhead_1">', $html);
        $this->assertStringContainsString('<a class="btn btn-link btn-sm ps-button ps-icon-button" href="/sell/orders/?orderId=1024" aria-label="Download the invoice"', $html);
        $this->assertStringContainsString('aria-label="More actions" data-bs-toggle="dropdown" aria-expanded="false" data-bs-popper-config="{&quot;strategy&quot;:&quot;fixed&quot;}" aria-describedby="order_grid_rowhead_1"', $html);
    }

    public function testARowSubmitActionSendsTheActionFormWithItsMethod(): void
    {
        $html = $this->render();

        $this->assertStringContainsString('<button type="submit" class="dropdown-item ps-dropdown-menu__item" form="order_grid_action_form" formaction="/sell/orders/?orderId=1024" formmethod="post" name="_method" value="DELETE" data-ps-confirm="Delete this order? This cannot be undone." data-ps-data-confirm-title="Delete order?" data-ps-data-confirm-label="Delete" data-ps-data-confirm-variant="danger">', $html);
        $this->assertStringContainsString('<form id="order_grid_action_form" method="post" hidden data-ps-ref="grid-action-form"></form>', $html);
    }

    public function testEachRowHasACheckNamedWithItsHeader(): void
    {
        $html = $this->render();

        $this->assertStringContainsString('<input class="form-check-input ps-check__input ps-grid__check" type="checkbox" id="order_grid_bulk_action_select_all" data-ps-action="grid-select-all">', $html);
        $this->assertStringContainsString('<span class="visually-hidden">Select all 3 rows on this page</span>', $html);
        $this->assertStringContainsString('<input class="form-check-input ps-check__input ps-grid__check" type="checkbox" id="order_grid_select_1024" name="order_orders_bulk[]" value="1024" data-ps-action="grid-select-row" aria-labelledby="order_grid_select_label order_grid_rowhead_1">', $html);
        $this->assertStringContainsString('<span id="order_grid_select_label" hidden>Select</span>', $html);
    }

    public function testARowThatCannotBePickedHasNoCheck(): void
    {
        $records = json_decode(file_get_contents(__DIR__ . '/../../../../../../ui/src/stories/fixtures/order-grid.json'), true)['records'];
        $records[1]['disableBulkCheckbox'] = true;

        $html = $this->render(['records' => $records]);

        $this->assertStringContainsString('id="order_grid_select_1024"', $html);
        $this->assertStringNotContainsString('id="order_grid_select_1023"', $html);
    }

    public function testTheBulkMenuIsOffUntilARowIsChecked(): void
    {
        $html = $this->render();

        $this->assertMatchesRegularExpression('#<div class="dropdown" data-ps-ref="grid-bulk-actions"><button class="btn btn-outline-secondary ps-button" type="button"[^>]* disabled data-bs-toggle="dropdown"#', $html);
        $this->assertStringContainsString('<p class="ps-grid__selection" role="status" data-ps-ref="grid-selection-count" data-ps-data-none="No rows selected" data-ps-data-some="%count% selected">No rows selected</p>', $html);
        $this->assertStringContainsString('<button type="submit" class="dropdown-item ps-dropdown-menu__item" form="order_filter_form" formaction="/sell/orders/" formmethod="post" data-ps-confirm="Delete the selected orders? This cannot be undone." data-ps-data-confirm-title="Delete orders?" data-ps-data-confirm-label="Delete" data-ps-data-confirm-variant="danger">', $html);
        $this->assertStringContainsString('data-ps-action="grid-bulk-button" data-ps-data-action-id="open_tabs"', $html);
        $this->assertStringContainsString('data-ps-action="grid-bulk-modal" data-bs-toggle="modal" data-bs-target="#changeOrdersStatusModal"', $html);
    }

    public function testNoBulkMenuWithoutRows(): void
    {
        $html = $this->render(['filter_data' => ['reference' => 'ZZZ'], 'records' => [], 'records_total' => 0, 'pagination' => ['offset' => 0, 'limit' => 50]]);

        $this->assertStringNotContainsString('grid-bulk-actions', $html);
        $this->assertStringNotContainsString('grid-select-all', $html);
    }

    /**
     * The fixture's columns, changed
     */
    private function columns(callable $change, string $name = 'order-grid'): array
    {
        $fixture = json_decode(file_get_contents(__DIR__ . '/../../../../../../ui/src/stories/fixtures/' . $name . '.json'), true, 512, JSON_THROW_ON_ERROR);

        return array_map($change, $fixture['columns']);
    }

    private function render(array $override = [], string $props = '', bool $boot = true, string $fixture = 'order-grid'): string
    {
        if ($boot) {
            self::bootKernel();
        }
        $container = static::getContainer();
        $request = new Request();
        $request->setSession(new Session(new MockArraySessionStorage()));
        $container->get('request_stack')->push($request);
        $grid = GridFixture::present($container->get('form.factory'), $fixture, $override);

        return trim($container->get('twig')->createTemplate('<twig:ui:Grid :grid="orderGrid"' . $props . '/>')->render(['orderGrid' => $grid]));
    }
}
