<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

/**
 * Where toast.ts shows the toasts, placed once per page by the kit layouts: a toast of each type as a template, so the
 * shown ones are what <twig:ui:Toast> renders, translated.
 */
#[AsTwigComponent('ui:ToastStack', template: '@PrestaShop/Admin/Component/Ui/toast_stack.html.twig')]
final class ToastStack
{
    /**
     * @return string[]
     */
    public function getTypes(): array
    {
        return Toast::TYPES;
    }
}
