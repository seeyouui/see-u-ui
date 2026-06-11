<template>
  <view v-if="hasContent || props.emptyText" :class="rootClass" :style="rootStyle" @click="onContainerClick">
    <!-- 空内容占位 -->
    <view v-if="!hasContent && props.emptyText" class="see-markdown__empty">
      <text>{{ props.emptyText }}</text>
    </view>

    <!-- 委托给 SeeParse 渲染转换后的 HTML，复用 XSS 过滤、图片预览、链接拦截能力 -->
    <see-parse
      v-if="hasContent"
      ref="parseRef"
      class="see-markdown__body"
      :content="renderedHtml"
      :tag-style="mergedTagStyle"
      :selectable="props.selectable"
      :preview-image="props.previewImage"
      :image-urls="finalImageUrls"
      :lazy-load="props.lazyLoad"
      :allowed-tags="finalAllowedTags"
      :allowed-attrs="finalAllowedAttrs"
      @on-link-tap="onLinkTap"
      @on-img-tap="onImgTap"
    />
  </view>
</template>

<script lang="ts" setup>
/**
 * Markdown Markdown 文本解析
 * @description 跨平台 Markdown 文本解析与渲染组件。零依赖纯字符串解析器输出安全 HTML，内部委托 SeeParse 渲染。
 *              支持 GFM 子集：标题/强调/链接/图片/代码块/列表/任务列表/引用/水平线/表格/自动链接。
 * @tutorial https://www.seeuui.cn/components/markdown/
 *
 * @property {String}                       content         Markdown 文本内容
 * @property {Boolean}                      breaks          段内单换行转 <br>，默认 false
 * @property {Boolean}                      linkify         自动把裸 URL 转为链接，默认 true
 * @property {Boolean}                      gfm             启用 GFM 扩展（表格 / 删除线 / 任务列表），默认 true
 * @property {Function}                     highlight       代码块语法高亮回调 (code, lang) => html
 * @property {Object}                       tagStyle        标签级样式注入
 * @property {Boolean}                      selectable      文本是否可选中（rich-text 平台生效），默认 false
 * @property {Boolean}                      previewImage    是否启用图片点击预览，默认 true
 * @property {String[]}                     imageUrls       自定义预览图片列表；不传则自动收集
 * @property {String}                       emptyText       空内容占位文本
 * @property {Boolean}                      lazyLoad        H5 模式下图片懒加载
 * @property {String}                       containerClass  自定义根元素 class
 * @property {String | Object}              containerStyle  自定义根元素 style
 * @property {String[]}                     allowedTags     自定义允许的标签白名单
 * @property {String[]}                     allowedAttrs    自定义允许的属性白名单
 *
 * @event {Function} onLoad     (html, nodes) 解析完成
 * @event {Function} onError    (err) 解析失败
 * @event {Function} onClick    (e) 点击根容器
 * @event {Function} onLinkTap  (href, e) 点击链接
 * @event {Function} onImgTap   (src, urls, e) 点击图片
 * @event {Function} onReady    挂载就绪
 */
import { computed, ref, watch, onMounted } from 'vue'
import { markdownToHtml, stripMarkdown, extractMarkdownImages } from '../../utils/hooks/useMarkdownParser'
import SeeParse from '../see-parse/see-parse.vue'

defineOptions({
  name: 'SeeMarkdown'
})

/** ---------- props ---------- */
const props = withDefaults(
  defineProps<{
    content?: string
    breaks?: boolean
    linkify?: boolean
    gfm?: boolean
    highlight?: (code: string, lang: string) => string
    tagStyle?: Record<string, string>
    selectable?: boolean
    previewImage?: boolean
    imageUrls?: string[]
    emptyText?: string
    lazyLoad?: boolean
    containerClass?: string
    containerStyle?: string | Record<string, string | number>
    allowedTags?: string[]
    allowedAttrs?: string[]
  }>(),
  {
    content: '',
    breaks: false,
    linkify: true,
    gfm: true,
    highlight: undefined,
    tagStyle: () => ({}),
    selectable: false,
    previewImage: true,
    imageUrls: undefined,
    emptyText: '',
    lazyLoad: false,
    containerClass: '',
    containerStyle: '',
    allowedTags: undefined,
    allowedAttrs: undefined
  }
)

/** ---------- emits ---------- */
const emit = defineEmits<{
  (e: 'onLoad', html: string, nodes: any[]): void
  (e: 'onError', err: Error): void
  (e: 'onClick', event: any): void
  (e: 'onLinkTap', href: string, event: any): void
  (e: 'onImgTap', src: string, urls: string[], event: any): void
  (e: 'onReady'): void
}>()

/** ---------- 内部状态 ---------- */
const parseRef = ref<any>(null)
/** 当前用于渲染的 Markdown 源（可被 setContent 覆盖） */
const currentMd = ref<string>(typeof props.content === 'string' ? props.content : '')

/** ---------- 计算属性 ---------- */
const hasContent = computed(() => {
  const c = currentMd.value
  return typeof c === 'string' && c.trim().length > 0
})

const rootClass = computed(() => {
  return ['see-markdown', props.containerClass].filter(Boolean).join(' ')
})

const rootStyle = computed(() => props.containerStyle)

/** 把 Markdown 转换为 HTML，再交给 see-parse 渲染 */
const renderedHtml = computed<string>(() => {
  if (!hasContent.value) return ''
  try {
    let html = markdownToHtml(currentMd.value, {
      breaks: props.breaks,
      linkify: props.linkify,
      gfm: props.gfm,
      highlight: props.highlight
    })
    // 在 HTML 字符串阶段注入 tagStyle，确保 H5（v-html）与 rich-text 平台行为一致
    if (props.tagStyle && Object.keys(props.tagStyle).length > 0) {
      html = injectTagStyle(html, props.tagStyle)
    }
    return html
  } catch (e) {
    emit('onError', e as Error)
    return ''
  }
})

/**
 * 把 tagStyle 注入到 HTML 字符串中匹配的开标签上：
 *   - 已有 style 属性 → 合并
 *   - 无 style 属性 → 追加
 */
function injectTagStyle(html: string, tagStyle: Record<string, string>): string {
  let out = html
  Object.keys(tagStyle).forEach((tag) => {
    const style = String(tagStyle[tag] || '').trim()
    if (!style) return
    // 兼容自闭合 <img ... /> 与普通 <p ...>，但跳过结束标签 </p>
    const re = new RegExp(`<(${tag})(\\s[^>]*?)?(/?)>`, 'gi')
    out = out.replace(re, (full, name, attrs, selfClose) => {
      const a = attrs || ''
      const styleAttrMatch = a.match(/\sstyle\s*=\s*(["'])([\s\S]*?)\1/i)
      if (styleAttrMatch) {
        const existing = styleAttrMatch[2].trim().replace(/;?\s*$/, '')
        const merged = `${existing}; ${style}`
        const newAttrs = a.replace(styleAttrMatch[0], ` style="${merged}"`)
        return `<${name}${newAttrs}${selfClose}>`
      }
      return `<${name}${a} style="${style}"${selfClose}>`
    })
  })
  return out
}

/** 兜底确保 code/pre 等标签允许，否则在 see-parse 白名单收窄时会被剥离 */
const finalAllowedTags = computed<string[] | undefined>(() => props.allowedTags)
const finalAllowedAttrs = computed<string[] | undefined>(() => props.allowedAttrs)

/** 给 see-parse 的 tagStyle 增加一些 Markdown 风格的默认样式（用户传入可覆盖） */
const DEFAULT_TAG_STYLE: Record<string, string> = {
  code: 'background: var(--see-bg-secondary, #f6f7fa); padding: 2px 6px; border-radius: 4px; font-family: Menlo, Consolas, monospace; font-size: 13px;'
}
const mergedTagStyle = computed<Record<string, string>>(() => {
  return { ...DEFAULT_TAG_STYLE, ...props.tagStyle }
})

/** 图片预览列表：优先用户传入，否则从 Markdown 中提取 */
const finalImageUrls = computed<string[]>(() => {
  if (props.imageUrls && props.imageUrls.length) return props.imageUrls
  return extractMarkdownImages(currentMd.value)
})

/** ---------- 监听 ---------- */
watch(
  () => props.content,
  (val) => {
    currentMd.value = typeof val === 'string' ? val : ''
  }
)

// 监听解析结果，触发 onLoad
watch(
  renderedHtml,
  (html) => {
    if (!hasContent.value) return
    // 这里 nodes 暂取空数组；真正的 nodes 由 see-parse 内部计算
    // 若用户需要 nodes，可通过 ref 调用 parseRef.parsedNodes
    const nodes = parseRef.value?.parsedNodes ?? []
    emit('onLoad', html, nodes)
  },
  { immediate: true, flush: 'post' }
)

/** ---------- 事件处理 ---------- */
const onContainerClick = (e: any) => {
  emit('onClick', e)
}

const onLinkTap = (href: string, e: any) => {
  emit('onLinkTap', href, e)
}

const onImgTap = (src: string, urls: string[], e: any) => {
  emit('onImgTap', src, urls, e)
}

/** ---------- 暴露方法 ---------- */
const getHtml = (): string => renderedHtml.value
const getText = (): string => stripMarkdown(currentMd.value || '')
const setContent = (md: string): void => {
  currentMd.value = typeof md === 'string' ? md : ''
}
const getImageUrls = (): string[] => finalImageUrls.value

defineExpose({
  // 数据（用于测试和外部读取）
  breaks: computed(() => props.breaks),
  linkify: computed(() => props.linkify),
  gfm: computed(() => props.gfm),
  selectable: computed(() => props.selectable),
  previewImage: computed(() => props.previewImage),
  // 方法
  getHtml,
  getText,
  setContent,
  getImageUrls
})

/** ---------- 生命周期 ---------- */
onMounted(() => {
  emit('onReady')
})
</script>

<style lang="scss" scoped>
.see-markdown {
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

  &__body {
    display: block;
    width: 100%;
  }
}
</style>
