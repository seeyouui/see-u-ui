<template>
  <see-config>
    <view class="demo-loading-page">
      <view class="demo-section">
        <text class="demo-title">基础用法</text>
        <view class="demo-box">
          <see-loading-page :loading="basicLoading" message="加载中...">
            <view class="demo-content">
              <text>内容加载完成！</text>
            </view>
          </see-loading-page>
        </view>
        <see-button size="mini" type="primary" is-ripple @click="basicLoading = !basicLoading">
          {{ basicLoading ? '加载完成' : '重新加载' }}
        </see-button>
      </view>

      <view class="demo-section">
        <text class="demo-title">自定义提示文字</text>
        <view class="demo-box">
          <see-loading-page :loading="true" message="正在获取数据，请稍候..." />
        </view>
      </view>

      <view class="demo-section">
        <text class="demo-title">自定义图标类型</text>
        <view class="demo-box">
          <see-loading-page :loading="true" icon-type="circular" message="circular 类型" />
        </view>
      </view>

      <view class="demo-section">
        <text class="demo-title">模拟加载完成</text>
        <view class="demo-box">
          <see-loading-page :loading="simLoading" message="模拟加载中...">
            <view class="demo-content">
              <text>模拟数据加载完成！</text>
              <text>这里是异步加载后的内容区域。</text>
            </view>
          </see-loading-page>
        </view>
        <see-button size="mini" type="primary" is-ripple @click="startSimulate">开始模拟加载</see-button>
      </view>

      <view class="demo-section">
        <text class="demo-title">全屏模式</text>
        <see-button size="mini" type="primary" is-ripple @click="fullscreenLoading = true">显示全屏加载</see-button>
        <see-loading-page :loading="fullscreenLoading" is-fullscreen message="全屏加载中...">
          <view class="demo-content">
            <text>全屏加载完成！</text>
          </view>
        </see-loading-page>
        <see-button v-if="fullscreenLoading" size="mini" type="primary" is-ripple @click="fullscreenLoading = false">关闭全屏加载</see-button>
      </view>

      <view class="demo-section">
        <text class="demo-title">自定义背景色</text>
        <view class="demo-box">
          <see-loading-page :loading="true" message="自定义背景" background="rgba(0, 0, 0, 0.6)" />
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const basicLoading = ref(true)
const simLoading = ref(false)
const fullscreenLoading = ref(false)

function startSimulate() {
  simLoading.value = true
  setTimeout(() => {
    simLoading.value = false
  }, 2000)
}
</script>

<style lang="scss" scoped>
.demo-loading-page {
  padding: 24rpx;
}

.demo-section {
  margin-bottom: 40rpx;
}

.demo-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.demo-box {
  border: 1rpx solid #eee;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
  min-height: 300rpx;
}

.demo-content {
  padding: 40rpx;
  text-align: center;
  font-size: 28rpx;
}
</style>
