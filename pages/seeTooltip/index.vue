<template>
  <see-config>
    <text class="title">{{ t('tooltip.demo.longPress') }}</text>
    <view class="demo-content">
      <see-tooltip :content="t('tooltip.demo.longPressContent')">
        <see-button :title="t('tooltip.demo.longPressBtn')" type="primary" />
      </see-tooltip>
    </view>

    <text class="title">{{ t('tooltip.demo.click') }}</text>
    <view class="demo-content">
      <see-tooltip :content="t('tooltip.demo.clickContent')" trigger="click">
        <see-button :title="t('tooltip.demo.clickBtn')" type="primary" />
      </see-tooltip>
    </view>

    <text class="title">{{ t('tooltip.demo.position') }}</text>
    <view class="demo-content">
      <view class="tooltip-grid">
        <see-tooltip :content="t('tooltip.demo.topContent')" position="top">
          <see-button :title="t('tooltip.demo.top')" type="primary" size="small" />
        </see-tooltip>
        <see-tooltip :content="t('tooltip.demo.bottomContent')" position="bottom">
          <see-button :title="t('tooltip.demo.bottom')" type="primary" size="small" />
        </see-tooltip>
        <see-tooltip :content="t('tooltip.demo.leftContent')" position="left">
          <see-button :title="t('tooltip.demo.left')" type="primary" size="small" />
        </see-tooltip>
        <see-tooltip :content="t('tooltip.demo.rightContent')" position="right">
          <see-button :title="t('tooltip.demo.right')" type="primary" size="small" />
        </see-tooltip>
      </view>
    </view>

    <text class="title">{{ t('tooltip.demo.light') }}</text>
    <view class="demo-content">
      <see-tooltip :content="t('tooltip.demo.lightContent')" effect="light">
        <see-button :title="t('tooltip.demo.lightBtn')" type="primary" />
      </see-tooltip>
    </view>

    <text class="title">{{ t('tooltip.demo.manual') }}</text>
    <view class="demo-content">
      <see-tooltip v-model:show="show1" :content="t('tooltip.demo.manualContent')" trigger="manual">
        <see-button :title="t('tooltip.demo.manualBtn')" type="primary" @click="show1 = !show1" />
      </see-tooltip>
    </view>

    <text class="title">{{ t('tooltip.demo.disabled') }}</text>
    <view class="demo-content">
      <see-tooltip :content="t('tooltip.demo.disabledContent')" is-disabled>
        <see-button :title="t('tooltip.demo.disabledBtn')" type="info" />
      </see-tooltip>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeTooltip')

const show1 = ref(false)
</script>

<style lang="scss" scoped>
.title {
  display: block;
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: var(--see-tips-color);
}
.demo-content {
  padding: 0 30rpx 30rpx;
}
.tooltip-grid {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
