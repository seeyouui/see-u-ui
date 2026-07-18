<template>
  <view :class="iconClasses" :style="iconStyle" @click="onClick">
    <slot>
      <image v-if="isImageIcon" class="see-icon__image" :src="props.name" :alt="props.alt" mode="aspectFit" />
      <text v-else class="see-icon__text">{{ iconText }}</text>
    </slot>
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeIcon 图标
 * @description 图标组件，支持 Unicode 字符、图片路径、自定义图标字体等。
 * @tutorial https://www.seeuui.cn/components/icon/
 *
 * @property {String} name 图标名称或图片路径
 * @property {String | Number} size 图标大小
 * @property {String} color 图标颜色
 * @property {String} customPrefix 自定义图标类名前缀
 * @property {String} customFont 自定义图标字体名称
 * @property {String} alt 图片图标 alt 文本
 * @event {Function} onClick 点击图标时触发
 *
 * @example
 * <see-icon name="checkmark" />
 * <see-icon name="✓" />
 * <see-icon name="/static/icon.png" :size="32" />
 * <see-icon name="home" custom-prefix="my-icon" />
 */
import { computed } from 'vue'

defineOptions({
  name: 'SeeIcon'
})

interface SeeIconProps {
  /** 图标名称或图片路径 */
  name?: string
  /** 图标大小 */
  size?: string | number
  /** 图标颜色 */
  color?: string
  /** 自定义图标类名前缀 */
  customPrefix?: string
  /** 自定义图标字体名称 */
  customFont?: string
  /** 图片图标 alt 文本 */
  alt?: string
}

const props = withDefaults(defineProps<SeeIconProps>(), {
  name: '',
  color: '',
  customPrefix: '',
  customFont: '',
  alt: ''
})

const emit = defineEmits<{
  (e: 'onClick'): void
}>()

/** 判断是否为图片路径 */
const isImageIcon = computed(() => {
  if (!props.name) return false
  // 判断是否为图片路径（以 / 开头或包含图片扩展名）
  return (
    props.name.startsWith('/') ||
    props.name.startsWith('http') ||
    props.name.startsWith('data:') ||
    /\.(png|jpe?g|gif|svg|webp|bmp|ico)(\?.*)?$/i.test(props.name)
  )
})

/** 图标文本 */
const iconText = computed(() => {
  if (!props.name) return ''
  return props.name
})

/** 是否使用自定义图标前缀 */
const useCustomPrefix = computed(() => !!props.customPrefix)

/** 图标类名 */
const iconClasses = computed(() => {
  const classes = ['see-icon']

  if (useCustomPrefix.value) {
    classes.push(props.customPrefix)
    classes.push(`${props.customPrefix}-${props.name}`)
  }

  return classes
})

/** 图标样式 */
const iconStyle = computed(() => {
  const style: Record<string, string | number> = {}

  // 处理大小
  if (props.size !== undefined && props.size !== null) {
    const sizeValue = typeof props.size === 'number' ? `${props.size}px` : props.size
    style.fontSize = sizeValue
    // 图片图标需要设置宽高
    if (isImageIcon.value) {
      style.width = sizeValue
      style.height = sizeValue
    }
  }

  // 处理颜色
  if (props.color) {
    style.color = props.color
  }

  // 处理自定义字体
  if (props.customFont) {
    style.fontFamily = `'${props.customFont}'`
  }

  return style
})

/** 点击事件 */
const onClick = () => {
  emit('onClick')
}

/** 获取图标名称 */
const getName = () => props.name

/** 判断是否为图片图标 */
const isImage = () => isImageIcon.value

/** 暴露方法 */
defineExpose({
  getName,
  isImage
})
</script>

<style lang="scss" scoped>
.see-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  &__image {
    display: block;
    width: 1em;
    height: 1em;
  }

  &__text {
    font-size: inherit;
    line-height: 1;
  }
}
</style>
