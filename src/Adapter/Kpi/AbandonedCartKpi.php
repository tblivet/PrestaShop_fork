<?php
/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

namespace PrestaShop\PrestaShop\Adapter\Kpi;

use HelperKpi;
use PrestaShop\PrestaShop\Adapter\LegacyContext;
use PrestaShop\PrestaShop\Core\ConfigurationInterface;
use PrestaShop\PrestaShop\Core\Domain\Cart\CartStatus;
use PrestaShop\PrestaShop\Core\Kpi\KpiDataInterface;
use PrestaShop\PrestaShop\Core\Kpi\KpiInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * @internal
 */
final class AbandonedCartKpi implements KpiInterface, KpiDataInterface
{
    use HelperKpiTrait;

    public function __construct(
        private readonly LegacyContext $contextAdapter,
        private readonly TranslatorInterface $translator,
        private readonly ConfigurationInterface $configuration,
        private readonly UrlGeneratorInterface $router
    ) {
    }

    private function createHelper(): HelperKpi
    {
        $helper = new HelperKpi();
        $helper->id = 'box-carts';
        $helper->icon = 'remove_shopping_cart';
        $helper->color = 'color2';
        $helper->title = $this->translator->trans('Abandoned Carts', [], 'Admin.Global');
        $helper->subtitle = $this->translator->trans('Yesterday', [], 'Admin.Global');

        $helper->href = $this->router->generate('admin_carts_index', [
            'cart[filters][status]' => CartStatus::ABANDONED_CART,
        ]);

        if ($this->configuration->get('ABANDONED_CARTS') !== false) {
            $helper->value = $this->configuration->get('ABANDONED_CARTS');
        }

        $helper->source = $this->contextAdapter->getAdminLink('AdminStats', true, [
            'ajax' => 1,
            'action' => 'getKpi',
            'kpi' => 'abandoned_cart',
        ]);
        $helper->refresh = $this->configuration->get('ABANDONED_CARTS_EXPIRE') < time();

        return $helper;
    }
}
