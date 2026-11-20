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
 * The rendered markup must match ui/src/stories/components/Announcer.stories.js.
 */
class AnnouncerComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersAnEmptyPoliteRegion(): void
    {
        $this->assertSame(
            '<div class="visually-hidden" role="status" aria-atomic="true" data-ps-target="announcer"></div>',
            trim($this->render('<twig:ui:Announcer/>'))
        );
    }

    public function testPassesAttributesThrough(): void
    {
        $this->assertSame(
            '<div class="visually-hidden" role="status" aria-atomic="true" data-ps-target="announcer" id="page-announcer"></div>',
            trim($this->render('<twig:ui:Announcer id="page-announcer"/>'))
        );
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render();
    }
}
