<template>
  <view
    v-if="visible"
    :class="[
      'see-overlay',
      {
        'see-overlay--active': visible
      }
    ]"
    :style="overlayStyle"
    @click="handleClick"
  >
    <slot />
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeOverlay 遮罩层
 * @description 创建一个全屏半透明遮罩层，通常用于弹窗、抽屉等组件的背景。
 * @tutorial https://www.seeuui.cn/components/overlay/
 * @property {Boolean} show 是否显示
 * @property {Number} zIndex z-index
 * @property {String} background 背景色
 * @property {Number} opacity 透明度
 * @property {Boolean} clickable 是否可点击关闭
 * @property {Boolean} isAnimated 是否启用动画
 * @property {Number} duration 动画持续时间
 * @event {Function} onClick 点击遮罩层时触发
 * @event {Function} onClose 遮罩层关闭时触发
 * @event {Function} onOpen 遮罩层打开时触发
 */
import { computed, ref, watch } from 'vue'
import type { SeeOverlayProps, SeeOverlayEmits } from './type'

defineOptions({ name: 'SeeOverlay' })

const props = withDefaults(defineProps<SeeOverlayProps>(), {
  show: false,
  zIndex: 1000,
  background: 'var(--see-overlay-bg)',
  opacity: 1,
  clickable: true,
  isAnimated: true,
  duration: 300
})

const emit = defineEmits<SeeOverlayEmits>()

const visible = ref(props.show)
let closeTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.show,
  (val) => {
    // 清除之前的关闭定时器，防止定时器泄漏
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }

    if (val) {
      visible.value = true
      emit('onOpen')
    } else {
      if (props.isAnimated) {
        closeTimer = setTimeout(() => {
          visible.value = false
          closeTimer = null
          emit('onClose')
        }, props.duration)
      } else {
        visible.value = false
        emit('onClose')
      }
    }
  }
)

const overlayStyle = computed(() => ({
  zIndex: props.zIndex,
  backgroundColor: props.background,
  opacity: props.show ? props.opacity : 0,
  transition: props.isAnimated ? `opacity ${props.duration}ms ease` : 'none'
}))

const handleClick = () => {
  emit('onClick')
  if (props.clickable) {
    emit('update:show', false)
  }
}
</script>

<style lang="scss" scoped>
.see-overlay {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
