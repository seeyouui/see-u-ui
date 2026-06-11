<template>
  <view class="demo-steps">
    <!-- 1. 基础用法 -->
    <view class="demo-section">
      <text class="demo-section__title">1. 基础用法</text>
      <see-steps v-model="current1" :steps="basicSteps" />
    </view>

    <!-- 2. 垂直方向 -->
    <view class="demo-section">
      <text class="demo-section__title">2. 垂直方向</text>
      <see-steps v-model="current2" :steps="basicSteps" direction="vertical" />
    </view>

    <!-- 3. 圆点样式 -->
    <view class="demo-section">
      <text class="demo-section__title">3. 圆点样式</text>
      <see-steps v-model="current3" :steps="basicSteps" :is-dot-style="true" />
    </view>

    <!-- 4. 错误状态 -->
    <view class="demo-section">
      <text class="demo-section__title">4. 错误状态</text>
      <see-steps v-model="current4" :steps="errorSteps" />
    </view>

    <!-- 5. 可点击 -->
    <view class="demo-section">
      <text class="demo-section__title">5. 可点击切换</text>
      <see-steps v-model="current5" :steps="basicSteps" :is-clickable="true" @on-change="onChange" />
    </view>

    <!-- 6. 自定义颜色 -->
    <view class="demo-section">
      <text class="demo-section__title">6. 自定义颜色</text>
      <see-steps v-model="current6" :steps="basicSteps" active-color="#ff6b6b" />
    </view>

    <!-- 底部操作 -->
    <view class="demo-actions">
      <text class="demo-btn" @tap="prevStep">上一步</text>
      <text class="demo-btn" @tap="nextStep">下一步</text>
    </view>

    <!-- 底部占位 -->
    <view style="height: 100rpx" />
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SeeSteps from '@/uni_modules/see-u-ui/components/see-steps/see-steps.vue'

const current1 = ref(1)
const current2 = ref(1)
const current3 = ref(1)
const current4 = ref(0)
const current5 = ref(1)
const current6 = ref(1)

const basicSteps = [
  { title: '步骤一', description: '填写基本信息' },
  { title: '步骤二', description: '确认订单信息' },
  { title: '步骤三', description: '完成支付' }
]

const errorSteps = [
  { title: '步骤一', status: 'finish' as const },
  { title: '步骤二', status: 'error' as const },
  { title: '步骤三', status: 'wait' as const }
]

const onChange = (index: number) => {
  uni.showToast({ title: `点击步骤 ${index + 1}`, icon: 'none' })
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
