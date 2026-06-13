import { ref, computed, unref, onMounted, onUnmounted, type ComputedRef, type MaybeRef } from 'vue'
import { t } from '../../../locale'

// --- 类型定义 ---
type DateInput = string | number | Date | null | undefined

// --- 1. 核心工具函数 (纯逻辑) ---

/**
 * 统一处理日期格式 (复用之前的逻辑)
 */
function normalizeDate(date: DateInput): Date | null {
  if (!date) return null
  if (date instanceof Date) return date
  if (typeof date === 'number') return new Date(date)
  if (typeof date === 'string') {
    if (/^\d+$/.test(date)) return new Date(parseInt(date))
    return new Date(date.replace(/-/g, '/'))
  }
  return null
}

/**
 * 核心：计算”多久之前”
 * @param date 目标时间
 * @returns 格式化后的字符串 (如 “1分钟前”)
 */
export function formatTimeAgo(date: DateInput): string {
  const d = normalizeDate(date)
  if (!d) return ''

  const now = Date.now()
  const diff = (now - d.getTime()) / 1000 // 转换为秒

  // 如果是未来时间，或者差异极小，显示刚刚
  if (diff < 0) return t('timeago.justNow')

  // 1分钟内 -> X秒前
  if (diff < 60) {
    return t('timeago.secondsAgo', { count: Math.floor(diff) })
  }

  // 1小时内 -> X分钟前
  if (diff < 3600) {
    return t('timeago.minutesAgo', { count: Math.floor(diff / 60) })
  }

  // 24小时内 -> X小时前
  if (diff < 3600 * 24) {
    return t('timeago.hoursAgo', { count: Math.floor(diff / 3600) })
  }

  // 7天内 -> X天前
  if (diff < 3600 * 24 * 7) {
    return t('timeago.daysAgo', { count: Math.floor(diff / (3600 * 24)) })
  }

  // 30天内 -> X周前 (粗略计算)
  if (diff < 3600 * 24 * 30) {
    return t('timeago.weeksAgo', { count: Math.floor(diff / (3600 * 24 * 7)) })
  }

  // 365天内 -> X月前 (粗略计算，按30天)
  if (diff < 3600 * 24 * 365) {
    return t('timeago.monthsAgo', { count: Math.floor(diff / (3600 * 24 * 30)) })
  }

  // 超过1年 -> X年前
  return t('timeago.yearsAgo', { count: Math.floor(diff / (3600 * 24 * 365)) })
}

// --- 2. Vue Hook (响应式封装，带自动刷新) ---

/**
 * 响应式“多久之前”
 * @param date 目标时间
 * @param updateInterval 自动刷新间隔(毫秒)，默认 30秒
 */
export function useTimeAgo(date: MaybeRef<DateInput>, updateInterval: number = 30000): ComputedRef<string> {
  // 1. 用于触发重算的信号量
  const tick = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null

  // 2. 启动定时器
  const startTimer = () => {
    stopTimer()
    timer = setInterval(() => {
      tick.value++
    }, updateInterval)
  }

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  // 3. 生命周期管理
  onMounted(() => startTimer())
  onUnmounted(() => stopTimer())

  // 4. 返回计算属性
  return computed(() => {
    // 依赖 tick，这样每当 tick 变化，这里就会重新计算
    tick.value
    return formatTimeAgo(unref(date))
  })
}
