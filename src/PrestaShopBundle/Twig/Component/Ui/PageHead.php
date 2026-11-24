<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use Symfony\Component\OptionsResolver\Exception\InvalidOptionsException;
use Symfony\Component\OptionsResolver\Exception\MissingOptionsException;
use Symfony\Component\OptionsResolver\Options;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PreMount;

/**
 * The top of a kit page, mirrors ui/src/stories/components/PageHead.stories.js:
 * <twig:ui:PageHead title="Attributes" :pages="[…]" pagesLabel="Attributes & Features" :actions="[…]" help="…"/>
 * The title (h1) and an optional icon, the links to the sibling sub-pages on the bottom edge of a white band, the page
 * actions as small buttons with an icon, the main one first, and Help as an icon button. On a phone every action is in
 * a "More actions" menu.
 */
#[AsTwigComponent('ui:PageHead', template: '@PrestaShop/Admin/Component/Ui/page_head.html.twig')]
final class PageHead
{
    public string $title;

    /** <twig:ui:Icon> name before the title, decorative */
    public ?string $icon = null;

    /**
     * The sibling sub-pages, the current one included
     *
     * @var list<array{label: string, href: string, current: bool}>
     */
    public array $pages = [];

    /** What the sub-pages are part of, the name of their navigation: required with pages */
    public ?string $pagesLabel = null;

    /**
     * The page actions, the main one first: each a <twig:ui:Button> with an icon
     *
     * @var list<array{label: string, icon: string, href: ?string, external: bool, disabled: bool, attr: array<string, string>}>
     */
    public array $actions = [];

    /** The page's help: an icon button that opens it in a new tab */
    public ?string $help = null;

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired('title')
            ->setDefaults(['icon' => null, 'pages' => [], 'pagesLabel' => null, 'actions' => [], 'help' => null])
            ->setAllowedTypes('title', 'string')
            ->setAllowedValues('title', fn (string $title): bool => '' !== trim($title))
            ->setAllowedTypes('icon', ['null', 'string'])
            ->setAllowedTypes('pages', 'array')
            ->setAllowedTypes('pagesLabel', ['null', 'string'])
            ->setAllowedTypes('actions', 'array')
            ->setAllowedTypes('help', ['null', 'string'])
            ->setNormalizer('pages', function (Options $options, array $pages): array {
                $pages = array_map($this->resolvePage(...), array_values($pages));
                if (count(array_filter(array_column($pages, 'current'))) > 1) {
                    throw new InvalidOptionsException('Only one sub-page is the current one.');
                }

                return $pages;
            })
            ->setNormalizer('pagesLabel', function (Options $options, ?string $label): ?string {
                if ([] !== $options['pages'] && (null === $label || '' === trim($label))) {
                    throw new MissingOptionsException('The sub-pages need a pagesLabel: the name of what they are part of, for their navigation.');
                }

                return $label;
            })
            ->setNormalizer('actions', fn (Options $options, array $actions): array => array_map($this->resolveAction(...), array_values($actions)))
        ;

        return $resolver->resolve($data) + $data;
    }

    private function resolvePage(mixed $page): array
    {
        if (!is_array($page)) {
            throw new InvalidOptionsException('A sub-page is an array: {label, href, current}.');
        }

        $resolver = new OptionsResolver();
        $resolver
            ->setRequired(['label', 'href'])
            ->setDefaults(['current' => false])
            ->setAllowedTypes('label', 'string')
            ->setAllowedTypes('href', 'string')
            ->setAllowedTypes('current', 'bool')
        ;

        return $resolver->resolve($page);
    }

    private function resolveAction(mixed $action): array
    {
        if (!is_array($action)) {
            throw new InvalidOptionsException('An action is an array: {label, icon, href, external, disabled, attr}.');
        }

        $resolver = new OptionsResolver();
        $resolver
            ->setRequired(['label', 'icon'])
            ->setDefaults(['href' => null, 'external' => false, 'disabled' => false, 'attr' => []])
            ->setAllowedTypes('label', 'string')
            ->setAllowedValues('label', fn (string $label): bool => '' !== trim($label))
            ->setAllowedTypes('icon', 'string')
            ->setAllowedValues('icon', fn (string $icon): bool => 1 === preg_match(Icon::MATERIAL_SYMBOL, $icon))
            ->setAllowedTypes('href', ['null', 'string'])
            ->setAllowedTypes('external', 'bool')
            ->setAllowedTypes('disabled', 'bool')
            ->setAllowedTypes('attr', 'array')
        ;

        return $resolver->resolve($action);
    }
}
