<template>
  <view class="demo-tabs">
    <!-- 1. 基础用法 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabs.demo.basic') }}</text>
      <see-tabs v-model="activeTab1">
        <see-tab-pane name="tab1" :title="t('tabs.demo.tab1')">
          <view class="pane-content">
            <text>{{ t('tabs.demo.content1') }}</text>
          </view>
        </see-tab-pane>
        <see-tab-pane name="tab2" :title="t('tabs.demo.tab2')">
          <view class="pane-content">
            <text>{{ t('tabs.demo.content2') }}</text>
          </view>
        </see-tab-pane>
        <see-tab-pane name="tab3" :title="t('tabs.demo.tab3')">
          <view class="pane-content">
            <text>{{ t('tabs.demo.content3') }}</text>
          </view>
        </see-tab-pane>
      </see-tabs>
    </view>

    <!-- 2. Card 样式 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabs.demo.cardStyle') }}</text>
      <see-tabs v-model="activeTab2" type="card">
        <see-tab-pane name="tab1" :title="t('tabs.demo.option1')">
          <view class="pane-content">
            <text>{{ t('tabs.demo.cardContent1') }}</text>
          </view>
        </see-tab-pane>
        <see-tab-pane name="tab2" :title="t('tabs.demo.option2')">
          <view class="pane-content">
            <text>{{ t('tabs.demo.cardContent2') }}</text>
          </view>
        </see-tab-pane>
      </see-tabs>
    </view>

    <!-- 3. Button 样式 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabs.demo.buttonStyle') }}</text>
      <see-tabs v-model="activeTab3" type="button">
        <see-tab-pane name="tab1" :title="t('tabs.demo.option1')">
          <view class="pane-content">
            <text>{{ t('tabs.demo.buttonContent1') }}</text>
          </view>
        </see-tab-pane>
        <see-tab-pane name="tab2" :title="t('tabs.demo.option2')">
          <view class="pane-content">
            <text>{{ t('tabs.demo.buttonContent2') }}</text>
          </view>
        </see-tab-pane>
      </see-tabs>
    </view>

    <!-- 4. Badge/Dot -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabs.demo.badge') }}</text>
      <see-tabs v-model="activeTab4">
        <see-tab-pane name="tab1" :title="t('tabs.demo.msg')" :badge="99">
          <view class="pane-content">
            <text>{{ t('tabs.demo.msgList') }}</text>
          </view>
        </see-tab-pane>
        <see-tab-pane name="tab2" :title="t('tabs.demo.notify')" :dot="true">
          <view class="pane-content">
            <text>{{ t('tabs.demo.notifyList') }}</text>
          </view>
        </see-tab-pane>
        <see-tab-pane name="tab3" :title="t('tabs.demo.all')">
          <view class="pane-content">
            <text>{{ t('tabs.demo.allContent') }}</text>
          </view>
        </see-tab-pane>
      </see-tabs>
    </view>

    <!-- 5. 可关闭标签 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabs.demo.closable') }}</text>
      <see-tabs v-model="activeTab5" @on-close="onClose">
        <see-tab-pane name="tab1" :title="t('tabs.demo.tab1')" :closable="true">
          <view class="pane-content">
            <text>{{ t('tabs.demo.closable1') }}</text>
          </view>
        </see-tab-pane>
        <see-tab-pane name="tab2" :title="t('tabs.demo.tab2')" :closable="true">
          <view class="pane-content">
            <text>{{ t('tabs.demo.closable2') }}</text>
          </view>
        </see-tab-pane>
        <see-tab-pane name="tab3" :title="t('tabs.demo.tab3')">
          <view class="pane-content">
            <text>{{ t('tabs.demo.notClosable') }}</text>
          </view>
        </see-tab-pane>
      </see-tabs>
    </view>

    <!-- 6. 禁用标签 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabs.demo.disabled') }}</text>
      <see-tabs v-model="activeTab6">
        <see-tab-pane name="tab1" :title="t('tabs.demo.enabled')">
          <view class="pane-content">
            <text>{{ t('tabs.demo.enabledContent') }}</text>
          </view>
        </see-tab-pane>
        <see-tab-pane name="tab2" :title="t('tabs.demo.disabledTab')" :is-disabled="true">
          <view class="pane-content">
            <text>{{ t('tabs.demo.disabledContent') }}</text>
          </view>
        </see-tab-pane>
        <see-tab-pane name="tab3" :title="t('tabs.demo.enabled')">
          <view class="pane-content">
            <text>{{ t('tabs.demo.enabledContent') }}</text>
          </view>
        </see-tab-pane>
      </see-tabs>
    </view>

    <!-- 7. 自定义颜色 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('tabs.demo.customColor') }}</text>
      <see-tabs v-model="activeTab7" active-color="#ff6b6b" inactive-color="#999">
        <see-tab-pane name="tab1" :title="t('tabs.demo.tab1')">
          <view class="pane-content">
            <text>{{ t('tabs.demo.customColor1') }}</text>
          </view>
        </see-tab-pane>
        <see-tab-pane name="tab2" :title="t('tabs.demo.tab2')">
          <view class="pane-content">
            <text>{{ t('tabs.demo.customColor2') }}</text>
          </view>
        </see-tab-pane>
      </see-tabs>
    </view>

    <!-- 底部占位 -->
    <view style="height: 100rpx" />
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import SeeTabs from '@/uni_modules/see-u-ui/components/see-tabs/see-tabs.vue'
import SeeTabPane from '@/uni_modules/see-u-ui/components/see-tab-pane/see-tab-pane.vue'

const { t } = useI18n()
useNavbarI18n('navbar.seeTabs')

const activeTab1 = ref('tab1')
const activeTab2 = ref('tab1')
const activeTab3 = ref('tab1')
const activeTab4 = ref('tab1')
const activeTab5 = ref('tab1')
const activeTab6 = ref('tab1')
const activeTab7 = ref('tab1')

const onClose = (name: string | number) => {
  uni.showToast({ title: t('tabs.demo.close', { name }), icon: 'none' })
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
