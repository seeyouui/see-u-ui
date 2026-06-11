<template>
  <view class="demo-tabs">
    <!-- 1. 基础用法 -->
    <view class="demo-section">
      <text class="demo-section__title">1. 基础用法 (line)</text>
      <see-tabs v-model="activeTab1">
        <see-tab-pane name="tab1" title="标签一">
          <view class="pane-content"><text>内容一</text></view>
        </see-tab-pane>
        <see-tab-pane name="tab2" title="标签二">
          <view class="pane-content"><text>内容二</text></view>
        </see-tab-pane>
        <see-tab-pane name="tab3" title="标签三">
          <view class="pane-content"><text>内容三</text></view>
        </see-tab-pane>
      </see-tabs>
    </view>

    <!-- 2. Card 样式 -->
    <view class="demo-section">
      <text class="demo-section__title">2. Card 样式</text>
      <see-tabs v-model="activeTab2" type="card">
        <see-tab-pane name="tab1" title="选项一">
          <view class="pane-content"><text>Card 内容一</text></view>
        </see-tab-pane>
        <see-tab-pane name="tab2" title="选项二">
          <view class="pane-content"><text>Card 内容二</text></view>
        </see-tab-pane>
      </see-tabs>
    </view>

    <!-- 3. Button 样式 -->
    <view class="demo-section">
      <text class="demo-section__title">3. Button 样式</text>
      <see-tabs v-model="activeTab3" type="button">
        <see-tab-pane name="tab1" title="选项一">
          <view class="pane-content"><text>Button 内容一</text></view>
        </see-tab-pane>
        <see-tab-pane name="tab2" title="选项二">
          <view class="pane-content"><text>Button 内容二</text></view>
        </see-tab-pane>
      </see-tabs>
    </view>

    <!-- 4. Badge/Dot -->
    <view class="demo-section">
      <text class="demo-section__title">4. Badge/Dot 徽标</text>
      <see-tabs v-model="activeTab4">
        <see-tab-pane name="tab1" title="消息" :badge="99">
          <view class="pane-content"><text>消息列表</text></view>
        </see-tab-pane>
        <see-tab-pane name="tab2" title="通知" :dot="true">
          <view class="pane-content"><text>通知列表</text></view>
        </see-tab-pane>
        <see-tab-pane name="tab3" title="全部">
          <view class="pane-content"><text>全部内容</text></view>
        </see-tab-pane>
      </see-tabs>
    </view>

    <!-- 5. 可关闭标签 -->
    <view class="demo-section">
      <text class="demo-section__title">5. 可关闭标签</text>
      <see-tabs v-model="activeTab5" @on-close="onClose">
        <see-tab-pane name="tab1" title="标签一" :closable="true">
          <view class="pane-content"><text>可关闭内容一</text></view>
        </see-tab-pane>
        <see-tab-pane name="tab2" title="标签二" :closable="true">
          <view class="pane-content"><text>可关闭内容二</text></view>
        </see-tab-pane>
        <see-tab-pane name="tab3" title="标签三">
          <view class="pane-content"><text>不可关闭</text></view>
        </see-tab-pane>
      </see-tabs>
    </view>

    <!-- 6. 禁用标签 -->
    <view class="demo-section">
      <text class="demo-section__title">6. 禁用标签</text>
      <see-tabs v-model="activeTab6">
        <see-tab-pane name="tab1" title="可选">
          <view class="pane-content"><text>可选内容</text></view>
        </see-tab-pane>
        <see-tab-pane name="tab2" title="禁用" :is-disabled="true">
          <view class="pane-content"><text>禁用内容</text></view>
        </see-tab-pane>
        <see-tab-pane name="tab3" title="可选">
          <view class="pane-content"><text>可选内容</text></view>
        </see-tab-pane>
      </see-tabs>
    </view>

    <!-- 7. 自定义颜色 -->
    <view class="demo-section">
      <text class="demo-section__title">7. 自定义颜色</text>
      <see-tabs v-model="activeTab7" active-color="#ff6b6b" inactive-color="#999">
        <see-tab-pane name="tab1" title="标签一">
          <view class="pane-content"><text>自定义颜色一</text></view>
        </see-tab-pane>
        <see-tab-pane name="tab2" title="标签二">
          <view class="pane-content"><text>自定义颜色二</text></view>
        </see-tab-pane>
      </see-tabs>
    </view>

    <!-- 底部占位 -->
    <view style="height: 100rpx" />
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SeeTabs from '@/uni_modules/see-u-ui/components/see-tabs/see-tabs.vue'
import SeeTabPane from '@/uni_modules/see-u-ui/components/see-tab-pane/see-tab-pane.vue'

const activeTab1 = ref('tab1')
const activeTab2 = ref('tab1')
const activeTab3 = ref('tab1')
const activeTab4 = ref('tab1')
const activeTab5 = ref('tab1')
const activeTab6 = ref('tab1')
const activeTab7 = ref('tab1')

const onClose = (name: string | number) => {
  uni.showToast({ title: `关闭: ${name}`, icon: 'none' })
}
</script>

<style lang="scss" scoped>
.demo-tabs {
  padding-bottom: 40rpx;
  background: var(--see-bg-color);
  min-height: 100vh;
}

.demo-section {
  margin-bottom: 32rpx;

  &__title {
    display: block;
    padding: 24rpx 32rpx;
    font-size: 28rpx;
    color: var(--see-tips-color);
    font-weight: 500;
  }
}

.pane-content {
  padding: 32rpx;
  min-height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--see-content-color);
  font-size: 28rpx;
}
</style>
