<template>
  <see-config>
    <text class="title">基础用法</text>
    <view class="demo-content">
      <see-button title="默认通知" type="primary" is-ripple @click="showDefault" />
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

    <text class="title">自定义时长</text>
    <view class="demo-content">
      <see-button title="5秒通知" type="primary" is-ripple @click="showLong" />
    </view>

    <text class="title">可手动关闭</text>
    <view class="demo-content">
      <see-button title="可关闭通知" type="primary" is-ripple @click="showClosable" />
    </view>

    <text class="title">组件式调用</text>
    <view class="demo-content">
      <see-button title="组件式通知" type="primary" is-ripple @click="show1 = true" />
      <see-notify v-model:show="show1" message="组件式通知" type="success" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { notify } from '@/uni_modules/see-u-ui'

const show1 = ref(false)

const showDefault = () => {
  notify.info('默认通知')
}

const showSuccess = () => {
  notify.success('操作成功')
}

const showError = () => {
  notify.error('操作失败')
}

const showWarning = () => {
  notify.warning('警告信息')
}

const showInfo = () => {
  notify.info('提示信息')
}

const showLong = () => {
  notify.show({ message: '这条通知显示5秒', duration: 5000 })
}

const showClosable = () => {
  notify.show({ message: '可手动关闭的通知', isClosable: true, duration: 0 })
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
