<script setup lang="ts">
/**
 * CcMenuList — CcMenus 的内部递归子列表组件。
 * 通过 SFC 隐式自引用递归渲染树形菜单，样式统一使用组件库令牌（--cc-*），适配全部主题。
 */
import type { CcMenuNode } from './CcMenus.vue'

defineProps<{
  nodes: CcMenuNode[]
  expandedIds: Set<number>
  value?: number | string
}>()

const emit = defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'select', node: CcMenuNode): void
  (e: 'row-click', node: CcMenuNode): void
}>()
</script>

<template>
  <ul class="cc-menus__list">
    <li v-for="node in nodes" :key="node.id" class="cc-menus__item">
      <button
        type="button"
        class="cc-menus__row"
        :class="{ 'cc-menus__row--active': node.id === value }"
        @click="emit('row-click', node)"
      >
        <slot :node="node" :level="node.menuLevel ?? 0">
          <span class="cc-menus__name">{{ node.name }}</span>
        </slot>
        <svg
          v-if="node.children && node.children.length > 0"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          class="cc-menus__chevron"
          :class="{ 'cc-menus__chevron--open': expandedIds.has(node.id) }"
          aria-hidden="true"
        >
          <path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <CcMenuList
        v-if="node.children && node.children.length > 0 && expandedIds.has(node.id)"
        class="cc-menus__list--nested"
        :nodes="node.children"
        :expanded-ids="expandedIds"
        :value="value"
        @toggle="(id) => emit('toggle', id)"
        @select="(child) => emit('select', child)"
        @row-click="(child) => emit('row-click', child)"
      />
    </li>
  </ul>
</template>

<style scoped>
.cc-menus__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cc-menus__list--nested {
  margin-top: 2px;
  margin-left: 14px;
  padding-left: 10px;
  border-left: 1px solid var(--cc-hairline);
}

.cc-menus__row {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 0;
  border-radius: var(--cc-radius-sm);
  background: transparent;
  padding: 7px 10px;
  color: var(--cc-ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.cc-menus__row:hover {
  background-color: var(--cc-canvas-soft);
}

.cc-menus__row--active {
  background-color: var(--cc-primary-subdued);
  color: var(--cc-primary-deep);
  font-weight: 500;
}

.cc-menus__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cc-menus__chevron {
  flex-shrink: 0;
  color: var(--cc-ink-mute);
  transition: transform 0.2s ease;
}

.cc-menus__chevron--open {
  transform: rotate(90deg);
}
</style>
