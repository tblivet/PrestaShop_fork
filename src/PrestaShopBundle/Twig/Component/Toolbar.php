<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component;

use PrestaShop\PrestaShop\Core\Action\ActionsBarButtonInterface;
use PrestaShop\PrestaShop\Core\Action\ActionsBarButtonsCollection;
use PrestaShop\PrestaShop\Core\Hook\HookDispatcherInterface;
use PrestaShopBundle\Entity\Tab;
use PrestaShopBundle\Twig\Component\Ui\Icon;
use PrestaShopBundle\Twig\Layout\MenuBuilder;
use PrestaShopBundle\Twig\Layout\MenuLink;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Throwable;

#[AsTwigComponent(template: '@PrestaShop/Admin/Component/Layout/toolbar.html.twig')]
class Toolbar
{
    protected string $title = '';

    protected string $subTitle = '';
    protected string $helpLink = '';
    protected bool $sidebarEnabled = true;
    protected int $currentTabLevel = 0;

    /**
     * @var array<int, MenuLink>
     */
    protected array $navigationTabs = [];

    /**
     * @var array<string, MenuLink>
     */
    protected array $breadcrumbs = [];

    protected array $layoutHeaderToolbarBtn = [];

    /**
     * The kit title icons of the core pages, by class name of their menu entry: a group with sub-pages (their title is
     * the group's, see getKitTitle()) or a page without. A page named as its side menu entry has the same icon
     * (NavBar::KIT_ICONS). Module pages have none; a page's layoutIcon comes first.
     */
    private const KIT_TITLE_ICONS = [
        'AdminAddresses' => 'home_pin',
        'AdminAdminAPI' => 'key',
        'AdminAdminPreferences' => 'admin_panel_settings',
        'AdminAttachments' => 'attach_file',
        'AdminCarriers' => 'local_shipping',
        'AdminCarts' => 'shopping_cart',
        'AdminCategories' => 'category',
        'AdminCmsContent' => 'description',
        'AdminCustomerThreads' => 'support_agent',
        'AdminCustomers' => 'group',
        'AdminDashboard' => 'home',
        'AdminDeliverySlip' => 'package_2',
        'AdminEmails' => 'mail',
        'AdminExtraPropertyDefinitions' => 'data_object',
        'AdminFeatureFlag' => 'science',
        'AdminImages' => 'image',
        'AdminImport' => 'upload',
        'AdminInformation' => 'info',
        'AdminInvoices' => 'receipt_long',
        'AdminLogs' => 'history',
        'AdminMailTheme' => 'drafts',
        'AdminModulesPositions' => 'anchor',
        'AdminModulesSf' => 'extension',
        'AdminOrderMessage' => 'sms',
        'AdminOrders' => 'shopping_basket',
        'AdminPPreferences' => 'inventory',
        'AdminParentAttributesGroups' => 'style',
        'AdminParentCartRules' => 'sell',
        'AdminParentCountries' => 'location_on',
        'AdminParentCustomerPreferences' => 'manage_accounts',
        'AdminParentEmployees' => 'badge',
        'AdminParentLocalization' => 'flag',
        'AdminParentManufacturers' => 'factory',
        'AdminParentMeta' => 'travel_explore',
        'AdminParentOrderPreferences' => 'fact_check',
        'AdminParentPreferences' => 'settings',
        'AdminParentRequestSql' => 'database',
        'AdminParentSearchConf' => 'search',
        'AdminParentSecurity' => 'shield',
        'AdminParentStores' => 'contact_mail',
        'AdminParentTaxes' => 'percent',
        'AdminPayment' => 'payments',
        'AdminPaymentPreferences' => 'credit_card',
        'AdminPerformance' => 'speed',
        'AdminProducts' => 'inventory_2',
        'AdminReturn' => 'assignment_return',
        'AdminShipping' => 'delivery_truck_speed',
        'AdminSlip' => 'currency_exchange',
        'AdminStats' => 'monitoring',
        'AdminStockManagement' => 'warehouse',
        'AdminThemesParent' => 'brush',
        'AdminTracking' => 'monitor_heart',
        'AdminTranslations' => 'translate',
        'AdminWebservice' => 'api',
    ];

    /** The kit page title's icon, a <twig:ui:Icon> name set by the page (layoutIcon) */
    public string $layoutIcon = '';

    /** The class names of the page's menu entry and of the one it is under */
    protected ?string $tabClassName = null;

    protected ?string $parentTabClassName = null;

    /** Whether the page is its menu entry's own page, not an add or edit page under it */
    protected bool $tabPage = true;

    public function __construct(
        protected readonly HookDispatcherInterface $hookDispatcher,
        protected readonly MenuBuilder $menuBuilder,
    ) {
    }

    public function mount(string $layoutTitle, string $helpLink, bool $enableSidebar, string $layoutSubTitle, array $layoutHeaderToolbarBtn, array $breadcrumbLinks = []): void
    {
        $this->sidebarEnabled = $enableSidebar;
        $this->helpLink = $helpLink;
        $this->layoutHeaderToolbarBtn = $layoutHeaderToolbarBtn;
        $currentTab = $this->menuBuilder->getCurrentTab() ?? $this->menuBuilder->getParentTab();
        $tabs = [];
        $ancestorsTab = [];
        if (null !== $currentTab) {
            $tabs[] = $currentTab;
            $this->tabClassName = $currentTab->getClassName();
            $ancestorsTab = $this->menuBuilder->getAncestorsTab($currentTab->getId());
            if (!empty($ancestorsTab)) {
                $this->parentTabClassName = reset($ancestorsTab)->getClassName();
                $tabs[] = $ancestorsTab;
                $this->currentTabLevel = count($ancestorsTab);

                if ($this->currentTabLevel >= 3) {
                    $this->navigationTabs = $this->menuBuilder->buildNavigationTabs($currentTab);
                    $this->tabPage = $this->menuBuilder->isTabPage($currentTab);
                }
            }
        }

        if (!empty($breadcrumbLinks)) {
            $this->setBreadcrumbs($breadcrumbLinks, $tabs);
        } elseif ($currentTab !== null) {
            $this->setBreadcrumbs($this->menuBuilder->convertTabsToBreadcrumbLinks($currentTab, $ancestorsTab), $tabs);
        }

        $this->setTitle($layoutTitle);
        $this->subTitle = $layoutSubTitle;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getSubTitle(): string
    {
        return $this->subTitle;
    }

    public function getCurrentTabLevel(): int
    {
        return $this->currentTabLevel;
    }

    public function getBreadcrumbs(): array
    {
        return $this->breadcrumbs;
    }

    public function getNavigationTabs(): array
    {
        return $this->navigationTabs;
    }

    public function isSidebarEnabled(): bool
    {
        return $this->sidebarEnabled;
    }

    public function getHelpLink(): string
    {
        return $this->helpLink;
    }

    public function getLayoutHeaderToolbarBtn(): array
    {
        return $this->layoutHeaderToolbarBtn;
    }

    /**
     * The kit page title's icon: the one the page sets (layoutIcon), or its menu entry's: its group's on a sub-page
     */
    public function getKitIcon(): ?string
    {
        if ('' !== $this->layoutIcon && preg_match(Icon::MATERIAL_SYMBOL, $this->layoutIcon)) {
            return $this->layoutIcon;
        }

        $parentIcon = self::KIT_TITLE_ICONS[$this->parentTabClassName ?? ''] ?? null;
        if ([] !== $this->getKitPages()) {
            return $parentIcon;
        }

        // A group left with one page (its others disabled, as a module's) gives it its icon
        return self::KIT_TITLE_ICONS[$this->tabClassName ?? ''] ?? $parentIcon;
    }

    /**
     * The kit page title: on a sub-page, the name of their group, the same on each of them; the page's own otherwise,
     * as on an add or edit page under a sub-page
     */
    public function getKitTitle(): string
    {
        $group = $this->getKitPagesLabel();

        return null !== $group && $this->tabPage && [] !== $this->getKitPages() ? $group : $this->title;
    }

    /**
     * The sibling sub-pages for the kit's <twig:ui:PageHead>: the active ones, the current one marked
     *
     * @return list<array{label: string, href: string, current: bool}>
     */
    public function getKitPages(): array
    {
        $pages = [];
        foreach ($this->navigationTabs as $tab) {
            if ($tab->attributes['active'] ?? false) {
                $pages[] = ['label' => $tab->name, 'href' => $tab->href, 'current' => (bool) ($tab->attributes['current'] ?? false)];
            }
        }

        return count($pages) > 1 ? $pages : [];
    }

    /**
     * What the sub-pages are part of: the section of the menu the page is in, or the page's title when that section has
     * no name (a module's)
     */
    public function getKitPagesLabel(): ?string
    {
        $section = $this->breadcrumbs['container'] ?? null;
        if ($section instanceof MenuLink && '' !== trim($section->name)) {
            return $section->name;
        }

        return '' !== trim($this->title) ? $this->title : null;
    }

    /**
     * The page's documentation: a Symfony page gives the help sidebar's URL (admin_common_sidebar,
     * /common/sidebar/{url}/{title}), the documentation being its {url} encoded twice (generateSidebarLink); the kit
     * opens the documentation itself in a new tab
     */
    public function getKitHelp(): ?string
    {
        if ('' === $this->helpLink) {
            return null;
        }

        if (1 === preg_match('#/common/sidebar/([^/?]+)#', $this->helpLink, $match)) {
            return rawurldecode(rawurldecode($match[1]));
        }

        return $this->helpLink;
    }

    /**
     * The toolbar buttons (layoutHeaderToolbarBtn, then those modules add with actionGetAdminToolbarButtons) as
     * <twig:ui:PageHead> actions: every one with a kit icon, its id kept for the scripts that bind to it, its modal, data
     * attributes, classes and tooltip carried over
     *
     * @return list<array{label: string, icon: string, href: ?string, external: bool, disabled: bool, attr: array<string, string>}>
     */
    public function getKitActions(): array
    {
        $actions = [];
        foreach ($this->layoutHeaderToolbarBtn + $this->getModuleToolbarButtons() as $key => $button) {
            if (in_array($key, ['back', 'modules-list'], true) || !is_array($button) || empty($button['desc'])) {
                continue;
            }

            $attr = ['id' => 'page-header-desc-configuration-' . ($button['imgclass'] ?? $key)];
            $classes = array_filter(explode(' ', (string) ($button['class'] ?? '')), fn (string $class): bool => '' !== $class && !str_starts_with($class, 'btn'));
            if ([] !== $classes) {
                $attr['class'] = implode(' ', $classes);
            }
            if (!empty($button['modal_target'])) {
                $attr += ['data-bs-toggle' => 'modal', 'data-bs-target' => $button['modal_target'], 'data-toggle' => 'modal', 'data-target' => $button['modal_target']];
            }
            if (!empty($button['help'])) {
                $attr['title'] = (string) $button['help'];
            }
            if (!empty($button['js'])) {
                $attr['onclick'] = (string) $button['js'];
            }
            foreach ($button['data_attributes'] ?? [] as $name => $value) {
                $attr['data-' . $name] = (string) $value;
            }

            $actions[] = [
                'label' => (string) $button['desc'],
                'icon' => $this->kitIcon((string) ($button['icon'] ?? ''), (string) $key),
                'href' => isset($button['href']) ? (string) $button['href'] : null,
                'external' => !empty($button['target']),
                'disabled' => !empty($button['disabled']),
                'attr' => $attr,
            ];
        }

        return $actions;
    }

    /**
     * The buttons modules add to the toolbar, as a legacy page gets them (AdminController::initToolbarFlags): there is no
     * legacy controller on a Symfony page
     *
     * @return array<string, array<string, mixed>>
     */
    protected function getModuleToolbarButtons(): array
    {
        $collection = new ActionsBarButtonsCollection();
        try {
            $this->hookDispatcher->dispatchWithParameters('actionGetAdminToolbarButtons', [
                'controller' => null,
                'toolbar_extra_buttons_collection' => &$collection,
            ]);
        } catch (Throwable) {
            // A module that expects the legacy controller fails here: its buttons are left out, the page still renders
            return [];
        }

        $buttons = [];
        /** @var ActionsBarButtonInterface $button */
        foreach ($collection as $button) {
            $properties = $button->getProperties();
            $class = (string) ($properties['class'] ?? $button->getClass());
            $buttons[str_replace(' ', '-', $class)] = $properties + ['desc' => $button->getContent(), 'class' => $class, 'imgclass' => $class];
        }

        return $buttons;
    }

    /**
     * A toolbar button's Material Icons name as a kit icon (ui/icons/material-symbols): the outlined variants are the
     * kit's default style, renamed icons are mapped, and a name the kit does not have falls back to an arrow
     */
    private function kitIcon(string $icon, string $key): string
    {
        $name = (string) preg_replace('/_outline$/', '', $icon);
        $name = ['add_circle' => 'add', 'mode_edit' => 'edit'][$name] ?? $name;

        if ('' === $name) {
            return str_starts_with($key, 'add') || str_starts_with($key, 'new') ? 'add' : 'arrow_forward';
        }

        $file = dirname(__DIR__, 4) . '/ui/icons/material-symbols/' . str_replace('_', '-', $name) . '.svg';

        return preg_match(Icon::MATERIAL_SYMBOL, $name) && is_file($file) ? $name : 'arrow_forward';
    }

    protected function setTitle(string $layoutTitle): void
    {
        if (empty($layoutTitle) && isset($this->breadcrumbs['tab'])) {
            $this->title = $this->breadcrumbs['tab']->name;
        } else {
            $this->title = $layoutTitle;
        }
    }

    /**
     * @param MenuLink[] $breadcrumbs
     * @param list<Tab|Tab[]> $tabs
     *
     * @return void
     */
    protected function setBreadcrumbs(array $breadcrumbs, array $tabs): void
    {
        $this->breadcrumbs = $breadcrumbs;
        $this->hookDispatcher->dispatchWithParameters('actionAdminBreadcrumbModifier', ['tabs' => $tabs, 'breadcrumb' => &$this->breadcrumbs]);
    }
}
