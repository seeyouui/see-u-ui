<template>
  <see-config>
    <view class="demo-cell">
      <view class="demo-cell__section">
        <view class="demo-cell__title">{{ t('cell.demo.basic') }}</view>
        <see-cell :title="t('cell.demo.title')" :value="t('cell.demo.content')" />
        <see-cell :title="t('cell.demo.title')" :value="t('cell.demo.withArrow')" is-link />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">{{ t('cell.demo.withIcon') }}</view>
        <see-cell :title="t('cell.demo.settings')" icon="⚙️" :value="t('cell.demo.enter')" is-link />
        <see-cell :title="t('cell.demo.message')" icon="🔔" value="99+" />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">{{ t('cell.demo.withLabel') }}</view>
        <see-cell :title="t('cell.demo.title')" :label="t('cell.demo.labelText')" :value="t('cell.demo.content')" />
        <see-cell :title="t('cell.demo.title')" :label="t('cell.demo.longLabel')" is-link />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">{{ t('cell.demo.required') }}</view>
        <see-cell :title="t('cell.demo.username')" :value="t('cell.demo.placeholder')" is-required />
        <see-cell :title="t('cell.demo.phone')" :value="t('cell.demo.placeholder')" is-required is-link />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">{{ t('cell.demo.navigate') }}</view>
        <see-cell :title="t('cell.demo.profile')" is-link to="/pages/index/index" />
        <see-cell :title="t('cell.demo.systemSettings')" icon="⚙️" is-link to="/pages/index/index" />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">{{ t('cell.demo.customSlot') }}</view>
        <see-cell :title="t('cell.demo.avatar')">
          <template #right>
            <view style="width: 60rpx; height: 60rpx; background: #eee; border-radius: 50%" />
          </template>
        </see-cell>
        <see-cell>
          <template #title>
            <text style="color: #07c160; font-weight: bold">{{ t('cell.demo.customTitle') }}</text>
          </template>
          <template #value>
            <text style="color: #ee0a24">{{ t('cell.demo.customValue') }}</text>
          </template>
        </see-cell>
        <see-cell :title="t('cell.demo.customIcon')">
          <template #icon>
            <view style="width: 40rpx; height: 40rpx; background: #1989fa; border-radius: 8rpx" />
          </template>
        </see-cell>
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">{{ t('cell.demo.noBorder') }}</view>
        <see-cell :title="t('cell.demo.noBottomBorder')" :value="t('cell.demo.content')" :border="false" />
        <see-cell :title="t('cell.demo.noBottomBorder')" :value="t('cell.demo.content')" :border="false" />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">{{ t('cell.demo.centerAlign') }}</view>
        <see-cell :title="t('cell.demo.centerDisplay')" :value="t('cell.demo.content')" is-center />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">{{ t('cell.demo.clickEffect') }}</view>
        <see-cell :title="t('cell.demo.bgFeedback')" :value="t('cell.demo.clickMe')" click-effect="background" @on-click="onCellClick" />
        <see-cell :title="t('cell.demo.opacityFeedback')" :value="t('cell.demo.clickMe')" click-effect="opacity" @on-click="onCellClick" />
        <see-cell :title="t('cell.demo.noFeedback')" :value="t('cell.demo.clickMe')" click-effect="none" @on-click="onCellClick" />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">{{ t('cell.demo.customHeight') }}</view>
        <see-cell :title="t('cell.demo.title')" :value="t('cell.demo.customHeightVal')" height="120rpx" />
        <see-cell :title="t('cell.demo.titleWidth')" :value="t('cell.demo.content')" title-width="200rpx" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeCell')

const onCellClick = () => {
  uni.showToast({ title: t('cell.demo.clicked'), icon: 'none' })
}
</script>

<style lang="scss" scoped>
.demo-cell {
  padding-bottom: 40rpx;

  &__section {
    margin-bottom: 20rpx;
  }

  &__title {
    padding: 20rpx 30rpx 10rpx;
    font-size: 26rpx;
    color: #999;
  }
}
</style>
