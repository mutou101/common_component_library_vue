<script setup lang="ts">
/**
 * Common Component Library — demo / showcase page
 * Design language: Stripe-inspired, defined in /DESIGN.md
 */
import { reactive, ref } from 'vue'
import {
  CC_THEMES,
  CC_THEME_LABELS,
  CcAlert,
  CcBadge,
  CcBarChart,
  CcButton,
  CcCard,
  CcCheckbox,
  CcDivider,
  CcInput,
  CcLineChart,
  CcModal,
  CcPieChart,
  CcRadio,
  CcSelect,
  CcSwitch,
  CcTable,
  CcTag,
  CcTextarea,
  CcTooltip,
  getTheme,
  setTheme,
} from './index'
import type { CcTableColumn, CcTheme } from './index'

/* ------------------------------------------------------------------ */
/* Theme switcher demo state                                          */
/* ------------------------------------------------------------------ */
const themeOptions = CC_THEMES.map((theme) => ({
  label: CC_THEME_LABELS[theme],
  value: theme,
}))
const currentTheme = ref<CcTheme>(getTheme())
const onThemeChange = (value: string | number): void => {
  currentTheme.value = value as CcTheme
  setTheme(currentTheme.value)
}

/* ------------------------------------------------------------------ */
/* Chart demo data                                                     */
/* ------------------------------------------------------------------ */
const chartBarCategories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const chartBarSeries = [
  { name: '门诊', data: [320, 402, 388, 456, 512, 236, 198] },
  { name: '住院', data: [120, 132, 154, 168, 190, 96, 72] },
]
const chartPieData = [
  { name: '内科', value: 428 },
  { name: '外科', value: 356 },
  { name: '儿科', value: 244 },
  { name: '妇产科', value: 198 },
  { name: '急诊', value: 152 },
]
const chartLineCategories = ['9/1', '9/2', '9/3', '9/4', '9/5', '9/6', '9/7', '9/8', '9/9', '9/10']
const chartLineSeries = [{ name: '营收', data: [128, 146, 135, 172, 168, 194, 188, 216, 208, 242] }]

/* ------------------------------------------------------------------ */
/* Demo state                                                          */
/* ------------------------------------------------------------------ */
const form = reactive({
  email: '',
  name: '',
  amount: '1,024.00',
  plan: 'growth',
  interval: 'monthly',
})

const checked = ref(true)
const switchOn = ref(true)
const notifySwitch = ref(true)
const loadingBtn = ref(false)
const modalOpen = ref(false)

const plans = [
  { label: 'Starter', value: 'starter' },
  { label: 'Growth', value: 'growth' },
  { label: 'Scale', value: 'scale' },
]

function simulateLoading() {
  loadingBtn.value = true
  setTimeout(() => (loadingBtn.value = false), 1600)
}

function onTagClose() {
  alert('Tag closed — bind your own handler in production.')
}

/* ------------------------------------------------------------------ */
/* Palette data (from DESIGN.md color tokens)                          */
/* ------------------------------------------------------------------ */
const palette = [
  { name: 'Primary', token: '{colors.primary}', value: '#533afd', role: 'Signature CTA indigo' },
  { name: 'Primary Deep', token: '{colors.primary-deep}', value: '#4434d4', role: 'Gradient mid-stop / press' },
  { name: 'Primary Press', token: '{colors.primary-press}', value: '#2e2b8c', role: 'Pressed state' },
  { name: 'Primary Soft', token: '{colors.primary-soft}', value: '#665efd', role: 'Chart / accent' },
  { name: 'Primary Subdued', token: '{colors.primary-bg-subdued-hover}', value: '#b9b9f9', role: 'Soft tag fill' },
  { name: 'Brand Dark 900', token: '{colors.brand-dark-900}', value: '#1c1e54', role: 'Dark surfaces' },
  { name: 'Ink', token: '{colors.ink}', value: '#0d253d', role: 'Default body text' },
  { name: 'Ink Secondary', token: '{colors.ink-secondary}', value: '#273951', role: 'Secondary text' },
  { name: 'Ink Mute', token: '{colors.ink-mute}', value: '#64748d', role: 'Captions / helpers' },
  { name: 'Canvas', token: '{colors.canvas}', value: '#ffffff', role: 'Page background' },
  { name: 'Canvas Soft', token: '{colors.canvas-soft}', value: '#f6f9fc', role: 'Feature bands' },
  { name: 'Canvas Cream', token: '{colors.canvas-cream}', value: '#f5e9d4', role: 'Warm interlude' },
  { name: 'Hairline', token: '{colors.hairline}', value: '#e3e8ee', role: 'Card / table borders' },
  { name: 'Hairline Input', token: '{colors.hairline-input}', value: '#a8c3de', role: 'Input borders' },
  { name: 'Ruby', token: '{colors.ruby}', value: '#ea2261', role: 'Gradient accent' },
  { name: 'Magenta', token: '{colors.magenta}', value: '#f96bee', role: 'Gradient stop' },
  { name: 'Lemon', token: '{colors.lemon}', value: '#9b6829', role: 'Warm sherbet stop' },
  { name: 'On Primary', token: '{colors.on-primary}', value: '#ffffff', role: 'Text on indigo/navy' },
]

const typeScale = [
  { token: '{typography.display-xxl}', size: '56px', weight: '300', ls: '-1.4px', sample: 'Payments infrastructure', cls: 'cc-text-display-xxl' },
  { token: '{typography.display-xl}', size: '48px', weight: '300', ls: '-0.96px', sample: 'A better way to move money', cls: 'cc-text-display-xl' },
  { token: '{typography.display-lg}', size: '32px', weight: '300', ls: '-0.64px', sample: 'Global payments at your fingertips', cls: 'cc-text-display-lg' },
  { token: '{typography.display-md}', size: '26px', weight: '300', ls: '-0.26px', sample: 'Powerful APIs and tools', cls: 'cc-text-display-md' },
  { token: '{typography.heading-lg}', size: '22px', weight: '300', ls: '-0.22px', sample: 'Growth plan', cls: 'cc-text-heading-lg' },
  { token: '{typography.heading-md}', size: '20px', weight: '300', ls: '-0.2px', sample: 'Integrations that scale with you', cls: 'cc-text-heading-md' },
  { token: '{typography.body-md}', size: '15px', weight: '300', ls: '0', sample: 'Stripe is a suite of payment APIs that powers commerce for businesses of all sizes.', cls: 'cc-text-body-md' },
  { token: '{typography.body-tabular}', size: '14px', weight: '300', ls: '-0.42px · tnum', sample: '$1,024.00 · 12,483 transactions', cls: 'cc-text-body-md tnum' },
  { token: '{typography.caption}', size: '13px', weight: '400', ls: '-0.39px', sample: 'Processing · 4,210 transactions', cls: 'cc-text-caption' },
  { token: '{typography.micro-cap}', size: '10px', weight: '400', ls: '0.1px · caps', sample: 'Powered by the library', cls: 'cc-text-micro-cap' },
]

/* ------------------------------------------------------------------ */
/* Table demo data (CcTable)                                           */
/* ------------------------------------------------------------------ */
const patientNames = ['林晓彤', '陈国栋', '王雅静', '赵志强', '孙丽华', '周明轩', '吴芳', '郑浩然', '冯雨欣', '何俊杰']
const departments = ['内科', '外科', '儿科', '骨科', '妇产科']
const statuses = ['待就诊', '就诊中', '已完成']
const genders = ['女', '男']
const insuranceTypes = ['城镇职工', '城乡居民', '商业保险', '自费']
const bloodTypes = ['A', 'B', 'AB', 'O']
const wards = ['1号楼', '2号楼', '3号楼']
const diagnoses = ['上呼吸道感染', '高血压', '糖尿病', '腰椎间盘突出', '急性阑尾炎', '骨折', '胃炎', '肺炎', '偏头痛', '湿疹']
const doctors = ['李建国', '张丽华', '王志远', '刘思明', '陈晓峰']
const nurses = ['赵敏', '钱静', '孙晓', '李娜']
const statusTagVariant: Record<string, 'soft' | 'outline' | 'solid'> = {
  待就诊: 'outline',
  就诊中: 'solid',
  已完成: 'soft',
}

const patients: Array<Record<string, unknown>> = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  name: `${patientNames[i % patientNames.length]}${Math.floor(i / patientNames.length) ? ` ${Math.floor(i / patientNames.length) + 1}` : ''}`,
  gender: genders[i % genders.length],
  age: 18 + ((i * 7) % 52),
  dept: departments[i % departments.length],
  status: statuses[i % statuses.length],
  doctor: doctors[i % doctors.length],
  nurse: nurses[i % nurses.length],
  ward: wards[i % wards.length],
  bed: `${String((i % 30) + 1).padStart(2, '0')}床`,
  diagnosis: diagnoses[(i * 3) % diagnoses.length],
  time: `2026-09-${String((i % 28) + 1).padStart(2, '0')} ${String(8 + (i % 10)).padStart(2, '0')}:30`,
  fee: 120 + (i * 37) % 680,
  insurance: insuranceTypes[i % insuranceTypes.length],
  phone: `138${String(10000000 + i * 137913).slice(-8)}`,
  bloodType: bloodTypes[i % bloodTypes.length],
}))

const patientColumns: CcTableColumn[] = [
  { key: 'id', title: '就诊号', width: 90, align: 'right', filterable: true },
  { key: 'name', title: '患者姓名', width: 120, fixed: 'left', filterable: true },
  {
    key: 'gender',
    title: '性别',
    width: 80,
    filterable: true,
    filterType: 'select',
    filterOptions: genders.map(g => ({ label: g, value: g })),
  },
  { key: 'age', title: '年龄', width: 80, align: 'right' },
  {
    key: 'dept',
    title: '科室',
    width: 110,
    filterable: true,
    filterType: 'select',
    filterOptions: departments.map(d => ({ label: d, value: d })),
  },
  {
    key: 'status',
    title: '状态',
    width: 100,
    filterable: true,
    filterType: 'select',
    filterOptions: statuses.map(s => ({ label: s, value: s })),
    slot: 'status',
  },
  { key: 'doctor', title: '主治医生', width: 110, filterable: true },
  { key: 'nurse', title: '责任护士', width: 110, filterable: true },
  {
    key: 'ward',
    title: '病房',
    width: 100,
    filterable: true,
    filterType: 'select',
    filterOptions: wards.map(w => ({ label: w, value: w })),
  },
  { key: 'bed', title: '床位', width: 90 },
  { key: 'diagnosis', title: '诊断', width: 150, filterable: true },
  { key: 'time', title: '就诊时间', width: 150 },
  {
    key: 'fee',
    title: '费用',
    width: 100,
    align: 'right',
    formatter: value => `¥ ${Number(value).toFixed(2)}`,
  },
  {
    key: 'insurance',
    title: '医保类型',
    width: 110,
    filterable: true,
    filterType: 'select',
    filterOptions: insuranceTypes.map(t => ({ label: t, value: t })),
  },
  { key: 'phone', title: '联系电话', width: 140, filterable: true },
  {
    key: 'bloodType',
    title: '血型',
    width: 90,
    filterable: true,
    filterType: 'select',
    filterOptions: bloodTypes.map(b => ({ label: b, value: b })),
  },
  { key: 'action', title: '操作', width: 100, fixed: 'right', slot: 'action' },
]

const selectedPatientKeys = ref<string[]>([])

function viewPatient(row: Record<string, unknown>) {
  alert(`查看患者：${String(row.name)}`)
}
</script>

<template>
  <div class="page">
    <!-- ============ Nav (nav-bar-on-mesh) ============ -->
    <header class="nav">
      <div class="nav__logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 4h16v16H4z" fill="var(--cc-primary)" opacity="0.15" />
          <path d="M7 12l3.5 3.5L17 8.5" stroke="var(--cc-primary)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>common_component_library_vue</span>
      </div>
      <nav class="nav__links">
        <a href="#colors">Colors</a>
        <a href="#typography">Type</a>
        <a href="#components">Components</a>
        <a href="#table">Table</a>
        <a href="#pricing">Pricing</a>
        <a href="#dashboard">Dashboard</a>
      </nav>
      <div class="nav__actions">
        <CcSelect
          :model-value="currentTheme"
          :options="themeOptions"
          class="theme-switcher"
          aria-label="切换设计风格"
          @update:model-value="onThemeChange"
        />
        <CcButton variant="ghost" size="sm">Sign in</CcButton>
        <CcButton size="sm">Get started</CcButton>
      </div>
    </header>

    <!-- ============ Hero (gradient mesh) ============ -->
    <section class="hero">
      <div class="hero__mesh" aria-hidden="true" />
      <div class="hero__inner">
        <p class="cc-text-micro-cap hero__eyebrow">Vue 3 · TypeScript · Vite · DESIGN.md</p>
        <h1 class="hero__title cc-text-display-xxl">
          A common component library,<br>
          designed by <em>DESIGN.md</em>.
        </h1>
        <p class="hero__sub cc-text-body-lg">
          Fifteen reusable components built to the Stripe-inspired design system in
          <code>DESIGN.md</code> — thin-weight typography, negative tracking,
          tabular figures, pill buttons, and a gradient mesh that feels like home.
        </p>
        <div class="hero__cta">
          <CcButton size="lg">Start building</CcButton>
          <CcButton variant="secondary" size="lg">View tokens</CcButton>
        </div>

        <!-- Signature composited dashboard mockup (card-dashboard-mockup) -->
        <CcCard variant="dashboard" class="hero__mock">
          <div class="mock">
            <div class="mock__top">
              <div class="mock__dots"><i /><i /><i /></div>
              <span class="cc-text-micro-cap">dashboard.stripe.dev / payments</span>
            </div>
            <div class="mock__grid">
              <div class="mock__chart">
                <svg viewBox="0 0 200 64" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="mockFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="var(--cc-primary-soft)" stop-opacity="0.35" />
                      <stop offset="100%" stop-color="var(--cc-primary-soft)" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 52 L28 44 L56 48 L84 30 L112 34 L140 18 L168 24 L200 10 L200 64 L0 64 Z" fill="url(#mockFill)" />
                  <path d="M0 52 L28 44 L56 48 L84 30 L112 34 L140 18 L168 24 L200 10" fill="none" stroke="var(--cc-primary)" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>
              <div class="mock__table tnum">
                <div class="mock__table-row mock__table-head"><span>Transaction</span><span>Amount</span><span>Status</span></div>
                <div class="mock__table-row"><span>txn_1MqF3K</span><span>$128.00</span><span class="ok">Succeeded</span></div>
                <div class="mock__table-row"><span>txn_1MqF2z</span><span>$4,320.00</span><span class="ok">Succeeded</span></div>
                <div class="mock__table-row"><span>txn_1MqF1x</span><span>$96.40</span><span class="ok">Succeeded</span></div>
              </div>
              <div class="mock__side">
                <div class="mock__metric"><span class="cc-text-micro-cap">Volume</span><strong class="tnum">$84,120.50</strong></div>
                <div class="mock__metric"><span class="cc-text-micro-cap">Payouts</span><strong class="tnum">$61,030.20</strong></div>
                <CcTag variant="solid">Live</CcTag>
              </div>
            </div>
          </div>
        </CcCard>
      </div>
    </section>

    <!-- ============ Colors ============ -->
    <section id="colors" class="band band--soft">
      <div class="container">
        <p class="cc-text-micro-cap section-eyebrow">01 · Color palette</p>
        <h2 class="section-title cc-text-display-xl">Tokens from <em>DESIGN.md</em></h2>
        <p class="section-desc cc-text-body-md">
          Every color below maps 1:1 to a <code>{colors.*}</code> token in the design system,
          surfaced as CSS custom properties (<code>--cc-*</code>) in <code>src/styles/tokens.css</code>.
        </p>
        <div class="palette-grid">
          <div
            v-for="c in palette"
            :key="c.value"
            class="swatch"
          >
            <div
              class="swatch__chip"
              :style="{ backgroundColor: c.value, border: c.value === '#ffffff' ? '1px solid var(--cc-hairline)' : 'none' }"
            />
            <div class="swatch__meta">
              <strong class="swatch__name">{{ c.name }}</strong>
              <code class="swatch__value tnum">{{ c.value }}</code>
              <span class="swatch__role">{{ c.token }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ Typography ============ -->
    <section id="typography" class="band">
      <div class="container">
        <p class="cc-text-micro-cap section-eyebrow">02 · Typography</p>
        <h2 class="section-title cc-text-display-xl">Thin weight is the brand</h2>
        <p class="section-desc cc-text-body-md">
          Sohne at 300 with negative tracking is Stripe's editorial signature. This library ships
          the same hierarchy with <strong>Inter</strong> (the documented open-source substitute),
          plus <code>ss01</code> globally and <code>tnum</code> on every numeric cell.
        </p>
        <div class="type-list">
          <div
            v-for="t in typeScale"
            :key="t.token"
            class="type-row"
          >
            <div class="type-row__meta">
              <code class="type-row__token">{{ t.token }}</code>
              <span class="type-row__spec">{{ t.size }} · {{ t.weight }} · ls {{ t.ls }}</span>
            </div>
            <p
              class="type-row__sample"
              :class="t.cls"
            >{{ t.sample }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ Components ============ -->
    <section id="components" class="band band--soft">
      <div class="container">
        <p class="cc-text-micro-cap section-eyebrow">03 · Components</p>
        <h2 class="section-title cc-text-display-xl">Built to the tokens</h2>

        <!-- Buttons -->
        <h3 class="section-sub cc-text-heading-lg">Buttons</h3>
        <div class="demo-row">
          <CcButton>Primary pill</CcButton>
          <CcButton variant="secondary">Secondary</CcButton>
          <CcButton variant="ghost">Ghost</CcButton>
          <CcButton variant="link">Link button</CcButton>
          <CcButton disabled>Disabled</CcButton>
          <CcButton :loading="loadingBtn" @click="simulateLoading">Loading…</CcButton>
        </div>
        <div class="demo-row">
          <CcButton size="sm">Small</CcButton>
          <CcButton size="md">Medium</CcButton>
          <CcButton size="lg">Large</CcButton>
          <CcButton href="https://stripe.com" target="_blank" variant="secondary">As a link →</CcButton>
        </div>

        <CcDivider class="band-divider">Forms</CcDivider>

        <!-- Forms -->
        <div class="form-grid">
          <CcInput v-model="form.email" label="Email" placeholder="you@company.com" type="email" hint="We'll never share your address." />
          <CcInput v-model="form.name" label="Business name" placeholder="Acme, Inc." />
          <CcInput v-model="form.amount" label="Amount (USD)" prefix="$" inputmode="decimal" hint="Tabular figures are on — watch the digits." />
          <CcSelect v-model="form.plan" :options="plans" label="Plan" placeholder="Choose a plan" />
          <CcInput label="Card number" placeholder="4242 4242 4242 4242" hint="Demo field — no real payment is taken." />
          <CcTextarea v-model="form.name" label="Notes" placeholder="Anything we should know?" :rows="3" />
          <CcInput label="Invalid field" value="oops@bad" type="email" error="That email address doesn't look right." />
          <div class="form-stack">
            <CcSwitch v-model="switchOn" label="Automatic payouts" />
            <CcSwitch v-model="notifySwitch" label="Email receipts" size="sm" />
            <CcSwitch :model-value="false" label="Disabled toggle" disabled />
          </div>
          <div class="form-stack">
            <CcCheckbox v-model="checked" label="Agree to the Terms of Service" />
            <CcCheckbox :model-value="false" label="Marketing emails" disabled />
            <div class="radio-row">
              <CcRadio v-model="form.interval" value="monthly" label="Monthly" />
              <CcRadio v-model="form.interval" value="yearly" label="Yearly" />
            </div>
          </div>
        </div>

        <CcDivider class="band-divider">Tags & Badges</CcDivider>

        <!-- Tags / Badges -->
        <div class="demo-row">
          <CcTag variant="soft">New</CcTag>
          <CcTag variant="solid">Live</CcTag>
          <CcTag variant="dark">Beta</CcTag>
          <CcTag variant="outline">Docs</CcTag>
          <CcTag variant="soft" dot>Processing</CcTag>
          <CcTag variant="soft" closable @close="onTagClose">Dismissible</CcTag>
        </div>
        <div class="demo-row">
          <CcBadge :count="3" variant="soft" />
          <CcBadge :count="27" />
          <CcBadge :count="128" :max="99" variant="solid" />
          <CcBadge dot variant="dot" />
          <span class="badge-demo"><CcBadge :count="4" variant="solid" /> Inbox</span>
        </div>

        <CcDivider class="band-divider">Alerts</CcDivider>

        <!-- Alerts -->
        <div class="alert-stack">
          <CcAlert title="Payment received" description="$1,024.00 was deposited to your account." variant="success" closable />
          <CcAlert title="Action required" description="Verify your business details to keep payouts running." variant="warning" />
          <CcAlert title="Declined" description="We couldn't process this card. Try another payment method." variant="error" />
          <CcAlert title="New API version available" description="2026-09-01 is now the default for new accounts." variant="info" closable />
        </div>

        <CcDivider class="band-divider">Feedback</CcDivider>

        <!-- Modal / Tooltip -->
        <div class="demo-row">
          <CcButton @click="modalOpen = true">Open modal</CcButton>
          <CcTooltip content="A tooltip bubble in brand dark 900" placement="top" :delay="120">
            <CcButton variant="secondary">Hover for tooltip</CcButton>
          </CcTooltip>
          <CcTooltip content="Tip on the right" placement="right">
            <CcTag variant="outline">Right tip</CcTag>
          </CcTooltip>
        </div>
      </div>
    </section>

    <!-- ============ Data table (CcTable) ============ -->
    <section id="table" class="band band--soft">
      <div class="container">
        <p class="cc-text-micro-cap section-eyebrow">04 · Data table</p>
        <h2 class="section-title cc-text-display-xl">CcTable with column management</h2>
        <p class="section-desc cc-text-body-md">
          拖拽表头可调整列顺序 · 「列设置」可切换列显示与表格密度（大 / 中 / 小）· 左右固定列不可拖动或隐藏 ·
          支持多条件筛选、分页与行多选。列顺序 / 显隐 / 密度自动保存到 <code>localStorage</code>。
        </p>

        <div class="table-demo">
          <CcTable
            :columns="patientColumns"
            :data="patients"
            row-key="id"
            table-key="demo-patients"
            v-model:selected-keys="selectedPatientKeys"
          >
            <template #status="{ value }">
              <CcTag :variant="statusTagVariant[String(value)] ?? 'outline'" size="sm">{{ value }}</CcTag>
            </template>
            <template #action="{ row }">
              <CcButton size="sm" variant="secondary" @click="viewPatient(row)">详情</CcButton>
            </template>
          </CcTable>
          <p class="cc-text-caption table-demo__hint">已选 {{ selectedPatientKeys.length }} 行</p>
        </div>
      </div>
    </section>

    <!-- ============ Pricing (cards) ============ -->
    <section id="pricing" class="band">
      <div class="container">
        <p class="cc-text-micro-cap section-eyebrow">05 · Cards</p>
        <h2 class="section-title cc-text-display-xl">Feature & pricing cards</h2>
        <p class="section-desc cc-text-body-md">
          <code>card-feature-light</code>, <code>card-pricing</code>, <code>card-pricing-featured</code>
          and <code>card-cream-band</code> — radius 12px, 32px padding, hairline borders.
        </p>

        <div class="feature-grid">
          <CcCard variant="feature" title="Unified platform" description="One integration for payments, payouts, and financial services.">
            <p>Use the same API for online payments, subscriptions, and in-person terminals — reconcile everything in one dashboard.</p>
          </CcCard>
          <CcCard variant="cream" title="Global reach" description="135+ currencies and local payment methods.">
            <p>Accept payments the way your customers prefer to pay, anywhere in the world, with automatic currency conversion.</p>
          </CcCard>
          <CcCard variant="feature" title="Bank-grade security" description="PCI Level 1 and tokenization built in.">
            <p>Sensitive data never touches your servers. Cards are tokenized at the edge and vaulted by the platform.</p>
          </CcCard>
        </div>

        <div class="pricing-grid">
          <CcCard variant="pricing">
            <template #header>
              <h3 class="cc-text-heading-lg">Starter</h3>
              <p class="price tnum cc-text-display-md">$0<span class="price__per">/mo</span></p>
            </template>
            <ul class="price-list">
              <li>Payments API</li>
              <li>2.9% + 30¢ per successful charge</li>
              <li>Standard reporting</li>
            </ul>
            <template #footer>
              <CcButton variant="secondary" block>Start with Starter</CcButton>
            </template>
          </CcCard>

          <CcCard variant="pricing-featured">
            <template #header>
              <div class="featured-top">
                <h3 class="cc-text-heading-lg">Growth</h3>
                <CcTag variant="solid">Popular</CcTag>
              </div>
              <p class="price tnum cc-text-display-md">$99<span class="price__per">/mo</span></p>
            </template>
            <ul class="price-list">
              <li>Everything in Starter</li>
              <li>Volume discounts from $80k/mo</li>
              <li>Radar fraud & risk team</li>
            </ul>
            <template #footer>
              <CcButton block>Choose Growth</CcButton>
            </template>
          </CcCard>

          <CcCard variant="pricing">
            <template #header>
              <h3 class="cc-text-heading-lg">Scale</h3>
              <p class="price tnum cc-text-display-md">$249<span class="price__per">/mo</span></p>
            </template>
            <ul class="price-list">
              <li>Everything in Growth</li>
              <li>Custom contracts & SLAs</li>
              <li>Dedicated support engineer</li>
            </ul>
            <template #footer>
              <CcButton variant="secondary" block>Contact sales</CcButton>
            </template>
          </CcCard>
        </div>
      </div>
    </section>

    <!-- ============ Dashboard (dark track) ============ -->
    <section id="dashboard" class="band band--dark">
      <div class="container">
        <p class="cc-text-micro-cap section-eyebrow band--dark__eyebrow">06 · Dark track</p>
        <h2 class="section-title cc-text-display-xl band--dark__title">Dashboard surfaces</h2>
        <p class="section-desc cc-text-body-md band--dark__desc">
          The dashboard flips polarity to the deep-navy shell
          (<code>{colors.brand-dark-900}</code>) with <code>button-on-dark</code>
          and tabular money figures.
        </p>

        <div class="dark-actions">
          <CcButton variant="on-dark">Create payout</CcButton>
          <CcButton variant="secondary">Export</CcButton>
          <CcTag variant="dark">v2 API</CcTag>
        </div>

        <CcCard variant="dashboard" class="table-card">
          <div class="table-card__header">
            <span class="cc-text-micro-cap">Recent payouts</span>
            <CcBadge :count="3" variant="dot" />
          </div>
          <table class="data-table tnum">
            <thead>
              <tr>
                <th>Payout</th>
                <th>Destination</th>
                <th>Status</th>
                <th class="align-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>po_1MqG8k</td><td>•••• 4242 · Chase</td><td><CcTag variant="soft" dot>Paid</CcTag></td><td class="align-right">$12,480.00</td></tr>
              <tr><td>po_1MqF3z</td><td>•••• 4242 · Chase</td><td><CcTag variant="soft" dot>Paid</CcTag></td><td class="align-right">$8,120.40</td></tr>
              <tr><td>po_1MqE1x</td><td>•••• 1031 · Citi</td><td><CcTag variant="outline">Pending</CcTag></td><td class="align-right">$4,096.75</td></tr>
            </tbody>
          </table>
        </CcCard>

        <div class="charts-grid">
          <CcCard variant="dashboard" class="chart-card">
            <div class="chart-card__header">
              <span class="cc-text-micro-cap">Daily visits</span>
              <CcTag variant="dark">7 days</CcTag>
            </div>
            <CcBarChart
              :categories="chartBarCategories"
              :series="chartBarSeries"
              :height="250"
              :dark="true"
              :stacked="true"
              :rounded="true"
            />
          </CcCard>

          <CcCard variant="dashboard" class="chart-card">
            <div class="chart-card__header">
              <span class="cc-text-micro-cap">Patients by department</span>
            </div>
            <CcPieChart :data="chartPieData" :height="250" :dark="true" :donut="true" />
          </CcCard>

          <CcCard variant="dashboard" class="chart-card">
            <div class="chart-card__header">
              <span class="cc-text-micro-cap">Revenue trend</span>
              <CcTag variant="dark">30 days</CcTag>
            </div>
            <CcLineChart
              :categories="chartLineCategories"
              :series="chartLineSeries"
              :height="250"
              :dark="true"
              :area="true"
              :smooth="true"
            />
          </CcCard>
        </div>
      </div>
    </section>

    <!-- ============ Footer ============ -->
    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__brand">
          <strong>common_component_library_vue</strong>
          <p>Vue 3 · TypeScript · Vite · DESIGN.md (Stripe-inspired)</p>
        </div>
        <div class="footer__cols">
          <div class="footer__col">
            <span class="cc-text-micro-cap">Components</span>
            <a href="#components">Buttons</a>
            <a href="#components">Forms</a>
            <a href="#components">Cards</a>
          </div>
          <div class="footer__col">
            <span class="cc-text-micro-cap">Design</span>
            <a href="#colors">Colors</a>
            <a href="#typography">Typography</a>
            <a href="DESIGN.md">DESIGN.md</a>
          </div>
          <div class="footer__col">
            <span class="cc-text-micro-cap">Resources</span>
            <a href="https://github.com/VoltAgent/awesome-design-md" target="_blank">awesome-design-md</a>
            <a href="https://stripe.com" target="_blank">Stripe</a>
          </div>
        </div>
      </div>
      <div class="footer__legal cc-text-micro">
        Design tokens extracted from Stripe's public site by awesome-design-md · MIT License ·
        Sohne is proprietary — this library uses Inter.
      </div>
    </footer>

    <!-- ============ Modal ============ -->
    <CcModal
      v-model:visible="modalOpen"
      title="Create a payment link"
      width="440px"
    >
      <p class="modal-copy">Generate a reusable payment link and share it anywhere. Funds settle in your balance in 2 business days.</p>
      <div class="modal-form">
        <CcInput label="Amount (USD)" prefix="$" placeholder="25.00" inputmode="decimal" />
        <CcInput label="Description" placeholder="Coffee beans, March batch" />
      </div>
      <template #footer>
        <CcButton variant="ghost" @click="modalOpen = false">Cancel</CcButton>
        <CcButton @click="modalOpen = false">Create link</CcButton>
      </template>
    </CcModal>
  </div>
</template>

<style scoped>
/* ------------------------------------------------------------------ */
/* Page shell                                                          */
/* ------------------------------------------------------------------ */
.page {
  font-family: var(--cc-font-family);
  color: var(--cc-ink);
  overflow-x: hidden;
}

.container {
  width: 100%;
  max-width: var(--cc-container-max);
  margin: 0 auto;
  padding: 0 var(--cc-space-xl);
}

.band {
  padding: 96px 0;
}

.band--soft {
  background-color: var(--cc-canvas-soft);
}

.band-divider {
  margin: 48px 0 40px;
}

.section-eyebrow {
  color: var(--cc-primary);
  margin-bottom: 12px;
}

.section-title {
  margin-bottom: 16px;
}

.section-title em {
  font-style: italic;
  color: var(--cc-primary);
}

.section-desc {
  max-width: 560px;
  color: var(--cc-ink-mute);
  margin-bottom: 48px;
}

.section-desc code,
.section-desc strong {
  font-weight: 400;
}

.section-sub {
  margin: 8px 0 20px;
}

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: var(--cc-space-xl);
  padding: 12px 24px;
  background-color: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--cc-hairline);
}

.nav__logo {
  display: flex;
  align-items: center;
  gap: var(--cc-space-sm);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.28px;
  color: var(--cc-ink);
}

.nav__links {
  display: flex;
  gap: var(--cc-space-xl);
  margin-left: auto;
}

.nav__links a {
  font-size: 14px;
  font-weight: 400;
  color: var(--cc-ink-mute);
  text-decoration: none;
  transition: color 0.15s ease;
}

.nav__links a:hover {
  color: var(--cc-ink);
  text-decoration: none;
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: var(--cc-space-sm);
}

.theme-switcher {
  min-width: 132px;
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
.hero {
  position: relative;
  overflow: hidden;
}

/* Stripe signature gradient mesh — layered blobs approximating the organic SVG mesh */
.hero__mesh {
  position: absolute;
  inset: 0 0 8% 0;
  background:
    radial-gradient(38% 58% at 14% 22%, rgba(245, 233, 212, 0.95), transparent 62%),
    radial-gradient(30% 52% at 30% 8%, rgba(255, 186, 118, 0.5), transparent 62%),
    radial-gradient(34% 56% at 52% 24%, rgba(196, 181, 253, 0.55), transparent 64%),
    radial-gradient(42% 62% at 74% 14%, rgba(140, 126, 255, 0.42), transparent 64%),
    radial-gradient(36% 52% at 92% 30%, rgba(249, 110, 238, 0.34), transparent 62%),
    radial-gradient(26% 40% at 6% 78%, rgba(234, 34, 97, 0.14), transparent 60%),
    linear-gradient(180deg, #ffffff 0%, #f6f9fc 70%, #ffffff 100%);
  pointer-events: none;
}

.hero__inner {
  position: relative;
  max-width: var(--cc-container-max);
  margin: 0 auto;
  padding: 88px 24px 120px;
  text-align: center;
}

.hero__eyebrow {
  color: var(--cc-primary-deep);
  margin-bottom: 20px;
}

.hero__title {
  max-width: 880px;
  margin: 0 auto 24px;
}

.hero__title em {
  font-style: normal;
  color: var(--cc-primary);
}

.hero__sub {
  max-width: 620px;
  margin: 0 auto 40px;
  color: var(--cc-ink-secondary);
}

.hero__sub code {
  font-weight: 400;
  color: var(--cc-primary-deep);
}

.hero__cta {
  display: flex;
  justify-content: center;
  gap: var(--cc-space-md);
  margin-bottom: 72px;
}

/* Mockup */
.hero__mock {
  text-align: left;
  max-width: 860px;
  margin: 0 auto;
}

.mock {
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-lg);
}

.mock__top {
  display: flex;
  align-items: center;
  gap: var(--cc-space-md);
}

.mock__dots {
  display: flex;
  gap: 6px;
}

.mock__dots i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--cc-hairline);
}

.mock__top span {
  color: var(--cc-ink-mute);
}

.mock__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 0.8fr;
  gap: var(--cc-space-xl);
  align-items: stretch;
}

.mock__chart {
  background-color: var(--cc-canvas-soft);
  border-radius: var(--cc-radius-md);
  padding: var(--cc-space-md);
}

.mock__chart svg {
  width: 100%;
  height: 96px;
  display: block;
}

.mock__table {
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-sm);
  font-size: 13px;
  letter-spacing: -0.26px;
}

.mock__table-row {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr 1fr;
  gap: var(--cc-space-sm);
  padding-bottom: var(--cc-space-sm);
  border-bottom: 1px solid var(--cc-hairline);
}

.mock__table-row:last-child {
  border-bottom: 0;
}

.mock__table-head {
  font-weight: 400;
  color: var(--cc-ink-mute);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1px;
}

.mock__table-row .ok {
  color: var(--cc-success);
}

.mock__side {
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-md);
}

.mock__metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mock__metric span {
  color: var(--cc-ink-mute);
}

.mock__metric strong {
  font-size: 20px;
  font-weight: 300;
  letter-spacing: -0.2px;
}

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */
.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--cc-space-lg);
}

.swatch {
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-sm);
}

.swatch__chip {
  height: 84px;
  border-radius: var(--cc-radius-md);
  box-shadow: var(--cc-shadow-level-1);
}

.swatch__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.swatch__name {
  font-size: 13px;
  font-weight: 400;
  color: var(--cc-ink);
}

.swatch__value {
  font-size: 12px;
  color: var(--cc-ink-mute);
}

.swatch__role {
  font-size: 11px;
  color: var(--cc-ink-mute-2);
  opacity: 0.75;
}

/* ------------------------------------------------------------------ */
/* Type scale                                                          */
/* ------------------------------------------------------------------ */
.type-list {
  display: flex;
  flex-direction: column;
}

.type-row {
  display: grid;
  grid-template-columns: 280px 1fr;
  align-items: baseline;
  gap: var(--cc-space-xl);
  padding: var(--cc-space-lg) 0;
  border-bottom: 1px solid var(--cc-hairline);
}

.type-row:first-child {
  border-top: 1px solid var(--cc-hairline);
}

.type-row__meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.type-row__token {
  font-size: 12px;
  color: var(--cc-primary-deep);
}

.type-row__spec {
  font-size: 11px;
  color: var(--cc-ink-mute);
}

.type-row__sample {
  color: var(--cc-ink);
  overflow-wrap: anywhere;
}

/* ------------------------------------------------------------------ */
/* Demo rows & forms                                                   */
/* ------------------------------------------------------------------ */
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--cc-space-md);
  margin-bottom: var(--cc-space-xl);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--cc-space-xl);
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-md);
  justify-content: center;
}

.radio-row {
  display: flex;
  gap: var(--cc-space-xl);
}

.alert-stack {
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-md);
  max-width: 680px;
}

.badge-demo {
  display: inline-flex;
  align-items: center;
  gap: var(--cc-space-xs);
  font-size: 14px;
  color: var(--cc-ink-secondary);
}

/* ------------------------------------------------------------------ */
/* Pricing & cards                                                     */
/* ------------------------------------------------------------------ */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--cc-space-xl);
  margin-bottom: var(--cc-space-xxl);
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--cc-space-xl);
  align-items: stretch;
}

.price {
  margin-top: var(--cc-space-sm);
}

.price__per {
  font-size: 15px;
  font-weight: 300;
  color: var(--cc-ink-mute);
}

.featured-top {
  display: flex;
  align-items: center;
  gap: var(--cc-space-sm);
}

.price-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-sm);
  font-size: 14px;
  font-weight: 300;
  line-height: 1.4;
  color: var(--cc-ink-secondary);
}

.price-list li {
  position: relative;
  padding-left: 20px;
}

.price-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 10px;
  height: 5px;
  border-left: 1.5px solid var(--cc-primary);
  border-bottom: 1.5px solid var(--cc-primary);
  transform: rotate(-45deg);
}

/* ------------------------------------------------------------------ */
/* Dark band                                                           */
/* ------------------------------------------------------------------ */
.band--dark {
  background-color: var(--cc-brand-dark-900);
}

.band--dark__eyebrow {
  color: var(--cc-primary-soft);
}

.band--dark__title {
  color: var(--cc-on-primary);
}

.band--dark__desc {
  color: rgba(255, 255, 255, 0.72);
}

.dark-actions {
  display: flex;
  align-items: center;
  gap: var(--cc-space-md);
  margin-bottom: var(--cc-space-xxl);
}

.table-card {
  padding: var(--cc-space-xl);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--cc-space-lg);
  margin-top: var(--cc-space-xl);
}

.chart-card {
  padding: var(--cc-space-lg);
  min-width: 0;
}

.chart-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--cc-space-md);
}

.chart-card__header span {
  color: var(--cc-ink-mute);
}

@media (max-width: 960px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

.table-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--cc-space-lg);
}

.table-card__header span {
  color: var(--cc-ink-mute);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  letter-spacing: -0.42px;
}

.data-table th {
  text-align: left;
  font-size: 11px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.1px;
  color: var(--cc-ink-mute);
  padding: 8px 12px 8px 0;
  border-bottom: 1px solid var(--cc-hairline);
}

.data-table td {
  padding: 14px 12px 14px 0;
  border-bottom: 1px solid var(--cc-hairline);
  color: var(--cc-ink);
}

.data-table tr:last-child td {
  border-bottom: 0;
}

.align-right {
  text-align: right;
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
.footer {
  background-color: var(--cc-canvas);
  border-top: 1px solid var(--cc-hairline);
  padding: var(--cc-space-huge) 0 var(--cc-space-xl);
}

.footer__inner {
  display: flex;
  justify-content: space-between;
  gap: var(--cc-space-huge);
  flex-wrap: wrap;
  margin-bottom: var(--cc-space-xxl);
}

.footer__brand strong {
  font-size: 15px;
  font-weight: 400;
  color: var(--cc-ink);
}

.footer__brand p {
  margin-top: 4px;
  font-size: 13px;
  color: var(--cc-ink-mute);
}

.footer__cols {
  display: flex;
  gap: var(--cc-space-huge);
  flex-wrap: wrap;
}

.footer__col {
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-sm);
}

.footer__col span {
  color: var(--cc-ink-mute);
  margin-bottom: 4px;
}

.footer__col a {
  font-size: 14px;
  font-weight: 300;
  color: var(--cc-ink-secondary);
  text-decoration: none;
}

.footer__col a:hover {
  color: var(--cc-primary);
  text-decoration: none;
}

.footer__legal {
  text-align: center;
  color: var(--cc-ink-mute);
  padding-top: var(--cc-space-xl);
  border-top: 1px solid var(--cc-hairline);
}

/* Modal demo */
.modal-copy {
  margin-bottom: var(--cc-space-lg);
  color: var(--cc-ink-secondary);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: var(--cc-space-md);
}

/* ------------------------------------------------------------------ */
/* Responsive (per DESIGN.md breakpoints)                              */
/* ------------------------------------------------------------------ */
@media (max-width: 1024px) {
  .mock__grid {
    grid-template-columns: 1fr 1fr;
  }

  .mock__side {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .band {
    padding: 64px 0;
  }

  .nav__links {
    display: none;
  }

  .hero__title {
    font-size: 36px;
    letter-spacing: -0.9px;
  }

  .hero__inner {
    padding: 56px 16px 80px;
  }

  .mock__grid {
    grid-template-columns: 1fr;
  }

  .mock__side {
    grid-column: auto;
    flex-direction: column;
    align-items: flex-start;
  }

  .type-row {
    grid-template-columns: 1fr;
    gap: var(--cc-space-sm);
  }

  .footer__inner {
    flex-direction: column;
    gap: var(--cc-space-xl);
  }
}

/* ---- CcTable demo ---- */
.table-demo {
  margin-top: 32px;
}

.table-demo__hint {
  margin-top: 16px;
  text-align: right;
  color: var(--cc-ink-mute);
}

@media (max-width: 720px) {
  .table-demo__hint {
    text-align: left;
  }
}
</style>
