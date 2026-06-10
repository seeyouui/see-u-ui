<template>
  <view
    v-if="showState"
    :class="[
      'see-no-network',
      {
        'see-no-network--fullscreen': props.isFullscreen
      }
    ]"
  >
    <view class="see-no-network__content">
      <view class="see-no-network__icon">
        <text class="see-no-network__icon-text">{{ props.icon || '📡' }}</text>
      </view>
      <text class="see-no-network__text">{{ props.text }}</text>
      <view class="see-no-network__retry" @click="handleRetry">
        <text class="see-no-network__retry-text">{{ props.retryText }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeNoNetwork 无网络提示
 * @description 监听设备网络状态，在断网时显示提示信息，支持手动重试。
 * @tutorial https://www.seeuui.cn/components/no-network/
 * @property {Boolean} show 是否显示（v-model）
 * @property {String} text 提示文案
 * @property {String} retryText 重试按钮文案
 * @property {Boolean} isFullscreen 是否全屏
 * @property {String} icon 图标名称
 * @property {Boolean} autoCheck 是否自动监听
 * @property {Number} retryInterval 自动重试间隔(ms)
 * @event {Function} onRetry 点击重试时触发
 * @event {Function} onNetworkChange 网络状态变化时触发
 */
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { SeeNoNetworkProps, SeeNoNetworkEmits } from './type'

defineOptions({ name: 'SeeNoNetwork' })

const props = withDefaults(defineProps<SeeNoNetworkProps>(), {
  show: false,
  text: '网络异常，请检查网络连接',
  retryText: '重新连接',
  isFullscreen: false,
  autoCheck: true,
  retryInterval: 0
})

const emit = defineEmits<SeeNoNetworkEmits>()

const showState = ref(props.show)
const isOnline = ref(true)
let retryTimer: ReturnType<typeof setInterval> | null = null

// 保存 onNetworkStatusChange 回调引用，用于在 onUnmounted 中取消监听
const networkStatusChangeCallback = (res: { isConnected: boolean }) => {
  updateNetworkState(res.isConnected)
}

// 手动控制模式（show prop）
watch(
  () => props.show,
  (val) => {
    showState.value = val
  }
)

// 统一的网络状态更新函数
const updateNetworkState = (connected: boolean) => {
  isOnline.value = connected
  showState.value = !connected
  emit('update:show', !connected)
  emit('onNetworkChange', connected)

  if (connected) {
    // 网络恢复后清除自动重试定时器
    if (retryTimer) {
      clearInterval(retryTimer)
      retryTimer = null
    }
  } else {
    // 网络断开时启动自动重试定时器（如果配置了且尚未启动）
    if (props.retryInterval > 0 && !retryTimer) {
      retryTimer = setInterval(checkNetwork, props.retryInterval)
    }
  }
}

// 检测网络状态
const checkNetwork = () => {
  // #ifdef H5
  if (typeof navigator !== 'undefined') {
    updateNetworkState(navigator.onLine)
  }
  // #endif
  // #ifndef H5
  uni.getNetworkType({
    success: (res) => {
      updateNetworkState(res.networkType !== 'none')
    }
  })
  // #endif
}

const handleRetry = () => {
  emit('onRetry')
  checkNetwork()
}

onMounted(() => {
  if (props.autoCheck) {
    checkNetwork()
    // #ifdef H5
    if (typeof window !== 'undefined') {
      window.addEventListener('online', checkNetwork)
      window.addEventListener('offline', checkNetwork)
    }
    // #endif
    // #ifndef H5
    uni.onNetworkStatusChange(networkStatusChangeCallback)
    // #endif

    // 自动重试（仅在网络断开时启动）
    if (props.retryInterval > 0 && !isOnline.value) {
      retryTimer = setInterval(checkNetwork, props.retryInterval)
    }
  }
})

onUnmounted(() => {
  // #ifdef H5
  if (typeof window !== 'undefined') {
    window.removeEventListener('online', checkNetwork)
    window.removeEventListener('offline', checkNetwork)
  }
  // #endif
  // #ifndef H5
  uni.offNetworkStatusChange(networkStatusChangeCallback)
  // #endif
  if (retryTimer) {
    clearInterval(retryTimer)
    retryTimer = null
  }
})
</script>

<style lang="scss" scoped>
.see-no-network {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  &--fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background-color: var(--see-bg-color);
  }
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rpx;
  }
  &__icon-text {
    font-size: 80rpx;
  }
  &__text {
    font-size: 28rpx;
    color: var(--see-tips-color);
    text-align: center;
  }
  &__retry {
    padding: 16rpx 48rpx;
    border-radius: 40rpx;
    background-color: var(--see-primary);
  }
  &__retry-text {
    font-size: 26rpx;
    color: var(--see-text);
  }
}
</style>
