<script setup lang="ts">
/**
 * CcTable — data table with column management.
 *
 * Features:
 *  1. Column drag-and-drop reordering (persisted to localStorage)
 *  2. Column show/hide + table density (large / medium / small) (persisted to localStorage)
 *  3. Fixed (pinned) columns on left / right — not draggable, not hideable
 *  4. Multi-condition filters that update table data reactively
 *  5. Built-in pagination
 *  6. Row multi-select via a leading checkbox column
 *
 * Persistence: order / visibility / density are saved under
 * `cc-table:<tableKey>` in localStorage and restored on next visit.
 */
import { computed, onMounted, reactive, ref, watch } from 'vue'
import CcButton from '../Button/CcButton.vue'
import CcCheckbox from '../Checkbox/CcCheckbox.vue'

export type CcTableDensity = 'large' | 'medium' | 'small'

export interface CcTableColumn {
  /** unique key — also the row field name used for cell rendering */
  key: string
  /** header title */
  title: string
  /** column width in px (default 140) */
  width?: number
  /** pin column: 'left' | 'right' — pinned columns cannot be dragged or hidden */
  fixed?: 'left' | 'right'
  /** show a filter control for this column */
  filterable?: boolean
  /** 'text' = contains match (default) · 'select' = exact match against filterOptions */
  filterType?: 'text' | 'select'
  filterOptions?: Array<{ label: string; value: string | number }>
  /** named slot for custom cell rendering */
  slot?: string
  /** custom cell text formatter */
  formatter?: (value: unknown, row: Record<string, unknown>) => string
  align?: 'left' | 'center' | 'right'
}

interface CcTableFilterOption {
  label: string
  value: string | number
}

interface RenderColumn {
  key: string
  title: string
  width: number
  slot: string
  align: string
  fixed?: 'left' | 'right'
  filterable?: boolean
  filterType?: 'text' | 'select'
  filterOptions?: CcTableFilterOption[]
  formatter?: (value: unknown, row: Record<string, unknown>) => string
  isSelection?: boolean
  isLastLeftFixed?: boolean
  left?: number
  right?: number
}

interface PersistShape {
  v: number
  order: string[]
  visibility: Record<string, boolean>
  density: CcTableDensity
}

const props = withDefaults(
  defineProps<{
    columns: CcTableColumn[]
    data: Array<Record<string, unknown>>
    /** row identity field (default 'id') */
    rowKey?: string
    /** localStorage namespace — use a stable unique key per table */
    tableKey?: string
    /** render the leading selection column */
    showSelection?: boolean
    pageSizeOptions?: number[]
    defaultDensity?: CcTableDensity
    emptyText?: string
    maxHeight?: string
  }>(),
  {
    rowKey: 'id',
    tableKey: 'default',
    showSelection: true,
    pageSizeOptions: () => [10, 20, 50],
    defaultDensity: 'medium',
    emptyText: '暂无数据',
    maxHeight: undefined,
  },
)

const selectedKeys = defineModel<string[]>('selectedKeys', { default: () => [] })

const emit = defineEmits<{
  (e: 'selection-change', keys: string[], rows: Array<Record<string, unknown>>): void
}>()

const SELECTION_KEY = '__selection__'
const SELECTION_WIDTH = 48
const DENSITY_OPTIONS: Array<{ label: string; value: CcTableDensity }> = [
  { label: '大', value: 'large' },
  { label: '中', value: 'medium' },
  { label: '小', value: 'small' },
]

/* ------------------------------------------------------------------ */
/*  Persisted state: order / visibility / density                      */
/* ------------------------------------------------------------------ */

const storageKey = computed(() => `cc-table:${props.tableKey}`)

const columnOrder = ref<string[]>([])
const visibility = reactive<Record<string, boolean>>({})
const density = ref<CcTableDensity>(props.defaultDensity)

const settingsOpen = ref(false)

function loadPersistedState() {
  let saved: PersistShape | null = null
  try {
    const raw = localStorage.getItem(storageKey.value)
    if (raw) saved = JSON.parse(raw) as PersistShape
  } catch {
    saved = null
  }

  const keys = props.columns.map(c => c.key)
  const savedOrder = (saved?.order ?? []).filter(k => keys.includes(k))
  columnOrder.value = [...savedOrder, ...keys.filter(k => !savedOrder.includes(k))]

  for (const key of keys) {
    visibility[key] = saved?.visibility?.[key] ?? true
  }

  if (saved?.density && DENSITY_OPTIONS.some(d => d.value === saved.density)) {
    density.value = saved.density
  }
}

function savePersistedState() {
  const payload: PersistShape = {
    v: 1,
    order: columnOrder.value,
    visibility: { ...visibility },
    density: density.value,
  }
  try {
    localStorage.setItem(storageKey.value, JSON.stringify(payload))
  } catch {
    /* localStorage unavailable (private mode / quota) — skip persistence */
  }
}

function resetSettings() {
  columnOrder.value = props.columns.map(c => c.key)
  for (const key of props.columns.map(c => c.key)) visibility[key] = true
  density.value = props.defaultDensity
  settingsOpen.value = false
}

watch([columnOrder, visibility, density], savePersistedState, { deep: true })

/* keep new columns (added later by the consumer) in sync */
watch(
  () => props.columns.map(c => c.key),
  keys => {
    for (const key of keys) {
      if (!columnOrder.value.includes(key)) columnOrder.value.push(key)
      if (visibility[key] === undefined) visibility[key] = true
    }
  },
)

/* ------------------------------------------------------------------ */
/*  Column layout: selection + left-fixed + movable + right-fixed      */
/* ------------------------------------------------------------------ */

function columnWidth(column: CcTableColumn): number {
  return column.width ?? 140
}

const toggleableColumns = computed(() => props.columns.filter(c => !c.fixed))

const movableColumns = computed(() => {
  const rank = new Map(columnOrder.value.map((key, index) => [key, index]))
  return props.columns
    .filter(c => !c.fixed)
    .filter(c => visibility[c.key] !== false)
    .sort((a, b) => (rank.get(a.key) ?? 0) - (rank.get(b.key) ?? 0))
})

const renderColumns = computed<RenderColumn[]>(() => {
  const list: RenderColumn[] = []
  const toRender = (c: CcTableColumn): RenderColumn => ({
    key: c.key,
    title: c.title,
    width: columnWidth(c),
    slot: c.slot ?? '',
    align: c.align ?? 'left',
    fixed: c.fixed,
    filterable: c.filterable,
    filterType: c.filterType ?? 'text',
    filterOptions: c.filterOptions,
    formatter: c.formatter,
  })

  // selection column is always pinned left
  if (props.showSelection) {
    list.push({ key: SELECTION_KEY, title: '', width: SELECTION_WIDTH, slot: '', align: 'center', left: 0, isSelection: true })
  }

  // left-fixed columns, in definition order
  const leftFixedCols = props.columns.filter(col => col.fixed === 'left')
  let leftAcc = props.showSelection ? SELECTION_WIDTH : 0
  leftFixedCols.forEach((c, index) => {
    list.push({ ...toRender(c), left: leftAcc, isLastLeftFixed: index === leftFixedCols.length - 1 })
    leftAcc += columnWidth(c)
  })

  // movable (persisted order, respecting visibility)
  for (const c of movableColumns.value) list.push(toRender(c))

  // right-fixed columns, in definition order, offset computed from the right edge
  const rights = props.columns.filter(col => col.fixed === 'right')
  let rightAcc = 0
  const rightOffsets = new Map<string, number>()
  for (let i = rights.length - 1; i >= 0; i--) {
    rightOffsets.set(rights[i].key, rightAcc)
    rightAcc += columnWidth(rights[i])
  }
  for (const c of rights) list.push({ ...toRender(c), right: rightOffsets.get(c.key) })

  return list
})

/* ------------------------------------------------------------------ */
/*  Column drag & drop (movable columns only)                          */
/* ------------------------------------------------------------------ */

const draggingKey = ref<string | null>(null)
const dropKey = ref<string | null>(null)

function isDraggable(column: RenderColumn): boolean {
  return !column.fixed && !column.isSelection
}

function onDragStart(column: RenderColumn, event: DragEvent) {
  if (!isDraggable(column)) return
  draggingKey.value = column.key
  dropKey.value = null
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', column.key)
  }
}

function onDragOver(column: RenderColumn, event: DragEvent) {
  if (!draggingKey.value || column.key === draggingKey.value || !isDraggable(column)) return
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  dropKey.value = column.key
}

function onDrop(column: RenderColumn, event: DragEvent) {
  event.preventDefault()
  const from = draggingKey.value
  if (!from || from === column.key) return

  const list = movableColumns.value.map(c => c.key)
  const fromIndex = list.indexOf(from)
  const toIndex = list.indexOf(column.key)
  if (fromIndex < 0 || toIndex < 0) return

  const next = [...list]
  next.splice(fromIndex, 1)
  const adjustedIndex = fromIndex < toIndex ? toIndex - 1 : toIndex
  next.splice(adjustedIndex, 0, from)

  const leftKeys = props.columns.filter(c => c.fixed === 'left').map(c => c.key)
  const rightKeys = props.columns.filter(c => c.fixed === 'right').map(c => c.key)
  columnOrder.value = [...leftKeys, ...next, ...rightKeys]
  dropKey.value = null
}

function onDragEnd() {
  draggingKey.value = null
  dropKey.value = null
}

/* ------------------------------------------------------------------ */
/*  Filters — multi-condition, reactively re-filters the data          */
/* ------------------------------------------------------------------ */

const filters = reactive<Record<string, string>>({})

const filterableColumns = computed(() =>
  renderColumns.value.filter(c => c.filterable && !c.isSelection),
)

const hasActiveFilters = computed(() => Object.values(filters).some(v => v !== ''))

const filteredRows = computed(() => {
  const entries = Object.entries(filters).filter(([, value]) => value !== '')
  if (!entries.length) return props.data

  return props.data.filter(row =>
    entries.every(([key, value]) => {
      const cell = row[key]
      if (cell == null) return false
      const col = props.columns.find(c => c.key === key)
      if (col?.filterType === 'select') return String(cell) === value
      return String(cell).toLowerCase().includes(value.toLowerCase())
    }),
  )
})

function resetFilters() {
  for (const key of Object.keys(filters)) filters[key] = ''
  page.value = 1
}

/* ------------------------------------------------------------------ */
/*  Pagination                                                         */
/* ------------------------------------------------------------------ */

const pageSize = ref(props.pageSizeOptions[0] ?? 10)
const page = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)))

const pagedRows = computed(() =>
  filteredRows.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value),
)

const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = page.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set<number>([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b)
  const result: Array<number | '…'> = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) result.push('…')
    result.push(p)
    prev = p
  }
  return result
})

watch([filteredRows, pageSize], () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})

function goToPage(target: number) {
  page.value = Math.min(Math.max(1, target), totalPages.value)
}

/* ------------------------------------------------------------------ */
/*  Selection                                                          */
/* ------------------------------------------------------------------ */

function keyOf(row: Record<string, unknown>): string {
  const value = row[props.rowKey]
  return value == null ? JSON.stringify(row) : String(value)
}

function isSelected(row: Record<string, unknown>): boolean {
  return selectedKeys.value.includes(keyOf(row))
}

function toggleRow(row: Record<string, unknown>) {
  const key = keyOf(row)
  if (selectedKeys.value.includes(key)) {
    selectedKeys.value = selectedKeys.value.filter(k => k !== key)
  } else {
    selectedKeys.value = [...selectedKeys.value, key]
  }
}

const allPageSelected = computed(
  () => pagedRows.value.length > 0 && pagedRows.value.every(row => isSelected(row)),
)

const somePageSelected = computed(
  () => !allPageSelected.value && pagedRows.value.some(row => isSelected(row)),
)

function toggleAllPage() {
  if (allPageSelected.value) {
    const keys = new Set(pagedRows.value.map(row => keyOf(row)))
    selectedKeys.value = selectedKeys.value.filter(k => !keys.has(k))
  } else {
    const existing = new Set(selectedKeys.value)
    for (const row of pagedRows.value) existing.add(keyOf(row))
    selectedKeys.value = [...existing]
  }
}

watch(
  selectedKeys,
  keys => {
    const rows = keys
      .map(k => props.data.find(row => keyOf(row) === k))
      .filter((row): row is Record<string, unknown> => Boolean(row))
    emit('selection-change', keys, rows)
  },
  { deep: true },
)

/* ------------------------------------------------------------------ */
/*  Cell rendering                                                     */
/* ------------------------------------------------------------------ */

function cellText(column: RenderColumn, row: Record<string, unknown>): string {
  const value = row[column.key]
  if (value == null) return '—'
  if (column.formatter) return column.formatter(value, row)
  return String(value)
}

onMounted(loadPersistedState)
</script>

<template>
  <div class="cc-table">
    <!-- toolbar: filters + column settings -->
    <div class="cc-table__toolbar">
      <div class="cc-table__filters">
        <template v-for="col in filterableColumns" :key="col.key">
          <label
            v-if="col.filterType === 'select'"
            class="cc-table__filter"
          >
            <span class="cc-table__filter-label">{{ col.title }}</span>
            <select
              v-model="filters[col.key]"
              class="cc-table__filter-control"
            >
              <option value="">全部</option>
              <option
                v-for="opt in col.filterOptions"
                :key="String(opt.value)"
                :value="String(opt.value)"
              >{{ opt.label }}</option>
            </select>
          </label>
          <label
            v-else
            class="cc-table__filter"
          >
            <span class="cc-table__filter-label">{{ col.title }}</span>
            <input
              v-model="filters[col.key]"
              class="cc-table__filter-control"
              type="text"
              :placeholder="`搜索${col.title}`"
            >
          </label>
        </template>
        <CcButton
          v-if="hasActiveFilters"
          size="sm"
          variant="ghost"
          @click="resetFilters"
        >
          重置
        </CcButton>
      </div>

      <div class="cc-table__settings">
        <CcButton
          size="sm"
          variant="secondary"
          @click="settingsOpen = !settingsOpen"
        >
          列设置
        </CcButton>

        <template v-if="settingsOpen">
          <div
            class="cc-table__backdrop"
            @click="settingsOpen = false"
          />
          <div class="cc-table__settings-panel">
            <div class="cc-table__settings-section">
              <div class="cc-table__settings-title">表格密度</div>
              <div class="cc-table__density">
                <button
                  v-for="opt in DENSITY_OPTIONS"
                  :key="opt.value"
                  type="button"
                  class="cc-table__density-btn"
                  :class="{ 'cc-table__density-btn--active': density === opt.value }"
                  @click="density = opt.value"
                >{{ opt.label }}</button>
              </div>
            </div>

            <div class="cc-table__settings-section">
              <div class="cc-table__settings-title">显示列</div>
              <div class="cc-table__settings-cols">
                <CcCheckbox
                  v-for="col in toggleableColumns"
                  :key="col.key"
                  v-model="visibility[col.key]"
                >{{ col.title }}</CcCheckbox>
              </div>
            </div>

            <button
              type="button"
              class="cc-table__settings-reset"
              @click="resetSettings"
            >恢复默认</button>
          </div>
        </template>
      </div>
    </div>

    <!-- table body -->
    <div
      class="cc-table__scroll"
      :style="{ maxHeight }"
    >
      <table
        class="cc-table__table"
        :class="`cc-table--${density}`"
      >
        <colgroup>
          <col
            v-for="col in renderColumns"
            :key="col.key"
            :style="{ width: `${col.width}px` }"
          >
        </colgroup>
        <thead>
          <tr>
            <th
              v-for="col in renderColumns"
              :key="col.key"
              class="cc-table__th"
              :class="[
                `cc-table__cell--${col.align}`,
                { 'cc-table__th--fixed-left': col.fixed === 'left' || col.isSelection },
                { 'cc-table__th--fixed-left-end': col.isLastLeftFixed },
                { 'cc-table__th--fixed-right': col.fixed === 'right' },
                { 'cc-table__th--draggable': isDraggable(col) },
                { 'cc-table__th--dragging': draggingKey === col.key },
                { 'cc-table__th--drop-target': dropKey === col.key },
              ]"
              :style="{
                left: col.left != null ? `${col.left}px` : undefined,
                right: col.right != null ? `${col.right}px` : undefined,
              }"
              :draggable="isDraggable(col)"
              @dragstart="onDragStart(col, $event)"
              @dragover="onDragOver(col, $event)"
              @drop="onDrop(col, $event)"
              @dragend="onDragEnd"
            >
              <template v-if="col.isSelection">
                <input
                  type="checkbox"
                  class="cc-table__check"
                  :checked="allPageSelected"
                  :indeterminate="somePageSelected"
                  :aria-label="`选择本页全部`"
                  @change="toggleAllPage"
                >
              </template>
              <template v-else>
                <span class="cc-table__th-title">
                  {{ col.title }}
                  <svg
                    v-if="isDraggable(col)"
                    class="cc-table__drag-handle"
                    width="10"
                    height="14"
                    viewBox="0 0 10 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="3" cy="2.5" r="1" fill="currentColor" />
                    <circle cx="7" cy="2.5" r="1" fill="currentColor" />
                    <circle cx="3" cy="7" r="1" fill="currentColor" />
                    <circle cx="7" cy="7" r="1" fill="currentColor" />
                    <circle cx="3" cy="11.5" r="1" fill="currentColor" />
                    <circle cx="7" cy="11.5" r="1" fill="currentColor" />
                  </svg>
                </span>
              </template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!pagedRows.length">
            <td
              class="cc-table__empty"
              :colspan="renderColumns.length"
            >{{ emptyText }}</td>
          </tr>
          <tr
            v-for="row in pagedRows"
            :key="keyOf(row)"
            class="cc-table__row"
          >
            <td
              v-for="col in renderColumns"
              :key="col.key"
              class="cc-table__td"
              :class="[
                `cc-table__cell--${col.align}`,
                { 'cc-table__td--fixed-left': col.fixed === 'left' || col.isSelection },
                { 'cc-table__td--fixed-left-end': col.isLastLeftFixed },
                { 'cc-table__td--fixed-right': col.fixed === 'right' },
              ]"
              :style="{
                left: col.left != null ? `${col.left}px` : undefined,
                right: col.right != null ? `${col.right}px` : undefined,
              }"
            >
              <input
                v-if="col.isSelection"
                type="checkbox"
                class="cc-table__check"
                :checked="isSelected(row)"
                :aria-label="`选择第 ${keyOf(row)} 行`"
                @change="toggleRow(row)"
              >
              <slot
                v-else-if="col.slot"
                :name="col.slot"
                :row="row"
                :value="row[col.key]"
              />
              <template v-else>{{ cellText(col, row) }}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- footer: pagination -->
    <div class="cc-table__footer">
      <span class="cc-table__total">共 {{ filteredRows.length }} 条</span>

      <div class="cc-table__pager">
        <span class="cc-table__pager-size">每页</span>
        <select
          v-model.number="pageSize"
          class="cc-table__pagesize"
        >
          <option
            v-for="size in pageSizeOptions"
            :key="size"
            :value="size"
          >{{ size }}</option>
        </select>
        <span class="cc-table__pager-size">条</span>

        <button
          type="button"
          class="cc-table__page-btn"
          :disabled="page <= 1"
          aria-label="上一页"
          @click="goToPage(page - 1)"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 4l-4 4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <template v-for="(item, index) in pageNumbers" :key="`${item}-${index}`">
          <button
            v-if="item !== '…'"
            type="button"
            class="cc-table__page-btn cc-table__page-btn--num"
            :class="{ 'cc-table__page-btn--active': page === item }"
            @click="goToPage(item)"
          >{{ item }}</button>
          <span
            v-else
            class="cc-table__page-ellipsis"
          >…</span>
        </template>

        <button
          type="button"
          class="cc-table__page-btn"
          :disabled="page >= totalPages"
          aria-label="下一页"
          @click="goToPage(page + 1)"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cc-table {
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-md);
  font-family: var(--cc-font-family);
}

/* ---------------- toolbar ---------------- */

.cc-table__toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--cc-space-md);
  flex-wrap: wrap;
}

.cc-table__filters {
  display: flex;
  align-items: center;
  gap: var(--cc-space-sm);
  flex-wrap: wrap;
}

.cc-table__filter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--cc-canvas-soft);
  border: 1px solid var(--cc-hairline);
  border-radius: var(--cc-radius-sm);
  padding: 5px 8px 5px 10px;
}

.cc-table__filter-label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--cc-ink-mute);
  white-space: nowrap;
}

.cc-table__filter-control {
  min-height: 24px;
  border: 1px solid transparent;
  border-radius: var(--cc-radius-xs);
  background-color: transparent;
  padding: 2px 4px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 400;
  color: var(--cc-ink);
  outline: none;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.cc-table__filter-control:focus {
  border-color: var(--cc-primary);
  background-color: var(--cc-canvas);
  box-shadow: var(--cc-focus-ring);
}

.cc-table__filter-control::placeholder {
  color: var(--cc-ink-mute);
}

/* ---------------- settings ---------------- */

.cc-table__settings {
  position: relative;
}

.cc-table__backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
}

.cc-table__settings-panel {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  z-index: 50;
  width: 260px;
  background-color: var(--cc-canvas);
  border: 1px solid var(--cc-hairline);
  border-radius: var(--cc-radius-md);
  box-shadow: var(--cc-shadow-level-2);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cc-table__settings-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cc-table__settings-title {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: var(--cc-ink-mute);
}

.cc-table__density {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.cc-table__density-btn {
  border: 1px solid var(--cc-hairline);
  border-radius: var(--cc-radius-sm);
  background-color: var(--cc-canvas);
  padding: 6px 0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 400;
  color: var(--cc-ink-secondary);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    background-color 0.15s ease;
}

.cc-table__density-btn:hover {
  border-color: var(--cc-primary-subdued);
}

.cc-table__density-btn--active {
  border-color: var(--cc-primary);
  background-color: var(--cc-primary-soft);
  color: var(--cc-on-primary);
}

.cc-table__settings-cols {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.cc-table__settings-cols :deep(.cc-checkbox__label) {
  font-size: 14px;
}

.cc-table__settings-reset {
  align-self: flex-start;
  border: none;
  background: none;
  padding: 0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--cc-primary);
  cursor: pointer;
}

.cc-table__settings-reset:hover {
  text-decoration: underline;
}

/* ---------------- table ---------------- */

.cc-table__scroll {
  width: 100%;
  overflow: auto;
  background-color: var(--cc-canvas);
  border: 1px solid var(--cc-hairline);
  border-radius: var(--cc-radius-md);
}

.cc-table__table {
  width: auto;
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}

.cc-table__th,
.cc-table__td {
  box-sizing: border-box;
  text-align: left;
  border-bottom: 1px solid var(--cc-hairline);
  border-right: 1px solid var(--cc-hairline);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cc-table--large .cc-table__th,
.cc-table--large .cc-table__td {
  padding: 16px 20px;
  font-size: 15px;
}

.cc-table--medium .cc-table__th,
.cc-table--medium .cc-table__td {
  padding: 12px 16px;
  font-size: 14px;
}

.cc-table--small .cc-table__th,
.cc-table--small .cc-table__td {
  padding: 8px 12px;
  font-size: 13px;
}

.cc-table__th {
  position: sticky;
  top: 0;
  z-index: 3;
  background-color: var(--cc-canvas-soft);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: var(--cc-ink-mute);
  user-select: none;
}

.cc-table__th-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.cc-table__drag-handle {
  color: var(--cc-ink-mute-2);
  opacity: 0.6;
  flex-shrink: 0;
  line-height: 0;
}

.cc-table__th--draggable {
  cursor: grab;
}

.cc-table__th--draggable:active {
  cursor: grabbing;
}

.cc-table__th--dragging {
  opacity: 0.45;
}

.cc-table__th--drop-target {
  background-color: var(--cc-primary-soft);
  color: var(--cc-on-primary);
}

/* pinned cells keep a solid background and stay above siblings */
.cc-table__th--fixed-left,
.cc-table__td--fixed-left {
  position: sticky;
  z-index: 2;
  background-color: var(--cc-canvas);
}

.cc-table__th--fixed-left {
  z-index: 4;
  background-color: var(--cc-canvas-soft);
}

/* the divider on the right edge of the fixed-left block moves with the sticky cells */
.cc-table__th--fixed-left-end,
.cc-table__td--fixed-left-end {
  border-right-color: var(--cc-hairline-input);
}

.cc-table__th--fixed-right,
.cc-table__td--fixed-right {
  position: sticky;
  z-index: 2;
  background-color: var(--cc-canvas);
  box-shadow: inset 1px 0 0 var(--cc-hairline);
}

.cc-table__th--fixed-right {
  z-index: 4;
  background-color: var(--cc-canvas-soft);
}

/* last column sits at the right edge — no trailing divider */
.cc-table__th:last-child,
.cc-table__td:last-child {
  border-right: none;
}

.cc-table__cell--center {
  text-align: center;
}

.cc-table__cell--right {
  text-align: right;
}

.cc-table__row:last-child .cc-table__td {
  border-bottom: none;
}

.cc-table__row:hover .cc-table__td {
  background-color: var(--cc-canvas-soft);
}

.cc-table__td {
  color: var(--cc-ink);
}

.cc-table__empty {
  padding: 40px 20px !important;
  text-align: center;
  color: var(--cc-ink-mute);
  font-size: 14px;
}

/* ---------------- checkboxes ---------------- */

.cc-table__check {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  margin: 0;
  border: 1px solid var(--cc-hairline-input);
  border-radius: var(--cc-radius-xs);
  background-color: var(--cc-canvas);
  cursor: pointer;
  vertical-align: middle;
  position: relative;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.cc-table__check::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid var(--cc-on-primary);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  transition: transform 0.12s ease;
}

.cc-table__check:checked {
  background-color: var(--cc-primary);
  border-color: var(--cc-primary);
}

.cc-table__check:checked::after {
  transform: rotate(45deg) scale(1);
}

.cc-table__check:indeterminate {
  background-color: var(--cc-primary);
  border-color: var(--cc-primary);
}

.cc-table__check:indeterminate::after {
  left: 4px;
  top: 8px;
  width: 8px;
  height: 0;
  border: solid var(--cc-on-primary);
  border-width: 2px 0 0 0;
  transform: none;
}

.cc-table__check:focus-visible {
  box-shadow: var(--cc-focus-ring);
  outline: none;
}

/* ---------------- footer / pagination ---------------- */

.cc-table__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--cc-space-md);
  flex-wrap: wrap;
}

.cc-table__total {
  font-size: 13px;
  font-weight: 400;
  color: var(--cc-ink-mute);
}

.cc-table__pager {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cc-table__pager-size {
  font-size: 13px;
  color: var(--cc-ink-mute);
}

.cc-table__pagesize {
  min-height: 28px;
  border: 1px solid var(--cc-hairline);
  border-radius: var(--cc-radius-sm);
  background-color: var(--cc-canvas);
  padding: 2px 6px;
  font-family: inherit;
  font-size: 13px;
  color: var(--cc-ink);
  cursor: pointer;
}

.cc-table__page-btn {
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--cc-hairline);
  border-radius: var(--cc-radius-sm);
  background-color: var(--cc-canvas);
  font-family: inherit;
  font-size: 13px;
  color: var(--cc-ink-secondary);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    background-color 0.15s ease;
}

.cc-table__page-btn:hover:not(:disabled) {
  border-color: var(--cc-primary-subdued);
}

.cc-table__page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cc-table__page-btn--num.cc-table__page-btn--active {
  border-color: var(--cc-primary);
  background-color: var(--cc-primary);
  color: var(--cc-on-primary);
}

.cc-table__page-ellipsis {
  padding: 0 2px;
  color: var(--cc-ink-mute);
}
</style>
