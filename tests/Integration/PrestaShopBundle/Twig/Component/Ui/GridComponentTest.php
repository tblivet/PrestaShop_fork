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

        $this->assertStringStartsWith('<section id="order_grid_panel" class="ps-grid card" data-ps-ref="grid" data-ps-data-grid-id="order" aria-labelledby="order_grid_results">', $html);
        $this->assertStringContainsString('<h2 id="order_grid_results" class="ps-grid__title" tabindex="-1" data-ps-ref="grid-results">Orders', $html);
        foreach (['order_grid', 'order_grid_table', 'order_filter_form', 'order_grid_results', 'order_grid_caption'] as $id) {
            $this->assertStringContainsString('id="' . $id . '"', $html);
        }
    }

    public function testAnEmbeddedGridIsNamedByItsCaption(): void
    {
        $html = $this->render([], ' embedded :headingLevel="3"');

        $this->assertStringStartsWith('<section id="order_grid_panel" class="ps-grid ps-grid--embedded" data-ps-ref="grid" data-ps-data-grid-id="order" aria-labelledby="order_grid_results"><h3 id="order_grid_results" class="visually-hidden" tabindex="-1" data-ps-ref="grid-results">Orders</h3>', $html);
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
        $this->assertMatchesRegularExpression('#<input type="text" id="order_reference" name="order\[reference\]" class="form-control-sm form-control" size="1"\s*/?>#', $html);
        $this->assertStringContainsString('<fieldset class="ps-filter-range" id="order_date_add"><legend class="visually-hidden">Date</legend>', $html);
        $this->assertStringNotContainsString(' input"', $html);
        $this->assertStringContainsString('action="/sell/orders/filter#order_grid_results"', $html);
    }

    public function testEachRowHasItsHeader(): void
    {
        $html = $this->render();

        $this->assertStringContainsString('<th scope="row" class="ps-grid__cell ps-grid__cell--identifier"><span id="order_grid_rowhead_1">1024</span>', $html);
        $this->assertSame(3, substr_count($html, 'id="order_grid_rowhead_'));
        $this->assertStringContainsString('<th scope="row" class="ps-grid__filter-label">', $html);

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

        $this->assertStringContainsString('<button class="btn btn-outline-secondary btn-sm ps-button ps-grid__choice ps-grid__choice--ink-dark" type="button" data-ps-data-busy-label="Loading..." style="--ps-grid-choice-color: #3498D8" data-bs-toggle="dropdown" aria-expanded="false" data-bs-popper-config="{&quot;strategy&quot;:&quot;fixed&quot;}" aria-describedby="order_grid_rowhead_1"><span class="ps-button__label"><span class="visually-hidden">Status: </span>Payment accepted</span>', $html);
        $this->assertStringContainsString('<button type="submit" class="dropdown-item ps-dropdown-menu__item" aria-current="true" form="order_grid_action_form" formaction="/sell/orders/list/1024/status" name="value" value="2">', $html);
        $this->assertStringContainsString('<button type="submit" class="dropdown-item ps-dropdown-menu__item" form="order_grid_action_form" formaction="/sell/orders/list/1024/status" name="value" value="5">', $html);
        $this->assertStringContainsString('ps-grid__choice--ink-light" type="button" data-ps-data-busy-label="Loading..." style="--ps-grid-choice-color: #34209E"', $html);
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

    public function testAFilterFieldHasNoPlaceholderAndClaimsNoWidth(): void
    {
        $fixture = json_decode(file_get_contents(__DIR__ . '/../../../../../../ui/src/stories/fixtures/order-grid.json'), true, 512, JSON_THROW_ON_ERROR);
        $fixture['filters'][1]['options'] = ['attr' => ['placeholder' => 'Search reference']];
        $html = $this->render(['filters' => $fixture['filters']]);

        $this->assertStringNotContainsString('placeholder="Search reference"', $html);
        $this->assertStringContainsString('<label class="visually-hidden form-label" for="order_reference">Reference</label>', $html);
        $this->assertMatchesRegularExpression('#<input type="text" id="order_reference" name="order\[reference\]" class="form-control-sm form-control" size="1"#', $html);
    }

    public function testAColumnsWidthHintIsAClassOnItsHeading(): void
    {
        $html = $this->render();

        $this->assertMatchesRegularExpression('#<th scope="col" id="order_col_id_order" class="ps-grid__heading ps-grid__heading--width-narrow"#', $html);
        $this->assertMatchesRegularExpression('#<th scope="col" id="order_col_reference" class="ps-grid__heading"#', $html);
        $this->assertSame(1, substr_count($html, '<td class="ps-grid__filter ps-grid__filter--width-narrow">'));
    }

    public function testAColumnsAlignmentIsAClassOnItsHeadingAndCells(): void
    {
        $html = $this->render();

        $this->assertMatchesRegularExpression('#<th scope="col" id="order_col_actions" class="ps-grid__heading ps-grid__heading--end"#', $html);
        $this->assertSame(3, substr_count($html, 'class="ps-grid__cell ps-grid__cell--action ps-grid__cell--end"'));
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
        $this->assertStringContainsString('0<span class="visually-hidden"> results</span>', $html);
        $this->assertStringNotContainsString('ps-grid__sort', $html);
        $this->assertStringContainsString('data-ps-action="grid-reset-filters" data-ps-data-url="/common/reset_search/order" data-ps-data-redirect="/sell/orders" data-ps-data-fragment="order_grid_results" data-ps-data-error="The filters could not be cleared. Try again."', $html);
        // Its cross, like Clear selection's
        $this->assertMatchesRegularExpression('#data-ps-action="grid-reset-filters"[^>]*><svg[^>]*>.*?</svg><span class="ps-button__label">Clear filters</span>#s', $html);
        $this->assertStringNotContainsString('ps-grid__footer', $html);
    }

    public function testNothingYetShowsTheEmptyStateOnly(): void
    {
        $html = $this->render(['records' => [], 'records_total' => 0, 'pagination' => ['offset' => 0, 'limit' => 50], 'is_empty_state' => true]);

        $this->assertStringContainsString('class="ps-empty-state"', $html);
        $this->assertStringNotContainsString('<table', $html);
        $this->assertStringContainsString('ps-grid__header', $html);
    }

    public function testPastTheLastPageItOffersTheLastPage(): void
    {
        $html = $this->render(['records' => [], 'records_total' => 241, 'pagination' => ['offset' => 1000, 'limit' => 50]]);

        $this->assertStringContainsString('This page is empty', $html);
        $this->assertStringContainsString('href="?order%5Boffset%5D=200&amp;order%5Blimit%5D=50#order_grid_results"', $html);
        $this->assertStringNotContainsString('ps-grid__pager', $html);
        $this->assertStringNotContainsString('This page is empty', $this->render(boot: false));
    }

    public function testCountriesHaveTheirOwnEmptyState(): void
    {
        $html = $this->render(['id' => 'country', 'is_empty_state' => true, 'records' => [], 'records_total' => 0, 'pagination' => ['offset' => 0, 'limit' => 50]]);

        $this->assertStringContainsString('No countries yet', $html);
        $this->assertMatchesRegularExpression('#<a class="btn btn-primary ps-button" href="[^"]*/improve/international/countries/new[^"]*"#', $html);
    }

    public function testAPagesEmptyBlockReplacesTheGridsOwnAndTheDefault(): void
    {
        $nothingYet = ['is_empty_state' => true, 'records' => [], 'records_total' => 0, 'pagination' => ['offset' => 0, 'limit' => 50]];
        $block = '<twig:block name="empty"><p class="custom-empty">Import your first orders</p></twig:block>';

        $html = $this->render($nothingYet, content: $block);
        $this->assertStringContainsString('<p class="custom-empty">Import your first orders</p>', $html);
        $this->assertStringNotContainsString('No records found', $html);
        $this->assertStringNotContainsString('<table', $html);

        $html = $this->render(['id' => 'country'] + $nothingYet, boot: false, content: $block);
        $this->assertStringContainsString('<p class="custom-empty">Import your first orders</p>', $html);
        $this->assertStringNotContainsString('No countries yet', $html);
        $this->assertStringNotContainsString('No records found', $html);
    }

    public function testAClickableCellCarriesItsHook(): void
    {
        $this->assertMatchesRegularExpression('#class="ps-grid__cell ps-grid__cell--[a-z-]+ ps-grid__cell--clickable" data-ps-ref="grid-clickable-cell"#', $this->render());
    }

    public function testThePagesRowsShownAndRowsPerPageUnderTheTable(): void
    {
        $html = $this->render();

        $this->assertMatchesRegularExpression('#<div class="ps-grid__pager">\s*<div class="ps-grid__pager-bar">\s*<p id="order_grid_range" class="ps-grid__range">\s*51–100 of 1234 results\s*</p>\s*<nav class="ps-pagination ps-grid__pagination" aria-label="Pages of Orders" aria-describedby="order_grid_range">#', $html);
        $this->assertStringContainsString('data-ps-data-url="?order%5Boffset%5D={offset}&amp;order%5Blimit%5D=50#order_grid_results"', $html);
        $this->assertMatchesRegularExpression('#<div class="(dropup ps-grid__per-page|ps-grid__per-page dropup)">\s*<button[^>]*>\s*<span class="ps-button__label">50 per page</span>#', $html);
        $this->assertStringNotContainsString('ps-grid__footer', $html);

        // Two pages: still the field to go to a page, as on every grid
        $twoPages = $this->render(['records_total' => 70, 'records' => [], 'pagination' => ['offset' => 0, 'limit' => 50]], boot: false);
        $this->assertStringContainsString('class="ps-pagination__jump"', $twoPages);

        $onePage = $this->render(['records_total' => 30, 'records' => [], 'pagination' => ['offset' => 0, 'limit' => 50]], boot: false);
        $this->assertMatchesRegularExpression('#<p id="order_grid_range" class="ps-grid__range">\s*30 results\s*</p>#', $onePage);
        $this->assertStringNotContainsString('<nav class="ps-pagination', $onePage);

        $this->assertStringNotContainsString('ps-grid__pager', $this->render(['records_total' => 3, 'pagination' => ['offset' => 0, 'limit' => 50]], boot: false));
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
        $this->assertStringContainsString('<span class="ps-grid__color"><span class="ps-grid__swatch" style="--ps-grid-swatch-color: #E74C3C"></span>Red</span>', $html);
        $this->assertStringContainsString('Deleted customer', $html);
        $this->assertStringContainsString('<img class="ps-grid__image" src="/img/red.png" alt="Red">', $html);
        $this->assertMatchesRegularExpression('#<a class="btn btn-link btn-sm ps-button ps-icon-button" href="[^"]*/sell/orders/7/view[^"]*"[^>]*aria-label="View"#', $html);
        $this->assertMatchesRegularExpression('#<span class="badge ps-badge ps-badge--danger ps-badge--pill">\s*Error \(3\)\s*</span>#', $html);
        $this->assertStringContainsString('<span class="badge ps-badge ps-badge--success">Paid</span>', $html);
        $this->assertMatchesRegularExpression('#ps-grid__cell--empty">\s*n/a\s*</td>#', $html);
    }

    public function testAnAliasDisabledIsStruckThroughAndSaidSo(): void
    {
        $columns = [
            ['id' => 'id', 'name' => 'ID', 'type' => 'identifier', 'options' => ['identifier_field' => 'id']],
            ['id' => 'aliases', 'name' => 'Aliases', 'type' => 'aliases', 'options' => []],
        ];
        $records = [['id' => 1, 'aliases' => [['alias' => 'bloose', 'active' => true], ['alias' => 'blues', 'active' => false]]]];
        $html = $this->render(['columns' => $columns, 'filters' => [], 'records' => $records, 'records_total' => 1, 'pagination' => ['offset' => 0, 'limit' => 50]]);

        $this->assertMatchesRegularExpression('#bloose, <del>blues<span class="visually-hidden"> \(Disabled\)</span></del>#', $html);
        $this->assertSame(1, substr_count($html, '<del>'));
    }

    public function testACurrencyNameSaysWhetherItIsUnofficialOrEdited(): void
    {
        $columns = [
            ['id' => 'id', 'name' => 'ID', 'type' => 'identifier', 'options' => ['identifier_field' => 'id']],
            ['id' => 'name', 'name' => 'Currency', 'type' => 'currency_name', 'options' => ['field' => 'name']],
        ];
        $records = [
            ['id' => 1, 'name' => 'Euro', 'unofficial' => false, 'modified' => false],
            ['id' => 2, 'name' => 'Bitcoin', 'unofficial' => true, 'modified' => false],
            ['id' => 3, 'name' => 'Dollar', 'unofficial' => false, 'modified' => true],
        ];
        $html = $this->render(['columns' => $columns, 'filters' => [], 'records' => $records, 'records_total' => 3, 'pagination' => ['offset' => 0, 'limit' => 50]]);

        $this->assertMatchesRegularExpression('#>\s*Euro\s*</td>#', $html);
        $this->assertMatchesRegularExpression('#Bitcoin <svg[^>]*class="[^"]*ps-grid__mark[^"]*"[^>]*>.*?</svg>#s', $html);
        $this->assertMatchesRegularExpression('#Bitcoin <svg[^>]*(aria-label="Unofficial"|role="img")[^>]*>#', $html);
        $this->assertStringContainsString('Unofficial', $html);
        $this->assertStringContainsString('Dollar <span class="ps-grid__note">(Edited)</span>', $html);
        $this->assertSame(1, substr_count($html, 'ps-grid__note'));
        $this->assertSame(1, substr_count($html, 'ps-grid__mark'));
    }

    public function testADiscountUsageOfNoLimitSaysUnlimited(): void
    {
        $columns = [
            ['id' => 'id', 'name' => 'ID', 'type' => 'identifier', 'options' => ['identifier_field' => 'id']],
            ['id' => 'usage', 'name' => 'Usage', 'type' => 'discount_usage', 'options' => ['quantity_used_field' => 'used', 'total_quantity_field' => 'total']],
        ];
        $records = [
            ['id' => 1, 'used' => 3, 'total' => null],
            ['id' => 2, 'used' => 5, 'total' => 10],
        ];
        $html = $this->render(['columns' => $columns, 'filters' => [], 'records' => $records, 'records_total' => 2, 'pagination' => ['offset' => 0, 'limit' => 50]]);

        $this->assertStringContainsString('3 / <span aria-hidden="true">&#8734;</span><span class="visually-hidden">Unlimited</span>', $html);
        $this->assertMatchesRegularExpression('#>\s*5 / 10\s*</td>#', $html);
        $this->assertSame(1, substr_count($html, 'Unlimited'));
    }

    public function testAnEmployeesAvatarSaysNothingTheNameDoesNot(): void
    {
        $columns = [
            ['id' => 'id', 'name' => 'ID', 'type' => 'identifier', 'options' => ['identifier_field' => 'id']],
            ['id' => 'employee', 'name' => 'Employee', 'type' => 'employee_name_with_avatar', 'options' => ['field' => 'employee']],
        ];
        $records = [
            ['id' => 1, 'employee' => 'J. Doe', 'image' => '/img/pr/default.jpg'],
            ['id' => 2, 'employee' => null, 'image' => null],
        ];
        $html = $this->render(['columns' => $columns, 'filters' => [], 'records' => $records, 'records_total' => 2, 'pagination' => ['offset' => 0, 'limit' => 50]]);

        $this->assertMatchesRegularExpression('#<span class="ps-grid__person"><img class="ps-grid__avatar" src="/img/pr/default\.jpg[^"]*" alt="" width="32" height="32" loading="lazy">J\. Doe</span>#', $html);
        $this->assertSame(1, substr_count($html, 'ps-grid__avatar'));
        $this->assertMatchesRegularExpression('#>\s*N/A\s*</td>#', $html);
    }

    public function testARecordsColourBadgeReadsDarkOrLightText(): void
    {
        $html = $this->render(['columns' => $this->columns(fn (array $column): array => 'osname' === $column['id'] ? ['type' => 'badge', 'options' => ['field' => 'osname', 'color_field' => 'color']] + $column : $column)]);

        $this->assertStringContainsString('<span class="badge ps-badge ps-badge--light ps-grid__badge ps-grid__badge--ink-dark" style="--ps-grid-badge-color: #3498D8">Payment accepted</span>', $html);
        $this->assertStringContainsString('ps-grid__badge--ink-light" style="--ps-grid-badge-color: #34209E"', $html);
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
        $this->assertStringContainsString('<h3 id="order_grid_results" class="ps-grid__title" tabindex="-1" data-ps-ref="grid-results">Orders', $this->render([], ' :headingLevel="3"'));
        $this->assertStringContainsString('<h4 class="ps-empty-state__title">No records found</h4>', $this->render(['records' => [], 'records_total' => 0, 'pagination' => ['offset' => 0, 'limit' => 50], 'is_empty_state' => true], ' :headingLevel="3"'));
    }

    public function testATitleNotShownIsForScreenReadersWithoutAHeaderBand(): void
    {
        $html = $this->render(['view_options' => ['display_name' => false], 'grid_actions' => []]);

        $this->assertStringContainsString('<h2 id="order_grid_results" class="visually-hidden" tabindex="-1" data-ps-ref="grid-results">Orders</h2>', $html);
        $this->assertStringNotContainsString('ps-grid__header', $html);
    }

    public function testATitleNotShownKeepsTheBandForTheListActions(): void
    {
        $html = $this->render(['view_options' => ['display_name' => false]]);

        $this->assertMatchesRegularExpression('#<header class="ps-grid__header card-header ps-grid__header--actions-only">\s*<h2 id="order_grid_results" class="ps-grid__title visually-hidden" tabindex="-1" data-ps-ref="grid-results">Orders #', $html);
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

    public function testFilterEndsTheFilterRowInTheActionsColumn(): void
    {
        $html = $this->render();

        $this->assertMatchesRegularExpression('#<td class="ps-grid__filter"><div class="ps-grid__filter-actions">\s*<button class="btn btn-outline-primary btn-sm ps-button" type="submit"[^>]* form="order_filter_form" data-ps-action="grid-apply-filters">.*?Filter</span>\s*</button>\s*</div></td>\s*</tr>#s', $html);
        $this->assertSame(1, substr_count($html, 'data-ps-action="grid-apply-filters"'));
        $this->assertStringContainsString('<tr class="ps-grid__filters" data-ps-ref="grid-filter-row">', $html);
    }

    public function testNoResultsLineOverTheTable(): void
    {
        $html = $this->render();

        $this->assertStringNotContainsString('ps-grid__results', $html);
        $this->assertStringNotContainsString('ps-grid__summary', $html);
    }

    public function testFiltersAppliedTheFilterRowsIconClearsThem(): void
    {
        $this->assertMatchesRegularExpression('#<th scope="row" class="ps-grid__filter-label">\s*<svg[^>]*>.*?</svg>\s*<span class="visually-hidden">Filters</span>#s', $this->render());

        $html = $this->render(['filter_data' => ['reference' => 'XKB']], boot: false);
        $this->assertMatchesRegularExpression('#<th scope="row" class="ps-grid__filter-label">\s*<button class="btn btn-outline-primary btn-sm ps-button ps-icon-button" type="button"[^>]* aria-label="Clear filters" data-bs-toggle="tooltip" data-bs-title="Clear filters" data-ps-action="grid-reset-filters"#', $html);
        $this->assertSame(1, substr_count($html, 'data-ps-action="grid-reset-filters"'));
    }

    public function testARowShowsItsActionsInOneMenu(): void
    {
        $html = $this->render();

        $this->assertMatchesRegularExpression('#<div class="dropdown ps-grid__actions">\s*<button class="btn btn-outline-secondary btn-sm ps-button ps-icon-button" type="button"#', $html);
        $this->assertStringContainsString('aria-label="Actions" data-bs-toggle="dropdown" aria-expanded="false" aria-describedby="order_grid_rowhead_1"', $html);
        $this->assertStringContainsString('<a class="dropdown-item ps-dropdown-menu__item" href="/sell/orders/1024/view"', $html);
        $this->assertStringContainsString('<li><hr class="dropdown-divider"></li><li><button type="submit" class="dropdown-item ps-dropdown-menu__item" form="order_grid_action_form"', $html);
        $this->assertStringNotContainsString('More actions', $html);
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

    public function testTheBulkBarWaitsOverTheHeadingsUntilARowIsChecked(): void
    {
        $html = $this->render();

        $this->assertMatchesRegularExpression('#<div class="ps-grid__table-area"><div class="ps-grid__bulk" role="group" aria-label="Bulk actions" data-ps-ref="grid-bulk" hidden>#', $html);
        $this->assertStringContainsString('id="order_grid_bulk_select_all" data-ps-action="grid-select-all"', $html);
        $this->assertMatchesRegularExpression('#<div class="dropdown" data-ps-ref="grid-bulk-actions"><button class="btn btn-secondary btn-sm ps-button" type="button" data-ps-data-busy-label="Loading..." data-bs-toggle="dropdown"#', $html);
        $this->assertStringContainsString('<p class="ps-grid__selection" data-ps-ref="grid-selection-count" data-ps-data-none="No rows selected" data-ps-data-some="%count% selected">No rows selected</p>', $html);
        $this->assertMatchesRegularExpression('#class="btn btn-link btn-sm ps-button ps-grid__clear-selection" type="button"[^>]* data-ps-action="grid-clear-selection">.*?Clear selection#s', $html);
        $this->assertStringNotContainsString('ps-grid__toolbar', $html);
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

    private function render(array $override = [], string $props = '', bool $boot = true, string $fixture = 'order-grid', string $content = ''): string
    {
        if ($boot) {
            self::bootKernel();
        }
        $container = static::getContainer();
        $request = new Request();
        $request->setSession(new Session(new MockArraySessionStorage()));
        $container->get('request_stack')->push($request);
        $grid = GridFixture::present($container->get('form.factory'), $fixture, $override);

        $template = '' === $content ? '<twig:ui:Grid :grid="orderGrid"' . $props . '/>' : '<twig:ui:Grid :grid="orderGrid"' . $props . '>' . $content . '</twig:ui:Grid>';

        return trim($container->get('twig')->createTemplate($template)->render(['orderGrid' => $grid]));
    }
}
