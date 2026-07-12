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
// 加载中标志，用于防抖，避免 footer 持续可见时重复触发 onLoadMore
let loading = false

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
  // 先断开旧的，避免重复 observe
  cleanupIntersectionObserver()

  nextTick(() => {
    observer = uni.createIntersectionObserver(instance.proxy, {
      thresholds: [0.1]
    })

    observer.relativeToViewport({ bottom: 100 })

    observer.observe('.see-waterfall__footer', (res) => {
      // 用 loading 标志防抖：命中后不断开 observer，仅在非加载中时触发一次
      if (res.intersectionRatio > 0 && !loading) {
        loading = true
        emit('onLoadMore')
      }
    })
  })
}

// 监听 hasMore 变化：为 true 时（重新）建立观察，为 false 时断开
watch(
  () => props.hasMore,
  (val) => {
    if (val) {
      setupIntersectionObserver()
    } else {
      cleanupIntersectionObserver()
    }
  }
)

// 数据或列变化视为本次加载完成：重置 loading 标志并重新观察，使持续下拉可连续加载
watch(
  () => [props.list.length, props.columns],
  () => {
    loading = false
    if (props.hasMore) {
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
