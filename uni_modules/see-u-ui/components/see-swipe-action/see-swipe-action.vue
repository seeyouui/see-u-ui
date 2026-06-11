<template>
  <view class="see-swipe-action" :class="{ 'see-swipe-action--disabled': isDisabled }">
    <!-- 左侧操作按钮 -->
    <view v-if="leftActions.length > 0" class="see-swipe-action__actions see-swipe-action__actions--left" :style="leftActionsStyle">
      <view
        v-for="(action, index) in leftActions"
        :key="index"
        class="see-swipe-action__btn"
        :class="`see-swipe-action__btn--${action.style || 'default'}`"
        :style="getActionStyle(action)"
        @click.stop="handleActionClick(action, index, 'left')"
      >
        <text v-if="action.icon" class="see-swipe-action__btn-icon">{{ action.icon }}</text>
        <text class="see-swipe-action__btn-text">{{ action.text }}</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view
      class="see-swipe-action__content"
      :style="contentStyle"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @click="handleContentClick"
    >
      <slot />
    </view>

    <!-- 右侧操作按钮 -->
    <view v-if="rightActions.length > 0" class="see-swipe-action__actions see-swipe-action__actions--right" :style="rightActionsStyle">
      <view
        v-for="(action, index) in rightActions"
        :key="index"
        class="see-swipe-action__btn"
        :class="`see-swipe-action__btn--${action.style || 'default'}`"
        :style="getActionStyle(action)"
        @click.stop="handleActionClick(action, index, 'right')"
      >
        <text v-if="action.icon" class="see-swipe-action__btn-icon">{{ action.icon }}</text>
        <text class="see-swipe-action__btn-text">{{ action.text }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeSwipeAction 滑动单元格
 * @description 列表项左滑/右滑露出操作按钮
 * @tutorial https://www.seeuui.cn/components/swipe-action/
 * @property {Array} leftActions 左侧操作按钮
 * @property {Array} rightActions 右侧操作按钮
 * @property {Boolean} isDisabled 是否禁用滑动
 * @property {Number} threshold 滑动阈值
 * @property {Number} swipeWidth 滑动宽度
 * @property {Boolean} isCloseOnClick 点击操作按钮后是否自动关闭
 * @property {Boolean} isCloseOnTouchOutside 触摸其他区域是否关闭
 * @property {String|Number} name 标识符
 * @property {Boolean} isAnimated 是否启用回弹动画
 * @event {Function} onClick 点击操作按钮
 * @event {Function} onOpen 滑动打开时触发
 * @event {Function} onClose 关闭时触发
 */
import { ref, computed, onMounted, onUnmounted, type CSSProperties } from 'vue'
import type { SeeSwipeActionProps, SeeSwipeActionEmits, SwipeActionItem } from './type'

defineOptions({ name: 'SeeSwipeAction' })

/** 互斥事件名 */
const CLOSE_OTHERS_EVENT = 'see:swipe:close-others'

/** 全局实例计数器（用于默认 name） */
let instanceCounter = 0

const props = withDefaults(defineProps<SeeSwipeActionProps>(), {
  leftActions: () => [],
  rightActions: () => [],
  isDisabled: false,
  threshold: 0.3,
  swipeWidth: 0,
  isCloseOnClick: true,
  isCloseOnTouchOutside: true,
  name: '',
  isAnimated: true
})

const emit = defineEmits<SeeSwipeActionEmits>()

// ==================== 实例标识 ====================

/** 唯一实例 ID（用于互斥，当 name 为空时自动生成） */
const instanceId = `__swipe_${++instanceCounter}`
/** 用于互斥的标识符 */
const effectiveName = computed(() => (props.name !== '' && props.name !== undefined ? props.name : instanceId))

// ==================== 状态管理 ====================

const offsetX = ref(0)
const isSwiping = ref(false)
const openSide = ref<'left' | 'right' | null>(null)

let startX = 0
let startY = 0
let isDragging = false

// ==================== 计算属性 ====================

const leftWidth = computed(() => {
  if (props.swipeWidth > 0) return props.swipeWidth
  return props.leftActions.reduce((sum, action) => sum + (action.width || 120), 0)
})

const rightWidth = computed(() => {
  if (props.swipeWidth > 0) return props.swipeWidth
  return props.rightActions.reduce((sum, action) => sum + (action.width || 120), 0)
})

const contentStyle = computed<CSSProperties>(() => ({
  transform: `translateX(${offsetX.value}px)`,
  transition: isSwiping.value ? 'none' : props.isAnimated ? 'transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1)' : 'none'
}))

const leftActionsStyle = computed<CSSProperties>(() => ({
  transform: `translateX(${Math.min(0, offsetX.value + leftWidth.value)}px)`
}))

const rightActionsStyle = computed<CSSProperties>(() => ({
  transform: `translateX(${Math.max(0, offsetX.value - rightWidth.value)}px)`
}))

// ==================== 样式计算 ====================

const getActionStyle = (action: SwipeActionItem): CSSProperties => {
  const style: CSSProperties = {}
  if (action.background) style.backgroundColor = action.background
  if (action.color) style.color = action.color
  if (action.width) style.width = `${action.width}px`
  return style
}

// ==================== 触摸事件 ====================

const handleTouchStart = (e: TouchEvent) => {
  if (props.isDisabled) return
  const touch = e.touches[0]
  startX = touch.clientX
  startY = touch.clientY
  isDragging = false
  isSwiping.value = true
}

const handleTouchMove = (e: TouchEvent) => {
  if (props.isDisabled || !isSwiping.value) return

  const touch = e.touches[0]
  const deltaX = touch.clientX - startX
  const deltaY = touch.clientY - startY

  // 判断是否为水平滑动
  if (!isDragging) {
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isDragging = true
    } else if (Math.abs(deltaY) > 10) {
      isSwiping.value = false
      return
    }
  }

  if (!isDragging) return

  // 计算偏移量
  let newOffset = deltaX

  // 限制滑动范围
  if (deltaX > 0) {
    // 向右滑动
    newOffset = Math.min(leftWidth.value, deltaX)
    // 弹性效果
    if (deltaX > leftWidth.value) {
      newOffset = leftWidth.value + (deltaX - leftWidth.value) * 0.3
    }
  } else {
    // 向左滑动
    newOffset = Math.max(-rightWidth.value, deltaX)
    // 弹性效果
    if (deltaX < -rightWidth.value) {
      newOffset = -rightWidth.value + (deltaX + rightWidth.value) * 0.3
    }
  }

  offsetX.value = newOffset
}

const handleTouchEnd = () => {
  if (props.isDisabled || !isSwiping.value) return

  isSwiping.value = false

  const thresholdLeft = leftWidth.value * props.threshold
  const thresholdRight = rightWidth.value * props.threshold

  if (offsetX.value > thresholdLeft) {
    // 打开左侧
    open('left')
  } else if (offsetX.value < -thresholdRight) {
    // 打开右侧
    open('right')
  } else {
    // 关闭
    close()
  }
}

// ==================== 操作方法 ====================

const open = (side: 'left' | 'right') => {
  // 通知其他 SwipeAction 关闭
  uni.$emit(CLOSE_OTHERS_EVENT, effectiveName.value)
  if (side === 'left') {
    offsetX.value = leftWidth.value
  } else {
    offsetX.value = -rightWidth.value
  }
  openSide.value = side
  emit('onOpen', side)
}

const close = () => {
  if (!openSide.value) return
  offsetX.value = 0
  openSide.value = null
  emit('onClose')
}

/** 接收其他 SwipeAction 的关闭通知 */
const handleCloseOthers = (name: string | number) => {
  // 如果不是自己发出的事件，且当前是打开状态，则关闭
  if (name !== effectiveName.value && openSide.value) {
    close()
  }
}

const toggle = (side: 'left' | 'right') => {
  if (openSide.value === side) {
    close()
  } else {
    open(side)
  }
}

// ==================== 事件处理 ====================

const handleActionClick = (action: SwipeActionItem, index: number, side: 'left' | 'right') => {
  if (action.isDisabled) return
  emit('onClick', action, index, side)
  if (props.isCloseOnClick) {
    close()
  }
}

const handleContentClick = () => {
  if (props.isCloseOnTouchOutside && openSide.value) {
    close()
  }
}

// ==================== 生命周期 ====================

onMounted(() => {
  uni.$on(CLOSE_OTHERS_EVENT, handleCloseOthers)
})

onUnmounted(() => {
  uni.$off(CLOSE_OTHERS_EVENT, handleCloseOthers)
})

// ==================== Expose ====================

defineExpose({
  open,
  close,
  toggle
})
</script>

<style lang="scss" scoped>
.see-swipe-action {
  position: relative;
  overflow: hidden;

  &--disabled {
    .see-swipe-action__content {
      pointer-events: auto;
    }
  }

  &__actions {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;

    &--left {
      left: 0;
      transform: translateX(-100%);
    }

    &--right {
      right: 0;
      transform: translateX(100%);
    }
  }

  &__btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 120rpx;
    padding: 0 16rpx;

    &--default {
      background-color: var(--see-info-dark);
      color: var(--see-text);
    }

    &--danger {
      background-color: var(--see-error);
      color: var(--see-text);
    }

    &--success {
      background-color: var(--see-success);
      color: var(--see-text);
    }

    &--warning {
      background-color: var(--see-warning);
      color: var(--see-text);
    }
  }

  &__btn-icon {
    font-size: 36rpx;
    margin-bottom: 4rpx;
  }

  &__btn-text {
    font-size: 26rpx;
    white-space: nowrap;
  }

  &__content {
    position: relative;
    z-index: 1;
    background-color: var(--see-bg-color);
  }
}
</style>
