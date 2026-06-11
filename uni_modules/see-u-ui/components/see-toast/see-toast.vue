<template>
  <view v-show="visible" class="see-toast" :class="toastClasses" :style="toastStyle">
    <!-- 遮罩层 -->
    <view v-if="currentIsOverlay" class="see-toast__overlay" @click="handleOverlayClick" />

    <!-- 内容区域 -->
    <view class="see-toast__content" :style="contentStyle">
      <!-- 图标 -->
      <view v-if="iconName || currentType === 'loading'" class="see-toast__icon">
        <slot name="icon">
          <!-- Loading 类型使用加载动画 -->
          <view v-if="currentType === 'loading'" class="see-toast__loading">
            <view class="see-toast__loading-ring" />
          </view>
          <!-- 其他类型使用图标 -->
          <text v-else class="see-toast__icon-text">{{ iconName }}</text>
        </slot>
      </view>

      <!-- 文字 -->
      <text v-if="currentMessage" class="see-toast__text">{{ currentMessage }}</text>

      <!-- 默认插槽 -->
      <slot />
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeToast 消息提示
 * @description 轻量级的消息提示，支持多种类型和命令式调用
 * @tutorial https://www.seeuui.cn/components/toast/
 * @property {Boolean} show 是否显示（v-model）
 * @property {String} message 提示文字
 * @property {String} type 提示类型
 * @property {String} icon 自定义图标
 * @property {Number} duration 显示时长
 * @property {String} position 显示位置
 * @property {Boolean} isOverlay 是否显示遮罩
 * @property {Number} zIndex z-index
 * @property {Boolean} isCloseOnClickOverlay 点击遮罩是否关闭
 * @event {Function} onClose Toast 关闭时触发
 */
import { computed, ref, watch, onUnmounted, nextTick } from 'vue'
import type { SeeToastProps, SeeToastEmits, ToastType } from './type'
import { toastManager } from './toast-manager'

defineOptions({ name: 'SeeToast' })

const props = withDefaults(defineProps<SeeToastProps>(), {
  show: false,
  message: '',
  type: 'default',
  icon: '',
  duration: 2000,
  position: 'center',
  isOverlay: false,
  zIndex: 2000,
  isCloseOnClickOverlay: false
})

const emit = defineEmits<SeeToastEmits>()

// ==================== 状态管理 ====================

const visible = ref(props.show)
const showAnimation = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null
let exitTimer: ReturnType<typeof setTimeout> | null = null
/** 标记当前是否为命令式（manager）模式 */
let isManagerMode = false

// ==================== 当前状态（支持命令式和组件式） ====================

/** 是否通过命令式 API 调用 */
const isImperative = ref(false)

const currentMessage = computed(() => {
  if (isImperative.value) return toastManager.message.value
  return props.message
})
const currentType = computed<ToastType>(() => {
  if (isImperative.value) return toastManager.type.value
  return props.type !== 'default' ? props.type : 'default'
})
const currentIsOverlay = computed(() => {
  if (isImperative.value) return toastManager.isOverlay.value
  return props.isOverlay
})

// ==================== 图标映射 ====================

const typeIconMap: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i'
}

const iconName = computed(() => {
  if (props.icon) return props.icon
  if (toastManager.icon.value) return toastManager.icon.value
  return typeIconMap[currentType.value] || ''
})

// ==================== 计算属性 ====================

const toastClasses = computed(() => [
  `see-toast--${props.position}`,
  `see-toast--${currentType.value}`,
  {
    'see-toast--visible': showAnimation.value
  }
])

const toastStyle = computed(() => ({
  zIndex: props.zIndex
}))

const contentStyle = computed(() => ({
  backgroundColor: currentType.value === 'default' ? 'rgba(0, 0, 0, 0.75)' : undefined
}))

// ==================== 动画控制 ====================

const cleanupTimer = () => {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  if (exitTimer) {
    clearTimeout(exitTimer)
    exitTimer = null
  }
}

const open = (imperative = false) => {
  cleanupTimer()
  visible.value = true
  isImperative.value = imperative
  if (imperative) {
    isManagerMode = true
  }

  // 延迟添加动画类，让浏览器先绘制初始状态（opacity: 0），再过渡到可见
  nextTick(() => {
    requestAnimationFrame(() => {
      showAnimation.value = true
    })
  })

  // 只有组件式调用才创建自己的定时器
  // 命令式调用由 toastManager 管理定时器
  if (!imperative) {
    const duration = props.duration
    if (duration > 0) {
      closeTimer = setTimeout(() => {
        close()
      }, duration)
    }
  }
}

const close = () => {
  if (!visible.value && !showAnimation.value) return // 防止重复关闭
  const wasManagerMode = isManagerMode
  cleanupTimer()
  showAnimation.value = false
  // 等待退出动画完成后再隐藏元素
  exitTimer = setTimeout(() => {
    visible.value = false
    isImperative.value = false
    emit('onClose')
    // 只在非命令式（v-model）模式下才 emit update:show，避免 manager 自动关闭时覆盖 v-model 值
    if (!wasManagerMode) {
      emit('update:show', false)
    }
    isManagerMode = false
  }, 300) // 与 CSS transition 时长一致
}

// ==================== 事件处理 ====================

const handleOverlayClick = () => {
  if (props.isCloseOnClickOverlay) {
    close()
  }
}

// ==================== 监听 ====================

// 监听 props.show
watch(
  () => props.show,
  (val) => {
    if (val) {
      open()
    } else if (visible.value) {
      close()
    }
  }
)

// 监听 toastManager.show（命令式调用）
watch(
  () => toastManager.show.value,
  (val) => {
    if (val) {
      open(true) // 标记为命令式调用
    } else if (visible.value && isManagerMode) {
      // manager 触发的关闭，走 close 流程（不会 emit update:show）
      close()
    }
  }
)

// ==================== 生命周期 ====================

onUnmounted(() => {
  cleanupTimer()
})

// ==================== Expose ====================

defineExpose({
  show: open,
  hide: close
})
</script>

<style lang="scss" scoped>
.see-toast {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.8);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  &--visible {
    opacity: 1;
    transform: scale(1);
  }

  &--top {
    align-items: flex-start;
    padding-top: 200rpx;
  }

  &--bottom {
    align-items: flex-end;
    padding-bottom: 200rpx;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: auto;
  }

  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 200rpx;
    max-width: 70%;
    padding: 24rpx 32rpx;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 12rpx;
    pointer-events: auto;
  }

  &__icon {
    margin-bottom: 16rpx;
  }

  &__icon-text {
    font-size: 48rpx;
    color: #ffffff;
  }

  &__text {
    font-size: 28rpx;
    color: #ffffff;
    text-align: center;
    line-height: 1.4;
    word-break: break-all;
  }

  &__loading {
    width: 48rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__loading-ring {
    width: 40rpx;
    height: 40rpx;
    border: 4rpx solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: see-toast-spin 0.8s linear infinite;
  }
}

@keyframes see-toast-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
