<template>
  <see-config>
    <text class="title">{{ t('toast.demo.basic') }}</text>
    <view class="demo-content">
      <see-button :title="t('toast.demo.defaultToast')" type="primary" is-ripple @click="showDefault" />
    </view>

    <text class="title">{{ t('toast.demo.type') }}</text>
    <view class="demo-content">
      <view class="btn-group">
        <see-button :title="t('toast.demo.success')" type="success" is-ripple @click="showSuccess" />
        <see-button :title="t('toast.demo.error')" type="error" is-ripple @click="showError" />
        <see-button :title="t('toast.demo.warning')" type="warning" is-ripple @click="showWarning" />
        <see-button :title="t('toast.demo.info')" type="info" is-ripple @click="showInfo" />
      </view>
    </view>

    <text class="title">{{ t('toast.demo.loading') }}</text>
    <view class="demo-content">
      <see-button :title="t('toast.demo.loadingBtn')" type="primary" is-ripple @click="showLoading" />
    </view>

    <text class="title">{{ t('toast.demo.position') }}</text>
    <view class="demo-content">
      <view class="btn-group">
        <see-button :title="t('toast.demo.top')" type="primary" is-ripple @click="showTop" />
        <see-button :title="t('toast.demo.center')" type="primary" is-ripple @click="showCenter" />
        <see-button :title="t('toast.demo.bottom')" type="primary" is-ripple @click="showBottom" />
      </view>
    </view>

    <text class="title">{{ t('toast.demo.component') }}</text>
    <view class="demo-content">
      <see-button :title="t('toast.demo.componentToast')" type="primary" is-ripple @click="show1 = true" />
      <see-toast v-model:show="show1" :message="t('toast.demo.componentToast')" type="success" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { toast, useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeToast')

const show1 = ref(false)

const showDefault = () => {
  toast.show(t('toast.demo.defaultMsg'))
}

const showSuccess = () => {
  toast.success(t('toast.demo.successMsg'))
}

const showError = () => {
  toast.error(t('toast.demo.errorMsg'))
}

const showWarning = () => {
  toast.warning(t('toast.demo.warningMsg'))
}

const showInfo = () => {
  toast.info(t('toast.demo.infoMsg'))
}

const showLoading = () => {
  toast.loading(t('toast.demo.loadingMsg'))
  setTimeout(() => {
    toast.hide()
  }, 3000)
}

const showTop = () => {
  toast.show({ message: t('toast.demo.topMsg'), position: 'top' })
}

const showCenter = () => {
  toast.show({ message: t('toast.demo.centerMsg'), position: 'center' })
}

const showBottom = () => {
  toast.show({ message: t('toast.demo.bottomMsg'), position: 'bottom' })
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
