<template>
  <view class="see-scratch-card" :class="rootClasses" :style="rootStyle">
    <!-- 底部奖品内容 -->
    <view class="see-scratch-card__prize">
      <slot />
    </view>
    <!-- 顶部刮层 Canvas -->
    <!-- #ifdef H5 -->
    <!-- H5 端事件通过 JS addEventListener 绑定到 wrapper，模板不绑定 -->
    <canvas :id="resolvedCanvasId" class="see-scratch-card__canvas" :disable-scroll="true" />
    <!-- #endif -->
    <!-- #ifndef H5 -->
    <canvas
      :id="resolvedCanvasId"
      class="see-scratch-card__canvas"
      :canvas-id="resolvedCanvasId"
      :disable-scroll="true"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    />
    <!-- #endif -->
  </view>
</template>

<script lang="ts" setup>
/**
 * ScratchCard 刮刮卡
 * @description Canvas 实现的刮刮卡组件，支持触摸和鼠标操作。模拟真实刮刮卡涂层效果，达到阈值自动揭晓奖品。
 * @tutorial https://www.seeuui.cn/components/scratch-card/
 *
 * @property {Number|String} width            宽度（数值默认 rpx）
 * @property {Number|String} height           高度（数值默认 rpx）
 * @property {String}        coverColor       覆盖层纯色（默认银色 #c8c8c8）
 * @property {String}        coverImage       覆盖图片地址（优先于 coverColor）
 * @property {String}        coverText        覆盖层文字（默认 "刮一刮"）
 * @property {String}        coverTextColor   覆盖层文字颜色
 * @property {Number}        coverTextSize    覆盖层文字字号（rpx）
 * @property {Number}        brushSize        笔刷半径（rpx）
 * @property {Number}        threshold        揭晓阈值百分比（0-100）
 * @property {Boolean}       isDisabled       是否禁用
 * @property {Boolean}       autoReveal       达到阈值是否自动揭晓
 * @property {String}        canvasId         Canvas ID
 *
 * @event {Function} onStart      第一次开始刮
 * @event {Function} onProgress   刮开进度变化（百分比）
 * @event {Function} onComplete   达到阈值
 */
import { ref, computed, onMounted, onBeforeUnmount, getCurrentInstance, nextTick } from 'vue'
import { useI18n } from '../../locale'
import type { SeeScratchCardProps } from './type'

defineOptions({ name: 'SeeScratchCard' })

const { t } = useI18n()

const props = withDefaults(defineProps<SeeScratchCardProps>(), {
  width: 600,
  height: 300,
  coverColor: '#b8b8b8',
  coverImage: '',
  coverText: '',
  coverTextColor: '#ffffff',
  coverTextSize: 40,
  brushSize: 40,
  threshold: 60,
  isDisabled: false,
  autoReveal: true,
  canvasId: ''
})

/** 覆盖层文字（支持 i18n 回退） */
const displayCoverText = computed(() => props.coverText || t('scratchCard.coverText'))

const emit = defineEmits<{
  (e: 'onStart'): void
  (e: 'onProgress', percent: number): void
  (e: 'onComplete', percent: number): void
}>()

/** ---------- 工具函数 ---------- */
const toUnit = (v: number | string): string => (typeof v === 'number' ? `${v}rpx` : String(v))

/** 生成唯一 canvas-id */
let __scratchUid = 0
/** 获取当前时间戳（ms），兼容各平台 */
const getNow = (): number => {
  // #ifdef H5
  if (typeof performance !== 'undefined' && performance.now) return performance.now()
  // #endif
  return Date.now()
}
const fallbackId = `see-scratch-card-${++__scratchUid}-${Math.floor(getNow()) % 100000}`
const resolvedCanvasId = computed(() => props.canvasId || fallbackId)

/** ---------- refs ---------- */
const isRevealed = ref(false)
const hasStarted = ref(false)
const progress = ref(0)
/** canvas 上下文（H5 是 CanvasRenderingContext2D，小程序是 UniCanvasContext） */
let ctx: any = null
/** uni-app canvas wrapper DOM（仅 H5 用，即 document.getElementById 拿到的容器） */
let wrapperEl: HTMLElement | null = null
/** 真正的 <canvas> DOM 元素（仅 H5 用，wrapper 的子节点） */
let canvasEl: HTMLCanvasElement | null = null
/** canvas 实际像素尺寸 */
let canvasPxWidth = 0
let canvasPxHeight = 0
/** 设备像素比，用于触摸坐标换算 */
let dpr = 1
/** canvas 元素相对视口的位置（实时更新） */
let canvasRect: { top: number; left: number; width: number; height: number } = { top: 0, left: 0, width: 0, height: 0 }
/** 是否正在按下 */
let isPressing = false
/** 是否触摸事件触发的（用于防止 touch + mouse 双重触发） */
let isTouchActive = false
/** coverImage 对象（H5 用）*/
let coverImageEl: HTMLImageElement | null = null
/** coverImage 是否已加载完毕 */
let coverImageLoaded = false

const instance = getCurrentInstance()

/** ---------- 计算样式 / 类 ---------- */
const rootClasses = computed(() => ({
  'see-scratch-card--disabled': props.isDisabled,
  'see-scratch-card--revealed': isRevealed.value
}))

const rootStyle = computed(() => ({
  width: toUnit(props.width),
  height: toUnit(props.height)
}))

/** ---------- rpx -> px 换算 ---------- */
let rpxRatio = 0.5
function refreshRpxRatio() {
  try {
    const info = uni.getSystemInfoSync()
    if (info && info.windowWidth) {
      rpxRatio = info.windowWidth / 750
    }
  } catch {
    rpxRatio = 0.5
  }
}
const rpx2px = (v: number) => v * rpxRatio

/** ---------- 实时获取 canvas 在视口中的位置 ---------- */
function refreshCanvasRect() {
  // #ifdef H5
  // 用真正的 canvasEl 的位置做坐标基准（因为 canvas 可能在 wrapper 内有偏移）
  if (canvasEl) {
    const rect = canvasEl.getBoundingClientRect()
    canvasRect = { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
  } else if (wrapperEl) {
    const rect = wrapperEl.getBoundingClientRect()
    canvasRect = { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
  }
  // #endif
}

/** ---------- 初始化 canvas ---------- */
async function initCanvas() {
  refreshRpxRatio()
  await nextTick()

  // 从 props 计算 CSS 像素尺寸（不依赖 DOM 测量，避免布局未完成时拿到 0）
  const cssW = typeof props.width === 'number' ? rpx2px(props.width) : parseFloat(String(props.width)) || 300
  const cssH = typeof props.height === 'number' ? rpx2px(props.height) : parseFloat(String(props.height)) || 150

  // #ifdef H5
  try {
    const id = resolvedCanvasId.value
    wrapperEl = document.getElementById(id) as HTMLElement | null
    if (!wrapperEl) {
      console.warn('[SeeScratchCard] canvas wrapper 未找到，id:', id)
      return
    }

    // uni-app H5 中 <canvas> 组件渲染为包装元素，真正的 <canvas> 在其内部
    if (wrapperEl.tagName === 'CANVAS') {
      canvasEl = wrapperEl as HTMLCanvasElement
    } else {
      const findCanvas = (el: Element): HTMLCanvasElement | null => {
        if (el.tagName === 'CANVAS') return el as HTMLCanvasElement
        for (const child of el.children) {
          const found = findCanvas(child)
          if (found) return found
        }
        return null
      }
      canvasEl = findCanvas(wrapperEl)
    }

    if (!canvasEl || typeof canvasEl.getContext !== 'function') {
      console.warn('[SeeScratchCard] 未找到真正的 <canvas>，wrapper tagName:', wrapperEl.tagName)
      return
    }

    dpr = (window as any).devicePixelRatio || 1

    // ===== 核心策略：不动 canvas CSS，让它自然显示，我反过来适应它 =====
    // uni-app 可能给内部 canvas 设了 CSS 宽高（基于 rpx），不去覆盖，直接读实际值
    const wrapperRect = wrapperEl.getBoundingClientRect()
    const canvasDisplayRect = canvasEl.getBoundingClientRect()
    console.log('[SeeScratchCard] === 尺寸诊断 ===')
    console.log('  props width/height:', props.width, props.height)
    console.log('  cssW/cssH (rpx→px):', cssW, cssH)
    console.log('  dpr:', dpr)
    console.log('  wrapperEl rect:', JSON.stringify(wrapperRect))
    console.log('  canvasEl 实际 rect:', JSON.stringify(canvasDisplayRect))
    console.log('  canvasEl 默认 width/height:', canvasEl.width, canvasEl.height)

    // 用 canvas 自身的显示尺寸做基准（不是 wrapper！）
    const displayW = canvasDisplayRect.width > 0 ? canvasDisplayRect.width : cssW
    const displayH = canvasDisplayRect.height > 0 ? canvasDisplayRect.height : cssH
    console.log('  画布实际显示尺寸:', displayW, displayH)

    // 像素缓冲区 = canvas 实际显示尺寸 × dpr
    canvasPxWidth = Math.max(1, Math.floor(displayW * dpr))
    canvasPxHeight = Math.max(1, Math.floor(displayH * dpr))
    canvasEl.width = canvasPxWidth
    canvasEl.height = canvasPxHeight
    console.log('  像素缓冲区:', canvasPxWidth, canvasPxHeight)

    // === 无变换！原生像素坐标 ===
    // fillRect(0,0, canvasPxWidth,canvasPxHeight) = 恰好填满
    // 触摸坐标: CSS px → 原生 px = css * (canvasPxWidth / displayW) = css * dpr
    ctx = canvasEl.getContext('2d')
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
    }
    console.log('  变换: identity (原生像素坐标)')

    // 坐标基准 = canvas 自身
    canvasRect = canvasEl.getBoundingClientRect()
    console.log('  最终 canvasRect:', JSON.stringify(canvasRect))
    console.log('[SeeScratchCard] === 诊断结束 ===')

    // ----- H5 事件：全部通过 JS 绑定到 wrapper（模板不绑事件） -----
    wrapperEl.addEventListener('touchstart', onTouchStart, { passive: false })
    wrapperEl.addEventListener('touchmove', onTouchMove, { passive: false })
    wrapperEl.addEventListener('touchend', onTouchEnd)
    wrapperEl.addEventListener('mousedown', onMouseDown)
    wrapperEl.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    // 预加载 coverImage
    if (props.coverImage) {
      await loadCoverImage()
    }

    drawCover()
  } catch (err) {
    console.error('[SeeScratchCard] H5 canvas 初始化失败:', err)
  }
  // #endif

  // #ifndef H5
  try {
    // @ts-expect-error 小程序平台使用 uni.createCanvasContext
    ctx = uni.createCanvasContext(resolvedCanvasId.value, instance?.proxy)
    canvasPxWidth = cssW
    canvasPxHeight = cssH

    drawCover()

    // 获取节点位置（用于触摸坐标换算）
    const query = uni.createSelectorQuery().in(instance?.proxy as any)
    query
      .select('.see-scratch-card__canvas')
      .boundingClientRect((res: any) => {
        if (res) {
          canvasRect = { top: res.top || 0, left: res.left || 0, width: res.width || canvasPxWidth, height: res.height || canvasPxHeight }
        }
      })
      .exec()
  } catch (err) {
    console.error('[SeeScratchCard] 小程序 canvas 初始化失败:', err)
  }
  // #endif
}

/** ---------- 加载 coverImage（H5）---------- */
async function loadCoverImage(): Promise<void> {
  // #ifdef H5
  if (typeof Image !== 'undefined') {
    return new Promise((resolve) => {
      coverImageEl = new Image()
      coverImageEl.crossOrigin = 'anonymous'
      coverImageEl.onload = () => {
        coverImageLoaded = true
        resolve()
      }
      coverImageEl.onerror = () => {
        coverImageLoaded = false
        resolve()
      }
      coverImageEl.src = props.coverImage
    })
  }
  // #endif
  coverImageLoaded = true
}

/** ---------- 绘制覆盖层 ---------- */
function drawCover() {
  if (!ctx) return
  const w = canvasPxWidth
  const h = canvasPxHeight

  // 填充基础涂层（浅灰银色）
  try {
    setFillStyle(props.coverColor)
    ctx.fillRect(0, 0, w, h)
  } catch {
    /* noop */
  }

  // 绘制顶部光泽（模拟涂层反光）
  drawGloss(w, h)

  // 绘制颗粒纹理（模拟真实刮刮卡银色涂层）
  drawTexture(w, h)

  // 绘制覆盖图片
  if (props.coverImage && coverImageLoaded) {
    drawCoverImageLayer(w, h)
  }

  // 绘制文字
  drawCoverText(w, h)

  // 绘制引导线（虚线框提示用户刮开）
  drawGuideLine(w, h)

  // 小程序需要 draw 提交
  if (typeof ctx.draw === 'function') ctx.draw()
}

/** ---------- 绘制顶部光泽 ---------- */
function drawGloss(w: number, h: number) {
  if (!ctx) return
  try {
    const gradient = ctx.createLinearGradient(0, 0, 0, h * 0.45)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.18)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.04)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h * 0.45)
  } catch {
    /* noop */
  }
}

/** ---------- 绘制颗粒纹理 ---------- */
function drawTexture(w: number, h: number) {
  if (!ctx) return
  try {
    // 用随机半透明小圆点模拟银色涂层颗粒感
    const dotCount = Math.floor((w * h) / 800) // 控制密度
    for (let i = 0; i < dotCount; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const r = 0.5 + Math.random() * 1.2
      const alpha = 0.03 + Math.random() * 0.06
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()

      // 随机加入一些高光白点
      if (Math.random() < 0.3) {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.02 + Math.random() * 0.04})`
        ctx.beginPath()
        ctx.arc(x + Math.random() * 2, y + Math.random() * 2, r * 0.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  } catch {
    /* noop */
  }
}

/** ---------- 绘制覆盖图片层 ---------- */
function drawCoverImageLayer(w: number, h: number) {
  // #ifdef H5
  if (!ctx || !coverImageEl || !coverImageLoaded) return
  try {
    // 先绘制图片
    ctx.globalAlpha = 0.7
    ctx.drawImage(coverImageEl, 0, 0, w, h)
    ctx.globalAlpha = 1
  } catch {
    /* noop */
  }
  // #endif
  // #ifndef H5
  if (!ctx) return
  try {
    ctx.drawImage(props.coverImage, 0, 0, w, h)
  } catch {
    /* noop */
  }
  // #endif
}

/** ---------- 绘制覆盖层文字 ---------- */
function drawCoverText(w: number, h: number) {
  if (!ctx || !displayCoverText.value) return
  // identity 变换：fontSize 单位是原生像素
  const fontSizePx = rpx2px(props.coverTextSize) * dpr
  try {
    ctx.font = `bold ${fontSizePx}px "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // 阴影
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
    ctx.fillText(displayCoverText.value, w / 2 + dpr, h / 2 + dpr)

    // 主文字
    setFillStyle(props.coverTextColor)
    ctx.fillText(displayCoverText.value, w / 2, h / 2)
  } catch {
    /* noop */
  }
}

/** ---------- 绘制四角引导标记 ---------- */
function drawGuideLine(w: number, h: number) {
  if (!ctx) return
  const pad = rpx2px(20) * dpr
  const len = rpx2px(14) * dpr

  try {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
    ctx.lineWidth = 1.5 * dpr
    ctx.lineCap = 'round'

    const drawCorner = (x: number, y: number, dx: number, dy: number) => {
      ctx.beginPath()
      ctx.moveTo(x + dx * len, y)
      ctx.lineTo(x, y)
      ctx.lineTo(x, y + dy * len)
      ctx.stroke()
    }

    // 四个角的 L 形标记
    drawCorner(pad, pad, 1, 1)
    drawCorner(w - pad, pad, -1, 1)
    drawCorner(pad, h - pad, 1, -1)
    drawCorner(w - pad, h - pad, -1, -1)
  } catch {
    /* noop */
  }
}

/** ---------- 兼容 setFillStyle ---------- */
function setFillStyle(color: string) {
  if (!ctx) return
  try {
    ctx.fillStyle = color
    if (typeof ctx.setFillStyle === 'function') ctx.setFillStyle(color)
  } catch {
    /* noop */
  }
}

/** ---------- 通用坐标获取（兼容 touch 和 mouse）---------- */
function getTouchPoint(e: any): { x: number; y: number } | null {
  // Touch 事件
  const t = e.touches && e.touches[0]
  if (t) {
    const x = (t.clientX ?? t.pageX ?? 0) - canvasRect.left
    const y = (t.clientY ?? t.pageY ?? 0) - canvasRect.top
    return { x, y }
  }

  // Mouse 事件
  if (e.clientX !== undefined) {
    const x = e.clientX - canvasRect.left
    const y = e.clientY - canvasRect.top
    return { x, y }
  }

  // pageX/pageY 兜底
  if (e.pageX !== undefined) {
    const x = e.pageX - canvasRect.left - (window?.pageXOffset || 0)
    const y = e.pageY - canvasRect.top - (window?.pageYOffset || 0)
    return { x, y }
  }

  return null
}

/** ---------- 擦除覆盖层（px, py 为 CSS 像素坐标，内部换算为原生像素）---------- */
function eraseAt(cssX: number, cssY: number) {
  if (!ctx) return
  // identity 变换：绘图坐标系 = 原生像素，需要把 CSS 坐标换算过来
  const scaleX = canvasPxWidth / (canvasRect.width || 1)
  const scaleY = canvasPxHeight / (canvasRect.height || 1)
  const nativeX = cssX * scaleX
  const nativeY = cssY * scaleY
  const nativeR = rpx2px(props.brushSize) * ((scaleX + scaleY) / 2)
  try {
    ctx.globalCompositeOperation = 'destination-out'
  } catch {
    /* noop */
  }
  ctx.beginPath()
  ctx.arc(nativeX, nativeY, nativeR, 0, Math.PI * 2)
  ctx.fill()
  if (typeof ctx.draw === 'function') ctx.draw(true)
}

/** ---------- 触摸事件处理 ---------- */
let __debugTouchCount = 0
function startErase(e: any) {
  if (props.isDisabled || isRevealed.value) return
  isPressing = true

  // 刷新 canvas 位置（防止布局变化）
  refreshCanvasRect()

  if (!hasStarted.value) {
    hasStarted.value = true
    emit('onStart')
  }
  const p = getTouchPoint(e)
  if (p) {
    // 诊断：打印前 5 次触摸坐标
    if (__debugTouchCount < 5) {
      __debugTouchCount++
      const t = e.touches?.[0] || e
      const sX = canvasPxWidth / (canvasRect.width || 1)
      const sY = canvasPxHeight / (canvasRect.height || 1)
      console.log(
        '[SeeScratchCard] 触摸 #' + __debugTouchCount,
        '| clientX/Y:',
        t.clientX ?? 'N/A',
        t.clientY ?? 'N/A',
        '| canvasRect:',
        canvasRect.left.toFixed(1),
        canvasRect.top.toFixed(1),
        canvasRect.width.toFixed(1),
        canvasRect.height.toFixed(1),
        '| css→',
        p.x.toFixed(1),
        p.y.toFixed(1),
        '| ×scale',
        sX.toFixed(1),
        sY.toFixed(1),
        '| →native',
        (p.x * sX).toFixed(1),
        (p.y * sY).toFixed(1),
        '| pxBuf:',
        canvasPxWidth,
        canvasPxHeight
      )
    }
    eraseAt(p.x, p.y)
  }
}

function moveErase(e: any) {
  if (props.isDisabled || isRevealed.value || !isPressing) return
  const p = getTouchPoint(e)
  if (p) {
    eraseAt(p.x, p.y)
    // 在两个连续点之间插值，使线条更流畅
    scheduleProgressCheck()
  }
}

function endErase() {
  if (props.isDisabled) return
  isPressing = false
  isTouchActive = false
  void checkProgress()
}

function onTouchStart(e: any) {
  isTouchActive = true
  // H5 端阻止默认行为，防止生成后续的 mouse 事件
  // #ifdef H5
  if (e.preventDefault) e.preventDefault()
  // #endif
  startErase(e)
}

function onTouchMove(e: any) {
  if (!isTouchActive) return
  moveErase(e)
}

function onTouchEnd() {
  endErase()
}

/** ---------- H5 鼠标事件处理 ---------- */
function onMouseDown(e: MouseEvent) {
  // 如果已有触摸事件在处理中，忽略鼠标事件
  if (isTouchActive) return
  startErase(e)
}

function onMouseMove(e: MouseEvent) {
  if (isTouchActive || !isPressing) return
  moveErase(e)
}

function onMouseUp() {
  if (isTouchActive) return
  endErase()
}

/** ---------- 进度检测 ---------- */
let lastProgressCheck = 0
function scheduleProgressCheck() {
  const now = getNow()
  if (now - lastProgressCheck < 80) return
  lastProgressCheck = now
  void checkProgress()
}

async function checkProgress() {
  if (!ctx || isRevealed.value) return
  let percent = 0

  // #ifdef H5
  try {
    if (canvasEl && ctx.getImageData) {
      const imageData = ctx.getImageData(0, 0, canvasPxWidth, canvasPxHeight)
      const data = imageData.data
      let cleared = 0
      // 抽样：每 16 像素取一个 alpha 值
      const step = 4 * 16
      const sampleCount = Math.ceil(data.length / step)
      for (let i = 3; i < data.length; i += step) {
        if (data[i] === 0) cleared++
      }
      percent = Math.round((cleared / sampleCount) * 100)
    }
  } catch {
    /* noop */
  }
  // #endif

  // #ifndef H5
  // 小程序无法可靠采样像素，使用单调递增近似
  percent = Math.min(100, progress.value + 5)
  // #endif

  if (percent !== progress.value) {
    progress.value = percent
    emit('onProgress', percent)
  }
  if (percent >= props.threshold && !isRevealed.value) {
    emit('onComplete', percent)
    if (props.autoReveal) {
      doClearAll()
      isRevealed.value = true
    }
  }
}

/** ---------- 清除全部覆盖层 ---------- */
function doClearAll() {
  if (!ctx) return
  try {
    ctx.globalCompositeOperation = 'destination-out'
  } catch {
    /* noop */
  }
  ctx.fillRect(0, 0, canvasPxWidth, canvasPxHeight)
  if (typeof ctx.clearRect === 'function') {
    try {
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, canvasPxWidth, canvasPxHeight)
    } catch {
      /* noop */
    }
  }
  if (typeof ctx.draw === 'function') ctx.draw()
}

/** ---------- 暴露方法 ---------- */
function reveal() {
  if (isRevealed.value) return
  if (ctx) doClearAll()
  isRevealed.value = true
  progress.value = 100
  emit('onProgress', 100)
  emit('onComplete', 100)
}

function reset() {
  isRevealed.value = false
  hasStarted.value = false
  progress.value = 0
  isPressing = false
  isTouchActive = false
  if (ctx) {
    try {
      ctx.globalCompositeOperation = 'source-over'
    } catch {
      /* noop */
    }
    drawCover()
  }
}

defineExpose({
  reveal,
  reset,
  getProgress: () => progress.value
})

onMounted(() => {
  void initCanvas()
})

onBeforeUnmount(() => {
  // #ifdef H5
  if (wrapperEl) {
    wrapperEl.removeEventListener('touchstart', onTouchStart)
    wrapperEl.removeEventListener('touchmove', onTouchMove)
    wrapperEl.removeEventListener('touchend', onTouchEnd)
    wrapperEl.removeEventListener('mousedown', onMouseDown)
    wrapperEl.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }
  // #endif
  ctx = null
  canvasEl = null
  wrapperEl = null
  coverImageEl = null
})
</script>

<style lang="scss" scoped>
.see-scratch-card {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 24rpx;
  background-color: var(--see-bg-color, #fff);
  box-sizing: border-box;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.06);

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
    filter: grayscale(0.4);
  }

  &--revealed {
    .see-scratch-card__canvas {
      opacity: 0;
      transition: opacity 0.5s ease-out;
      pointer-events: none;
    }
  }

  &__prize {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    background: linear-gradient(135deg, #fdf6f0, #fff8f5);
    border-radius: inherit;
    padding: 24rpx;
    box-sizing: border-box;
  }

  &__canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    touch-action: none;
    border-radius: inherit;
  }
}
</style>
