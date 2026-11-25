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
 * The rendered markup must match ui/src/stories/components/ConfirmDialog.stories.js.
 */
class ConfirmDialogComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testAnEmptyDialogNamedAndDescribedForScreenReaders(): void
    {
        $html = $this->render('<twig:ui:ConfirmDialog/>');

        $this->assertStringStartsWith('<div id="ps-confirm-dialog" class="modal fade ps-modal ps-confirm-dialog" tabindex="-1" aria-labelledby="ps-confirm-dialog-title" aria-hidden="true" data-ps-ref="confirm-dialog" aria-describedby="ps-confirm-dialog-message">', $html);
        $this->assertStringContainsString('<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">', $html);
        $this->assertStringContainsString('<p class="modal-title ps-modal__title" id="ps-confirm-dialog-title" data-ps-ref="modal-title">Are you sure?</p>', $html);
        $this->assertStringContainsString('<p class="ps-confirm-dialog__message" id="ps-confirm-dialog-message" data-ps-target="confirm-message"></p>', $html);
    }

    public function testCancelThenTheAction(): void
    {
        $html = $this->render('<twig:ui:ConfirmDialog/>');

        $this->assertMatchesRegularExpression('#<div class="modal-footer"><button class="btn btn-link ps-button" type="button"[^>]*data-bs-dismiss="modal" data-ps-ref="confirm-cancel">Cancel</button><button class="btn btn-primary ps-button" type="button"[^>]*data-ps-ref="confirm-accept">Confirm</button></div>#', $html);
    }

    public function testAnotherId(): void
    {
        $html = $this->render('<twig:ui:ConfirmDialog id="product-confirm"/>');

        $this->assertStringContainsString('id="product-confirm-message"', $html);
        $this->assertStringContainsString('aria-describedby="product-confirm-message"', $html);
    }

    public function testAttributesGoOnTheDialogAndCanDescribeItOtherwise(): void
    {
        $html = $this->render('<twig:ui:ConfirmDialog class="page-confirm" data-ps-data-page="orders" aria-describedby="orders-help"/>');

        $this->assertStringStartsWith('<div id="ps-confirm-dialog" class="modal fade ps-modal ps-confirm-dialog page-confirm" tabindex="-1" aria-labelledby="ps-confirm-dialog-title" aria-hidden="true" data-ps-ref="confirm-dialog" aria-describedby="orders-help" data-ps-data-page="orders">', $html);
    }

    private function render(string $template): string
    {
        return preg_replace('/>\s+</', '><', trim($this->twig->createTemplate($template)->render()));
    }
}
