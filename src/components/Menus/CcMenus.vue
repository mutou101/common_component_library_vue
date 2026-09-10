<script setup lang="ts">
/**
 * CcMenus — 布局菜单组件（Stripe 设计语言）
 * 特性：
 * - 公司 Logo 插槽（#logo）与自定义品牌区
 * - 菜单栏显示位置可切换：左侧边栏（left，默认）或顶部导航（top）
 * - 树形菜单：扁平数据自动组装树，左侧递归展开/收起，顶部 hover 展开二级下拉
 * - 自定义菜单项（#menu-item 插槽，接收当前节点与层级）
 * - 用户信息下拉：头像 + 昵称 + 主题风格切换（内置多主题）+ 退出登录
 * - 主题选择持久化到 localStorage（可通过 themeStorageKey 自定义键名）
 */
import { computed, onMounted, ref, watch } from 'vue'
import { CC_THEMES, CC_THEME_LABELS, getTheme, setTheme, type CcTheme } from '../../theme'
import CcMenuList from './CcMenuList.vue'
import CcSelect from '../Select/CcSelect.vue'

/** 菜单树节点（CcMenuList 递归渲染的数据结构）。 */
export interface CcMenuNode {
  id: number
  /** 菜单名称。 */
  name: string
  /** 权限声明/路由标识。 */
  menuClaim?: string
  /** 层级（0=一级，1=二级…）。 */
  menuLevel?: number
  /** 父级菜单 Id（0=顶级）。 */
  parentMenuId?: number
  /** 同级排序号。 */
  orderNumber?: number
  /** 备注。 */
  remark?: string
  /** 子菜单（扁平数据由组件自动组装，也可直接传入）。 */
  children?: CcMenuNode[]
}

/** 用户信息（用于头像与下拉展示）。 */
export interface CcMenusUser {
  displayName?: string
  username?: string
  /** 用户头像图片地址；未提供时回退为姓名首字母圆形。 */
  avatarUrl?: string
}

const props = withDefaults(
  defineProps<{
    /** 菜单数据（扁平列表或已组装的树，组件自动组装树）。 */
    menus: CcMenuNode[]
    /** 菜单栏显示位置：left=左侧边栏，top=顶部导航。 */
    position?: 'top' | 'left'
    /** 当前用户信息。 */
    user?: CcMenusUser | null
    /** 主题持久化键名（默认 cc-menus-theme）。 */
    themeStorageKey?: string
    /** 当前激活的菜单 Id（用于高亮选中项）。 */
    activeMenuId?: number
    /** 初始是否默认展开所有含子级的菜单（左侧布局）。 */
    defaultExpanded?: boolean
  }>(),
  {
    position: 'left',
    user: null,
    themeStorageKey: 'cc-menus-theme',
    activeMenuId: undefined,
    defaultExpanded: true,
  },
)

const emit = defineEmits<{
  (e: 'menu-click', menu: CcMenuNode): void
  (e: 'logout'): void
}>()

/* ------------------------------- 菜单树 ------------------------------- */

/** 扁平数据组装为树：按 parentMenuId 挂接子级，找不到父级的按 menuLevel 归为顶级。 */
function buildTree(list: CcMenuNode[]): CcMenuNode[] {
  const nodes = list
    .filter((menu) => menu.id !== undefined)
    .map((menu) => ({ ...menu, children: menu.children ? [...menu.children] : undefined }))

  const byId = new Map<number, CcMenuNode>()
  for (const node of nodes) {
    byId.set(node.id, node)
  }

  const roots: CcMenuNode[] = []
  for (const node of nodes) {
    const parentId = node.parentMenuId ?? 0
    const parent = byId.get(parentId)
    if (parent && parent.id !== node.id) {
      parent.children = parent.children ?? []
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  }

  const sortRecursive = (list: CcMenuNode[]): void => {
    list.sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0) || a.id - b.id)
    for (const node of list) {
      if (node.children && node.children.length) {
        sortRecursive(node.children)
      }
    }
  }
  sortRecursive(roots)

  return roots
}

const tree = computed(() => buildTree(props.menus))

/** 当前展开的节点 Id 集合。 */
const expandedIds = ref<Set<number>>(new Set())

function hasChildren(node: CcMenuNode): boolean {
  return Boolean(node.children && node.children.length > 0)
}

function onToggle(id: number): void {
  const next = new Set(expandedIds.value)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  expandedIds.value = next
}

function onSelect(node: CcMenuNode): void {
  if (!hasChildren(node)) {
    emit('menu-click', node)
  }
}

function onRowClick(node: CcMenuNode): void {
  if (hasChildren(node)) {
    onToggle(node.id)
  } else {
    emit('menu-click', node)
  }
}

/* ------------------------------- 主题风格 ------------------------------- */

const theme = ref<CcTheme>(getTheme())
const themeOptions = CC_THEMES.map((value) => ({ label: CC_THEME_LABELS[value], value }))

/** 切换主题：更新组件库令牌并持久化，下次进入保持。 */
watch(theme, (next) => {
  setTheme(next)
  localStorage.setItem(props.themeStorageKey, next)
})

/* ------------------------------- 用户下拉 ------------------------------- */

const userOpen = ref(false)

const userTitle = computed(() => props.user?.displayName ?? props.user?.username ?? '未命名用户')
const userInitial = computed(() => userTitle.value.charAt(0).toUpperCase())

function onLogout(): void {
  userOpen.value = false
  emit('logout')
}

/* ------------------------------- 生命周期 ------------------------------- */

onMounted(() => {
  const saved = localStorage.getItem(props.themeStorageKey)
  if (saved && (CC_THEMES as readonly string[]).includes(saved)) {
    theme.value = saved as CcTheme
  }
  if (props.defaultExpanded) {
    const collect = (nodes: CcMenuNode[]): Set<number> => {
      const ids = new Set<number>()
      for (const node of nodes) {
        if (hasChildren(node)) {
          ids.add(node.id)
          for (const id of collect(node.children ?? [])) {
            ids.add(id)
          }
        }
      }
      return ids
    }
    expandedIds.value = collect(tree.value)
  }
})
</script>

<template>
  <div class="cc-menus" :class="`cc-menus--${position}`">
    <!-- 品牌区：公司 Logo 插槽 -->
    <div class="cc-menus__brand">
      <slot name="logo">
        <span class="cc-menus__brand-default">Company</span>
      </slot>
    </div>

    <!-- 菜单导航 -->
    <nav class="cc-menus__nav">
      <!-- 左侧布局：递归树形菜单 -->
      <CcMenuList
        v-if="position === 'left'"
        :nodes="tree"
        :expanded-ids="expandedIds"
        :value="activeMenuId"
        :show-indent-line="false"
        @toggle="onToggle"
        @select="onSelect"
        @row-click="onRowClick"
      >
        <template #default="{ node, level }">
          <slot name="menu-item" :menu="node" :level="level">{{ node.name }}</slot>
        </template>
      </CcMenuList>

      <!-- 顶部布局：横排一级 + hover 二级下拉 -->
      <template v-else>
        <ul class="cc-menus__topnav">
          <li v-for="node in tree" :key="node.id" class="cc-menus__topnav-item">
            <button
              type="button"
              class="cc-menus__topnav-btn"
              @click="onRowClick(node)"
            >
              <slot name="menu-item" :menu="node" :level="0">{{ node.name }}</slot>
              <svg
                v-if="hasChildren(node)"
                class="cc-menus__caret"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>

            <div v-if="hasChildren(node)" class="cc-menus__dropdown">
              <CcMenuList
                :nodes="node.children ?? []"
                :expanded-ids="expandedIds"
                :value="activeMenuId"
                :show-indent-line="false"
                @toggle="onToggle"
                @select="onSelect"
                @row-click="onRowClick"
              >
                <template #default="{ node: child, level }">
                  <slot name="menu-item" :menu="child" :level="level">{{ child.name }}</slot>
                </template>
              </CcMenuList>
            </div>
          </li>
        </ul>
      </template>
    </nav>

    <!-- 弹性占位：把用户信息推到右侧（顶部）/ 底部（左侧） -->
    <div class="cc-menus__spacer" />

    <!-- 用户信息下拉 -->
    <div class="cc-menus__user">
      <button
        type="button"
        class="cc-menus__user-btn"
        :aria-expanded="userOpen"
        aria-haspopup="menu"
        @click="userOpen = !userOpen"
      >
        <img
          v-if="props.user?.avatarUrl"
          class="cc-menus__avatar cc-menus__avatar--img"
          :src="props.user.avatarUrl"
          alt=""
        />
        <span v-else class="cc-menus__avatar">{{ userInitial }}</span>
        <span class="cc-menus__username">{{ userTitle }}</span>
        <svg
          class="cc-menus__caret"
          :class="{ 'cc-menus__caret--open': userOpen }"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div v-if="userOpen" class="cc-menus__dropdown cc-menus__dropdown--user" role="menu">
        <div class="cc-menus__user-info">
          <p class="cc-menus__user-name">{{ userTitle }}</p>
          <p v-if="props.user?.username" class="cc-menus__user-account">{{ props.user.username }}</p>
        </div>

        <div class="cc-menus__theme">
          <p class="cc-menus__theme-label">主题风格</p>
          <CcSelect v-model="theme" :options="themeOptions" />
        </div>

        <button type="button" class="cc-menus__logout" @click="onLogout">退出登录</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cc-menus {
  display: flex;
  color: var(--cc-ink);
  background: var(--cc-canvas);
}

/* ---------- 左侧布局 ---------- */
.cc-menus--left {
  flex-direction: column;
  width: 240px;
  min-height: 100vh;
  border-right: 1px solid var(--cc-border);
  background: var(--cc-canvas-soft);
}

.cc-menus--left .cc-menus__nav {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.cc-menus--left .cc-menus__spacer {
  display: none;
}

.cc-menus--left .cc-menus__user {
  border-top: 1px solid var(--cc-border);
  padding: 8px 12px;
}

/* ---------- 顶部布局 ---------- */
.cc-menus--top {
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 56px;
  padding: 0 20px;
  border-bottom: 1px solid var(--cc-border);
}

.cc-menus--top .cc-menus__nav {
  margin-left: 24px;
}

.cc-menus--top .cc-menus__spacer {
  flex: 1;
}

/* ---------- 品牌区 ---------- */
.cc-menus__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.cc-menus--left .cc-menus__brand {
  height: 56px;
  padding: 0 20px;
  border-bottom: 1px solid var(--cc-border);
}

.cc-menus__brand-default {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.3px;
}

/* ---------- 顶部横排导航 ---------- */
.cc-menus__topnav {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.cc-menus__topnav-item {
  position: relative;
}

.cc-menus__topnav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--cc-ink);
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease;
}

.cc-menus__topnav-btn:hover {
  background: var(--cc-canvas-soft);
}

.cc-menus__caret {
  flex-shrink: 0;
  color: var(--cc-ink-mute);
  transition: transform 0.2s ease;
}

.cc-menus__caret--open {
  transform: rotate(180deg);
}

/* ---------- 下拉面板（顶部二级 + 用户） ---------- */
.cc-menus__dropdown {
  display: none;
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 168px;
  padding: 6px;
  border: 1px solid var(--cc-border);
  border-radius: 12px;
  background: var(--cc-canvas);
  box-shadow: var(--cc-shadow-level-2);
  z-index: 40;
}

.cc-menus__topnav-item:hover .cc-menus__dropdown {
  display: block;
}

/* ---------- 用户信息 ---------- */
.cc-menus__user {
  position: relative;
  flex-shrink: 0;
}

.cc-menus__user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: transparent;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.cc-menus__user-btn:hover {
  background: var(--cc-canvas-soft);
}

.cc-menus__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  color: var(--cc-primary-contrast);
  background: var(--cc-primary);
}

.cc-menus__avatar--img {
  object-fit: cover;
}

.cc-menus__username {
  max-width: 140px;
  overflow: hidden;
  font-size: 13.5px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- 用户下拉面板 ---------- */
.cc-menus__dropdown--user {
  display: block;
  right: 0;
  left: auto;
  width: 272px;
  padding: 0;
  overflow: hidden;
}

/* 左侧布局：用户按钮贴近边栏右缘，向右展开避免溢出屏幕左侧。 */
.cc-menus--left .cc-menus__dropdown--user {
  right: auto;
  left: 0;
  bottom: calc(100% + 8px);
  top: auto;
}

.cc-menus__user-info {
  padding: 14px 16px;
  border-bottom: 1px solid var(--cc-border);
}

.cc-menus__user-name {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.cc-menus__user-account {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--cc-ink-mute);
}

.cc-menus__theme {
  padding: 14px 16px;
}

.cc-menus__theme-label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--cc-ink-mute);
}

.cc-menus__logout {
  display: block;
  width: 100%;
  padding: 10px 16px;
  font-size: 13px;
  text-align: left;
  color: var(--cc-error);
  background: transparent;
  border: none;
  border-top: 1px solid var(--cc-border);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.cc-menus__logout:hover {
  background: var(--cc-canvas-soft);
}
</style>
