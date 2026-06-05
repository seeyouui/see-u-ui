<template>
  <view class="see-picker" :class="pickerClasses">
    <!-- 触发区域 -->
    <view class="see-picker__trigger" :class="triggerClasses" @click="handleOpen">
      <text class="see-picker__value" :class="{ 'see-picker__value--placeholder': !displayText }">
        {{ displayText || props.placeholder }}
      </text>
      <text class="see-picker__arrow see-picker-icon-arrow"></text>
    </view>

    <!-- 弹出层 -->
    <view v-if="isVisible" class="see-picker__overlay" @click="handleCancel">
      <view class="see-picker__popup" :class="{ 'see-picker__popup--visible': isPopupVisible }" @click.stop>
        <!-- 顶部 Toolbar -->
        <view v-if="props.isShowToolbar" class="see-picker__toolbar">
          <text class="see-picker__toolbar-btn see-picker__toolbar-btn--cancel" @click="handleCancel">
            {{ props.cancelText }}
          </text>
          <text class="see-picker__toolbar-title">
            {{ props.toolbarTitle }}
          </text>
          <text class="see-picker__toolbar-btn see-picker__toolbar-btn--confirm" @click="handleConfirm">
            {{ props.confirmText }}
          </text>
        </view>

        <!-- 选择器主体 -->
        <view class="see-picker__body">
          <!-- 各列滚轮 -->
          <view v-for="(column, colIndex) in displayColumns" :key="colIndex" class="see-picker__column">
            <!-- 选中高亮区域指示器 -->
            <view class="see-picker__indicator" :style="indicatorStyle"></view>

            <!-- 滚轮容器 -->
            <view
              class="see-picker__wheel"
              :style="wheelContainerStyle"
              @touchstart="(e) => handleTouchStart(e, colIndex)"
              @touchmove.prevent="(e) => handleTouchMove(e, colIndex)"
              @touchend="(e) => handleTouchEnd(e, colIndex)"
            >
              <view class="see-picker__wheel-inner" :style="getWheelStyle(colIndex)">
                <view
                  v-for="(option, optIndex) in column"
                  :key="optIndex"
                  class="see-picker__option"
                  :class="{
                    'see-picker__option--disabled': option.disabled,
                    'see-picker__option--selected': isOptionSelected(colIndex, optIndex)
                  }"
                  :style="optionStyle"
                >
                  <text class="see-picker__option-text">
                    {{ option[props.labelKey] }}
                  </text>
                </view>
              </view>
            </view>

            <!-- 遮罩层（上下渐变） -->
            <view class="see-picker__mask see-picker__mask--top" :style="maskStyle"></view>
            <view class="see-picker__mask see-picker__mask--bottom" :style="maskStyle"></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * Picker 选择器
 * @description 支持单列、多列、联动三种模式的选择器，底部弹出面板 + 滚轮选择
 * @tutorial https://www.seeuui.cn/components/picker/
 *
 * @property {String | Number | Array} modelValue      绑定值（v-model）
 * @property {PickerColumn[]}           columns          选项数据
 * @property {String}                   placeholder      占位符
 * @property {Boolean}                  isDisabled       是否禁用
 * @property {Boolean}                  isReadonly       是否只读
 * @property {Boolean}                  isShowToolbar    是否显示顶部 toolbar（默认 true）
 * @property {String}                   toolbarTitle     toolbar 标题
 * @property {String}                   confirmText      确认按钮文字（默认 '确认'）
 * @property {String}                   cancelText       取消按钮文字（默认 '取消'）
 * @property {Boolean}                  isCascade        是否联动模式
 * @property {String}                   valueKey         值键名（默认 'value'）
 * @property {String}                   labelKey         标签键名（默认 'text'）
 * @property {String}                   childrenKey      子选项键名（默认 'children'）
 * @property {PickerSize}               size             尺寸
 * @property {Boolean}                  isBorder         是否显示边框（默认 true）
 * @property {String}                   name             表单字段名
 * @property {Number}                   visibleItemCount 可见选项数（默认 5）
 * @property {Boolean}                  isAsync          是否异步加载
 */
import { ref, computed, watch, inject, nextTick, reactive } from 'vue'
import { formKey } from '../../utils/shared/form-keys'
import type { PickerOption, PickerColumn, PickerSize, FormContext, WheelState } from './type'

defineOptions({ name: 'SeePicker' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 绑定值（v-model） */
    modelValue?: string | number | (string | number)[]
    /** 选项数据 */
    columns?: PickerColumn[]
    /** 占位符 */
    placeholder?: string
    /** 是否禁用 */
    isDisabled?: boolean
    /** 是否只读 */
    isReadonly?: boolean
    /** 是否显示顶部 toolbar */
    isShowToolbar?: boolean
    /** toolbar 标题 */
    toolbarTitle?: string
    /** 确认按钮文字 */
    confirmText?: string
    /** 取消按钮文字 */
    cancelText?: string
    /** 是否联动模式 */
    isCascade?: boolean
    /** 值键名 */
    valueKey?: string
    /** 标签键名 */
    labelKey?: string
    /** 子选项键名 */
    childrenKey?: string
    /** 尺寸 */
    size?: PickerSize
    /** 是否显示边框 */
    isBorder?: boolean
    /** 表单字段名 */
    name?: string
    /** 可见选项数 */
    visibleItemCount?: number
    /** 是否异步加载 */
    isAsync?: boolean
  }>(),
  {
    modelValue: '',
    columns: () => [],
    placeholder: '请选择',
    isDisabled: false,
    isReadonly: false,
    isShowToolbar: true,
    toolbarTitle: '',
    confirmText: '确认',
    cancelText: '取消',
    isCascade: false,
    valueKey: 'value',
    labelKey: 'text',
    childrenKey: 'children',
    size: 'default',
    isBorder: true,
    name: '',
    visibleItemCount: 5,
    isAsync: false
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 选中值变化时触发 */
  (e: 'onChange', value: string | number | (string | number)[], index: number): void
  /** 确认时触发 */
  (e: 'onConfirm', value: string | number | (string | number)[]): void
  /** 取消时触发 */
  (e: 'onCancel'): void
  /** 列变化时触发（联动模式） */
  (e: 'onColumnChange', index: number): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: string | number | (string | number)[]): void
}>()

/** ---------- inject ---------- */
const formContext = inject(formKey, null)

/** ---------- 常量 ---------- */
const ITEM_HEIGHT = 88 // 每个选项的高度 rpx
/** 缓存窗口宽度，避免触摸事件中同步调用 getSystemInfoSync */
let cachedWindowWidth = 375
try {
  const sysInfo = uni.getSystemInfoSync()
  cachedWindowWidth = sysInfo.windowWidth || 375
} catch (e) {
  cachedWindowWidth = 375
}

/** ---------- refs ---------- */
const isVisible = ref(false)
const isPopupVisible = ref(false)
/** 每列选中的索引 */
const selectedIndices = ref<number[]>([])
/** 每列滚轮状态 */
const wheelStates = reactive<Record<number, WheelState>>({})
/** 当前显示的列数据（联动模式下会动态变化） */
const currentCascadeColumns = ref<PickerColumn[]>([])

/** ---------- computed ---------- */

/** 实际禁用状态 */
const mergedDisabled = computed(() => {
  return props.isDisabled || formContext?.isDisabled || false
})

/** 实际只读状态 */
const mergedReadonly = computed(() => {
  return props.isReadonly || formContext?.isReadonly || false
})

/** 实际尺寸 */
const mergedSize = computed(() => {
  return props.size || formContext?.size || 'default'
})

/** 当前显示的列数据 */
const displayColumns = computed<PickerColumn[]>(() => {
  if (props.isCascade) {
    return currentCascadeColumns.value
  }
  // 单列模式：将数据包装为二维数组
  if (props.columns.length > 0 && !Array.isArray(props.columns[0])) {
    return [props.columns as PickerColumn]
  }
  return props.columns as PickerColumn[]
})

/** 显示文本 */
const displayText = computed(() => {
  if (props.isCascade) {
    return getCascadeDisplayText()
  }

  const columns = displayColumns.value
  if (!columns.length) return ''

  // 单列模式
  if (columns.length === 1) {
    const idx = selectedIndices.value[0] ?? -1
    if (idx >= 0 && columns[0][idx]) {
      return String(columns[0][idx][props.labelKey])
    }
    return ''
  }

  // 多列模式
  return columns
    .map((col, i) => {
      const idx = selectedIndices.value[i] ?? -1
      if (idx >= 0 && col[idx]) {
        return String(col[idx][props.labelKey])
      }
      return ''
    })
    .filter(Boolean)
    .join(' / ')
})

/** 每个选项的高度（px 用于计算） */
const itemHeightPx = ITEM_HEIGHT

/** 滚轮容器高度 */
const wheelHeight = computed(() => {
  return ITEM_HEIGHT * props.visibleItemCount
})

/** 选中指示器样式 */
const indicatorStyle = computed(() => {
  return {
    height: `${ITEM_HEIGHT}rpx`,
    top: `${(wheelHeight.value - ITEM_HEIGHT) / 2}rpx`
  }
})

/** 滚轮容器样式 */
const wheelContainerStyle = computed(() => {
  return {
    height: `${wheelHeight.value}rpx`
  }
})

/** 选项样式 */
const optionStyle = computed(() => {
  return {
    height: `${ITEM_HEIGHT}rpx`,
    lineHeight: `${ITEM_HEIGHT}rpx`
  }
})

/** 遮罩层样式 */
const maskStyle = computed(() => {
  const maskHeight = ((props.visibleItemCount - 1) / 2) * ITEM_HEIGHT
  return {
    height: `${maskHeight}rpx`
  }
})

/** 触发器样式类 */
const pickerClasses = computed(() => {
  return [`see-picker--${mergedSize.value}`]
})

/** 触发区域样式类 */
const triggerClasses = computed(() => {
  const classes: string[] = []
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  if (props.isBorder) classes.push('is-border')
  return classes
})

/** ---------- methods ---------- */

/**
 * @title 获取联动模式下的显示文本
 */
function getCascadeDisplayText(): string {
  const texts: string[] = []
  let columns = props.columns

  for (let i = 0; i < selectedIndices.value.length; i++) {
    const idx = selectedIndices.value[i]
    if (idx >= 0 && columns[idx]) {
      texts.push(String(columns[idx][props.labelKey]))
      if (columns[idx][props.childrenKey]) {
        columns = columns[idx][props.childrenKey]!
      } else {
        break
      }
    } else {
      break
    }
  }
  return texts.join(' / ')
}

/**
 * @title 初始化选中索引
 * @description 根据 modelValue 初始化每列的选中索引
 */
function initSelectedIndices(): void {
  if (props.isCascade) {
    initCascadeIndices()
    return
  }

  const columns = displayColumns.value
  const values = Array.isArray(props.modelValue) ? props.modelValue : props.modelValue !== '' && props.modelValue != null ? [props.modelValue] : []

  const indices: number[] = []
  columns.forEach((column, colIndex) => {
    const targetValue = values[colIndex]
    if (targetValue != null) {
      const idx = column.findIndex((opt) => opt[props.valueKey] === targetValue)
      indices.push(idx >= 0 ? idx : 0)
    } else {
      indices.push(0)
    }
  })

  selectedIndices.value = indices
  initWheelStates()
}

/**
 * @title 初始化联动模式索引
 */
function initCascadeIndices(): void {
  const values = Array.isArray(props.modelValue) ? props.modelValue : props.modelValue !== '' && props.modelValue != null ? [props.modelValue] : []

  const indices: number[] = []
  let columns = props.columns
  const cascadeColumns: PickerColumn[] = [columns]

  for (let i = 0; i < values.length; i++) {
    const targetValue = values[i]
    const idx = columns.findIndex((opt) => opt[props.valueKey] === targetValue)
    const actualIdx = idx >= 0 ? idx : 0
    indices.push(actualIdx)

    if (columns[actualIdx]?.[props.childrenKey]) {
      columns = columns[actualIdx][props.childrenKey]!
      cascadeColumns.push(columns)
    } else {
      break
    }
  }

  // 如果没有初始值，至少有第一列
  if (indices.length === 0 && columns.length > 0) {
    indices.push(0)
    if (columns[0]?.[props.childrenKey]) {
      cascadeColumns.push(columns[0][props.childrenKey]!)
    }
  }

  selectedIndices.value = indices
  currentCascadeColumns.value = cascadeColumns
  initWheelStates()
}

/**
 * @title 初始化滚轮状态
 */
function initWheelStates(): void {
  const centerOffset = ((props.visibleItemCount - 1) / 2) * ITEM_HEIGHT
  selectedIndices.value.forEach((idx, colIndex) => {
    if (!wheelStates[colIndex]) {
      wheelStates[colIndex] = {
        offset: 0,
        startY: 0,
        startOffset: 0,
        startTime: 0,
        touching: false
      }
    }
    wheelStates[colIndex].offset = centerOffset - idx * ITEM_HEIGHT
  })
}

/**
 * @title 获取滚轮样式
 */
function getWheelStyle(colIndex: number): Record<string, string> {
  const state = wheelStates[colIndex]
  if (!state) return { transform: 'translateY(0)' }

  return {
    transform: `translateY(${state.offset}rpx)`,
    transition: state.touching ? 'none' : 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
  }
}

/**
 * @title 判断选项是否被选中
 */
function isOptionSelected(colIndex: number, optIndex: number): boolean {
  return selectedIndices.value[colIndex] === optIndex
}

/**
 * @title 获取 rpx 对应的 px 值
 */
function rpxToPx(rpx: number): number {
  return (rpx / 750) * cachedWindowWidth
}

/**
 * @title 触摸开始
 */
function handleTouchStart(event: TouchEvent, colIndex: number): void {
  if (mergedDisabled.value || mergedReadonly.value) return

  const touch = event.touches[0]
  if (!wheelStates[colIndex]) {
    const fallbackCenter = ((props.visibleItemCount - 1) / 2) * ITEM_HEIGHT
    wheelStates[colIndex] = {
      offset: fallbackCenter,
      startY: 0,
      startOffset: 0,
      startTime: 0,
      touching: false
    }
  }

  const state = wheelStates[colIndex]
  state.startY = touch.clientY
  state.startOffset = state.offset
  state.startTime = Date.now()
  state.touching = true
}

/**
 * @title 触摸移动
 */
function handleTouchMove(event: TouchEvent, colIndex: number): void {
  if (mergedDisabled.value || mergedReadonly.value) return

  const state = wheelStates[colIndex]
  if (!state || !state.touching) return

  const touch = event.touches[0]
  const deltaY = touch.clientY - state.startY
  // 将 px 转换为 rpx
  const deltaRpx = (deltaY / cachedWindowWidth) * 750
  let newOffset = state.startOffset + deltaRpx

  // 边界限制（添加弹性效果）
  const column = displayColumns.value[colIndex]
  if (!column) return
  const centerOffset = ((props.visibleItemCount - 1) / 2) * ITEM_HEIGHT
  const maxOffset = centerOffset
  const minOffset = centerOffset - (column.length - 1) * ITEM_HEIGHT

  if (newOffset > maxOffset) {
    newOffset = maxOffset + (newOffset - maxOffset) * 0.3
  } else if (newOffset < minOffset) {
    newOffset = minOffset + (newOffset - minOffset) * 0.3
  }

  state.offset = newOffset
}

/**
 * @title 触摸结束
 */
function handleTouchEnd(event: TouchEvent, colIndex: number): void {
  if (mergedDisabled.value || mergedReadonly.value) return

  const state = wheelStates[colIndex]
  if (!state || !state.touching) return

  state.touching = false

  const column = displayColumns.value[colIndex]
  if (!column || column.length === 0) return

  const duration = Date.now() - state.startTime
  const touch = event.changedTouches[0]
  const deltaY = touch.clientY - state.startY
  const deltaRpx = (deltaY / cachedWindowWidth) * 750

  // 惯性滚动
  let targetOffset = state.offset
  if (duration < 300 && Math.abs(deltaRpx) > 30) {
    // 快速滑动，添加惯性
    const velocity = deltaRpx / duration
    targetOffset = state.offset + velocity * 150
  }

  // 吸附到最近的选项
  const centerOffset = ((props.visibleItemCount - 1) / 2) * ITEM_HEIGHT
  const maxOffset = centerOffset
  const minOffset = centerOffset - (column.length - 1) * ITEM_HEIGHT
  targetOffset = Math.max(minOffset, Math.min(maxOffset, targetOffset))
  const snappedIndex = Math.round((centerOffset - targetOffset) / ITEM_HEIGHT)
  const clampedIndex = Math.max(0, Math.min(column.length - 1, snappedIndex))

  state.offset = centerOffset - clampedIndex * ITEM_HEIGHT

  // 更新选中索引
  if (selectedIndices.value[colIndex] !== clampedIndex) {
    selectedIndices.value[colIndex] = clampedIndex

    // 联动模式：更新子列
    if (props.isCascade) {
      updateCascadeChildren(colIndex)
    }

    const currentValue = getCurrentValue()
    emit('onChange', currentValue, colIndex)

    if (props.isCascade) {
      emit('onColumnChange', colIndex)
    }
  }
}

/**
 * @title 更新联动子列
 */
function updateCascadeChildren(parentColIndex: number): void {
  const columns = [...currentCascadeColumns.value]
  const parentColumn = columns[parentColIndex]
  if (!parentColumn) return

  const parentOption = parentColumn[selectedIndices.value[parentColIndex]]
  if (!parentOption) return

  // 移除父列之后的所有列
  columns.length = parentColIndex + 1

  // 添加子列
  if (parentOption[props.childrenKey]) {
    columns.push(parentOption[props.childrenKey]!)
    // 新列默认选中第一个
    if (selectedIndices.value.length <= parentColIndex + 1) {
      selectedIndices.value.push(0)
    } else {
      selectedIndices.value[parentColIndex + 1] = 0
    }

    // 初始化新列的滚轮状态
    const newColIndex = parentColIndex + 1
    const centerOffset = ((props.visibleItemCount - 1) / 2) * ITEM_HEIGHT
    wheelStates[newColIndex] = {
      offset: centerOffset,
      startY: 0,
      startOffset: 0,
      startTime: 0,
      touching: false
    }

    // 继续递归检查下一级
    currentCascadeColumns.value = columns
    updateCascadeChildren(newColIndex)
  } else {
    // 没有子列了，截断选中索引
    selectedIndices.value.length = columns.length
    currentCascadeColumns.value = columns
  }
}

/**
 * @title 获取当前选中值
 */
function getCurrentValue(): string | number | (string | number)[] {
  const columns = displayColumns.value

  if (props.isCascade) {
    return selectedIndices.value
      .map((idx, colIndex) => {
        const col = columns[colIndex]
        if (col && col[idx]) {
          return col[idx][props.valueKey]
        }
        return ''
      })
      .filter((v) => v !== '')
  }

  // 单列模式
  if (columns.length === 1) {
    const idx = selectedIndices.value[0]
    const col = columns[0]
    if (col && col[idx]) {
      return col[idx][props.valueKey]
    }
    return ''
  }

  // 多列模式
  return columns
    .map((col, i) => {
      const idx = selectedIndices.value[i]
      if (col && col[idx]) {
        return col[idx][props.valueKey]
      }
      return ''
    })
    .filter((v) => v !== '')
}

/**
 * @title 打开选择器
 */
function handleOpen(): void {
  if (mergedDisabled.value || mergedReadonly.value) return
  isVisible.value = true
  nextTick(() => {
    setTimeout(() => {
      isPopupVisible.value = true
    }, 30)
  })
}

/**
 * @title 关闭选择器
 */
function handleClose(): void {
  isPopupVisible.value = false
  setTimeout(() => {
    isVisible.value = false
  }, 300)
}

/**
 * @title 确认选择
 */
function handleConfirm(): void {
  const value = getCurrentValue()
  emit('update:modelValue', value)
  emit('onConfirm', value)
  handleClose()
}

/**
 * @title 取消选择
 */
function handleCancel(): void {
  // 恢复到当前绑定值的索引
  initSelectedIndices()
  emit('onCancel')
  handleClose()
}

/** ---------- watch ---------- */

/** 监听 columns 变化 */
// deep: false — 依赖外部通过引用替换 columns 数组来触发
watch(
  () => props.columns,
  () => {
    if (isVisible.value) {
      initSelectedIndices()
    }
  },
  { deep: false }
)

/** 监听 modelValue 变化 */
watch(
  () => props.modelValue,
  () => {
    if (!isVisible.value) {
      initSelectedIndices()
    }
  }
)

/** 初始化 */
initSelectedIndices()

/** ---------- expose ---------- */
defineExpose({
  /** 打开选择器 */
  open: handleOpen,
  /** 关闭选择器 */
  close: handleClose,
  /** 当前选中值 */
  getValue: getCurrentValue
})
</script>

<style lang="scss" scoped>
/* ---------- CSS 变量 ---------- */
.see-picker {
  --picker-trigger-height-small: 64rpx;
  --picker-trigger-height-default: 80rpx;
  --picker-trigger-height-large: 96rpx;
  --picker-trigger-font-size-small: 26rpx;
  --picker-trigger-font-size-default: 28rpx;
  --picker-trigger-font-size-large: 32rpx;
  --picker-trigger-padding-h: 24rpx;
  --picker-trigger-border-radius: 8rpx;
  --picker-popup-bg: var(--see-bg-color);
  --picker-popup-radius: 24rpx 24rpx 0 0;
  --picker-toolbar-height: 96rpx;
  --picker-item-height: 88rpx;
  --picker-indicator-border-color: var(--see-border-four-color);
  --picker-mask-top-bg: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4));
  --picker-mask-bottom-bg: linear-gradient(to top, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4));
}

/* ---------- 触发区域 ---------- */
.see-picker__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  background-color: var(--see-bg-color);
  border-radius: var(--picker-trigger-border-radius);
  transition: border-color 0.2s ease;

  &.is-border {
    border: 1px solid var(--see-border-four-color);
  }

  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--see-border-four-color);
  }

  &.is-readonly {
    cursor: default;
  }
}

.see-picker--small .see-picker__trigger {
  min-height: var(--picker-trigger-height-small);
  padding: 0 16rpx;
}

.see-picker--default .see-picker__trigger {
  min-height: var(--picker-trigger-height-default);
  padding: 0 var(--picker-trigger-padding-h);
}

.see-picker--large .see-picker__trigger {
  min-height: var(--picker-trigger-height-large);
  padding: 0 32rpx;
}

.see-picker__value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--see-main-color);

  &--placeholder {
    color: var(--see-tips-color);
  }
}

.see-picker--small .see-picker__value {
  font-size: var(--picker-trigger-font-size-small);
}

.see-picker--default .see-picker__value {
  font-size: var(--picker-trigger-font-size-default);
}

.see-picker--large .see-picker__value {
  font-size: var(--picker-trigger-font-size-large);
}

.see-picker__arrow {
  flex-shrink: 0;
  margin-left: 12rpx;
  color: var(--see-tips-color);
  font-size: 24rpx;
}

.see-picker-icon-arrow {
  &::before {
    content: '\25BC';
    font-size: 20rpx;
  }
}

/* ---------- 弹出层遮罩 ---------- */
.see-picker__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: picker-overlay-fade-in 0.3s ease;
}

@keyframes picker-overlay-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ---------- 弹出面板 ---------- */
.see-picker__popup {
  width: 100%;
  background-color: var(--picker-popup-bg);
  border-radius: var(--picker-popup-radius);
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);

  &--visible {
    transform: translateY(0);
  }
}

/* ---------- 顶部 Toolbar ---------- */
.see-picker__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--picker-toolbar-height);
  padding: 0 32rpx;
  border-bottom: 1px solid var(--see-border-four-color);
}

.see-picker__toolbar-btn {
  font-size: 30rpx;
  padding: 8rpx 16rpx;

  &--cancel {
    color: var(--see-content-color);
  }

  &--confirm {
    color: var(--see-primary);
  }
}

.see-picker__toolbar-title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 500;
  color: var(--see-main-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- 选择器主体 ---------- */
.see-picker__body {
  display: flex;
  position: relative;
  padding: 0 32rpx;
}

/* ---------- 单列 ---------- */
.see-picker__column {
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* ---------- 选中指示器 ---------- */
.see-picker__indicator {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 2;
  border-top: 1px solid var(--picker-indicator-border-color);
  border-bottom: 1px solid var(--picker-indicator-border-color);
  pointer-events: none;
}

/* ---------- 滚轮容器 ---------- */
.see-picker__wheel {
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.see-picker__wheel-inner {
  will-change: transform;
}

/* ---------- 选项 ---------- */
.see-picker__option {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16rpx;

  &--disabled {
    opacity: 0.35;
  }

  &--selected .see-picker__option-text {
    color: var(--see-main-color);
    font-weight: 500;
  }
}

.see-picker__option-text {
  font-size: 32rpx;
  color: var(--see-content-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- 遮罩层 ---------- */
.see-picker__mask {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 3;
  pointer-events: none;

  &--top {
    top: 0;
    background: var(--picker-mask-top-bg);
  }

  &--bottom {
    bottom: 0;
    background: var(--picker-mask-bottom-bg);
  }
}

/* ---------- 暗黑模式适配 ---------- */
@media (prefers-color-scheme: dark) {
  .see-picker {
    --picker-mask-top-bg: linear-gradient(to bottom, rgba(20, 23, 29, 0.95), rgba(20, 23, 29, 0.4));
    --picker-mask-bottom-bg: linear-gradient(to top, rgba(20, 23, 29, 0.95), rgba(20, 23, 29, 0.4));
  }
}

.see-theme-dark .see-picker {
  --picker-mask-top-bg: linear-gradient(to bottom, rgba(20, 23, 29, 0.95), rgba(20, 23, 29, 0.4));
  --picker-mask-bottom-bg: linear-gradient(to top, rgba(20, 23, 29, 0.95), rgba(20, 23, 29, 0.4));
}
</style>
