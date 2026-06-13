<template>
  <view class="see-watermark" :class="rootClasses" :style="rootStyle">
    <slot />
    <view v-if="hasContent" class="see-watermark__layer" :style="layerStyle">
      <view v-for="(_, idx) in cells" :key="idx" class="see-watermark__cell" :style="cellStyle">
        <text v-for="(line, i) in contentLines" :key="i" class="see-watermark__text" :style="textStyle">{{ line }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * Watermark 水印
 * @description 在子内容上叠加平铺的文字水印，用于版权、防截图、品牌标识。
 * @tutorial https://www.seeuui.cn/components/watermark/
 *
 * @property {String | Array} content     水印文字，数组为多行
 * @property {Array}          gap         水印间距 [x, y]（rpx）
 * @property {Array}          offset      起始偏移 [x, y]（rpx）
 * @property {Number|String}  rotate      旋转角度（deg），默认 -22
 * @property {Number|String}  fontSize    字号（数值默认 rpx）
 * @property {String}         fontColor   字色
 * @property {String|Number}  fontWeight  字重
 * @property {String}         fontFamily  字体
 * @property {Number}         zIndex      层级
 * @property {Boolean}        fullScreen  是否全屏 fixed 覆盖
 * @property {Number|String}  width       容器宽度
 * @property {Number|String}  height      容器高度
 */
import { computed } from 'vue'
import type { SeeWatermarkProps } from './type'

defineOptions({ name: 'SeeWatermark' })

const props = withDefaults(defineProps<SeeWatermarkProps>(), {
  content: '',
  gap: () => [80, 80],
  offset: () => [0, 0],
  rotate: -22,
  fontSize: 28,
  fontColor: 'rgba(0, 0, 0, 0.15)',
  fontWeight: 'normal',
  fontFamily: 'inherit',
  zIndex: 9,
  fullScreen: false,
  width: '',
  height: ''
})

const toUnit = (v: number | string): string => {
  if (v === '' || v === undefined || v === null) return ''
  return typeof v === 'number' ? `${v}rpx` : String(v)
}

const toNum = (v: number | string): number => {
  if (typeof v === 'number') return v
  const n = parseFloat(v)
  return Number.isNaN(n) ? 0 : n
}

/** 内容是否非空 */
const hasContent = computed(() => {
  const c = props.content
  if (Array.isArray(c)) return c.some((line) => String(line).length > 0)
  return String(c).length > 0
})

/** 多行内容 */
const contentLines = computed<string[]>(() => {
  const c = props.content
  if (Array.isArray(c)) return c
  return [String(c)]
})

/** 水印文字样式 */
const textStyle = computed(() => ({
  fontSize: toUnit(props.fontSize),
  color: props.fontColor,
  fontWeight: String(props.fontWeight),
  fontFamily: props.fontFamily
}))

// ==================== 动态格子计算 ====================

/** 估算单个格子的宽高（rpx） */
function estimateCellSize() {
  const lines = contentLines.value
  const fontSizeNum = toNum(props.fontSize)
  const lineHeight = 1.4

  // 取最长行估算宽度。中文字符 ≈ 1em，拉丁字符 ≈ 0.55em，取 0.6 作为保守混合值
  const maxLineLen = Math.max(...lines.map((l) => l.length), 1)
  const charWidthRatio = 0.6
  const textBlockWidth = maxLineLen * fontSizeNum * charWidthRatio
  const textBlockHeight = lines.length * fontSizeNum * lineHeight

  const gapX = toNum(props.gap[0])
  const gapY = toNum(props.gap[1])

  return {
    cellWidth: textBlockWidth + gapX,
    cellHeight: textBlockHeight + gapY
  }
}

/** 计算需要多少个格子才能铺满容器（含旋转膨胀） */
function calcCellCount(): number {
  const { cellWidth, cellHeight } = estimateCellSize()

  // --- 容器尺寸（rpx）---
  // uni-app 中 750rpx ≡ 屏幕宽度，因此全屏时：
  //   宽 = 750 rpx，高 = 750 × (screenHeight / screenWidth)
  let containerW = 750
  let containerH = 750 * 1.5 // 默认长宽比

  // #ifdef H5
  try {
    if (typeof window !== 'undefined' && window.innerWidth > 0) {
      if (props.fullScreen) {
        containerW = 750
        containerH = 750 * (window.innerHeight / window.innerWidth)
      }
    }
  } catch {
    /* 非浏览器环境 */
  }
  // #endif

  // #ifndef H5
  try {
    const info = uni.getSystemInfoSync()
    if (info && info.windowWidth > 0) {
      if (props.fullScreen) {
        containerW = 750
        containerH = 750 * (info.windowHeight / info.windowWidth)
      }
    }
  } catch {
    /* 回退到默认值 */
  }
  // #endif

  // --- 旋转膨胀 ---
  const deg = Math.abs(toNum(props.rotate))
  const rad = (deg * Math.PI) / 180
  const cw = cellWidth
  const ch = cellHeight
  // 旋转后外接矩形尺寸
  const effW = Math.abs(cw * Math.cos(rad)) + Math.abs(ch * Math.sin(rad))
  const effH = Math.abs(cw * Math.sin(rad)) + Math.abs(ch * Math.cos(rad))

  // --- 行列数 ---
  const cols = Math.max(1, Math.ceil(containerW / Math.max(effW, 1)))
  const rows = Math.ceil(containerH / Math.max(effH, 1)) + 3 // +3 行冗余覆盖旋转溢出

  // 保底 100，上限 2000 防止极端参数导致 DOM 爆炸
  return Math.min(2000, Math.max(100, cols * rows))
}

/** 平铺格子数：根据视口/容器尺寸动态计算 */
const cells = computed(() => {
  if (!hasContent.value) return []
  return Array.from({ length: calcCellCount() })
})

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  const w = toUnit(props.width)
  const h = toUnit(props.height)
  if (w) style.width = w
  if (h) style.height = h
  return style
})

const rootClasses = computed(() => ({
  'see-watermark--fullscreen': props.fullScreen
}))

/** 水印层（绝对定位） */
const layerStyle = computed(() => ({
  zIndex: String(props.zIndex),
  paddingLeft: toUnit(props.offset[0]),
  paddingTop: toUnit(props.offset[1])
}))

/** 单个水印格子（控制间距） */
const cellStyle = computed(() => ({
  marginRight: toUnit(props.gap[0]),
  marginBottom: toUnit(props.gap[1]),
  transform: `rotate(${props.rotate}deg)`
}))
</script>

<style lang="scss" scoped>
.see-watermark {
  position: relative;
  display: block;
  width: 100%;
  box-sizing: border-box;

  &--fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &__layer {
    position: absolute;
    inset: 0;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
  }

  &__cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    line-height: 1.4;
    white-space: nowrap;
  }

  &__text {
    display: block;
    line-height: 1.4;
    white-space: nowrap;
    text-align: center;
  }
}
</style>
