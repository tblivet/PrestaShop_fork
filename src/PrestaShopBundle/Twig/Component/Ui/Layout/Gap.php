<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui\Layout;

/**
 * The gap scale shared by every layout, a size to a Bootstrap spacer index ($ps-layout-gaps in ui/src/scss/_variables.scss).
 */
final class Gap
{
    public const SCALE = ['none' => 0, 'xs' => 1, 'sm' => 2, 'md' => 3, 'lg' => 4, 'xl' => 5];
}
