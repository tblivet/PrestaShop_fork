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
 * Bootstrap 5 modal of the /ui kit, mirrors ui/src/stories/components/Modal.stories.js:
 * <twig:ui:Modal id="…" title="…">body<twig:block name="footer">buttons</twig:block></twig:ui:Modal>
 * A button with data-bs-toggle="modal" data-bs-target="#id" opens it.
 */
#[AsTwigComponent('ui:Modal', template: '@PrestaShop/Admin/Component/Ui/modal.html.twig')]
final class Modal
{
    public const SIZES = ['sm', 'md', 'lg', 'xl', 'fullscreen'];

    public const HEADING_LEVELS = [2, 3, 4, 5, 6];

    /** The color of the icon's circle: info, success for something done, danger for a deletion */
    public const VARIANTS = ['info', 'success', 'danger'];

    /** Opens it (data-bs-target) and names it: the title is "{id}-title" */
    public string $id;

    public string $title;

    /** Not set: the title names the dialog without being a heading of the page; 2 to 6 makes it one */
    public ?int $headingLevel = null;

    /** <twig:ui:Icon> name, in a round tinted badge before the title; decorative */
    public ?string $icon = null;

    /** The color of the icon's circle, only with an icon; info when not set */
    public ?string $variant = null;

    public string $size = 'md';

    /** A long body scrolls inside the dialog, the title and the footer stay; false: the whole dialog scrolls with the page */
    public bool $scrollable = true;

    /** A click outside does not close it, so typed input is not lost; Esc and the close button still do */
    public bool $static = false;

    /** false: no close button, no Esc, no click outside; only for a step that must finish (a progress) */
    public bool $closable = true;

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired(['id', 'title'])
            ->setDefaults([
                'headingLevel' => null,
                'icon' => null,
                'variant' => null,
                'size' => 'md',
                'scrollable' => true,
                'static' => false,
                'closable' => true,
            ])
            ->setAllowedTypes('id', 'string')
            ->setAllowedTypes('title', 'string')
            // headingLevel="3" in Twig is a string
            ->setAllowedValues('headingLevel', fn (mixed $level): bool => null === $level || (is_numeric($level) && in_array((int) $level, self::HEADING_LEVELS, true)))
            ->setNormalizer('headingLevel', fn (Options $options, int|string|null $level): ?int => null === $level ? null : (int) $level)
            ->setAllowedTypes('icon', ['null', 'string'])
            ->setAllowedValues('variant', [null, ...self::VARIANTS])
            ->setNormalizer('variant', function (Options $options, ?string $variant): ?string {
                if (null !== $variant && null === $options['icon']) {
                    throw new InvalidOptionsException('A modal variant colors its icon: give an icon, or no variant.');
                }

                return $variant;
            })
            ->setAllowedValues('size', self::SIZES)
            ->setAllowedTypes('scrollable', 'bool')
            ->setAllowedTypes('static', 'bool')
            ->setAllowedTypes('closable', 'bool')
        ;

        return $resolver->resolve($data) + $data;
    }
}
