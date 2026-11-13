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
 * The rendered markup must match ui/src/stories/components/Link.stories.js.
 */
class LinkComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersPlainLink(): void
    {
        $this->assertSame('<a href="/orders" class="link-secondary">Orders</a>', trim($this->render('<twig:ui:Link href="/orders" class="link-secondary">Orders</twig:ui:Link>')));
    }

    public function testRendersBackLink(): void
    {
        $html = $this->render('<twig:ui:Link href="/orders" back>Back to orders</twig:ui:Link>');

        $this->assertMatchesRegularExpression('#^<a href="/orders" class="icon-link icon-link-hover icon-link-hover-start"><svg [^>]*class="ps-icon ps-icon--lg ps-icon--flip-rtl" aria-hidden="true">.*</svg>Back to orders</a>$#s', trim($html));
    }

    public function testRendersIconAfterTheText(): void
    {
        $html = $this->render('<twig:ui:Link href="/orders" icon="arrow_forward" iconPosition="end">All orders</twig:ui:Link>');

        $this->assertMatchesRegularExpression('#^<a href="/orders" class="icon-link icon-link-hover">All orders<svg [^>]*class="ps-icon ps-icon--lg" aria-hidden="true">#', trim($html));
    }

    public function testRendersExternalLink(): void
    {
        $this->assertSame(
            '<a href="https://docs.prestashop-project.org" target="_blank" rel="noopener noreferrer">Docs<span class="visually-hidden"> (opens in a new tab)</span></a>',
            trim($this->render('<twig:ui:Link href="https://docs.prestashop-project.org" external>Docs</twig:ui:Link>'))
        );
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render();
    }
}
