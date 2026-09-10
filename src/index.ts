/**
 * Common Component Library — Vue 3 + TypeScript
 * Design language: Stripe-inspired, defined in /DESIGN.md
 *
 * Usage:
 *   import { CcButton, CcInput } from 'common-component-library-vue'
 *   or
 *   import { install as CcLibrary } from 'common-component-library-vue'
 *   app.use(CcLibrary)
 */

import type { App } from 'vue'

import CcButton from './components/Button/CcButton.vue'
import CcInput from './components/Input/CcInput.vue'
import CcTextarea from './components/Textarea/CcTextarea.vue'
import CcSelect from './components/Select/CcSelect.vue'
import CcSwitch from './components/Switch/CcSwitch.vue'
import CcCheckbox from './components/Checkbox/CcCheckbox.vue'
import CcRadio from './components/Radio/CcRadio.vue'
import CcCard from './components/Card/CcCard.vue'
import CcTag from './components/Tag/CcTag.vue'
import CcBadge from './components/Badge/CcBadge.vue'
import CcAlert from './components/Alert/CcAlert.vue'
import CcModal from './components/Modal/CcModal.vue'
import CcTooltip from './components/Tooltip/CcTooltip.vue'
import CcSpinner from './components/Spinner/CcSpinner.vue'
import CcDivider from './components/Divider/CcDivider.vue'
import CcTable from './components/Table/CcTable.vue'

export {
  CcButton,
  CcInput,
  CcTextarea,
  CcSelect,
  CcSwitch,
  CcCheckbox,
  CcRadio,
  CcCard,
  CcTag,
  CcBadge,
  CcAlert,
  CcModal,
  CcTooltip,
  CcSpinner,
  CcDivider,
  CcTable,
}

export type { CcSelectOption } from './components/Select/CcSelect.vue'
export type { CcTableColumn, CcTableDensity } from './components/Table/CcTable.vue'

/** Design tokens (CSS custom properties) — import once in your app entry */
import './styles/tokens.css'
import './styles/base.css'

/** Optional plugin for `app.use()` registration */
export function install(app: App) {
  const registry: Array<[string, unknown]> = [
    ['CcButton', CcButton],
    ['CcInput', CcInput],
    ['CcTextarea', CcTextarea],
    ['CcSelect', CcSelect],
    ['CcSwitch', CcSwitch],
    ['CcCheckbox', CcCheckbox],
    ['CcRadio', CcRadio],
    ['CcCard', CcCard],
    ['CcTag', CcTag],
    ['CcBadge', CcBadge],
    ['CcAlert', CcAlert],
    ['CcModal', CcModal],
    ['CcTooltip', CcTooltip],
    ['CcSpinner', CcSpinner],
    ['CcDivider', CcDivider],
    ['CcTable', CcTable],
  ]
  for (const [name, component] of registry) {
    app.component(name, component as never)
  }
}

export default {
  install,
  ...{
    CcButton,
    CcInput,
    CcTextarea,
    CcSelect,
    CcSwitch,
    CcCheckbox,
    CcRadio,
    CcCard,
    CcTag,
    CcBadge,
    CcAlert,
    CcModal,
    CcTooltip,
    CcSpinner,
    CcDivider,
    CcTable,
  },
}
