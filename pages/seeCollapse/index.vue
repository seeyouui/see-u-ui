<template>
  <see-config>
    <text class="title">{{ t('collapse.demo.basic') }}</text>
    <view class="demo-content">
      <see-collapse v-model="active1">
        <see-collapse-item name="1" :title="t('collapse.demo.title1')">
          <text class="collapse-text">{{ t('collapse.demo.content1') }}</text>
        </see-collapse-item>
        <see-collapse-item name="2" :title="t('collapse.demo.title2')">
          <text class="collapse-text">{{ t('collapse.demo.content2') }}</text>
        </see-collapse-item>
        <see-collapse-item name="3" :title="t('collapse.demo.title3')">
          <text class="collapse-text">{{ t('collapse.demo.content3') }}</text>
        </see-collapse-item>
      </see-collapse>
    </view>

    <text class="title">{{ t('collapse.demo.accordion') }}</text>
    <view class="demo-content">
      <see-collapse v-model="active2" is-accordion>
        <see-collapse-item name="1" :title="t('collapse.demo.title1')">
          <text class="collapse-text">{{ t('collapse.demo.accordionContent1') }}</text>
        </see-collapse-item>
        <see-collapse-item name="2" :title="t('collapse.demo.title2')">
          <text class="collapse-text">{{ t('collapse.demo.accordionContent2') }}</text>
        </see-collapse-item>
        <see-collapse-item name="3" :title="t('collapse.demo.title3')">
          <text class="collapse-text">{{ t('collapse.demo.accordionContent3') }}</text>
        </see-collapse-item>
      </see-collapse>
    </view>

    <text class="title">{{ t('collapse.demo.disabled') }}</text>
    <view class="demo-content">
      <see-collapse v-model="active3">
        <see-collapse-item name="1" :title="t('collapse.demo.normalItem')">
          <text class="collapse-text">{{ t('collapse.demo.normalContent') }}</text>
        </see-collapse-item>
        <see-collapse-item name="2" :title="t('collapse.demo.disabledItem')" is-disabled>
          <text class="collapse-text">{{ t('collapse.demo.disabledContent') }}</text>
        </see-collapse-item>
        <see-collapse-item name="3" :title="t('collapse.demo.normalItem')">
          <text class="collapse-text">{{ t('collapse.demo.normalContent') }}</text>
        </see-collapse-item>
      </see-collapse>
    </view>

    <text class="title">{{ t('collapse.demo.icon') }}</text>
    <view class="demo-content">
      <see-collapse v-model="active4">
        <see-collapse-item name="1" :title="t('collapse.demo.setting')" icon="⚙️">
          <text class="collapse-text">{{ t('collapse.demo.settingContent') }}</text>
        </see-collapse-item>
        <see-collapse-item name="2" :title="t('collapse.demo.notification')" icon="🔔">
          <text class="collapse-text">{{ t('collapse.demo.notificationContent') }}</text>
        </see-collapse-item>
      </see-collapse>
    </view>

    <text class="title">{{ t('collapse.demo.noBorder') }}</text>
    <view class="demo-content">
      <see-collapse v-model="active5" :is-show-border="false">
        <see-collapse-item name="1" :title="t('collapse.demo.title1')">
          <text class="collapse-text">{{ t('collapse.demo.noBorderContent') }}</text>
        </see-collapse-item>
        <see-collapse-item name="2" :title="t('collapse.demo.title2')">
          <text class="collapse-text">{{ t('collapse.demo.content2') }}</text>
        </see-collapse-item>
      </see-collapse>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeCollapse')

const active1 = ref<string[]>([])
const active2 = ref<string[]>([])
const active3 = ref<string[]>(['1'])
const active4 = ref<string[]>([])
const active5 = ref<string[]>([])
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
.collapse-text {
  font-size: 26rpx;
  color: var(--see-content-color);
  line-height: 1.6;
}
</style>
