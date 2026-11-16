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
 * Icon-only button of the /ui kit, a square <twig:ui:Button>; mirrors ui/src/stories/components/IconButton.stories.js:
 * <twig:ui:IconButton icon="delete" label="{{ 'Delete'|trans({}, 'Admin.Actions') }}" tooltip/>
 * The label is required: it is the button's only name for screen readers.
 */
#[AsTwigComponent('ui:IconButton', template: '@PrestaShop/Admin/Component/Ui/icon_button.html.twig')]
final class IconButton
{
    public string $icon;

    public string $label;

    /** Shows the label on hover and focus */
    public bool $tooltip = false;

    public string $variant = 'secondary';

    public string $size = 'md';

    public ?string $href = null;

    public string $type = 'button';

    public bool $loading = false;

    public bool $disabled = false;

    /**
     * Checks its own props, then the button ones with Button's rules.
     */
    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setRequired(['icon', 'label'])
            ->setDefault('tooltip', false)
            ->setAllowedTypes('icon', 'string')
            ->setAllowedTypes('label', 'string')
            ->setAllowedValues('label', fn (string $label): bool => '' !== trim($label))
            ->setAllowedTypes('tooltip', 'bool')
        ;
        $own = $resolver->resolve(array_intersect_key($data, array_flip(['icon', 'label', 'tooltip'])));
        // Secondary unless told otherwise: an icon button is rarely the main action (Button's own default is primary)
        $button = (new Button())->preMount(array_diff_key($data, $own) + ['variant' => 'secondary']);
        unset($button['icon'], $button['iconPosition']);

        return $own + $button;
    }
}
