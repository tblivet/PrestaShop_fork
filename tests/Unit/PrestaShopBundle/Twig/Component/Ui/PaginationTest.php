<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Pagination;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;

class PaginationTest extends TestCase
{
    #[DataProvider('provideItems')]
    public function testShowsTheEndsTheCurrentPageAndItsNeighbours(int $current, array $pages, array $items): void
    {
        $this->assertSame($items, $this->pagination($current, $pages)->getItems());
    }

    public static function provideItems(): iterable
    {
        yield 'three pages' => [2, [1, 2, 3], [1, 2, 3]];
        yield 'the first of many' => [1, [1, 2, 1000], [1, 2, null, 1000]];
        yield 'the middle of many' => [500, [1, 499, 500, 501, 1000], [1, null, 499, 500, 501, null, 1000]];
        yield 'the last of many' => [1000, [1, 999, 1000], [1, null, 999, 1000]];
        yield 'next to the first' => [2, [1, 2, 3, 25], [1, 2, 3, null, 25]];
        yield 'every page given' => [5, range(1, 9), [1, null, 4, 5, 6, null, 9]];
    }

    public function testSortsTheLinksAndKnowsTheLastPage(): void
    {
        $props = (new Pagination())->preMount(['current' => 1, 'links' => [25 => '/25', 1 => '/1', 2 => '/2'], 'label' => 'Pages']);

        $this->assertSame([1, 2, 25], array_keys($props['links']));
        $this->assertSame(25, $this->pagination(1, [25, 1, 2])->getLast());
    }

    public function testRequiresItsProps(): void
    {
        $this->expectException(MissingOptionsException::class);

        (new Pagination())->preMount(['current' => 1]);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Pagination())->preMount($data + ['current' => 1, 'links' => [1 => '/1', 2 => '/2'], 'label' => 'Pages']);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'no current link' => [['current' => 3]];
        yield 'no previous page' => [['current' => 3, 'links' => [1 => '/1', 3 => '/3', 4 => '/4', 25 => '/25']]];
        yield 'no next page' => [['current' => 3, 'links' => [1 => '/1', 2 => '/2', 3 => '/3', 25 => '/25']]];
        yield 'no first page' => [['current' => 5, 'links' => [4 => '/4', 5 => '/5', 6 => '/6', 25 => '/25']]];
        yield 'non integer page' => [['links' => [1 => '/1', 'next' => '/2']]];
        yield 'non string label' => [['label' => 3]];
        yield 'non int current' => [['current' => '1']];
        yield 'no links' => [['links' => []]];
        yield 'page 0' => [['links' => [0 => '/0', 1 => '/1']]];
        yield 'empty URL' => [['links' => [1 => '/1', 2 => '']]];
        yield 'non string URL' => [['links' => [1 => '/1', 2 => 2]]];
        yield 'blank label' => [['label' => ' ']];
    }

    private function pagination(int $current, array $pages): Pagination
    {
        $props = (new Pagination())->preMount([
            'current' => $current,
            'links' => array_combine($pages, array_map(fn (int $page): string => '/orders?page=' . $page, $pages)),
            'label' => 'Pages of the Orders list',
        ]);
        $pagination = new Pagination();
        $pagination->current = $props['current'];
        $pagination->links = $props['links'];
        $pagination->label = $props['label'];

        return $pagination;
    }
}
