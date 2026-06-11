<template>
  <view class="see-collapse-item" :class="{ 'see-collapse-item--disabled': isDisabled }">
    <!-- 标题栏 -->
    <view class="see-collapse-item__header" @click="handleClick">
      <!-- 左侧图标 -->
      <view v-if="icon || $slots.icon" class="see-collapse-item__icon">
        <slot name="icon">
          <text class="see-collapse-item__icon-text">{{ icon }}</text>
        </slot>
      </view>

      <!-- 标题内容 -->
      <view class="see-collapse-item__title-wrap">
        <slot name="title">
          <text class="see-collapse-item__title">{{ title }}</text>
        </slot>
      </view>

      <!-- 右侧附加内容 -->
      <view v-if="$slots.right" class="see-collapse-item__right">
        <slot name="right" />
      </view>

      <!-- 箭头 -->
      <view class="see-collapse-item__arrow" :class="{ 'see-collapse-item__arrow--expanded': isExpanded }">
        <text class="see-collapse-item__arrow-icon">{{ arrowIcon }}</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view v-if="!isLazy || hasBeenExpanded" class="see-collapse-item__content" :class="{ 'see-collapse-item__content--expanded': isExpanded }">
      <view class="see-collapse-item__content-inner">
        <slot />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeCollapseItem 折叠面板子项
 * @description 折叠面板的子项组件
 * @tutorial https://www.seeuui.cn/components/collapse/
 * @property {String|Number} name 唯一标识
 * @property {String} title 标题
 * @property {String} icon 左侧图标
 * @property {Boolean} isDisabled 是否禁用
 * @property {Boolean} isLazy 是否懒加载内容
 * @property {String} arrowIcon 自定义箭头图标
 * @event {Function} onClick 点击标题时触发
 */
import { ref, computed, inject, watch, onMounted, onUnmounted } from 'vue'
import type { SeeCollapseItemProps, SeeCollapseItemEmits, CollapseContext } from './type'
import { collapseInjectionKey } from './type'

defineOptions({ name: 'SeeCollapseItem' })

const props = withDefaults(defineProps<SeeCollapseItemProps>(), {
  title: '',
  icon: '',
  isDisabled: false,
  isLazy: false,
  arrowIcon: '›'
})

const emit = defineEmits<SeeCollapseItemEmits>()

// ==================== 注入父组件 ====================

const collapse = inject<CollapseContext>(collapseInjectionKey)

if (!collapse) {
  console.warn('SeeCollapseItem 必须在 SeeCollapse 内部使用')
}

// ==================== 状态管理 ====================

const hasBeenExpanded = ref(false)

const isExpanded = computed(() => {
  if (!collapse) return false
  return collapse.activeNames.value.includes(props.name)
})

// ==================== 事件处理 ====================

const handleClick = () => {
  if (props.isDisabled) return
  emit('onClick', props.name)
  collapse?.toggle(props.name)
}

// ==================== 监听 ====================

watch(isExpanded, (val) => {
  if (val) {
    hasBeenExpanded.value = true
  }
})

// ==================== 生命周期 ====================

onMounted(() => {
  if (isExpanded.value) {
    hasBeenExpanded.value = true
  }
  // 注册到父组件
  collapse?.registerItem(props.name)
})

onUnmounted(() => {
  // 从父组件注销
  collapse?.unregisterItem(props.name)
})
</script>

<style lang="scss" scoped>
.see-collapse-item {
  &--disabled {
    .see-collapse-item__header {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    height: 88rpx;
    padding: 0 30rpx;
    background-color: var(--see-bg-color);
    border-bottom: 1px solid var(--see-border-four-color);
    position: relative;
  }

  &__icon {
    margin-right: 16rpx;
    flex-shrink: 0;
  }

  &__icon-text {
    font-size: 32rpx;
    color: var(--see-tips-color);
  }

  &__title-wrap {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 28rpx;
    color: var(--see-main-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__right {
    margin-left: 16rpx;
    flex-shrink: 0;
  }

  &__arrow {
    margin-left: 16rpx;
    flex-shrink: 0;
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);

    &--expanded {
      transform: rotate(90deg);
    }
  }

  &__arrow-icon {
    font-size: 28rpx;
    color: var(--see-tips-color);
    line-height: 1;
  }

  &__content {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1);

    &--expanded {
      grid-template-rows: 1fr;
    }

    & > * {
      overflow: hidden;
    }
  }

  &__content-inner {
    padding: 24rpx 30rpx;
    background-color: var(--see-bg-color);
    border-bottom: 1px solid var(--see-border-four-color);
  }
}
</style>
