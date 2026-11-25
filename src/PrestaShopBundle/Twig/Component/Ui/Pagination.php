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
 * Links to the pages of a list, Bootstrap's pagination in a named <nav>; mirrors
 * ui/src/stories/components/Pagination.stories.js:
 * <twig:ui:Pagination :current="3" :links="{1: '/orders?offset=0', 2: '…', 3: '…', 4: '…', 25: '…'}" label="{{ 'Pages of the Orders list'|trans(…) }}"/>
 * The caller builds the links (page number to URL): the first, the last, the current one and its neighbours at least
 * (checked: the last is the highest given). It shows those, a gap where pages are left out, Previous and Next to the
 * neighbours. One page: nothing. With jumpUrl, a field goes to any page: the URL with {page}, or with {offset} and
 * perPage for a list that pages by offset (a grid); pagination-jump.js builds it.
 */
#[AsTwigComponent('ui:Pagination', template: '@PrestaShop/Admin/Component/Ui/pagination.html.twig')]
final class Pagination
{
    public int $current;

    /** @var array<int, string> page number => URL */
    public array $links;

    /** Names the navigation for screen readers: which list's pages */
    public string $label;

    /** The URL of any page, with {page}, or {offset} and perPage: a field to type the page to go to */
    public ?string $jumpUrl = null;

    /** The rows a page has, to turn the page typed into the {offset} of jumpUrl */
    public ?int $perPage = null;

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired(['current', 'links', 'label'])
            ->setDefaults(['jumpUrl' => null, 'perPage' => null])
            ->setAllowedTypes('current', 'int')
            ->setAllowedTypes('links', 'array')
            ->setAllowedValues('links', fn (array $links): bool => [] !== $links
                && [] === array_filter(array_keys($links), fn ($page): bool => !is_int($page) || $page < 1)
                && [] === array_filter($links, fn ($url): bool => !is_string($url) || '' === $url))
            ->setAllowedTypes('label', 'string')
            ->setAllowedValues('label', fn (string $label): bool => '' !== trim($label))
            ->setAllowedTypes('jumpUrl', ['null', 'string'])
            ->setAllowedTypes('perPage', ['null', 'int'])
            ->setAllowedValues('perPage', fn (?int $perPage): bool => null === $perPage || $perPage >= 1)
            ->setNormalizer('jumpUrl', function (Options $options, ?string $url): ?string {
                if (null === $url) {
                    return null;
                }
                if (str_contains($url, '{offset}') && null === $options['perPage']) {
                    throw new InvalidOptionsException('jumpUrl with {offset} needs perPage.');
                }
                if (!str_contains($url, '{page}') && !str_contains($url, '{offset}')) {
                    throw new InvalidOptionsException('jumpUrl must have {page} or {offset}.');
                }

                return $url;
            })
            ->setNormalizer('links', function (Options $options, array $links): array {
                ksort($links);
                $current = $options['current'];
                $needed = array_filter([1, $current - 1, $current, $current + 1], fn (int $page): bool => $page >= 1 && $page <= array_key_last($links));

                if (!isset($links[$current]) || [] !== array_diff($needed, array_keys($links))) {
                    throw new InvalidOptionsException('links must have the first page, the current one and its neighbours.');
                }

                return $links;
            })
        ;

        return $resolver->resolve($data) + $data;
    }

    public function getLast(): int
    {
        return array_key_last($this->links);
    }

    /**
     * The pages shown, in order: the first, the last, the current one and its neighbours, among the links; null where
     * pages are left out.
     *
     * @return array<int|null>
     */
    public function getItems(): array
    {
        $shown = array_values(array_filter(
            array_keys($this->links),
            fn (int $page): bool => 1 === $page || $this->getLast() === $page || abs($page - $this->current) <= 1
        ));
        $items = [];

        foreach ($shown as $index => $page) {
            if ($index > 0 && $page - $shown[$index - 1] > 1) {
                $items[] = null;
            }
            $items[] = $page;
        }

        return $items;
    }
}
