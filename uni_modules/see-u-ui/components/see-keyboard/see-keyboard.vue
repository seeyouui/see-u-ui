<template>
  <!-- 遮罩层 -->
  <view
    v-if="isVisible && props.isOverlay"
    class="see-keyboard__overlay"
    :style="props.overlayStyle"
    @click="handleOverlayClick"
    @touchmove.stop.prevent
  ></view>

  <!-- 键盘弹出层 -->
  <view v-if="isVisible" class="see-keyboard" :class="keyboardClasses" @touchmove.stop.prevent>
    <!-- Toolbar -->
    <view v-if="props.isShowToolbar" class="see-keyboard__toolbar">
      <slot name="toolbar">
        <view class="see-keyboard__toolbar-inner">
          <text v-if="props.title" class="see-keyboard__title">{{ props.title }}</text>
          <view class="see-keyboard__toolbar-spacer"></view>
          <view v-if="props.isShowConfirm" class="see-keyboard__confirm-btn" @click="handleConfirm">
            <text class="see-keyboard__confirm-text">{{ props.confirmText }}</text>
          </view>
        </view>
      </slot>
    </view>

    <!-- 键盘主体 -->
    <view class="see-keyboard__body">
      <!-- 数字键盘 (number / card / idcard) -->
      <template v-if="props.type === 'number' || props.type === 'card' || props.type === 'idcard'">
        <view v-for="(row, rowIndex) in numberKeyLayout" :key="'num-row-' + rowIndex" class="see-keyboard__row">
          <view
            v-for="key in row"
            :key="key.value"
            class="see-keyboard__key"
            :class="getKeyClasses(key)"
            @click="handleKeyClick(key)"
            @touchstart.passive="handleDeleteTouchStart($event, key)"
            @touchend.passive="handleDeleteTouchEnd"
            @touchcancel.passive="handleDeleteTouchEnd"
          >
            <text class="see-keyboard__key-text">{{ key.label }}</text>
          </view>
        </view>
      </template>

      <!-- 文本键盘 (text) -->
      <template v-else-if="props.type === 'text'">
        <!-- 字母模式 -->
        <template v-if="textMode === 'letter'">
          <view v-for="(row, rowIndex) in letterKeyLayout" :key="'letter-row-' + rowIndex" class="see-keyboard__row">
            <view
              v-for="key in row"
              :key="key.value + '-' + rowIndex"
              class="see-keyboard__key"
              :class="getKeyClasses(key)"
              @click="handleKeyClick(key)"
              @touchstart.passive="handleDeleteTouchStart($event, key)"
              @touchend.passive="handleDeleteTouchEnd"
              @touchcancel.passive="handleDeleteTouchEnd"
            >
              <text class="see-keyboard__key-text">{{ key.label }}</text>
            </view>
          </view>
        </template>

        <!-- 数字符号模式 -->
        <template v-if="textMode === 'number'">
          <view v-for="(row, rowIndex) in numberSymbolKeyLayout" :key="'numsym-row-' + rowIndex" class="see-keyboard__row">
            <view
              v-for="key in row"
              :key="key.value + '-' + rowIndex"
              class="see-keyboard__key"
              :class="getKeyClasses(key)"
              @click="handleKeyClick(key)"
              @touchstart.passive="handleDeleteTouchStart($event, key)"
              @touchend.passive="handleDeleteTouchEnd"
              @touchcancel.passive="handleDeleteTouchEnd"
            >
              <text class="see-keyboard__key-text">{{ key.label }}</text>
            </view>
          </view>
        </template>

        <!-- 符号模式 -->
        <template v-if="textMode === 'symbol'">
          <view v-for="(row, rowIndex) in symbolKeyLayout" :key="'sym-row-' + rowIndex" class="see-keyboard__row">
            <view
              v-for="key in row"
              :key="key.value + '-' + rowIndex"
              class="see-keyboard__key"
              :class="getKeyClasses(key)"
              @click="handleKeyClick(key)"
              @touchstart.passive="handleDeleteTouchStart($event, key)"
              @touchend.passive="handleDeleteTouchEnd"
              @touchcancel.passive="handleDeleteTouchEnd"
            >
              <text class="see-keyboard__key-text">{{ key.label }}</text>
            </view>
          </view>
        </template>
      </template>
    </view>

    <!-- 底部安全区域占位 -->
    <view v-if="props.isSafeArea" class="see-keyboard__safe-area"></view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeKeyboard 自定义键盘
 * @description 底部弹出式自定义键盘，支持数字、身份证、完整键盘等多种类型
 * @tutorial https://www.seeuui.cn/components/keyboard/
 *
 * @property {Boolean}  modelValue              是否显示键盘（v-model）
 * @property {String}   type                    键盘类型（默认 'number'）
 * @property {Boolean}  isShowToolbar           是否显示顶部 toolbar（默认 true）
 * @property {String}   confirmText             确认按钮文字（默认 '完成'）
 * @property {Boolean}  isShowConfirm           是否显示确认按钮（默认 true）
 * @property {Boolean}  isShowDelete            是否显示删除按钮（默认 true）
 * @property {Boolean}  isRandom                数字是否随机排列（默认 false）
 * @property {Boolean}  isOverlay               是否显示遮罩层（默认 true）
 * @property {Object}   overlayStyle            遮罩层自定义样式
 * @property {Boolean}  isCloseOnClickOverlay   点击遮罩是否关闭（默认 true）
 * @property {Boolean}  isSafeArea              是否适配底部安全区域（默认 true）
 * @property {String}   title                   toolbar 标题
 */
import { ref, computed, watch, readonly, onBeforeUnmount } from 'vue'
import type { CSSProperties } from 'vue'
import type { KeyboardType, KeyboardKey, KeyType, TextKeyboardMode } from './type'
import { KEYBOARD_ANIMATION_DURATION, KEYBOARD_LONG_PRESS_DELAY, KEYBOARD_LONG_PRESS_INTERVAL } from './type'

defineOptions({ name: 'SeeKeyboard' })

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    /** 是否显示键盘（v-model） */
    modelValue?: boolean
    /** 键盘类型 */
    type?: KeyboardType
    /** 是否显示顶部 toolbar */
    isShowToolbar?: boolean
    /** 确认按钮文字 */
    confirmText?: string
    /** 是否显示确认按钮 */
    isShowConfirm?: boolean
    /** 是否显示删除按钮 */
    isShowDelete?: boolean
    /** 数字是否随机排列（安全键盘） */
    isRandom?: boolean
    /** 是否显示遮罩层 */
    isOverlay?: boolean
    /** 遮罩层自定义样式 */
    overlayStyle?: CSSProperties
    /** 点击遮罩是否关闭 */
    isCloseOnClickOverlay?: boolean
    /** 是否适配底部安全区域 */
    isSafeArea?: boolean
    /** toolbar 标题 */
    title?: string
  }>(),
  {
    modelValue: false,
    type: 'number',
    isShowToolbar: true,
    confirmText: '完成',
    isShowConfirm: true,
    isShowDelete: true,
    isRandom: false,
    isOverlay: true,
    overlayStyle: () => ({}),
    isCloseOnClickOverlay: true,
    isSafeArea: true,
    title: ''
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  /** 按键输入时触发 */
  (e: 'onInput', key: string): void
  /** 删除时触发 */
  (e: 'onDelete'): void
  /** 确认时触发 */
  (e: 'onConfirm'): void
  /** 关闭时触发 */
  (e: 'onClose'): void
  /** 打开时触发 */
  (e: 'onOpen'): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: boolean): void
}>()

/** ---------- refs ---------- */
/** 内部可见状态（用于动画） */
const isVisible = ref(false)
/** 是否正在动画中 */
const isAnimating = ref(false)
/** 长按删除定时器 */
let deleteTimer: ReturnType<typeof setInterval> | null = null
/** 动画完成定时器 */
let animationTimer: ReturnType<typeof setTimeout> | null = null
/** 文本键盘当前模式 */
const textMode = ref<TextKeyboardMode>('letter')
/** 是否大写 */
const isUppercase = ref(false)

/** ---------- computed ---------- */

/** 缓存随机洗牌结果，仅在键盘打开时重新生成 */
const randomDigits = ref<string[]>([])

watch(isVisible, (val) => {
  if (val && props.isRandom) {
    randomDigits.value = getRandomDigits()
  }
})

/** 实际键盘类型（idcard 兼容 card） */
const actualType = computed<KeyboardType>(() => {
  return props.type === 'idcard' ? 'card' : props.type
})

/** 键盘样式类 */
const keyboardClasses = computed(() => {
  const classes: string[] = [`see-keyboard--${actualType.value}`]
  if (props.isSafeArea) classes.push('is-safe-area')
  return classes.join(' ')
})

/** ---------- 数字键盘布局 ---------- */

/** 生成随机排列的数字数组 */
function getRandomDigits(): string[] {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  // Fisher-Yates 洗牌算法
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[digits[i], digits[j]] = [digits[j], digits[i]]
  }
  return digits
}

/** 数字键盘按键布局 */
const numberKeyLayout = computed<KeyboardKey[][]>(() => {
  let digits: string[]

  if (props.isRandom) {
    digits = randomDigits.value.length > 0 ? randomDigits.value : getRandomDigits()
  } else {
    digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
  }

  const specialKey = actualType.value === 'card' ? 'X' : '.'

  const row1: KeyboardKey[] = [
    { label: digits[0], value: digits[0], type: 'key' },
    { label: digits[1], value: digits[1], type: 'key' },
    { label: digits[2], value: digits[2], type: 'key' }
  ]
  const row2: KeyboardKey[] = [
    { label: digits[3], value: digits[3], type: 'key' },
    { label: digits[4], value: digits[4], type: 'key' },
    { label: digits[5], value: digits[5], type: 'key' }
  ]
  const row3: KeyboardKey[] = [
    { label: digits[6], value: digits[6], type: 'key' },
    { label: digits[7], value: digits[7], type: 'key' },
    { label: digits[8], value: digits[8], type: 'key' }
  ]
  const row4: KeyboardKey[] = [
    { label: specialKey, value: specialKey, type: 'key' },
    { label: digits[9], value: digits[9], type: 'key' }
  ]

  if (props.isShowDelete) {
    row4.push({ label: '删除', value: 'delete', type: 'delete' })
  }

  return [row1, row2, row3, row4]
})

/** ---------- 文本键盘布局 ---------- */

/** 字母行 */
const LETTER_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
]

/** 数字符号键盘第一行 */
const NUMBER_ROW_1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
/** 数字符号键盘第二行 */
const SYMBOL_ROW_1 = ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"']
/** 符号键盘第一行 */
const SYMBOL_ROW_2 = ['[', ']', '{', '}', '#', '%', '^', '*', '+', '=']
/** 符号键盘第二行 */
const SYMBOL_ROW_3 = ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '`']

/** 字母键盘布局 */
const letterKeyLayout = computed<KeyboardKey[][]>(() => {
  const row1 = LETTER_ROWS[0].map((ch) => {
    const display = isUppercase.value ? ch.toUpperCase() : ch
    return { label: display, value: display, type: 'key' as KeyType }
  })

  const row2 = LETTER_ROWS[1].map((ch) => {
    const display = isUppercase.value ? ch.toUpperCase() : ch
    return { label: display, value: display, type: 'key' as KeyType }
  })

  const row3: KeyboardKey[] = [
    { label: '⇧', value: 'shift', type: 'shift', width: 1.5 },
    ...LETTER_ROWS[2].map((ch) => {
      const display = isUppercase.value ? ch.toUpperCase() : ch
      return { label: display, value: display, type: 'key' as KeyType }
    })
  ]

  if (props.isShowDelete) {
    row3.push({ label: '⌫', value: 'delete', type: 'delete', width: 1.5 })
  }

  const row4: KeyboardKey[] = [
    { label: '123', value: 'toggle-number', type: 'toggle', width: 1.5 },
    { label: ',', value: ',', type: 'key' },
    { label: '空格', value: ' ', type: 'space', width: 4 },
    { label: '.', value: '.', type: 'key' }
  ]

  if (props.isShowConfirm) {
    row4.push({ label: props.confirmText, value: 'confirm', type: 'confirm', width: 1.5 })
  }

  return [row1, row2, row3, row4]
})

/** 数字符号键盘布局 */
const numberSymbolKeyLayout = computed<KeyboardKey[][]>(() => {
  const row1 = NUMBER_ROW_1.map((ch) => ({ label: ch, value: ch, type: 'key' as KeyType }))
  const row2 = SYMBOL_ROW_1.map((ch) => ({ label: ch, value: ch, type: 'key' as KeyType }))

  const row3: KeyboardKey[] = [
    { label: '#+=', value: 'toggle-symbol', type: 'toggle', width: 1.5 },
    { label: '.', value: '.', type: 'key' },
    { label: ',', value: ',', type: 'key' },
    { label: '?', value: '?', type: 'key' },
    { label: '!', value: '!', type: 'key' },
    { label: "'", value: "'", type: 'key' },
    { label: '"', value: '"', type: 'key' }
  ]

  if (props.isShowDelete) {
    row3.push({ label: '⌫', value: 'delete', type: 'delete', width: 1.5 })
  }

  const row4: KeyboardKey[] = [
    { label: 'ABC', value: 'toggle-letter', type: 'toggle', width: 1.5 },
    { label: '%', value: '%', type: 'key' },
    { label: '空格', value: ' ', type: 'space', width: 4 },
    { label: '_', value: '_', type: 'key' }
  ]

  if (props.isShowConfirm) {
    row4.push({ label: props.confirmText, value: 'confirm', type: 'confirm', width: 1.5 })
  }

  return [row1, row2, row3, row4]
})

/** 符号键盘布局 */
const symbolKeyLayout = computed<KeyboardKey[][]>(() => {
  const row1 = SYMBOL_ROW_2.map((ch) => ({ label: ch, value: ch, type: 'key' as KeyType }))
  const row2 = SYMBOL_ROW_3.map((ch) => ({ label: ch, value: ch, type: 'key' as KeyType }))

  const row3: KeyboardKey[] = [
    { label: '123', value: 'toggle-number', type: 'toggle', width: 1.5 },
    { label: '.', value: '.', type: 'key' },
    { label: ',', value: ',', type: 'key' },
    { label: '?', value: '?', type: 'key' },
    { label: '!', value: '!', type: 'key' },
    { label: "'", value: "'", type: 'key' },
    { label: '"', value: '"', type: 'key' }
  ]

  if (props.isShowDelete) {
    row3.push({ label: '⌫', value: 'delete', type: 'delete', width: 1.5 })
  }

  const row4: KeyboardKey[] = [
    { label: 'ABC', value: 'toggle-letter', type: 'toggle', width: 1.5 },
    { label: '%', value: '%', type: 'key' },
    { label: '空格', value: ' ', type: 'space', width: 4 },
    { label: '_', value: '_', type: 'key' }
  ]

  if (props.isShowConfirm) {
    row4.push({ label: props.confirmText, value: 'confirm', type: 'confirm', width: 1.5 })
  }

  return [row1, row2, row3, row4]
})

/** ---------- methods ---------- */

/**
 * @title 获取按键样式类
 */
function getKeyClasses(key: KeyboardKey): string {
  const classes: string[] = [`see-keyboard__key--${key.type}`]
  if (key.width && key.width !== 1) {
    classes.push(`see-keyboard__key--w${key.width}`)
  }
  if (key.disabled) classes.push('is-disabled')
  return classes.join(' ')
}

/**
 * @title 处理按键点击
 */
function handleKeyClick(key: KeyboardKey) {
  if (key.disabled) return

  switch (key.type) {
    case 'key':
    case 'space':
      emit('onInput', key.value)
      // 字母模式下，输入后自动切回小写
      if (actualType.value === 'text' && textMode.value === 'letter' && isUppercase.value) {
        isUppercase.value = false
      }
      break
    case 'delete':
      emit('onDelete')
      break
    case 'confirm':
      handleConfirm()
      break
    case 'shift':
      isUppercase.value = !isUppercase.value
      break
    case 'toggle':
      handleToggle(key.value)
      break
  }
}

/**
 * @title 处理模式切换
 */
function handleToggle(value: string) {
  switch (value) {
    case 'toggle-number':
      textMode.value = 'number'
      break
    case 'toggle-symbol':
      textMode.value = 'symbol'
      break
    case 'toggle-letter':
      textMode.value = 'letter'
      break
  }
}

/**
 * @title 处理确认
 */
function handleConfirm() {
  emit('onConfirm')
  close()
}

/**
 * @title 处理遮罩点击
 */
function handleOverlayClick() {
  if (props.isCloseOnClickOverlay) {
    close()
  }
}

/**
 * @title 打开键盘
 */
function open() {
  if (isAnimating.value) return
  isAnimating.value = true
  isVisible.value = true
  emit('update:modelValue', true)
  emit('onOpen')
  // 重置文本键盘状态
  textMode.value = 'letter'
  isUppercase.value = false
  clearAnimationTimer()
  animationTimer = setTimeout(() => {
    isAnimating.value = false
    animationTimer = null
  }, KEYBOARD_ANIMATION_DURATION)
}

/**
 * @title 关闭键盘
 */
function close() {
  if (isAnimating.value) return
  isAnimating.value = true
  isVisible.value = false
  emit('update:modelValue', false)
  emit('onClose')
  clearDeleteTimer()
  clearAnimationTimer()
  animationTimer = setTimeout(() => {
    isAnimating.value = false
    animationTimer = null
  }, KEYBOARD_ANIMATION_DURATION)
}

/**
 * @title 长按删除 - touchstart
 */
function handleDeleteTouchStart(_event: TouchEvent, key: KeyboardKey) {
  if (key.type !== 'delete') return
  clearDeleteTimer()
  // 延迟后开始连续删除
  deleteTimer = setTimeout(() => {
    deleteTimer = setInterval(() => {
      emit('onDelete')
    }, KEYBOARD_LONG_PRESS_INTERVAL)
  }, KEYBOARD_LONG_PRESS_DELAY)
}

/**
 * @title 长按删除 - touchend
 */
function handleDeleteTouchEnd() {
  clearDeleteTimer()
}

/**
 * @title 清除长按删除定时器
 */
function clearDeleteTimer() {
  if (deleteTimer !== null) {
    clearTimeout(deleteTimer)
    clearInterval(deleteTimer)
    deleteTimer = null
  }
}

/**
 * @title 清除动画完成定时器
 */
function clearAnimationTimer() {
  if (animationTimer !== null) {
    clearTimeout(animationTimer)
    animationTimer = null
  }
}

/** ---------- watch ---------- */

/** 监听 modelValue 变化，同步内部状态 */
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && !isVisible.value) {
      open()
    } else if (!newVal && isVisible.value) {
      close()
    }
  },
  { immediate: true }
)

/** 组件卸载前清理定时器 */
onBeforeUnmount(() => {
  clearDeleteTimer()
  clearAnimationTimer()
})

/** ---------- expose ---------- */
defineExpose({
  /** 打开键盘 */
  open,
  /** 关闭键盘 */
  close,
  /** 是否显示中（只读） */
  isVisible: readonly(isVisible)
})
</script>

<style lang="scss" scoped>
/* ---------- CSS 变量（组件级覆盖） ---------- */
.see-keyboard {
  --kb-key-height: 100rpx;
  --kb-key-gap: 10rpx;
  --kb-key-radius: 12rpx;
  --kb-font-size: 36rpx;
  --kb-small-font-size: 28rpx;
  --kb-popup-radius: 24rpx;
  --kb-toolbar-height: 96rpx;
}

/* ---------- 遮罩层 ---------- */
.see-keyboard__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  animation: see-kb-fadeIn 0.25s ease;
}

/* ---------- 键盘容器 ---------- */
.see-keyboard {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: var(--see-info-light, #f2f3f5);
  border-radius: var(--kb-popup-radius) var(--kb-popup-radius) 0 0;
  overflow: hidden;
  animation: see-kb-slideUp 0.3s cubic-bezier(0.2, 0.9, 0.3, 1);

  &.is-safe-area {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* ---------- Toolbar ---------- */
.see-keyboard__toolbar {
  height: var(--kb-toolbar-height);
  border-bottom: 1px solid var(--see-border-four-color, #eceff1);
  background-color: var(--see-bg-color, #ffffff);
}

.see-keyboard__toolbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24rpx;
}

.see-keyboard__title {
  font-size: 28rpx;
  color: var(--see-content-color, #5a5c60);
  font-weight: 500;
}

.see-keyboard__toolbar-spacer {
  flex: 1;
}

.see-keyboard__confirm-btn {
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  background-color: var(--see-primary, #3ca7ff);

  &:active {
    opacity: 0.8;
  }
}

.see-keyboard__confirm-text {
  font-size: 28rpx;
  color: var(--see-text, #ffffff);
  font-weight: 500;
}

/* ---------- 键盘主体 ---------- */
.see-keyboard__body {
  padding: var(--kb-key-gap) var(--kb-key-gap) 0;
}

/* ---------- 按键行 ---------- */
.see-keyboard__row {
  display: flex;
  gap: var(--kb-key-gap);
  margin-bottom: var(--kb-key-gap);
}

/* ---------- 按键基础 ---------- */
.see-keyboard__key {
  flex: 1;
  height: var(--kb-key-height);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--kb-key-radius);
  background-color: var(--see-bg-color, #ffffff);
  position: relative;
  overflow: hidden;
  transition: background-color 0.1s ease;

  &:active {
    background-color: var(--see-info-disabled, #ebeef5);
  }

  &.is-disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}

.see-keyboard__key-text {
  font-size: var(--kb-font-size);
  color: var(--see-main-color, #2e2f33);
  line-height: 1;
  user-select: none;
}

/* ---------- 按键类型变体 ---------- */

/* 普通按键 */
.see-keyboard__key--key {
  // 默认样式，无需额外处理
}

/* 删除键 */
.see-keyboard__key--delete {
  background-color: var(--see-info, #f8f8f8);

  .see-keyboard__key-text {
    font-size: var(--kb-small-font-size);
    color: var(--see-content-color, #5a5c60);
  }

  &:active {
    background-color: var(--see-info-disabled, #ebeef5);
  }
}

/* 确认键 */
.see-keyboard__key--confirm {
  background-color: var(--see-primary, #3ca7ff);
  flex: 1.5;

  .see-keyboard__key-text {
    color: var(--see-text, #ffffff);
    font-size: var(--kb-small-font-size);
    font-weight: 500;
  }

  &:active {
    background-color: var(--see-primary-dark, #208ee8);
  }
}

/* 空格键 */
.see-keyboard__key--space {
  flex: 4;
  background-color: var(--see-info-light, #f2f3f5);

  .see-keyboard__key-text {
    font-size: var(--kb-small-font-size);
    color: var(--see-tips-color, #8c8e93);
  }
}

/* Shift 键 */
.see-keyboard__key--shift {
  background-color: var(--see-info, #f8f8f8);

  .see-keyboard__key-text {
    font-size: var(--kb-small-font-size);
    color: var(--see-content-color, #5a5c60);
  }

  &:active {
    background-color: var(--see-info-disabled, #ebeef5);
  }
}

/* 切换键 */
.see-keyboard__key--toggle {
  background-color: var(--see-info, #f8f8f8);

  .see-keyboard__key-text {
    font-size: var(--kb-small-font-size);
    color: var(--see-content-color, #5a5c60);
    font-weight: 500;
  }

  &:active {
    background-color: var(--see-info-disabled, #ebeef5);
  }
}

/* ---------- 按键宽度变体 ---------- */
.see-keyboard__key--w1\.5 {
  flex: 1.5;
}

.see-keyboard__key--w2 {
  flex: 2;
}

.see-keyboard__key--w4 {
  flex: 4;
}

/* ---------- 底部安全区域 ---------- */
.see-keyboard__safe-area {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}

/* ---------- 动画 ---------- */
@keyframes see-kb-fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes see-kb-slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
