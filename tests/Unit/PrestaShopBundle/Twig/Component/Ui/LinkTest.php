<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Link;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;

class LinkTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(
            ['href' => '/admin', 'icon' => null, 'iconPosition' => 'start', 'back' => false, 'external' => false],
            (new Link())->preMount(['href' => '/admin'])
        );
    }

    public function testKeepsExtraAttributes(): void
    {
        $this->assertSame('link-secondary', (new Link())->preMount(['href' => '/admin', 'class' => 'link-secondary'])['class']);
    }

    public function testRequiresHref(): void
    {
        $this->expectException(MissingOptionsException::class);

        (new Link())->preMount([]);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data): void
    {
        $this->expectException(InvalidOptionsException::class);

        (new Link())->preMount(['href' => '/admin'] + $data);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'unknown icon position' => [['icon' => 'download', 'iconPosition' => 'left']];
        yield 'non boolean back' => [['back' => 'yes']];
        yield 'non boolean external' => [['external' => 1]];
        yield 'back with an icon' => [['back' => true, 'icon' => 'download']];
        yield 'back with an icon position' => [['back' => true, 'iconPosition' => 'end']];
    }

    public function testBackLinkLeadsWithTheBackArrow(): void
    {
        $link = new Link();
        $link->back = true;
        $link->iconPosition = 'end';

        $this->assertSame('arrow_back', $link->getIconName());
        $this->assertTrue($link->getIconAtStart());
    }

    public function testIconFollowsItsPosition(): void
    {
        $link = new Link();
        $link->icon = 'download';
        $link->iconPosition = 'end';

        $this->assertSame('download', $link->getIconName());
        $this->assertFalse($link->getIconAtStart());
    }
}
