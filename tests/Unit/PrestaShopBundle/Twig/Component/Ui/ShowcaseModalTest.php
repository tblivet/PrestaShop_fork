<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\ShowcaseModal;
use Symfony\Component\OptionsResolver\Exception\ExceptionInterface;

class ShowcaseModalTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(
            ['name' => 'attributes_card', 'title' => 'Create attributes', 'image' => '/a.svg', 'learnMore' => null],
            (new ShowcaseModal())->preMount(['name' => 'attributes_card', 'title' => 'Create attributes', 'image' => '/a.svg'])
        );
    }

    public function testItsIdComesFromItsName(): void
    {
        $modal = new ShowcaseModal();
        $modal->name = 'seo-urls_card';

        $this->assertSame('ps-showcase-seo-urls-card', $modal->getId());
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(ExceptionInterface::class);

        (new ShowcaseModal())->preMount($data + ['name' => 'attributes_card', 'title' => 'Create attributes', 'image' => '/a.svg']);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'unknown card' => [['name' => 'products_card']];
        yield 'non string title' => [['title' => 42]];
        yield 'non string image' => [['image' => null]];
        yield 'non string learn more' => [['learnMore' => 42]];
    }
}
