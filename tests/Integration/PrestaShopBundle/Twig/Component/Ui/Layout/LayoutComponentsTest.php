<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Integration\PrestaShopBundle\Twig\Component\Ui\Layout;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Twig\Environment;

/**
 * The rendered markup must match ui/src/stories/layouts/*.stories.js (classes from layout-classes.js).
 */
class LayoutComponentsTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testStack(): void
    {
        $html = $this->render('<twig:ui:Layout:Stack gap="lg" class="ps-page__content" data-ps-target="blocks"><p>One</p><p>Two</p></twig:ui:Layout:Stack>');

        $this->assertStringContainsString('<div class="ps-stack ps-stack--gap-lg ps-page__content" data-ps-target="blocks"><p>One</p><p>Two</p></div>', $html);
    }

    public function testStackAsList(): void
    {
        $html = $this->render('<twig:ui:Layout:Stack as="ul" gap="sm"><li>One</li></twig:ui:Layout:Stack>');

        $this->assertStringContainsString('<ul class="ps-stack ps-stack--gap-sm ps-stack--list"><li>One</li></ul>', $html);
    }

    public function testNestedClusters(): void
    {
        $html = $this->render(
            '<twig:ui:Layout:Cluster justify="between" stackBelow="sm">'
            . '<twig:ui:Layout:Cluster><button>Delete</button></twig:ui:Layout:Cluster>'
            . '<twig:ui:Layout:Cluster><button>Cancel</button><button>Save</button></twig:ui:Layout:Cluster>'
            . '</twig:ui:Layout:Cluster>'
        );

        $this->assertStringContainsString(
            '<div class="ps-cluster ps-cluster--justify-between ps-cluster--stack-below-sm">'
            . '<div class="ps-cluster"><button>Delete</button></div>'
            . '<div class="ps-cluster"><button>Cancel</button><button>Save</button></div>'
            . '</div>',
            $html
        );
    }

    public function testClusterWithoutWrap(): void
    {
        $html = $this->render('<twig:ui:Layout:Cluster :wrap="false" gap="xs" align="baseline">x</twig:ui:Layout:Cluster>');

        $this->assertStringContainsString('<div class="ps-cluster ps-cluster--gap-xs ps-cluster--align-baseline ps-cluster--nowrap">x</div>', $html);
    }

    public function testTiles(): void
    {
        $html = $this->render('<twig:ui:Layout:Tiles columns="4" as="ul" aria-label="Key figures"><li>KPI</li></twig:ui:Layout:Tiles>');

        $this->assertStringContainsString('<ul class="ps-tiles ps-tiles--4 ps-tiles--list" aria-label="Key figures"><li>KPI</li></ul>', $html);
    }

    private function render(string $template, array $context = []): string
    {
        // Whitespace between tags (the templates' final newline) does not matter in a flex or grid container
        return preg_replace('/>\s+</', '><', $this->twig->createTemplate($template)->render($context));
    }
}
