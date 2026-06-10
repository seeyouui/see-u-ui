<script lang="ts" setup>
import { ref } from 'vue'
import type { SeeTableColumn } from '@/uni_modules/see-u-ui/components/see-table/type'

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
  { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', role: '前端开发', status: '在职' },
  { id: 2, name: '李四', age: 32, email: 'lisi@example.com', role: '后端开发', status: '在职' },
  { id: 3, name: '王五', age: 25, email: 'wangwu@example.com', role: '产品经理', status: '在职' },
  { id: 4, name: '赵六', age: 30, email: 'zhaoliu@example.com', role: 'UI 设计师', status: '离职' },
  { id: 5, name: '钱七', age: 27, email: 'qianqi@example.com', role: '测试工程师', status: '在职' }
])

const baseColumns: SeeTableColumn<User>[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: '姓名', width: 120 },
  { key: 'age', title: '年龄', width: 80, align: 'center' },
  { key: 'email', title: '邮箱', width: 240 },
  { key: 'role', title: '职位', width: 150 },
  { key: 'status', title: '状态', width: 100, align: 'center' }
]

// ========== 横向滚动数据 ==========
const scrollColumns: SeeTableColumn<User>[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: '姓名', width: 120 },
  { key: 'age', title: '年龄', width: 80, align: 'center' },
  { key: 'email', title: '邮箱', width: 300 },
  { key: 'role', title: '职位', width: 200 },
  { key: 'status', title: '状态', width: 120, align: 'center' },
  { key: 'remark', title: '备注信息（横向滚动演示）', width: 350 }
]

const scrollData = ref([
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    role: '前端开发',
    status: '在职',
    remark: '这是一段很长的备注信息，用于演示表格横向滚动效果'
  },
  { id: 2, name: '李四', age: 32, email: 'lisi@example.com', role: '后端开发', status: '在职', remark: '横向滚动可以让表格展示更多列数据' },
  { id: 3, name: '王五', age: 25, email: 'wangwu@example.com', role: '产品经理', status: '在职', remark: '当列总宽度超过容器时自动启用横向滚动' }
])

// ========== 边框与斑马纹 ==========
const borderColumns: SeeTableColumn[] = [
  { key: 'name', title: '水果名称', width: 150 },
  { key: 'price', title: '单价（元/斤）', width: 150, align: 'right' },
  { key: 'origin', title: '产地', width: 150 },
  { key: 'stock', title: '库存（吨）', width: 120, align: 'right' }
]

const borderData = ref([
  { name: '苹果', price: '6.50', origin: '山东烟台', stock: 120 },
  { name: '香蕉', price: '3.80', origin: '广东湛江', stock: 85 },
  { name: '橙子', price: '5.20', origin: '江西赣州', stock: 200 },
  { name: '葡萄', price: '12.00', origin: '新疆吐鲁番', stock: 60 },
  { name: '草莓', price: '25.00', origin: '辽宁丹东', stock: 30 }
])

// ========== 尺寸变型 ==========
const sizeColumns: SeeTableColumn[] = [
  { key: 'name', title: '名称', width: 120 },
  { key: 'value', title: '值', width: 100, align: 'center' }
]

const sizeData = ref([
  { name: '参数 A', value: 100 },
  { name: '参数 B', value: 200 },
  { name: '参数 C', value: 300 }
])

// ========== Formatter ==========
const formatterColumns: SeeTableColumn<User>[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: '姓名', width: 120 },
  { key: 'age', title: '年龄', width: 100, align: 'center', formatter: (_row, _col, _idx) => `${_row.age} 岁` },
  { key: 'status', title: '状态', width: 100, align: 'center', formatter: (row) => (row.status === '在职' ? '✅ 在职' : '❌ 离职') }
]

// ========== 自定义插槽 ==========
const slotColumns: SeeTableColumn[] = [
  { key: 'name', title: '商品名称', width: 150 },
  { key: 'price', title: '价格', width: 120, align: 'right' },
  { key: 'action', title: '操作', width: 200, align: 'center' }
]

const slotData = ref([
  { name: 'SeeUI 组件库', price: '免费', id: 1 },
  { name: '高级模板', price: '¥99', id: 2 },
  { name: '定制服务', price: '面议', id: 3 }
])

// ========== 固定高度（纵向滚动） ==========
const scrollYData = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    role: ['前端开发', '后端开发', '产品经理', '设计师', '测试'][i % 5],
    status: i % 4 === 3 ? '离职' : '在职'
  }))
)

const scrollYColumns: SeeTableColumn[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: '姓名', width: 120 },
  { key: 'age', title: '年龄', width: 80, align: 'center' },
  { key: 'email', title: '邮箱', width: 240 },
  { key: 'role', title: '职位', width: 150 },
  { key: 'status', title: '状态', width: 100, align: 'center' }
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
  lastEvent.value = `点击了第 ${index + 1} 行：${(row as User).name}`
}

const handleCellClick = (_row: unknown, column: SeeTableColumn, rowIndex: number) => {
  lastEvent.value = `点击了第 ${rowIndex + 1} 行的 "${column.title}" 列`
}

// ========== Phase 4: 排序 ==========
const sortColumns: SeeTableColumn<User>[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center', sortable: true },
  { key: 'name', title: '姓名', width: 120, sortable: true },
  { key: 'age', title: '年龄', width: 100, align: 'center', sortable: true },
  { key: 'email', title: '邮箱', width: 240 },
  { key: 'role', title: '职位', width: 150 }
]

const sortData = ref<User[]>([
  { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', role: '前端开发', status: '在职' },
  { id: 2, name: '李四', age: 32, email: 'lisi@example.com', role: '后端开发', status: '在职' },
  { id: 3, name: '王五', age: 25, email: 'wangwu@example.com', role: '产品经理', status: '在职' },
  { id: 4, name: '赵六', age: 30, email: 'zhaoliu@example.com', role: 'UI 设计师', status: '离职' },
  { id: 5, name: '钱七', age: 27, email: 'qianqi@example.com', role: '测试工程师', status: '在职' }
])

const currentSortKey = ref('')
const currentSortOrder = ref<'asc' | 'desc' | ''>('')

const handleSortChange = (data: { key: string; order: string; column: SeeTableColumn }) => {
  currentSortKey.value = data.key
  currentSortOrder.value = data.order as 'asc' | 'desc' | ''
  lastEvent.value = `排序：${data.column.title} ${data.order === 'asc' ? '升序' : data.order === 'desc' ? '降序' : '取消'}`
}

// ========== Phase 4: 选择 ==========
const selectedKeys = ref<number[]>([])
const selectedRows = ref<User[]>([])

const handleSelectionChange = (keys: Array<string | number>, rows: unknown[]) => {
  selectedKeys.value = keys as number[]
  selectedRows.value = rows as User[]
  lastEvent.value = `选中了 ${keys.length} 行`
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
    name: '技术部',
    count: 120,
    children: [
      {
        id: 11,
        name: '前端组',
        count: 35,
        children: [
          { id: 111, name: 'React 小组', count: 15 },
          { id: 112, name: 'Vue 小组', count: 20 }
        ]
      },
      { id: 12, name: '后端组', count: 45 },
      { id: 13, name: '测试组', count: 20 },
      { id: 14, name: '运维组', count: 20 }
    ]
  },
  {
    id: 2,
    name: '产品部',
    count: 50,
    children: [
      { id: 21, name: '产品策划', count: 30 },
      { id: 22, name: '产品设计', count: 20 }
    ]
  },
  {
    id: 3,
    name: '市场部',
    count: 80
  }
])

const treeColumns: SeeTableColumn<TreeNode>[] = [
  { key: 'name', title: '部门名称', width: 250 },
  { key: 'count', title: '人数', width: 100, align: 'center' }
]

// ========== Phase 4: 分页 ==========
const paginationData = ref(
  Array.from({ length: 88 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    role: ['前端开发', '后端开发', '产品经理', '设计师', '测试'][i % 5],
    status: i % 4 === 3 ? '离职' : '在职'
  }))
)

const paginationColumns: SeeTableColumn[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: '姓名', width: 120 },
  { key: 'age', title: '年龄', width: 80, align: 'center' },
  { key: 'email', title: '邮箱', width: 240 },
  { key: 'role', title: '职位', width: 150 },
  { key: 'status', title: '状态', width: 100, align: 'center' }
]

const handlePageChange = (data: { current: number; pageSize: number }) => {
  lastEvent.value = `切换到第 ${data.current} 页，每页 ${data.pageSize} 条`
}

// ========== Phase 4: 组合场景 ==========
const comboColumns: SeeTableColumn<User>[] = [
  { key: '__sel__', title: '', type: 'selection', width: 50 },
  { key: 'id', title: 'ID', width: 80, align: 'center', sortable: true },
  { key: 'name', title: '姓名', width: 120, sortable: true },
  { key: 'age', title: '年龄', width: 100, align: 'center', sortable: true },
  { key: 'email', title: '邮箱', width: 240, ellipsis: true },
  { key: 'role', title: '职位', width: 150 },
  { key: 'status', title: '状态', width: 100, align: 'center' }
]

const comboData = ref(
  Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    role: ['前端开发', '后端开发', '产品经理', '设计师', '测试'][i % 5],
    status: i % 4 === 3 ? '离职' : '在职'
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
    name: `用户 ${i + 1}`,
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    role: ['前端开发', '后端开发', '产品经理', '设计师', '测试'][i % 5],
    status: i % 4 === 3 ? '离职' : '在职'
  }))
)

const virtualColumns: SeeTableColumn[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: '姓名', width: 120 },
  { key: 'age', title: '年龄', width: 80, align: 'center' },
  { key: 'email', title: '邮箱', width: 240 },
  { key: 'role', title: '职位', width: 150 },
  { key: 'status', title: '状态', width: 100, align: 'center' }
]

// ========== Phase 5: 固定列 ==========
const fixedColumnData = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    role: ['前端开发', '后端开发', '产品经理', '设计师', '测试'][i % 5],
    status: i % 4 === 3 ? '离职' : '在职',
    address: `北京市海淀区中关村大街 ${100 + i} 号`,
    phone: `138${String(i + 1000).padStart(8, '0')}`
  }))
)

const fixedColumns: SeeTableColumn[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center', fixed: 'left' },
  { key: 'name', title: '姓名', width: 120, fixed: 'left' },
  { key: 'age', title: '年龄', width: 80, align: 'center' },
  { key: 'email', title: '邮箱', width: 240 },
  { key: 'role', title: '职位', width: 150 },
  { key: 'address', title: '地址', width: 300 },
  { key: 'phone', title: '电话', width: 160 },
  { key: 'status', title: '状态', width: 100, align: 'center', fixed: 'right' }
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
  title: `列 ${i + 1}`,
  width: 120,
  align: 'center' as const
}))

// ========== Phase 5: 树形 + 虚拟行 ==========
function generateTreeData(depth: number, count: number, prefix: string): any[] {
  if (depth <= 0) return []
  return Array.from({ length: count }, (_, i) => {
    const node: any = {
      id: `${prefix}${i + 1}`,
      name: `${prefix}节点 ${i + 1}`,
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
      <text class="title">基础用法</text>
      <view class="demo-card">
        <see-table :data="baseData" :columns="baseColumns" row-key="id" />
      </view>

      <!-- 边框 + 斑马纹 -->
      <text class="title">边框 + 斑马纹</text>
      <view class="demo-card">
        <see-table :data="borderData" :columns="borderColumns" border stripe />
      </view>

      <!-- 尺寸变体 -->
      <text class="title">尺寸变体（small / medium / large）</text>
      <view class="demo-card">
        <text class="sub-title">Small</text>
        <see-table :data="sizeData" :columns="sizeColumns" size="small" border />
        <text class="sub-title">Medium（默认）</text>
        <see-table :data="sizeData" :columns="sizeColumns" size="medium" border />
        <text class="sub-title">Large</text>
        <see-table :data="sizeData" :columns="sizeColumns" size="large" border />
      </view>

      <!-- 横向滚动 -->
      <text class="title">横向滚动</text>
      <view class="demo-card">
        <see-table :data="scrollData" :columns="scrollColumns" row-key="id" border />
      </view>

      <!-- 纵向滚动 -->
      <text class="title">固定高度纵向滚动（50 条数据）</text>
      <view class="demo-card">
        <see-table :data="scrollYData" :columns="scrollYColumns" row-key="id" height="400" border stripe />
      </view>

      <!-- Formatter -->
      <text class="title">自定义格式化（formatter）</text>
      <view class="demo-card">
        <see-table :data="baseData" :columns="formatterColumns" row-key="id" border />
      </view>

      <!-- 自定义插槽 -->
      <text class="title">自定义插槽（cell / header）</text>
      <view class="demo-card">
        <see-table :data="slotData" :columns="slotColumns" row-key="id" border>
          <template #header-action="{ column }">
            <text class="header-action">⚡ {{ column.title }}</text>
          </template>
          <template #cell-action>
            <view class="action-btns">
              <text class="action-btn action-btn--edit">编辑</text>
              <text class="action-btn action-btn--delete">删除</text>
            </view>
          </template>
          <template #cell-price="{ row }">
            <text class="price-text">{{ row.price }}</text>
          </template>
        </see-table>
      </view>

      <!-- 行点击 / 单元格点击 -->
      <text class="title">行点击 / 单元格点击</text>
      <view class="demo-card">
        <see-table :data="baseData" :columns="baseColumns" row-key="id" border @on-row-click="handleRowClick" @on-cell-click="handleCellClick" />
        <view v-if="lastEvent" class="event-log">
          <text class="event-log__text">{{ lastEvent }}</text>
        </view>
      </view>

      <!-- 空状态 -->
      <text class="title">空状态</text>
      <view class="demo-card">
        <see-table :data="emptyList" :columns="baseColumns" empty-text="暂无用户数据" />
      </view>

      <!-- 自定义空状态 -->
      <text class="title">自定义空状态插槽</text>
      <view class="demo-card">
        <see-table :data="emptyList" :columns="baseColumns">
          <template #empty>
            <view class="custom-empty">
              <text class="custom-empty__icon">📭</text>
              <text class="custom-empty__text">这里什么都没有哦~</text>
            </view>
          </template>
        </see-table>
      </view>

      <!-- 加载状态 -->
      <text class="title">加载状态</text>
      <view class="demo-card">
        <see-table :data="emptyList" :columns="baseColumns" :loading="isLoading || true" />
      </view>

      <!-- 错误状态 -->
      <text class="title">错误状态</text>
      <view class="demo-card">
        <see-table :data="hasError ? baseData : []" :columns="baseColumns" :error="!hasError" />
      </view>

      <!-- 加载中叠加 -->
      <text class="title">数据加载中叠加</text>
      <view class="demo-card">
        <see-table :data="baseData" :columns="baseColumns" row-key="id" :loading="true" border />
      </view>

      <!-- 省略文本 -->
      <text class="title">文本省略</text>
      <view class="demo-card">
        <see-table
          :data="baseData"
          :columns="[
            { key: 'id', title: 'ID', width: 60, align: 'center' },
            { key: 'name', title: '姓名', width: 80 },
            { key: 'email', title: '邮箱地址（超长文本省略）', width: 200, ellipsis: true },
            { key: 'role', title: '职位', width: 120 }
          ]"
          row-key="id"
          border
        />
      </view>

      <!-- 隐藏表头 -->
      <text class="title">隐藏表头</text>
      <view class="demo-card">
        <see-table :data="baseData.slice(0, 3)" :columns="baseColumns" row-key="id" :show-header="false" border />
      </view>

      <!-- ==================== Phase 4 功能 ==================== -->

      <!-- 排序 -->
      <text class="title">排序（点击表头排序）</text>
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
      <text class="title">行选择（多选 + 全选）</text>
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
          <text class="event-log__text">已选中：{{ selectedRows.map((r) => r.name).join('、') }}</text>
        </view>
      </view>

      <!-- 展开行 -->
      <text class="title">展开行</text>
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
              <text class="expand-content__text">📋 {{ row.name }} 的详细信息：{{ row.email }} | {{ row.role }}</text>
            </view>
          </template>
        </see-table>
      </view>

      <!-- 树形数据 -->
      <text class="title">树形数据</text>
      <view class="demo-card">
        <see-table :data="treeData" :columns="treeColumns" row-key="id" border tree :default-expand-all="true" />
      </view>

      <!-- 分页 -->
      <text class="title">分页表格</text>
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
      <text class="title">简单分页</text>
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
      <text class="title">吸顶表头（固定高度滚动时表头吸顶）</text>
      <view class="demo-card">
        <see-table :data="scrollYData" :columns="scrollYColumns" row-key="id" height="400" border stripe sticky-header />
      </view>

      <!-- 序号列 -->
      <text class="title">序号列</text>
      <view class="demo-card">
        <see-table
          :data="baseData"
          :columns="[{ key: '__index__', title: '#', type: 'index', width: 60, align: 'center' }, ...baseColumns]"
          row-key="id"
          border
        />
      </view>

      <!-- 组合场景：排序 + 选择 + 分页 -->
      <text class="title">组合场景（排序 + 选择 + 分页）</text>
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
          <text class="event-log__text">已选中 {{ comboSelectedKeys.length }} 行</text>
        </view>
      </view>

      <!-- ==================== Phase 5 功能 ==================== -->

      <!-- 虚拟行（大数据表格） -->
      <text class="title">虚拟行（1000 条数据，仅渲染可视区域）</text>
      <view class="demo-card">
        <see-table :data="virtualData" :columns="virtualColumns" row-key="id" virtual :row-height="48" height="400" border stripe />
      </view>

      <!-- 固定列 -->
      <text class="title">固定列（左侧 + 右侧固定）</text>
      <view class="demo-card">
        <see-table :data="fixedColumnData" :columns="fixedColumns" row-key="id" border height="400" />
      </view>

      <!-- 虚拟行 + 固定列 -->
      <text class="title">虚拟行 + 固定列（1000 条 + 固定列）</text>
      <view class="demo-card">
        <see-table :data="virtualData" :columns="fixedColumns" row-key="id" virtual :row-height="48" height="400" border stripe />
      </view>

      <!-- 虚拟列（多列表格） -->
      <text class="title">虚拟列（30 列，仅渲染可视区域）</text>
      <view class="demo-card">
        <see-table :data="virtualXData" :columns="virtualXColumns" row-key="id" virtual-x border height="400" />
      </view>

      <!-- 树形 + 虚拟行 -->
      <text class="title">树形 + 虚拟行（大数据树形表格）</text>
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
      <text class="title">展开行 + 虚拟行</text>
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
              <text class="expand-content__text">📋 {{ row.name }} 的详细信息：{{ row.email }} | {{ row.role }}</text>
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
