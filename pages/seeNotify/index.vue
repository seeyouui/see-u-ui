<template>
  <see-config>
    <text class="title">{{ t('notify.demo.basic') }}</text>
    <view class="demo-content">
      <see-button :title="t('notify.demo.defaultNotify')" type="primary" is-ripple @click="showDefault" />
    </view>

    <text class="title">{{ t('notify.demo.type') }}</text>
    <view class="demo-content">
      <view class="btn-group">
        <see-button :title="t('notify.demo.success')" type="success" is-ripple @click="showSuccess" />
        <see-button :title="t('notify.demo.error')" type="error" is-ripple @click="showError" />
        <see-button :title="t('notify.demo.warning')" type="warning" is-ripple @click="showWarning" />
        <see-button :title="t('notify.demo.info')" type="info" is-ripple @click="showInfo" />
      </view>
    </view>

    <text class="title">{{ t('notify.demo.duration') }}</text>
    <view class="demo-content">
      <see-button :title="t('notify.demo.longNotify')" type="primary" is-ripple @click="showLong" />
    </view>

    <text class="title">{{ t('notify.demo.closable') }}</text>
    <view class="demo-content">
      <see-button :title="t('notify.demo.closableNotify')" type="primary" is-ripple @click="showClosable" />
    </view>

    <text class="title">{{ t('notify.demo.component') }}</text>
    <view class="demo-content">
      <see-button :title="t('notify.demo.componentNotify')" type="primary" is-ripple @click="show1 = true" />
      <see-notify v-model:show="show1" :message="t('notify.demo.componentNotify')" type="success" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { notify, useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeNotify')

const show1 = ref(false)

const showDefault = () => {
  notify.info(t('notify.demo.defaultMsg'))
}

const showSuccess = () => {
  notify.success(t('notify.demo.successMsg'))
}

const showError = () => {
  notify.error(t('notify.demo.errorMsg'))
}

const showWarning = () => {
  notify.warning(t('notify.demo.warningMsg'))
}

const showInfo = () => {
  notify.info(t('notify.demo.infoMsg'))
}

const showLong = () => {
  notify.show({ message: t('notify.demo.longMsg'), duration: 5000 })
}

const showClosable = () => {
  notify.show({ message: t('notify.demo.closableMsg'), isClosable: true, duration: 0 })
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
.btn-group {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
}
</style>
