<template>
  <see-config>
    <text class="title">{{ t('skeleton.demo.basic') }}</text>
    <view class="demo-content">
      <see-skeleton />
    </view>

    <text class="title">{{ t('skeleton.demo.customRows') }}</text>
    <view class="demo-content">
      <see-skeleton :rows="5" />
    </view>

    <text class="title">{{ t('skeleton.demo.customRowWidth') }}</text>
    <view class="demo-content">
      <see-skeleton :row-width="['100%', '80%', '60%']" />
    </view>

    <text class="title">{{ t('skeleton.demo.withTitle') }}</text>
    <view class="demo-content">
      <see-skeleton :title="true" :rows="3" />
    </view>

    <text class="title">{{ t('skeleton.demo.withAvatarTitle') }}</text>
    <view class="demo-content">
      <see-skeleton :avatar="true" :title="true" :rows="3" />
    </view>

    <text class="title">{{ t('skeleton.demo.squareAvatar') }}</text>
    <view class="demo-content">
      <see-skeleton :avatar="true" avatar-shape="square" :rows="2" />
    </view>

    <text class="title">{{ t('skeleton.demo.disableAnimation') }}</text>
    <view class="demo-content">
      <see-skeleton :is-animate="false" />
    </view>

    <text class="title">{{ t('skeleton.demo.loadedContent') }}</text>
    <view class="demo-content">
      <see-skeleton :loading="isLoading">
        <view class="loaded-content">
          <text>{{ t('skeleton.demo.loadedText') }}</text>
          <text class="loaded-sub">{{ t('skeleton.demo.dataLoaded') }}</text>
        </view>
      </see-skeleton>
      <view class="btn-wrap">
        <see-button size="small" type="primary" is-ripple @click="toggleLoading">
          {{ isLoading ? t('skeleton.demo.loadComplete') : t('skeleton.demo.reload') }}
        </see-button>
      </view>
    </view>

    <text class="title">{{ t('skeleton.demo.loadedWithAvatar') }}</text>
    <view class="demo-content">
      <see-skeleton :loading="isLoading2" :avatar="true" :title="true" :rows="3">
        <view class="loaded-content">
          <view class="loaded-header">
            <view class="loaded-avatar" />
            <text class="loaded-name">{{ t('skeleton.demo.userName') }}</text>
          </view>
          <text>{{ t('skeleton.demo.avatarLoadedText') }}</text>
        </view>
      </see-skeleton>
      <view class="btn-wrap">
        <see-button size="small" type="primary" is-ripple @click="toggleLoading2">
          {{ isLoading2 ? t('skeleton.demo.loadComplete') : t('skeleton.demo.reload') }}
        </see-button>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeSkeleton')

const isLoading = ref(true)
const isLoading2 = ref(true)

const toggleLoading = () => {
  isLoading.value = !isLoading.value
}

const toggleLoading2 = () => {
  isLoading2.value = !isLoading2.value
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

.btn-wrap {
  margin-top: 20rpx;
}

.loaded-content {
  padding: 24rpx 0;
}

.loaded-sub {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: var(--see-tips-color);
}

.loaded-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.loaded-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: var(--see-primary);
  margin-right: 24rpx;
}

.loaded-name {
  font-size: 30rpx;
  font-weight: bold;
}
</style>
