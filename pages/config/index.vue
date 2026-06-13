<template>
  <see-config>
    <view class="container">
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">{{ t('config.theme') }}</view>
        </view>
        <view class="uni-list-detail">
          <text>{{ t('config.themeDesc') }}</text>
        </view>
        <view class="theme-buttons">
          <view class="theme-button" :class="{ active: themeMode === 'light' }" @click="setLightMode">
            <text>{{ t('config.themeLight') }}</text>
          </view>
          <view class="theme-button" :class="{ active: themeMode === 'dark' }" @click="setDarkMode">
            <text>{{ t('config.themeDark') }}</text>
          </view>
          <view class="theme-button" :class="{ active: themeMode === 'system' }" @click="setFollowSystem">
            <text>{{ t('config.themeSystem') }}</text>
          </view>
        </view>
      </view>
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">{{ t('config.i18n') }}</view>
        </view>
        <view class="uni-list-detail">
          <text>{{ t('config.i18nDesc') }}</text>
        </view>
        <view class="theme-buttons">
          <view class="theme-button" :class="{ active: locale === 'zh-CN' }" @click="setLocale('zh-CN')">
            <text>{{ t('config.demo.chinese') }}</text>
          </view>
          <view class="theme-button" :class="{ active: locale === 'en' }" @click="setLocale('en')">
            <text>English</text>
          </view>
        </view>
      </view>
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">{{ t('config.customTheme') }}</view>
          <view class="uni-list-cell-db">
            <picker disabled>
              <view class="uni-input">
                <text>{{ t('config.customThemeDefault') }}</text>
              </view>
            </picker>
          </view>
        </view>
        <view class="uni-list-detail">
          <text>{{ t('config.customThemeDesc') }}</text>
        </view>
      </view>
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">{{ t('config.skeleton') }}</view>
          <view class="uni-list-cell-db">
            <switch disabled :checked="false" />
          </view>
        </view>
        <view class="uni-list-detail">
          <text>{{ t('config.skeletonDesc') }}</text>
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useTheme, useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

// 暗黑模式切换
const { themeMode, setLightMode, setDarkMode, setFollowSystem } = useTheme()

// 国际化切换
const { t, locale, setLocale } = useI18n()
useNavbarI18n('navbar.config')
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
