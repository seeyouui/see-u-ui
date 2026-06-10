<template>
  <see-config>
    <text class="title">基础用法（4列）</text>
    <view class="demo-content">
      <see-grid>
        <see-grid-item v-for="i in 8" :key="i" :text="'宫格' + i" icon="📱" />
      </see-grid>
    </view>

    <text class="title">3列布局</text>
    <view class="demo-content">
      <see-grid :columns="3">
        <see-grid-item v-for="i in 6" :key="i" :text="'宫格' + i" icon="⭐" />
      </see-grid>
    </view>

    <text class="title">带边框</text>
    <view class="demo-content">
      <see-grid :columns="3" border>
        <see-grid-item v-for="i in 6" :key="i" :text="'宫格' + i" icon="📌" />
      </see-grid>
    </view>

    <text class="title">带间距</text>
    <view class="demo-content">
      <see-grid :columns="3" gap="16rpx">
        <see-grid-item v-for="i in 6" :key="i" :text="'宫格' + i" icon="🎨" />
      </see-grid>
    </view>

    <text class="title">正方形模式</text>
    <view class="demo-content">
      <see-grid :columns="4" is-square>
        <see-grid-item v-for="i in 8" :key="i" :text="'格' + i" icon="📐" />
      </see-grid>
    </view>

    <text class="title">点击反馈</text>
    <view class="demo-content">
      <see-grid :columns="4" is-clickable>
        <see-grid-item v-for="i in 4" :key="i" :index="i - 1" :text="'点击' + i" icon="👆" @on-click="onItemClick" />
      </see-grid>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
const onItemClick = (index: number) => {
  uni.showToast({ title: `点击了第 ${index} 项`, icon: 'none' })
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
</style>
