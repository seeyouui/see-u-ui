<template>
  <view class="see-swiper" :style="{ height: props.height }">
    <swiper
      :autoplay="props.autoplay"
      :interval="props.interval"
      :duration="props.duration"
      :circular="props.loop"
      :current="props.current"
      class="see-swiper__inner"
      @change="onSwiperChange"
    >
      <swiper-item v-for="(item, index) in props.list" :key="index" class="see-swiper__item">
        <view @tap="emit('onClick', item, index)">
          <slot name="item" :item="item" :index="index">
            <image v-if="item.image" :src="item.image" class="see-swiper__image" mode="aspectFill" />
            <view v-if="item.title" class="see-swiper__title">
              <text>{{ item.title }}</text>
            </view>
          </slot>
        </view>
      </swiper-item>
    </swiper>

    <!-- Dots 指示器 -->
    <view v-if="props.indicatorType === 'dots'" class="see-swiper__indicator see-swiper__indicator--dots">
      <view
        v-for="(item, index) in props.list"
        :key="index"
        :class="[
          'see-swiper__dot',
          {
            'see-swiper__dot--active': currentIndex === index
          }
        ]"
        :style="{
          backgroundColor: currentIndex === index ? props.activeColor : props.inactiveColor
        }"
      />
    </view>

    <!-- Digital 指示器 -->
    <view v-if="props.indicatorType === 'digital'" class="see-swiper__indicator see-swiper__indicator--digital">
      <text class="see-swiper__digital-text">{{ currentIndex + 1 }} / {{ props.list.length }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeSwiper 轮播图
 * @description 轮播图组件，支持图片轮播、自定义内容、自动播放、多种指示器样式。
 * @tutorial https://www.seeuui.cn/components/swiper/
 * @property {Array} list 轮播数据
 * @property {String} height 高度
 * @property {Boolean} autoplay 自动播放
 * @property {Number} interval 播放间隔
 * @property {Number} duration 动画时长
 * @property {Boolean} loop 循环播放
 * @property {'dots'|'digital'|'none'} indicatorType 指示器样式
 * @property {String} activeColor 指示器激活颜色
 * @property {String} inactiveColor 指示器默认颜色
 * @property {Number} current 当前页码
 * @event {Function} onChange 切换时触发
 * @event {Function} onClick 点击项时触发
 */
import { ref, watch } from 'vue'
import type { SeeSwiperProps, SeeSwiperEmits } from './type'

defineOptions({ name: 'SeeSwiper' })

const props = withDefaults(defineProps<SeeSwiperProps>(), {
  list: () => [],
  height: '300rpx',
  autoplay: true,
  interval: 3000,
  duration: 300,
  loop: true,
  indicatorType: 'dots',
  activeColor: 'var(--see-primary)',
  inactiveColor: 'var(--see-swiper-indicator-color)',
  current: 0
})

const emit = defineEmits<SeeSwiperEmits>()

const currentIndex = ref(props.current)

watch(
  () => props.current,
  (val) => {
    currentIndex.value = val
  }
)

interface SwiperChangeEvent {
  detail: {
    current: number
    source: string
  }
}

const onSwiperChange = (e: SwiperChangeEvent) => {
  const index = e.detail?.current ?? 0
  currentIndex.value = index
  emit('onChange', index)
  emit('update:current', index)
}
</script>

<style lang="scss" scoped>
.see-swiper {
  position: relative;
  overflow: hidden;

  &__inner {
    width: 100%;
    height: 100%;
  }

  &__item {
    position: relative;
  }

  &__image {
    width: 100%;
    height: 100%;
    display: block;
  }

  &__title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16rpx 24rpx;
    background: linear-gradient(transparent, var(--see-swiper-title-bg));
    color: var(--see-swiper-title-color);
    font-size: 26rpx;
  }

  &__indicator {
    position: absolute;
    bottom: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;

    &--dots {
      width: 100%;
    }

    &--digital {
      right: 24rpx;
      padding: 4rpx 16rpx;
      border-radius: 20rpx;
      background-color: var(--see-swiper-indicator-bg);
    }
  }

  &__dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    transition: all 0.3s ease;

    &--active {
      width: 30rpx;
      border-radius: 6rpx;
    }
  }

  &__digital-text {
    font-size: 22rpx;
    color: var(--see-swiper-indicator-color);
  }
}
</style>
