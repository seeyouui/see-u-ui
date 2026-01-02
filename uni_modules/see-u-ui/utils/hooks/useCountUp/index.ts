import { ref, onBeforeUnmount } from 'vue'

export interface CountUpConfig {
  duration?: number
  animateDuration?: number
  decimals?: number
  thousand?: boolean
}

export interface RenderItem {
  type: 'num' | 'char'
  value: number | string
  animate: boolean
}

export function useCountUp(config: CountUpConfig = {}) {
  const defaultConfig = {
    duration: 300,
    animateDuration: 1000,
    decimals: 2,
    thousand: true,
    ...config
  }

  const currentValue = ref(0)
  const renderList = ref<RenderItem[]>([])
  const countUpTimer = ref<any>(null)

  /**
   * 格式化数字字符串
   */
  const formatNumber = (val: number, mode: 'text' | 'price' = 'text', formatCurrency?: (val: number | string) => string): string => {
    if (mode === 'price' && formatCurrency) {
      return formatCurrency(val)
    }

    let numStr = Number(val).toFixed(defaultConfig.decimals)

    if (defaultConfig.thousand) {
      const [intPart, decPart] = numStr.split('.')
      numStr = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (decPart ? '.' + decPart : '')
    }

    return numStr
  }

  /**
   * 更新渲染列表
   */
  const updateRender = (val: number, mode: 'text' | 'price' = 'text', formatCurrency?: (val: number | string) => string) => {
    const numStr = formatNumber(val, mode, formatCurrency)
    const chars = numStr.split('')
    const newList: RenderItem[] = []

    chars.forEach((ch, index) => {
      const oldItem = renderList.value[index]

      if (/\d/.test(ch)) {
        const newVal = Number(ch)

        if (oldItem && oldItem.type === 'num' && oldItem.value === newVal) {
          // 没变化：不动画
          newList.push({
            ...oldItem,
            animate: false
          })
        } else {
          // 变化：才滚动
          newList.push({
            type: 'num',
            value: newVal,
            animate: true
          })
        }
      } else {
        // 非数字
        newList.push({
          type: 'char',
          value: ch,
          animate: false
        })
      }
    })

    renderList.value = newList
  }

  /**
   * 启动递增动画
   */
  const startCount = (target: number, mode: 'text' | 'price' = 'text', formatCurrency?: (val: number | string) => string) => {
    if (countUpTimer.value) {
      clearInterval(countUpTimer.value)
    }

    const start = currentValue.value || 0
    const end = target
    const frameTime = 16
    const steps = Math.max(1, Math.floor(defaultConfig.animateDuration / frameTime))
    const stepValue = (end - start) / steps

    let current = start
    let count = 0

    countUpTimer.value = setInterval(() => {
      count++
      current += stepValue

      if (count >= steps) {
        current = end
        clearInterval(countUpTimer.value)
      }

      currentValue.value = current
      updateRender(current, mode, formatCurrency)
    }, frameTime)
  }

  /**
   * 停止计数动画
   */
  const stopCount = () => {
    if (countUpTimer.value) {
      clearInterval(countUpTimer.value)
      countUpTimer.value = null
    }
  }

  /**
   * 重置计数
   */
  const resetCount = () => {
    stopCount()
    currentValue.value = 0
    renderList.value = []
  }

  // 组件卸载时清理定时器
  onBeforeUnmount(() => {
    stopCount()
  })

  return {
    currentValue,
    renderList,
    startCount,
    stopCount,
    resetCount,
    config: defaultConfig
  }
}
