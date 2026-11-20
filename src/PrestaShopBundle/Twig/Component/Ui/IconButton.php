<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Options;
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
    /** Logical sides: start and end are Bootstrap's left and right, which it swaps in right-to-left languages */
    public const TOOLTIP_PLACEMENTS = ['top', 'bottom', 'start', 'end'];

    public string $icon;

    public string $label;

    /** Shows the label on hover and focus */
    public bool $tooltip = false;

    /** Where the tooltip shows, only with tooltip; Bootstrap moves it to the other side when there is no room */
    public string $tooltipPlacement = 'top';

    public string $variant = 'primary';

    public string $size = 'md';

    public ?string $href = null;

    public string $type = 'button';

    public bool $loading = false;

    public ?string $busyLabel = null;

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
            ->setDefaults(['tooltip' => false, 'tooltipPlacement' => 'top'])
            ->setAllowedTypes('icon', 'string')
            ->setAllowedTypes('label', 'string')
            ->setAllowedValues('label', fn (string $label): bool => '' !== trim($label))
            ->setAllowedTypes('tooltip', 'bool')
            ->setAllowedValues('tooltipPlacement', self::TOOLTIP_PLACEMENTS)
            ->setNormalizer('tooltipPlacement', function (Options $options, string $placement) use ($data): string {
                if (!$options['tooltip'] && array_key_exists('tooltipPlacement', $data)) {
                    throw new InvalidOptionsException('tooltipPlacement places the tooltip: add tooltip, or leave it out.');
                }

                return $placement;
            })
        ;
        $own = $resolver->resolve(array_intersect_key($data, array_flip(['icon', 'label', 'tooltip', 'tooltipPlacement'])));
        $button = (new Button())->preMount(array_diff_key($data, $own));
        unset($button['icon'], $button['iconPosition']);

        return $own + $button;
    }
}
