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
 * Text link of the /ui kit, mirrors ui/src/stories/components/Link.stories.js:
 * <twig:ui:Link href="…" icon="download">…</twig:ui:Link>, <twig:ui:Link href="…" back>…</twig:ui:Link>,
 * <twig:ui:Link href="https://…" external>…</twig:ui:Link>. An action on the page is a <twig:ui:Button>.
 */
#[AsTwigComponent('ui:Link', template: '@PrestaShop/Admin/Component/Ui/link.html.twig')]
final class Link
{
    public const ICON_POSITIONS = ['start', 'end'];

    public string $href;

    /** <twig:ui:Icon> name, decorative: the text says where the link goes */
    public ?string $icon = null;

    public string $iconPosition = 'start';

    /** A link back to the previous page or list: arrow before the text, pointing the reading direction */
    public bool $back = false;

    /** Opens in a new tab, and says so to screen readers */
    public bool $external = false;

    public function getIconName(): ?string
    {
        return $this->back ? 'arrow_back' : $this->icon;
    }

    public function getIconAtStart(): bool
    {
        return $this->back || 'start' === $this->iconPosition;
    }

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired('href')
            ->setDefaults([
                'icon' => null,
                'iconPosition' => 'start',
                'back' => false,
                'external' => false,
            ])
            ->setAllowedTypes('href', 'string')
            ->setAllowedTypes('icon', ['null', 'string'])
            ->setAllowedValues('iconPosition', self::ICON_POSITIONS)
            ->setAllowedTypes('back', 'bool')
            ->setAllowedTypes('external', 'bool')
            ->setNormalizer('back', function (Options $options, bool $back) use ($data): bool {
                if ($back && (null !== $options['icon'] || array_key_exists('iconPosition', $data))) {
                    throw new InvalidOptionsException('A back link has its own icon: it takes no icon or iconPosition.');
                }

                return $back;
            })
        ;

        return $resolver->resolve($data) + $data;
    }
}
