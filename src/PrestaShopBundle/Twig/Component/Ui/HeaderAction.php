<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PreMount;

/**
 * An entry of <twig:ui:Header>, mirrors ui/src/stories/components/HeaderAction.stories.js: a link
 * <twig:ui:HeaderAction icon="storefront" label="…" href="…" external/> or a button opening a menu
 * <twig:ui:HeaderAction icon="bookmarks" label="…" :items="[…]"/> (items of <twig:ui:DropdownMenu>).
 * The label shows from lg up; below, the icon alone, the label kept for screen readers.
 */
#[AsTwigComponent('ui:HeaderAction', template: '@PrestaShop/Admin/Component/Ui/header_action.html.twig')]
final class HeaderAction
{
    public string $label;

    /** <twig:ui:Icon> name */
    public string $icon;

    /** Set: a link; or items */
    public ?string $href = null;

    /** Opens the link in a new tab, and says so */
    public bool $external = false;

    /** Set: a button that opens these <twig:ui:DropdownMenu> items */
    public ?array $items = null;

    /** More about a link, in a tooltip (what debug mode means) */
    public ?string $description = null;

    /** Which edge of the button the menu lines up with: end for the actions on the right, start next to the logo */
    public string $align = 'end';

    /** The icon alone at every width, the label still its name for screen readers; a link shows it in a tooltip */
    public bool $iconOnly = false;

    /** A state to notice (debug mode, maintenance mode): an amber chip */
    public bool $warning = false;

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired(['label', 'icon'])
            ->setDefaults(['href' => null, 'external' => false, 'items' => null, 'description' => null, 'align' => 'end', 'iconOnly' => false, 'warning' => false])
            ->setAllowedTypes('label', 'string')
            ->setAllowedValues('label', fn (string $label): bool => '' !== trim($label))
            ->setAllowedTypes('icon', 'string')
            ->setAllowedTypes('href', ['null', 'string'])
            ->setAllowedTypes('external', 'bool')
            ->setAllowedTypes('items', ['null', 'array'])
            ->setAllowedTypes('description', ['null', 'string'])
            ->setAllowedValues('align', DropdownMenu::ALIGNMENTS)
            ->setAllowedTypes('iconOnly', 'bool')
            ->setAllowedTypes('warning', 'bool')
        ;
        $props = $resolver->resolve($data);

        if ((null === $props['href']) === (null === $props['items'])) {
            throw new InvalidOptionsException('A header action is a link (href) or opens a menu (items): give one of them.');
        }
        if (null !== $props['items'] && ($props['external'] || null !== $props['description'])) {
            throw new InvalidOptionsException('A header action that opens a menu takes no external or description: its button opens the menu, it has no tooltip.');
        }

        return $props + $data;
    }
}
