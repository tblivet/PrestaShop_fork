<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use PrestaShop\PrestaShop\Core\Domain\ShowcaseCard\ValueObject\ShowcaseCard;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;
use Symfony\UX\TwigComponent\Attribute\PreMount;

/**
 * The introduction of a page, mirrors ui/src/stories/components/ShowcaseModal.stories.js:
 * {% if not isShowcaseCardClosed %}<twig:ui:ShowcaseModal name="attributes_card" title="…" image="…" learnMore="…">text</twig:ui:ShowcaseModal>{% endif %}
 * A static <twig:ui:Modal> that showcase-modal.ts opens when the page loads: the illustration, the text (content
 * block) and a link to the documentation. Closing it, by its close button, "Got it" or Escape, records it closed for
 * the shop (admin_close_showcase_card), and the page renders it no more; a click outside does not close it.
 */
#[AsTwigComponent('ui:ShowcaseModal', template: '@PrestaShop/Admin/Component/Ui/showcase_modal.html.twig')]
final class ShowcaseModal
{
    /** The showcase card name, the key its closing is stored under */
    public string $name;

    public string $title;

    /** The illustration's URL, decorative */
    public string $image;

    /** The documentation page, opened in a new tab */
    public ?string $learnMore = null;

    public function getId(): string
    {
        return 'ps-showcase-' . str_replace('_', '-', $this->name);
    }

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired(['name', 'title', 'image'])
            ->setDefaults(['learnMore' => null])
            ->setAllowedValues('name', array_keys(ShowcaseCard::SUPPORTED_NAMES))
            ->setAllowedTypes('title', 'string')
            ->setAllowedTypes('image', 'string')
            ->setAllowedTypes('learnMore', ['null', 'string'])
        ;

        return $resolver->resolve($data) + $data;
    }
}
