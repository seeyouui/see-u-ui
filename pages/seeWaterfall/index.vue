<template>
  <see-config>
    <text class="title">基础瀑布流（2列）</text>
    <view class="demo-content">
      <see-waterfall :list="basicList" />
    </view>

    <text class="title">3列瀑布流</text>
    <view class="demo-content">
      <see-waterfall :list="basicList" :columns="3" gap="12rpx" />
    </view>

    <text class="title">自定义项插槽</text>
    <view class="demo-content">
      <see-waterfall :list="basicList">
        <template #item="{ item }">
          <view class="custom-item">
            <image v-if="item.image" :src="item.image" class="custom-item__image" mode="widthFix" />
            <view class="custom-item__info">
              <text class="custom-item__title">{{ item.title }}</text>
              <text class="custom-item__desc">自定义描述文字</text>
            </view>
          </view>
        </template>
      </see-waterfall>
    </view>

    <text class="title">加载更多</text>
    <view class="demo-content">
      <see-waterfall :list="basicList" has-more @on-load-more="onLoadMore" />
    </view>
  </see-config>
</template>

<script lang="ts" setup>
const basicList = [
  { id: 1, title: '瀑布流项 1', image: 'https://picsum.photos/300/200?random=1' },
  { id: 2, title: '瀑布流项 2', image: 'https://picsum.photos/300/300?random=2' },
  { id: 3, title: '瀑布流项 3', image: 'https://picsum.photos/300/250?random=3' },
  { id: 4, title: '瀑布流项 4', image: 'https://picsum.photos/300/350?random=4' },
  { id: 5, title: '瀑布流项 5', image: 'https://picsum.photos/300/280?random=5' },
  { id: 6, title: '瀑布流项 6', image: 'https://picsum.photos/300/320?random=6' }
]

function onLoadMore() {
  console.log('触发加载更多')
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

.custom-item {
  display: flex;
  flex-direction: column;
  border-radius: 12rpx;
  overflow: hidden;
  background-color: #fff;

  &__image {
    width: 100%;
    display: block;
  }

  &__info {
    padding: 16rpx;
  }

  &__title {
    font-size: 28rpx;
    font-weight: 600;
    color: var(--see-main-color);
  }

  &__desc {
    font-size: 22rpx;
    color: var(--see-tips-color);
    margin-top: 8rpx;
  }
}
</style>
