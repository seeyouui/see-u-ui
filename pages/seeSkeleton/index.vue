<template>
  <see-config>
    <view class="container">
      <!-- ==================== useSkeletonGlobal 用法 ==================== -->

      <!-- 基础 show/hide -->
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">基础 show / hide</view>
        </view>
        <view class="uni-list-detail">
          <text>调用 show() 显示全局骨架屏，hide() 关闭。H5/APP 端遍历真实 DOM 添加骨架 class，小程序端由 see-config 渲染遮罩</text>
        </view>
        <view class="demo-area">
          <see-button size="small" type="primary" is-ripple @click="basicShow">显示骨架屏</see-button>
          <view class="btn-group">
            <see-button size="small" is-ripple @click="basicHide">隐藏</see-button>
          </view>
        </view>
      </view>

      <!-- 多行文本骨架屏验证 -->
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">多行文本高度验证</view>
        </view>
        <view class="uni-list-detail">
          <text>验证全局骨架屏对多行文本（1行/3行/5行）的高度保持是否正确</text>
        </view>
        <view class="demo-area">
          <view class="multiline-demo">
            <text class="multiline-text multiline-1">这是一行文字内容</text>
            <text class="multiline-text multiline-3">
              这是三行文字内容，骨架屏应该保持和原始文本一样的高度，不会因为 color: transparent 导致高度塌缩，验证 min-height 修复是否生效
            </text>
            <text class="multiline-text multiline-5">
              这是五行文字内容，骨架屏应该保持和原始文本一样的高度，通过 offsetHeight 捕获自然高度并设置 CSS 变量 --skeleton-min-h
              来确保骨架块高度正确，这是修复多行文本骨架屏高度塌缩问题的关键，验证完整修复效果
            </text>
          </view>
          <view class="btn-group">
            <see-button size="small" type="primary" is-ripple @click="basicShow">显示骨架屏验证</see-button>
          </view>
        </view>
      </view>

      <!-- 定时自动隐藏 -->
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">定时自动隐藏</view>
        </view>
        <view class="uni-list-detail">
          <text>show() 后配合 setTimeout 自动 hide()，模拟页面加载场景</text>
        </view>
        <view class="demo-area">
          <see-button size="small" type="primary" is-ripple @click="autoHideDemo">显示 3 秒后自动关闭</see-button>
        </view>
      </view>

      <!-- Key 标识 -->
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">Key 标识（多来源）</view>
        </view>
        <view class="uni-list-detail">
          <text>通过 key 区分不同调用来源，相同 key 不会重复累加，hide 时需传对应 key</text>
        </view>
        <view class="demo-area">
          <view class="btn-row">
            <see-button size="small" type="primary" is-ripple @click="keyShow('list')">show('list')</see-button>
            <see-button size="small" type="primary" is-ripple @click="keyShow('detail')">show('detail')</see-button>
          </view>
          <view class="btn-row">
            <see-button size="small" is-ripple @click="keyHide('list')">hide('list')</see-button>
            <see-button size="small" is-ripple @click="keyHide('detail')">hide('detail')</see-button>
          </view>
          <view class="status-text">
            <text>当前 count: {{ count }}，visible: {{ visible }}</text>
          </view>
        </view>
      </view>

      <!-- 多次 show 累加 -->
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">多次 show 累加计数</view>
        </view>
        <view class="uni-list-detail">
          <text>不带 key 的 show() 会累加 count，所有 hide() 执行完毕后才真正关闭</text>
        </view>
        <view class="demo-area">
          <view class="btn-row">
            <see-button size="small" type="primary" is-ripple @click="stackShow">show() +1</see-button>
            <see-button size="small" is-ripple @click="stackHide">hide() -1</see-button>
          </view>
          <view class="status-text">
            <text>count: {{ count }}，visible: {{ visible }}</text>
          </view>
        </view>
      </view>

      <!-- forceHide -->
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">forceHide 强制关闭</view>
        </view>
        <view class="uni-list-detail">
          <text>forceHide() 重置计数器为 0 并清空所有 key，无论之前 show 了几次都会立即关闭</text>
        </view>
        <view class="demo-area">
          <see-button size="small" type="error" is-ripple @click="forceHideDemo">forceHide()</see-button>
        </view>
      </view>

      <!-- ==================== 内联 see-skeleton 用法 ==================== -->

      <!-- 基础内联骨架 -->
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">内联骨架：基础</view>
        </view>
        <view class="uni-list-detail">
          <text>&lt;see-skeleton /&gt; 组件级骨架屏，用于局部区域加载占位</text>
        </view>
        <view class="demo-area">
          <see-skeleton />
        </view>
      </view>

      <!-- 头像 + 标题 + 自定义行数 -->
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">内联骨架：头像 + 标题</view>
        </view>
        <view class="uni-list-detail">
          <text>avatar + title + rows 组合，模拟用户信息卡片加载态</text>
        </view>
        <view class="demo-area">
          <see-skeleton :avatar="true" :title="true" :rows="3" />
        </view>
      </view>

      <!-- 方形头像 + 自定义行宽 -->
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">内联骨架：方形头像 + 自定义行宽</view>
        </view>
        <view class="uni-list-detail">
          <text>avatarShape="square" + rowWidth 数组逐行控制宽度</text>
        </view>
        <view class="demo-area">
          <see-skeleton :avatar="true" avatar-shape="square" :row-width="['100%', '80%', '60%']" />
        </view>
      </view>

      <!-- 关闭动画 -->
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">内联骨架：关闭动画</view>
        </view>
        <view class="uni-list-detail">
          <text>isAnimate=false 禁用闪烁动画</text>
        </view>
        <view class="demo-area">
          <see-skeleton :is-animate="false" :rows="4" />
        </view>
      </view>

      <!-- 自定义颜色和尺寸 -->
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">内联骨架：自定义颜色和尺寸</view>
        </view>
        <view class="uni-list-detail">
          <text>skeletonBgColor / highlightColor / avatarSize / rowHeight / rowGap 微调外观</text>
        </view>
        <view class="demo-area">
          <see-skeleton
            :avatar="true"
            avatar-size="100rpx"
            :rows="4"
            row-height="24rpx"
            row-gap="16rpx"
            skeleton-bg-color="#e8e8e8"
            highlight-color="#ffffff"
          />
        </view>
      </view>

      <!-- loading 切换 -->
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">内联骨架：loading 切换</view>
        </view>
        <view class="uni-list-detail">
          <text>loading=false 时显示默认插槽的实际内容，骨架与内容结构一致切换更自然</text>
        </view>
        <view class="demo-area">
          <see-skeleton :loading="isLoading" :avatar="true" :title="true" :rows="3">
            <view class="loaded-content">
              <view class="loaded-header">
                <view class="loaded-avatar" />
                <text class="loaded-name">{{ t('skeleton.demo.userName') }}</text>
              </view>
              <text>{{ t('skeleton.demo.avatarLoadedText') }}</text>
            </view>
          </see-skeleton>
          <view class="btn-wrap">
            <see-button size="small" type="primary" is-ripple @click="toggleLoading">
              {{ isLoading ? t('skeleton.demo.loadComplete') : t('skeleton.demo.reload') }}
            </see-button>
          </view>
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n, useSkeletonGlobal } from '@/uni_modules/see-u-ui'
const { t } = useI18n()
useNavbarI18n('navbar.seeSkeleton')

// ==================== useSkeletonGlobal ====================
const { show, hide, forceHide, visible, count } = useSkeletonGlobal()

// 基础 show/hide
const basicShow = () => show()
const basicHide = () => hide()

// 定时自动隐藏
const autoHideDemo = () => {
  show()
  setTimeout(() => hide(), 3000)
}

// Key 标识
const keyShow = (key: string) => show(key)
const keyHide = (key: string) => hide(key)

// 多次 show 累加
const stackShow = () => show()
const stackHide = () => hide()

// forceHide
const forceHideDemo = () => forceHide()

// ==================== 内联 see-skeleton ====================
const isLoading = ref(true)
const toggleLoading = () => {
  isLoading.value = !isLoading.value
}
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

.demo-area {
  padding: 16px;
}

.btn-group {
  margin-top: 12px;
}

.btn-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.status-text {
  margin-top: 8px;
  text {
    font-size: 13px;
    color: var(--see-tips-color);
  }
}

.btn-wrap {
  margin-top: 16px;
}

.loaded-content {
  padding: 24rpx 0;
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

.multiline-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.multiline-text {
  font-size: 14px;
  color: var(--see-main-color);
  line-height: 1.6;
  padding: 8px 12px;
  background-color: var(--see-info-light);
  border-radius: 6px;
}

.multiline-1 {
  max-width: 200px;
}

.multiline-3 {
  max-width: 200px;
}

.multiline-5 {
  max-width: 200px;
}
</style>
