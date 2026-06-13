<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import type { SeeTableColumn } from '@/uni_modules/see-u-ui/components/see-table/type'
const { t } = useI18n()
useNavbarI18n('navbar.seeTable')

// 角色数组（用于生成的数据）
const genRoles = [t('table.data.frontendDev'), t('table.data.backendDev'), t('table.data.pm'), t('table.data.designer'), t('table.data.tester')]

// ========== 基础数据 ==========
interface User {
  id: number
  name: string
  age: number
  email: string
  role: string
  status: string
}

const baseData = ref<User[]>([
  {
    id: 1,
    name: t('table.data.zhangsan'),
    age: 28,
    email: 'zhangsan@example.com',
    role: t('table.data.frontendDev'),
    status: t('table.column.statusActive')
  },
  { id: 2, name: t('table.data.lisi'), age: 32, email: 'lisi@example.com', role: t('table.data.backendDev'), status: t('table.column.statusActive') },
  { id: 3, name: t('table.data.wangwu'), age: 25, email: 'wangwu@example.com', role: t('table.data.pm'), status: t('table.column.statusActive') },
  {
    id: 4,
    name: t('table.data.zhaoliu'),
    age: 30,
    email: 'zhaoliu@example.com',
    role: t('table.data.uiDesigner'),
    status: t('table.column.statusInactive')
  },
  {
    id: 5,
    name: t('table.data.qianqi'),
    age: 27,
    email: 'qianqi@example.com',
    role: t('table.data.testEngineer'),
    status: t('table.column.statusActive')
  }
])

const baseColumns: SeeTableColumn<User>[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: t('table.column.name'), width: 120 },
  { key: 'age', title: t('table.column.age'), width: 80, align: 'center' },
  { key: 'email', title: t('table.column.email'), width: 240 },
  { key: 'role', title: t('table.column.position'), width: 150 },
  { key: 'status', title: t('table.column.status'), width: 100, align: 'center' }
]

// ========== 横向滚动数据 ==========
const scrollColumns: SeeTableColumn<User>[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: t('table.column.name'), width: 120 },
  { key: 'age', title: t('table.column.age'), width: 80, align: 'center' },
  { key: 'email', title: t('table.column.email'), width: 300 },
  { key: 'role', title: t('table.column.position'), width: 200 },
  { key: 'status', title: t('table.column.status'), width: 120, align: 'center' },
  { key: 'remark', title: t('table.column.remark'), width: 350 }
]

const scrollData = ref([
  {
    id: 1,
    name: t('table.data.zhangsan'),
    age: 28,
    email: 'zhangsan@example.com',
    role: t('table.data.frontendDev'),
    status: t('table.column.statusActive'),
    remark: t('table.data.remarkScroll1')
  },
  {
    id: 2,
    name: t('table.data.lisi'),
    age: 32,
    email: 'lisi@example.com',
    role: t('table.data.backendDev'),
    status: t('table.column.statusActive'),
    remark: t('table.data.remarkScroll2')
  },
  {
    id: 3,
    name: t('table.data.wangwu'),
    age: 25,
    email: 'wangwu@example.com',
    role: t('table.data.pm'),
    status: t('table.column.statusActive'),
    remark: t('table.data.remarkScroll3')
  }
])

// ========== 边框与斑马纹 ==========
const borderColumns: SeeTableColumn[] = [
  { key: 'name', title: t('table.column.fruitName'), width: 150 },
  { key: 'price', title: t('table.column.priceUnit'), width: 150, align: 'right' },
  { key: 'origin', title: t('table.column.origin'), width: 150 },
  { key: 'stock', title: t('table.column.stock'), width: 120, align: 'right' }
]

const borderData = ref([
  { name: t('table.data.apple'), price: '6.50', origin: t('table.data.yantai'), stock: 120 },
  { name: t('table.data.banana'), price: '3.80', origin: t('table.data.zhanjiang'), stock: 85 },
  { name: t('table.data.orange'), price: '5.20', origin: t('table.data.ganzhou'), stock: 200 },
  { name: t('table.data.grape'), price: '12.00', origin: t('table.data.turpan'), stock: 60 },
  { name: t('table.data.strawberry'), price: '25.00', origin: t('table.data.dandong'), stock: 30 }
])

// ========== 尺寸变型 ==========
const sizeColumns: SeeTableColumn[] = [
  { key: 'name', title: t('table.column.label'), width: 120 },
  { key: 'value', title: t('table.column.value'), width: 100, align: 'center' }
]

const sizeData = ref([
  { name: t('table.data.paramA'), value: 100 },
  { name: t('table.data.paramB'), value: 200 },
  { name: t('table.data.paramC'), value: 300 }
])

// ========== Formatter ==========
const formatterColumns: SeeTableColumn<User>[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: t('table.column.name'), width: 120 },
  {
    key: 'age',
    title: t('table.column.age'),
    width: 100,
    align: 'center',
    formatter: (_row, _col, _idx) => `${_row.age} ${t('table.column.ageUnit')}`
  },
  {
    key: 'status',
    title: t('table.column.status'),
    width: 100,
    align: 'center',
    formatter: (row) =>
      row.status === t('table.column.statusActive') ? `✅ ${t('table.column.statusActive')}` : `❌ ${t('table.column.statusInactive')}`
  }
]

// ========== 自定义插槽 ==========
const slotColumns: SeeTableColumn[] = [
  { key: 'name', title: t('table.column.productName'), width: 150 },
  { key: 'price', title: t('table.column.price'), width: 120, align: 'right' },
  { key: 'action', title: t('table.column.action'), width: 200, align: 'center' }
]

const slotData = ref([
  { name: t('table.data.seeuiLib'), price: t('table.data.free'), id: 1 },
  { name: t('table.data.premiumTemplate'), price: t('table.data.price99'), id: 2 },
  { name: t('table.data.customService'), price: t('table.data.negotiable'), id: 3 }
])

// ========== 固定高度（纵向滚动） ==========
const scrollYData = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: t('table.column.userLabel', { index: i + 1 }),
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    role: genRoles[i % 5],
    status: i % 4 === 3 ? t('table.column.statusInactive') : t('table.column.statusActive')
  }))
)

const scrollYColumns: SeeTableColumn[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: t('table.column.name'), width: 120 },
  { key: 'age', title: t('table.column.age'), width: 80, align: 'center' },
  { key: 'email', title: t('table.column.email'), width: 240 },
  { key: 'role', title: t('table.column.position'), width: 150 },
  { key: 'status', title: t('table.column.status'), width: 100, align: 'center' }
]

// ========== 状态演示 ==========
const emptyList = ref<unknown[]>([])
const isLoading = ref(false)
const hasError = ref(false)

const toggleLoading = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}

const toggleError = () => {
  hasError.value = !hasError.value
}

// ========== 事件演示 ==========
const lastEvent = ref('')

const handleRowClick = (row: unknown, index: number) => {
  lastEvent.value = t('table.event.rowClick', { index: index + 1, name: (row as User).name })
}

const handleCellClick = (_row: unknown, column: SeeTableColumn, rowIndex: number) => {
  lastEvent.value = t('table.event.cellClick', { rowIndex: rowIndex + 1, column: column.title })
}

// ========== Phase 4: 排序 ==========
const sortColumns: SeeTableColumn<User>[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center', sortable: true },
  { key: 'name', title: t('table.column.name'), width: 120, sortable: true },
  { key: 'age', title: t('table.column.age'), width: 100, align: 'center', sortable: true },
  { key: 'email', title: t('table.column.email'), width: 240 },
  { key: 'role', title: t('table.column.position'), width: 150 }
]

const sortData = ref<User[]>([
  {
    id: 1,
    name: t('table.data.zhangsan'),
    age: 28,
    email: 'zhangsan@example.com',
    role: t('table.data.frontendDev'),
    status: t('table.column.statusActive')
  },
  { id: 2, name: t('table.data.lisi'), age: 32, email: 'lisi@example.com', role: t('table.data.backendDev'), status: t('table.column.statusActive') },
  { id: 3, name: t('table.data.wangwu'), age: 25, email: 'wangwu@example.com', role: t('table.data.pm'), status: t('table.column.statusActive') },
  {
    id: 4,
    name: t('table.data.zhaoliu'),
    age: 30,
    email: 'zhaoliu@example.com',
    role: t('table.data.uiDesigner'),
    status: t('table.column.statusInactive')
  },
  {
    id: 5,
    name: t('table.data.qianqi'),
    age: 27,
    email: 'qianqi@example.com',
    role: t('table.data.testEngineer'),
    status: t('table.column.statusActive')
  }
])

const currentSortKey = ref('')
const currentSortOrder = ref<'asc' | 'desc' | ''>('')

const handleSortChange = (data: { key: string; order: string; column: SeeTableColumn }) => {
  currentSortKey.value = data.key
  currentSortOrder.value = data.order as 'asc' | 'desc' | ''
  const orderLabel = data.order === 'asc' ? t('table.event.sortAsc') : data.order === 'desc' ? t('table.event.sortDesc') : t('table.event.sortCancel')
  lastEvent.value = t('table.event.sort', { column: data.column.title, order: orderLabel })
}

// ========== Phase 4: 选择 ==========
const selectedKeys = ref<number[]>([])
const selectedRows = ref<User[]>([])

const handleSelectionChange = (keys: Array<string | number>, rows: unknown[]) => {
  selectedKeys.value = keys as number[]
  selectedRows.value = rows as User[]
  lastEvent.value = t('table.event.selection', { count: keys.length })
}

// ========== Phase 4: 展开行 ==========
const expandedKeys = ref<number[]>([])

const handleExpandChange = (keys: Array<string | number>, _row: unknown) => {
  expandedKeys.value = keys as number[]
}

// ========== Phase 4: 树形数据 ==========
interface TreeNode {
  id: number
  name: string
  count: number
  children?: TreeNode[]
}

const treeData = ref<TreeNode[]>([
  {
    id: 1,
    name: t('table.data.techDept'),
    count: 120,
    children: [
      {
        id: 11,
        name: t('table.data.frontendGroup'),
        count: 35,
        children: [
          { id: 111, name: t('table.data.reactGroup'), count: 15 },
          { id: 112, name: t('table.data.vueGroup'), count: 20 }
        ]
      },
      { id: 12, name: t('table.data.backendGroup'), count: 45 },
      { id: 13, name: t('table.data.testGroup'), count: 20 },
      { id: 14, name: t('table.data.opsGroup'), count: 20 }
    ]
  },
  {
    id: 2,
    name: t('table.data.productDept'),
    count: 50,
    children: [
      { id: 21, name: t('table.data.productPlanning'), count: 30 },
      { id: 22, name: t('table.data.productDesign'), count: 20 }
    ]
  },
  {
    id: 3,
    name: t('table.data.marketDept'),
    count: 80
  }
])

const treeColumns: SeeTableColumn<TreeNode>[] = [
  { key: 'name', title: t('table.column.deptName'), width: 250 },
  { key: 'count', title: t('table.column.memberCount'), width: 100, align: 'center' }
]

// ========== Phase 4: 分页 ==========
const paginationData = ref(
  Array.from({ length: 88 }, (_, i) => ({
    id: i + 1,
    name: t('table.column.userLabel', { index: i + 1 }),
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    role: genRoles[i % 5],
    status: i % 4 === 3 ? t('table.column.statusInactive') : t('table.column.statusActive')
  }))
)

const paginationColumns: SeeTableColumn[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: t('table.column.name'), width: 120 },
  { key: 'age', title: t('table.column.age'), width: 80, align: 'center' },
  { key: 'email', title: t('table.column.email'), width: 240 },
  { key: 'role', title: t('table.column.position'), width: 150 },
  { key: 'status', title: t('table.column.status'), width: 100, align: 'center' }
]

const handlePageChange = (data: { current: number; pageSize: number }) => {
  lastEvent.value = t('table.event.pageChange', { current: data.current, pageSize: data.pageSize })
}

// ========== Phase 4: 组合场景 ==========
const comboColumns: SeeTableColumn<User>[] = [
  { key: '__sel__', title: '', type: 'selection', width: 50 },
  { key: 'id', title: 'ID', width: 80, align: 'center', sortable: true },
  { key: 'name', title: t('table.column.name'), width: 120, sortable: true },
  { key: 'age', title: t('table.column.age'), width: 100, align: 'center', sortable: true },
  { key: 'email', title: t('table.column.email'), width: 240, ellipsis: true },
  { key: 'role', title: t('table.column.position'), width: 150 },
  { key: 'status', title: t('table.column.status'), width: 100, align: 'center' }
]

const comboData = ref(
  Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: t('table.column.userLabel', { index: i + 1 }),
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    role: genRoles[i % 5],
    status: i % 4 === 3 ? t('table.column.statusInactive') : t('table.column.statusActive')
  }))
)

const comboSelectedKeys = ref<number[]>([])

const handleComboSelectionChange = (keys: Array<string | number>) => {
  comboSelectedKeys.value = keys as number[]
}

// ========== Phase 5: 虚拟行 ==========
const virtualData = ref(
  Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: t('table.column.userLabel', { index: i + 1 }),
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    role: genRoles[i % 5],
    status: i % 4 === 3 ? t('table.column.statusInactive') : t('table.column.statusActive')
  }))
)

const virtualColumns: SeeTableColumn[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: t('table.column.name'), width: 120 },
  { key: 'age', title: t('table.column.age'), width: 80, align: 'center' },
  { key: 'email', title: t('table.column.email'), width: 240 },
  { key: 'role', title: t('table.column.position'), width: 150 },
  { key: 'status', title: t('table.column.status'), width: 100, align: 'center' }
]

// ========== Phase 5: 固定列 ==========
const fixedColumnData = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: t('table.column.userLabel', { index: i + 1 }),
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    role: genRoles[i % 5],
    status: i % 4 === 3 ? t('table.column.statusInactive') : t('table.column.statusActive'),
    address: t('table.data.addressFormat', { num: 100 + i }),
    phone: `138${String(i + 1000).padStart(8, '0')}`
  }))
)

const fixedColumns: SeeTableColumn[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center', fixed: 'left' },
  { key: 'name', title: t('table.column.name'), width: 120, fixed: 'left' },
  { key: 'age', title: t('table.column.age'), width: 80, align: 'center' },
  { key: 'email', title: t('table.column.email'), width: 240 },
  { key: 'role', title: t('table.column.position'), width: 150 },
  { key: 'address', title: t('table.column.address'), width: 300 },
  { key: 'phone', title: t('table.column.phone'), width: 160 },
  { key: 'status', title: t('table.column.status'), width: 100, align: 'center', fixed: 'right' }
]

// ========== Phase 5: 虚拟列 ==========
const virtualXData = ref(
  Array.from({ length: 50 }, (_, i) => {
    const row: Record<string, unknown> = { id: i + 1 }
    for (let j = 1; j <= 30; j++) {
      row[`col${j}`] = `R${i + 1}C${j}`
    }
    return row
  })
)

const virtualXColumns: SeeTableColumn[] = Array.from({ length: 30 }, (_, i) => ({
  key: `col${i + 1}`,
  title: t('table.column.col', { index: i + 1 }),
  width: 120,
  align: 'center' as const
}))

// ========== Phase 5: 树形 + 虚拟行 ==========
function generateTreeData(depth: number, count: number, prefix: string): any[] {
  if (depth <= 0) return []
  return Array.from({ length: count }, (_, i) => {
    const node: any = {
      id: `${prefix}${i + 1}`,
      name: t('table.column.nodeLabel', { prefix, index: i + 1 }),
      count: Math.floor(Math.random() * 100)
    }
    if (depth > 1) {
      node.children = generateTreeData(depth - 1, 3, `${prefix}${i + 1}-`)
    }
    return node
  })
}

const treeVirtualData = ref(generateTreeData(3, 10, ''))

// ========== Phase 5: 展开行 + 虚拟行 ==========
const expandVirtualKeys = ref<number[]>([])

const handleExpandVirtualChange = (keys: Array<string | number>) => {
  expandVirtualKeys.value = keys as number[]
}
</script>

<template>
  <see-config>
    <view class="page">
      <!-- 基础用法 -->
      <text class="title">{{ t('table.demo.basic') }}</text>
      <view class="demo-card">
        <see-table :data="baseData" :columns="baseColumns" row-key="id" />
      </view>

      <!-- 边框 + 斑马纹 -->
      <text class="title">{{ t('table.demo.borderStripe') }}</text>
      <view class="demo-card">
        <see-table :data="borderData" :columns="borderColumns" border stripe />
      </view>

      <!-- 尺寸变体 -->
      <text class="title">{{ t('table.demo.size') }}</text>
      <view class="demo-card">
        <text class="sub-title">{{ t('table.demo.small') }}</text>
        <see-table :data="sizeData" :columns="sizeColumns" size="small" border />
        <text class="sub-title">{{ t('table.demo.medium') }}</text>
        <see-table :data="sizeData" :columns="sizeColumns" size="medium" border />
        <text class="sub-title">{{ t('table.demo.large') }}</text>
        <see-table :data="sizeData" :columns="sizeColumns" size="large" border />
      </view>

      <!-- 横向滚动 -->
      <text class="title">{{ t('table.demo.scrollX') }}</text>
      <view class="demo-card">
        <see-table :data="scrollData" :columns="scrollColumns" row-key="id" border />
      </view>

      <!-- 纵向滚动 -->
      <text class="title">{{ t('table.demo.scrollY') }}</text>
      <view class="demo-card">
        <see-table :data="scrollYData" :columns="scrollYColumns" row-key="id" height="400" border stripe />
      </view>

      <!-- Formatter -->
      <text class="title">{{ t('table.demo.formatter') }}</text>
      <view class="demo-card">
        <see-table :data="baseData" :columns="formatterColumns" row-key="id" border />
      </view>

      <!-- 自定义插槽 -->
      <text class="title">{{ t('table.demo.slot') }}</text>
      <view class="demo-card">
        <see-table :data="slotData" :columns="slotColumns" row-key="id" border>
          <template #header-action="{ column }">
            <text class="header-action">⚡ {{ column.title }}</text>
          </template>
          <template #cell-action>
            <view class="action-btns">
              <text class="action-btn action-btn--edit">{{ t('table.demo.edit') }}</text>
              <text class="action-btn action-btn--delete">{{ t('table.demo.delete') }}</text>
            </view>
          </template>
          <template #cell-price="{ row }">
            <text class="price-text">{{ row.price }}</text>
          </template>
        </see-table>
      </view>

      <!-- 行点击 / 单元格点击 -->
      <text class="title">{{ t('table.demo.event') }}</text>
      <view class="demo-card">
        <see-table :data="baseData" :columns="baseColumns" row-key="id" border @on-row-click="handleRowClick" @on-cell-click="handleCellClick" />
        <view v-if="lastEvent" class="event-log">
          <text class="event-log__text">{{ lastEvent }}</text>
        </view>
      </view>

      <!-- 空状态 -->
      <text class="title">{{ t('table.demo.empty') }}</text>
      <view class="demo-card">
        <see-table :data="emptyList" :columns="baseColumns" :empty-text="t('table.demo.emptyUsers')" />
      </view>

      <!-- 自定义空状态 -->
      <text class="title">{{ t('table.demo.emptySlot') }}</text>
      <view class="demo-card">
        <see-table :data="emptyList" :columns="baseColumns">
          <template #empty>
            <view class="custom-empty">
              <text class="custom-empty__icon">📭</text>
              <text class="custom-empty__text">{{ t('table.demo.customEmptyText') }}</text>
            </view>
          </template>
        </see-table>
      </view>

      <!-- 加载状态 -->
      <text class="title">{{ t('table.demo.loading') }}</text>
      <view class="demo-card">
        <see-table :data="emptyList" :columns="baseColumns" :loading="isLoading || true" />
      </view>

      <!-- 错误状态 -->
      <text class="title">{{ t('table.demo.error') }}</text>
      <view class="demo-card">
        <see-table :data="hasError ? baseData : []" :columns="baseColumns" :error="!hasError" />
      </view>

      <!-- 加载中叠加 -->
      <text class="title">{{ t('table.demo.loadingOverlay') }}</text>
      <view class="demo-card">
        <see-table :data="baseData" :columns="baseColumns" row-key="id" :loading="true" border />
      </view>

      <!-- 省略文本 -->
      <text class="title">{{ t('table.demo.ellipsis') }}</text>
      <view class="demo-card">
        <see-table
          :data="baseData"
          :columns="[
            { key: 'id', title: 'ID', width: 60, align: 'center' },
            { key: 'name', title: t('table.demo.name'), width: 80 },
            { key: 'email', title: t('table.demo.emailEllipsis'), width: 200, ellipsis: true },
            { key: 'role', title: t('table.demo.role'), width: 120 }
          ]"
          row-key="id"
          border
        />
      </view>

      <!-- 隐藏表头 -->
      <text class="title">{{ t('table.demo.hideHeader') }}</text>
      <view class="demo-card">
        <see-table :data="baseData.slice(0, 3)" :columns="baseColumns" row-key="id" :show-header="false" border />
      </view>

      <!-- ==================== Phase 4 功能 ==================== -->

      <!-- 排序 -->
      <text class="title">{{ t('table.demo.sort') }}</text>
      <view class="demo-card">
        <see-table
          :data="sortData"
          :columns="sortColumns"
          row-key="id"
          border
          :sort-key="currentSortKey"
          :sort-order="currentSortOrder"
          @on-sort-change="handleSortChange"
        />
        <view v-if="lastEvent" class="event-log">
          <text class="event-log__text">{{ lastEvent }}</text>
        </view>
      </view>

      <!-- 行选择 -->
      <text class="title">{{ t('table.demo.selection') }}</text>
      <view class="demo-card">
        <see-table
          :data="baseData"
          :columns="baseColumns"
          row-key="id"
          border
          selectable
          :selected-keys="selectedKeys"
          @on-selection-change="handleSelectionChange"
        />
        <view v-if="selectedRows.length > 0" class="event-log">
          <text class="event-log__text">
            {{ t('table.demo.selected', { names: selectedRows.map((r) => r.name).join(t('table.demo.joinSep')) }) }}
          </text>
        </view>
      </view>

      <!-- 展开行 -->
      <text class="title">{{ t('table.demo.expand') }}</text>
      <view class="demo-card">
        <see-table
          :data="baseData.slice(0, 3)"
          :columns="[{ key: '__expand__', title: '', type: 'expand', width: 40 }, ...baseColumns]"
          row-key="id"
          border
          expandable
          :expanded-keys="expandedKeys"
          @on-expand-change="handleExpandChange"
        >
          <template #expand="{ row }">
            <view class="expand-content">
              <text class="expand-content__text">{{ t('table.demo.expandInfo', { name: row.name, email: row.email, role: row.role }) }}</text>
            </view>
          </template>
        </see-table>
      </view>

      <!-- 树形数据 -->
      <text class="title">{{ t('table.demo.tree') }}</text>
      <view class="demo-card">
        <see-table :data="treeData" :columns="treeColumns" row-key="id" border tree :default-expand-all="true" />
      </view>

      <!-- 分页 -->
      <text class="title">{{ t('table.demo.pagination') }}</text>
      <view class="demo-card">
        <see-table
          :data="paginationData"
          :columns="paginationColumns"
          row-key="id"
          border
          :pagination="{ current: 1, pageSize: 10, total: 88, showTotal: true }"
          @on-page-change="handlePageChange"
        />
      </view>

      <!-- 简单分页 -->
      <text class="title">{{ t('table.demo.simplePagination') }}</text>
      <view class="demo-card">
        <see-table
          :data="paginationData"
          :columns="paginationColumns"
          row-key="id"
          border
          :pagination="{ current: 1, pageSize: 10, total: 88, simple: true }"
        />
      </view>

      <!-- 吸顶表头 -->
      <text class="title">{{ t('table.demo.stickyHeader') }}</text>
      <view class="demo-card">
        <see-table :data="scrollYData" :columns="scrollYColumns" row-key="id" height="400" border stripe sticky-header />
      </view>

      <!-- 序号列 -->
      <text class="title">{{ t('table.demo.index') }}</text>
      <view class="demo-card">
        <see-table
          :data="baseData"
          :columns="[{ key: '__index__', title: '#', type: 'index', width: 60, align: 'center' }, ...baseColumns]"
          row-key="id"
          border
        />
      </view>

      <!-- 组合场景：排序 + 选择 + 分页 -->
      <text class="title">{{ t('table.demo.combo') }}</text>
      <view class="demo-card">
        <see-table
          :data="comboData"
          :columns="comboColumns"
          row-key="id"
          border
          stripe
          selectable
          :selected-keys="comboSelectedKeys"
          :pagination="{ current: 1, pageSize: 10, total: 30, showTotal: true }"
          @on-selection-change="handleComboSelectionChange"
          @on-sort-change="handleSortChange"
        />
        <view v-if="comboSelectedKeys.length > 0" class="event-log">
          <text class="event-log__text">{{ t('table.demo.selectedCount', { count: comboSelectedKeys.length }) }}</text>
        </view>
      </view>

      <!-- ==================== Phase 5 功能 ==================== -->

      <!-- 虚拟行（大数据表格） -->
      <text class="title">{{ t('table.demo.virtualRow') }}</text>
      <view class="demo-card">
        <see-table :data="virtualData" :columns="virtualColumns" row-key="id" virtual :row-height="48" height="400" border stripe />
      </view>

      <!-- 固定列 -->
      <text class="title">{{ t('table.demo.fixedColumn') }}</text>
      <view class="demo-card">
        <see-table :data="fixedColumnData" :columns="fixedColumns" row-key="id" border height="400" />
      </view>

      <!-- 虚拟行 + 固定列 -->
      <text class="title">{{ t('table.demo.virtualRowFixedCol') }}</text>
      <view class="demo-card">
        <see-table :data="virtualData" :columns="fixedColumns" row-key="id" virtual :row-height="48" height="400" border stripe />
      </view>

      <!-- 虚拟列（多列表格） -->
      <text class="title">{{ t('table.demo.virtualCol') }}</text>
      <view class="demo-card">
        <see-table :data="virtualXData" :columns="virtualXColumns" row-key="id" virtual-x border height="400" />
      </view>

      <!-- 树形 + 虚拟行 -->
      <text class="title">{{ t('table.demo.treeVirtual') }}</text>
      <view class="demo-card">
        <see-table
          :data="treeVirtualData"
          :columns="treeColumns"
          row-key="id"
          tree
          virtual
          :row-height="48"
          height="400"
          border
          :default-expand-all="false"
        />
      </view>

      <!-- 展开行 + 虚拟行 -->
      <text class="title">{{ t('table.demo.expandVirtual') }}</text>
      <view class="demo-card">
        <see-table
          :data="virtualData.slice(0, 200)"
          :columns="[{ key: '__expand__', title: '', type: 'expand', width: 40 }, ...virtualColumns]"
          row-key="id"
          virtual
          :row-height="48"
          height="400"
          border
          expandable
          :expanded-keys="expandVirtualKeys"
          @on-expand-change="handleExpandVirtualChange"
        >
          <template #expand="{ row }">
            <view class="expand-content">
              <text class="expand-content__text">{{ t('table.demo.expandInfo', { name: row.name, email: row.email, role: row.role }) }}</text>
            </view>
          </template>
        </see-table>
      </view>
    </view>
  </see-config>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 24rpx;
  background: var(--see-bg-color);
}

.title {
  display: block;
  margin: 28rpx 0 16rpx;
  color: var(--see-tips-color);
  font-size: 28rpx;
}

.sub-title {
  display: block;
  padding: 12rpx 24rpx 8rpx;
  font-size: 24rpx;
  color: var(--see-info-dark);
}

.demo-card {
  padding: 0;
  border: 1px solid var(--see-border-four-color);
  border-radius: 20rpx;
  background: var(--see-bg-color);
  box-shadow: var(--see-card-shadow);
  overflow: hidden;
}

.header-action {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--see-primary);
}

.action-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.action-btn {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;

  &--edit {
    color: var(--see-primary);
    background: rgba(41, 121, 255, 0.08);
  }

  &--delete {
    color: var(--see-error);
    background: rgba(245, 108, 108, 0.08);
  }
}

.price-text {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--see-error);
}

.event-log {
  padding: 16rpx 24rpx;
  border-top: 1px solid var(--see-border-four-color);
  background: var(--see-fill-color-lighter);

  &__text {
    font-size: 24rpx;
    color: var(--see-primary);
  }
}

.custom-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 48rpx 0;

  &__icon {
    font-size: 80rpx;
  }

  &__text {
    font-size: 26rpx;
    color: var(--see-info-dark);
  }
}

.expand-content {
  padding: 24rpx 32rpx;

  &__text {
    font-size: 26rpx;
    color: var(--see-main-color);
  }
}
</style>
