# 数据组件设计方案

日期：2026-06-10

## 背景与目标

see-u-ui 当前已具备基础组件、表单组件和布局组件。本次新增“数据组件”分类，包含：

- `SeeList` 列表
- `SeeVirtualList` 虚拟列表
- `SeeLineProgress` 线形进度条
- `SeeTable` 表格
- `SeeCountDown` 倒计时
- `SeeCountTo` 数字滚动

目标是一次性完整设计并交付数据组件大包。设计优先级为：

1. 组件库完整版能力；
2. 全端兼容优先；
3. 性能优先；
4. 视觉效果精致、适合演示和文档展示。

## 总体策略

采用“方案 A：一次性完整大包”。6 个组件一次性进入数据组件分类，`SeeTable` 直接覆盖重型表格能力，包括排序、选择、固定列、吸顶表头、虚拟行、虚拟列、树形、展开行和分页联动。

为控制复杂度，内部实现必须分层：

- 组件对外保持单一入口；
- 类型集中在 `type.ts`；
- 复杂逻辑拆到 hooks；
- 高风险组合明确约束和降级策略；
- 示例页按基础、增强、高级组合分层展示。

## 目录结构

新增组件目录：

```txt
uni_modules/see-u-ui/components/
  see-list/
    see-list.vue
    type.ts
    index.ts
  see-virtual-list/
    see-virtual-list.vue
    type.ts
    index.ts
  see-line-progress/
    see-line-progress.vue
    type.ts
    index.ts
  see-table/
    see-table.vue
    type.ts
    index.ts
  see-count-down/
    see-count-down.vue
    type.ts
    index.ts
  see-count-to/
    see-count-to.vue
    type.ts
    index.ts
```

新增 hooks：

```txt
uni_modules/see-u-ui/utils/hooks/
  useVirtualWindow/
  useCountdown/
  useCountTo/
```

`useVirtualWindow` 服务 `SeeVirtualList` 和 `SeeTable` 的虚拟滚动。`useCountdown` 管理倒计时定时器生命周期。`useCountTo` 管理数字补间和动画帧降级。

## 设计原则

### 全端兼容

- 以 `view`、`text`、`scroll-view`、CSS 变量和 rpx 为基础。
- 不把 H5 DOM API 作为核心路径。
- 动态高度、复杂测量和滚动同步都必须有固定尺寸主路径或降级策略。

### 性能优先

- `SeeVirtualList` 和 `SeeTable` 控制渲染节点数量。
- 虚拟滚动以固定高度为主路径。
- 滚动事件内部节流，避免高频响应式更新。
- `SeeCountDown` 默认秒级刷新；毫秒模式显式开启。
- `SeeCountTo` 完成后立即清理 raf 或 timer。

### 视觉精致

- 统一使用轻量卡片、细边框、浅阴影、清晰数据层级。
- 长列表和虚拟表格滚动区域避免重阴影和复杂渐变。
- 动画优先作用于 width、transform、opacity 等低成本属性。
- 沿用 `var(--see-*)` 主题变量，并允许组件局部变量扩展。

## 组件设计

## SeeList 列表

### 定位

基础数据容器，统一处理普通列表、加载状态、空状态、错误状态、完成状态、分组和列表项插槽。大量数据场景交给 `SeeVirtualList`。

### Props

```ts
interface SeeListProps<T = unknown> {
  list?: T[]
  keyField?: string
  loading?: boolean
  finished?: boolean
  error?: boolean
  emptyText?: string
  errorText?: string
  loadingText?: string
  finishedText?: string
  immediateCheck?: boolean
  offset?: number
  direction?: 'vertical' | 'horizontal'
  border?: boolean
  divided?: boolean
  itemGap?: string
  padding?: string
  groupBy?: string | ((item: T, index: number) => string)
}
```

### Slots

- `default` / `item`：自定义列表项；暴露 `{ item, index, group? }`。
- `header`：列表头部。
- `footer`：列表底部。
- `empty`：空状态。
- `loading`：加载状态。
- `error`：错误状态。
- `finished`：加载完成。
- `group`：分组标题。

### Events

- `onLoadMore`
- `onRefresh`
- `onRetry`
- `onClickItem(item, index)`

## SeeVirtualList 虚拟列表

### 定位

用于大数据列表渲染，解决节点过多、滚动卡顿、可视窗口渲染和跳转指定索引。固定高度是主路径，动态高度是增强模式。

### Props

```ts
interface SeeVirtualListProps<T = unknown> {
  list?: T[]
  itemHeight: number
  height: number | string
  keyField?: string
  buffer?: number
  scrollTop?: number
  scrollIntoIndex?: number
  horizontal?: boolean
  itemGap?: number
  estimatedItemHeight?: number
  dynamic?: boolean
  lowerThreshold?: number
  upperThreshold?: number
  showScrollbar?: boolean
}
```

### Slots

- `item`：渲染列表项；暴露 `{ item, index, activeIndex }`。
- `header`
- `footer`
- `empty`

### Events

- `onScroll(event)`
- `onRangeChange({ start, end, visibleStart, visibleEnd })`
- `onScrollToLower`
- `onScrollToUpper`
- `onItemClick(item, index)`

### Methods

- `scrollToIndex(index: number, animated?: boolean): void`
- `scrollToOffset(offset: number, animated?: boolean): void`
- `reset(): void`

### 虚拟窗口计算

```ts
visibleStart = Math.floor(scrollOffset / itemSize)
visibleEnd = visibleStart + visibleCount + buffer
translateOffset = visibleStart * itemSize
totalSize = list.length * itemSize
```

渲染结构：

```txt
scroll-view
  spacer
    visible-wrapper
      visible-items
```

## SeeLineProgress 线形进度条

### 定位

用于任务进度、上传进度、步骤完成度和仪表盘进度展示。

### Props

```ts
interface SeeLineProgressProps {
  percentage?: number
  max?: number
  strokeWidth?: string
  trackColor?: string
  activeColor?: string | string[]
  status?: 'normal' | 'success' | 'warning' | 'error'
  striped?: boolean
  animated?: boolean
  showText?: boolean
  textInside?: boolean
  format?: (percentage: number) => string
  round?: boolean
  inactive?: boolean
  duration?: number
}
```

### Slots

- `text`：自定义百分比文字。
- `default`：进度条附加内容。

### Events

- `onChange(percentage)`
- `onComplete`

### 视觉模式

- 基础线形
- 渐变线形
- 状态线形：success / warning / error
- 条纹线形
- 内嵌文字
- 外置文字

## SeeTable 表格

### 定位

重型数据表格，覆盖列配置、表头、横向滚动、纵向滚动、排序、选择、固定列、吸顶表头、展开行、树形数据、分页联动、虚拟行、虚拟列、加载、空、错误状态和单元格插槽。

### Column 类型

```ts
interface SeeTableColumn<T = unknown> {
  key: string
  title: string
  dataIndex?: string
  width?: string | number
  minWidth?: string | number
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  sortable?: boolean | 'custom'
  ellipsis?: boolean
  type?: 'normal' | 'selection' | 'index' | 'expand'
  children?: SeeTableColumn<T>[]
  formatter?: (row: T, column: SeeTableColumn<T>, rowIndex: number) => string | number
}
```

### Props

```ts
interface SeeTableProps<T = unknown> {
  data?: T[]
  columns?: SeeTableColumn<T>[]
  rowKey?: string | ((row: T, index: number) => string | number)

  loading?: boolean
  error?: boolean
  emptyText?: string

  border?: boolean
  stripe?: boolean
  size?: 'small' | 'medium' | 'large'
  height?: string | number
  maxHeight?: string | number

  stickyHeader?: boolean
  showHeader?: boolean

  selectable?: boolean
  selectedKeys?: Array<string | number>
  defaultSelectedKeys?: Array<string | number>

  sortable?: boolean
  sortKey?: string
  sortOrder?: 'asc' | 'desc' | ''

  expandable?: boolean
  expandedKeys?: Array<string | number>

  tree?: boolean
  childrenField?: string
  indent?: number
  defaultExpandAll?: boolean

  pagination?: false | SeeTablePagination

  virtual?: boolean
  virtualX?: boolean
  rowHeight?: number
  estimatedRowHeight?: number
  buffer?: number
}
```

```ts
interface SeeTablePagination {
  current?: number
  pageSize?: number
  total?: number
  showTotal?: boolean
  simple?: boolean
}
```

### Slots

- `cell-{key}`：某列单元格。
- `header-{key}`：某列表头。
- `empty`
- `loading`
- `error`
- `expand`
- `footer`
- `pagination`

通用 cell 插槽暴露：

```ts
{
  row: T
  column: SeeTableColumn<T>
  rowIndex: number
  value: unknown
}
```

### Events

- `onRowClick(row, rowIndex)`
- `onCellClick(row, column, rowIndex)`
- `onSortChange({ key, order, column })`
- `onSelectionChange(selectedKeys, selectedRows)`
- `onExpandChange(expandedKeys, row)`
- `onPageChange({ current, pageSize })`
- `onScroll(event)`
- `onRangeChange({ rowStart, rowEnd, colStart, colEnd })`

### 内部结构

```txt
see-table/
  see-table.vue
  type.ts
  index.ts
  hooks/
    useTableColumns.ts
    useTableSelection.ts
    useTableSort.ts
    useTableTree.ts
    useTableExpand.ts
    useTableVirtual.ts
    useTablePagination.ts
```

`SeeTable` 对外是单组件，内部通过 hooks 拆分列处理、选择、排序、树形、展开、虚拟窗口和分页逻辑。

### 高级能力约束

- `virtual` 要求 `rowHeight` 或 `estimatedRowHeight`。
- `virtualX` 要求明确 column width。
- `fixed + virtual` 推荐固定 `rowHeight`。
- `tree + virtual` 先 flatten 可见行，再进入虚拟窗口。
- `expand + virtual` 推荐固定展开区域高度。
- 动态高度 + 固定列是高级风险组合，需要降级或文档限制。

## SeeCountDown 倒计时

### 定位

用于验证码倒计时、活动倒计时、支付剩余时间和订单超时关闭。

### Props

```ts
interface SeeCountDownProps {
  time?: number
  format?: string
  autoStart?: boolean
  millisecond?: boolean
  interval?: number
  serverTime?: number
  endTime?: number
  separator?: string
  showDays?: boolean
  zeroPad?: boolean
  textColor?: string
  fontSize?: string
  block?: boolean
}
```

### Slots

- `default`：自定义展示；暴露 `{ days, hours, minutes, seconds, milliseconds, total, formatted }`。

### Events

- `onChange(timeData)`
- `onFinish`
- `onStart`
- `onPause`
- `onReset`

### Methods

- `start(): void`
- `pause(): void`
- `reset(time?: number): void`
- `finish(): void`

### 性能策略

默认 `interval = 1000`。只有 `millisecond = true` 时使用高频刷新。组件卸载必须清理定时器。只有时间片变化才触发 `onChange`。

## SeeCountTo 数字滚动

### 定位

用于统计卡片、金额变化、数据大屏和指标增长动画。

### Props

```ts
interface SeeCountToProps {
  startVal?: number
  endVal?: number
  duration?: number
  autoplay?: boolean
  decimals?: number
  decimal?: string
  separator?: string
  prefix?: string
  suffix?: string
  useEasing?: boolean
  easingFn?: (t: number, b: number, c: number, d: number) => number
  color?: string
  fontSize?: string
  fontWeight?: string | number
}
```

### Slots

- `prefix`
- `suffix`
- `default`

### Events

- `onStart`
- `onChange(value)`
- `onFinish`
- `onReset`

### Methods

- `start(): void`
- `pause(): void`
- `resume(): void`
- `reset(): void`
- `update(value: number): void`

### 动画策略

优先使用 `requestAnimationFrame`，端能力不足时降级为 `setTimeout(16ms)`。默认 easing 为 `easeOutExpo`。支持小数位、千分位、前缀、后缀、自定义小数点和自定义 easing。

## 视觉与示例页面

新增页面：

```txt
pages/seeList/index.vue
pages/seeVirtualList/index.vue
pages/seeLineProgress/index.vue
pages/seeTable/index.vue
pages/seeCountDown/index.vue
pages/seeCountTo/index.vue
```

首页新增“数据组件”分类：

```txt
数据组件
  List 列表
  VirtualList 虚拟列表
  LineProgress 线形进度条
  Table 表格
  CountDown 倒计时
  CountTo 数字滚动
```

每个示例页统一结构：

```txt
基础用法
状态展示
插槽用法
业务场景
性能/大数据场景
API 说明入口
```

`SeeTable` 示例页必须包含基础表格、横向滚动、排序、多选、固定列、吸顶表头、展开行、树形表格、分页表格、虚拟行、虚拟列和组合场景。

## 实现顺序

### 第一阶段：基础设施与轻量组件

- `SeeLineProgress`
- `SeeCountDown`
- `SeeCountTo`
- `useCountdown`
- `useCountTo`
- 对应示例页与测试

### 第二阶段：List 与 VirtualList

- `SeeList`
- `SeeVirtualList`
- `useVirtualWindow`
- 对应示例页与测试

### 第三阶段：SeeTable 基础能力

- 列配置
- 表头
- 表体
- 横向滚动
- 空、加载、错误状态
- border / stripe / size
- cell/header 插槽
- 行点击/单元格点击

### 第四阶段：SeeTable 业务增强能力

- 排序
- 选择
- 展开行
- 树形数据
- 分页联动
- 吸顶表头

### 第五阶段：SeeTable 重型性能能力

- 固定列
- 虚拟行
- 虚拟列
- 虚拟行 + 固定列
- 虚拟列 + 固定列
- 树形 + 虚拟行
- 展开行 + 虚拟行

## 测试策略

### 组件渲染测试

覆盖 props 默认值、class 状态、style 计算、插槽渲染和事件触发。

### Hooks 单元测试

覆盖：

- `useVirtualWindow` 的窗口范围、buffer、totalSize、scrollToIndex offset。
- `useCountdown` 的 start、pause、reset、finish、millisecond、endTime/serverTime。
- `useCountTo` 的 easing、decimals、separator、update、reset。

### Table 逻辑测试

覆盖：

- `useTableColumns`：扁平列、分组表头、fixed left/right。
- `useTableSelection`：单选、全选、受控 selectedKeys。
- `useTableTree`：flatten、展开/收起、defaultExpandAll。
- `useTableSort`：asc、desc、取消排序、custom 模式事件。

### 性能边界测试

- `SeeVirtualList` 1000 条数据时，渲染节点数量接近 `visibleCount + buffer * 2`。
- `SeeTable` 开启 `virtual` 后，body 行节点数量受窗口控制。
- `SeeTable` 开启 `virtualX` 后，渲染列数量受窗口控制。

## 风险控制

### SeeTable 文件过大

模板保留在 `see-table.vue`，状态和计算拆到 hooks，类型集中在 `type.ts`，复杂工具函数拆到 `utils.ts`，每个 hook 有独立测试。

### 全端虚拟滚动不一致

固定高度为主路径，动态高度为增强路径。虚拟能力强依赖 `itemHeight`、`rowHeight`、`column.width`。滚动事件节流，不依赖 H5 DOM API 作为主逻辑。

### 固定列与虚拟行同步困难

`fixed + virtual` 要求或强推荐 `rowHeight`。固定列只渲染可视行。主表和 fixed 区共用同一份 `visibleRows`。行高来自统一配置。

### 定时器和动画实例过多

`CountDown` 默认秒级 interval，毫秒模式显式开启。`CountTo` 完成后停止 raf/timer。组件卸载必须清理。`onChange` 做最小必要触发。

### API 太大导致难用

示例页按“基础 → 增强 → 高级组合”分层。文档先给基础用法，再展开完整 API。高级能力集中到独立区块。

## 验收标准

### 通用验收

6 个组件都必须满足：

- 有 `type.ts`。
- 有 `index.ts`。
- 有 `.vue` 组件。
- 有示例页面。
- 加入 `pages.json`。
- 加入首页“数据组件”分类。
- 加入 `uni_modules/see-u-ui/index.ts` 全局导出与安装列表。
- 有基础测试。
- 通过 `pnpm test:run`。
- 通过 `pnpm lint:check` 或至少无新增明显 lint 问题。

### 组件级验收

`SeeList`：正常、空、加载、错误、完成状态可展示；核心插槽生效；点击列表项触发事件；`groupBy` 能生成分组。

`SeeVirtualList`：1000 条数据渲染节点受控；滚动时 `onRangeChange` 更新；`scrollToIndex` 可跳转；footer 和 empty 可展示；不依赖 H5 专属 DOM API。

`SeeLineProgress`：百分比边界正确；状态色正确；渐变、条纹、动画可展示；达到 100% 触发 `onComplete`；文本可内嵌或外置。

`SeeTable`：基础表格、横向滚动、排序、选择、展开、树形、分页、固定列、吸顶表头、虚拟行、虚拟列可用；插槽和 formatter 优先级正确；loading、empty、error 状态正确；高级组合覆盖 `fixed + virtual`、`tree + virtual`、`expand + virtual`、`virtual + virtualX`。

`SeeCountDown`：自动开始、暂停、恢复、重置可用；格式化正确；结束触发 `onFinish`；卸载清理定时器。

`SeeCountTo`：数字从起始值滚到结束值；千分位、小数、前后缀正确；pause、resume、reset、update 可用；完成后清理动画帧或 timer。

## 发布说明建议

本次完成后建议作为 minor 版本发布，例如 `v1.2.0`，提交信息建议：

```txt
feat(data): 新增 List、VirtualList、LineProgress、Table、CountDown、CountTo 数据组件
```
