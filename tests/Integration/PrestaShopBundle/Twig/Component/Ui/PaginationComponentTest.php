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
 * The rendered markup must match ui/src/stories/components/Pagination.stories.js.
 */
class PaginationComponentTest extends KernelTestCase
{
    private Environment $twig;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->twig = static::getContainer()->get('twig');
    }

    public function testPreviousThePageShownAndNext(): void
    {
        $html = $this->render('<twig:ui:Pagination :current="2" :links="{1: \'/p1\', 2: \'/p2\', 3: \'/p3\'}" label="Pages of the Orders list"/>');

        $this->assertStringStartsWith('<nav class="ps-pagination" aria-label="Pages of the Orders list"><ul class="pagination">', $html);
        $this->assertStringContainsString('href="/p1" rel="prev">', $html);
        $this->assertStringContainsString('<li class="ps-pagination__item ps-pagination__item--position"><span class="ps-pagination__position" aria-current="page">Page 2 of 3</span></li>', $html);
        $this->assertStringContainsString('href="/p3" rel="next">', $html);
        $this->assertSame(3, substr_count($html, '<li '));
    }

    public function testTheArrowThatLeadsNowhereStaysDisabled(): void
    {
        $first = $this->render('<twig:ui:Pagination :current="1" :links="{1: \'/p1\', 2: \'/p2\', 1000: \'/p1000\'}" label="Pages"/>');
        $last = $this->render('<twig:ui:Pagination :current="2" :links="{1: \'/p1\', 2: \'/p2\'}" label="Pages"/>');

        $this->assertStringNotContainsString('rel="prev"', $first);
        $this->assertStringStartsWith('<nav class="ps-pagination" aria-label="Pages"><ul class="pagination"><li class="page-item disabled ps-pagination__item ps-pagination__item--step" aria-hidden="true"><span class="page-link ps-pagination__link"><svg', $first);
        $this->assertStringContainsString('Page 1 of 1000', $first);
        $this->assertStringContainsString('rel="next"', $first);
        $this->assertStringContainsString('rel="prev"', $last);
        $this->assertStringNotContainsString('rel="next"', $last);
        $this->assertSame(1, substr_count($last, 'page-item disabled'));
    }

    public function testAttributesGoOnTheNav(): void
    {
        $this->assertStringStartsWith(
            '<nav class="ps-pagination ps-grid__pagination" aria-label="Pages" id="order_grid_pagination" data-ps-ref="grid-pagination">',
            $this->render('<twig:ui:Pagination :current="1" :links="{1: \'/p1\', 2: \'/p2\'}" label="Pages" class="ps-grid__pagination" id="order_grid_pagination" data-ps-ref="grid-pagination"/>')
        );
    }

    public function testAFieldToGoToAPage(): void
    {
        $html = $this->render('<twig:ui:Pagination :current="2" :links="{1: \'/p1\', 2: \'/p2\', 3: \'/p3\', 40: \'/p40\'}" label="Pages" jumpUrl="/orders?offset={offset}&limit=50" :perPage="50"/>');

        $this->assertStringStartsWith('<nav class="ps-pagination" aria-label="Pages">', $html);
        $this->assertStringContainsString('<li class="ps-pagination__item ps-pagination__item--position"><form class="ps-pagination__jump"', $html);
        $this->assertStringNotContainsString('ps-pagination__position', $html);
        $this->assertStringContainsString('<form class="ps-pagination__jump" data-ps-action="pagination-jump" data-ps-data-url="/orders?offset={offset}&amp;limit=50" data-ps-data-last="40" data-ps-data-invalid-message="Enter a page number from 1 to 40" data-ps-data-per-page="50" novalidate>', $html);
        $this->assertStringContainsString('<label class="ps-pagination__jump-field">Page <input class="form-control form-control-sm ps-pagination__jump-input" type="text" inputmode="numeric" pattern="[0-9]*" name="page" value="2" autocomplete="off"> of 40</label>', $html);
        $this->assertStringContainsString('<button class="btn btn-outline-secondary btn-sm ps-button" type="submit"', $html);
        $this->assertStringNotContainsString('ps-pagination__jump', $this->render('<twig:ui:Pagination :current="1" :links="{1: \'/p1\', 2: \'/p2\'}" label="Pages"/>'));
    }

    public function testAFieldToGoToAPageWithoutRowsPerPage(): void
    {
        $html = $this->render('<twig:ui:Pagination :current="2" :links="{1: \'/p1\', 2: \'/p2\', 3: \'/p3\', 12: \'/p12\'}" label="Pages" jumpUrl="/orders?page={page}"/>');

        $this->assertStringContainsString('<form class="ps-pagination__jump" data-ps-action="pagination-jump" data-ps-data-url="/orders?page={page}" data-ps-data-last="12" data-ps-data-invalid-message="Enter a page number from 1 to 12" novalidate>', $html);
        $this->assertStringNotContainsString('data-ps-data-per-page', $html);
    }

    public function testNothingForASinglePage(): void
    {
        $this->assertSame('', $this->render('<twig:ui:Pagination :current="1" :links="{1: \'/p1\'}" label="Pages"/>'));
    }

    private function render(string $template): string
    {
        return preg_replace('/>\s+</', '><', trim($this->twig->createTemplate($template)->render()));
    }
}
