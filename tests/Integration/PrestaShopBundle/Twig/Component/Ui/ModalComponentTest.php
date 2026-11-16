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
 * The rendered markup must match ui/src/stories/components/Modal.stories.js.
 */
class ModalComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testRendersTheDialogNamedByItsTitle(): void
    {
        $this->assertSame(
            '<div id="qa" class="modal fade ps-modal" tabindex="-1" aria-labelledby="qa-title" aria-hidden="true">'
            . '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">'
            . '<div class="modal-header"><h2 class="modal-title ps-modal__title" id="qa-title">Add</h2>'
            . '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>'
            . '<div class="modal-body"><p>Body</p></div>'
            . '</div></div></div>',
            trim($this->render('<twig:ui:Modal id="qa" title="Add"><p>Body</p></twig:ui:Modal>'))
        );
    }

    public function testRendersTheFooterBlock(): void
    {
        $html = $this->render('<twig:ui:Modal id="qa" title="Add"><p>Body</p><twig:block name="footer"><button type="button">Save</button></twig:block></twig:ui:Modal>');

        $this->assertStringContainsString('<div class="modal-body"><p>Body</p></div><div class="modal-footer"><button type="button">Save</button></div>', $html);
    }

    public function testRendersOptions(): void
    {
        $html = $this->render('<twig:ui:Modal id="qa" title="Add" size="lg" :centered="false" scrollable static headingLevel="3" data-ps-ref="quick-access"><p>Body</p></twig:ui:Modal>');

        $this->assertStringContainsString('<div id="qa" class="modal fade ps-modal" tabindex="-1" aria-labelledby="qa-title" aria-hidden="true" data-bs-backdrop="static" data-ps-ref="quick-access">', $html);
        $this->assertStringContainsString('<div class="modal-dialog modal-lg modal-dialog-scrollable">', $html);
        $this->assertStringContainsString('<h3 class="modal-title ps-modal__title" id="qa-title">Add</h3>', $html);
    }

    public function testANotClosableModalHasNoWayOut(): void
    {
        $html = $this->render('<twig:ui:Modal id="qa" title="Importing" :closable="false"><p>Body</p></twig:ui:Modal>');

        $this->assertStringContainsString('data-bs-backdrop="static" data-bs-keyboard="false"', $html);
        $this->assertStringNotContainsString('btn-close', $html);
    }

    private function render(string $template): string
    {
        return $this->twig->createTemplate($template)->render();
    }
}
