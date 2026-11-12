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
 * An icon of the /ui kit as inline SVG, mirrors ui/src/stories/components/Icon.stories.js:
 * <twig:ui:Icon name="arrow_back"/> or <twig:ui:Icon name="warning" filled label="{{ 'Warning'|trans }}"/>
 * Every Material Symbols name works (ui/icons/material-symbols, synced by ui/.ai/bin/sync-icons.mjs), "brand:github"
 * from ui/icons/brand. Hidden from screen readers unless it has a label.
 */
#[AsTwigComponent('ui:Icon', template: '@PrestaShop/Admin/Component/Ui/icon.html.twig')]
final class Icon
{
    public const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

    private const MATERIAL_SYMBOL = '/^[a-z0-9]+(_[a-z0-9]+)*$/';

    private const BRAND = '/^brand:[a-z0-9]+(-[a-z0-9]+)*$/';

    public string $name;

    public ?string $label = null;

    public string $size = 'md';

    public bool $filled = false;

    public bool $flipRtl = false;

    /**
     * The ux:icon name of the SVG file: arrow_back is material-symbols:arrow-back, its filled style arrow-back-fill.
     */
    public function getIconName(): string
    {
        if (str_starts_with($this->name, 'brand:')) {
            return $this->name;
        }

        return 'material-symbols:' . str_replace('_', '-', $this->name) . ($this->filled ? '-fill' : '');
    }

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired('name')
            ->setDefaults([
                'label' => null,
                'size' => 'md',
                'filled' => false,
                'flipRtl' => false,
            ])
            ->setAllowedTypes('name', 'string')
            ->setAllowedValues('name', fn (string $name): bool => preg_match(self::MATERIAL_SYMBOL, $name) || preg_match(self::BRAND, $name))
            ->setAllowedTypes('label', ['null', 'string'])
            ->setAllowedValues('size', self::SIZES)
            ->setAllowedTypes('filled', 'bool')
            ->setAllowedTypes('flipRtl', 'bool')
            ->setNormalizer('filled', function (Options $options, bool $filled): bool {
                if ($filled && str_starts_with($options['name'], 'brand:')) {
                    throw new InvalidOptionsException('A brand icon has no filled style.');
                }

                return $filled;
            })
        ;

        return $resolver->resolve($data) + $data;
    }
}
