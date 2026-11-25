<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Grid;
use Symfony\Component\Form\FormView;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\UX\Icons\Exception\IconNotFoundException;
use Symfony\UX\Icons\Icon;
use Symfony\UX\Icons\IconRegistryInterface;

class GridTest extends TestCase
{
    public function testDefaultsAndTheHeadingLevelAsTwigWritesIt(): void
    {
        $props = $this->component()->preMount(['grid' => $this->presented()]);

        $this->assertFalse($props['embedded']);
        $this->assertSame(2, $props['headingLevel']);
        $this->assertSame(3, $this->component()->preMount(['grid' => $this->presented(), 'headingLevel' => '3'])['headingLevel']);
    }

    public function testRequiresAGrid(): void
    {
        $this->expectException(MissingOptionsException::class);

        $this->component()->preMount([]);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(InvalidOptionsException::class);

        $this->component()->preMount($data + ['grid' => $this->presented()]);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'not a presented grid' => [['grid' => ['id' => 'order']]];
        yield 'a filter form that is not a view' => [['grid' => ['filter_form' => []] + self::presentedArray()]];
        yield 'non boolean embedded' => [['embedded' => 'yes']];
        yield 'heading level 1' => [['headingLevel' => 1]];
    }

    public function testTheState(): void
    {
        $this->assertSame('list', $this->grid()->getState());
        $this->assertSame('no-match', $this->grid(['data' => ['records' => [], 'records_total' => 0, 'query' => '']])->getState());
        $this->assertSame('empty', $this->grid(['data' => ['records' => [], 'records_total' => 0, 'query' => ''], 'attributes' => ['is_empty_state' => true]])->getState());
    }

    public function testTheRowHeaderIsTheIdentifierElseTheFirstDataOrLinkColumn(): void
    {
        $this->assertSame('id_order', $this->grid()->getRowHeaderColumnId());
        $this->assertSame('reference', $this->grid(['columns' => [
            ['id' => 'actions', 'type' => 'action', 'options' => []],
            ['id' => 'reference', 'type' => 'data', 'options' => []],
        ]])->getRowHeaderColumnId());
    }

    public function testSortsByAColumnOrTheOtherWayWhenItIsAlready(): void
    {
        $grid = $this->grid(['sorting' => ['order_by' => 'date_add', 'order_way' => 'asc']]);

        $this->assertSame('ascending', $grid->sortState('date_add'));
        $this->assertNull($grid->sortState('reference'));
        $this->assertSame('/orders?order[orderBy]=date_add&order[sortOrder]=desc#order_grid_results', urldecode($grid->sortHref('date_add')));
        $this->assertSame('/orders?order[orderBy]=reference&order[sortOrder]=asc#order_grid_results', urldecode($grid->sortHref('reference')));
        $this->assertSame('descending', $this->grid(['sorting' => ['order_by' => 'date_add', 'order_way' => 'DESC']])->sortState('date_add'));
    }

    public function testLinksKeepTheQueryAndGoWithoutAPrefix(): void
    {
        $grid = $this->grid(['form_prefix' => ''], ['page' => 'x', 'order' => ['offset' => '50']]);

        $this->assertSame('/orders?page=x&order[offset]=50&orderBy=date_add&sortOrder=asc#order_grid_results', urldecode($grid->sortHref('date_add')));
    }

    public function testPagesAroundTheCurrentOne(): void
    {
        $grid = $this->grid(['pagination' => ['offset' => 500, 'limit' => 50], 'data' => ['records' => [], 'records_total' => 1234, 'query' => '']]);

        $this->assertSame(11, $grid->getCurrentPage());
        $this->assertSame(25, $grid->getPageCount());
        $this->assertSame([1, 10, 11, 12, 25], array_keys($grid->getPageLinks()));
        $this->assertSame('/orders?order[offset]=450&order[limit]=50#order_grid_results', urldecode($grid->getPageLinks()[10]));
        $this->assertSame('/orders?order[offset]={offset}&order[limit]=50#order_grid_results', urldecode($grid->getJumpUrl()));
        $this->assertSame([501, 550], $grid->getRange());
    }

    public function testTheLastPageAndASinglePage(): void
    {
        $last = $this->grid(['pagination' => ['offset' => 1200, 'limit' => 50], 'data' => ['records' => [], 'records_total' => 1234, 'query' => '']]);

        $this->assertSame([1, 24, 25], array_keys($last->getPageLinks()));
        $this->assertSame([1201, 1234], $last->getRange());
        $this->assertSame([1], array_keys($this->grid()->getPageLinks()));
    }

    public function testRowsPerPageAreTheOldGridsChoicesTheCurrentOneActive(): void
    {
        $items = $this->grid(['pagination' => ['offset' => 100, 'limit' => 20]])->getLimitItems();

        $this->assertSame(['10', '20', '50', '100', '300', '1000'], array_column($items, 'label'));
        $this->assertSame([false, true, false, false, false, false], array_column($items, 'active'));
        $this->assertSame('/orders?order[offset]=0&order[limit]=50#order_grid_results', urldecode($items[2]['href']));
        $this->assertSame(['10', '20', '25', '50', '100', '300', '1000'], array_column($this->grid(['pagination' => ['offset' => 0, 'limit' => 25]])->getLimitItems(), 'label'));
    }

    public function testTheLimitsAreTheOnesOfTheOldGrids(): void
    {
        $this->assertSame([10, 20, 50, 100, 300, 1000], Grid::LIMITS);
    }

    public function testFiltersOfAColumnAndSearchAndReset(): void
    {
        $form = new FormView();
        $form->children['reference'] = new FormView($form);
        $form->children['actions'] = new FormView($form);
        $form->children['actions']->vars['block_prefixes'] = ['form', 'search_and_reset', '_order_actions'];
        $grid = $this->grid(['filter_form' => $form, 'column_filters' => ['reference' => ['reference'], 'actions' => ['actions']]]);

        $this->assertSame([$form->children['reference']], $grid->filtersFor('reference'));
        $this->assertSame([], $grid->filtersFor('date_add'));
        $this->assertSame($form->children['actions'], $grid->getSearchAndReset());
        $this->assertTrue($grid->hasFilters());
        $this->assertNull($this->grid()->getSearchAndReset());
        $this->assertFalse($this->grid()->hasFilters());
    }

    public function testIconsOfTheOldGrids(): void
    {
        $grid = $this->grid();

        $this->assertSame('visibility', $grid->icon('remove_red_eye'));
        $this->assertSame('add_circle', $grid->icon('add_circle_outline'));
        $this->assertSame('edit', $grid->icon('edit'));
        $this->assertNull($grid->icon('unknown_icon'));
        $this->assertNull($grid->icon(null));
        $this->assertNull($grid->icon('<script>'));
    }

    #[DataProvider('provideColors')]
    public function testTheTextThatReadsBestOnARecordsColour(string $color, string $ink): void
    {
        $this->assertSame($ink, $this->grid()->inkOn($color));
    }

    public static function provideColors(): iterable
    {
        yield 'a light blue' => ['#3498D8', 'dark'];
        yield 'a dark purple' => ['#34209E', 'light'];
        yield 'a green' => ['#01B887', 'dark'];
        yield 'a red' => ['#E74C3C', 'dark'];
        yield 'black, short' => ['#000', 'light'];
        yield 'white' => ['#ffffff', 'dark'];
        yield 'not a colour' => ['transparent', 'dark'];
    }

    public function testHookParameters(): void
    {
        $params = $this->grid()->getHookParams();

        $this->assertSame('AdminOrders', $params['legacy_controller']);
        $this->assertSame('order', $params['grid']['id']);
    }

    private function grid(array $override = [], array $query = []): Grid
    {
        $grid = $this->component($query);
        $grid->grid = $override + self::presentedArray();

        return $grid;
    }

    private function presented(): array
    {
        return self::presentedArray();
    }

    private static function presentedArray(): array
    {
        return [
            'id' => 'order',
            'name' => 'Orders',
            'form_prefix' => 'order',
            'filter_form' => new FormView(),
            'columns' => [
                ['id' => 'id_order', 'type' => 'identifier', 'options' => ['sortable' => true]],
                ['id' => 'reference', 'type' => 'data', 'options' => ['sortable' => true]],
                ['id' => 'date_add', 'type' => 'date_time', 'options' => ['sortable' => true]],
            ],
            'column_filters' => [],
            'actions' => ['grid' => [], 'bulk' => []],
            'data' => ['records' => [], 'records_total' => 3, 'query' => ''],
            'pagination' => ['offset' => 0, 'limit' => 50],
            'sorting' => ['order_by' => 'date_add', 'order_way' => 'desc'],
            'filters' => [],
            'attributes' => ['is_empty_state' => false],
            'view_options' => [],
        ];
    }

    private function component(array $query = []): Grid
    {
        $request = new Request($query, [], ['_route' => 'admin_orders_index', '_route_params' => [], '_legacy_controller' => 'AdminOrders']);
        $requestStack = new RequestStack();
        $requestStack->push($request);

        $router = $this->createMock(UrlGeneratorInterface::class);
        $router->method('generate')->willReturnCallback(function (string $route, array $parameters): string {
            $fragment = $parameters['_fragment'] ?? null;
            unset($parameters['_fragment']);

            return '/orders?' . http_build_query($parameters) . (null !== $fragment ? '#' . $fragment : '');
        });

        $icons = $this->createMock(IconRegistryInterface::class);
        $icons->method('get')->willReturnCallback(function (string $name): Icon {
            if (!in_array($name, ['material-symbols:visibility', 'material-symbols:add-circle', 'material-symbols:edit'], true)) {
                throw new IconNotFoundException($name);
            }

            return new Icon('<path/>');
        });

        return new Grid($requestStack, $router, $icons);
    }
}
