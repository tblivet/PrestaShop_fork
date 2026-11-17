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
            ['homeUrl' => '/home', 'logo' => '/logo.svg', 'version' => '9.3.0', 'menuId' => 'ps-side-menu'],
            (new Header())->preMount(['homeUrl' => '/home', 'logo' => '/logo.svg', 'version' => '9.3.0'])
        );
    }

    public function testRequiresTheLogo(): void
    {
        $this->expectException(MissingOptionsException::class);

        (new Header())->preMount(['homeUrl' => '/home', 'version' => '9.3.0']);
    }

    public function testRequiresTheVersion(): void
    {
        $this->expectException(MissingOptionsException::class);

        (new Header())->preMount(['homeUrl' => '/home', 'logo' => '/logo.svg']);
    }

    #[DataProvider('provideInvalidProps')]
    public function testRejectsInvalidProps(array $data, string $exception): void
    {
        $this->expectException($exception);

        (new Header())->preMount($data + ['homeUrl' => '/home', 'logo' => '/logo.svg', 'version' => '9.3.0']);
    }

    public static function provideInvalidProps(): iterable
    {
        yield 'non string version' => [['version' => 9], InvalidOptionsException::class];
    }
}
