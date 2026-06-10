import { ref, computed, onBeforeUnmount, getCurrentInstance } from 'vue'

export interface CountToFormatOptions {
  decimals?: number
  decimal?: string
  separator?: string
  prefix?: string
  suffix?: string
}

export interface UseCountToOptions extends CountToFormatOptions {
  startVal?: number
  endVal?: number
  duration?: number
  useEasing?: boolean
  easingFn?: (t: number, b: number, c: number, d: number) => number
  onStart?: () => void
  onChange?: (value: number) => void
  onFinish?: () => void
  onReset?: () => void
}

export const easeOutExpo = (t: number, b: number, c: number, d: number): number => {
  return t === d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b
}

export const formatCountToValue = (value: number, options: CountToFormatOptions = {}): string => {
  const { decimals = 0, decimal = '.', separator = ',', prefix = '', suffix = '' } = options
  const parts = value.toFixed(decimals).split('.')
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  const decPart = parts[1] ? `${decimal}${parts[1]}` : ''
  return `${prefix}${intPart}${decPart}${suffix}`
}

const getRaf = () => {
  if (typeof requestAnimationFrame !== 'undefined') return requestAnimationFrame
  return (cb: (time: number) => void) => +setTimeout(cb, 16)
}

const getCaf = () => {
  if (typeof cancelAnimationFrame !== 'undefined') return cancelAnimationFrame
  return (id: number) => clearTimeout(id)
}

export function useCountTo(options: UseCountToOptions = {}) {
  const { startVal = 0, endVal = 100, duration = 2000, useEasing = true, easingFn = easeOutExpo } = options

  const currentValue = ref(startVal)
  const isRunning = ref(false)
  const rafId = ref<number | null>(null)
  const startTime = ref(0)
  const animationStartValue = ref(startVal)
  const animationEndValue = ref(endVal)

  const formatOptions = computed<CountToFormatOptions>(() => ({
    decimals: options.decimals ?? 0,
    decimal: options.decimal ?? '.',
    separator: options.separator ?? ',',
    prefix: options.prefix ?? '',
    suffix: options.suffix ?? ''
  }))

  const displayValue = computed(() => formatCountToValue(currentValue.value, formatOptions.value))

  const raf = getRaf()
  const caf = getCaf()

  const cleanup = () => {
    if (rafId.value != null) {
      caf(rafId.value)
      rafId.value = null
    }
    isRunning.value = false
  }

  const tick = () => {
    const elapsed = Date.now() - startTime.value
    const progress = Math.min(elapsed / duration, 1)
    const range = animationEndValue.value - animationStartValue.value

    if (useEasing) {
      currentValue.value = easingFn(elapsed, animationStartValue.value, range, duration)
    } else {
      currentValue.value = animationStartValue.value + range * progress
    }

    options.onChange?.(currentValue.value)

    if (progress >= 1) {
      currentValue.value = animationEndValue.value
      cleanup()
      options.onFinish?.()
      return
    }

    rafId.value = raf(tick)
  }

  const start = () => {
    if (isRunning.value) return
    cleanup()
    animationStartValue.value = currentValue.value
    animationEndValue.value = options.endVal ?? endVal
    startTime.value = Date.now()
    isRunning.value = true
    options.onStart?.()
    rafId.value = raf(tick)
  }

  const pause = () => {
    if (!isRunning.value) return
    cleanup()
  }

  const resume = () => {
    if (isRunning.value) return
    const range = animationEndValue.value - animationStartValue.value
    const done = currentValue.value - animationStartValue.value
    // 如果已完成比例 >= 1，说明动画已结束（支持递增和递减）
    if (range !== 0 && Math.abs(done / range) >= 1) return
    animationStartValue.value = currentValue.value
    startTime.value = Date.now()
    isRunning.value = true
    rafId.value = raf(tick)
  }

  const reset = () => {
    cleanup()
    currentValue.value = options.startVal ?? startVal
    animationStartValue.value = currentValue.value
    animationEndValue.value = options.endVal ?? endVal
    options.onReset?.()
  }

  const update = (value: number) => {
    cleanup()
    animationStartValue.value = currentValue.value
    animationEndValue.value = value
    startTime.value = Date.now()
    isRunning.value = true
    rafId.value = raf(tick)
  }

  if (getCurrentInstance()) {
    onBeforeUnmount(cleanup)
  }

  return {
    currentValue,
    displayValue,
    isRunning,
    start,
    pause,
    resume,
    reset,
    update,
    cleanup
  }
}
