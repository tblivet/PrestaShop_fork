<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Twig\Component\Ui;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Twig\Component\Ui\Header;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;

class HeaderTest extends TestCase
{
    public function testDefaults(): void
    {
        $this->assertEquals(
            ['homeUrl' => '/home', 'logo' => '/logo.svg', 'menuId' => 'ps-side-menu'],
            (new Header())->preMount(['homeUrl' => '/home', 'logo' => '/logo.svg'])
        );
    }

    public function testRequiresTheLogo(): void
    {
        $this->expectException(MissingOptionsException::class);

        (new Header())->preMount(['homeUrl' => '/home']);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data, string $exception): void
    {
        $this->expectException($exception);

        (new Header())->preMount($data + ['homeUrl' => '/home', 'logo' => '/logo.svg']);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'non string menuId' => [['menuId' => 9], InvalidOptionsException::class];
    }
}
