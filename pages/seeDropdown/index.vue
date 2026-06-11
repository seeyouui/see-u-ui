<template>
  <view class="demo-dropdown">
    <view class="demo-header">
      <text class="demo-header__title">Dropdown 下拉菜单</text>
    </view>

    <!-- 1. 基础用法 -->
    <view class="demo-section">
      <text class="demo-section__title">1. 基础用法</text>
      <see-dropdown>
        <template #menu>
          <see-dropdown-item name="sort" title="排序" />
          <see-dropdown-item name="filter" title="筛选" />
        </template>
        <template #panels>
          <see-dropdown-panel name="sort">
            <view class="panel-content">
              <text>排序面板内容</text>
            </view>
          </see-dropdown-panel>
          <see-dropdown-panel name="filter">
            <view class="panel-content">
              <text>筛选面板内容</text>
            </view>
          </see-dropdown-panel>
        </template>
      </see-dropdown>
    </view>

    <!-- 2. 禁用项 -->
    <view class="demo-section">
      <text class="demo-section__title">2. 禁用项</text>
      <see-dropdown>
        <template #menu>
          <see-dropdown-item name="enabled" title="可选" />
          <see-dropdown-item name="disabled" title="禁用" :is-disabled="true" />
        </template>
        <template #panels>
          <see-dropdown-panel name="enabled">
            <view class="panel-content">
              <text>可选面板</text>
            </view>
          </see-dropdown-panel>
        </template>
      </see-dropdown>
    </view>

    <!-- 3. 无遮罩 -->
    <view class="demo-section">
      <text class="demo-section__title">3. 无遮罩</text>
      <see-dropdown :is-overlay="false">
        <template #menu>
          <see-dropdown-item name="sort2" title="排序" />
          <see-dropdown-item name="filter2" title="筛选" />
        </template>
        <template #panels>
          <see-dropdown-panel name="sort2">
            <view class="panel-content">
              <text>排序（无遮罩）</text>
            </view>
          </see-dropdown-panel>
          <see-dropdown-panel name="filter2">
            <view class="panel-content">
              <text>筛选（无遮罩）</text>
            </view>
          </see-dropdown-panel>
        </template>
      </see-dropdown>
    </view>

    <!-- 底部占位 -->
    <view style="height: 400rpx" />
  </view>
</template>

<script lang="ts" setup>
import SeeDropdown from '@/uni_modules/see-u-ui/components/see-dropdown/see-dropdown.vue'
import SeeDropdownItem from '@/uni_modules/see-u-ui/components/see-dropdown-item/see-dropdown-item.vue'
import SeeDropdownPanel from '@/uni_modules/see-u-ui/components/see-dropdown-panel/see-dropdown-panel.vue'
</script>

<style lang="scss" scoped>
.demo-dropdown {
  background: var(--see-bg-color);
  min-height: 100vh;
}

.demo-header {
  padding: 32rpx;

  &__title {
    font-size: 36rpx;
    font-weight: 600;
    color: var(--see-main-color);
  }
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

.panel-content {
  padding: 32rpx;
  min-height: 200rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--see-content-color);
  font-size: 28rpx;
}
</style>
