<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('parse.demo.basic') }}</text>
      <view class="content">
        <see-parse :content="basicHtml" />
      </view>

      <text class="title">{{ t('parse.demo.imageLink') }}</text>
      <view class="content">
        <see-parse :content="richHtml" @on-link-tap="onLinkTap" @on-img-tap="onImgTap" />
      </view>

      <text class="title">{{ t('parse.demo.tagStyle') }}</text>
      <view class="content">
        <see-parse :content="styledHtml" :tag-style="customTagStyle" />
      </view>

      <text class="title">{{ t('parse.demo.xss') }}</text>
      <view class="content">
        <see-parse :content="xssHtml" />
      </view>

      <text class="title">{{ t('parse.demo.empty') }}</text>
      <view class="content">
        <see-parse content="" :empty-text="t('parse.demo.emptyText')" />
      </view>

      <text class="title">{{ t('parse.demo.dynamic') }}</text>
      <view class="content">
        <see-parse ref="parseRef" :content="dynamicHtml" @on-load="onLoad" />
        <view class="gap-12"></view>
        <view class="flex-sb">
          <see-button is-ripple type="primary" @tap="switchHtml">{{ t('parse.demo.switchContent') }}</see-button>
          <see-button is-ripple type="warning" @tap="appendHtml">{{ t('parse.demo.appendParagraph') }}</see-button>
          <see-button is-ripple @tap="showText">{{ t('parse.demo.showText') }}</see-button>
        </view>
      </view>

      <text class="title">{{ t('parse.demo.table') }}</text>
      <view class="content">
        <see-parse :content="tableHtml" />
      </view>

      <text class="title">{{ t('parse.demo.selectable') }}</text>
      <view class="content">
        <see-parse :content="basicHtml" selectable />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeParse')

/** 基础 HTML */
const basicHtml = ref(t('parse.content.basic'))

/** 含图片与链接 */
const richHtml = ref(t('parse.content.rich'))

/** tagStyle 测试 */
const styledHtml = ref(t('parse.content.styled'))

const customTagStyle = ref({
  h3: 'color: #3ca7ff; font-size: 20px; border-bottom: 2px solid #3ca7ff; padding-bottom: 4px;',
  p: 'color: #ff6b6b; font-size: 16px; line-height: 1.8;'
})

/** XSS */
const xssHtml = ref(t('parse.content.xss'))

/** 动态更新 */
const dynamicHtml = ref(t('parse.content.dynamicInitial', { time: new Date().toLocaleTimeString() }))
const parseRef = ref<any>(null)

const switchHtml = () => {
  const list = [t('parse.content.dynamicScreen2'), t('parse.content.dynamicScreen3'), t('parse.content.dynamicScreen4')]
  dynamicHtml.value = list[Math.floor(Math.random() * list.length)]
}

const appendHtml = () => {
  dynamicHtml.value += t('parse.content.appended', { time: new Date().toLocaleTimeString() })
}

const showText = () => {
  const text = parseRef.value?.getText() || ''
  uni.showModal({ title: t('parse.demo.plainText'), content: text, showCancel: false })
}

const onLoad = (nodes: any[]) => {
  console.log('[SeeParse] onLoad nodes:', nodes.length)
}

/** 链接 / 图片点击 */
const onLinkTap = (href: string) => {
  uni.showToast({ title: t('parse.demo.linkClicked') + href, icon: 'none' })
}

const onImgTap = (src: string) => {
  uni.showToast({ title: t('parse.demo.imageClicked'), icon: 'none' })
  console.log('img src:', src)
}

/** 表格与代码 */
const tableHtml = ref(t('parse.content.table'))
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
