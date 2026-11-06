<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui\Layout;

use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Layout\Cluster;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;

class ClusterTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertSame(
            ['gap' => 'sm', 'justify' => 'start', 'align' => 'center', 'wrap' => true, 'stackBelow' => 'none', 'as' => 'div'],
            (new Cluster())->preMount([])
        );
        $this->assertSame('ps-cluster d-flex gap-2 flex-wrap justify-content-start align-items-center', (new Cluster())->getClasses());
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame('ps-modal__footer', (new Cluster())->preMount(['class' => 'ps-modal__footer'])['class']);
    }

    public function testNoWrap(): void
    {
        $cluster = new Cluster();
        $cluster->wrap = false;
        $cluster->justify = 'between';

        $this->assertSame('ps-cluster d-flex gap-2 flex-nowrap justify-content-between align-items-center', $cluster->getClasses());
    }

    public function testStacksBelowBreakpointInReadingOrder(): void
    {
        $cluster = new Cluster();
        $cluster->justify = 'end';
        $cluster->stackBelow = 'sm';

        $this->assertSame(
            'ps-cluster d-flex gap-2 flex-column flex-sm-row flex-sm-wrap justify-content-sm-end align-items-sm-center',
            $cluster->getClasses()
        );
    }

    public function testList(): void
    {
        $cluster = new Cluster();
        $cluster->as = 'ol';

        $this->assertStringEndsWith(' list-unstyled mb-0', $cluster->getClasses());
    }

    /**
     * @dataProvider invalidOptions
     */
    public function testRejectsValuesOutsideTheScales(array $options): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Cluster())->preMount($options);
    }

    public static function invalidOptions(): iterable
    {
        yield 'gap' => [['gap' => 'xxl']];
        yield 'justify' => [['justify' => 'around']];
        yield 'align' => [['align' => 'stretch']];
        yield 'wrap' => [['wrap' => 'yes']];
        yield 'stackBelow' => [['stackBelow' => 'lg']];
        yield 'element' => [['as' => 'section']];
    }
}
