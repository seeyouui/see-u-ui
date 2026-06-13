<template>
  <see-config>
    <view class="container">
      <!-- 基础示例 -->
      <view class="section">
        <text class="section__title">{{ t('scratchCard.demo.basic') }}</text>
        <text class="section__tip">{{ t('scratchCard.demo.basicTip', { threshold: 60 }) }}</text>
        <view class="card">
          <see-scratch-card
            :width="620"
            :height="320"
            :cover-text="t('scratchCard.demo.scratch')"
            cover-text-color="#ffffff"
            :cover-text-size="44"
            :brush-size="36"
            :threshold="50"
            @on-start="onStart"
            @on-progress="onProgress"
            @on-complete="onComplete"
          >
            <view class="prize prize--gold">
              <text class="prize__icon">🎉</text>
              <text class="prize__label">{{ t('scratchCard.demo.congrats') }}</text>
              <text class="prize__value">{{ t('scratchCard.demo.redPacket10') }}</text>
            </view>
          </see-scratch-card>
        </view>
      </view>

      <!-- 彩色涂层 -->
      <view class="section">
        <text class="section__title">{{ t('scratchCard.demo.colorful') }}</text>
        <text class="section__tip">{{ t('scratchCard.demo.colorfulTip') }}</text>
        <view class="card-group">
          <view class="card card--half">
            <see-scratch-card
              :width="300"
              :height="160"
              cover-color="#ff6b6b"
              :cover-text="t('scratchCard.demo.openRedEnvelope')"
              cover-text-color="#ffffff"
              :cover-text-size="36"
              :brush-size="28"
              :threshold="40"
            >
              <view class="prize prize--red">
                <text class="prize__value">{{ t('scratchCard.demo.points50') }}</text>
                <text class="prize__label">{{ t('scratchCard.demo.credited') }}</text>
              </view>
            </see-scratch-card>
          </view>
          <view class="card card--half">
            <see-scratch-card
              :width="300"
              :height="160"
              cover-color="#3ca7ff"
              :cover-text="t('scratchCard.demo.openGift')"
              cover-text-color="#ffffff"
              :cover-text-size="36"
              :brush-size="28"
              :threshold="40"
            >
              <view class="prize prize--blue">
                <text class="prize__value">{{ t('scratchCard.demo.coupon') }}</text>
                <text class="prize__label">{{ t('scratchCard.demo.discount20') }}</text>
              </view>
            </see-scratch-card>
          </view>
        </view>
      </view>

      <!-- 金色涂层 -->
      <view class="section">
        <text class="section__title">{{ t('scratchCard.demo.golden') }}</text>
        <text class="section__tip">{{ t('scratchCard.demo.goldenTip', { threshold: 30 }) }}</text>
        <view class="card">
          <see-scratch-card
            :width="620"
            :height="200"
            cover-color="#d4a84b"
            :cover-text="t('scratchCard.demo.winBig')"
            cover-text-color="#ffffff"
            :cover-text-size="40"
            :brush-size="40"
            :threshold="30"
          >
            <view class="prize prize--gold">
              <text class="prize__icon">🏆</text>
              <text class="prize__value">{{ t('scratchCard.demo.freeOrder') }}</text>
            </view>
          </see-scratch-card>
        </view>
      </view>

      <!-- 禁用状态 -->
      <view class="section">
        <text class="section__title">{{ t('scratchCard.demo.disabled') }}</text>
        <text class="section__tip">{{ t('scratchCard.demo.disabledTip') }}</text>
        <view class="card">
          <see-scratch-card :width="620" :height="200" is-disabled :cover-text="t('scratchCard.demo.expired')">
            <view class="prize prize--disabled">
              <text class="prize__label">{{ t('scratchCard.demo.activityEnded') }}</text>
            </view>
          </see-scratch-card>
        </view>
      </view>

      <!-- 进度显示 -->
      <view v-if="lastProgress > 0" class="section">
        <view class="progress-bar">
          <text class="progress-bar__label">{{ t('scratchCard.demo.lastProgress', { percent: lastProgress }) }}</text>
          <view class="progress-bar__track">
            <view class="progress-bar__fill" :style="{ width: lastProgress + '%' }" />
          </view>
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeScratchCard')

const lastProgress = ref(0)

const onStart = () => {
  console.log('🎫 刮刮卡开始刮')
}

const onProgress = (percent: number) => {
  lastProgress.value = percent
  console.log('刮开进度：', percent, '%')
}

const onComplete = (percent: number) => {
  uni.showToast({ title: t('scratchCard.demo.won'), icon: 'success' })
  console.log('刮开完成，进度：', percent, '%')
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  padding: 32rpx 24rpx 80rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, #f9fafc 0%, #f2f3f7 100%);
}

// ---- 页面标题 ----
.header {
  padding: 20rpx 8rpx 32rpx;
  &__title {
    display: block;
    font-size: 44rpx;
    font-weight: 800;
    color: #1a1a2e;
    letter-spacing: 2rpx;
  }
  &__desc {
    display: block;
    margin-top: 12rpx;
    font-size: 26rpx;
    color: #8a8f99;
    line-height: 1.5;
  }
}

// ---- 区块 ----
.section {
  margin-bottom: 40rpx;
  &__title {
    display: block;
    font-size: 30rpx;
    font-weight: 700;
    color: #2e2f33;
    margin-bottom: 8rpx;
    padding-left: 8rpx;
  }
  &__tip {
    display: block;
    font-size: 24rpx;
    color: #adb0bb;
    margin-bottom: 20rpx;
    padding-left: 8rpx;
  }
}

// ---- 卡片容器 ----
.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: center;
}

.card-group {
  display: flex;
  gap: 20rpx;
}

.card--half {
  flex: 1;
}

// ---- 奖品内容 ----
.prize {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border-radius: 20rpx;
  gap: 8rpx;

  &__icon {
    font-size: 48rpx;
  }
  &__label {
    font-size: 26rpx;
    color: #999;
    font-weight: 500;
  }
  &__value {
    font-size: 40rpx;
    font-weight: 800;
    letter-spacing: 2rpx;
  }

  &--gold {
    background: linear-gradient(135deg, #fff9ed, #fff3d6);
    .prize__value {
      color: #d4a84b;
    }
  }
  &--red {
    background: linear-gradient(135deg, #fff2f2, #ffe9e9);
    .prize__value {
      color: #ff6b6b;
    }
  }
  &--blue {
    background: linear-gradient(135deg, #f2f8ff, #e8f2ff);
    .prize__value {
      color: #3ca7ff;
    }
  }
  &--disabled {
    background: linear-gradient(135deg, #f5f5f5, #eee);
    .prize__label {
      color: #bbb;
    }
  }
}

// ---- 进度条 ----
.progress-bar {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);

  &__label {
    display: block;
    font-size: 26rpx;
    color: #666;
    margin-bottom: 16rpx;
  }
  &__track {
    height: 12rpx;
    background: #f0f0f0;
    border-radius: 6rpx;
    overflow: hidden;
  }
  &__fill {
    height: 100%;
    background: linear-gradient(90deg, #3ca7ff, #6ec5ff);
    border-radius: 6rpx;
    transition: width 0.3s ease;
  }
}
</style>
