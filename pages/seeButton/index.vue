<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('button.demo.type') }}</text>
      <view class="content">
        <see-button size="small" :title="t('button.demo.default')" />
        <see-button size="small" :title="t('button.demo.primary')" type="primary" />
        <see-button size="small" :title="t('button.demo.error')" type="error" />
        <see-button size="small" :title="t('button.demo.warning')" type="warning" />
        <see-button size="small" :title="t('button.demo.success')" type="success" />
      </view>
      <text class="title">{{ t('button.demo.hollow') }}</text>
      <view class="content">
        <see-button size="small" is-hollow :title="t('button.demo.default')" />
        <see-button size="small" is-hollow :title="t('button.demo.primary')" type="primary" />
        <see-button size="small" is-hollow :title="t('button.demo.error')" type="error" />
        <see-button size="small" is-hollow :title="t('button.demo.warning')" type="warning" />
        <see-button size="small" is-hollow :title="t('button.demo.success')" type="success" />
      </view>
      <text class="title">{{ t('button.demo.disabled') }}</text>
      <view class="content">
        <see-button size="small" is-disabled :title="t('button.demo.default')" />
        <see-button size="small" is-disabled :title="t('button.demo.primary')" type="primary" />
        <see-button size="small" is-disabled :title="t('button.demo.error')" type="error" />
        <see-button size="small" is-disabled :title="t('button.demo.warning')" type="warning" />
        <see-button size="small" is-disabled :title="t('button.demo.success')" type="success" />
      </view>
      <text class="title">{{ t('button.demo.size') }}</text>
      <view class="content">
        <see-button size="default" :title="t('button.demo.defaultSize')" />
        <see-button size="small" :title="t('button.demo.smallSize')" />
        <see-button size="mini" :title="t('button.demo.miniSize')" />
        <see-button size="large" :title="t('button.demo.largeSize')" />
      </view>
      <text class="title">{{ t('button.demo.ripple') }}</text>
      <view class="content">
        <see-button :title="t('button.demo.rippleDefault')" is-ripple />
        <see-button type="primary" size="default" :title="t('button.demo.rippleColor')" is-ripple />
        <see-button size="default" :title="t('button.demo.rippleAnimColor')" is-ripple ripple-color="blue" />
        <see-button size="large" :title="t('button.demo.rippleLong')" is-ripple :ripple-time="10000" ripple-color="red" :mask-time="20000" />
      </view>
      <text class="title">{{ t('button.demo.custom') }}</text>
      <view class="content">
        <see-button :custom-style="customStyle" :title="t('button.demo.customSize')" />
        <see-button :radius="24" :title="t('button.demo.radius')" />
        <see-button
          size="large"
          :title="t('button.demo.gradient')"
          text-color="#FFFFFF"
          color="linear-gradient(135deg, #3ca7ff, #52f7bd)"
          is-ripple
        />
        <see-button :title="t('button.demo.customColor')" color="#8A4D35" text-color="#FFFFFF" is-ripple />
        <see-button :title="t('button.demo.passView')">
          <view style="width: 10px; height: 10px; border: 1px red solid" />
        </see-button>
        <see-button size="large">
          <text>{{ t('button.demo.slotTitle') }}</text>
        </see-button>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.button')

const customStyle = {
  width: '200px',
  height: '150px'
}
</script>

<style lang="scss" scoped>
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
    margin-top: 12px;
    flex-direction: row;
    flex-wrap: warp;
    align-items: center;
    :deep(.see-button) {
      margin: 0 12px 12px 0;
    }
  }
}
</style>
