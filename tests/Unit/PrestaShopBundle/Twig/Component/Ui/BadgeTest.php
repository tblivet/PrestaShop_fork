<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Badge;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;

class BadgeTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(
            ['variant' => 'secondary', 'icon' => null, 'pill' => false, 'counter' => false],
            (new Badge())->preMount([])
        );
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame('ms-2', (new Badge())->preMount(['variant' => 'purple', 'class' => 'ms-2'])['class']);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Badge())->preMount($data);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'unknown variant' => [['variant' => 'neutral']];
        yield 'non string icon' => [['icon' => true]];
        yield 'non boolean pill' => [['pill' => 'yes']];
        yield 'non boolean counter' => [['counter' => 1]];
    }
}
