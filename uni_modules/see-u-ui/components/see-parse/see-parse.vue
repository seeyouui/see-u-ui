<template>
  <view v-if="hasContent || props.emptyText" :class="rootClass" :style="rootStyle" @click="onContainerClick">
    <!-- 空内容占位 -->
    <view v-if="!hasContent && props.emptyText" class="see-parse__empty">
      <text>{{ props.emptyText }}</text>
    </view>

    <!-- #ifdef H5 -->
    <!-- H5: 直接 v-html，配合事件委托捕获图片/链接点击 -->
    <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component, vue/attributes-order -->
    <view v-if="hasContent" ref="richRef" class="see-parse__rich see-parse__rich--h5" @click="onRichClick" v-html="safeHtml"></view>
    <!-- #endif -->

    <!-- #ifndef H5 -->
    <!-- 非 H5（App / 各家小程序）: 使用 rich-text 渲染解析后的 nodes -->
    <rich-text
      v-if="hasContent"
      class="see-parse__rich see-parse__rich--native"
      :nodes="parsedNodes"
      :selectable="props.selectable"
      :space="props.space || 'nbsp'"
      @itemclick="onItemClick"
    ></rich-text>
    <!-- #endif -->
  </view>
</template>

<script lang="ts" setup>
/**
 * Parse 富文本解析器
 * @description 跨平台 HTML 富文本解析与渲染组件。内置 XSS 安全过滤、图片预览、链接拦截、tagStyle 注入。
 *              在 H5 平台使用 v-html 直接渲染（更高保真）；在 App / 小程序使用 rich-text + parsed nodes。
 * @tutorial https://www.seeuui.cn/components/parse/
 *
 * @property {String}                       content         富文本 HTML 字符串
 * @property {Object}                       tagStyle        标签级样式注入 { p: 'color: red', img: 'max-width: 100%' }
 * @property {Boolean}                      selectable      文本是否可选中（rich-text 平台生效），默认 false
 * @property {Boolean}                      previewImage    是否启用图片点击预览，默认 true
 * @property {String[]}                     imageUrls       自定义预览图片列表；不传则从 content 自动收集
 * @property {String}                       emptyText       空内容占位文本
 * @property {Boolean}                      lazyLoad        H5 模式下图片懒加载
 * @property {Boolean}                      preserveNewline 是否把 \n 转换为 <br>，默认 false
 * @property {String}                       containerClass  自定义根元素 class
 * @property {String | Object}              containerStyle  自定义根元素 style
 * @property {String}                       space           空格处理方式：'ensp' | 'emsp' | 'nbsp'，默认 'nbsp'
 * @property {String[]}                     allowedTags     自定义允许的标签白名单
 * @property {String[]}                     allowedAttrs    自定义允许的属性白名单
 *
 * @event {Function} onLoad     (nodes) 解析完成
 * @event {Function} onError    (err)  解析失败
 * @event {Function} onClick    (e) 点击富文本容器
 * @event {Function} onLinkTap  (href, e) 点击链接
 * @event {Function} onImgTap   (src, urls, e) 点击图片
 * @event {Function} onReady    挂载就绪
 */
import { computed, ref, watch, onMounted } from 'vue'
import { parseHtml, stripHtml, extractImgSrc, sanitizeHtml, type ParseNode } from '../../utils/hooks/useHtmlParser'

defineOptions({
  name: 'SeeParse'
})

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    content?: string
    tagStyle?: Record<string, string>
    selectable?: boolean
    previewImage?: boolean
    imageUrls?: string[]
    emptyText?: string
    lazyLoad?: boolean
    preserveNewline?: boolean
    containerClass?: string
    containerStyle?: string | Record<string, string | number>
    space?: '' | 'ensp' | 'emsp' | 'nbsp'
    allowedTags?: string[]
    allowedAttrs?: string[]
  }>(),
  {
    content: '',
    tagStyle: () => ({}),
    selectable: false,
    previewImage: true,
    imageUrls: undefined,
    emptyText: '',
    lazyLoad: false,
    preserveNewline: false,
    containerClass: '',
    containerStyle: '',
    space: '',
    allowedTags: undefined,
    allowedAttrs: undefined
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  (e: 'onLoad', nodes: ParseNode[]): void
  (e: 'onError', err: Error): void
  (e: 'onClick', event: any): void
  (e: 'onLinkTap', href: string, event: any): void
  (e: 'onImgTap', src: string, urls: string[], event: any): void
  (e: 'onReady'): void
}>()

/** ---------- 内部状态 ---------- */
const richRef = ref<any>(null)
/** 当前用于渲染的内容（可被 setContent 覆盖） */
const currentContent = ref<string>(props.content ?? '')

/** ---------- 计算属性 ---------- */
const hasContent = computed(() => {
  const c = currentContent.value
  return typeof c === 'string' && c.trim().length > 0
})

const rootClass = computed(() => {
  return ['see-parse', props.containerClass].filter(Boolean).join(' ')
})

const rootStyle = computed(() => props.containerStyle)

/** 预处理后的安全 HTML（含 \n → <br> 转换、危险标签剥离） */
const safeHtml = computed(() => {
  if (!hasContent.value) return ''
  try {
    let html = sanitizeHtml(currentContent.value)
    if (props.preserveNewline) {
      html = html.replace(/\n/g, '<br/>')
    }
    return html
  } catch (e) {
    emit('onError', e as Error)
    return ''
  }
})

/** 解析后的 nodes 数组（用于 rich-text） */
const parsedNodes = computed<ParseNode[]>(() => {
  if (!hasContent.value) return []
  try {
    let input = currentContent.value
    if (props.preserveNewline) {
      input = input.replace(/\n/g, '<br/>')
    }
    return parseHtml(input, {
      tagStyle: props.tagStyle,
      allowedTags: props.allowedTags,
      allowedAttrs: props.allowedAttrs
    })
  } catch (e) {
    emit('onError', e as Error)
    return []
  }
})

/** 自动收集图片 URL */
const autoImageUrls = computed(() => {
  if (!hasContent.value) return []
  return extractImgSrc(currentContent.value)
})

/** ---------- 监听 ---------- */
watch(
  () => props.content,
  (val) => {
    currentContent.value = val ?? ''
  }
)

// 监听解析结果，触发 onLoad（仅在有内容时）
watch(
  parsedNodes,
  (nodes) => {
    if (hasContent.value) {
      emit('onLoad', nodes)
    }
  },
  { immediate: true }
)

/** ---------- 事件处理 ---------- */
const onContainerClick = (e: any) => {
  emit('onClick', e)
}

// H5 事件委托：捕获 a / img 的点击
const onRichClick = (e: any) => {
  // #ifdef H5
  const target = e?.target as HTMLElement | null
  if (!target) return
  // 上溯找最近的 a 或 img
  let cur: HTMLElement | null = target
  while (cur && cur !== richRef.value) {
    const tag = cur.tagName?.toLowerCase()
    if (tag === 'a') {
      const href = cur.getAttribute('href') || ''
      emit('onLinkTap', href, e)
      // 阻止默认行为以便用户自定义跳转
      e.preventDefault?.()
      return
    }
    if (tag === 'img') {
      const src = (cur as HTMLImageElement).getAttribute('src') || ''
      const urls = getImageUrls()
      emit('onImgTap', src, urls, e)
      if (props.previewImage && src) {
        try {
          uni.previewImage({ current: src, urls: urls.length ? urls : [src] })
        } catch {
          // ignore
        }
      }
      return
    }
    cur = cur.parentElement
  }
  // #endif
}

// rich-text itemclick: 捕获节点点击（用于链接/图片识别）
const onItemClick = (e: any) => {
  const node = e?.detail?.node || e?.target
  if (!node) return
  const name = String(node.name || '').toLowerCase()
  if (name === 'a') {
    const href = node.attrs?.href || ''
    emit('onLinkTap', href, e)
  } else if (name === 'img') {
    const src = node.attrs?.src || ''
    const urls = getImageUrls()
    emit('onImgTap', src, urls, e)
    if (props.previewImage && src) {
      try {
        uni.previewImage({ current: src, urls: urls.length ? urls : [src] })
      } catch {
        // ignore
      }
    }
  }
}

/** ---------- 暴露方法 ---------- */
const getText = () => stripHtml(currentContent.value || '')
const setContent = (html: string) => {
  currentContent.value = typeof html === 'string' ? html : ''
}
const getImageUrls = (): string[] => {
  if (props.imageUrls && props.imageUrls.length) return props.imageUrls
  return autoImageUrls.value
}

defineExpose({
  // 数据
  parsedNodes,
  selectable: computed(() => props.selectable),
  previewImage: computed(() => props.previewImage),
  space: computed(() => props.space),
  // 方法
  getText,
  setContent,
  getImageUrls,
  parseHTML: (html: string) => parseHtml(html, { tagStyle: props.tagStyle })
})

/** ---------- 生命周期 ---------- */
onMounted(() => {
  emit('onReady')
})
</script>

<style lang="scss" scoped>
.see-parse {
  width: 100%;
  word-break: break-word;
  color: var(--see-main-color);
  font-size: 14px;
  line-height: 1.6;

  &__empty {
    padding: 32rpx 0;
    text-align: center;
    color: var(--see-tips-color, #999);
    font-size: 13px;
  }

  &__rich {
    display: block;
    width: 100%;

    &--h5 {
      /* H5 v-html 模式下，部分常见标签的兜底样式（scoped 下需配合深度选择器） */
      :deep(img) {
        max-width: 100%;
        height: auto;
        vertical-align: middle;
      }
      :deep(a) {
        color: var(--see-primary);
        text-decoration: none;
      }
      :deep(a:hover) {
        text-decoration: underline;
      }
      :deep(blockquote) {
        margin: 8px 0;
        padding: 8px 12px;
        border-left: 4px solid var(--see-primary);
        background: var(--see-bg-secondary, #f6f7fa);
        color: var(--see-sub-color, #666);
      }
      :deep(pre) {
        padding: 12px;
        background: var(--see-bg-secondary, #f6f7fa);
        border-radius: 6px;
        overflow-x: auto;
        font-family: Menlo, Consolas, monospace;
        font-size: 13px;
      }
      :deep(code) {
        padding: 2px 6px;
        background: var(--see-bg-secondary, #f6f7fa);
        border-radius: 4px;
        font-family: Menlo, Consolas, monospace;
        font-size: 13px;
      }
      :deep(table) {
        width: 100%;
        border-collapse: collapse;
        margin: 8px 0;
      }
      :deep(th),
      :deep(td) {
        border: 1px solid var(--see-border-color, #e5e6eb);
        padding: 6px 10px;
        text-align: left;
      }
      :deep(hr) {
        border: 0;
        border-top: 1px solid var(--see-border-color, #e5e6eb);
        margin: 12px 0;
      }
    }
  }
}
</style>
