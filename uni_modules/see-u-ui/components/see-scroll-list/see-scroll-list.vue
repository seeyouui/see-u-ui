<template>
  <scroll-view
    class="see-scroll-list__scroll"
    :scroll-x="props.scrollX"
    :scroll-y="props.scrollY"
    :show-scrollbar="props.showScrollbar"
    :enhanced="true"
    @scroll="handleScroll"
    @scrolltolower="emit('onScrollToLower')"
    @scrolltoupper="emit('onScrollToUpper')"
  >
    <view class="see-scroll-list__content" :style="contentStyle">
      <view v-for="(item, index) in props.list" :key="index" class="see-scroll-list__item" :style="itemStyle">
        <slot name="item" :item="item" :index="index">
          <text>{{ item }}</text>
        </slot>
      </view>

      <!-- 尾部插槽 -->
      <view v-if="$slots.footer" class="see-scroll-list__footer">
        <slot name="footer" />
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
/**
 * SeeScrollList 横向滚动列表
 * @description 横向滚动列表组件，支持自定义列表项、加载更多等功能。
 * @tutorial https://www.seeuui.cn/components/scroll-list/
 * @property {Array} list 数据列表
 * @property {Boolean} scrollX 横向滚动
 * @property {Boolean} scrollY 纵向滚动
 * @property {Boolean} showScrollbar 显示滚动条
 * @property {Boolean} isAnimated 滚动动画
 * @property {String} paddingLeft 左侧间距
 * @property {String} itemGap 项间距
 * @property {Number} loadMoreThreshold 加载更多阈值
 * @event {Function} onScroll 滚动时触发
 * @event {Function} onScrollToLower 滚动到底部触发
 * @event {Function} onScrollToUpper 滚动到顶部触发
 */
import { computed } from 'vue'
import type { SeeScrollListProps, SeeScrollListEmits, ScrollViewScrollEvent } from './type'

defineOptions({ name: 'SeeScrollList' })

const props = withDefaults(defineProps<SeeScrollListProps>(), {
  list: () => [],
  scrollX: true,
  scrollY: false,
  showScrollbar: false,
  paddingLeft: '30rpx',
  itemGap: '20rpx'
})

const emit = defineEmits<SeeScrollListEmits>()

const contentStyle = computed(() => ({
  display: 'flex',
  flexDirection: 'row' as const,
  paddingLeft: props.paddingLeft,
  gap: props.itemGap
}))

const itemStyle = computed(() => ({
  flexShrink: 0
}))

const handleScroll = (e: ScrollViewScrollEvent) => {
  emit('onScroll', e)
}
</script>

<style lang="scss" scoped>
.see-scroll-list {
  width: 100%;

  &__scroll {
    width: 100%;
    white-space: nowrap;
  }

  &__content {
    display: flex;
    flex-direction: row;
  }

  &__item {
    flex-shrink: 0;
  }

  &__footer {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
