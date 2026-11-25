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
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
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

    /** Column types with a kit cell (Grid/cell/*.html.twig) */
    public const COLUMN_TYPES = [
        'action', 'aliases', 'badge', 'boolean', 'bulk_action', 'choice', 'color', 'currency_name', 'data', 'date_time', 'discount_usage',
        'disableable_link', 'employee_name_with_avatar', 'html', 'identifier', 'image', 'link', 'link_group', 'order_price', 'position',
        'position_handle', 'severity_level', 'status', 'toggle',
    ];

    /** Action types the kit renders: the others (modules', domain ones) need their own kit template first */
    public const ACTION_TYPES = [
        'bulk' => ['button', 'modal_form_submit', 'submit'],
        'grid' => ['link', 'simple', 'submit'],
        'row' => ['link', 'submit'],
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
        private readonly CsrfTokenManagerInterface $csrfTokens,
        private readonly TranslatorInterface $translator,
    ) {
    }

    /**
     * Whether the kit renders this presented grid as it is: every column, row, bulk and list action of a type it has.
     * Otherwise a kit page keeps the old grid (Common/Grid/Ui/grid_panel.html.twig), so nothing is lost.
     */
    public static function renders(array $grid): bool
    {
        return [] === self::unknownTypes($grid);
    }

    /**
     * The types of a presented grid the kit has no template for, as "column:employee_name_with_avatar", "row:…",
     * "bulk:…", "grid:…"
     *
     * @return list<string>
     */
    public static function unknownTypes(array $grid): array
    {
        $unknown = [];
        foreach ($grid['columns'] ?? [] as $column) {
            if (!in_array($column['type'], self::COLUMN_TYPES, true)) {
                $unknown[] = 'column:' . $column['type'];
            }
            foreach ('action' === $column['type'] ? $column['options']['actions'] ?? [] : [] as $action) {
                if (!in_array($action->getType(), self::ACTION_TYPES['row'], true)) {
                    $unknown[] = 'row:' . $action->getType();
                }
            }
        }
        foreach (['bulk', 'grid'] as $kind) {
            foreach ($grid['actions'][$kind] ?? [] as $action) {
                if (!in_array($action['type'] ?? null, self::ACTION_TYPES[$kind], true)) {
                    $unknown[] = $kind . ':' . ($action['type'] ?? '?');
                }
            }
        }

        return array_values(array_unique($unknown));
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
        return ($column['options']['sortable'] ?? false) && 'position_handle' !== $column['type'] && 'list' === $this->getState();
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
     * The filter fields of a column, but search and reset (the actions column's) and rearrange (the position column's):
     * the toolbar renders them
     *
     * @return FormView[]
     */
    public function filtersFor(string $columnId): array
    {
        $form = $this->grid['filter_form'];

        return array_values(array_filter(array_map(
            fn (string $name): ?FormView => $form->children[$name] ?? null,
            $this->grid['column_filters'][$columnId] ?? []
        ), fn (?FormView $field): bool => null !== $field && [] === array_intersect(['search_and_reset', 'reorder_positions_button'], $field->vars['block_prefixes'] ?? [])));
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
     * The definition's rearrange field (ReorderPositionsButtonType, the position column's filter): the toolbar renders a
     * link from it instead
     */
    public function getReorderField(): ?FormView
    {
        foreach ($this->grid['filter_form']->children as $child) {
            if (in_array('reorder_positions_button', $child->vars['block_prefixes'] ?? [], true)) {
                return $child;
            }
        }

        return null;
    }

    /**
     * The position column the list is sorted by, if any: its rows can be moved (the presenter adds its handle column)
     */
    public function getOrderingColumnId(): ?string
    {
        foreach ($this->grid['columns'] as $column) {
            if ('position' === $column['type'] && strtolower($column['id']) === strtolower((string) ($this->grid['sorting']['order_by'] ?? ''))) {
                return $column['id'];
            }
        }

        return null;
    }

    /**
     * Rearrange: the list sorted by its position column, where rows move; Done: back to the first other sortable column
     *
     * @return array{active: bool, href: string}|null
     */
    public function getReorder(): ?array
    {
        $position = null;
        $other = null;
        foreach ($this->grid['columns'] as $column) {
            if ('position' === $column['type']) {
                $position ??= $column['id'];
            } elseif (null === $other && $this->isSortable($column)) {
                $other = $column['id'];
            }
        }
        if (null === $position || null === $this->getReorderField()) {
            return null;
        }
        $active = null !== $this->getOrderingColumnId();

        return [
            'active' => $active,
            'href' => $active && null !== $other
                ? $this->url(['orderBy' => $other, 'sortOrder' => 'asc'])
                : $this->url(['orderBy' => $position, 'sortOrder' => 'asc']),
        ];
    }

    /**
     * What a position handle sends (positions[] through the action form, grid-position.js), as the old grids
     */
    public function positionUpdateUrl(array $record, array $column): string
    {
        $parameters = [];
        foreach ($column['options']['record_route_params'] ?? [] as $field => $name) {
            $parameters[$name] = $record[$field] ?? null;
        }

        return $this->router->generate($column['options']['update_route'], $parameters);
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
     * The bulk actions as <twig:ui:DropdownMenu> items: a submit sends the filter form (the checked rows are in it) to its
     * route, asking first with confirm_message; a button tells the page (grid-bulk.js, ps:grid-bulk-action); a modal
     * form opens the page's modal, which gets the checked rows. Other types (ajax, a module's) are not on kit grids yet.
     *
     * @return list<array{type: string, label: string, icon: ?string, attr: array<string, string>}>
     */
    public function getBulkItems(): array
    {
        $items = [];
        foreach ($this->grid['actions']['bulk'] as $action) {
            $options = $action['options'];
            $item = ['label' => $this->actionLabel($action['name'] ?? null, (string) $action['id']), 'icon' => $this->icon($action['icon'] ?? null)];

            switch ($action['type']) {
                case 'submit':
                    $items[] = $item + ['type' => 'submit', 'attr' => [
                        'form' => $this->grid['id'] . '_filter_form',
                        'formaction' => $this->router->generate($options['submit_route'], $options['route_params'] ?? []),
                        'formmethod' => strtolower($options['submit_method'] ?? 'POST'),
                    ] + $this->confirmAttributes($options)];
                    break;
                case 'button':
                    $attributes = array_map('strval', array_filter($options['attributes'] ?? [], 'is_scalar'));
                    $items[] = $item + ['type' => 'button', 'attr' => $attributes + [
                        'class' => (string) ($options['class'] ?? ''),
                        'data-ps-action' => 'grid-bulk-button',
                        'data-ps-data-action-id' => (string) $action['id'],
                    ]];
                    break;
                case 'modal_form_submit':
                    $items[] = $item + ['type' => 'button', 'attr' => [
                        'data-ps-action' => 'grid-bulk-modal',
                        'data-bs-toggle' => 'modal',
                        'data-bs-target' => '#' . $options['modal_id'],
                    ]];
                    break;
            }
        }

        return $items;
    }

    /**
     * The grid actions as <twig:ui:DropdownMenu> items, for the header's menu: a link goes to its route; Refresh list is
     * the current page again; Show SQL query opens the grid's query modal, Export to SQL Manager sends its form; another
     * simple action is a button for the page (data-ps-action="grid-action"); a submit sends the grid's action form.
     *
     * @return list<array<string, mixed>>
     */
    public function getGridItems(): array
    {
        $items = [];
        foreach ($this->grid['actions']['grid'] as $action) {
            $item = ['label' => (string) $action['name'], 'icon' => $this->icon($action['icon'] ?? null)];

            if ('link' === $action['type']) {
                $items[] = $item + ['type' => 'link', 'href' => $this->router->generate($action['options']['route'], $action['options']['route_params'] ?? [])];
            } elseif ('submit' === $action['type']) {
                // Sends the action form with the token the old grids put in the filter form's
                $items[] = $item + ['type' => 'submit', 'attr' => [
                    'form' => $this->grid['id'] . '_grid_action_form',
                    'formaction' => $this->router->generate($action['options']['submit_route'], $action['options']['route_params'] ?? []),
                    'formmethod' => 'GET' === strtoupper($action['options']['submit_method'] ?? 'POST') ? 'get' : 'post',
                    'name' => $this->grid['id'] . '[_token]',
                    'value' => $this->csrfTokens->getToken((string) $action['id'])->getValue(),
                ] + $this->confirmAttributes($action['options'])];
            } elseif ('simple' === $action['type']) {
                $items[] = $item + match ($action['id']) {
                    'common_refresh_list' => ['type' => 'link', 'href' => $this->url([])],
                    'common_show_query' => ['type' => 'button', 'attr' => ['data-bs-toggle' => 'modal', 'data-bs-target' => '#' . $this->grid['id'] . '_grid_common_show_query_modal']],
                    'common_export_sql_manager' => ['type' => 'submit', 'attr' => ['form' => $this->grid['id'] . '_common_show_query_modal_form']],
                    default => ['type' => 'button', 'attr' => ['class' => 'js-' . $action['id'] . '-grid-action', 'data-ps-action' => 'grid-action', 'data-ps-data-action-id' => (string) $action['id']]],
                };
            }
        }

        return $items;
    }

    /**
     * The SQL query modal is rendered when an action shows or exports the query
     */
    public function hasQueryModal(): bool
    {
        return [] !== array_intersect(['common_show_query', 'common_export_sql_manager'], array_column($this->grid['actions']['grid'], 'id'));
    }

    /**
     * A row's actions that apply to it, as the old grids split them: those with use_inline_display, then the first other
     * one, as icon buttons (props for <twig:ui:IconButton>); the rest in its menu (<twig:ui:DropdownMenu> items). An
     * action whose icon the kit has not goes to the menu. A link goes to its route; a submit sends the grid's action form
     * with _method for a DELETE (method override); both ask first with their confirm message.
     *
     * @return array{buttons: list<array<string, mixed>>, menu: list<array<string, mixed>>}
     */
    public function rowActions(array $record, array $column): array
    {
        $buttons = [];
        $menu = [];
        $firstRegular = true;

        foreach ($column['options']['actions'] ?? [] as $action) {
            if (!$action->isApplicable($record) || !in_array($action->getType(), ['link', 'submit'], true)) {
                continue;
            }
            $options = $action->getOptions();
            $icon = $this->icon($action->getIcon());
            $label = $this->actionLabel($action->getName(), (string) $action->getId());
            $url = $this->actionUrl($options, $record);
            $confirm = $this->confirmAttributes([
                'confirm_message' => 'dynamic' === ($options['confirm_message_type'] ?? null) && !empty($record[$options['dynamic_message_field'] ?? ''])
                    ? $record[$options['dynamic_message_field']]
                    : ($options['confirm_message'] ?? null),
                'modal_options' => $options['modal_options'] ?? null,
            ]);

            if ('link' === $action->getType()) {
                $attributes = $confirm + (empty($options['target']) ? [] : ['target' => (string) $options['target']]);
                $asButton = ['href' => $url] + $attributes;
                $asItem = ['type' => 'link', 'label' => $label, 'icon' => $icon, 'href' => $url, 'attr' => $attributes];
            } else {
                $method = strtoupper($options['method'] ?? 'POST');
                $attributes = ['form' => $this->grid['id'] . '_grid_action_form', 'formaction' => $url, 'formmethod' => 'GET' === $method ? 'get' : 'post']
                    + (in_array($method, ['GET', 'POST'], true) ? [] : ['name' => '_method', 'value' => $method])
                    + $confirm;
                $asButton = ['type' => 'submit'] + $attributes;
                $asItem = ['type' => 'submit', 'label' => $label, 'icon' => $icon, 'attr' => $attributes];
            }

            $shown = null !== $icon && (($options['use_inline_display'] ?? false) || $firstRegular);
            if (!($options['use_inline_display'] ?? false)) {
                $firstRegular = false;
            }
            if ($shown) {
                $buttons[] = ['icon' => $icon, 'label' => $label, 'props' => $asButton];
            } else {
                $menu[] = $asItem;
            }
        }

        return ['buttons' => $buttons, 'menu' => $menu];
    }

    /**
     * Where a row goes when clicked: its first link action with clickable_row, unless it asks first (grid-row-link.js)
     */
    public function rowLink(array $record): ?string
    {
        foreach ($this->grid['columns'] as $column) {
            foreach ('action' === $column['type'] ? $column['options']['actions'] ?? [] : [] as $action) {
                $options = $action->getOptions();
                if ('link' === $action->getType() && ($options['clickable_row'] ?? false) && $action->isApplicable($record)) {
                    return empty($options['confirm_message']) ? $this->actionUrl($options, $record) : null;
                }
            }
        }

        return null;
    }

    /**
     * A choice cell's menu (Orders' status): the record's choice and its colour, and every choice as a submit item that
     * posts value to the column's route through the grid's action form, the current one active. Null without choices.
     *
     * @return array{label: string, color: ?string, items: list<array<string, mixed>>}|null
     */
    public function choice(array $record, array $column): ?array
    {
        $options = $column['options'];
        $choices = $options['choice_provider']->getChoices($record);
        if (empty($choices)) {
            return null;
        }
        $parameters = [];
        foreach ($options['record_route_params'] ?? [] as $field => $name) {
            $parameters[$name] = $record[$field] ?? null;
        }
        $url = $this->router->generate($options['route'], $parameters);
        $current = $record[$options['field']] ?? null;
        $label = '';
        $items = [];
        foreach ($choices as $name => $value) {
            $active = (string) $value === (string) $current;
            $label = $active ? (string) $name : $label;
            $items[] = ['type' => 'submit', 'label' => (string) $name, 'active' => $active, 'attr' => [
                'form' => $this->grid['id'] . '_grid_action_form',
                'formaction' => $url,
                'name' => 'value',
                'value' => (string) $value,
            ]];
        }
        $color = empty($options['color_field']) ? null : ($record[$options['color_field']] ?? null);

        return ['label' => $label, 'color' => null === $color ? null : (string) $color, 'items' => $items];
    }

    /**
     * Where a row's preview comes from (a column's preview option, Orders' identifier), or null
     */
    public function previewUrl(array $record, array $column): ?string
    {
        $preview = $column['options']['preview'] ?? null;
        $options = is_object($preview) && method_exists($preview, 'getOptions') ? $preview->getOptions() : (is_array($preview) ? $preview : null);
        if (empty($options['preview_data_route'])) {
            return null;
        }
        $parameters = [];
        foreach ($options['preview_route_params'] ?? [] as $name => $field) {
            $parameters[$name] = $record[$field] ?? null;
        }

        return $this->router->generate($options['preview_data_route'], $parameters);
    }

    /**
     * The column whose cells hold the preview toggle, if any: its rows get a preview row
     */
    public function getPreviewColumnId(): ?string
    {
        foreach ($this->grid['columns'] as $column) {
            if (null !== ($column['options']['preview'] ?? null)) {
                return $column['id'];
            }
        }

        return null;
    }

    /**
     * Where a toggle cell posts (route_param_name from primary_field, extra_route_params from the record or as given)
     */
    public function toggleUrl(array $record, array $column): string
    {
        $options = $column['options'];
        $parameters = [$options['route_param_name'] => $record[$options['primary_field']] ?? null];
        foreach ($options['extra_route_params'] ?? [] as $name => $field) {
            $parameters[$name] = $record[$field] ?? $field;
        }

        return $this->router->generate($options['route'], $parameters);
    }

    /**
     * An action's name, or for one a definition left unnamed (Currencies' edit) the usual name of its id: an icon button
     * needs one
     */
    private function actionLabel(?string $name, string $id): string
    {
        if (null !== $name && '' !== trim($name)) {
            return $name;
        }
        $usual = ['delete' => 'Delete', 'duplicate' => 'Duplicate', 'edit' => 'Edit', 'view' => 'View'][$id] ?? null;

        return null !== $usual ? $this->translator->trans($usual, [], 'Admin.Actions') : ucfirst(str_replace('_', ' ', $id));
    }

    private function actionUrl(array $options, array $record): string
    {
        $parameters = [$options['route_param_name'] => $record[$options['route_param_field']] ?? null];
        foreach ($options['extra_route_params'] ?? [] as $name => $field) {
            $parameters[$name] = $record[$field] ?? $field;
        }

        return $this->router->generate($options['route'], $parameters);
    }

    /**
     * What the page's ConfirmDialog asks with (confirm-dialog.js), from an action's confirm_message and modal_options
     *
     * @return array<string, string>
     */
    private function confirmAttributes(array $options): array
    {
        if (empty($options['confirm_message'])) {
            return [];
        }
        $modal = isset($options['modal_options']) && is_object($options['modal_options']) && method_exists($options['modal_options'], 'getOptions')
            ? $options['modal_options']->getOptions()
            : [];

        return array_filter([
            'data-ps-confirm' => (string) $options['confirm_message'],
            'data-ps-data-confirm-title' => (string) ($modal['title'] ?? ''),
            'data-ps-data-confirm-label' => (string) ($modal['confirm_button_label'] ?? ''),
            'data-ps-data-confirm-variant' => str_contains((string) ($modal['confirm_button_class'] ?? ''), 'danger') ? 'danger' : '',
        ], fn (string $value): bool => '' !== $value);
    }

    /**
     * The text that reads best on a record's colour (a status badge): dark or light, by their WCAG contrast with it
     */
    public function inkOn(string $color): string
    {
        $hex = ltrim(trim($color), '#');
        if (3 === strlen($hex)) {
            $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
        }
        if (!preg_match('/^[0-9a-f]{6}$/i', $hex)) {
            return 'dark';
        }

        $luminance = $this->luminance($hex);
        // The kit's dark text ($gray-800, #1d1d1b) and white
        $onDark = ($luminance + 0.05) / ($this->luminance('1d1d1b') + 0.05);
        $onLight = 1.05 / ($luminance + 0.05);

        return $onDark >= $onLight ? 'dark' : 'light';
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

    private function luminance(string $hex): float
    {
        $channels = array_map(function (string $pair): float {
            $value = hexdec($pair) / 255;

            return $value <= 0.03928 ? $value / 12.92 : (($value + 0.055) / 1.055) ** 2.4;
        }, str_split($hex, 2));

        return 0.2126 * $channels[0] + 0.7152 * $channels[1] + 0.0722 * $channels[2];
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
