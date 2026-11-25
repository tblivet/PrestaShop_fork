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

        $this->assertStringStartsWith('<section id="order_grid_panel" class="ps-grid ps-grid--embedded" data-ps-ref="grid" data-ps-data-grid-id="order" aria-labelledby="order_grid_caption">', $html);
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
        $this->assertMatchesRegularExpression('#<input type="text" id="order_reference" name="order\[reference\]" class="form-control"\s*/?>#', $html);
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

        $this->assertMatchesRegularExpression('#<tr class="ps-grid__no-match">\s*<td colspan="7">#', $html);
        $this->assertStringNotContainsString('ps-grid__sort', $html);
        $this->assertStringContainsString('data-ps-action="grid-reset-filters" data-ps-data-url="/common/reset_search/order" data-ps-data-redirect="/sell/orders" data-ps-data-fragment="order_grid_results"', $html);
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

    private function render(array $override = [], string $props = ''): string
    {
        self::bootKernel();
        $container = static::getContainer();
        $request = new Request();
        $request->setSession(new Session(new MockArraySessionStorage()));
        $container->get('request_stack')->push($request);
        $grid = GridFixture::present($container->get('form.factory'), 'order-grid', $override);

        return trim($container->get('twig')->createTemplate('<twig:ui:Grid :grid="orderGrid"' . $props . '/>')->render(['orderGrid' => $grid]));
    }
}
