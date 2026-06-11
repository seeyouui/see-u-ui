<template>
  <see-config>
    <text class="title">基础用法</text>
    <view class="demo-content">
      <see-button title="基础 Modal" type="primary" is-ripple @click="show1 = true" />
      <see-modal v-model:show="show1" title="提示" content="这是一个模态框" @on-confirm="onConfirm" @on-cancel="onCancel" />
    </view>

    <text class="title">无标题</text>
    <view class="demo-content">
      <see-button title="无标题 Modal" type="primary" is-ripple @click="show2 = true" />
      <see-modal v-model:show="show2" :is-show-header="false" content="这是一个无标题的模态框" />
    </view>

    <text class="title">无取消按钮</text>
    <view class="demo-content">
      <see-button title="无取消按钮" type="primary" is-ripple @click="show3 = true" />
      <see-modal v-model:show="show3" title="提示" content="确认删除此项目？" :is-show-cancel-btn="false" confirm-type="danger" confirm-text="删除" />
    </view>

    <text class="title">异步关闭</text>
    <view class="demo-content">
      <see-button title="异步关闭" type="primary" is-ripple @click="show4 = true" />
      <see-modal
        v-model:show="show4"
        title="提示"
        content="点击确认后会有loading状态"
        :is-confirm-loading="isLoading"
        @on-confirm="handleAsyncConfirm"
      />
    </view>

    <text class="title">自定义内容</text>
    <view class="demo-content">
      <see-button title="自定义内容" type="primary" is-ripple @click="show5 = true" />
      <see-modal v-model:show="show5" title="自定义内容">
        <view class="custom-content">
          <text class="custom-text">这是通过插槽自定义的内容</text>
          <see-input placeholder="请输入内容" />
        </view>
      </see-modal>
    </view>

    <text class="title">命令式调用</text>
    <view class="demo-content">
      <see-button title="命令式 confirm" type="primary" is-ripple @click="showConfirm" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { modal, toast } from '@/uni_modules/see-u-ui'

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)
const show4 = ref(false)
const show5 = ref(false)
const isLoading = ref(false)

const onConfirm = () => {
  toast.success('点击了确认')
}

const onCancel = () => {
  toast.info('点击了取消')
}

const handleAsyncConfirm = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    show4.value = false
    toast.success('操作完成')
  }, 2000)
}

const showConfirm = async () => {
  const result = await modal.confirm('确认执行此操作？')
  if (result) {
    toast.success('已确认')
  } else {
    toast.info('已取消')
  }
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
.custom-content {
  padding: 20rpx 0;
}
.custom-text {
  font-size: 28rpx;
  color: var(--see-content-color);
  margin-bottom: 20rpx;
}
</style>
