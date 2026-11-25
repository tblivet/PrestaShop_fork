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
 * The rendered markup must match ui/src/stories/components/EmptyState.stories.js.
 */
class EmptyStateComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testATitleAlone(): void
    {
        $this->assertSame(
            '<div class="ps-empty-state"><h2 class="ps-empty-state__title">No files attached</h2></div>',
            $this->render('<twig:ui:EmptyState title="No files attached"/>')
        );
    }

    public function testTheMessageAndTheActionsInACentredRow(): void
    {
        $html = $this->render('<twig:ui:EmptyState title="No orders" size="sm" headingLevel="3">Orders show here.<twig:block name="actions"><twig:ui:Button href="/new">Add new order</twig:ui:Button></twig:block></twig:ui:EmptyState>');

        $this->assertStringStartsWith('<div class="ps-empty-state ps-empty-state--sm"><h3 class="ps-empty-state__title">No orders</h3>', $html);
        $this->assertStringContainsString('<div class="ps-empty-state__message">Orders show here.</div>', $html);
        $this->assertStringContainsString('<div class="ps-cluster ps-cluster--justify-center"><a class="btn btn-primary ps-button" href="/new">Add new order</a></div>', $html);
    }

    public function testTheIconIsDecorativeAndSizedToTheState(): void
    {
        $this->assertStringContainsString('class="ps-icon ps-icon--xxl ps-empty-state__icon" aria-hidden="true"', $this->render('<twig:ui:EmptyState title="No orders" icon="inbox"/>'));
        $this->assertStringContainsString('class="ps-icon ps-icon--lg ps-empty-state__icon" aria-hidden="true"', $this->render('<twig:ui:EmptyState title="No match" icon="search_off" size="sm"/>'));
    }

    public function testAttributesGoOnTheRoot(): void
    {
        $this->assertStringStartsWith(
            '<div class="ps-empty-state ps-grid__empty" id="credit-slip-empty" data-ps-ref="grid-empty">',
            $this->render('<twig:ui:EmptyState title="No credit slips" class="ps-grid__empty" id="credit-slip-empty" data-ps-ref="grid-empty"/>')
        );
    }

    public function testAMessageOfOnlySpacesIsNoMessage(): void
    {
        $this->assertSame(
            '<div class="ps-empty-state"><h2 class="ps-empty-state__title">No orders</h2></div>',
            $this->render('<twig:ui:EmptyState title="No orders">   </twig:ui:EmptyState>')
        );
    }

    private function render(string $template): string
    {
        return preg_replace('/>\s+</', '><', trim($this->twig->createTemplate($template)->render()));
    }
}
