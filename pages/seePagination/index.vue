<template>
  <view class="demo-pagination">
    <!-- 1. number 模式 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('pagination.demo.number') }}</text>
      <see-pagination v-model="page1" :total="200" :page-size="10" mode="number" />
    </view>

    <!-- 2. button 模式 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('pagination.demo.button') }}</text>
      <see-pagination v-model="page2" :total="100" :page-size="10" mode="button" />
    </view>

    <!-- 3. simple 模式 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('pagination.demo.simple') }}</text>
      <see-pagination v-model="page3" :total="100" :page-size="10" mode="simple" />
    </view>

    <!-- 4. 显示总数 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('pagination.demo.showTotal') }}</text>
      <see-pagination v-model="page4" :total="150" :page-size="10" :is-show-total="true" />
    </view>

    <!-- 5. 自定义文字 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('pagination.demo.customText') }}</text>
      <see-pagination
        v-model="page5"
        :total="100"
        :page-size="10"
        :prev-text="t('pagination.demo.prevText')"
        :next-text="t('pagination.demo.nextText')"
      />
    </view>

    <!-- 6. 少量页码 -->
    <view class="demo-section">
      <text class="demo-section__title">{{ t('pagination.demo.fewPages') }}</text>
      <see-pagination v-model="page6" :total="30" :page-size="10" />
    </view>

    <!-- 底部占位 -->
    <view style="height: 100rpx" />
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import SeePagination from '@/uni_modules/see-u-ui/components/see-pagination/see-pagination.vue'

const { t } = useI18n()
useNavbarI18n('navbar.seePagination')

const page1 = ref(1)
const page2 = ref(1)
const page3 = ref(1)
const page4 = ref(1)
const page5 = ref(1)
const page6 = ref(1)
</script>

<style lang="scss" scoped>
.demo-pagination {
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
