<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('link.demo.basic') }}</text>
      <view class="content">
        <see-link :text="t('link.demo.docLink')" type="primary" href="https://www.baidu.com" />
        <view class="gap-12"></view>
        <see-link :text="t('link.demo.customColor')" color="#52f7bd" href="https://www.baidu.com" />
      </view>
      <text class="title">{{ t('link.demo.theme') }}</text>
      <view class="content">
        <see-link :text="t('link.demo.poemTitle')" type="" href="https://www.baidu.com" />
        <view class="gap-12"></view>
        <see-link :text="t('link.demo.poemLine1')" type="primary" href="https://www.baidu.com" />
        <view class="gap-12"></view>
        <see-link :text="t('link.demo.poemLine2')" type="error" href="https://www.baidu.com" />
        <view class="gap-12"></view>
        <see-link :text="t('link.demo.poemLine3')" type="warning" href="https://www.baidu.com" />
        <view class="gap-12"></view>
        <see-link :text="t('link.demo.poemLine4')" type="success" href="https://www.baidu.com" />
      </view>
      <text class="title">{{ t('link.demo.underline') }}</text>
      <view class="content">
        <see-link :text="t('link.demo.starRequest')" is-line type="primary" href="https://www.baidu.com" />
        <view class="gap-12"></view>
        <see-link :text="t('link.demo.customLineColor')" is-line line-color="#52f7bd" type="primary" href="https://www.baidu.com" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.link')
</script>

<style lang="scss" scoped>
.gap-12 {
  width: 100%;
  height: 12px;
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
  }
}
</style>
