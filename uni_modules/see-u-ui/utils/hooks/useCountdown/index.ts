import { getCurrentInstance, onBeforeUnmount, ref } from 'vue'

export interface CountdownTimeData {
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
  total: number
}

export interface UseCountdownOptions {
  time?: number
  interval?: number
  millisecond?: boolean
  serverTime?: number
  endTime?: number
  onChange?: (timeData: CountdownTimeData) => void
  onFinish?: () => void
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const pad = (value: number, length = 2) => String(value).padStart(length, '0')

export const parseCountdownTime = (time: number): CountdownTimeData => {
  const total = Math.max(0, Math.floor(time))
  const days = Math.floor(total / DAY)
  const hours = Math.floor((total % DAY) / HOUR)
  const minutes = Math.floor((total % HOUR) / MINUTE)
  const seconds = Math.floor((total % MINUTE) / SECOND)
  const milliseconds = total % SECOND

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    total
  }
}

export const formatCountdown = (timeData: CountdownTimeData, format = 'HH:mm:ss') => {
  return format
    .replace(/DD/g, pad(timeData.days))
    .replace(/D/g, String(timeData.days))
    .replace(/HH/g, pad(timeData.hours))
    .replace(/H/g, String(timeData.hours))
    .replace(/hh/g, pad(timeData.hours))
    .replace(/h/g, String(timeData.hours))
    .replace(/mm/g, pad(timeData.minutes))
    .replace(/m/g, String(timeData.minutes))
    .replace(/ss/g, pad(timeData.seconds))
    .replace(/s/g, String(timeData.seconds))
    .replace(/SSS/g, pad(timeData.milliseconds, 3))
    .replace(/S/g, String(timeData.milliseconds))
}

const getInitialTime = (options: UseCountdownOptions) => {
  if (typeof options.endTime === 'number') {
    const now = typeof options.serverTime === 'number' ? options.serverTime : Date.now()
    return Math.max(0, options.endTime - now)
  }
  return Math.max(0, options.time ?? 0)
}

const getChangeKey = (timeData: CountdownTimeData, millisecond: boolean) => {
  if (millisecond) return `${timeData.days}:${timeData.hours}:${timeData.minutes}:${timeData.seconds}:${timeData.milliseconds}`
  return `${timeData.days}:${timeData.hours}:${timeData.minutes}:${timeData.seconds}`
}

export function useCountdown(options: UseCountdownOptions = {}) {
  const interval = Math.max(16, options.interval ?? (options.millisecond ? 16 : 1000))
  const current = ref<CountdownTimeData>(parseCountdownTime(getInitialTime(options)))
  const isRunning = ref(false)
  const remaining = ref(current.value.total)
  const timer = ref<ReturnType<typeof setInterval> | null>(null)
  const lastChangeKey = ref(getChangeKey(current.value, !!options.millisecond))
  const finished = ref(false)

  const cleanup = () => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
    isRunning.value = false
  }

  const emitChange = (timeData: CountdownTimeData) => {
    const key = getChangeKey(timeData, !!options.millisecond)
    if (key !== lastChangeKey.value) {
      lastChangeKey.value = key
      options.onChange?.(timeData)
    }
  }

  const setRemaining = (value: number) => {
    remaining.value = Math.max(0, Math.floor(value))
    current.value = parseCountdownTime(remaining.value)
    emitChange(current.value)
  }

  const finish = () => {
    setRemaining(0)
    cleanup()
    if (!finished.value) {
      finished.value = true
      options.onFinish?.()
    }
  }

  // 基于挂钟时间的精确倒计时
  const lastTickTime = ref(0)

  const tick = () => {
    const now = Date.now()
    const elapsed = now - lastTickTime.value
    lastTickTime.value = now
    const next = remaining.value - elapsed
    if (next <= 0) {
      finish()
      return
    }
    setRemaining(next)
  }

  const start = () => {
    if (isRunning.value || remaining.value <= 0) return
    cleanup()
    finished.value = false
    isRunning.value = true
    lastTickTime.value = Date.now()
    timer.value = setInterval(tick, interval)
  }

  const pause = () => {
    cleanup()
  }

  const reset = (time?: number) => {
    cleanup()
    finished.value = false
    const next = typeof time === 'number' ? time : getInitialTime(options)
    setRemaining(next)
  }

  if (getCurrentInstance()) {
    onBeforeUnmount(cleanup)
  }

  return {
    current,
    isRunning,
    start,
    pause,
    reset,
    finish,
    cleanup
  }
}
