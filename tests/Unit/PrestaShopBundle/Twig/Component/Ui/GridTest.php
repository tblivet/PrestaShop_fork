<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShop\PrestaShop\Core\Form\ConfigurableFormChoiceProviderInterface;
use PrestaShop\PrestaShop\Core\Grid\Action\ModalOptions;
use PrestaShop\PrestaShop\Core\Grid\Action\Row\AccessibilityChecker\AccessibilityCheckerInterface;
use PrestaShop\PrestaShop\Core\Grid\Action\Row\RowActionCollection;
use PrestaShop\PrestaShop\Core\Grid\Action\Row\Type\LinkRowAction;
use PrestaShop\PrestaShop\Core\Grid\Action\Row\Type\SubmitRowAction;
use PrestaShop\PrestaShop\Core\Grid\Column\Type\Common\PreviewColumn;
use PrestaShopBundle\Security\Admin\RouteAccessChecker;
use PrestaShopBundle\Twig\Component\Ui\Grid;
use Symfony\Component\Form\FormView;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\UX\Icons\Exception\IconNotFoundException;
use Symfony\UX\Icons\Icon;
use Symfony\UX\Icons\IconRegistryInterface;
use Tests\Unit\PrestaShopBundle\Security\Admin\RouteAccessCheckerTest;

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
        yield 'heading level 6: none left for the empty states' => [['headingLevel' => 6]];
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
        $this->assertSame([], $grid->filtersFor('actions'));
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

    public function testBulkActionsAsMenuItems(): void
    {
        $items = $this->grid(['actions' => ['grid' => [], 'bulk' => [
            ['id' => 'delete', 'name' => 'Delete selected', 'type' => 'submit', 'icon' => 'delete', 'options' => ['submit_route' => 'admin_orders_delete', 'route_params' => [], 'submit_method' => 'POST', 'confirm_message' => 'Delete?', 'modal_options' => null]],
            ['id' => 'open_tabs', 'name' => 'Open in new tabs', 'type' => 'button', 'icon' => null, 'options' => ['class' => 'open_tabs', 'attributes' => ['data-route' => 'admin_orders_view', 'data-ids' => ['x']]]],
            ['id' => 'status', 'name' => 'Change status', 'type' => 'modal_form_submit', 'icon' => null, 'options' => ['submit_route' => 'admin_orders_status', 'modal_id' => 'statusModal']],
            ['id' => 'ajax', 'name' => 'Enable', 'type' => 'ajax', 'icon' => null, 'options' => []],
        ]]])->getBulkItems();

        $this->assertCount(3, $items);
        $this->assertSame('submit', $items[0]['type']);
        $this->assertSame('Delete selected', $items[0]['label']);
        $this->assertSame('delete', $items[0]['icon'], 'a definition\'s icon (setIcon()) shows in the menu');
        $this->assertNull($items[1]['icon'], 'no icon is made up for an action that has none');
        $this->assertSame(['form' => 'order_filter_form', 'formaction' => '/orders?', 'formmethod' => 'post', 'data-ps-confirm' => 'Delete?'], $items[0]['attr']);
        $this->assertSame(['data-route' => 'admin_orders_view', 'class' => 'open_tabs', 'data-ps-action' => 'grid-bulk-button', 'data-ps-data-action-id' => 'open_tabs'], $items[1]['attr']);
        $this->assertSame('#statusModal', $items[2]['attr']['data-bs-target']);
    }

    public function testListActionsAsMenuItems(): void
    {
        $grid = $this->grid(['actions' => ['bulk' => [], 'grid' => [
            ['id' => 'export', 'name' => 'Export', 'type' => 'link', 'icon' => 'cloud_download', 'options' => ['route' => 'admin_orders_export', 'route_params' => ['a' => 1]]],
            ['id' => 'common_refresh_list', 'name' => 'Refresh list', 'type' => 'simple', 'icon' => 'refresh', 'options' => []],
            ['id' => 'common_show_query', 'name' => 'Show SQL query', 'type' => 'simple', 'icon' => 'code', 'options' => []],
            ['id' => 'common_export_sql_manager', 'name' => 'Export to SQL Manager', 'type' => 'simple', 'icon' => 'storage', 'options' => []],
            ['id' => 'import', 'name' => 'Import', 'type' => 'simple', 'icon' => null, 'options' => []],
            ['id' => 'erase', 'name' => 'Erase all', 'type' => 'submit', 'icon' => null, 'options' => ['submit_route' => 'admin_emails_delete_all', 'submit_method' => 'POST', 'confirm_message' => 'Erase all?']],
            ['id' => 'ajax', 'name' => 'Ajax', 'type' => 'ajax', 'icon' => null, 'options' => []],
        ]]]);
        $items = $grid->getGridItems();

        $this->assertCount(6, $items);
        $this->assertSame(['form' => 'order_grid_action_form', 'formaction' => '/orders?', 'formmethod' => 'post', 'name' => 'order[_token]', 'value' => 'token-of-erase', 'data-ps-confirm' => 'Erase all?'], $items[5]['attr']);
        $this->assertSame(['label' => 'Export', 'icon' => null, 'type' => 'link', 'href' => '/orders?a=1'], $items[0]);
        $this->assertSame('/orders?#order_grid_results', $items[1]['href']);
        $this->assertSame(['data-bs-toggle' => 'modal', 'data-bs-target' => '#order_grid_common_show_query_modal'], $items[2]['attr']);
        $this->assertSame(['form' => 'order_common_show_query_modal_form'], $items[3]['attr']);
        $this->assertSame(['class' => 'js-import-grid-action', 'data-ps-action' => 'grid-action', 'data-ps-data-action-id' => 'import'], $items[4]['attr']);
        $this->assertTrue($grid->hasQueryModal());
        $this->assertFalse($this->grid()->hasQueryModal());
    }

    public function testARowsActionsAreAllInItsMenuTheDangerousOnesLast(): void
    {
        $actions = (new RowActionCollection())
            ->add((new LinkRowAction('edit'))->setName('Edit')->setIcon('edit')->setOptions(['route' => 'admin_orders_edit', 'route_param_name' => 'orderId', 'route_param_field' => 'id_order']))
            ->add((new LinkRowAction('view'))->setName('View')->setIcon('remove_red_eye')->setOptions(['route' => 'admin_orders_view', 'route_param_name' => 'orderId', 'route_param_field' => 'id_order', 'use_inline_display' => true, 'target' => '_blank']))
            ->add((new LinkRowAction('print'))->setName('Print')->setIcon('print')->setOptions(['route' => 'admin_orders_print', 'route_param_name' => 'orderId', 'route_param_field' => 'id_order', 'extra_route_params' => ['ref' => 'reference']]))
            ->add((new SubmitRowAction('delete'))->setName('Delete')->setIcon('delete')->setOptions([
                'route' => 'admin_orders_delete', 'route_param_name' => 'orderId', 'route_param_field' => 'id_order', 'method' => 'DELETE',
                'confirm_message' => 'Delete?', 'modal_options' => new ModalOptions(['title' => 'Delete order?', 'confirm_button_class' => 'btn-danger']),
            ]));
        $row = $this->grid()->rowActions(['id_order' => 7, 'reference' => 'XKB'], ['options' => ['actions' => $actions]]);

        $this->assertSame(['type' => 'link', 'href' => '/orders?orderId=7', 'label' => 'Edit', 'icon' => 'edit', 'attr' => []], $row[0]);
        $this->assertSame(['type' => 'link', 'href' => '/orders?orderId=7', 'label' => 'View', 'icon' => 'visibility', 'attr' => ['target' => '_blank']], $row[1]);
        $this->assertSame(['type' => 'link', 'href' => '/orders?orderId=7&ref=XKB', 'label' => 'Print', 'icon' => null, 'attr' => []], $row[2]);
        $this->assertSame(['type' => 'divider'], $row[3]);
        $this->assertSame([
            'form' => 'order_grid_action_form', 'formaction' => '/orders?orderId=7', 'formmethod' => 'post', 'name' => '_method', 'value' => 'DELETE',
            'data-ps-confirm' => 'Delete?', 'data-ps-data-confirm-title' => 'Delete order?', 'data-ps-data-confirm-variant' => 'danger',
        ], $row[4]['attr']);
        $this->assertCount(5, $row);
    }

    public function testAnUnnamedActionGetsTheUsualNameOfItsId(): void
    {
        $actions = (new RowActionCollection())
            ->add((new LinkRowAction('edit'))->setIcon('edit')->setOptions(['route' => 'admin_currencies_edit', 'route_param_name' => 'currencyId', 'route_param_field' => 'id']))
            ->add((new LinkRowAction('show_rates'))->setOptions(['route' => 'a', 'route_param_name' => 'id', 'route_param_field' => 'id']));
        $row = $this->grid()->rowActions(['id' => 1], ['options' => ['actions' => $actions]]);

        $this->assertSame('Edit', $row[0]['label']);
        $this->assertSame('Show rates', $row[1]['label']);
    }

    public function testWhatTheEmployeeMayNotDoIsLeftOut(): void
    {
        $actions = (new RowActionCollection())
            ->add((new LinkRowAction('edit'))->setName('Edit')->setOptions(['route' => 'admin_orders_edit', 'route_param_name' => 'orderId', 'route_param_field' => 'id_order', 'clickable_row' => true]))
            ->add((new SubmitRowAction('delete'))->setName('Delete')->setOptions(['route' => 'admin_orders_delete', 'route_param_name' => 'orderId', 'route_param_field' => 'id_order', 'method' => 'DELETE']));
        $bulk = ['grid' => [], 'bulk' => [
            ['id' => 'delete', 'name' => 'Delete selected', 'type' => 'submit', 'icon' => null, 'options' => ['submit_route' => 'admin_orders_bulk_delete', 'route_params' => []]],
            ['id' => 'enable', 'name' => 'Enable selected', 'type' => 'submit', 'icon' => null, 'options' => ['submit_route' => 'admin_orders_bulk_enable', 'route_params' => []]],
        ]];
        $grid = $this->grid(['actions' => $bulk, 'columns' => [['id' => 'actions', 'type' => 'action', 'options' => ['actions' => $actions]]]], [], ['admin_orders_delete', 'admin_orders_bulk_delete', 'admin_orders_edit']);

        $this->assertSame([], $grid->rowActions(['id_order' => 7], ['options' => ['actions' => $actions]]));
        $this->assertNull($grid->rowLink(['id_order' => 7]), 'a row does not lead to a page the employee may not open');
        $this->assertSame(['Enable selected'], array_column($grid->getBulkItems(), 'label'));
        $this->assertFalse($grid->canToggle(['options' => ['route' => 'admin_orders_delete']]));
        $this->assertTrue($grid->canToggle(['options' => ['route' => 'admin_orders_toggle']]));
    }

    public function testNoCheckColumnWithoutABulkActionTheEmployeeMayUse(): void
    {
        $columns = [['id' => 'orders_bulk', 'type' => 'bulk_action', 'options' => []], ['id' => 'reference', 'type' => 'data', 'options' => []]];
        $bulk = ['grid' => [], 'bulk' => [['id' => 'delete', 'name' => 'Delete selected', 'type' => 'submit', 'icon' => null, 'options' => ['submit_route' => 'admin_orders_bulk_delete', 'route_params' => []]]]];

        $allowed = $this->grid(['actions' => $bulk, 'columns' => $columns]);
        $allowed->postMount();
        $this->assertSame(['orders_bulk', 'reference'], array_column($allowed->grid['columns'], 'id'));

        $denied = $this->grid(['actions' => $bulk, 'columns' => $columns], [], ['admin_orders_bulk_delete']);
        $denied->postMount();
        $this->assertSame(['reference'], array_column($denied->grid['columns'], 'id'));
    }

    public function testARowsActionThatDoesNotApplyIsLeftOut(): void
    {
        $checker = $this->createMock(AccessibilityCheckerInterface::class);
        $checker->method('isGranted')->willReturn(false);
        $actions = (new RowActionCollection())
            ->add((new SubmitRowAction('delete'))->setName('Delete')->setIcon('delete')->setOptions(['route' => 'admin_orders_delete', 'route_param_name' => 'orderId', 'route_param_field' => 'id_order', 'accessibility_checker' => $checker]));

        $this->assertSame([], $this->grid()->rowActions(['id_order' => 7], ['options' => ['actions' => $actions]]));
    }

    public function testAClickableRowFollowsItsFirstClickableLinkUnlessItAsksFirst(): void
    {
        $columns = fn (array $options): array => [['id' => 'actions', 'type' => 'action', 'options' => ['actions' => (new RowActionCollection())
            ->add((new LinkRowAction('edit'))->setName('Edit')->setIcon('edit')->setOptions(['route' => 'admin_orders_edit', 'route_param_name' => 'orderId', 'route_param_field' => 'id_order']))
            ->add((new LinkRowAction('view'))->setName('View')->setIcon('zoom_in')->setOptions(['route' => 'admin_orders_view', 'route_param_name' => 'orderId', 'route_param_field' => 'id_order', 'clickable_row' => true] + $options)),
        ]]];

        $this->assertSame('/orders?orderId=7', $this->grid(['columns' => $columns([])])->rowLink(['id_order' => 7]));
        $this->assertNull($this->grid(['columns' => $columns(['confirm_message' => 'Sure?'])])->rowLink(['id_order' => 7]));
        $this->assertNull($this->grid()->rowLink(['id_order' => 7]));
    }

    public function testAChoiceCellsMenuPostsEachValueTheCurrentOneActive(): void
    {
        $provider = $this->createMock(ConfigurableFormChoiceProviderInterface::class);
        $provider->method('getChoices')->willReturn(['Awaiting payment' => 1, 'Paid' => 2]);
        $column = ['id' => 'osname', 'name' => 'Status', 'type' => 'choice', 'options' => [
            'field' => 'current_state', 'route' => 'admin_orders_list_update_status', 'color_field' => 'color', 'choice_provider' => $provider, 'record_route_params' => ['id_order' => 'orderId'],
        ]];
        $choice = $this->grid()->choice(['id_order' => 7, 'current_state' => '2', 'color' => '#01B887'], $column);

        $this->assertSame('Paid', $choice['label']);
        $this->assertSame('#01B887', $choice['color']);
        $this->assertSame(['type' => 'submit', 'label' => 'Paid', 'active' => true, 'attr' => ['form' => 'order_grid_action_form', 'formaction' => '/orders?orderId=7', 'name' => 'value', 'value' => '2']], $choice['items'][1]);
        $this->assertFalse($choice['items'][0]['active']);

        $none = $this->createMock(ConfigurableFormChoiceProviderInterface::class);
        $none->method('getChoices')->willReturn([]);
        $this->assertNull($this->grid()->choice(['id_order' => 7, 'current_state' => 2], ['options' => ['choice_provider' => $none] + $column['options']] + $column));
    }

    public function testAPreviewComesFromItsColumnsRoute(): void
    {
        $preview = (new PreviewColumn('preview'))->setOptions(['icon_expand' => 'a', 'icon_collapse' => 'b', 'preview_data_route' => 'admin_orders_preview', 'preview_route_params' => ['orderId' => 'id_order']]);
        $columns = [['id' => 'id_order', 'type' => 'identifier', 'options' => ['identifier_field' => 'id_order', 'preview' => $preview]]];
        $grid = $this->grid(['columns' => $columns]);

        $this->assertSame('/orders?orderId=7', $grid->previewUrl(['id_order' => 7], $columns[0]));
        $this->assertSame('id_order', $grid->getPreviewColumnId());
        $this->assertNull($this->grid()->getPreviewColumnId());
        $this->assertNull($this->grid()->previewUrl(['id_order' => 7], ['options' => []]));
    }

    public function testAToggleAndAPositionPostToTheirRoutes(): void
    {
        $grid = $this->grid();

        $this->assertSame('/orders?carrierId=3&shop=1', $grid->toggleUrl(['id_carrier' => 3], ['options' => ['route' => 'admin_carriers_toggle_status', 'route_param_name' => 'carrierId', 'primary_field' => 'id_carrier', 'extra_route_params' => ['shop' => 1]]]));
        $this->assertSame('/orders?groupId=5', $grid->positionUpdateUrl(['id_group' => 5], ['options' => ['update_route' => 'admin_x_update_position', 'record_route_params' => ['id_group' => 'groupId']]]));
    }

    public function testRearrangeWhileNotSortedByPositionDoneWhileSo(): void
    {
        $form = new FormView();
        $form->children['position'] = new FormView($form);
        $form->children['position']->vars['block_prefixes'] = ['form', 'reorder_positions_button'];
        $columns = [
            ['id' => 'position_handle', 'type' => 'position_handle', 'options' => ['sortable' => true]],
            ['id' => 'id_carrier', 'type' => 'data', 'options' => ['sortable' => true]],
            ['id' => 'position', 'type' => 'position', 'options' => ['sortable' => true]],
        ];
        $base = ['filter_form' => $form, 'columns' => $columns, 'column_filters' => ['position' => ['position']]];

        $sorted = $this->grid($base + ['sorting' => ['order_by' => 'position', 'order_way' => 'asc']]);
        $this->assertSame('position', $sorted->getOrderingColumnId());
        $this->assertSame(['active' => true, 'href' => '/orders?order[orderBy]=id_carrier&order[sortOrder]=asc#order_grid_results'], array_map(fn ($value) => is_string($value) ? urldecode($value) : $value, $sorted->getReorder()));
        $this->assertSame([], $sorted->filtersFor('position'));
        $this->assertFalse($sorted->isSortable($columns[0]));

        $other = $this->grid($base + ['sorting' => ['order_by' => 'id_carrier', 'order_way' => 'asc']]);
        $this->assertNull($other->getOrderingColumnId());
        $this->assertSame('/orders?order[orderBy]=position&order[sortOrder]=asc#order_grid_results', urldecode($other->getReorder()['href']));
        $this->assertNull($this->grid()->getReorder());
    }

    public function testTheKitRendersAGridWhoseEveryTypeItHas(): void
    {
        $actions = (new RowActionCollection())->add((new LinkRowAction('edit'))->setName('Edit')->setOptions(['route' => 'a', 'route_param_name' => 'id', 'route_param_field' => 'id']));
        $grid = self::presentedArray();
        $grid['columns'][] = ['id' => 'actions', 'type' => 'action', 'options' => ['actions' => $actions]];
        $grid['actions'] = ['grid' => [['type' => 'simple']], 'bulk' => [['type' => 'submit']]];

        $this->assertTrue(Grid::renders($grid));
        $this->assertSame([], Grid::unknownTypes($grid));

        $grid['columns'][] = ['id' => 'position', 'type' => 'category_position', 'options' => []];
        $grid['actions']['bulk'][] = ['type' => 'ajax'];
        $this->assertFalse(Grid::renders($grid));
        $this->assertSame(['column:category_position', 'bulk:ajax'], Grid::unknownTypes($grid));
    }

    public function testHookParameters(): void
    {
        $params = $this->grid()->getHookParams();

        $this->assertSame('AdminOrders', $params['legacy_controller']);
        $this->assertSame('order', $params['grid']['id']);
    }

    private function grid(array $override = [], array $query = [], array $denied = []): Grid
    {
        $grid = $this->component($query, $denied);
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

    /**
     * @param string[] $denied routes the employee may not use
     */
    private function component(array $query = [], array $denied = []): Grid
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
            if (!in_array($name, ['material-symbols:visibility', 'material-symbols:add-circle', 'material-symbols:edit', 'material-symbols:delete'], true)) {
                throw new IconNotFoundException($name);
            }

            return new Icon('<path/>');
        });

        $tokens = $this->createMock(CsrfTokenManagerInterface::class);
        $tokens->method('getToken')->willReturnCallback(fn (string $id): CsrfToken => new CsrfToken($id, 'token-of-' . $id));

        $translator = $this->createMock(TranslatorInterface::class);
        $translator->method('trans')->willReturnArgument(0);

        $authorization = $this->createMock(AuthorizationCheckerInterface::class);
        $authorization->method('isGranted')->willReturn(false);
        $access = new RouteAccessChecker(RouteAccessCheckerTest::router(array_fill_keys($denied, 'deleteAction')), $authorization);

        return new Grid($requestStack, $router, $icons, $tokens, $translator, $access);
    }
}
