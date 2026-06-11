<template>
  <see-config>
    <text class="title">基础用法</text>
    <view class="demo-content">
      <see-button title="默认 Toast" type="primary" is-ripple @click="showDefault" />
    </view>

    <text class="title">不同类型</text>
    <view class="demo-content">
      <view class="btn-group">
        <see-button title="成功" type="success" is-ripple @click="showSuccess" />
        <see-button title="错误" type="error" is-ripple @click="showError" />
        <see-button title="警告" type="warning" is-ripple @click="showWarning" />
        <see-button title="信息" type="info" is-ripple @click="showInfo" />
      </view>
    </view>

    <text class="title">Loading 类型</text>
    <view class="demo-content">
      <see-button title="显示 Loading" type="primary" is-ripple @click="showLoading" />
    </view>

    <text class="title">不同位置</text>
    <view class="demo-content">
      <view class="btn-group">
        <see-button title="顶部" type="primary" is-ripple @click="showTop" />
        <see-button title="居中" type="primary" is-ripple @click="showCenter" />
        <see-button title="底部" type="primary" is-ripple @click="showBottom" />
      </view>
    </view>

    <text class="title">组件式调用</text>
    <view class="demo-content">
      <see-button title="组件式 Toast" type="primary" is-ripple @click="show1 = true" />
      <see-toast v-model:show="show1" message="组件式 Toast" type="success" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { toast } from '@/uni_modules/see-u-ui'

const show1 = ref(false)

const showDefault = () => {
  toast.show('默认 Toast')
}

const showSuccess = () => {
  toast.success('操作成功')
}

const showError = () => {
  toast.error('操作失败')
}

const showWarning = () => {
  toast.warning('警告信息')
}

const showInfo = () => {
  toast.info('提示信息')
}

const showLoading = () => {
  toast.loading('加载中...')
  setTimeout(() => {
    toast.hide()
  }, 3000)
}

const showTop = () => {
  toast.show({ message: '顶部 Toast', position: 'top' })
}

const showCenter = () => {
  toast.show({ message: '居中 Toast', position: 'center' })
}

const showBottom = () => {
  toast.show({ message: '底部 Toast', position: 'bottom' })
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
