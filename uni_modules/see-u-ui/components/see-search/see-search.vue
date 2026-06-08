<template>
  <view class="see-search" :class="searchClasses" :style="searchStyle">
    <!-- 左侧插槽 -->
    <view v-if="$slots.left" class="see-search__left">
      <slot name="left" />
    </view>

    <!-- 搜索框主体 -->
    <view class="see-search__content" :class="contentClasses">
      <!-- 搜索图标 -->
      <view class="see-search__icon">
        <text class="see-search__icon-inner see-search-icon-search"></text>
      </view>

      <!-- 输入框 -->
      <input
        ref="inputRef"
        class="see-search__input"
        :value="props.modelValue"
        type="text"
        :placeholder="props.placeholder"
        :disabled="mergedDisabled || mergedReadonly"
        :focus="needFocus"
        confirm-type="search"
        :adjust-position="true"
        placeholder-class="see-search__placeholder"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="handleSearch"
      />

      <!-- 清除按钮 -->
      <view v-if="isShowClear" class="see-search__clear" @click.stop="handleClear">
        <text class="see-search__clear-icon see-search-icon-close-circle"></text>
      </view>
    </view>

    <!-- 右侧操作按钮 -->
    <view v-if="props.isShowAction" class="see-search__action" @click.stop="handleCancel">
      <text class="see-search__action-text">{{ props.actionText }}</text>
    </view>

    <!-- 右侧插槽 -->
    <view v-if="$slots.right" class="see-search__right">
      <slot name="right" />
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * Search 搜索框
 * @description 搜索框组件，支持搜索和取消操作
 * @tutorial https://www.seeuui.cn/components/search/
 *
 * @property {String}           modelValue         绑定值（v-model）
 * @property {String}           placeholder        占位符（默认 '搜索'）
 * @property {Boolean}          isDisabled         是否禁用
 * @property {Boolean}          isReadonly         是否只读
 * @property {Boolean}          isClearable        是否显示清除按钮（默认 true）
 * @property {Boolean}          isShowAction       是否显示右侧操作按钮
 * @property {String}           actionText         操作按钮文字（默认 '取消'）
 * @property {Boolean}          isFocus            是否自动聚焦
 * @property {String}           shape              搜索框形状（默认 'round'）
 * @property {String}           size               尺寸
 * @property {Boolean}          isBorder           是否显示边框
 * @property {String}           bgColor            搜索框背景色
 * @property {String}           name               表单字段名
 */
import { ref, computed, nextTick, onBeforeUnmount, inject } from 'vue'
import { useField } from '../../utils/hooks/useField'
import { formKey } from '../../utils/shared/form-keys'
import type { SearchShape, SearchSize, SeeSearchExpose } from './type'

defineOptions({ name: 'SeeSearch' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 绑定值 */
    modelValue?: string
    /** 占位符 */
    placeholder?: string
    /** 是否禁用 */
    isDisabled?: boolean
    /** 是否只读 */
    isReadonly?: boolean
    /** 是否显示清除按钮 */
    isClearable?: boolean
    /** 是否显示右侧操作按钮 */
    isShowAction?: boolean
    /** 操作按钮文字 */
    actionText?: string
    /** 是否自动聚焦 */
    isFocus?: boolean
    /** 搜索框形状 */
    shape?: SearchShape
    /** 尺寸 */
    size?: SearchSize
    /** 是否显示边框 */
    isBorder?: boolean
    /** 搜索框背景色 */
    bgColor?: string
    /** 表单字段名 */
    name?: string
  }>(),
  {
    modelValue: '',
    placeholder: '搜索',
    isDisabled: false,
    isReadonly: false,
    isClearable: true,
    isShowAction: false,
    actionText: '取消',
    isFocus: false,
    shape: 'round',
    size: 'default',
    isBorder: false,
    bgColor: '',
    name: ''
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 输入时触发 */
  (e: 'onInput', value: string): void
  /** 值变化时触发 */
  (e: 'onChange', value: string): void
  /** 聚焦时触发 */
  (e: 'onFocus', event: { detail?: { value?: string } }): void
  /** 失焦时触发 */
  (e: 'onBlur', event: { detail?: { value?: string } }): void
  /** 清除时触发 */
  (e: 'onClear'): void
  /** 搜索时触发（键盘确认） */
  (e: 'onSearch', value: string): void
  /** 取消时触发 */
  (e: 'onCancel'): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: string): void
}>()

/** ---------- inject ---------- */
const formContext = inject(formKey, null)

/** ---------- Form 联动（useField） ---------- */
const field = useField({
  field: props.name || '',
  getValue: () => props.modelValue,
  trigger: 'blur',
  onValueChange: () => {
    // 由 useField 内部管理 change 校验触发
  }
})

const fieldDisabled = field?.isDisabled ?? computed(() => false)
const fieldReadonly = field?.isReadonly ?? computed(() => false)

/** ---------- refs ---------- */
/** 输入框实例（uni-app Input 组件类型） */
const inputRef = ref<{ $el?: Element; focus?: () => void; blur?: () => void } | null>(null)
/** 是否聚焦 */
const focused = ref(false)
/** 控制 focus 属性的响应式标记（用于手动聚焦） */
const needFocus = ref(props.isFocus)
/** 聚焦定时器（用于 doFocus 跨平台方案的清理） */
let focusTimer: ReturnType<typeof setTimeout> | null = null

/** ---------- computed ---------- */

/** 实际禁用状态（组件自身 + Form 联动） */
const mergedDisabled = computed(() => {
  return props.isDisabled || fieldDisabled.value
})

/** 实际只读状态（组件自身 + Form 联动） */
const mergedReadonly = computed(() => {
  return props.isReadonly || fieldReadonly.value
})

/** 实际尺寸（组件自身 + Form 联动） */
const mergedSize = computed(() => {
  return props.size || formContext?.props?.size || 'default'
})

/** 是否显示清除按钮 */
const isShowClear = computed(() => {
  if (!props.isClearable || mergedDisabled.value || mergedReadonly.value) return false
  return props.modelValue.length > 0
})

/** ---------- classes ---------- */

/** 搜索框 CSS 类 */
const searchClasses = computed(() => {
  const classes: string[] = [`see-search--${mergedSize.value}`, `see-search--${props.shape}`]
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  if (focused.value) classes.push('is-focused')
  if (props.isBorder) classes.push('is-border')
  return classes
})

/** 内容区域 CSS 类 */
const contentClasses = computed(() => {
  const classes: string[] = []
  if (mergedDisabled.value) classes.push('is-disabled')
  if (mergedReadonly.value) classes.push('is-readonly')
  return classes
})

/** 搜索框自定义样式 */
const searchStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.bgColor) {
    style['--see-search-bg'] = props.bgColor
  }
  return style
})

/** ---------- methods ---------- */

/**
 * @title 处理输入事件
 */
const handleInput = (event: { detail?: { value?: string } }) => {
  const value = event.detail?.value ?? ''
  emit('update:modelValue', value)
  emit('onInput', value)
}

/**
 * @title 处理聚焦事件
 */
const handleFocus = (event: { detail?: { value?: string } }) => {
  focused.value = true
  emit('onFocus', event)
}

/**
 * @title 处理失焦事件
 */
const handleBlur = (event: { detail?: { value?: string } }) => {
  focused.value = false
  emit('onBlur', event)
  emit('onChange', props.modelValue)

  // 通知 useField 触发 blur 校验
  field?.handleBlur()
  field?.handleChange(props.modelValue)
}

/**
 * @title 处理搜索事件（键盘确认）
 */
const handleSearch = () => {
  emit('onSearch', props.modelValue)
}

/**
 * @title 处理取消事件
 */
const handleCancel = () => {
  emit('update:modelValue', '')
  emit('onInput', '')
  emit('onClear')
  emit('onChange', '')
  emit('onCancel')
}

/**
 * @title 清除输入内容
 */
const handleClear = () => {
  emit('update:modelValue', '')
  emit('onInput', '')
  emit('onClear')
  emit('onChange', '')

  // 清除后重新聚焦
  nextTick(() => {
    doFocus()
  })
}

/**
 * @title 手动聚焦（跨平台兼容）
 * @description 通过切换 focus 属性实现跨平台聚焦，
 *              需要先设 false 再设 true，再重置 false 以允许后续重复聚焦
 */
const doFocus = () => {
  // 清理可能存在的上一次聚焦定时器
  if (focusTimer !== null) {
    clearTimeout(focusTimer)
    focusTimer = null
  }
  needFocus.value = false
  nextTick(() => {
    needFocus.value = true
    focusTimer = setTimeout(() => {
      needFocus.value = false
      focusTimer = null
    }, 100)
  })
}

/**
 * @title 手动失焦（跨平台兼容）
 */
const doBlur = () => {
  // #ifdef H5
  try {
    const el = inputRef.value?.$el?.querySelector?.('input') as HTMLInputElement | null
    if (el) el.blur()
  } catch {
    // ignore
  }
  // #endif

  // #ifdef MP-WEIXIN
  // 微信小程序暂不支持主动失焦 API
  // #endif
}

/** ---------- lifecycle ---------- */
onBeforeUnmount(() => {
  if (focusTimer !== null) {
    clearTimeout(focusTimer)
    focusTimer = null
  }
})

/** ---------- expose ---------- */
defineExpose({
  /** 聚焦 */
  focus: doFocus,
  /** 失焦 */
  blur: doBlur
} satisfies SeeSearchExpose)
</script>

<style lang="scss" scoped>
/* ---------- 组件级 CSS 变量 ---------- */
.see-search {
  --search-height-small: 56rpx;
  --search-height-default: 72rpx;
  --search-height-large: 88rpx;
  --search-font-size-small: 24rpx;
  --search-font-size-default: 28rpx;
  --search-font-size-large: 32rpx;
  --search-padding-h: 24rpx;
  --search-icon-size: 32rpx;
  --search-clear-size: 36rpx;
  --search-action-font-size: 28rpx;
  --search-action-padding: 20rpx;
  --search-bg: var(--see-search-bg, #f5f5f5);
}

/* ---------- 基础布局 ---------- */
.see-search {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;

  /* ---------- 禁用状态 ---------- */
  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;

    .see-search__input {
      cursor: not-allowed;
    }
  }

  /* ---------- 只读状态 ---------- */
  &.is-readonly {
    .see-search__input {
      cursor: default;
    }
  }

  /* ---------- 尺寸：small ---------- */
  &--small {
    .see-search__content {
      min-height: var(--search-height-small);
    }

    .see-search__input {
      font-size: var(--search-font-size-small);
    }

    .see-search__icon {
      padding: 0 12rpx;
    }

    .see-search__icon-inner {
      font-size: 28rpx;
    }
  }

  /* ---------- 尺寸：default ---------- */
  &--default {
    .see-search__content {
      min-height: var(--search-height-default);
    }

    .see-search__input {
      font-size: var(--search-font-size-default);
    }
  }

  /* ---------- 尺寸：large ---------- */
  &--large {
    .see-search__content {
      min-height: var(--search-height-large);
    }

    .see-search__input {
      font-size: var(--search-font-size-large);
    }

    .see-search__icon {
      padding: 0 20rpx;
    }

    .see-search__icon-inner {
      font-size: 36rpx;
    }
  }

  /* ---------- 形状：round ---------- */
  &--round {
    .see-search__content {
      border-radius: 999rpx;
    }
  }

  /* ---------- 形状：square ---------- */
  &--square {
    .see-search__content {
      border-radius: 8rpx;
    }
  }

  /* ---------- 边框 ---------- */
  &.is-border {
    .see-search__content {
      border: 1px solid var(--see-border-four-color);
    }

    &.is-focused .see-search__content {
      border-color: var(--see-primary);
    }
  }
}

/* ---------- 左侧插槽 ---------- */
.see-search__left {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 16rpx;
}

/* ---------- 搜索框内容区域 ---------- */
.see-search__content {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background-color: var(--search-bg);
  padding: 0 var(--search-padding-h);
  transition: border-color 0.2s ease;

  &.is-disabled {
    background-color: var(--see-border-four-color);
  }
}

/* ---------- 搜索图标 ---------- */
.see-search__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0 16rpx;
}

.see-search__icon-inner {
  font-size: var(--search-icon-size);
  color: var(--see-tips-color);
}

/* ---------- 输入框 ---------- */
.see-search__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--see-main-color);
  caret-color: var(--see-primary);
  padding: 0;
}

.see-search__placeholder {
  color: var(--see-tips-color) !important;
  font-size: inherit;
}

/* ---------- 清除按钮 ---------- */
.see-search__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0 8rpx;
  cursor: pointer;
}

.see-search__clear-icon {
  font-size: var(--search-clear-size);
  color: var(--see-tips-color);
  transition: color 0.2s ease;
}

.see-search__clear:active .see-search__clear-icon {
  color: var(--see-content-color);
}

/* ---------- 操作按钮 ---------- */
.see-search__action {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding-left: var(--search-action-padding);
  cursor: pointer;
}

.see-search__action-text {
  font-size: var(--search-action-font-size);
  color: var(--see-primary);
  white-space: nowrap;
}

.see-search__action:active .see-search__action-text {
  opacity: 0.7;
}

/* ---------- 右侧插槽 ---------- */
.see-search__right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 16rpx;
}

/* ---------- 内置图标（搜索、清除） ---------- */
.see-search-icon-search::before {
  content: '\1F50D';
  font-size: 28rpx;
}

.see-search-icon-close-circle::before {
  content: '\2715';
  font-size: 18rpx;
}
</style>
