<template>
  <view
    v-if="isVisible"
    class="see-notice-bar"
    :class="noticeBarClasses"
    @click="handleClick"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- 左侧图标 -->
    <view v-if="isShowIcon && iconName" class="see-notice-bar__icon">
      <slot name="left-icon">
        <text class="see-notice-bar__icon-text">{{ iconName }}</text>
      </slot>
    </view>

    <!-- 内容区域 -->
    <view ref="contentRef" class="see-notice-bar__content">
      <!-- 横向滚动 -->
      <view
        v-if="isScrollable && !vertical"
        class="see-notice-bar__scroll"
        :class="{ 'see-notice-bar__scroll--playing': isPlaying }"
        :style="scrollStyle"
      >
        <text class="see-notice-bar__text">{{ text }}</text>
        <text class="see-notice-bar__text see-notice-bar__text--duplicate">{{ text }}</text>
      </view>

      <!-- 垂直轮播 -->
      <view v-else-if="vertical && messages.length > 0" class="see-notice-bar__vertical" :style="verticalStyle">
        <text class="see-notice-bar__text">{{ currentMessage }}</text>
      </view>

      <!-- 静态文字 -->
      <view v-else class="see-notice-bar__static">
        <slot>
          <text class="see-notice-bar__text">{{ text }}</text>
        </slot>
      </view>
    </view>

    <!-- 右侧操作区 -->
    <view v-if="rightIcon || $slots['right-icon']" class="see-notice-bar__right" @click.stop="handleRightClick">
      <slot name="right-icon">
        <text class="see-notice-bar__right-icon">{{ rightIcon }}</text>
      </slot>
    </view>

    <!-- 关闭按钮 -->
    <view v-if="isClosable" class="see-notice-bar__close" @click.stop="handleClose">
      <text class="see-notice-bar__close-icon">x</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeNoticeBar 滚动通知
 * @description 页面顶部的公告栏/通知栏，文字过长时自动横向滚动
 * @tutorial https://www.seeuui.cn/components/notice-bar/
 * @property {String} text 通知文字
 * @property {String} type 通知类型
 * @property {Number} speed 滚动速度
 * @property {Boolean} isScrollable 是否可滚动
 * @property {Number} delay 滚动开始前停顿
 * @property {Boolean} isClosable 是否可关闭
 * @property {Boolean} isShowIcon 是否显示左侧图标
 * @property {String} icon 自定义图标
 * @property {String} rightIcon 右侧图标
 * @property {Boolean} isShow 是否显示（v-model）
 * @property {Boolean} isPauseOnTouch 触摸时是否暂停滚动
 * @property {Boolean} vertical 是否垂直滚动
 * @property {Array} messages 多条消息
 * @property {Number} verticalInterval 垂直轮播间隔
 * @event {Function} onClick 点击通知条
 * @event {Function} onClose 关闭时触发
 * @event {Function} onRightClick 点击右侧图标
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { SeeNoticeBarProps, SeeNoticeBarEmits } from './type'

defineOptions({ name: 'SeeNoticeBar' })

const props = withDefaults(defineProps<SeeNoticeBarProps>(), {
  text: '',
  type: 'info',
  speed: 50,
  isScrollable: true,
  delay: 1000,
  isClosable: false,
  isShowIcon: true,
  icon: 'volume',
  rightIcon: '',
  isShow: true,
  isPauseOnTouch: true,
  vertical: false,
  messages: () => [],
  verticalInterval: 3000
})

const emit = defineEmits<SeeNoticeBarEmits>()

// ==================== 状态管理 ====================

const isVisible = ref(props.isShow)
const isPlaying = ref(false)
const currentIndex = ref(0)
const contentRef = ref<HTMLElement | null>(null)

let verticalTimer: ReturnType<typeof setInterval> | null = null
let startTimer: ReturnType<typeof setTimeout> | null = null

// ==================== 计算属性 ====================

const iconName = computed(() => props.icon)

const currentMessage = computed(() => {
  if (props.messages.length === 0) return props.text
  return props.messages[currentIndex.value] || ''
})

const noticeBarClasses = computed(() => [
  `see-notice-bar--${props.type}`,
  {
    'see-notice-bar--closable': props.isClosable
  }
])

const scrollStyle = computed(() => {
  // 使用像素宽度计算滚动时长，speed 单位为 px/s
  const textWidth = props.text.length * 14 // 估算每个字符约14px
  const containerWidth = 375 // 默认容器宽度
  const totalDistance = textWidth + containerWidth
  const duration = totalDistance / props.speed
  return {
    animationDuration: `${Math.max(duration, 1)}s`, // 最小1秒
    animationDelay: `${props.delay}ms`
  }
})

const verticalStyle = computed(() => ({
  transition: 'transform 300ms ease'
}))

// ==================== 滚动控制 ====================

const startVerticalScroll = () => {
  if (!props.vertical || props.messages.length <= 1) return

  verticalTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.messages.length
  }, props.verticalInterval)
}

const stopVerticalScroll = () => {
  if (verticalTimer) {
    clearInterval(verticalTimer)
    verticalTimer = null
  }
}

const startScroll = () => {
  if (!props.isScrollable || props.vertical) return

  startTimer = setTimeout(() => {
    isPlaying.value = true
  }, props.delay)
}

const pauseScroll = () => {
  isPlaying.value = false
}

const resumeScroll = () => {
  isPlaying.value = true
}

// ==================== 事件处理 ====================

const handleClick = () => {
  emit('onClick')
}

const handleClose = () => {
  isVisible.value = false
  emit('onClose')
  emit('update:isShow', false)
}

const handleRightClick = () => {
  emit('onRightClick')
}

const handleTouchStart = () => {
  if (props.isPauseOnTouch) {
    pauseScroll()
    stopVerticalScroll()
  }
}

const handleTouchEnd = () => {
  if (props.isPauseOnTouch) {
    resumeScroll()
    startVerticalScroll()
  }
}

// ==================== 监听 ====================

watch(
  () => props.isShow,
  (val) => {
    isVisible.value = val
    if (val) {
      startScroll()
      startVerticalScroll()
    } else {
      pauseScroll()
      stopVerticalScroll()
    }
  }
)

// ==================== 生命周期 ====================

onMounted(() => {
  startScroll()
  startVerticalScroll()
})

onUnmounted(() => {
  stopVerticalScroll()
  if (startTimer) {
    clearTimeout(startTimer)
  }
})

// ==================== Expose ====================

defineExpose({
  start: () => {
    startScroll()
    startVerticalScroll()
  },
  pause: () => {
    pauseScroll()
    stopVerticalScroll()
  },
  reset: () => {
    currentIndex.value = 0
    isPlaying.value = false
  }
})
</script>

<style lang="scss" scoped>
.see-notice-bar {
  display: flex;
  align-items: center;
  height: 72rpx;
  padding: 0 24rpx;
  overflow: hidden;

  &--info {
    background-color: var(--see-primary-light);
    .see-notice-bar__icon-text,
    .see-notice-bar__text,
    .see-notice-bar__right-icon,
    .see-notice-bar__close-icon {
      color: var(--see-primary-dark);
    }
  }

  &--warning {
    background-color: var(--see-warning-light);
    .see-notice-bar__icon-text,
    .see-notice-bar__text,
    .see-notice-bar__right-icon,
    .see-notice-bar__close-icon {
      color: var(--see-warning-dark);
    }
  }

  &--error {
    background-color: var(--see-error-light);
    .see-notice-bar__icon-text,
    .see-notice-bar__text,
    .see-notice-bar__right-icon,
    .see-notice-bar__close-icon {
      color: var(--see-error-dark);
    }
  }

  &__icon {
    margin-right: 12rpx;
    flex-shrink: 0;
  }

  &__icon-text {
    font-size: 32rpx;
  }

  &__content {
    flex: 1;
    overflow: hidden;
    min-width: 0;
  }

  &__scroll {
    display: flex;
    white-space: nowrap;
    animation: see-notice-bar-scroll linear infinite;
    animation-play-state: paused;

    &--playing {
      animation-play-state: running;
    }
  }

  &__text {
    font-size: 26rpx;
    line-height: 72rpx;
    white-space: nowrap;
    flex-shrink: 0;

    &--duplicate {
      margin-left: 100rpx;
    }
  }

  &__vertical {
    overflow: hidden;
    height: 72rpx;
  }

  &__static {
    overflow: hidden;
  }

  &__right {
    margin-left: 16rpx;
    flex-shrink: 0;
    padding: 8rpx;
  }

  &__right-icon {
    font-size: 28rpx;
  }

  &__close {
    margin-left: 16rpx;
    flex-shrink: 0;
    padding: 8rpx;
  }

  &__close-icon {
    font-size: 28rpx;
    line-height: 1;
  }
}

@keyframes see-notice-bar-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
