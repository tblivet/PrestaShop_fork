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

        $this->assertStringContainsString('<th scope="row" id="order_grid_rowhead_1" class="ps-grid__cell ps-grid__cell--identifier">1024</th>', $html);
        $this->assertSame(3, substr_count($html, 'scope="row"'));
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
        $html = $this->render();

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
        $html = $this->render(['view_options' => ['display_name' => false]]);

        $this->assertStringContainsString('<h2 id="order_grid_title" class="visually-hidden">Orders</h2>', $html);
        $this->assertStringNotContainsString('ps-grid__header', $html);
    }

    private function render(array $override = [], string $props = '', bool $boot = true): string
    {
        if ($boot) {
            self::bootKernel();
        }
        $container = static::getContainer();
        $request = new Request();
        $request->setSession(new Session(new MockArraySessionStorage()));
        $container->get('request_stack')->push($request);
        $grid = GridFixture::present($container->get('form.factory'), 'order-grid', $override);

        return trim($container->get('twig')->createTemplate('<twig:ui:Grid :grid="orderGrid"' . $props . '/>')->render(['orderGrid' => $grid]));
    }
}
