<template>
  <see-config>
    <view class="demo-cell">
      <view class="demo-cell__section">
        <view class="demo-cell__title">基础用法</view>
        <see-cell title="标题" value="内容" />
        <see-cell title="标题" value="带箭头" is-link />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">带图标</view>
        <see-cell title="设置" icon="⚙️" value="进入" is-link />
        <see-cell title="消息" icon="🔔" value="99+" />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">带描述</view>
        <see-cell title="标题" label="这是一段描述信息" value="内容" />
        <see-cell title="标题" label="描述信息较长时会自动换行显示，确保内容完整展示" is-link />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">必填字段</view>
        <see-cell title="用户名" value="请输入" is-required />
        <see-cell title="手机号" value="请输入" is-required is-link />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">跳转页面</view>
        <see-cell title="个人中心" is-link to="/pages/index/index" />
        <see-cell title="系统设置" icon="⚙️" is-link to="/pages/index/index" />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">自定义插槽</view>
        <see-cell title="用户头像">
          <template #right>
            <view style="width: 60rpx; height: 60rpx; background: #eee; border-radius: 50%" />
          </template>
        </see-cell>
        <see-cell>
          <template #title>
            <text style="color: #07c160; font-weight: bold">自定义标题</text>
          </template>
          <template #value>
            <text style="color: #ee0a24">自定义值</text>
          </template>
        </see-cell>
        <see-cell title="自定义图标">
          <template #icon>
            <view style="width: 40rpx; height: 40rpx; background: #1989fa; border-radius: 8rpx" />
          </template>
        </see-cell>
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">无边框</view>
        <see-cell title="无下边框" value="内容" :border="false" />
        <see-cell title="无下边框" value="内容" :border="false" />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">居中对齐</view>
        <see-cell title="居中显示" value="内容" is-center />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">点击反馈</view>
        <see-cell title="背景反馈" value="点击试试" click-effect="background" @on-click="onCellClick" />
        <see-cell title="透明度反馈" value="点击试试" click-effect="opacity" @on-click="onCellClick" />
        <see-cell title="无反馈" value="点击试试" click-effect="none" @on-click="onCellClick" />
      </view>

      <view class="demo-cell__section">
        <view class="demo-cell__title">自定义高度与标题宽度</view>
        <see-cell title="标题" value="自定义高度" height="120rpx" />
        <see-cell title="标题宽度 200rpx" value="内容" title-width="200rpx" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
const onCellClick = () => {
  uni.showToast({ title: '点击了单元格', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.demo-cell {
  padding-bottom: 40rpx;

  &__section {
    margin-bottom: 20rpx;
  }

  &__title {
    padding: 20rpx 30rpx 10rpx;
    font-size: 26rpx;
    color: #999;
  }
}
</style>
