<script lang="ts" setup>
/**
 * SeeCountDown 倒计时
 * @description 用于验证码倒计时、活动倒计时、支付剩余时间和订单超时关闭。
 */
import { computed, onMounted, watch } from 'vue'
import { formatCountdown, useCountdown } from '../../utils/hooks/useCountdown'
import type { CountdownTimeData } from '../../utils/hooks/useCountdown'
import type { SeeCountDownProps } from './type'

defineOptions({ name: 'SeeCountDown' })

const props = withDefaults(defineProps<SeeCountDownProps>(), {
  time: 0,
  format: '',
  autoStart: true,
  millisecond: false,
  interval: 0,
  serverTime: undefined,
  endTime: undefined,
  separator: ':',
  showDays: false,
  zeroPad: true,
  textColor: 'var(--see-text-color, #303133)',
  fontSize: '28rpx',
  block: false
})

const emit = defineEmits<{
  (e: 'onChange', timeData: CountdownTimeData): void
  (e: 'onFinish'): void
  (e: 'onStart'): void
  (e: 'onPause'): void
  (e: 'onReset'): void
}>()

const countdown = useCountdown({
  time: props.time,
  interval: props.interval || (props.millisecond ? 16 : 1000),
  millisecond: props.millisecond,
  serverTime: props.serverTime,
  endTime: props.endTime,
  onChange: (timeData) => emit('onChange', timeData),
  onFinish: () => emit('onFinish')
})

// 响应 props 变更：time/endTime/serverTime 变化时重置倒计时
watch(
  () => [props.time, props.serverTime, props.endTime],
  () => {
    const newTime = typeof props.endTime === 'number' ? Math.max(0, props.endTime - (props.serverTime ?? Date.now())) : props.time
    countdown.reset(newTime)
  }
)

const displayFormat = computed(() => {
  if (props.format) return props.format
  const base = props.showDays ? 'DD:HH:mm:ss' : 'HH:mm:ss'
  const millisecond = props.millisecond ? '.SSS' : ''
  return `${base}${millisecond}`
})

const formatted = computed(() => {
  const text = formatCountdown(countdown.current.value, displayFormat.value)
  if (props.format) return text
  return text.replace(/:/g, props.separator)
})

const rootClasses = computed(() => [
  'see-count-down',
  {
    'see-count-down--block': props.block
  }
])

const rootStyle = computed(() => ({
  color: props.textColor,
  fontSize: props.fontSize
}))

const slotScope = computed(() => ({
  ...countdown.current.value,
  formatted: formatted.value
}))

const start = () => {
  countdown.start()
  emit('onStart')
}

const pause = () => {
  countdown.pause()
  emit('onPause')
}

const reset = (time?: number) => {
  countdown.reset(time)
  emit('onReset')
}

const finish = () => {
  countdown.finish()
}

onMounted(() => {
  if (props.autoStart) start()
})

defineExpose({
  start,
  pause,
  reset,
  finish
})
</script>

<template>
  <view :class="rootClasses" :style="rootStyle">
    <slot v-bind="slotScope">{{ formatted }}</slot>
  </view>
</template>

<style lang="scss" scoped>
.see-count-down {
  display: inline-flex;
  align-items: center;
  line-height: 1.4;
  font-variant-numeric: tabular-nums;

  &--block {
    display: flex;
    width: 100%;
  }
}
</style>
