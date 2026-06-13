<template>
  <view v-if="isVisible" class="see-alert" :class="alertClasses" :style="alertStyle">
    <!-- 图标 -->
    <view v-if="isShowIcon && iconName" class="see-alert__icon">
      <slot name="icon">
        <text class="see-alert__icon-text">{{ iconName }}</text>
      </slot>
    </view>

    <!-- 内容区域 -->
    <view class="see-alert__content" :class="{ 'see-alert__content--center': isCenter }">
      <slot>
        <!-- 标题 -->
        <view v-if="title || $slots.title" class="see-alert__title-wrap">
          <slot name="title">
            <text class="see-alert__title">{{ title }}</text>
          </slot>
        </view>
        <!-- 内容 -->
        <view v-if="content && (!isCollapsible || !isCollapsedValue)" class="see-alert__desc-wrap">
          <text class="see-alert__desc">{{ content }}</text>
        </view>
      </slot>

      <!-- 操作文字 -->
      <view v-if="actionText" class="see-alert__action" @click="handleAction">
        <text class="see-alert__action-text">{{ actionText }}</text>
      </view>
    </view>

    <!-- 折叠/展开按钮 -->
    <view v-if="isCollapsible" class="see-alert__collapse" @click="handleToggleCollapse">
      <text class="see-alert__collapse-icon">{{ isCollapsedValue ? t('alert.expand') : t('alert.collapse') }}</text>
    </view>

    <!-- 关闭按钮 -->
    <view v-if="isClosable" class="see-alert__close" @click="handleClose">
      <text class="see-alert__close-icon">×</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeAlert 警告提示
 * @description 页面中的内联提示信息
 * @tutorial https://www.seeuui.cn/components/alert/
 * @property {String} type 提示类型
 * @property {String} title 标题
 * @property {String} content 内容文字
 * @property {String} effect 显示效果
 * @property {Boolean} isClosable 是否可关闭
 * @property {Boolean} isShowIcon 是否显示图标
 * @property {String} icon 自定义图标
 * @property {Boolean} isCollapsible 是否可折叠
 * @property {Boolean} isCollapsed 默认是否折叠
 * @property {String} actionText 操作文字
 * @property {Boolean} isCenter 文字是否居中
 * @property {Boolean} isShow 是否显示（v-model）
 * @property {Boolean} isAnimated 是否启用动画
 * @event {Function} onClose 关闭时触发
 * @event {Function} onAction 点击操作文字时触发
 */
import { ref, computed, watch } from 'vue'
import type { SeeAlertProps, SeeAlertEmits } from './type'
import { useI18n } from '../../locale'

defineOptions({ name: 'SeeAlert' })

const props = withDefaults(defineProps<SeeAlertProps>(), {
  type: 'info',
  title: '',
  content: '',
  effect: 'light',
  isClosable: false,
  isShowIcon: true,
  icon: '',
  isCollapsible: false,
  isCollapsed: false,
  actionText: '',
  isCenter: false,
  isShow: true,
  isAnimated: true
})

const emit = defineEmits<SeeAlertEmits>()

const { t } = useI18n()

// ==================== 状态管理 ====================

const isVisible = ref(props.isShow)
const isCollapsedValue = ref(props.isCollapsed)

// ==================== 图标映射 ====================

const typeIconMap: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i'
}

const iconName = computed(() => {
  if (props.icon) return props.icon
  return typeIconMap[props.type] || ''
})

// ==================== 计算属性 ====================

const alertClasses = computed(() => [
  `see-alert--${props.type}`,
  `see-alert--${props.effect}`,
  {
    'see-alert--center': props.isCenter,
    'see-alert--animated': props.isAnimated
  }
])

const alertStyle = computed(() => ({}))

// ==================== 事件处理 ====================

const handleClose = (e: Event) => {
  isVisible.value = false
  emit('onClose', e)
  emit('update:isShow', false)
}

const handleAction = (e: Event) => {
  emit('onAction', e)
}

const handleToggleCollapse = () => {
  isCollapsedValue.value = !isCollapsedValue.value
  emit('update:isCollapsed', isCollapsedValue.value)
}

// ==================== 监听 ====================

watch(
  () => props.isShow,
  (val) => {
    isVisible.value = val
  }
)

watch(
  () => props.isCollapsed,
  (val) => {
    isCollapsedValue.value = val
  }
)

// ==================== Expose ====================

defineExpose({
  close: () => handleClose(new Event('close')),
  show: () => {
    isVisible.value = true
    emit('update:isShow', true)
  }
})
</script>

<style lang="scss" scoped>
.see-alert {
  display: flex;
  align-items: flex-start;
  padding: 24rpx 28rpx;
  border-radius: 12rpx;
  position: relative;

  &--animated {
    transition: all 300ms ease;
  }

  // 类型 + 效果组合
  &--success#{&}--light {
    background-color: var(--see-success-light);
    .see-alert__icon-text {
      color: var(--see-success);
    }
    .see-alert__title {
      color: var(--see-success-dark);
    }
    .see-alert__desc {
      color: var(--see-success-dark);
    }
    .see-alert__action-text {
      color: var(--see-success);
    }
  }

  &--error#{&}--light {
    background-color: var(--see-error-light);
    .see-alert__icon-text {
      color: var(--see-error);
    }
    .see-alert__title {
      color: var(--see-error-dark);
    }
    .see-alert__desc {
      color: var(--see-error-dark);
    }
    .see-alert__action-text {
      color: var(--see-error);
    }
  }

  &--warning#{&}--light {
    background-color: var(--see-warning-light);
    .see-alert__icon-text {
      color: var(--see-warning);
    }
    .see-alert__title {
      color: var(--see-warning-dark);
    }
    .see-alert__desc {
      color: var(--see-warning-dark);
    }
    .see-alert__action-text {
      color: var(--see-warning);
    }
  }

  &--info#{&}--light {
    background-color: var(--see-primary-light);
    .see-alert__icon-text {
      color: var(--see-primary);
    }
    .see-alert__title {
      color: var(--see-primary-dark);
    }
    .see-alert__desc {
      color: var(--see-primary-dark);
    }
    .see-alert__action-text {
      color: var(--see-primary);
    }
  }

  &--success#{&}--dark {
    background-color: var(--see-success);
    color: var(--see-text);
  }

  &--error#{&}--dark {
    background-color: var(--see-error);
    color: var(--see-text);
  }

  &--warning#{&}--dark {
    background-color: var(--see-warning);
    color: var(--see-text);
  }

  &--info#{&}--dark {
    background-color: var(--see-primary);
    color: var(--see-text);
  }

  &--success#{&}--border {
    background-color: transparent;
    border: 1px solid var(--see-success);
    .see-alert__icon-text {
      color: var(--see-success);
    }
    .see-alert__title {
      color: var(--see-success);
    }
    .see-alert__desc {
      color: var(--see-success-dark);
    }
    .see-alert__action-text {
      color: var(--see-success);
    }
  }

  &--error#{&}--border {
    background-color: transparent;
    border: 1px solid var(--see-error);
    .see-alert__icon-text {
      color: var(--see-error);
    }
    .see-alert__title {
      color: var(--see-error);
    }
    .see-alert__desc {
      color: var(--see-error-dark);
    }
    .see-alert__action-text {
      color: var(--see-error);
    }
  }

  &--warning#{&}--border {
    background-color: transparent;
    border: 1px solid var(--see-warning);
    .see-alert__icon-text {
      color: var(--see-warning);
    }
    .see-alert__title {
      color: var(--see-warning);
    }
    .see-alert__desc {
      color: var(--see-warning-dark);
    }
    .see-alert__action-text {
      color: var(--see-warning);
    }
  }

  &--info#{&}--border {
    background-color: transparent;
    border: 1px solid var(--see-primary);
    .see-alert__icon-text {
      color: var(--see-primary);
    }
    .see-alert__title {
      color: var(--see-primary);
    }
    .see-alert__desc {
      color: var(--see-primary-dark);
    }
    .see-alert__action-text {
      color: var(--see-primary);
    }
  }

  &__icon {
    margin-right: 16rpx;
    flex-shrink: 0;
  }

  &__icon-text {
    font-size: 36rpx;
    line-height: 1;
  }

  &__content {
    flex: 1;
    min-width: 0;

    &--center {
      text-align: center;
    }
  }

  &__title-wrap {
    margin-bottom: 4rpx;
  }

  &__title {
    font-size: 28rpx;
    font-weight: bold;
    line-height: 1.4;
  }

  &__desc-wrap {
    margin-top: 8rpx;
  }

  &__desc {
    font-size: 26rpx;
    line-height: 1.6;
  }

  &__action {
    margin-top: 12rpx;
  }

  &__action-text {
    font-size: 26rpx;
    text-decoration: underline;
  }

  &__collapse {
    margin-left: 16rpx;
    flex-shrink: 0;
  }

  &__collapse-icon {
    font-size: 24rpx;
    color: var(--see-tips-color);
  }

  &__close {
    margin-left: 16rpx;
    flex-shrink: 0;
    padding: 4rpx;
  }

  &__close-icon {
    font-size: 28rpx;
    color: var(--see-tips-color);
    line-height: 1;
  }
}
</style>
