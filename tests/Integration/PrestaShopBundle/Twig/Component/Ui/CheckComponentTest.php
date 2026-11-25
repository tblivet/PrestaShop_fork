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
 * The rendered markup must match ui/src/stories/forms/Check.stories.js.
 */
class CheckComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersACheckboxWithItsLabel(): void
    {
        $this->assertSame(
            '<div class="form-check ps-check"><input class="form-check-input ps-check__input" type="checkbox" id="newsletter" name="newsletter" value="1" checked><label class="form-check-label ps-check__label" for="newsletter">Send me the newsletter</label></div>',
            $this->render('<twig:ui:Check label="Send me the newsletter" name="newsletter" value="1" id="newsletter" checked/>')
        );
    }

    public function testASwitchHasTheSwitchRole(): void
    {
        $html = $this->render('<twig:ui:Check type="switch" label="Enabled" id="enabled" disabled/>');

        $this->assertStringContainsString('<div class="form-check ps-check form-switch">', $html);
        $this->assertStringContainsString('type="checkbox" id="enabled" role="switch" disabled>', $html);
    }

    public function testAHiddenLabelStillNamesTheBox(): void
    {
        $html = $this->render('<twig:ui:Check label="Select order #1024" hideLabel id="order-1024"/>');

        $this->assertStringContainsString('<div class="form-check ps-check ps-check--label-hidden">', $html);
        $this->assertStringContainsString('<label class="form-check-label ps-check__label" for="order-1024"><span class="visually-hidden">Select order #1024</span></label>', $html);
    }

    public function testAttributesGoOnTheInput(): void
    {
        $this->assertStringContainsString(
            '<input class="form-check-input ps-check__input ps-grid__check" type="checkbox" id="row-1" form="order_grid" data-ps-ref="row-check">',
            $this->render('<twig:ui:Check label="Select order #1" id="row-1" class="ps-grid__check" form="order_grid" data-ps-ref="row-check"/>')
        );
    }

    public function testTheLabelPointsAtTheGeneratedId(): void
    {
        $html = $this->render('<twig:ui:Check label="Newsletter"/>');

        $this->assertMatchesRegularExpression('#id="(ps-check-\d+)"><label class="form-check-label ps-check__label" for="\1">#', $html);
    }

    private function render(string $template): string
    {
        return preg_replace('/>\s+</', '><', trim($this->twig->createTemplate($template)->render()));
    }
}
