<template>
  <view v-show="visible" class="see-notify" :class="notifyClasses" :style="notifyStyle" @click="handleClick">
    <!-- 左侧彩色条 -->
    <view class="see-notify__bar" :style="barStyle" />

    <!-- 图标 -->
    <view v-if="iconName" class="see-notify__icon">
      <slot name="icon">
        <text class="see-notify__icon-text">{{ iconName }}</text>
      </slot>
    </view>

    <!-- 内容 -->
    <view class="see-notify__content">
      <text class="see-notify__text" :style="textStyle">{{ currentMessage }}</text>
    </view>

    <!-- 关闭按钮 -->
    <view v-if="currentIsClosable" class="see-notify__close" @click.stop="handleClose">
      <text class="see-notify__close-icon">×</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeNotify 顶部消息通知
 * @description 从页面顶部滑入的系统级通知
 * @tutorial https://www.seeuui.cn/components/notify/
 * @property {Boolean} show 是否显示
 * @property {String} message 通知文字
 * @property {String} type 通知类型
 * @property {Number} duration 显示时长
 * @property {String} icon 自定义图标
 * @property {String} color 自定义文字色
 * @property {String} background 自定义背景色
 * @property {Boolean} isClosable 是否可手动关闭
 * @property {Number} zIndex z-index
 * @property {Boolean} isSafeArea 是否适配安全区
 * @event {Function} onClick 点击通知时触发
 * @event {Function} onClose 关闭时触发
 */
import { computed, ref, watch, onUnmounted, nextTick } from 'vue'
import type { SeeNotifyProps, SeeNotifyEmits, NotifyType } from './type'
import { notifyManager } from './notify-manager'

defineOptions({ name: 'SeeNotify' })

const props = withDefaults(defineProps<SeeNotifyProps>(), {
  show: false,
  message: '',
  type: 'info',
  duration: 3000,
  icon: '',
  color: '',
  background: '',
  isClosable: false,
  zIndex: 2000,
  isSafeArea: true
})

const emit = defineEmits<SeeNotifyEmits>()

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
  if (isImperative.value) return notifyManager.message.value
  return props.message
})
const currentType = computed<NotifyType>(() => {
  if (isImperative.value) return notifyManager.type.value
  return props.type
})
const currentIsClosable = computed(() => {
  if (isImperative.value) return notifyManager.isClosable.value
  return props.isClosable
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
  if (notifyManager.icon.value) return notifyManager.icon.value
  return typeIconMap[currentType.value] || ''
})

// ==================== 类型颜色映射 ====================

const typeColorMap: Record<string, string> = {
  success: 'var(--see-success)',
  error: 'var(--see-error)',
  warning: 'var(--see-warning)',
  info: 'var(--see-primary)'
}

// ==================== 计算属性 ====================

const notifyClasses = computed(() => [
  `see-notify--${currentType.value}`,
  {
    'see-notify--safe-area': props.isSafeArea,
    'see-notify--visible': showAnimation.value
  }
])

const notifyStyle = computed(() => {
  const style: Record<string, string> = {
    zIndex: String(props.zIndex)
  }

  if (props.background || notifyManager.background.value) {
    style.backgroundColor = props.background || notifyManager.background.value
  }

  return style
})

const barStyle = computed(() => ({
  backgroundColor: typeColorMap[currentType.value]
}))

const textStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.color || notifyManager.color.value) {
    style.color = props.color || notifyManager.color.value
  }
  return style
})

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

  // 延迟添加动画类，让浏览器先绘制初始状态（translateY(-100%)），再过渡到可见
  nextTick(() => {
    requestAnimationFrame(() => {
      showAnimation.value = true
    })
  })

  // 只有组件式调用才创建自己的定时器
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

const handleClick = () => {
  emit('onClick')
  notifyManager.triggerClick()
}

const handleClose = () => {
  close()
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

// 监听 notifyManager.show（命令式调用）
watch(
  () => notifyManager.show.value,
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
.see-notify {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 24rpx;
  background-color: var(--see-bg-color);
  box-shadow: var(--see-shadow-medium);
  transform: translateY(-100%);
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);

  &--visible {
    transform: translateY(0);
  }

  &--safe-area {
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
  }

  &__bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6rpx;
  }

  &__icon {
    margin-right: 16rpx;
  }

  &__icon-text {
    font-size: 36rpx;
  }

  &__content {
    flex: 1;
    overflow: hidden;
  }

  &__text {
    font-size: 28rpx;
    color: var(--see-main-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__close {
    margin-left: 16rpx;
    padding: 8rpx;
  }

  &__close-icon {
    font-size: 32rpx;
    color: var(--see-tips-color);
    line-height: 1;
  }

  // 类型颜色
  &--success {
    .see-notify__icon-text {
      color: var(--see-success);
    }
  }

  &--error {
    .see-notify__icon-text {
      color: var(--see-error);
    }
  }

  &--warning {
    .see-notify__icon-text {
      color: var(--see-warning);
    }
  }

  &--info {
    .see-notify__icon-text {
      color: var(--see-primary);
    }
  }
}
</style>
