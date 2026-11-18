<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\Icons\Exception\IconNotFoundException;
use Symfony\UX\Icons\IconRegistryInterface;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PreMount;

/**
 * Main navigation of the back office, mirrors ui/src/stories/components/SideMenu.stories.js:
 * <twig:ui:SideMenu :sections="[{title: 'Sell', items: [{label: 'Orders', icon: 'shopping_basket', children: […]}]}]"/>
 * A drawer below md (Bootstrap offcanvas-md, opened by the header), a column from md up. Pinned under the menu, which
 * scrolls under it: View my shop (shopUrl) and the PrestaShop version.
 */
#[AsTwigComponent('ui:SideMenu', template: '@PrestaShop/Admin/Component/Ui/side_menu.html.twig')]
final class SideMenu
{
    /** Shown for an item without an icon, or with a name no SVG file matches (tab icons come from modules) */
    public const FALLBACK_ICON = 'extension';

    /** Core tab icons named in Material Icons, which the Material Symbols SVG set only has under their new name */
    private const ICON_ALIASES = [
        'assessment' => 'analytics',
        'payment' => 'credit_card',
    ];

    /**
     * @var list<array{
     *     title: ?string,
     *     items: list<array{label: string, href: ?string, icon: string, current: bool, badge: ?array{label: string, logo: bool}, children: list<array{label: string, href: string, current: bool, badge: ?array{label: string, logo: bool}}>}>
     * }>
     */
    public array $sections;

    /** Accessible name of the navigation, "Main menu" by default */
    public ?string $label = null;

    /** The shop's front office: View my shop, pinned under the menu, opens it in a new tab */
    public ?string $shopUrl = null;

    /** The PrestaShop version, a badge pinned under the menu */
    public ?string $version = null;

    public function __construct(
        #[Autowire(service: '.ux_icons.icon_registry')]
        private readonly IconRegistryInterface $icons,
    ) {
    }

    #[PreMount]
    public function preMount(array $data): array
    {
        if (!array_key_exists('sections', $data)) {
            throw new MissingOptionsException('The required option "sections" is missing.');
        }

        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setDefaults(['label' => null, 'shopUrl' => null, 'version' => null])
            ->setAllowedTypes('label', ['null', 'string'])
            ->setAllowedTypes('shopUrl', ['null', 'string'])
            ->setAllowedTypes('version', ['null', 'string'])
            ->setDefault('sections', function (OptionsResolver $section): void {
                $section
                    ->setPrototype(true)
                    ->setDefault('title', null)
                    ->setAllowedTypes('title', ['null', 'string'])
                    ->setDefault('items', function (OptionsResolver $item): void {
                        $this->configureItem($item);
                    })
                ;
            })
        ;

        return $resolver->resolve($data) + $data;
    }

    private function configureItem(OptionsResolver $item): void
    {
        $item
            ->setPrototype(true)
            ->setRequired('label')
            ->setDefaults(['href' => null, 'icon' => null, 'current' => false, 'badge' => null])
            ->setAllowedTypes('label', 'string')
            ->setAllowedTypes('href', ['null', 'string'])
            ->setAllowedTypes('icon', ['null', 'string'])
            ->setAllowedTypes('current', 'bool')
            ->setAllowedTypes('badge', ['null', 'array'])
            // The badge flags a page: on a parent it would not say which one, and it would crowd the arrow
            ->setNormalizer('badge', function (Options $options, ?array $badge): ?array {
                if (null !== $badge && [] !== $options['children']) {
                    throw new InvalidOptionsException('An item with children takes no badge: put it on the child it flags.');
                }

                return $this->resolveBadge($badge);
            })
            ->setNormalizer('icon', fn (Options $options, ?string $icon): string => $this->resolveIcon($icon))
            ->setDefault('children', function (OptionsResolver $child): void {
                $child
                    ->setPrototype(true)
                    ->setRequired(['label', 'href'])
                    ->setDefaults(['current' => false, 'badge' => null])
                    ->setAllowedTypes('label', 'string')
                    ->setAllowedTypes('href', 'string')
                    ->setAllowedTypes('current', 'bool')
                    ->setAllowedTypes('badge', ['null', 'array'])
                    ->setNormalizer('badge', fn (Options $options, ?array $badge): ?array => $this->resolveBadge($badge))
                ;
            })
            // An item with a submenu opens it: its own link would only repeat the first child
            ->setNormalizer('href', function (Options $options, ?string $href): ?string {
                if (null === $href && [] === $options['children']) {
                    throw new InvalidOptionsException('An item without children needs an href.');
                }

                return [] === $options['children'] ? $href : null;
            })
        ;
    }

    /**
     * A short tag after the label ("New"), with the PrestaShop mark when logo is true.
     *
     * @return array{label: string, logo: bool}|null
     */
    private function resolveBadge(?array $badge): ?array
    {
        if (null === $badge) {
            return null;
        }

        $resolver = new OptionsResolver();
        $resolver
            ->setRequired('label')
            ->setDefault('logo', false)
            ->setAllowedTypes('label', 'string')
            ->setAllowedValues('label', fn (string $label): bool => '' !== trim($label))
            ->setAllowedTypes('logo', 'bool')
        ;

        return $resolver->resolve($badge);
    }

    private function resolveIcon(?string $icon): string
    {
        if (null === $icon || !preg_match(Icon::MATERIAL_SYMBOL, $icon)) {
            return self::FALLBACK_ICON;
        }

        $icon = self::ICON_ALIASES[$icon] ?? $icon;
        try {
            $this->icons->get('material-symbols:' . str_replace('_', '-', $icon));
        } catch (IconNotFoundException) {
            return self::FALLBACK_ICON;
        }

        return $icon;
    }
}
