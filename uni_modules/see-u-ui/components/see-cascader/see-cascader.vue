<template>
  <view class="see-cascader" :class="cascaderClasses">
    <!-- 触发区域 -->
    <view class="see-cascader__trigger" :class="triggerClasses" @click="open">
      <text class="see-cascader__trigger-text" :class="{ 'is-placeholder': !displayText }">
        {{ displayText || props.placeholder }}
      </text>
      <text class="see-cascader__arrow see-cascader-icon-arrow"></text>
    </view>

    <!-- 弹出面板 -->
    <view v-if="visible" class="see-cascader__overlay" @click="onCancel">
      <view class="see-cascader__panel" @click.stop>
        <!-- Toolbar -->
        <view v-if="props.isShowToolbar" class="see-cascader__toolbar">
          <text class="see-cascader__toolbar-btn is-cancel" @click="onCancel">
            {{ props.cancelText }}
          </text>
          <text class="see-cascader__toolbar-title">{{ props.toolbarTitle }}</text>
          <text class="see-cascader__toolbar-btn is-confirm" @click="onConfirm">
            {{ props.confirmText }}
          </text>
        </view>

        <!-- Tab 导航 -->
        <view v-if="props.isShowTab && panels.length > 0" class="see-cascader__tabs">
          <view
            v-for="(tab, index) in tabs"
            :key="index"
            class="see-cascader__tab"
            :class="{ 'is-active': index === activeLevel }"
            @click="handleTabClick(index)"
          >
            <text class="see-cascader__tab-text">{{ tab.text }}</text>
            <view v-if="index === activeLevel" class="see-cascader__tab-line"></view>
          </view>
        </view>

        <!-- 选项列表 -->
        <scroll-view v-if="currentPanel" class="see-cascader__content" scroll-y :show-scrollbar="false">
          <!-- 加载状态 -->
          <view v-if="currentPanel.isLoading" class="see-cascader__loading">
            <text class="see-cascader__loading-text">加载中...</text>
          </view>

          <!-- 空状态 -->
          <view v-else-if="currentPanel.nodes.length === 0" class="see-cascader__empty">
            <text class="see-cascader__empty-text">暂无数据</text>
          </view>

          <!-- 选项列表 -->
          <view v-else class="see-cascader__list">
            <view
              v-for="node in currentPanel.nodes"
              :key="node.value"
              class="see-cascader__option"
              :class="{
                'is-selected': node.isSelected,
                'is-disabled': node.isDisabled
              }"
              @click="handleOptionClick(node)"
            >
              <text class="see-cascader__option-text">{{ node.text }}</text>
              <text v-if="node.isSelected" class="see-cascader__option-check see-cascader-icon-check"></text>
              <text v-else-if="!node.isLeaf" class="see-cascader__option-arrow see-cascader-icon-arrow-right"></text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * Cascader 级联选择器
 * @description Tab 切换式层级选择器，支持无限级和懒加载
 * @tutorial https://www.seeuui.cn/components/cascader/
 *
 * @property {Array}    modelValue    选中值路径数组（v-model）
 * @property {Array}    options       选项数据（树形结构）
 * @property {String}   placeholder   占位符
 * @property {Boolean}  isDisabled    是否禁用
 * @property {Boolean}  isReadonly    是否只读
 * @property {Boolean}  isShowToolbar 是否显示 toolbar（默认 true）
 * @property {String}   toolbarTitle  toolbar 标题
 * @property {String}   confirmText   确认按钮文字
 * @property {String}   cancelText    取消按钮文字
 * @property {String}   valueKey      值键名（默认 'value'）
 * @property {String}   labelKey      标签键名（默认 'text'）
 * @property {String}   childrenKey   子选项键名（默认 'children'）
 * @property {Boolean}  isLazy        是否懒加载子选项
 * @property {Function} lazyLoad      懒加载函数
 * @property {String}   size          尺寸
 * @property {Boolean}  isBorder      是否显示边框（默认 true）
 * @property {String}   name          表单字段名
 * @property {Boolean}  isShowTab     是否显示标签页（默认 true）
 */
import { ref, computed, watch, inject, nextTick } from 'vue'
import { formKey } from '../../utils/shared/form-keys'
import type { CascaderOption, CascaderNode, CascaderPanel, CascaderTab, CascaderSize, FormContext } from './type'

defineOptions({ name: 'SeeCascader' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 选中值路径数组（v-model） */
    modelValue?: (string | number)[]
    /** 选项数据（树形结构） */
    options?: CascaderOption[]
    /** 占位符 */
    placeholder?: string
    /** 是否禁用 */
    isDisabled?: boolean
    /** 是否只读 */
    isReadonly?: boolean
    /** 是否显示 toolbar */
    isShowToolbar?: boolean
    /** toolbar 标题 */
    toolbarTitle?: string
    /** 确认按钮文字 */
    confirmText?: string
    /** 取消按钮文字 */
    cancelText?: string
    /** 值键名 */
    valueKey?: string
    /** 标签键名 */
    labelKey?: string
    /** 子选项键名 */
    childrenKey?: string
    /** 是否懒加载子选项 */
    isLazy?: boolean
    /** 懒加载函数 */
    lazyLoad?: (node: CascaderOption) => Promise<CascaderOption[]>
    /** 尺寸 */
    size?: CascaderSize
    /** 是否显示边框 */
    isBorder?: boolean
    /** 表单字段名 */
    name?: string
    /** 是否显示标签页 */
    isShowTab?: boolean
  }>(),
  {
    modelValue: () => [],
    options: () => [],
    placeholder: '请选择',
    isDisabled: false,
    isReadonly: false,
    isShowToolbar: true,
    toolbarTitle: '',
    confirmText: '确认',
    cancelText: '取消',
    valueKey: 'value',
    labelKey: 'text',
    childrenKey: 'children',
    isLazy: false,
    lazyLoad: undefined,
    size: 'default',
    isBorder: true,
    name: '',
    isShowTab: true
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 值变化时触发 */
  (e: 'onChange', value: (string | number)[]): void
  /** 确认时触发 */
  (e: 'onConfirm', value: (string | number)[]): void
  /** 取消时触发 */
  (e: 'onCancel'): void
  /** 切换层级 tab 时触发 */
  (e: 'onTabChange', index: number): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: (string | number)[]): void
}>()

/** ---------- inject ---------- */
const formContext = inject(formKey, null)

/** ---------- state ---------- */
/** 面板是否可见 */
const visible = ref(false)
/** 当前激活的层级 */
const activeLevel = ref(0)
/** 各层级面板数据 */
const panels = ref<CascaderPanel[]>([])

/** ---------- computed ---------- */
/** 值键名 */
const vKey = computed(() => props.valueKey || 'value')
/** 标签键名 */
const lKey = computed(() => props.labelKey || 'text')
/** 子选项键名 */
const cKey = computed(() => props.childrenKey || 'children')

/** 实际禁用状态（考虑 Form 联动） */
const mergedDisabled = computed(() => {
  return props.isDisabled || formContext?.isDisabled || false
})

/** 实际只读状态（考虑 Form 联动） */
const mergedReadonly = computed(() => {
  return props.isReadonly || formContext?.isReadonly || false
})

/** 实际尺寸（考虑 Form 联动） */
const mergedSize = computed(() => {
  return props.size || formContext?.size || 'default'
})

/** 实际边框状态 */
const mergedBorder = computed(() => {
  return props.isBorder
})

/** 是否可交互 */
const isInteractive = computed(() => {
  return !mergedDisabled.value && !mergedReadonly.value
})

/** 根节点选项列表 */
const rootNodes = computed<CascaderNode[]>(() => {
  return mapOptionsToNodes(props.options, 0)
})

/** 当前激活的面板 */
const currentPanel = computed<CascaderPanel | undefined>(() => {
  return panels.value[activeLevel.value]
})

/** Tab 列表 */
const tabs = computed<CascaderTab[]>(() => {
  return panels.value.map((panel, index) => {
    const isSelected = panel.selectedText != null && panel.selectedText !== ''
    return {
      index,
      text: isSelected ? panel.selectedText! : '请选择',
      isActive: index === activeLevel.value
    }
  })
})

/** 触发区域显示文本 */
const displayText = computed(() => {
  const selectedTexts: string[] = []
  for (const panel of panels.value) {
    if (panel.selectedText) {
      selectedTexts.push(panel.selectedText)
    } else {
      break
    }
  }
  return selectedTexts.length > 0 ? selectedTexts.join(' / ') : ''
})

/** ---------- classes ---------- */
const cascaderClasses = computed(() => {
  return [`see-cascader--${mergedSize.value}`]
})

const triggerClasses = computed(() => {
  const classes: string[] = []
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  if (mergedBorder.value) classes.push('is-border')
  if (visible.value) classes.push('is-open')
  return classes
})

/** ---------- methods ---------- */

/**
 * 将选项列表映射为节点列表
 */
function mapOptionsToNodes(options: CascaderOption[], level: number): CascaderNode[] {
  return options.map((option) => {
    const value = option[vKey.value] ?? ''
    const text = option[lKey.value] ?? ''
    const children = option[cKey.value]
    const isLeaf = props.isLazy ? option.isLeaf !== false : !children || children.length === 0

    return {
      option,
      level,
      isSelected: false,
      isLeaf,
      isDisabled: !!option.disabled,
      value,
      text
    } as CascaderNode
  })
}

/**
 * 根据 modelValue 初始化面板
 */
function initPanelsFromValue(): void {
  const valuePath = props.modelValue
  if (!valuePath || valuePath.length === 0 || !props.options || props.options.length === 0) {
    panels.value = [
      {
        level: 0,
        nodes: rootNodes.value,
        selectedValue: undefined,
        selectedText: undefined,
        isLoading: false
      }
    ]
    activeLevel.value = 0
    return
  }

  const newPanels: CascaderPanel[] = []
  let currentOptions = props.options

  for (let i = 0; i < valuePath.length; i++) {
    const targetValue = valuePath[i]
    const nodes = mapOptionsToNodes(currentOptions, i)

    // 查找匹配的节点
    const matchedIndex = nodes.findIndex((n) => n.value === targetValue)
    if (matchedIndex === -1) {
      // 值路径不匹配，停止
      break
    }

    // 标记选中
    nodes[matchedIndex].isSelected = true

    newPanels.push({
      level: i,
      nodes,
      selectedValue: targetValue,
      selectedText: nodes[matchedIndex].text,
      isLoading: false
    })

    const matchedOption = nodes[matchedIndex].option
    const children = matchedOption[cKey.value]

    if (children && children.length > 0) {
      currentOptions = children
    } else {
      // 叶子节点或无子节点
      break
    }
  }

  if (newPanels.length > 0) {
    // 如果最后一个面板有选中值且有子选项，添加下一级空面板
    const lastPanel = newPanels[newPanels.length - 1]
    if (lastPanel.selectedValue != null) {
      const lastNode = lastPanel.nodes.find((n) => n.isSelected)
      if (lastNode && !lastNode.isLeaf) {
        const children = lastNode.option[cKey.value]
        if (children && children.length > 0) {
          newPanels.push({
            level: newPanels.length,
            nodes: mapOptionsToNodes(children, newPanels.length),
            selectedValue: undefined,
            selectedText: undefined,
            isLoading: false
          })
        }
      }
    }
    activeLevel.value = newPanels.length - 1
  }

  panels.value = newPanels
}

/**
 * 打开面板
 */
function open(): void {
  if (!isInteractive.value) return
  initPanelsFromValue()
  visible.value = true
}

/**
 * 关闭面板
 */
function close(): void {
  visible.value = false
}

/**
 * 处理选项点击
 */
function handleOptionClick(node: CascaderNode): void {
  if (node.isDisabled) return

  const currentPanelData = panels.value[node.level]
  if (!currentPanelData) return

  // 取消同层级其他选中
  currentPanelData.nodes.forEach((n) => {
    n.isSelected = n.value === node.value
  })
  currentPanelData.selectedValue = node.value
  currentPanelData.selectedText = node.text

  // 移除后续层级面板
  panels.value.splice(node.level + 1)

  // 构建当前选中值路径
  const selectedPath = panels.value.map((p) => p.selectedValue!).filter((v) => v != null)
  emit('update:modelValue', selectedPath)
  emit('onChange', selectedPath)

  if (node.isLeaf) {
    // 叶子节点，选中后直接确认
    nextTick(() => {
      onConfirm()
    })
  } else if (props.isLazy && node.option.isLeaf === false) {
    // 懒加载模式：加载子选项
    loadChildren(node)
  } else {
    // 有子选项，进入下一级
    const children = node.option[cKey.value]
    if (children && children.length > 0) {
      const nextLevel = node.level + 1
      panels.value.push({
        level: nextLevel,
        nodes: mapOptionsToNodes(children, nextLevel),
        selectedValue: undefined,
        selectedText: undefined,
        isLoading: false
      })
      activeLevel.value = nextLevel
    }
  }
}

/**
 * 懒加载子选项
 */
async function loadChildren(node: CascaderNode): Promise<void> {
  if (!props.lazyLoad) return

  const nextLevel = node.level + 1
  // 添加加载中的面板
  panels.value.push({
    level: nextLevel,
    nodes: [],
    selectedValue: undefined,
    selectedText: undefined,
    isLoading: true
  })
  activeLevel.value = nextLevel

  try {
    const children = await props.lazyLoad(node.option)
    const targetPanel = panels.value[nextLevel]
    if (targetPanel) {
      targetPanel.nodes = mapOptionsToNodes(children || [], nextLevel)
      targetPanel.isLoading = false
    }
  } catch (err) {
    // 加载失败，移除面板
    panels.value.splice(nextLevel)
    activeLevel.value = node.level
    console.warn('[SeeCascader] lazyLoad failed:', err instanceof Error ? err.message : 'Unknown error')
  }
}

/**
 * 处理 Tab 点击
 */
function handleTabClick(index: number): void {
  activeLevel.value = index
  emit('onTabChange', index)
}

/**
 * 确认选择
 */
function onConfirm(): void {
  const selectedPath = panels.value.map((p) => p.selectedValue!).filter((v) => v != null)
  emit('update:modelValue', selectedPath)
  emit('onConfirm', selectedPath)
  close()
}

/**
 * 取消选择
 */
function onCancel(): void {
  emit('onCancel')
  close()
}

/** ---------- watch ---------- */

/** 监听 options 变化，重新初始化 */
// deep: false — 依赖外部通过引用替换 options 数组来触发，避免深度遍历整个选项树
watch(
  () => props.options,
  () => {
    if (visible.value) {
      initPanelsFromValue()
    }
  },
  { deep: false }
)
</script>

<style lang="scss" scoped>
/* ---------- CSS 变量（组件级覆盖） ---------- */
.see-cascader {
  --cascader-height-small: 56rpx;
  --cascader-height-default: 72rpx;
  --cascader-height-large: 88rpx;
  --cascader-font-size-small: 24rpx;
  --cascader-font-size-default: 28rpx;
  --cascader-font-size-large: 32rpx;
  --cascader-panel-height: 700rpx;
  --cascader-toolbar-height: 96rpx;
  --cascader-tab-height: 80rpx;
  --cascader-content-height: 520rpx;
  --cascader-option-height: 96rpx;
  --cascader-padding-h: 24rpx;
  --cascader-border-radius: 16rpx;
}

/* ---------- 触发区域 ---------- */
.see-cascader__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  background-color: var(--see-bg-color);
  border-radius: 8rpx;
  transition: border-color 0.2s ease;

  &.is-border {
    border: 1px solid var(--see-border-four-color);
  }

  &.is-open.is-border {
    border-color: var(--see-primary);
  }

  .see-cascader--small & {
    min-height: var(--cascader-height-small);
    padding: 0 16rpx;
  }

  .see-cascader--default & {
    min-height: var(--cascader-height-default);
    padding: 0 var(--cascader-padding-h);
  }

  .see-cascader--large & {
    min-height: var(--cascader-height-large);
    padding: 0 32rpx;
  }

  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--see-border-four-color);

    .see-cascader__trigger-text {
      color: var(--see-tips-color);
    }
  }

  &.is-readonly {
    cursor: default;
  }
}

.see-cascader__trigger-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--see-main-color);

  .see-cascader--small & {
    font-size: var(--cascader-font-size-small);
  }

  .see-cascader--default & {
    font-size: var(--cascader-font-size-default);
  }

  .see-cascader--large & {
    font-size: var(--cascader-font-size-large);
  }

  &.is-placeholder {
    color: var(--see-tips-color);
  }
}

.see-cascader__arrow {
  flex-shrink: 0;
  margin-left: 12rpx;
  color: var(--see-tips-color);
  font-size: 24rpx;
  transition: transform 0.2s ease;

  .see-cascader__trigger.is-open & {
    transform: rotate(180deg);
  }
}

/* ---------- 弹出层遮罩 ---------- */
.see-cascader__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: cascader-fade-in 0.25s ease;
}

@keyframes cascader-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ---------- 弹出面板 ---------- */
.see-cascader__panel {
  width: 100%;
  max-height: var(--cascader-panel-height);
  background-color: var(--see-bg-color);
  border-radius: var(--cascader-border-radius) var(--cascader-border-radius) 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: cascader-slide-up 0.3s ease;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

@keyframes cascader-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* ---------- Toolbar ---------- */
.see-cascader__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--cascader-toolbar-height);
  padding: 0 var(--cascader-padding-h);
  border-bottom: 1px solid var(--see-border-four-color);
  flex-shrink: 0;
}

.see-cascader__toolbar-btn {
  font-size: 30rpx;
  padding: 8rpx 16rpx;

  &.is-cancel {
    color: var(--see-content-color);
  }

  &.is-confirm {
    color: var(--see-primary);
    font-weight: 500;
  }

  &:active {
    opacity: 0.7;
  }
}

.see-cascader__toolbar-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--see-main-color);
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- Tab 导航 ---------- */
.see-cascader__tabs {
  display: flex;
  align-items: stretch;
  height: var(--cascader-tab-height);
  padding: 0 var(--cascader-padding-h);
  border-bottom: 1px solid var(--see-border-four-color);
  overflow-x: auto;
  flex-shrink: 0;

  &::-webkit-scrollbar {
    display: none;
  }
}

.see-cascader__tab {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24rpx;
  flex-shrink: 0;
  cursor: pointer;

  &.is-active {
    .see-cascader__tab-text {
      color: var(--see-primary);
      font-weight: 500;
    }
  }

  &:active {
    opacity: 0.7;
  }
}

.see-cascader__tab-text {
  font-size: 28rpx;
  color: var(--see-content-color);
  white-space: nowrap;
  transition: color 0.2s ease;
}

.see-cascader__tab-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background-color: var(--see-primary);
}

/* ---------- 选项内容区 ---------- */
.see-cascader__content {
  flex: 1;
  height: var(--cascader-content-height);
  min-height: 0;
}

.see-cascader__list {
  padding: 8rpx 0;
}

/* ---------- 选项 ---------- */
.see-cascader__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--cascader-option-height);
  padding: 0 var(--cascader-padding-h);
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:active {
    background-color: var(--see-info-light);
  }

  &.is-selected {
    .see-cascader__option-text {
      color: var(--see-primary);
      font-weight: 500;
    }
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;

    .see-cascader__option-text {
      color: var(--see-tips-color);
    }
  }
}

.see-cascader__option-text {
  flex: 1;
  min-width: 0;
  font-size: 30rpx;
  color: var(--see-main-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.see-cascader__option-check {
  flex-shrink: 0;
  margin-left: 16rpx;
  color: var(--see-primary);
  font-size: 32rpx;
}

.see-cascader__option-arrow {
  flex-shrink: 0;
  margin-left: 16rpx;
  color: var(--see-tips-color);
  font-size: 24rpx;
}

/* ---------- 加载状态 ---------- */
.see-cascader__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.see-cascader__loading-text {
  font-size: 28rpx;
  color: var(--see-tips-color);
}

/* ---------- 空状态 ---------- */
.see-cascader__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}

.see-cascader__empty-text {
  font-size: 28rpx;
  color: var(--see-tips-color);
}

/* ---------- 内置图标字符 ---------- */
.see-cascader-icon-arrow {
  &::before {
    content: '\25BC';
    font-size: 20rpx;
  }
}

.see-cascader-icon-arrow-right {
  &::before {
    content: '\203A';
    font-size: 36rpx;
  }
}

.see-cascader-icon-check {
  &::before {
    content: '\2713';
    font-size: 32rpx;
  }
}
</style>
