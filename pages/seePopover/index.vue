<template>
  <see-config>
    <text class="title">{{ t('popover.demo.click') }}</text>
    <view class="demo-content">
      <see-popover v-model:show="show1">
        <see-button :title="t('popover.demo.clickBtn')" type="primary" />
        <template #content>
          <view class="popover-content">
            <text class="popover-text">{{ t('popover.demo.content') }}</text>
          </view>
        </template>
      </see-popover>
    </view>

    <text class="title">{{ t('popover.demo.title') }}</text>
    <view class="demo-content">
      <see-popover v-model:show="show2" :title="t('popover.demo.titleText')">
        <see-button :title="t('popover.demo.titleBtn')" type="primary" />
        <template #content>
          <view class="popover-content">
            <text class="popover-text">{{ t('popover.demo.titleContent') }}</text>
          </view>
        </template>
      </see-popover>
    </view>

    <text class="title">{{ t('popover.demo.position') }}</text>
    <view class="demo-content">
      <view class="popover-grid">
        <see-popover v-model:show="show3" position="top">
          <see-button :title="t('popover.demo.top')" type="primary" size="small" />
          <template #content>
            <view class="popover-content">
              <text class="popover-text">{{ t('popover.demo.topContent') }}</text>
            </view>
          </template>
        </see-popover>
        <see-popover v-model:show="show4" position="bottom">
          <see-button :title="t('popover.demo.bottom')" type="primary" size="small" />
          <template #content>
            <view class="popover-content">
              <text class="popover-text">{{ t('popover.demo.bottomContent') }}</text>
            </view>
          </template>
        </see-popover>
        <see-popover v-model:show="show5" position="left">
          <see-button :title="t('popover.demo.left')" type="primary" size="small" />
          <template #content>
            <view class="popover-content">
              <text class="popover-text">{{ t('popover.demo.leftContent') }}</text>
            </view>
          </template>
        </see-popover>
        <see-popover v-model:show="show6" position="right">
          <see-button :title="t('popover.demo.right')" type="primary" size="small" />
          <template #content>
            <view class="popover-content">
              <text class="popover-text">{{ t('popover.demo.rightContent') }}</text>
            </view>
          </template>
        </see-popover>
      </view>
    </view>

    <text class="title">{{ t('popover.demo.closeBtn') }}</text>
    <view class="demo-content">
      <see-popover v-model:show="show7" :title="t('popover.demo.closeBtnText')" is-show-close-btn>
        <see-button :title="t('popover.demo.closeBtnBtn')" type="primary" />
        <template #content>
          <view class="popover-content">
            <text class="popover-text">{{ t('popover.demo.closeTip') }}</text>
          </view>
        </template>
      </see-popover>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seePopover')

const show1 = ref(false)
const show2 = ref(false)
const show3 = ref(false)
const show4 = ref(false)
const show5 = ref(false)
const show6 = ref(false)
const show7 = ref(false)
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
.popover-content {
  padding: 16rpx;
}
.popover-text {
  font-size: 26rpx;
  color: var(--see-main-color);
}
.popover-grid {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
