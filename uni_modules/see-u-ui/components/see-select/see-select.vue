<template>
  <view class="see-select" :class="selectClasses">
    <!-- 触发区域 -->
    <view class="see-select__trigger" :class="triggerClasses" @click="handleToggle">
      <!-- 前缀插槽 -->
      <view v-if="$slots.prefix" class="see-select__prefix">
        <slot name="prefix"></slot>
      </view>

      <!-- 多选标签区 -->
      <view v-if="props.isMultiple && selectedTags.length > 0" class="see-select__tags">
        <view v-for="tag in visibleTags" :key="tag.value" class="see-select__tag">
          <text class="see-select__tag-text">{{ tag.label }}</text>
          <view v-if="!mergedDisabled && !mergedReadonly" class="see-select__tag-close" @click.stop="handleRemoveTag(tag.value)">
            <text class="see-select__tag-close-icon">\00D7</text>
          </view>
        </view>
        <view v-if="overflowCount > 0" class="see-select__tag see-select__tag--overflow">
          <text class="see-select__tag-text">+{{ overflowCount }}</text>
        </view>
      </view>

      <!-- 单选显示文本 -->
      <text v-else class="see-select__value" :class="{ 'see-select__value--placeholder': !displayText }">
        {{ displayText || props.placeholder }}
      </text>

      <!-- 清除按钮 -->
      <view v-if="isShowClear" class="see-select__action" @click.stop="handleClear">
        <text class="see-select__action-icon see-select-icon-close-circle"></text>
      </view>

      <!-- 箭头图标 -->
      <view class="see-select__arrow" :class="{ 'is-reverse': isVisible }">
        <text class="see-select-icon-arrow"></text>
      </view>
    </view>

    <!-- 遮罩层（点击关闭） -->
    <view v-if="isVisible" class="see-select__overlay" @click="handleClose" @touchstart.stop.prevent="handleClose"></view>

    <!-- 下拉框 -->
    <view v-if="isVisible" class="see-select__dropdown" :class="{ 'is-visible': isDropdownVisible }">
      <!-- 搜索框 -->
      <view v-if="props.isFilterable" class="see-select__search">
        <input
          ref="searchInputRef"
          class="see-select__search-input"
          :value="searchQuery"
          placeholder="搜索"
          :disabled="mergedDisabled"
          @input="handleSearchInput"
          @confirm="handleSearchConfirm"
        />
      </view>

      <!-- 加载状态 -->
      <view v-if="props.loading" class="see-select__loading">
        <text class="see-select__loading-text">加载中...</text>
      </view>

      <!-- 选项列表 -->
      <scroll-view v-else-if="displayOptions.length > 0" class="see-select__list" scroll-y :show-scrollbar="false">
        <template v-for="item in displayOptions" :key="item.value">
          <!-- 分组标题 -->
          <view v-if="item.isGroup" class="see-select__group">
            <text class="see-select__group-title">{{ item.label }}</text>
          </view>

          <!-- 选项 -->
          <view
            v-else
            class="see-select__option"
            :class="{
              'is-selected': isSelected(item.value),
              'is-disabled': item.isDisabled
            }"
            @click="handleSelect(item)"
          >
            <!-- 多选复选框 -->
            <view v-if="props.isMultiple" class="see-select__checkbox">
              <text v-if="isSelected(item.value)" class="see-select__checkbox-icon see-select-icon-check"></text>
            </view>

            <!-- 选项内容 -->
            <view class="see-select__option-content">
              <slot :option="item">
                <text class="see-select__option-text">{{ item.label }}</text>
              </slot>
            </view>

            <!-- 选中标记 -->
            <text v-if="!props.isMultiple && isSelected(item.value)" class="see-select__option-check see-select-icon-check"></text>
          </view>
        </template>
      </scroll-view>

      <!-- 空状态 -->
      <view v-else class="see-select__empty">
        <slot name="empty">
          <text class="see-select__empty-text">暂无数据</text>
        </slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * Select 选择器
 * @description 下拉选择器，支持单选、多选、搜索过滤、远程搜索、分组等功能
 * @tutorial https://www.seeuui.cn/components/select/
 *
 * @property {String | Number | Array} modelValue      绑定值（v-model）
 * @property {SelectOption[]}           options          选项列表
 * @property {String}                   placeholder      占位符
 * @property {Boolean}                  isDisabled       是否禁用
 * @property {Boolean}                  isReadonly       是否只读
 * @property {Boolean}                  isClearable      是否可清除
 * @property {Boolean}                  isMultiple       是否多选
 * @property {Boolean}                  isFilterable     是否可搜索
 * @property {Function}                 filterMethod     自定义过滤方法
 * @property {Boolean}                  isRemote         是否远程搜索
 * @property {Function}                 remoteMethod     远程搜索方法
 * @property {Boolean}                  loading          是否加载中
 * @property {String}                   size             尺寸
 * @property {Number}                   maxTagCount      多选时最多显示标签数
 * @property {Boolean}                  isBorder         是否显示边框（默认 true）
 * @property {String}                   name             表单字段名
 * @property {String}                   valueKey         选项值的键名（默认 'value'）
 * @property {String}                   labelKey         选项标签的键名（默认 'label'）
 */
import { ref, computed, inject, nextTick, onBeforeUnmount, watch } from 'vue'
import { useField } from '../../utils/hooks/useField'
import { formKey } from '../../utils/shared/form-keys'
import type { SelectOption, SelectSize, DisplayOption } from './type'
import type { ValidateStatus } from '../../utils/shared/form-types'

defineOptions({ name: 'SeeSelect' })

/** ---------- 常量 ---------- */
/** 下拉框动画延迟（ms） */
const DROPDOWN_ANIM_DELAY = 30
/** 下拉框关闭动画时长（ms） */
const DROPDOWN_CLOSE_DURATION = 200
/** 远程搜索防抖延迟（ms） */
const REMOTE_DEBOUNCE_DELAY = 300

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 绑定值（v-model） */
    modelValue?: string | number | (string | number)[]
    /** 选项列表 */
    options?: SelectOption[]
    /** 占位符 */
    placeholder?: string
    /** 是否禁用 */
    isDisabled?: boolean
    /** 是否只读 */
    isReadonly?: boolean
    /** 是否可清除 */
    isClearable?: boolean
    /** 是否多选 */
    isMultiple?: boolean
    /** 是否可搜索 */
    isFilterable?: boolean
    /** 自定义过滤方法 */
    filterMethod?: (query: string, option: SelectOption) => boolean
    /** 是否远程搜索 */
    isRemote?: boolean
    /** 远程搜索方法 */
    remoteMethod?: (query: string) => void
    /** 是否加载中 */
    loading?: boolean
    /** 尺寸 */
    size?: SelectSize
    /** 多选时最多显示标签数 */
    maxTagCount?: number
    /** 是否显示边框 */
    isBorder?: boolean
    /** 表单字段名 */
    name?: string
    /** 选项值的键名 */
    valueKey?: string
    /** 选项标签的键名 */
    labelKey?: string
  }>(),
  {
    modelValue: undefined,
    options: () => [],
    placeholder: '请选择',
    isDisabled: false,
    isReadonly: false,
    isClearable: false,
    isMultiple: false,
    isFilterable: false,
    filterMethod: undefined,
    isRemote: false,
    remoteMethod: undefined,
    loading: false,
    size: 'default',
    maxTagCount: undefined,
    isBorder: true,
    name: '',
    valueKey: 'value',
    labelKey: 'label'
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 值变化时触发 */
  (e: 'onChange', value: string | number | (string | number)[]): void
  /** 下拉框显示/隐藏时触发 */
  (e: 'onVisibleChange', visible: boolean): void
  /** 多选移除标签时触发 */
  (e: 'onRemoveTag', value: string | number): void
  /** 清除时触发 */
  (e: 'onClear'): void
  /** 搜索时触发 */
  (e: 'onSearch', query: string): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: string | number | (string | number)[]): void
}>()

/** ---------- inject ---------- */
const formContext = inject(formKey, null)

/** ---------- Form 联动（useField） ---------- */
const field = useField({
  field: props.name || '',
  getValue: () => props.modelValue,
  trigger: 'change',
  onValueChange: () => {
    // 由 useField 内部管理 change 校验触发
  }
})

const validateStatus = field?.validateStatus ?? ref<ValidateStatus>('')
const validateMessage = field?.validateMessage ?? ref('')
const fieldDisabled = field?.isDisabled ?? computed(() => false)
const fieldReadonly = field?.isReadonly ?? computed(() => false)

/** ---------- refs ---------- */
/** 搜索输入框引用（uni-app input 组件实例） */
const searchInputRef = ref<Record<string, unknown> | null>(null)
/** 下拉框是否可见 */
const isVisible = ref(false)
/** 下拉框动画状态 */
const isDropdownVisible = ref(false)
/** 搜索关键字 */
const searchQuery = ref('')
/** 搜索防抖定时器 */
let searchTimer: ReturnType<typeof setTimeout> | null = null
/** 关闭动画定时器 */
let closeTimer: ReturnType<typeof setTimeout> | null = null

/** ---------- computed ---------- */

/** 值键名 */
const vKey = computed(() => props.valueKey || 'value')

/** 标签键名 */
const lKey = computed(() => props.labelKey || 'label')

/** 实际禁用状态（组件自身 + Form 联动） */
const mergedDisabled = computed(() => {
  return props.isDisabled || fieldDisabled.value
})

/** 实际只读状态（组件自身 + Form 联动） */
const mergedReadonly = computed(() => {
  return props.isReadonly || fieldReadonly.value
})

/** ---------- watch ---------- */

/** 禁用/只读状态变化时自动关闭下拉框 */
watch([mergedDisabled, mergedReadonly], ([disabled, readonly]) => {
  if ((disabled || readonly) && isVisible.value) {
    handleClose()
  }
})

/** 实际尺寸（组件自身 + Form 联动） */
const mergedSize = computed(() => {
  return props.size || formContext?.props?.size || 'default'
})

/** 当前选中的值数组 */
const selectedValues = computed<(string | number)[]>(() => {
  if (props.isMultiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : []
  }
  return props.modelValue != null && props.modelValue !== '' ? [props.modelValue as string | number] : []
})

/** 扁平化的选项列表（包含分组内的子选项） */
const flatOptions = computed<SelectOption[]>(() => {
  const result: SelectOption[] = []
  const walk = (list: SelectOption[]) => {
    for (const opt of list) {
      if (opt.children && opt.children.length > 0) {
        walk(opt.children)
      } else {
        result.push(opt)
      }
    }
  }
  walk(props.options)
  return result
})

/** 使用 Map 索引替代 find 线性搜索 */
const flatOptionsMap = computed(() => {
  const map = new Map<string | number, SelectOption>()
  for (const opt of flatOptions.value) {
    map.set(opt[vKey.value], opt)
  }
  return map
})

/** 根据搜索关键字过滤后的选项（含分组结构） */
const filteredOptions = computed<SelectOption[]>(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return props.options

  // 远程搜索模式：不过滤，直接返回原始选项
  if (props.isRemote) return props.options

  const filterFn = props.filterMethod
    ? (opt: SelectOption) => props.filterMethod!(query, opt)
    : (opt: SelectOption) => {
        const label = String(opt[lKey.value] ?? '').toLowerCase()
        return label.includes(query)
      }

  const walk = (list: SelectOption[]): SelectOption[] => {
    const result: SelectOption[] = []
    for (const opt of list) {
      if (opt.children && opt.children.length > 0) {
        const filteredChildren = walk(opt.children)
        if (filteredChildren.length > 0) {
          result.push({ ...opt, children: filteredChildren })
        }
      } else if (filterFn(opt)) {
        result.push(opt)
      }
    }
    return result
  }

  return walk(props.options)
})

/** 用于渲染的扁平列表（含分组标题） */
const displayOptions = computed<DisplayOption[]>(() => {
  const result: DisplayOption[] = []

  for (const opt of filteredOptions.value) {
    if (opt.children && opt.children.length > 0) {
      result.push({ ...opt, isGroup: true })
      for (const child of opt.children) {
        result.push(child)
      }
    } else {
      result.push(opt)
    }
  }

  return result
})

/** 已选中的标签（多选模式） */
const selectedTags = computed(() => {
  if (!props.isMultiple) return []
  return selectedValues.value.map((val) => {
    const opt = flatOptionsMap.value.get(val)
    return opt ? { value: val, label: String(opt[lKey.value]) } : { value: val, label: String(val) }
  })
})

/** 可见的标签（受 maxTagCount 限制） */
const visibleTags = computed(() => {
  if (props.maxTagCount != null && props.maxTagCount >= 0) {
    return selectedTags.value.slice(0, props.maxTagCount)
  }
  return selectedTags.value
})

/** 溢出的标签数量 */
const overflowCount = computed(() => {
  if (props.maxTagCount != null && props.maxTagCount >= 0) {
    return Math.max(0, selectedTags.value.length - props.maxTagCount)
  }
  return 0
})

/** 单选模式下的显示文本 */
const displayText = computed(() => {
  if (props.isMultiple) return ''
  if (selectedValues.value.length === 0) return ''
  const val = selectedValues.value[0]
  const opt = flatOptionsMap.value.get(val)
  return opt ? String(opt[lKey.value]) : String(val)
})

/** 是否显示清除按钮 */
const isShowClear = computed(() => {
  if (!props.isClearable || mergedDisabled.value || mergedReadonly.value) return false
  return selectedValues.value.length > 0
})

/** ---------- classes ---------- */

/** 选择器 CSS 类 */
const selectClasses = computed(() => {
  return [`see-select--${mergedSize.value}`]
})

/** 触发区域 CSS 类 */
const triggerClasses = computed(() => {
  const classes: string[] = []
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  if (props.isBorder) classes.push('is-border')
  if (isVisible.value) classes.push('is-open')
  if (validateStatus.value === 'error') classes.push('is-error')
  return classes
})

/** ---------- methods ---------- */

/**
 * @title 切换下拉框显示状态
 */
function handleToggle(): void {
  if (mergedDisabled.value || mergedReadonly.value) return
  if (isVisible.value) {
    handleClose()
  } else {
    handleOpen()
  }
}

/**
 * @title 打开下拉框
 */
function handleOpen(): void {
  // 如果正在关闭，取消关闭定时器
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  isVisible.value = true
  emit('onVisibleChange', true)
  nextTick(() => {
    setTimeout(() => {
      isDropdownVisible.value = true
      // 自动聚焦搜索框
      if (props.isFilterable) {
        focusSearchInput()
      }
    }, DROPDOWN_ANIM_DELAY)
  })
}

/**
 * @title 关闭下拉框
 */
function handleClose(): void {
  if (closeTimer) clearTimeout(closeTimer)
  isDropdownVisible.value = false
  emit('onVisibleChange', false)
  closeTimer = setTimeout(() => {
    isVisible.value = false
    searchQuery.value = ''
    closeTimer = null
  }, DROPDOWN_CLOSE_DURATION)
}

/**
 * @title 聚焦搜索输入框
 */
function focusSearchInput(): void {
  // #ifdef H5
  nextTick(() => {
    try {
      const el = (searchInputRef.value as unknown as { $el?: HTMLElement })?.$el?.querySelector?.('input') as HTMLInputElement | null
      if (el) el.focus()
    } catch {
      // ignore: 某些平台不支持 DOM 查询
    }
  })
  // #endif
}

/**
 * @title 选择选项
 */
function handleSelect(option: SelectOption): void {
  if (option.isDisabled || mergedDisabled.value || mergedReadonly.value) return

  const value = option[vKey.value]

  if (props.isMultiple) {
    const currentValues = [...selectedValues.value]
    const index = currentValues.indexOf(value)
    if (index > -1) {
      currentValues.splice(index, 1)
    } else {
      currentValues.push(value)
    }
    emit('update:modelValue', currentValues)
    emit('onChange', currentValues)
    field?.handleChange(currentValues)
  } else {
    emit('update:modelValue', value)
    emit('onChange', value)
    field?.handleChange(value)
    handleClose()
  }
}

/**
 * @title 移除多选标签
 */
function handleRemoveTag(value: string | number): void {
  if (mergedDisabled.value || mergedReadonly.value) return
  const currentValues = selectedValues.value.filter((v) => v !== value)
  emit('update:modelValue', currentValues)
  emit('onChange', currentValues)
  emit('onRemoveTag', value)
  field?.handleChange(currentValues)
}

/**
 * @title 清除选中值
 */
function handleClear(): void {
  if (mergedDisabled.value || mergedReadonly.value) return
  const emptyValue: string | number | (string | number)[] = props.isMultiple ? [] : ''
  emit('update:modelValue', emptyValue)
  emit('onChange', emptyValue)
  emit('onClear')
  field?.handleChange(emptyValue)
}

/**
 * @title 处理搜索输入
 */
function handleSearchInput(event: { detail: { value: string } }): void {
  const query = event.detail?.value ?? ''
  searchQuery.value = query

  // 远程搜索防抖
  if (props.isRemote && props.remoteMethod) {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      emit('onSearch', query)
      props.remoteMethod?.(query)
    }, REMOTE_DEBOUNCE_DELAY)
  } else {
    emit('onSearch', query)
  }
}

/**
 * @title 处理搜索确认
 */
function handleSearchConfirm(): void {
  // 搜索确认时的回调，可根据需要扩展
}

/**
 * @title 判断选项是否被选中
 */
function isSelected(value: string | number): boolean {
  return selectedValues.value.includes(value)
}

/** ---------- 生命周期 ---------- */
onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer)
    searchTimer = null
  }
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
})

/** ---------- expose ---------- */
defineExpose({
  /** 打开下拉框 */
  open: handleOpen,
  /** 关闭下拉框 */
  close: handleClose,
  /** 清除选中值 */
  clear: handleClear,
  /** 校验状态 */
  validateStatus,
  /** 校验信息 */
  validateMessage
})
</script>

<style lang="scss" scoped>
/* ---------- CSS 变量 ---------- */
.see-select {
  --select-trigger-height-small: 56rpx;
  --select-trigger-height-default: 72rpx;
  --select-trigger-height-large: 88rpx;
  --select-font-size-small: 24rpx;
  --select-font-size-default: 28rpx;
  --select-font-size-large: 32rpx;
  --select-padding-h: 24rpx;
  --select-border-radius: 8rpx;
  --select-dropdown-max-height: 480rpx;
  --select-option-height: 80rpx;
  --select-tag-height: 44rpx;
  --select-search-height: 80rpx;
}

/* ---------- 基础布局 ---------- */
.see-select {
  position: relative;
  width: 100%;
}

/* ---------- 触发区域 ---------- */
.see-select__trigger {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  background-color: var(--see-bg-color);
  border-radius: var(--select-border-radius);
  transition: border-color 0.2s ease;

  &.is-border {
    border: 1px solid var(--see-border-four-color);
  }

  &.is-open.is-border {
    border-color: var(--see-primary);
  }

  &.is-error.is-border {
    border-color: var(--see-error);
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

/* 尺寸变体 */
.see-select--small .see-select__trigger {
  min-height: var(--select-trigger-height-small);
  padding: 0 16rpx;
}

.see-select--default .see-select__trigger {
  min-height: var(--select-trigger-height-default);
  padding: 0 var(--select-padding-h);
}

.see-select--large .see-select__trigger {
  min-height: var(--select-trigger-height-large);
  padding: 0 32rpx;
}

/* ---------- 前缀 ---------- */
.see-select__prefix {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 8rpx;
}

/* ---------- 多选标签区 ---------- */
.see-select__tags {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
  gap: 8rpx;
  padding: 4rpx 0;
}

.see-select__tag {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  height: var(--select-tag-height);
  padding: 0 12rpx;
  background-color: var(--see-primary-light);
  border-radius: 6rpx;
  max-width: 200rpx;

  &--overflow {
    background-color: var(--see-info-light);
  }
}

.see-select__tag-text {
  font-size: 22rpx;
  color: var(--see-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1;
}

.see-select__tag--overflow .see-select__tag-text {
  color: var(--see-content-color);
}

.see-select__tag-close {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4rpx;
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  flex-shrink: 0;

  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.see-select__tag-close-icon {
  font-size: 20rpx;
  color: var(--see-primary);
  line-height: 1;
}

/* ---------- 单选显示文本 ---------- */
.see-select__value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--see-main-color);
  line-height: 1.4;

  &--placeholder {
    color: var(--see-tips-color);
  }
}

.see-select--small .see-select__value {
  font-size: var(--select-font-size-small);
}

.see-select--default .see-select__value {
  font-size: var(--select-font-size-default);
}

.see-select--large .see-select__value {
  font-size: var(--select-font-size-large);
}

/* ---------- 清除按钮 ---------- */
.see-select__action {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0 4rpx;
  cursor: pointer;
}

.see-select__action-icon {
  font-size: 28rpx;
  color: var(--see-tips-color);
  transition: color 0.2s ease;
}

.see-select__action:active .see-select__action-icon {
  color: var(--see-content-color);
}

/* ---------- 箭头图标 ---------- */
.see-select__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 8rpx;
  transition: transform 0.2s ease;

  &.is-reverse {
    transform: rotate(180deg);
  }
}

.see-select-icon-arrow::before {
  content: '\25BC';
  font-size: 18rpx;
  color: var(--see-tips-color);
}

.see-select-icon-close-circle::before {
  content: '\2715';
  font-size: 18rpx;
}

.see-select-icon-check::before {
  content: '\2713';
  font-size: 24rpx;
}

/* ---------- 遮罩层 ---------- */
.see-select__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.3);
  animation: select-overlay-fade-in 0.2s ease;
}

@keyframes select-overlay-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ---------- 下拉框 ---------- */
.see-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1001;
  margin-top: 8rpx;
  background-color: var(--see-bg-color);
  border-radius: var(--select-border-radius);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
  max-height: var(--select-dropdown-max-height);
  overflow: hidden;
  opacity: 0;
  transform: translateY(-8rpx);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---------- 搜索框 ---------- */
.see-select__search {
  display: flex;
  align-items: center;
  padding: 12rpx 16rpx;
  border-bottom: 1px solid var(--see-border-four-color);
}

.see-select__search-input {
  flex: 1;
  height: var(--select-search-height);
  font-size: var(--select-font-size-default);
  color: var(--see-main-color);
  background-color: var(--see-bg-color);
  border: 1px solid var(--see-border-four-color);
  border-radius: 6rpx;
  padding: 0 16rpx;
}

/* ---------- 选项列表 ---------- */
.see-select__list {
  max-height: calc(var(--select-dropdown-max-height) - 100rpx);
  padding: 8rpx 0;
}

/* ---------- 分组标题 ---------- */
.see-select__group {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx 8rpx;
}

.see-select__group-title {
  font-size: 24rpx;
  color: var(--see-tips-color);
  font-weight: 500;
}

/* ---------- 选项 ---------- */
.see-select__option {
  display: flex;
  align-items: center;
  min-height: var(--select-option-height);
  padding: 0 24rpx;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:active {
    background-color: var(--see-info-light);
  }

  &.is-selected {
    .see-select__option-text {
      color: var(--see-primary);
      font-weight: 500;
    }
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;

    .see-select__option-text {
      color: var(--see-tips-color);
    }
  }
}

.see-select__checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36rpx;
  height: 36rpx;
  border: 1px solid var(--see-border-four-color);
  border-radius: 6rpx;
  margin-right: 12rpx;
  flex-shrink: 0;
  background-color: var(--see-bg-color);

  .is-selected & {
    background-color: var(--see-primary);
    border-color: var(--see-primary);
  }
}

.see-select__checkbox-icon {
  font-size: 22rpx;
  color: var(--see-text);
  line-height: 1;
}

.see-select__option-content {
  flex: 1;
  min-width: 0;
}

.see-select__option-text {
  font-size: 28rpx;
  color: var(--see-main-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.see-select__option-check {
  flex-shrink: 0;
  margin-left: 12rpx;
  color: var(--see-primary);
  font-size: 28rpx;
}

/* ---------- 加载状态 ---------- */
.see-select__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx 0;
}

.see-select__loading-text {
  font-size: 26rpx;
  color: var(--see-tips-color);
}

/* ---------- 空状态 ---------- */
.see-select__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx 0;
}

.see-select__empty-text {
  font-size: 26rpx;
  color: var(--see-tips-color);
}

/* ---------- 暗黑模式适配 ---------- */
@media (prefers-color-scheme: dark) {
  .see-select__dropdown {
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
  }

  .see-select__search-input {
    background-color: var(--see-bg-color);
  }
}

.see-theme-dark .see-select__dropdown {
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
}

.see-theme-dark .see-select__search-input {
  background-color: var(--see-bg-color);
}
</style>
