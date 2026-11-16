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
 * The rendered markup must match ui/src/stories/components/Header.stories.js and HeaderAction.stories.js.
 */
class HeaderComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersTheBarWithItsActions(): void
    {
        $html = $this->render('<twig:ui:Header homeUrl="/home" logo="/logo.svg" version="9.3.0" menuId="main-menu"><twig:ui:HeaderAction icon="storefront" label="View my store" href="/" external/></twig:ui:Header>');

        $this->assertStringStartsWith('<header class="ps-header d-print-none">', trim($html));
        $this->assertStringContainsString('data-bs-target="#main-menu" aria-controls="main-menu" aria-label="Open the menu"', $html);
        $this->assertStringContainsString('<span class="badge ps-badge ps-badge--oceanblue ps-header__version">9.3.0</span>', $html);
        $this->assertStringNotContainsString('ps-header__search', $html);
        $this->assertStringNotContainsString('ps-header__start', $html);
        $this->assertMatchesRegularExpression('#<a class="ps-header__brand" href="/home"><svg [^>]*class="ps-icon ps-icon--xl ps-header__monogram" role="img" aria-label="PrestaShop">.*</svg>\s*<img class="ps-header__logo" src="/logo.svg" alt="PrestaShop"#s', $html);
        $this->assertMatchesRegularExpression('#<div class="ps-header__actions"><a class="ps-header-action" href="/" target="_blank" rel="noopener noreferrer"><svg [^>]*class="ps-icon ps-icon--xl ps-header-action__icon"#', $html);
    }

    public function testRendersTheStartBlockAfterTheLogo(): void
    {
        $html = $this->render("<twig:ui:Header homeUrl=\"/home\" logo=\"/logo.svg\" version=\"9.3.0\"><twig:block name=\"start\"><twig:ui:HeaderAction icon=\"bookmarks\" label=\"Quick access\" align=\"start\" :items=\"[{label: 'Orders', href: '/orders'}]\"/></twig:block></twig:ui:Header>");

        $this->assertMatchesRegularExpression('#ps-header__version">9.3.0</span>\s*<div class="ps-header__start"><div class="dropdown">\s*<button type="button" class="ps-header-action"#', $html);
        $this->assertStringContainsString('<ul class="dropdown-menu ps-dropdown-menu">', $html);
    }

    public function testRendersTheSearchWithTheChosenType(): void
    {
        $html = $this->render("<twig:ui:Header homeUrl=\"/home\" logo=\"/logo.svg\" :search=\"{action: '/search', query: 'shoes', type: 3, types: [{value: 0, label: 'Everywhere', placeholder: 'What?'}, {value: 3, label: 'Orders', placeholder: 'Order ID', icon: 'shopping_basket'}]}\"/>");

        $this->assertStringContainsString('<input type="hidden" name="bo_search_type" value="3" data-ps-ref="header-search-type">', $html);
        $this->assertStringContainsString('value="shoes" class="form-control ps-header__search-input" placeholder="Order ID"', $html);
        $this->assertStringContainsString('<span data-ps-ref="header-search-scope">Orders</span>', $html);
        $this->assertStringContainsString('aria-current="true" data-ps-action="set-search-type" data-ps-value="3" data-ps-data-placeholder="Order ID"', $html);
        $this->assertMatchesRegularExpression('#data-ps-value="3"[^>]*><svg [^>]*class="ps-icon ps-icon--lg ps-dropdown-menu__icon"#', $html);
    }

    public function testRendersAMenuActionAsAButton(): void
    {
        $html = $this->render("<twig:ui:HeaderAction image=\"/avatar.jpg\" label=\"Marc Beier\" :items=\"[{label: 'Sign out', href: '/logout'}]\"/>");

        $this->assertStringContainsString('<button type="button" class="ps-header-action" data-bs-toggle="dropdown" aria-expanded="false"><img class="ps-header-action__image" src="/avatar.jpg" alt="" width="24" height="24"><span class="ps-header-action__label">Marc Beier</span>', $html);
        $this->assertStringContainsString('<ul class="dropdown-menu ps-dropdown-menu dropdown-menu-end">', $html);
    }

    public function testRendersALinkWithItsDescription(): void
    {
        $html = $this->render('<twig:ui:HeaderAction icon="bug_report" label="Debug mode" href="/performance" description="Errors are displayed."/>');

        $this->assertStringContainsString('<a class="ps-header-action" href="/performance" data-bs-toggle="tooltip" data-bs-title="Errors are displayed.">', $html);
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render();
    }
}
