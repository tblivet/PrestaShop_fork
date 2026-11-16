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
 * The rendered markup must match ui/src/stories/components/Badge.stories.js.
 */
class BadgeComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersTheDefaultBadge(): void
    {
        $this->assertSame('<span class="badge ps-badge ps-badge--secondary">Disabled</span>', trim($this->render('<twig:ui:Badge>Disabled</twig:ui:Badge>')));
    }

    public function testRendersModifiersAndAttributes(): void
    {
        $this->assertSame(
            '<span class="badge ps-badge ps-badge--danger ps-badge--pill ps-badge--counter ms-2" id="count">3</span>',
            trim($this->render('<twig:ui:Badge variant="danger" pill counter class="ms-2" id="count">3</twig:ui:Badge>'))
        );
    }

    public function testRendersAKitPaletteVariant(): void
    {
        $this->assertSame('<span class="badge ps-badge ps-badge--amber">Beta</span>', trim($this->render('<twig:ui:Badge variant="amber">Beta</twig:ui:Badge>')));
    }

    public function testRendersTheIconBeforeTheText(): void
    {
        $html = $this->render('<twig:ui:Badge variant="success" icon="check">Paid</twig:ui:Badge>');

        $this->assertMatchesRegularExpression('#^<span class="badge ps-badge ps-badge--success"><svg [^>]*class="ps-icon ps-badge__icon" aria-hidden="true">.*</svg>Paid</span>$#s', trim($html));
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render();
    }
}
