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
use Symfony\UX\Icons\Exception\IconNotFoundException;
use Symfony\UX\Icons\IconRegistryInterface;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

/**
 * The employee's menu at the end of the header: the avatar and name, the profile, the links modules add
 * (displayBackOfficeEmployeeMenu), sign out. With PS_UI_KIT=1 its template renders the kit markup.
 */
#[AsTwigComponent(template: '@PrestaShop/Admin/Component/Layout/employee_dropdown.html.twig')]
class EmployeeDropdown
{
    public ?ActionsBarButtonsCollection $displayBackOfficeEmployeeMenu = null;

    public function __construct(
        protected readonly HookDispatcherInterface $hookDispatcher,
        protected readonly EmployeeContext $employeeContext,
        #[Autowire(service: '.ux_icons.icon_registry')]
        protected readonly IconRegistryInterface $icons,
    ) {
    }

    public function getEmployee(): ?Employee
    {
        return $this->employeeContext->getEmployee();
    }

    public function getDisplayBackOfficeEmployeeMenu()
    {
        if ($this->displayBackOfficeEmployeeMenu === null) {
            $menuLinksCollections = new ActionsBarButtonsCollection();

            $this->hookDispatcher->dispatchWithParameters(
                'displayBackOfficeEmployeeMenu',
                [
                    'links' => $menuLinksCollections,
                ]
            );

            $this->displayBackOfficeEmployeeMenu = $menuLinksCollections;
        }

        return $this->displayBackOfficeEmployeeMenu;
    }

    /**
     * The modules' links as <twig:ui:DropdownMenu> items; an icon with no SVG file is left out.
     *
     * @return list<array{label: string, href: string, icon: ?string, external: bool}>
     */
    public function getModuleItems(): array
    {
        $items = [];
        foreach ($this->getDisplayBackOfficeEmployeeMenu() as $link) {
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
