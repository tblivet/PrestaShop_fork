<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui\Layout;

use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Layout\Stack;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;

class StackTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertSame(['gap' => 'md', 'align' => 'stretch', 'as' => 'div'], (new Stack())->preMount([]));
        $this->assertSame('ps-stack d-flex flex-column gap-3 align-items-stretch', (new Stack())->getClasses());
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame(
            ['gap' => 'xl', 'align' => 'start', 'as' => 'section', 'class' => 'ps-page__content'],
            (new Stack())->preMount(['gap' => 'xl', 'align' => 'start', 'as' => 'section', 'class' => 'ps-page__content'])
        );
    }

    public function testListDropsBulletsAndMargin(): void
    {
        $stack = new Stack();
        $stack->gap = 'none';
        $stack->as = 'ul';

        $this->assertSame('ps-stack d-flex flex-column gap-0 align-items-stretch list-unstyled mb-0', $stack->getClasses());
    }

    /**
     * @dataProvider invalidOptions
     */
    public function testRejectsValuesOutsideTheScales(array $options): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Stack())->preMount($options);
    }

    public static function invalidOptions(): iterable
    {
        yield 'gap' => [['gap' => '3']];
        yield 'align' => [['align' => 'baseline']];
        yield 'element' => [['as' => 'main']];
    }
}
