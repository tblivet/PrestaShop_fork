/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

// JS hooks of the kit's components: data-ps-* attributes only, never CSS classes.
export default {
  passwordToggle: '[data-ps-action="toggle-password"]',
  // data-ps-action can hold several behaviours ("submit-once validate")
  submitOnce: '[data-ps-action~="submit-once"]',
  validate: '[data-ps-action~="validate"]',
  clientError: '[data-ps-target="client-error"]',
  flashAlert: '[data-ps-ref="flash-alert"]',
  submitSpinner: '[data-ps-ref="submit-spinner"]',
  headerSearch: '[data-ps-ref="header-search"]',
  headerSearchInput: '[data-ps-ref="header-search-input"]',
  headerSearchScope: '[data-ps-ref="header-search-scope"]',
  headerSearchScopeIcon: '[data-ps-ref="header-search-scope-icon"]',
  headerSearchType: '[data-ps-ref="header-search-type"]',
  setSearchType: '[data-ps-action="set-search-type"]',
  quickAccess: '[data-ps-ref="quick-access"]',
  quickAccessLink: '[data-ps-ref="quick-access-link"]',
  addQuickAccess: '[data-ps-action="add-quick-access"]',
  removeQuickAccess: '[data-ps-action="remove-quick-access"]',
  confirmRemoveQuickAccess: '[data-ps-action="confirm-remove-quick-access"]',
  quickAccessAdd: '[data-ps-ref="quick-access-add"]',
  quickAccessAddForm: '[data-ps-ref="quick-access-add-form"]',
  quickAccessName: '[data-ps-ref="quick-access-name"]',
  quickAccessNewTab: '[data-ps-ref="quick-access-new-tab"]',
  quickAccessError: '[data-ps-ref="quick-access-error"]',
  quickAccessRemove: '[data-ps-ref="quick-access-remove"]',
  quickAccessRemoveMessage: '[data-ps-ref="quick-access-remove-message"]',
  quickAccessStatus: '[data-ps-ref="quick-access-status"]',
  // Bootstrap's own attributes: its plugins read their options from data-bs-*
  tooltip: '[data-bs-toggle="tooltip"]',
  dropdownToggle: '[data-bs-toggle="dropdown"]',
};
