<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Integration\PrestaShopBundle\Twig\Component\Ui;

use PrestaShop\PrestaShop\Core\Grid\Action\ModalOptions;
use PrestaShop\PrestaShop\Core\Grid\Action\Row\RowActionCollection;
use PrestaShop\PrestaShop\Core\Grid\Action\Row\Type\LinkRowAction;
use PrestaShop\PrestaShop\Core\Grid\Action\Row\Type\SubmitRowAction;
use PrestaShopBundle\Form\Admin\Type\DateRangeType;
use PrestaShopBundle\Form\Admin\Type\IntegerMinMaxFilterType;
use PrestaShopBundle\Form\Admin\Type\NumberMinMaxFilterType;
use PrestaShopBundle\Form\Admin\Type\SearchAndResetType;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormFactoryInterface;

/**
 * A presented grid (what GridPresenter::present() gives a page) built from a fixture of the Grid stories
 * (ui/src/stories/fixtures/*.json), its filter form a real one: the story and the component render the same grid.
 */
final class GridFixture
{
    private const TYPES = [
        'text' => TextType::class,
        'date_range' => DateRangeType::class,
        'integer_min_max' => IntegerMinMaxFilterType::class,
        'number_min_max' => NumberMinMaxFilterType::class,
    ];

    /**
     * @param array $override keys of the fixture replaced, as the story does
     */
    public static function present(FormFactoryInterface $factory, string $name, array $override = []): array
    {
        $fixture = $override + json_decode(file_get_contents(__DIR__ . '/../../../../../../ui/src/stories/fixtures/' . $name . '.json'), true, 512, JSON_THROW_ON_ERROR);

        $builder = $factory->createNamedBuilder($fixture['id'], FormType::class, $fixture['filter_data'], [
            'action' => $fixture['action'],
            'method' => 'POST',
            'csrf_protection' => false,
            'allow_extra_fields' => true,
        ]);
        $columnFilters = [];
        foreach ($fixture['filters'] as $filter) {
            $builder->add($filter['name'], self::TYPES[$filter['type']], ['required' => false] + ($filter['options'] ?? []));
            $columnFilters[$filter['column']][] = $filter['name'];
        }
        if ([] !== $fixture['filters']) {
            $builder->add('actions', SearchAndResetType::class, ['attr' => ['data-url' => $fixture['reset_url'], 'data-redirect' => $fixture['redirect_url']]]);
            $columnFilters['actions'] = ['actions'];
        }

        return [
            'id' => $fixture['id'],
            'name' => $fixture['name'],
            'filter_form' => $builder->getForm()->createView(),
            'form_prefix' => $fixture['form_prefix'],
            'columns' => array_map(self::column(...), $fixture['columns']),
            'column_filters' => $columnFilters,
            'actions' => [
                'grid' => array_map(fn (array $action): array => array_diff_key($action, ['url' => 0]), $fixture['grid_actions'] ?? []),
                'bulk' => array_map(self::bulkAction(...), $fixture['bulk_actions'] ?? []),
            ],
            'data' => ['records' => $fixture['records'], 'records_total' => $fixture['records_total'], 'query' => $fixture['query'] ?? ''],
            'pagination' => $fixture['pagination'],
            'sorting' => $fixture['sorting'],
            'filters' => $fixture['filter_data'],
            'attributes' => ['is_empty_state' => $fixture['is_empty_state']],
            'view_options' => $fixture['view_options'],
        ];
    }

    /**
     * A bulk action as BulkActionCollection::toArray() gives it: its modal options an object, the story's URL left out
     */
    private static function bulkAction(array $action): array
    {
        unset($action['url']);
        if (is_array($action['options']['modal_options'] ?? null)) {
            $action['options']['modal_options'] = new ModalOptions($action['options']['modal_options']);
        }

        return $action;
    }

    /**
     * An action column's actions as the definition gives them: a RowActionCollection of row actions
     */
    private static function column(array $column): array
    {
        if ('action' !== $column['type']) {
            return $column;
        }
        $actions = new RowActionCollection();
        foreach ($column['options']['actions'] as $action) {
            $options = $action['options'];
            if (is_array($options['modal_options'] ?? null)) {
                $options['modal_options'] = new ModalOptions($options['modal_options']);
            }
            $row = 'submit' === $action['type'] ? new SubmitRowAction($action['id']) : new LinkRowAction($action['id']);
            $actions->add($row->setName($action['name'])->setIcon($action['icon'])->setOptions($options));
        }
        $column['options']['actions'] = $actions;

        return $column;
    }
}
