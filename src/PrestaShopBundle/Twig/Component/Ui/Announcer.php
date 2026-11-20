<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component\Ui;

use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

/**
 * The page's one polite live region, mirrors ui/src/stories/components/Announcer.stories.js: <twig:ui:Announcer/>,
 * placed once by the kit layouts. Scripts write in it with announce() (ui/src/js/components/announcer.js) to tell
 * screen readers what changed without moving the focus. It is in the page from the start, so updates are announced.
 */
#[AsTwigComponent('ui:Announcer', template: '@PrestaShop/Admin/Component/Ui/announcer.html.twig')]
final class Announcer
{
}
