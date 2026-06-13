<template>
  <view class="demo-steps">
    <!-- 1. 基础用法 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('steps.demo.basic') }}</text>
      <see-steps v-model="current1" :steps="basicSteps" />
    </view>

    <!-- 2. 垂直方向 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('steps.demo.vertical') }}</text>
      <see-steps v-model="current2" :steps="basicSteps" direction="vertical" />
    </view>

    <!-- 3. 圆点样式 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('steps.demo.dotStyle') }}</text>
      <see-steps v-model="current3" :steps="basicSteps" :is-dot-style="true" />
    </view>

    <!-- 4. 错误状态 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('steps.demo.error') }}</text>
      <see-steps v-model="current4" :steps="errorSteps" />
    </view>

    <!-- 5. 可点击切换 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('steps.demo.clickable') }}</text>
      <see-steps v-model="current5" :steps="basicSteps" :is-clickable="true" @on-change="onChange" />
    </view>

    <!-- 6. 自定义颜色 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('steps.demo.customColor') }}</text>
      <see-steps v-model="current6" :steps="basicSteps" active-color="#ff6b6b" />
    </view>

    <!-- 底部操作 -->
    <view class="demo-actions">
      <text class="demo-btn" @tap="prevStep">{{ t('steps.demo.prev') }}</text>
      <text class="demo-btn" @tap="nextStep">{{ t('steps.demo.next') }}</text>
    </view>

    <!-- 底部占位 -->
    <view style="height: 100rpx" />
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import SeeSteps from '@/uni_modules/see-u-ui/components/see-steps/see-steps.vue'

const { t } = useI18n()
useNavbarI18n('navbar.seeSteps')

const current1 = ref(1)
const current2 = ref(1)
const current3 = ref(1)
const current4 = ref(0)
const current5 = ref(1)
const current6 = ref(1)

const basicSteps = [
  { title: t('steps.demo.step1'), description: t('steps.demo.desc1') },
  { title: t('steps.demo.step2'), description: t('steps.demo.desc2') },
  { title: t('steps.demo.step3'), description: t('steps.demo.desc3') }
]

const errorSteps = [
  { title: t('steps.demo.step1'), status: 'finish' as const },
  { title: t('steps.demo.step2'), status: 'error' as const },
  { title: t('steps.demo.step3'), status: 'wait' as const }
]

const onChange = (index: number) => {
  uni.showToast({ title: t('steps.demo.clickStep', { index: index + 1 }), icon: 'none' })
}

const prevStep = () => {
  if (current5.value > 0) current5.value--
}

const nextStep = () => {
  if (current5.value < basicSteps.length - 1) current5.value++
}
</script>

<style lang="scss" scoped>
.demo-steps {
  padding: 0 32rpx 40rpx;
  background: var(--see-bg-color);
  min-height: 100vh;
}

.demo-section {
  margin-bottom: 48rpx;

  &__title {
    display: block;
    padding: 24rpx 0;
    font-size: 28rpx;
    color: var(--see-tips-color);
    font-weight: 500;
  }
}

.demo-actions {
  display: flex;
  gap: 16rpx;
  padding: 32rpx 0;
  justify-content: center;
}

.demo-btn {
  padding: 16rpx 32rpx;
  background: var(--see-primary);
  color: #ffffff;
  border-radius: 8rpx;
  font-size: 28rpx;
}
</style>
