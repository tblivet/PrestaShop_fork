<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\PageHead;
use Symfony\Component\OptionsResolver\Exception\ExceptionInterface;

class PageHeadTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(
            ['title' => 'Products', 'icon' => null, 'pages' => [], 'pagesLabel' => null, 'actions' => [], 'help' => null],
            (new PageHead())->preMount(['title' => 'Products'])
        );
    }

    public function testCompletesPagesAndActions(): void
    {
        $data = (new PageHead())->preMount([
            'title' => 'Attributes',
            'pages' => [['label' => 'Attributes', 'href' => '/a', 'current' => true], ['label' => 'Features', 'href' => '/f']],
            'pagesLabel' => 'Attributes & Features',
            'actions' => [['label' => 'Add new attribute', 'icon' => 'add', 'href' => '/new']],
        ]);

        $this->assertFalse($data['pages'][1]['current']);
        $this->assertEquals(['label' => 'Add new attribute', 'icon' => 'add', 'href' => '/new', 'external' => false, 'disabled' => false, 'attr' => []], $data['actions'][0]);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(ExceptionInterface::class);

        (new PageHead())->preMount($data + ['title' => 'Attributes']);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'empty title' => [['title' => ' ']];
        yield 'sub-pages without their label' => [['pages' => [['label' => 'Attributes', 'href' => '/a']]]];
        yield 'sub-page without href' => [['pages' => [['label' => 'Attributes']], 'pagesLabel' => 'Attributes & Features']];
        yield 'sub-page not an array' => [['pages' => ['Attributes'], 'pagesLabel' => 'Attributes & Features']];
        yield 'action without icon' => [['actions' => [['label' => 'Add new attribute', 'href' => '/new']]]];
        yield 'action with an unknown icon name' => [['actions' => [['label' => 'Add', 'icon' => 'Add Circle']]]];
        yield 'action without label' => [['actions' => [['label' => ' ', 'icon' => 'add']]]];
        yield 'action not an array' => [['actions' => ['Add']]];
        yield 'non string help' => [['help' => 42]];
        yield 'two current sub-pages' => [['pages' => [['label' => 'Attributes', 'href' => '/a', 'current' => true], ['label' => 'Features', 'href' => '/f', 'current' => true]], 'pagesLabel' => 'Attributes & Features']];
        yield 'non string icon' => [['icon' => 42]];
        yield 'non boolean disabled action' => [['actions' => [['label' => 'Add', 'icon' => 'add', 'disabled' => 'yes']]]];
        yield 'non array action attributes' => [['actions' => [['label' => 'Add', 'icon' => 'add', 'attr' => 'id=add']]]];
    }
}
