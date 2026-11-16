<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component;

use PrestaShop\PrestaShop\Core\Action\ActionsBarButtonInterface;
use PrestaShop\PrestaShop\Core\Action\ActionsBarButtonsCollection;
use PrestaShop\PrestaShop\Core\Context\Employee;
use PrestaShop\PrestaShop\Core\Context\EmployeeContext;
use PrestaShop\PrestaShop\Core\Hook\HookDispatcherInterface;
use PrestaShopBundle\Twig\Component\Ui\Icon;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\UX\Icons\Exception\IconNotFoundException;
use Symfony\UX\Icons\IconRegistryInterface;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

/**
 * Feeds <twig:ui:Header> on kit pages (PS_UI_KIT=1): the search the page was opened with, the employee and the links
 * modules add to the employee menu.
 */
#[AsTwigComponent(template: '@PrestaShop/Admin/Component/Layout/Ui/header.html.twig')]
class Header
{
    public function __construct(
        protected readonly HookDispatcherInterface $hookDispatcher,
        protected readonly EmployeeContext $employeeContext,
        protected readonly RequestStack $requestStack,
        #[Autowire(service: '.ux_icons.icon_registry')]
        protected readonly IconRegistryInterface $icons,
    ) {
    }

    public function getSearchQuery(): string
    {
        return (string) $this->requestStack->getCurrentRequest()?->query->get('bo_query', '');
    }

    public function getSearchType(): int
    {
        return (int) $this->requestStack->getCurrentRequest()?->query->get('bo_search_type', 0);
    }

    public function getEmployee(): ?Employee
    {
        return $this->employeeContext->getEmployee();
    }

    /**
     * Links of displayBackOfficeEmployeeMenu as <twig:ui:DropdownMenu> items; an icon with no SVG file is left out.
     *
     * @return list<array{label: string, href: string, icon: ?string, external: bool}>
     */
    public function getEmployeeLinks(): array
    {
        $links = new ActionsBarButtonsCollection();
        $this->hookDispatcher->dispatchWithParameters('displayBackOfficeEmployeeMenu', ['links' => $links]);

        $items = [];
        foreach ($links as $link) {
            if (!$link instanceof ActionsBarButtonInterface || '' === trim($link->getContent()) || empty($link->getProperties()['link'])) {
                continue;
            }
            $properties = $link->getProperties();
            $items[] = [
                'label' => $link->getContent(),
                'href' => (string) $properties['link'],
                'icon' => $this->existingIcon($properties['icon'] ?? null),
                'external' => (bool) ($properties['isExternalLink'] ?? false),
            ];
        }

        return $items;
    }

    private function existingIcon(mixed $icon): ?string
    {
        if (!is_string($icon) || !preg_match(Icon::MATERIAL_SYMBOL, $icon)) {
            return null;
        }

        try {
            $this->icons->get('material-symbols:' . str_replace('_', '-', $icon));
        } catch (IconNotFoundException) {
            return null;
        }

        return $icon;
    }
}
