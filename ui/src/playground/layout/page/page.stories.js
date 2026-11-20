/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The page shell every back office page shares: header, side menu and the content area, here with placeholder content
import calendarMonth from '../../../../icons/material-symbols/calendar-month.svg?raw';
import dashboard from '../../../../icons/material-symbols/dashboard.svg?raw';
import home from '../../../../icons/material-symbols/home.svg?raw';
import refresh from '../../../../icons/material-symbols/refresh.svg?raw';
import { playgroundMeta } from '../../playground.meta.js';
import { expandIcons } from '../../ui-icons';
import { boLayout } from '../bo-layout.js';
import pageRaw from './page.html?raw';

const pageHtml = expandIcons(pageRaw, { home, calendar_month: calendarMonth, refresh, dashboard });

export default {
  title: 'Playground/Layout/Page',
  // tags must be a literal array here — the CSF static indexer cannot follow import spreads
  tags: ['!autodocs'],
  ...playgroundMeta,
};

export const Default = {
  render: () => boLayout(pageHtml),
};

export const FullWidth = {
  render: () => boLayout(pageHtml, { fluid: true }),
};
