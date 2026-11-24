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
 * The rendered markup must match ui/src/stories/components/PageHead.stories.js.
 */
class PageHeadComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersATitleOnly(): void
    {
        $html = $this->render('<twig:ui:PageHead title="Maintenance"/>');

        $this->assertMatchesRegularExpression('#^<header class="ps-page-head">\s*<h1 class="ps-page-head__title">Maintenance</h1>\s*</header>$#', trim($html));
    }

    public function testRendersTheIconBeforeTheTitle(): void
    {
        $this->assertMatchesRegularExpression('#<h1 class="ps-page-head__title"><svg [^>]*class="ps-icon ps-page-head__icon" aria-hidden="true">.*</svg>Products</h1>#s', $this->render('<twig:ui:PageHead title="Products" icon="inventory_2"/>'));
    }

    public function testRendersTheSubPagesBeforeTheActions(): void
    {
        $html = $this->render('<twig:ui:PageHead title="Attributes" :pages="[{label: \'Attributes\', href: \'/a\', current: true}, {label: \'Features\', href: \'/f\'}]" pagesLabel="Attributes and Features" :actions="[{label: \'Add new attribute\', icon: \'add\', href: \'/new\'}]"/>');

        $this->assertStringContainsString('<header class="ps-page-head ps-page-head--with-pages">', $html);
        $this->assertStringContainsString('<nav class="ps-page-head__pages ps-scroll-fade ps-scroll-fade--x" data-ps-action="scroll-fade" aria-label="Attributes and Features">', $html);
        $this->assertStringContainsString('<a class="nav-link active" href="/a" aria-current="page">Attributes</a>', $html);
        $this->assertStringContainsString('<a class="nav-link" href="/f">Features</a>', $html);
        $this->assertLessThan(strpos($html, 'ps-page-head__actions'), strpos($html, 'ps-page-head__pages'));
    }

    public function testTheFirstActionIsTheMainOneAndEveryActionIsInTheMenu(): void
    {
        $html = $this->render('<twig:ui:PageHead title="Attributes" :actions="[{label: \'Add new attribute\', icon: \'add\', href: \'/new\'}, {label: \'Add new value\', icon: \'add\', href: \'/value\', attr: {id: \'add-value\'}}]" help="https://docs.example"/>');

        $this->assertMatchesRegularExpression('#<span class="ps-page-head__main-action">\s*<a class="btn btn-primary btn-sm ps-button" href="/new"><svg [^>]*>.*?</svg><span class="ps-button__label">Add new attribute</span></a>\s*</span>#s', $html);
        $this->assertMatchesRegularExpression('#<span class="ps-page-head__extra">\s*<a class="btn btn-secondary btn-sm ps-button" href="/value" id="add-value">#', $html);
        $this->assertMatchesRegularExpression('#<a class="btn btn-secondary btn-sm ps-button ps-icon-button" href="https://docs.example" aria-label="Help" data-bs-toggle="tooltip" data-bs-title="Help" data-bs-placement="bottom" target="_blank" rel="noopener noreferrer">#', $html);
        $this->assertStringContainsString('<div class="dropdown ps-page-head__more">', $html);
        $this->assertSame(3, substr_count($html, 'dropdown-item ps-dropdown-menu__item'));
        $this->assertSame(1, substr_count($html, 'id="add-value"'));
    }

    public function testADividerPartsHelpOnlyFromActions(): void
    {
        $this->assertStringContainsString('dropdown-divider', $this->render('<twig:ui:PageHead title="Attributes" :actions="[{label: \'Add\', icon: \'add\', href: \'/new\'}]" help="https://docs.example"/>'));
        $this->assertStringNotContainsString('dropdown-divider', $this->render('<twig:ui:PageHead title="Maintenance" help="https://docs.example"/>'));
    }

    public function testAnExternalActionSaysItOpensANewTab(): void
    {
        $html = $this->render('<twig:ui:PageHead title="Modules" :actions="[{label: \'Marketplace\', icon: \'open_in_new\', href: \'https://addons.example\', external: true}]"/>');

        $this->assertStringContainsString('target="_blank" rel="noopener noreferrer"', $html);
        $this->assertStringContainsString('<span class="ps-button__label">Marketplace<span class="visually-hidden"> (opens in a new tab)</span></span>', $html);
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render();
    }
}
