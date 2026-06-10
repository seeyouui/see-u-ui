<script lang="ts" setup>
/**
 * SeeCountTo 数字滚动
 * @description 用于统计卡片、金额变化、数据大屏和指标增长动画。
 */
import { computed, onMounted, watch } from 'vue'
import { useCountTo, formatCountToValue } from '../../utils/hooks/useCountTo'
import type { SeeCountToProps } from './type'

defineOptions({ name: 'SeeCountTo' })

const props = withDefaults(defineProps<SeeCountToProps>(), {
  startVal: 0,
  endVal: 0,
  duration: 2000,
  autoplay: true,
  decimals: 0,
  decimal: '.',
  separator: ',',
  prefix: '',
  suffix: '',
  useEasing: true,
  easingFn: undefined,
  color: 'var(--see-text-color, #303133)',
  fontSize: '32rpx',
  fontWeight: 600
})

const emit = defineEmits<{
  (e: 'onStart'): void
  (e: 'onChange', value: number): void
  (e: 'onFinish'): void
  (e: 'onReset'): void
}>()

const counter = useCountTo({
  startVal: props.startVal,
  endVal: props.endVal,
  duration: props.duration,
  decimals: props.decimals,
  decimal: props.decimal,
  separator: props.separator,
  prefix: props.prefix,
  suffix: props.suffix,
  useEasing: props.useEasing,
  easingFn: props.easingFn,
  onStart: () => emit('onStart'),
  onChange: (value) => emit('onChange', value),
  onFinish: () => emit('onFinish'),
  onReset: () => emit('onReset')
})

const rootStyle = computed(() => ({
  color: props.color,
  fontSize: props.fontSize,
  fontWeight: props.fontWeight
}))

// 直接用当前 props 格式化数值，避免依赖 hook 的闭包快照
const displayText = computed(() => {
  return formatCountToValue(counter.currentValue.value, {
    decimals: props.decimals,
    decimal: props.decimal,
    separator: props.separator,
    prefix: '',
    suffix: ''
  })
})

const start = () => counter.start()
const pause = () => counter.pause()
const resume = () => counter.resume()
const reset = () => counter.reset()
const update = (value: number) => counter.update(value)

onMounted(() => {
  if (props.autoplay) start()
})

watch(
  () => props.endVal,
  (value, oldValue) => {
    if (value !== oldValue) update(value)
  }
)

// 响应 duration 变更：重启动画以使用新 duration
watch(
  () => props.duration,
  () => {
    // duration 变化时，如果正在运行则重启动画
    if (counter.isRunning.value) {
      counter.reset()
      counter.start()
    }
  }
)

defineExpose({
  start,
  pause,
  resume,
  reset,
  update
})
</script>

<template>
  <view class="see-count-to" :style="rootStyle">
    <slot name="prefix">{{ props.prefix }}</slot>
    <slot :value="counter.currentValue.value" :display-value="counter.displayValue.value">
      {{ displayText }}
    </slot>
    <slot name="suffix">{{ props.suffix }}</slot>
  </view>
</template>

<style lang="scss" scoped>
.see-count-to {
  display: inline-flex;
  align-items: baseline;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}
</style>
