<template>
  <see-config>
    <view class="container">
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">全局暗黑模式</view>
        </view>
        <view class="uni-list-detail">
          <text>支持浅色模式/暗黑模式切换，可随系统主题或通过 API 手动控制（支持 H5 / APP / 小程序）。</text>
        </view>
        <view class="theme-buttons">
          <view class="theme-button" :class="{ active: themeMode === 'light' }" @click="setLightMode">
            <text>浅色</text>
          </view>
          <view class="theme-button" :class="{ active: themeMode === 'dark' }" @click="setDarkMode">
            <text>暗黑</text>
          </view>
          <view class="theme-button" :class="{ active: themeMode === 'system' }" @click="setFollowSystem">
            <text>跟随系统</text>
          </view>
        </view>
      </view>
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">国际化配置</view>
          <view class="uni-list-cell-db">
            <picker disabled>
              <view class="uni-input">
                <text>中国</text>
              </view>
            </picker>
          </view>
        </view>
        <view class="uni-list-detail">
          <text>配置组件库的国际化语言环境，支持多语言切换。</text>
        </view>
      </view>
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">自定义主题</view>
          <view class="uni-list-cell-db">
            <picker disabled>
              <view class="uni-input">
                <text>默认主题</text>
              </view>
            </picker>
          </view>
        </view>
        <view class="uni-list-detail">
          <text>支持通过配置文件自定义主题样式。</text>
        </view>
      </view>
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">全局骨架屏</view>
          <view class="uni-list-cell-db">
            <switch disabled :checked="false" />
          </view>
        </view>
        <view class="uni-list-detail">
          <text>统一的全局骨架屏方案，优化页面加载过程中的视觉反馈。</text>
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useTheme } from '@/uni_modules/see-u-ui'

// 暗黑模式切换
const { themeMode, setLightMode, setDarkMode, setFollowSystem } = useTheme()
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  background-color: var(--see-bg-color);
  padding: 12px;
  box-sizing: border-box;
  overflow: hidden;
}

/* 列表容器 */
.uni-list {
  width: 100%;
  background-color: var(--see-bg-color);
  overflow: hidden;
  border: 1px solid var(--see-border-three-color);
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

/* 单元格 */
.uni-list-cell {
  height: 46px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--see-border-four-color);
  background-color: var(--see-bg-color);
}

.uni-list-cell:last-child {
  border-bottom: none;
}

.uni-list-detail {
  padding: 12px 16px;
  background-color: var(--see-info-light);
  border-top: 1px solid var(--see-border-four-color);
  text {
    font-size: 12px;
    color: var(--see-tips-color);
    line-height: 1.6;
  }
}

/* 左侧标题 */
.uni-list-cell-left {
  font-size: 15px;
  font-weight: 500;
  color: var(--see-main-color);
}

/* 右侧内容 */
.uni-list-cell-db {
  flex: 1;
  text-align: right;
  color: var(--see-content-color);
}

/* picker 内部显示 */
.uni-input {
  font-size: 15px;
  text {
    font-size: 15px;
    color: var(--see-primary);
  }
}

/* 禁用状态的 picker */
picker[disabled] .uni-input {
  color: var(--see-disabled-text);
  opacity: 0.6;
}

/* 主题按钮容器 */
.theme-buttons {
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--see-bg-color);
}

/* 主题按钮 */
.theme-button {
  flex: 1;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--see-border-three-color);
  border-radius: 6px;
  background-color: var(--see-bg-color);
  transition: all 0.3s;

  text {
    font-size: 14px;
    color: var(--see-content-color);
  }

  &.active {
    background-color: var(--see-primary);
    border-color: var(--see-primary);

    text {
      color: #ffffff;
      font-weight: 500;
    }
  }

  &:active {
    opacity: 0.8;
  }
}
</style>
