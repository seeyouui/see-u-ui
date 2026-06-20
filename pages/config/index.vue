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
      <!-- 自定义主题色 -->
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">{{ t('config.customTheme') }}</view>
          <view class="uni-list-cell-db" @click="resetAll">
            <text class="reset-all">{{ t('config.customThemeResetAll') }}</text>
          </view>
        </view>
        <view class="uni-list-detail">
          <text>{{ t('config.customThemeDesc') }}</text>
        </view>
        <!-- Token 选择 tab -->
        <view class="color-tabs">
          <view
            v-for="token in tokens"
            :key="token.key"
            class="color-tab"
            :class="{ active: currentToken === token.key }"
            @click="currentToken = token.key"
          >
            <view class="color-tab-dot" :style="{ backgroundColor: customColors[token.key] || defaultColorMap[token.key] }" />
            <text>{{ t(token.labelKey) }}</text>
          </view>
        </view>
        <!-- 当前选中色的预览条 -->
        <view class="color-preview-bar">
          <view class="color-preview-swatch" :style="{ backgroundColor: currentColorHex }" />
          <view class="color-preview-info">
            <text class="color-preview-label">{{ t(tokens.find((tk) => tk.key === currentToken)!.labelKey) }}</text>
            <text class="color-preview-hex">{{ currentColorHex }}</text>
          </view>
          <text class="color-preview-reset" @click="resetColor(currentToken)">
            {{ t('config.customThemeReset') }}
          </text>
        </view>
        <!-- 取色器区域 -->
        <view class="color-picker-area">
          <!-- H5: 原生取色器 -->
          <!-- #ifdef H5 -->
          <view class="color-picker-btn" @click="openNativePicker">
            <view class="color-picker-btn-swatch" :style="{ backgroundColor: currentColorHex }" />
            <view class="color-picker-btn-text">
              <text class="color-picker-btn-label">{{ t('config.customThemePickColor') }}</text>
              <text class="color-picker-btn-hint">{{ t('config.customThemeClickToPick') }}</text>
            </view>
          </view>
          <view ref="nativePickerHost" class="native-picker-host" />
          <!-- #endif -->
          <!-- 非 H5: hex 输入 -->
          <!-- #ifndef H5 -->
          <view class="hex-input-row">
            <input v-model="hexInput" class="hex-input-field" :placeholder="t('config.customThemeInputHex')" maxlength="7" />
            <view class="hex-input-btn" @click="onHexConfirm">
              <text>{{ locale === 'zh-CN' ? '确定' : 'OK' }}</text>
            </view>
          </view>
          <text v-if="hexError" class="hex-error">{{ t('config.customThemeInvalidHex') }}</text>
          <!-- #endif -->
        </view>
      </view>
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">{{ t('config.skeleton') }}</view>
          <view class="uni-list-cell-db">
            <switch :checked="skeletonEnabled" @change="toggleSkeleton" />
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
import { ref, computed, onMounted } from 'vue'
import { useThemeColor, useTheme, useI18n, useNavbarI18n, isValidHex, DEFAULT_COLORS, useSkeletonGlobal } from '@/uni_modules/see-u-ui'
import type { ThemeColorToken } from '@/uni_modules/see-u-ui'

// 暗黑模式切换
const { themeMode, setLightMode, setDarkMode, setFollowSystem } = useTheme()

// 自定义主题色
const { customColors, setColor, resetColor, resetAll } = useThemeColor()

// 国际化切换
const { t, locale, setLocale } = useI18n()
useNavbarI18n('navbar.config')

// 全局骨架屏演示
const { show, hide, visible: skeletonVisible } = useSkeletonGlobal()
const skeletonEnabled = ref(false)

const toggleSkeleton = (e: any) => {
  const value = e.detail?.value ?? e.value
  skeletonEnabled.value = value

  if (value) {
    // 开启骨架屏
    show()
    // 3秒后自动关闭
    setTimeout(() => {
      hide()
      skeletonEnabled.value = false
    }, 3000)
  } else {
    // 手动关闭骨架屏
    hide()
  }
}

const tokens: { key: ThemeColorToken; labelKey: string }[] = [
  { key: 'primary', labelKey: 'config.customThemePrimary' },
  { key: 'success', labelKey: 'config.customThemeSuccess' },
  { key: 'warning', labelKey: 'config.customThemeWarning' },
  { key: 'error', labelKey: 'config.customThemeError' }
]

const currentToken = ref<ThemeColorToken>('primary')
const defaultColorMap = DEFAULT_COLORS

const currentColorHex = computed(() => {
  return customColors.value[currentToken.value] || defaultColorMap[currentToken.value]
})

// ==================== H5 原生取色器 ====================
// #ifdef H5
let nativePickerInput: HTMLInputElement | null = null
const nativePickerHost = ref<HTMLElement | null>(null)

onMounted(() => {
  // 创建原生 input[type=color] 并直接嵌入页面 DOM（绕过 uni-app 组件包装）
  nativePickerInput = document.createElement('input')
  nativePickerInput.type = 'color'
  Object.assign(nativePickerInput.style, {
    width: '100%',
    height: '40px',
    border: '1px solid var(--see-border-three-color, #d9dadc)',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'var(--see-bg-color, #ffffff)',
    padding: '4px 12px',
    boxSizing: 'border-box'
  })
  nativePickerInput.onchange = (e: Event) => {
    const color = (e.target as HTMLInputElement).value
    if (color) setColor(currentToken.value, color)
  }
  // 获取实际的 DOM 元素（uni-app 中 ref 返回的是组件实例，需要通过 $el 获取 DOM）
  const hostEl = nativePickerHost.value?.$el || nativePickerHost.value
  if (hostEl && hostEl.appendChild) {
    hostEl.appendChild(nativePickerInput)
  }
})

const openNativePicker = () => {
  nativePickerInput?.click()
}
// #endif

// ==================== 非 H5: hex 输入 ====================
// #ifndef H5
const hexInput = ref('')
const hexError = ref(false)

const onHexConfirm = () => {
  if (!isValidHex(hexInput.value)) {
    hexError.value = true
    return
  }
  hexError.value = false
  setColor(currentToken.value, hexInput.value)
  hexInput.value = ''
}
// #endif
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  background-color: var(--see-bg-color);
  padding: 12px;
  box-sizing: border-box;
  overflow: hidden;
}

.uni-list {
  width: 100%;
  background-color: var(--see-bg-color);
  overflow: hidden;
  border: 1px solid var(--see-border-three-color);
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

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

.uni-list-cell-left {
  font-size: 15px;
  font-weight: 500;
  color: var(--see-main-color);
}

.uni-list-cell-db {
  flex: 1;
  text-align: right;
  color: var(--see-content-color);
}

.uni-input {
  font-size: 15px;
  text {
    font-size: 15px;
    color: var(--see-primary);
  }
}

picker[disabled] .uni-input {
  color: var(--see-disabled-text);
  opacity: 0.6;
}

.theme-buttons {
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--see-bg-color);
}

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

/* ---------- 自定义主题色 ---------- */
.color-tabs {
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding: 12px 16px;
  background-color: var(--see-bg-color);
  border-bottom: 1px solid var(--see-border-four-color);
}
.color-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 4px;
  border-radius: 8px;
  background: var(--see-info-light);
  border: 2px solid transparent;
  transition: all 0.2s;
  text {
    font-size: 12px;
    color: var(--see-tips-color);
  }
  &.active {
    background: var(--see-bg-color);
    border-color: var(--see-primary);
    text {
      color: var(--see-main-color);
      font-weight: 500;
    }
  }
}
.color-tab-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--see-border-four-color);
  flex-shrink: 0;
}

.color-preview-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--see-bg-color);
  border-bottom: 1px solid var(--see-border-four-color);
}
.color-preview-swatch {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 2px solid var(--see-border-three-color);
  flex-shrink: 0;
}
.color-preview-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.color-preview-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--see-main-color);
}
.color-preview-hex {
  font-size: 12px;
  color: var(--see-tips-color);
  font-family: monospace;
}
.color-preview-reset {
  font-size: 12px;
  color: var(--see-primary);
  flex-shrink: 0;
}

/* 取色器区域 */
.color-picker-area {
  padding: 20px 16px;
  background-color: var(--see-bg-color);
}
/* H5 取色按钮 */
.color-picker-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 2px dashed var(--see-border-three-color);
  border-radius: 10px;
  background: var(--see-info-light);
  transition: all 0.2s;
  &:active {
    background: var(--see-border-four-color);
  }
}
.color-picker-btn-swatch {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 2px solid var(--see-border-three-color);
  flex-shrink: 0;
}
.color-picker-btn-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.color-picker-btn-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--see-main-color);
}
.color-picker-btn-hint {
  font-size: 12px;
  color: var(--see-tips-color);
}
/* 原生取色器容器 */
.native-picker-host {
  margin-top: 12px;
}

/* hex 输入（非 H5） */
.hex-input-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}
.hex-input-field {
  flex: 1;
  height: 40px;
  border: 1px solid var(--see-border-three-color);
  border-radius: 6px;
  padding: 0 12px;
  font-size: 14px;
  color: var(--see-main-color);
  background: var(--see-bg-color);
  box-sizing: border-box;
}
.hex-input-btn {
  height: 40px;
  padding: 0 20px;
  background: var(--see-primary);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text {
    color: #ffffff;
    font-size: 14px;
    font-weight: 500;
  }
}
.hex-error {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: var(--see-error);
}

.reset-all {
  font-size: 13px;
  color: var(--see-primary);
}
</style>
