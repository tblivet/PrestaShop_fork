<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PreMount;

/**
 * The page's one confirmation dialog, placed by the kit layout; mirrors ui/src/stories/components/ConfirmDialog.stories.js.
 * A button or a link asks for it with data-ps-confirm="{{ 'Delete the selected orders?'|trans(…) }}", and optionally
 * data-ps-data-confirm-title, data-ps-data-confirm-label (the action's verb) and data-ps-data-confirm-variant="danger":
 * confirm-dialog.ts fills it, and on confirm submits the button's form with it or follows the link.
 */
#[AsTwigComponent('ui:ConfirmDialog', template: '@PrestaShop/Admin/Component/Ui/confirm_dialog.html.twig')]
final class ConfirmDialog
{
    public string $id = 'ps-confirm-dialog';

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setDefaults(['id' => 'ps-confirm-dialog'])
            ->setAllowedTypes('id', 'string')
            ->setAllowedValues('id', fn (string $id): bool => '' !== trim($id))
        ;

        return $resolver->resolve($data) + $data;
    }
}
