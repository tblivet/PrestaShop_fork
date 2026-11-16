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
 * A button that opens a menu (Bootstrap dropdown), mirrors ui/src/stories/components/Dropdown.stories.js:
 * <twig:ui:Dropdown label="{{ 'Export'|trans({}, 'Admin.Actions') }}" :items="[…]"/>, or icon-only:
 * <twig:ui:Dropdown icon="more_vert" label="{{ 'More actions'|trans({}, 'Admin.Actions') }}" :items="[…]"/>
 * The trigger is a <twig:ui:Button> (or <twig:ui:IconButton> with icon), the menu a <twig:ui:DropdownMenu>.
 */
#[AsTwigComponent('ui:Dropdown', template: '@PrestaShop/Admin/Component/Ui/dropdown.html.twig')]
final class Dropdown
{
    public const DIRECTIONS = ['down', 'up'];

    /** The trigger text, or its accessible name when it shows only an icon */
    public string $label;

    /** Items of <twig:ui:DropdownMenu> */
    public array $items;

    /** Set: the trigger shows only this icon (a kebab for "More actions") */
    public ?string $icon = null;

    public string $variant = 'secondary';

    public string $size = 'md';

    public string $align = 'start';

    public string $direction = 'down';

    public bool $disabled = false;

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired(['label', 'items'])
            ->setDefaults(['icon' => null, 'variant' => 'secondary', 'size' => 'md', 'align' => 'start', 'direction' => 'down', 'disabled' => false])
            ->setAllowedTypes('label', 'string')
            ->setAllowedValues('label', fn (string $label): bool => '' !== trim($label))
            ->setAllowedTypes('items', 'array')
            ->setAllowedTypes('icon', ['null', 'string'])
            ->setAllowedValues('variant', Button::VARIANTS)
            ->setAllowedValues('size', Button::SIZES)
            ->setAllowedValues('align', DropdownMenu::ALIGNMENTS)
            ->setAllowedValues('direction', self::DIRECTIONS)
            ->setAllowedTypes('disabled', 'bool')
        ;

        return $resolver->resolve($data) + $data;
    }
}
