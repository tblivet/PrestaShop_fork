<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use LogicException;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PreMount;

/**
 * Button of the /ui kit, mirrors ui/src/stories/components/Button.stories.js:
 * <twig:ui:Button variant="primary" type="submit">…</twig:ui:Button>, or a link with href.
 * Kit form buttons render it too (ui_kit_layout.html.twig, button_widget).
 */
#[AsTwigComponent('ui:Button', template: '@PrestaShop/Admin/Component/Ui/button.html.twig')]
final class Button
{
    public const VARIANTS = ['destructive', 'link', 'outline-destructive', 'outline-primary', 'outline-secondary', 'primary', 'secondary'];

    public const SIZES = ['sm', 'md', 'lg'];

    public const TYPES = ['button', 'reset', 'submit'];

    public const ICON_POSITIONS = ['start', 'end'];

    /** primary by default: a button alone is the action of its area; pass secondary for the others */
    public string $variant = 'primary';

    public string $size = 'md';

    /** Renders an <a>: the button navigates */
    public ?string $href = null;

    public string $type = 'button';

    /** <twig:ui:Icon> name, decorative: the text says what the button does */
    public ?string $icon = null;

    public string $iconPosition = 'start';

    public bool $loading = false;

    /** What screen readers hear while the button is busy, when "Loading..." says less than the action ("Installing...") */
    public ?string $busyLabel = null;

    public bool $disabled = false;

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setDefaults([
                'variant' => 'primary',
                'size' => 'md',
                'href' => null,
                'type' => 'button',
                'icon' => null,
                'iconPosition' => 'start',
                'loading' => false,
                'busyLabel' => null,
                'disabled' => false,
            ])
            ->setAllowedValues('variant', self::VARIANTS)
            ->setAllowedValues('size', self::SIZES)
            ->setAllowedTypes('href', ['null', 'string'])
            ->setAllowedValues('type', self::TYPES)
            ->setAllowedTypes('icon', ['null', 'string'])
            ->setAllowedValues('iconPosition', self::ICON_POSITIONS)
            ->setAllowedTypes('loading', 'bool')
            ->setAllowedTypes('busyLabel', ['null', 'string'])
            ->setAllowedValues('busyLabel', fn (?string $label): bool => null === $label || '' !== trim($label))
            ->setAllowedTypes('disabled', 'bool')
            // A link navigates: it has no type, and the page it opens shows the progress
            ->setNormalizer('href', function (Options $options, ?string $href) use ($data): ?string {
                if (null !== $href && array_key_exists('type', $data)) {
                    throw new InvalidOptionsException('A button with an href is a link: it takes no type.');
                }
                if (null !== $href && ($options['loading'] || null !== $options['busyLabel'])) {
                    throw new InvalidOptionsException('A button with an href is a link: it has no loading state.');
                }

                return $href;
            })
        ;

        return $resolver->resolve($data) + $data;
    }

    /**
     * The label is the content block, which props cannot see: the template passes it here. Without text and without
     * an aria-label (what <twig:ui:IconButton> gives), the button has no name.
     */
    public function checkLabel(string $content, bool $hasAriaLabel): void
    {
        if (!$hasAriaLabel && '' === trim(strip_tags($content))) {
            throw new LogicException('<twig:ui:Button> needs a label, its content. For an icon alone, use <twig:ui:IconButton label="…">.');
        }
    }
}
