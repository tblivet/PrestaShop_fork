<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Integration\PrestaShopBundle\Twig\Component\Ui;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Twig\Environment;
use Twig\Error\RuntimeError;

/**
 * The rendered markup must match ui/src/stories/components/Icon.stories.js.
 */
class IconComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersADecorativeInlineSvg(): void
    {
        $this->assertSame(
            '<svg width="1em" height="1em" fill="currentColor" viewBox="0 -960 960 960" class="ps-icon" aria-hidden="true"><path d="m274-450 248 248-42 42-320-320 320-320 42 42-248 248h526v60H274Z"></path></svg>',
            $this->render('<twig:ui:Icon name="arrow_back"/>')
        );
    }

    public function testALabelNamesTheIcon(): void
    {
        $html = $this->render('<twig:ui:Icon name="warning" filled size="lg" flipRtl label="Warning" class="text-warning"/>');

        $this->assertStringContainsString('class="ps-icon ps-icon--lg ps-icon--flip-rtl text-warning" role="img" aria-label="Warning"', $html);
        $this->assertStringNotContainsString('aria-hidden', $html);
    }

    public function testRendersABrandLogo(): void
    {
        $this->assertStringContainsString('viewBox="0 0 16 16"', $this->render('<twig:ui:Icon name="brand:github"/>'));
    }

    public function testEveryMaterialSymbolShips(): void
    {
        $this->assertStringContainsString('<svg', $this->render('<twig:ui:Icon name="local_shipping" filled/>'));
    }

    public function testAMissingIconFailsInsteadOfBeingFetched(): void
    {
        $this->expectException(RuntimeError::class);

        $this->render('<twig:ui:Icon name="not_an_icon_name"/>');
    }

    public function testAddsNoWhitespaceAroundTheIcon(): void
    {
        $this->assertMatchesRegularExpression('#^a<svg [^>]+>.*</svg>b$#', $this->render('a<twig:ui:Icon name="add"/>b'));
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render([]);
    }
}
