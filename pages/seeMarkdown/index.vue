<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('markdown.demo.basic') }}</text>
      <view class="content">
        <see-markdown :content="basicMd" />
      </view>

      <text class="title">{{ t('markdown.demo.emphasis') }}</text>
      <view class="content">
        <see-markdown :content="emphasisMd" />
      </view>

      <text class="title">{{ t('markdown.demo.linkImage') }}</text>
      <view class="content">
        <see-markdown :content="linkImgMd" @on-link-tap="onLinkTap" @on-img-tap="onImgTap" />
      </view>

      <text class="title">{{ t('markdown.demo.list') }}</text>
      <view class="content">
        <see-markdown :content="listMd" />
      </view>

      <text class="title">{{ t('markdown.demo.codeBlock') }}</text>
      <view class="content">
        <see-markdown :content="codeMd" />
      </view>

      <text class="title">{{ t('markdown.demo.quote') }}</text>
      <view class="content">
        <see-markdown :content="quoteMd" />
      </view>

      <text class="title">{{ t('markdown.demo.hr') }}</text>
      <view class="content">
        <see-markdown :content="hrMd" />
      </view>

      <text class="title">{{ t('markdown.demo.table') }}</text>
      <view class="content">
        <see-markdown :content="tableMd" />
      </view>

      <text class="title">{{ t('markdown.demo.linkify') }}</text>
      <view class="content">
        <see-markdown :content="linkifyMd" />
      </view>

      <text class="title">{{ t('markdown.demo.xss') }}</text>
      <view class="content">
        <see-markdown :content="xssMd" />
      </view>

      <text class="title">{{ t('markdown.demo.tagStyle') }}</text>
      <view class="content">
        <see-markdown :content="styledMd" :tag-style="customTagStyle" />
      </view>

      <text class="title">{{ t('markdown.demo.empty') }}</text>
      <view class="content">
        <see-markdown content="" :empty-text="t('markdown.demo.emptyText')" />
      </view>

      <text class="title">{{ t('markdown.demo.dynamic') }}</text>
      <view class="content">
        <see-markdown ref="mdRef" :content="dynamicMd" @on-load="onLoad" />
        <view class="gap-12"></view>
        <view class="flex-sb">
          <see-button is-ripple type="primary" @tap="switchMd">{{ t('markdown.demo.switchMd') }}</see-button>
          <see-button is-ripple type="warning" @tap="appendMd">{{ t('markdown.demo.appendParagraph') }}</see-button>
          <see-button is-ripple @tap="showText">{{ t('markdown.demo.showText') }}</see-button>
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeMarkdown')

/** 基础 Markdown */
const basicMd = ref(t('markdown.content.basic'))

/** 强调与行内格式 */
const emphasisMd = ref(t('markdown.content.emphasis'))

/** 链接与图片 */
const linkImgMd = ref(t('markdown.content.linkImg'))

/** 列表 */
const listMd = ref(t('markdown.content.list'))

/** 代码块 */
const codeMd = ref(t('markdown.content.code'))

/** 引用 */
const quoteMd = ref(t('markdown.content.quote'))

/** 水平线 */
const hrMd = ref(t('markdown.content.hr'))

/** 表格 */
const tableMd = ref(t('markdown.content.table'))

/** linkify */
const linkifyMd = ref(t('markdown.content.linkify'))

/** XSS */
const xssMd = ref(t('markdown.content.xss'))

/** 自定义 tagStyle */
const styledMd = ref(t('markdown.content.styled'))
const customTagStyle = ref({
  h1: 'color: #3ca7ff; border-bottom: 2px solid #3ca7ff; padding-bottom: 4px;',
  h2: 'color: #ff6b6b;',
  blockquote: 'border-left-color: #ffb645; background: #fff8e8; color: #b97a00;'
})

/** 动态更新 */
const dynamicMd = ref(t('markdown.content.dynamicInitial', { time: new Date().toLocaleTimeString() }))
const mdRef = ref<any>(null)

const switchMd = () => {
  const list = [t('markdown.content.dynamicScreen2'), t('markdown.content.dynamicScreen3'), t('markdown.content.dynamicScreen4')]
  dynamicMd.value = list[Math.floor(Math.random() * list.length)]
}

const appendMd = () => {
  dynamicMd.value += t('markdown.content.appended', { time: new Date().toLocaleTimeString() })
}

const showText = () => {
  const text = mdRef.value?.getText() || ''
  uni.showModal({ title: t('markdown.demo.plainText'), content: text, showCancel: false })
}

const onLoad = (html: string, _nodes: any[]) => {
  console.log('[SeeMarkdown] onLoad html length:', html.length)
}

const onLinkTap = (href: string) => {
  uni.showToast({ title: t('markdown.demo.linkClicked') + href, icon: 'none' })
}

const onImgTap = (src: string) => {
  uni.showToast({ title: t('markdown.demo.imageClicked'), icon: 'none' })

  console.log('img src:', src)
}
</script>

<style lang="scss" scoped>
.gap-12 {
  width: 100%;
  height: 12px;
}
.flex-sb {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.container {
  width: 100vw;
  overflow: hidden;
  padding: 12px;
  box-sizing: border-box;

  .title {
    font-size: 18px;
    color: #999;
  }
  .content {
    margin-top: 6px;
    margin-bottom: 24px;
    display: block;
  }
}
</style>
