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
 * Top bar of the back office, mirrors ui/src/stories/components/Header.stories.js:
 * <twig:ui:Header homeUrl="…" logo="…">
 *   <twig:block name="search"><twig:ui:HeaderSearch …/></twig:block>
 *   <twig:block name="actions"><twig:ui:HeaderAction …/></twig:block>
 * </twig:ui:Header>
 * Below md, a button opens the side menu (menuId).
 */
#[AsTwigComponent('ui:Header', template: '@PrestaShop/Admin/Component/Ui/header.html.twig')]
final class Header
{
    public string $homeUrl;

    /** URL of the logo image, a dark logo the header shows light */
    public string $logo;

    /** Id of the <twig:ui:SideMenu> the menu button opens below md */
    public string $menuId = 'ps-side-menu';

    #[PreMount]
    public function preMount(array $data): array
    {
        $resolver = new OptionsResolver();
        $resolver
            ->setIgnoreUndefined()
            ->setRequired(['homeUrl', 'logo'])
            ->setDefaults(['menuId' => 'ps-side-menu'])
            ->setAllowedTypes('homeUrl', 'string')
            ->setAllowedTypes('logo', 'string')
            ->setAllowedTypes('menuId', 'string')
        ;

        return $resolver->resolve($data) + $data;
    }
}
