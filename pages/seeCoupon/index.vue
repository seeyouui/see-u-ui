<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('coupon.demo.basic') }}</text>
      <view class="content">
        <see-coupon
          :amount="10"
          unit="¥"
          :condition="t('coupon.demo.minSpend', { amount: 100 })"
          :title="t('coupon.demo.newUser')"
          :description="t('coupon.demo.newUserOnly')"
          :valid-date="t('coupon.demo.validUntil', { date: '2026-12-31' })"
        />
      </view>

      <text class="title">{{ t('coupon.demo.discount') }}</text>
      <view class="content">
        <see-coupon
          :discount-text="t('coupon.demo.discountText')"
          :condition="t('coupon.demo.minSpend', { amount: 50 })"
          :title="t('coupon.demo.fullDiscount')"
          :description="t('coupon.demo.unlimited')"
          type="warning"
        />
      </view>

      <text class="title">{{ t('coupon.demo.theme') }}</text>
      <view class="content" style="display: flex; flex-direction: column; gap: 12px">
        <see-coupon :amount="20" :title="t('coupon.demo.newUserPrimary')" type="primary" />
        <see-coupon :amount="15" :title="t('coupon.demo.discountSuccess')" type="success" />
        <see-coupon :amount="30" :title="t('coupon.demo.warningCoupon')" type="warning" />
        <see-coupon :amount="5" :title="t('coupon.demo.errorCoupon')" type="error" />
      </view>

      <text class="title">{{ t('coupon.demo.received') }}</text>
      <view class="content">
        <see-coupon :amount="10" :title="t('coupon.demo.receivedDiscount', { discount: '8.8' })" status="received" />
      </view>

      <text class="title">{{ t('coupon.demo.usedExpired') }}</text>
      <view class="content" style="display: flex; flex-direction: column; gap: 12px">
        <see-coupon :amount="20" :title="t('coupon.demo.fiveYuan')" status="used" />
        <see-coupon :amount="30" :title="t('coupon.demo.fullReduction', { amount: '200', reduce: '30' })" status="expired" />
      </view>

      <text class="title">{{ t('coupon.demo.tag') }}</text>
      <view class="content">
        <see-coupon :amount="10" :title="t('coupon.demo.flashSale')" :tag="t('coupon.demo.timeLimited')" type="warning" />
      </view>

      <text class="title">{{ t('coupon.demo.event') }}</text>
      <view class="content">
        <see-coupon
          :amount="15"
          :title="t('coupon.demo.clickClaim')"
          :condition="t('coupon.demo.clickTest')"
          @on-click="onCardClick"
          @on-button-click="onButtonClick"
        />
        <text class="info">{{ t('coupon.demo.checkConsole') }}</text>
      </view>

      <text class="title">{{ t('coupon.demo.minimal') }}</text>
      <view class="content">
        <see-coupon :amount="50" :title="t('coupon.demo.superHoliday')" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeCoupon')

const onCardClick = (payload: any) => {
  uni.showToast({ title: `${t('coupon.demo.cardClicked')}${payload.amount}`, icon: 'none' })
  console.log('onClick', payload)
}

const onButtonClick = (payload: any) => {
  uni.showToast({ title: t('coupon.demo.claimed'), icon: 'success' })
  console.log('onButtonClick', payload)
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
    margin-bottom: 24px;
  }
}

.info {
  font-size: 12px;
  color: #999;
  padding: 8px 12px;
}
</style>
