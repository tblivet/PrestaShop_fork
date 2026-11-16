<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component;

use PrestaShop\PrestaShop\Adapter\LegacyContext;
use PrestaShopBundle\Twig\Layout\MenuBuilder;
use Psr\Log\LoggerInterface;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Tab;

#[AsTwigComponent(template: '@PrestaShop/Admin/Component/Layout/nav_bar.html.twig')]
class NavBar
{
    /**
     * The kit menu icons of the core tabs, by class name: clearer than the ones stored with the tabs, which the old theme
     * keeps. Module tabs keep their own icon.
     */
    private const KIT_ICONS = [
        'AdminDashboard' => 'home',
        'AdminParentCustomer' => 'group',
        'AdminParentCustomerThreads' => 'support_agent',
        'AdminStats' => 'monitoring',
        'AdminParentThemes' => 'palette',
        'AdminParentPayment' => 'payments',
        'AdminInternational' => 'public',
        'AdminAdvancedParameters' => 'tune',
    ];

    protected ?array $tabs = null;

    public function __construct(
        protected readonly LegacyContext $context,
        protected readonly LoggerInterface $logger,
        protected readonly MenuBuilder $menuBuilder,
        protected readonly string $psVersion,
    ) {
    }

    public function getDefaultTab(): string
    {
        $className = Tab::getClassNameById((int) $this->context->getContext()->employee->default_tab);

        if (!$className) {
            $className = 'AdminDashboard';
        }

        return $className;
    }

    public function getPsVersion(): string
    {
        return $this->psVersion;
    }

    public function getTabs(): array
    {
        if (null === $this->tabs) {
            $this->tabs = $this->buildTabs();
        }

        return $this->tabs;
    }

    /**
     * The tabs as <twig:ui:SideMenu> sections: a top tab with an icon is an item, one without is a section title.
     */
    public function getSections(): array
    {
        $sections = [];
        foreach ($this->getTabs() as $level1) {
            if (!$level1['active']) {
                continue;
            }

            if (!empty($level1['icon'])) {
                // Consecutive top items (Dashboard) share one section without a title
                if ([] === $sections || null !== $sections[array_key_last($sections)]['title']) {
                    $sections[] = ['title' => null, 'items' => []];
                }
                $sections[array_key_last($sections)]['items'][] = $this->toMenuLink($level1) + ['icon' => $this->getKitIcon($level1)];

                continue;
            }

            $items = [];
            foreach ($level1['sub_tabs'] as $level2) {
                if (!$level2['active']) {
                    continue;
                }

                $children = array_values(array_map(
                    fn (array $level3): array => $this->toMenuLink($level3),
                    array_filter($level2['sub_tabs'], fn (array $level3): bool => (bool) $level3['active'])
                ));
                $items[] = [] === $children
                    ? $this->toMenuLink($level2) + ['icon' => $this->getKitIcon($level2)]
                    : ['label' => $this->getTabName($level2), 'icon' => $this->getKitIcon($level2), 'children' => $children];
            }
            $sections[] = ['title' => $this->getTabName($level1), 'items' => $items];
        }

        return $sections;
    }

    protected function buildTabs($parentId = 0, $level = 0): array
    {
        $tabs = Tab::getTabs($this->context->getContext()->language->id, $parentId);
        $currentId = (int) Tab::getCurrentParentId();

        if ($currentId === -1) {
            $currentId = $this->menuBuilder->getCurrentTab()?->getId() ?: $this->menuBuilder->getParentTab()?->getId() ?: -1;
        }

        $controllerName = $this->menuBuilder->getLegacyControllerClassName();

        $filteredTabs = array_filter($tabs, function ($tab) {
            return $this->isValidTab($tab);
        });

        $processedTabs = array_map(function ($tab) use ($currentId, $level, $controllerName) {
            return $this->processTab($tab, $currentId, $level, $controllerName);
        }, $filteredTabs);

        return array_values(array_filter($processedTabs));
    }

    protected function isValidTab(array $tab): bool
    {
        return Tab::checkTabRights($tab['id_tab'])
            && $tab['enabled']
            && $tab['class_name'] !== 'AdminCarrierWizard';
    }

    protected function processTab(array $tab, int $currentId, int $level, ?string $controllerName): array
    {
        $isCurrentTab = ($currentId === $tab['id_tab']) || ($tab['class_name'] === $controllerName);

        $tab['current'] = $isCurrentTab;
        if ($isCurrentTab) {
            $tab['current_level'] = $level;
        }
        $tab['img'] = null;

        try {
            $tab['href'] = $this->context->getContext()->link->getTabLink($tab);
        } catch (RouteNotFoundException $e) {
            $this->logger->warning(
                sprintf('Route not found in one of the Tab %s', $tab['route_name'] ?? ''),
                [
                    'message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ]
            );
            $tab['href'] = '';
        }

        $tab['sub_tabs'] = array_values($this->buildTabs($tab['id_tab'], $level + 1));

        $subTabHref = $this->getTabLinkFromSubTabs($tab['sub_tabs']);

        if (!empty($subTabHref)) {
            $tab['href'] = $subTabHref;
        } elseif ($tab['id_parent'] === 0 && empty($tab['icon'])) {
            return [];
        } elseif (empty($tab['icon'])) {
            $tab['icon'] = 'extension';
        }

        foreach ($tab['sub_tabs'] as $subTab) {
            if ($subTab['current']) {
                $tab['current'] = true;
                $tab['current_level'] = $subTab['current_level'];
                break;
            }
        }

        return $tab;
    }

    protected function getTabLinkFromSubTabs(array $subtabs)
    {
        foreach ($subtabs as $tab) {
            if ($tab['active'] && $tab['enabled']) {
                return $tab['href'];
            }
        }

        return '';
    }

    private function getKitIcon(array $tab): string
    {
        return self::KIT_ICONS[$tab['class_name']] ?? (string) $tab['icon'];
    }

    private function getTabName(array $tab): string
    {
        return '' === $tab['name'] ? $tab['class_name'] : $tab['name'];
    }

    /**
     * @return array{label: string, href: string, current: bool}
     */
    private function toMenuLink(array $tab): array
    {
        return ['label' => $this->getTabName($tab), 'href' => (string) $tab['href'], 'current' => (bool) $tab['current']];
    }
}
