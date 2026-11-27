<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Security\Admin;

use PrestaShopBundle\Security\Attribute\AdminSecurity;
use ReflectionClass;
use Symfony\Component\ExpressionLanguage\Expression;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationCredentialsNotFoundException;

/**
 * Whether the employee may use a back office route: the AdminSecurity attributes of its controller action, evaluated as
 * AdminSecurityListener does when the route is called, so a page shows only the actions it would not refuse. A route
 * without them, or that cannot be read, is granted: the action still checks when it is called.
 */
final class RouteAccessChecker
{
    /** @var array<string, bool> */
    private array $granted = [];

    public function __construct(
        private readonly RouterInterface $router,
        private readonly AuthorizationCheckerInterface $authorizationChecker,
    ) {
    }

    public function isGranted(string $routeName): bool
    {
        return $this->granted[$routeName] ??= $this->check($routeName);
    }

    private function check(string $routeName): bool
    {
        $route = $this->router->getRouteCollection()->get($routeName);
        $controller = $route?->getDefault('_controller');

        if (!is_string($controller) || !str_contains($controller, '::')) {
            return true;
        }
        [$class, $method] = explode('::', $controller, 2);
        if (!class_exists($class) || !method_exists($class, $method)) {
            return true;
        }
        $reflection = new ReflectionClass($class);
        $attributes = [
            ...$reflection->getAttributes(AdminSecurity::class),
            ...$reflection->getMethod($method)->getAttributes(AdminSecurity::class),
        ];
        // The expressions read the route's own attributes (request.get('_legacy_controller'))
        $request = new Request(attributes: $route->getDefaults());

        try {
            foreach ($attributes as $attribute) {
                $expression = $attribute->newInstance()->getAttribute();
                if (!$this->authorizationChecker->isGranted($expression instanceof Expression ? $expression : new Expression($expression), $request)) {
                    return false;
                }
            }
        } catch (AuthenticationCredentialsNotFoundException) {
            // No employee signed in (a render outside a request, a test): nothing to hide for
        }

        return true;
    }
}
