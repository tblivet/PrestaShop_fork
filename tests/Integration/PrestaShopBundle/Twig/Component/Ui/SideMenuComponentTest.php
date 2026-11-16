<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Integration\PrestaShopBundle\Twig\Component\Ui;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Twig\Environment;

/**
 * The rendered markup must match ui/src/stories/components/SideMenu.stories.js.
 */
class SideMenuComponentTest extends KernelTestCase
{
    private const SECTIONS = "[{items: [{label: 'Dashboard', href: '/dashboard', icon: 'home'}]}, {title: 'Sell', items: [{label: 'Orders', icon: 'shopping_basket', children: [{label: 'Orders', href: '/orders'}, {label: 'Invoices', href: '/invoices', current: true}]}]}]";

    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersTheNavigationDrawer(): void
    {
        $html = $this->render('<twig:ui:SideMenu :sections="' . self::SECTIONS . '"/>');

        $this->assertStringStartsWith('<nav id="ps-side-menu" class="ps-side-menu offcanvas-md offcanvas-start" tabindex="-1" aria-label="Main menu">', trim($html));
        $this->assertStringContainsString('<h2 class="ps-side-menu__heading">Sell</h2>', $html);
        $this->assertSame(1, substr_count($html, '<h2'));
    }

    public function testOpensTheSubmenuOfTheCurrentPage(): void
    {
        $html = $this->render('<twig:ui:SideMenu :sections="' . self::SECTIONS . '" id="main-menu"/>');

        $this->assertStringContainsString('data-bs-target="#main-menu-submenu-1-0" aria-controls="main-menu-submenu-1-0" aria-expanded="true"', $html);
        $this->assertStringContainsString('<div class="collapse show" id="main-menu-submenu-1-0">', $html);
        $this->assertMatchesRegularExpression('#<a class="ps-side-menu__sublink" href="/invoices" aria-current="page">\s*<span class="ps-side-menu__label">Invoices</span></a>#', $html);
    }

    public function testRendersABadgeWithTheMark(): void
    {
        $html = $this->render("<twig:ui:SideMenu :sections=\"[{items: [{label: 'Modules', href: '/modules', icon: 'extension', badge: {label: 'New', logo: true}}]}]\"/>");

        $this->assertMatchesRegularExpression('#<span class="ps-side-menu__label">Modules</span><span class="ps-side-menu__badge"><svg [^>]*class="ps-icon ps-side-menu__badge-logo" aria-hidden="true">.*</svg><span class="ps-side-menu__badge-label">New</span></span></a>#s', $html);
    }

    public function testRendersTheContentAtTheEnd(): void
    {
        $html = $this->render('<twig:ui:SideMenu :sections="[]" label="Menu"><p>Module</p></twig:ui:SideMenu>');

        $this->assertStringContainsString('aria-label="Menu"', $html);
        $this->assertMatchesRegularExpression('#<p>Module</p>\s*</div>\s*</nav>#', $html);
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render();
    }
}
