<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Form\FormView;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\UX\Icons\Exception\IconNotFoundException;
use Symfony\UX\Icons\IconRegistryInterface;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PreMount;

/**
 * A list page's grid, from the array GridPresenter::present() gives the page; mirrors
 * ui/src/stories/components/Grid.stories.js and follows ui/.ai/designs/grid.md:
 * <twig:ui:Grid :grid="orderGrid"/>, <twig:ui:Grid :grid="customerOrdersGrid" embedded :headingLevel="3"/>.
 * Blocks: before, toolbar, empty, footer. Sorting, pages and rows per page are links on the current URL with the grid's
 * form prefix; they land on the results summary (#{id}_grid_results).
 */
#[AsTwigComponent('ui:Grid', template: '@PrestaShop/Admin/Component/Ui/grid.html.twig')]
final class Grid
{
    /** As CommonController::paginationAction */
    public const LIMITS = [10, 20, 50, 100, 300, 1000];

    public const HEADING_LEVELS = [2, 3, 4, 5, 6];

    /** What the presented grid must hold */
    private const KEYS = ['id', 'name', 'columns', 'data', 'pagination', 'sorting', 'filter_form', 'column_filters', 'actions', 'attributes', 'form_prefix'];

    /** Old Material Icons names of grid actions and columns, and their Material Symbols */
    private const ICON_ALIASES = [
        'add_circle_outline' => 'add_circle',
        'clear' => 'close',
        'remove_red_eye' => 'visibility',
        'zoom_in' => 'search',
    ];

    public array $grid;

    /** Inside another card: no card, no visible header; the table's caption names it */
    public bool $embedded = false;

    /** Level of the title: the page's h1 is the page head's */
    public int $headingLevel = 2;

    public function __construct(
        private readonly RequestStack $requestStack,
        private readonly UrlGeneratorInterface $router,
        #[Autowire(service: '.ux_icons.icon_registry')]
        private readonly IconRegistryInterface $icons,
    ) {
    }

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired('grid')
            ->setDefaults(['embedded' => false, 'headingLevel' => 2])
            ->setAllowedTypes('grid', 'array')
            ->setAllowedValues('grid', function (array $grid): bool {
                $missing = array_diff(self::KEYS, array_keys($grid));
                if ([] !== $missing) {
                    throw new InvalidOptionsException(sprintf('The grid is the presented grid (GridPresenter::present()); it has no %s.', implode(', ', $missing)));
                }

                return $grid['filter_form'] instanceof FormView;
            })
            ->setAllowedTypes('embedded', 'bool')
            // headingLevel="3" in Twig is a string
            ->setAllowedValues('headingLevel', fn (mixed $level): bool => is_numeric($level) && in_array((int) $level, self::HEADING_LEVELS, true))
            ->setNormalizer('headingLevel', fn (Options $options, int|string $level): int => (int) $level)
        ;

        return $resolver->resolve($data) + $data;
    }

    /**
     * empty: nothing to list yet; no-match: filters hide every record; list
     */
    public function getState(): string
    {
        if ($this->grid['attributes']['is_empty_state'] ?? false) {
            return 'empty';
        }

        return 0 === (int) $this->grid['data']['records_total'] ? 'no-match' : 'list';
    }

    /**
     * The column whose cell is each row's header: the identifier, else the first data or link column
     */
    public function getRowHeaderColumnId(): ?string
    {
        foreach (['identifier', null] as $wanted) {
            foreach ($this->grid['columns'] as $column) {
                if (null === $wanted ? in_array($column['type'], ['data', 'link', 'disableable_link'], true) : $wanted === $column['type']) {
                    return $column['id'];
                }
            }
        }

        return null;
    }

    public function isSortable(array $column): bool
    {
        return ($column['options']['sortable'] ?? false) && 'list' === $this->getState();
    }

    /**
     * ascending or descending for the sorted column, null for the others
     */
    public function sortState(string $columnId): ?string
    {
        if ($this->grid['sorting']['order_by'] !== $columnId) {
            return null;
        }

        return 'desc' === strtolower((string) $this->grid['sorting']['order_way']) ? 'descending' : 'ascending';
    }

    /**
     * Sorts by the column, ascending, or the other way when it is already
     */
    public function sortHref(string $columnId): string
    {
        return $this->url(['orderBy' => $columnId, 'sortOrder' => 'ascending' === $this->sortState($columnId) ? 'desc' : 'asc']);
    }

    public function getLimit(): int
    {
        return max(1, (int) $this->grid['pagination']['limit']);
    }

    public function getCurrentPage(): int
    {
        return intdiv((int) $this->grid['pagination']['offset'], $this->getLimit()) + 1;
    }

    public function getPageCount(): int
    {
        return max(1, (int) ceil((int) $this->grid['data']['records_total'] / $this->getLimit()));
    }

    /**
     * The links <twig:ui:Pagination> needs: the first and last pages, the current one and its neighbours
     *
     * @return array<int, string>
     */
    public function getPageLinks(): array
    {
        $current = $this->getCurrentPage();
        $last = max($this->getPageCount(), $current);
        $pages = array_unique(array_filter([1, $current - 1, $current, $current + 1, $last], fn (int $page): bool => $page >= 1 && $page <= $last));
        sort($pages);

        $links = [];
        foreach ($pages as $page) {
            $links[$page] = $this->url(['offset' => ($page - 1) * $this->getLimit(), 'limit' => $this->getLimit()]);
        }

        return $links;
    }

    /**
     * Any page, for the pagination's field: {offset} is the first row of the page typed
     */
    public function getJumpUrl(): string
    {
        $sentinel = 987654321;

        return str_replace((string) $sentinel, '{offset}', $this->url(['offset' => $sentinel, 'limit' => $this->getLimit()]));
    }

    /**
     * Rows per page, for a <twig:ui:Dropdown>: links back to the first page, the current number active
     *
     * @return list<array{label: string, href: string, active: bool}>
     */
    public function getLimitItems(): array
    {
        $limits = self::LIMITS;
        if (!in_array($this->getLimit(), $limits, true)) {
            $limits[] = $this->getLimit();
            sort($limits);
        }

        return array_map(fn (int $limit): array => [
            'label' => (string) $limit,
            'href' => $this->url(['offset' => 0, 'limit' => $limit]),
            'active' => $limit === $this->getLimit(),
        ], $limits);
    }

    /**
     * The rows shown, from 1: [51, 100]
     *
     * @return array{int, int}
     */
    public function getRange(): array
    {
        $total = (int) $this->grid['data']['records_total'];
        $offset = (int) $this->grid['pagination']['offset'];

        return [min($offset + 1, $total), min($offset + $this->getLimit(), $total)];
    }

    /**
     * The filter fields of a column
     *
     * @return FormView[]
     */
    public function filtersFor(string $columnId): array
    {
        $form = $this->grid['filter_form'];

        return array_values(array_filter(array_map(
            fn (string $name): ?FormView => $form->children[$name] ?? null,
            $this->grid['column_filters'][$columnId] ?? []
        )));
    }

    public function hasFilters(): bool
    {
        foreach ($this->grid['columns'] as $column) {
            if ([] !== $this->filtersFor($column['id'])) {
                return true;
            }
        }

        return false;
    }

    /**
     * The definition's search and reset field: the grid renders Search and Clear filters from it
     */
    public function getSearchAndReset(): ?FormView
    {
        foreach ($this->grid['filter_form']->children as $child) {
            if (in_array('search_and_reset', $child->vars['block_prefixes'] ?? [], true)) {
                return $child;
            }
        }

        return null;
    }

    /**
     * A Material Symbols name for an icon of the old grids, or null when the kit has none
     */
    public function icon(?string $name): ?string
    {
        if (null === $name || '' === $name) {
            return null;
        }
        $name = self::ICON_ALIASES[$name] ?? preg_replace('/_outline$/', '', $name);
        if (!preg_match(Icon::MATERIAL_SYMBOL, $name)) {
            return null;
        }

        try {
            $this->icons->get('material-symbols:' . str_replace('_', '-', $name));
        } catch (IconNotFoundException) {
            return null;
        }

        return $name;
    }

    /**
     * What displayAdminGridTableBefore and displayAdminGridTableAfter get, as on the old grids
     */
    public function getHookParams(): array
    {
        $request = $this->requestStack->getCurrentRequest();

        return [
            'grid' => $this->grid,
            'legacy_controller' => $request?->attributes->get('_legacy_controller'),
            'controller' => $request?->attributes->get('_controller'),
        ];
    }

    /**
     * The current URL with these grid parameters ({form_prefix}[…], or none without a prefix), on the results summary
     */
    private function url(array $parameters): string
    {
        $request = $this->requestStack->getCurrentRequest();
        $query = $request?->query->all() ?? [];
        $prefix = (string) $this->grid['form_prefix'];

        if ('' === $prefix) {
            $query = array_merge($query, $parameters);
        } else {
            $query[$prefix] = array_merge(is_array($query[$prefix] ?? null) ? $query[$prefix] : [], $parameters);
        }
        $fragment = $this->grid['id'] . '_grid_results';
        $route = $request?->attributes->get('_route');

        if (null === $route) {
            return '?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986) . '#' . $fragment;
        }

        return $this->router->generate($route, array_merge($request->attributes->get('_route_params', []), $query, ['_fragment' => $fragment]));
    }
}
