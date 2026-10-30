/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'PrestaShop Design System',
    brandImage: '/prestashop.svg',
    brandUrl: 'https://www.prestashop.com',
  }),
});
