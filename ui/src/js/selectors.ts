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
  // <twig:ui:ShowcaseModal>, opened when the page loads
  showcaseModal: '[data-ps-ref="showcase-modal"]',
  kpiToRefresh: '[data-ps-ref="kpi"][data-ps-data-refresh-url]',
  kpiValue: '[data-ps-ref="kpi-value"]',
  paginationJump: '[data-ps-action~="pagination-jump"]',
  // A <twig:ui:Grid>: its Clear filters, and the results summary its links land on
  gridResetFilters: '[data-ps-action~="grid-reset-filters"]',
  gridApplyFilters: '[data-ps-action~="grid-apply-filters"]',
  gridFilterRow: '[data-ps-ref="grid-filter-row"]',
  grid: '[data-ps-ref="grid"]',
  gridSelectAll: '[data-ps-action~="grid-select-all"]',
  gridSelectRow: '[data-ps-action~="grid-select-row"]',
  gridSelectionCount: '[data-ps-ref="grid-selection-count"]',
  gridBulk: '[data-ps-ref="grid-bulk"]',
  gridBulkActions: '[data-ps-ref="grid-bulk-actions"]',
  gridClearSelection: '[data-ps-action~="grid-clear-selection"]',
  gridBulkButton: '[data-ps-action~="grid-bulk-button"]',
  gridBulkModal: '[data-ps-action~="grid-bulk-modal"]',
  gridResults: '[data-ps-ref="grid-results"]',
  gridRowLink: '[data-ps-action~="grid-row-link"]',
  gridClickableCell: '[data-ps-ref="grid-clickable-cell"]',
  gridPreview: '[data-ps-action~="grid-preview"]',
  gridToggle: '[data-ps-action~="grid-toggle"]',
  gridPosition: '[data-ps-ref="grid-position"]',
  gridMove: '[data-ps-action~="grid-move"]',
  gridDrag: '[data-ps-action~="grid-drag"]',
  gridPreviewRow: '[data-ps-ref="grid-preview"]',
  gridActionForm: '[data-ps-ref="grid-action-form"]',
  gridPreviewContent: '[data-ps-target="grid-preview-content"]',
  gridPreviewRetry: '[data-ps-action~="grid-preview-retry"]',
  // A button or a link that asks first (confirm-dialog.ts), and the page's one <twig:ui:ConfirmDialog>
  confirmTrigger: '[data-ps-confirm]',
  confirmDialog: '[data-ps-ref="confirm-dialog"]',
  confirmMessage: '[data-ps-target="confirm-message"]',
  confirmAccept: '[data-ps-ref="confirm-accept"]',
  confirmCancel: '[data-ps-ref="confirm-cancel"]',
  // A <twig:ui:Modal>'s title, a script can rename it
  modalTitle: '[data-ps-ref="modal-title"]',
  // The page's live region (<twig:ui:Announcer>, announcer.ts)
  announcer: '[data-ps-target="announcer"]',
  flashAlert: '[data-ps-ref="flash-alert"]',
  // A form-level error (ui_kit_layout.html.twig, form_errors): an expired token, a constraint on the whole form
  formError: '[data-ps-ref="form-error"]',
  // A field the server or the client marked invalid: its ARIA state, which form-validation.ts and the form theme set
  invalidField: 'form [aria-invalid="true"]',
  // What the keyboard can reach
  focusable:
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  submitSpinner: '[data-ps-ref="submit-spinner"]',
  busyText: '[data-ps-ref="busy-text"]',
  // A button waiting for the server (busy-button.ts); a form being sent has data-ps-state="loading" too, not aria-disabled
  busyButton: '[data-ps-state="loading"][aria-disabled="true"]',
  headerSearch: '[data-ps-ref="header-search"]',
  headerSearchInput: '[data-ps-ref="header-search-input"]',
  headerSearchScope: '[data-ps-ref="header-search-scope"]',
  headerSearchScopeIcon: '[data-ps-ref="header-search-scope-icon"]',
  headerSearchType: '[data-ps-ref="header-search-type"]',
  setSearchType: '[data-ps-action="set-search-type"]',
  notifications: '[data-ps-ref="notifications"]',
  notificationsTotal: '[data-ps-ref="notifications-total"]',
  notificationsCount: '[data-ps-ref="notifications-count"]',
  notificationsList: '[data-ps-ref="notifications-list"]',
  notificationsPanel: '[data-ps-ref="notifications-panel"]',
  notificationsEmpty: '[data-ps-ref="notifications-empty"]',
  notificationsEmptyTitle: '[data-ps-ref="notifications-empty-title"]',
  notificationsEmptyTip: '[data-ps-ref="notifications-empty-tip"]',
  notificationsIcons: '[data-ps-ref="notifications-icons"]',
  filterNotifications: '[data-ps-action="filter-notifications"]',
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
  quickAccessErrorMessage: '[data-ps-ref="quick-access-error-message"]',
  quickAccessRemove: '[data-ps-ref="quick-access-remove"]',
  quickAccessRemoveMessage: '[data-ps-ref="quick-access-remove-message"]',
  quickAccessRemoveError: '[data-ps-ref="quick-access-remove-error"]',
  quickAccessRemoveErrorMessage: '[data-ps-ref="quick-access-remove-error-message"]',
  // Bootstrap's own attributes: its plugins read their options from data-bs-*
  // data-ps-action="tooltip": the box of a dropdown (Bootstrap allows one component per element, so not on its toggle)
  tooltip: '[data-bs-toggle="tooltip"], [data-ps-action~="tooltip"]',
  dropdownTooltip: '[data-ps-action~="tooltip"]',
  scrollFade: '[data-ps-action~="scroll-fade"]',
  openDropdownToggle: '[data-bs-toggle="dropdown"][aria-expanded="true"]',
  dropdownToggle: '[data-bs-toggle="dropdown"]',
} as const;
