<template>
  <see-config>
    <text class="title">四种类型</text>
    <view class="demo-content">
      <see-alert type="success" title="成功" content="操作成功完成" />
      <view class="gap" />
      <see-alert type="error" title="错误" content="操作执行失败" />
      <view class="gap" />
      <see-alert type="warning" title="警告" content="请注意数据安全" />
      <view class="gap" />
      <see-alert type="info" title="信息" content="这是一条信息提示" />
    </view>

    <text class="title">浅色效果（默认）</text>
    <view class="demo-content">
      <see-alert type="success" title="成功" content="浅色效果" effect="light" />
    </view>

    <text class="title">深色效果</text>
    <view class="demo-content">
      <see-alert type="success" title="成功" content="深色效果" effect="dark" />
      <view class="gap" />
      <see-alert type="error" title="错误" content="深色效果" effect="dark" />
    </view>

    <text class="title">边框效果</text>
    <view class="demo-content">
      <see-alert type="success" title="成功" content="边框效果" effect="border" />
      <view class="gap" />
      <see-alert type="warning" title="警告" content="边框效果" effect="border" />
    </view>

    <text class="title">可关闭</text>
    <view class="demo-content">
      <see-alert v-if="show1" type="info" title="可关闭" content="点击右侧关闭按钮" is-closable @on-close="show1 = false" />
    </view>

    <text class="title">无标题</text>
    <view class="demo-content">
      <see-alert type="success" content="这是一条没有标题的提示" />
    </view>

    <text class="title">无图标</text>
    <view class="demo-content">
      <see-alert type="info" title="无图标" content="不显示左侧图标" :is-show-icon="false" />
    </view>

    <text class="title">带操作文字</text>
    <view class="demo-content">
      <see-alert type="info" title="提示" content="查看更多详情" action-text="查看详情" @on-action="onAction" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { toast } from '@/uni_modules/see-u-ui'

const show1 = ref(true)

const onAction = () => {
  toast.info('点击了查看详情')
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
