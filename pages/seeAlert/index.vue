<template>
  <see-config>
    <text class="title">{{ t('alert.demo.types') }}</text>
    <view class="demo-content">
      <see-alert type="success" :title="t('alert.demo.success')" :content="t('alert.demo.successContent')" />
      <view class="gap" />
      <see-alert type="error" :title="t('alert.demo.error')" :content="t('alert.demo.errorContent')" />
      <view class="gap" />
      <see-alert type="warning" :title="t('alert.demo.warning')" :content="t('alert.demo.warningContent')" />
      <view class="gap" />
      <see-alert type="info" :title="t('alert.demo.info')" :content="t('alert.demo.infoContent')" />
    </view>

    <text class="title">{{ t('alert.demo.light') }}</text>
    <view class="demo-content">
      <see-alert type="success" :title="t('alert.demo.success')" :content="t('alert.demo.lightContent')" effect="light" />
    </view>

    <text class="title">{{ t('alert.demo.dark') }}</text>
    <view class="demo-content">
      <see-alert type="success" :title="t('alert.demo.success')" :content="t('alert.demo.darkContent')" effect="dark" />
      <view class="gap" />
      <see-alert type="error" :title="t('alert.demo.error')" :content="t('alert.demo.darkContent')" effect="dark" />
    </view>

    <text class="title">{{ t('alert.demo.border') }}</text>
    <view class="demo-content">
      <see-alert type="success" :title="t('alert.demo.success')" :content="t('alert.demo.borderContent')" effect="border" />
      <view class="gap" />
      <see-alert type="warning" :title="t('alert.demo.warning')" :content="t('alert.demo.borderContent')" effect="border" />
    </view>

    <text class="title">{{ t('alert.demo.closable') }}</text>
    <view class="demo-content">
      <see-alert
        v-if="show1"
        type="info"
        :title="t('alert.demo.closableTitle')"
        :content="t('alert.demo.closableContent')"
        is-closable
        @on-close="show1 = false"
      />
    </view>

    <text class="title">{{ t('alert.demo.noTitle') }}</text>
    <view class="demo-content">
      <see-alert type="success" :content="t('alert.demo.noTitleContent')" />
    </view>

    <text class="title">{{ t('alert.demo.noIcon') }}</text>
    <view class="demo-content">
      <see-alert type="info" :title="t('alert.demo.noIconTitle')" :content="t('alert.demo.noIconContent')" :is-show-icon="false" />
    </view>

    <text class="title">{{ t('alert.demo.action') }}</text>
    <view class="demo-content">
      <see-alert
        type="info"
        :title="t('alert.demo.actionTitle')"
        :content="t('alert.demo.actionContent')"
        :action-text="t('alert.demo.actionText')"
        @on-action="onAction"
      />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { toast, useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeAlert')

const show1 = ref(true)

const onAction = () => {
  toast.info(t('alert.demo.actionToast'))
}
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
.gap {
  height: 20rpx;
}
</style>
