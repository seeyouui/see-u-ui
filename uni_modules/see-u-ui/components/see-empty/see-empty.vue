<template>
  <view class="see-empty" :class="{ 'see-empty--custom': type === 'custom' }">
    <!-- 图片区域 -->
    <view class="see-empty__image" :style="imageStyle">
      <slot name="image">
        <text class="see-empty__icon">{{ iconEmoji }}</text>
      </slot>
    </view>

    <!-- 标题 -->
    <text class="see-empty__title">{{ displayTitle }}</text>

    <!-- 描述 -->
    <text v-if="displayDescription" class="see-empty__description">{{ displayDescription }}</text>

    <!-- 操作按钮 -->
    <view v-if="isShowAction && actionText" class="see-empty__action" @tap="handleAction">
      <slot name="action">
        <text class="see-empty__action-text">{{ actionText }}</text>
      </slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from '../../locale'
import type { EmptyType, SeeEmptyProps, SeeEmptyEmits } from './type'

defineOptions({ name: 'SeeEmpty' })

const { t } = useI18n()

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeeEmptyProps>(), {
  type: 'default',
  image: '',
  title: '',
  description: '',
  actionText: '',
  isShowAction: false,
  imageSize: '320rpx'
})

/** ---------- emits ---------- */
const emit = defineEmits<SeeEmptyEmits>()

/** ---------- computed ---------- */
const typeDefaults: Record<EmptyType, { icon: string }> = {
  default: { icon: '📭' },
  search: { icon: '🔍' },
  network: { icon: '📡' },
  error: { icon: '⚠️' },
  '404': { icon: '🗺️' },
  custom: { icon: '' }
}

const typeTitleMap: Record<EmptyType, string> = {
  default: t('empty.default'),
  search: t('empty.search'),
  network: t('empty.network'),
  error: t('empty.error'),
  '404': t('empty.notFound'),
  custom: ''
}

const typeDescMap: Record<EmptyType, string> = {
  default: '',
  search: t('empty.searchDesc'),
  network: t('empty.networkDesc'),
  error: t('empty.errorDesc'),
  '404': t('empty.notFoundDesc'),
  custom: ''
}

const iconEmoji = computed(() => {
  if (props.image) return ''
  if (props.type === 'custom') return ''
  return typeDefaults[props.type]?.icon || typeDefaults.default.icon
})

const displayTitle = computed(() => {
  if (props.title) return props.title
  if (props.type === 'custom') return ''
  return typeTitleMap[props.type] || typeTitleMap.default
})

const displayDescription = computed(() => {
  if (props.description) return props.description
  return typeDescMap[props.type] || ''
})

const imageStyle = computed(() => {
  const size = props.imageSize
  return {
    width: size,
    height: size
  }
})

/** ---------- methods ---------- */
const handleAction = () => {
  emit('onAction')
}
</script>

<style lang="scss" scoped>
.see-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 48rpx;
  box-sizing: border-box;

  &__image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--see-empty-image-size, 320rpx);
    height: var(--see-empty-image-size, 320rpx);
    margin-bottom: 32rpx;
  }

  &__icon {
    font-size: 120rpx;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 500;
    color: var(--see-empty-title-color, var(--see-main-color));
    margin-bottom: 12rpx;
    text-align: center;
  }

  &__description {
    font-size: 26rpx;
    color: var(--see-empty-description-color, var(--see-tips-color));
    text-align: center;
    line-height: 1.5;
  }

  &__action {
    margin-top: 40rpx;
    padding: 20rpx 48rpx;
    background: var(--see-empty-action-bg, var(--see-primary));
    border-radius: 48rpx;
  }

  &__action-text {
    font-size: 28rpx;
    color: var(--see-empty-action-color, #ffffff);
  }
}
</style>
