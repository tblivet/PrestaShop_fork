<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Security\Admin;

use PHPUnit\Framework\TestCase;
use PrestaShopBundle\Security\Admin\RouteAccessChecker;
use Symfony\Component\ExpressionLanguage\Expression;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationCredentialsNotFoundException;

class RouteAccessCheckerTest extends TestCase
{
    public function testARouteIsGrantedAsItsActionsAdminSecurityAsks(): void
    {
        $authorization = $this->createMock(AuthorizationCheckerInterface::class);
        $authorization->expects($this->once())->method('isGranted')
            ->with(
                $this->callback(fn (mixed $expression): bool => $expression instanceof Expression && "is_granted('delete', request.get('_legacy_controller'))" === (string) $expression),
                $this->callback(fn (mixed $request): bool => $request instanceof Request && 'AdminCountries' === $request->get('_legacy_controller'))
            )
            ->willReturn(false);
        $checker = new RouteAccessChecker(self::router(), $authorization);

        $this->assertFalse($checker->isGranted('admin_countries_delete'));
        // Asked once a route
        $this->assertFalse($checker->isGranted('admin_countries_delete'));
    }

    public function testARouteWithoutAdminSecurityOrUnknownIsGranted(): void
    {
        $authorization = $this->createMock(AuthorizationCheckerInterface::class);
        $authorization->expects($this->never())->method('isGranted');
        $checker = new RouteAccessChecker(self::router(), $authorization);

        $this->assertTrue($checker->isGranted('admin_countries_open'));
        $this->assertTrue($checker->isGranted('admin_unknown'));
    }

    public function testNothingIsHiddenWithoutAnEmployee(): void
    {
        $authorization = $this->createMock(AuthorizationCheckerInterface::class);
        $authorization->method('isGranted')->willThrowException(new AuthenticationCredentialsNotFoundException());

        $this->assertTrue((new RouteAccessChecker(self::router(), $authorization))->isGranted('admin_countries_delete'));
    }

    /**
     * admin_countries_delete asks for delete on AdminCountries; admin_countries_open asks nothing
     */
    public static function router(array $routes = ['admin_countries_delete' => 'deleteAction', 'admin_countries_open' => 'openAction']): RouterInterface
    {
        $collection = new RouteCollection();
        foreach ($routes as $name => $method) {
            $collection->add($name, new Route('/' . $name, ['_controller' => RestrictedControllerFixture::class . '::' . $method, '_legacy_controller' => 'AdminCountries']));
        }

        return self::routerOf($collection);
    }

    private static function routerOf(RouteCollection $collection): RouterInterface
    {
        return new class($collection) implements RouterInterface {
            public function __construct(private readonly RouteCollection $collection)
            {
            }

            public function getRouteCollection(): RouteCollection
            {
                return $this->collection;
            }

            public function setContext(RequestContext $context): void
            {
            }

            public function getContext(): RequestContext
            {
                return new RequestContext();
            }

            public function generate(string $name, array $parameters = [], int $referenceType = self::ABSOLUTE_PATH): string
            {
                return '/' . $name;
            }

            public function match(string $pathinfo): array
            {
                return [];
            }
        };
    }
}
