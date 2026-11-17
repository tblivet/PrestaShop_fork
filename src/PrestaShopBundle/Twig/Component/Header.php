<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

declare(strict_types=1);

namespace PrestaShopBundle\Twig\Component;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\UX\TwigComponent\Attribute\AsTwigComponent;

/**
 * Feeds <twig:ui:Header> on kit pages (PS_UI_KIT=1): the search the page was opened with. The quick access, the
 * notifications and the employee menu are their own components.
 */
#[AsTwigComponent(template: '@PrestaShop/Admin/Component/Layout/Ui/header.html.twig')]
class Header
{
    public function __construct(
        protected readonly RequestStack $requestStack,
    ) {
    }

    public function getSearchQuery(): string
    {
        return (string) $this->requestStack->getCurrentRequest()?->query->get('bo_query', '');
    }

    public function getSearchType(): int
    {
        return (int) $this->requestStack->getCurrentRequest()?->query->get('bo_search_type', 0);
    }
}
