<template>
  <view class="demo-subsection">
    <!-- 1. 基础用法 (default) -->
    <view class="demo-section">
      <text class="demo-section__title">1. 基础用法 (default)</text>
      <see-subsection v-model="active1" :options="basicOptions" />
    </view>

    <!-- 2. Button 样式 -->
    <view class="demo-section">
      <text class="demo-section__title">2. Button 样式</text>
      <see-subsection v-model="active2" :options="basicOptions" type="button" />
    </view>

    <!-- 3. Pill 样式 -->
    <view class="demo-section">
      <text class="demo-section__title">3. Pill 样式</text>
      <see-subsection v-model="active3" :options="basicOptions" type="pill" />
    </view>

    <!-- 4. 自定义颜色 -->
    <view class="demo-section">
      <text class="demo-section__title">4. 自定义颜色</text>
      <see-subsection v-model="active4" :options="basicOptions" active-color="#ff6b6b" />
    </view>

    <!-- 5. 禁用选项 -->
    <view class="demo-section">
      <text class="demo-section__title">5. 禁用选项</text>
      <see-subsection v-model="active5" :options="disabledOptions" />
    </view>

    <!-- 6. 占满整行 -->
    <view class="demo-section">
      <text class="demo-section__title">6. 占满整行</text>
      <see-subsection v-model="active6" :options="basicOptions" :is-full-width="true" />
    </view>

    <!-- 7. 小尺寸 -->
    <view class="demo-section">
      <text class="demo-section__title">7. 小尺寸</text>
      <see-subsection v-model="active7" :options="basicOptions" size="small" />
    </view>

    <!-- 底部占位 -->
    <view style="height: 100rpx" />
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SeeSubsection from '@/uni_modules/see-u-ui/components/see-subsection/see-subsection.vue'

const active1 = ref('one')
const active2 = ref('one')
const active3 = ref('one')
const active4 = ref('one')
const active5 = ref('one')
const active6 = ref('one')
const active7 = ref('one')

const basicOptions = [
  { label: '选项一', value: 'one' },
  { label: '选项二', value: 'two' },
  { label: '选项三', value: 'three' }
]

const disabledOptions = [
  { label: '可用', value: 'one' },
  { label: '禁用', value: 'two', isDisabled: true },
  { label: '可用', value: 'three' }
]
</script>

<style lang="scss" scoped>
.demo-subsection {
  padding: 0 32rpx 40rpx;
  background: var(--see-bg-color);
  min-height: 100vh;
}

.demo-section {
  margin-bottom: 32rpx;

  &__title {
    display: block;
    padding: 24rpx 0;
    font-size: 28rpx;
    color: var(--see-tips-color);
    font-weight: 500;
  }
}
</style>
