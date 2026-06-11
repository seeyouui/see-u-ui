<template>
  <view class="see-copy" :class="{ 'see-copy--highlight': isHighlight && isCopying }" @click="handleClick">
    <slot />
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeCopy 复制功能组件
 * @description 一键复制文本内容到剪贴板
 * @tutorial https://www.seeuui.cn/components/copy/
 * @property {String} text 要复制的文字
 * @property {Boolean} isShowToast 复制成功后是否显示 Toast
 * @property {String} toastMessage 成功提示文字
 * @property {Number} toastDuration Toast 显示时长
 * @property {Boolean} isDisabled 是否禁用复制
 * @property {Boolean} isHighlight 点击时是否高亮文字
 * @event {Function} onSuccess 复制成功时触发
 * @event {Function} onError 复制失败时触发
 * @event {Function} onClick 点击时触发
 */
import { ref } from 'vue'
import type { SeeCopyProps, SeeCopyEmits } from './type'

defineOptions({ name: 'SeeCopy' })

const props = withDefaults(defineProps<SeeCopyProps>(), {
  text: '',
  isShowToast: true,
  toastMessage: '复制成功',
  toastDuration: 1500,
  isDisabled: false,
  isHighlight: false
})

const emit = defineEmits<SeeCopyEmits>()

// ==================== 状态管理 ====================

const isCopying = ref(false)
const lastResult = ref<boolean | null>(null)

// ==================== 复制方法 ====================

/**
 * 执行复制操作
 */
const copy = async (): Promise<boolean> => {
  if (isCopying.value || props.isDisabled || !props.text) {
    return false
  }

  isCopying.value = true
  emit('onClick', props.text)

  try {
    let success = false

    // #ifdef H5
    // H5 环境：优先使用 Clipboard API，回退到 execCommand
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(props.text)
        success = true
      }
    } catch {
      // 回退到 execCommand
      try {
        const textarea = document.createElement('textarea')
        textarea.value = props.text
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        textarea.style.top = '-9999px'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        success = document.execCommand('copy')
        document.body.removeChild(textarea)
      } catch {
        success = false
      }
    }
    // #endif

    // #ifndef H5
    // 小程序/App 环境
    success = await new Promise<boolean>((resolve) => {
      uni.setClipboardData({
        data: props.text,
        success: () => resolve(true),
        fail: () => resolve(false)
      })
    })
    // #endif

    lastResult.value = success

    if (success) {
      // 显示成功提示
      if (props.isShowToast) {
        uni.showToast({
          title: props.toastMessage,
          icon: 'success',
          duration: props.toastDuration
        })
      }
      emit('onSuccess', props.text)
    } else {
      const error = new Error('复制失败')
      emit('onError', error)
    }

    return success
  } catch (err) {
    lastResult.value = false
    emit('onError', err instanceof Error ? err : new Error('复制失败'))
    return false
  } finally {
    isCopying.value = false
  }
}

// ==================== 事件处理 ====================

const handleClick = () => {
  copy()
}

// ==================== Expose ====================

defineExpose({
  copy
})
</script>

<style lang="scss" scoped>
.see-copy {
  display: inline-block;
  cursor: pointer;

  &--highlight {
    opacity: 0.7;
  }
}
</style>
