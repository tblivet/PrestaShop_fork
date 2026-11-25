<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\EmptyState;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;

class EmptyStateTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(
            ['title' => 'No orders', 'icon' => null, 'size' => 'md', 'headingLevel' => 2],
            (new EmptyState())->preMount(['title' => 'No orders'])
        );
    }

    public function testTakesTheHeadingLevelAsTwigWritesIt(): void
    {
        $this->assertSame(3, (new EmptyState())->preMount(['title' => 'No orders', 'headingLevel' => '3'])['headingLevel']);
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame('order-empty', (new EmptyState())->preMount(['title' => 'No orders', 'id' => 'order-empty'])['id']);
    }

    public function testRequiresATitle(): void
    {
        $this->expectException(MissingOptionsException::class);

        (new EmptyState())->preMount([]);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new EmptyState())->preMount($data + ['title' => 'No orders']);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'blank title' => [['title' => ' ']];
        yield 'non string icon' => [['icon' => true]];
        yield 'unknown size' => [['size' => 'lg']];
        yield 'heading level 1' => [['headingLevel' => 1]];
        yield 'heading level 7' => [['headingLevel' => '7']];
        yield 'non numeric heading level' => [['headingLevel' => 'h3']];
    }
}
