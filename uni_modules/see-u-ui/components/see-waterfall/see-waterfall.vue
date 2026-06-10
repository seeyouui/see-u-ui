<template>
  <view class="see-waterfall">
    <view class="see-waterfall__columns" :style="columnsStyle">
      <view v-for="(column, colIndex) in columnData" :key="colIndex" class="see-waterfall__column" :style="columnStyle">
        <view v-for="(item, itemIndex) in column" :key="item.id ?? itemIndex" class="see-waterfall__item" @click="emit('onClick', item, itemIndex)">
          <slot name="item" :item="item" :index="itemIndex">
            <image
              v-if="item.image"
              :src="item.image"
              class="see-waterfall__image"
              mode="widthFix"
              :style="item.height ? { height: `${item.height}rpx` } : {}"
            />
            <text v-if="item.title" class="see-waterfall__title">{{ item.title }}</text>
          </slot>
        </view>
      </view>
    </view>

    <!-- 加载更多 -->
    <view v-if="props.hasMore" class="see-waterfall__footer">
      <slot name="footer">
        <see-loading-icon size="40rpx" />
      </slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeWaterfall 瀑布流
 * @description 瀑布流/砌体布局组件，多列不均匀排列。
 * @tutorial https://www.seeuui.cn/components/waterfall/
 * @property {Array} list 瀑布流数据
 * @property {Number} columns 列数
 * @property {String} gap 列间距
 * @property {Boolean} hasMore 是否显示加载更多
 * @event {Function} onLoadMore 加载更多时触发（当 footer 进入视口时）
 * @event {Function} onClick 点击项时触发
 */
import { computed, onMounted, onUnmounted, nextTick, watch, getCurrentInstance } from 'vue'
import SeeLoadingIcon from '../see-loading-icon/see-loading-icon.vue'
import type { SeeWaterfallProps, SeeWaterfallEmits, WaterfallItem } from './type'

defineOptions({ name: 'SeeWaterfall' })

const props = withDefaults(defineProps<SeeWaterfallProps>(), {
  list: () => [],
  columns: 2,
  gap: '16rpx',
  hasMore: false
})

const emit = defineEmits<SeeWaterfallEmits>()

let observer: ReturnType<typeof uni.createIntersectionObserver> | null = null
const instance = getCurrentInstance()

// 将数据按列分配（按索引轮询分配）
const columnData = computed(() => {
  const cols: WaterfallItem[][] = Array.from({ length: props.columns }, () => [])
  props.list.forEach((item, index) => {
    cols[index % props.columns].push(item)
  })
  return cols
})

const columnsStyle = computed(() => ({
  display: 'flex',
  flexDirection: 'row' as const,
  gap: props.gap,
  alignItems: 'flex-start'
}))

const columnStyle = computed(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: props.gap
}))

// 使用 IntersectionObserver 监测 footer 是否进入视口，触发 onLoadMore
const setupIntersectionObserver = () => {
  if (!props.hasMore || !instance) return

  nextTick(() => {
    observer = uni.createIntersectionObserver(instance.proxy, {
      thresholds: [0.1]
    })

    observer.relativeToViewport({ bottom: 100 })

    observer.observe('.see-waterfall__footer', (res) => {
      if (res.intersectionRatio > 0) {
        emit('onLoadMore')
        // 触发后断开 observer，避免重复触发
        cleanupIntersectionObserver()
      }
    })
  })
}

// 监听 hasMore 变化，重新 setup IntersectionObserver
watch(
  () => props.hasMore,
  (val) => {
    cleanupIntersectionObserver()
    if (val) {
      setupIntersectionObserver()
    }
  }
)

const cleanupIntersectionObserver = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

onMounted(() => {
  setupIntersectionObserver()
})

onUnmounted(() => {
  cleanupIntersectionObserver()
})
</script>

<style lang="scss" scoped>
.see-waterfall {
  width: 100%;
  box-sizing: border-box;

  &__column {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__item {
    display: flex;
    flex-direction: column;
    border-radius: 12rpx;
    overflow: hidden;
    background-color: var(--see-info);
  }

  &__image {
    width: 100%;
    display: block;
  }

  &__title {
    padding: 12rpx 16rpx;
    font-size: 24rpx;
    color: var(--see-main-color);
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30rpx 0;
  }
}
</style>
