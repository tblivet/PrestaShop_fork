<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Tests\Unit\PrestaShopBundle\Security\Admin;

use PrestaShopBundle\Security\Attribute\AdminSecurity;

/**
 * A controller whose actions ask for a permission, for RouteAccessChecker's tests
 */
final class RestrictedControllerFixture
{
    #[AdminSecurity("is_granted('delete', request.get('_legacy_controller'))")]
    public function deleteAction(): void
    {
    }

    public function openAction(): void
    {
    }
}
