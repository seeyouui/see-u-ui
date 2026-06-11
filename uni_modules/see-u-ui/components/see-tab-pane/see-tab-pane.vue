<template>
  <view v-if="shouldRender" v-show="shouldShow" class="see-tab-pane">
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, inject, onMounted, onUnmounted, watch } from 'vue'
import type { SeeTabPaneProps, TabsContext } from '../see-tabs/type'

defineOptions({ name: 'SeeTabPane' })

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeeTabPaneProps>(), {
  title: '',
  isDisabled: false,
  badge: undefined,
  dot: false,
  icon: '',
  closable: false
})

/** ---------- inject ---------- */
// 提供 null 默认值，独立使用时不会抛错；同时给出开发提示
const tabsContext = inject<TabsContext | null>('see-tabs', null)

/** ---------- state ---------- */
const hasRendered = ref(false)

/** ---------- computed ---------- */
const isActive = computed(() => {
  return tabsContext?.activeName.value === props.name
})

// 是否使用懒加载模式（懒加载 / 缓存模式都需要"按需挂载"）
const useLazy = computed(() => {
  if (!tabsContext) return false
  return tabsContext.isLazy.value || tabsContext.isCache.value
})

// 是否在切到其他 pane 后仍保留挂载（仅缓存模式）
const useCache = computed(() => {
  return tabsContext?.isCache.value ?? false
})

const shouldRender = computed(() => {
  if (!tabsContext) return true
  // 默认模式：v-if 控制（只渲染激活的）
  if (!useLazy.value) return isActive.value
  // 懒加载 / 缓存模式：激活过就保持挂载
  return hasRendered.value
})

const shouldShow = computed(() => {
  if (!tabsContext) return true
  // 不论哪种模式，"显示"始终由 isActive 控制
  return isActive.value
})

/** ---------- watch ---------- */
watch(isActive, (active) => {
  if (active) {
    hasRendered.value = true
  }
})

// 缓存模式下若关闭缓存，需重置已渲染状态由 v-if 接管
watch(useCache, (val) => {
  if (!val && !isActive.value) {
    hasRendered.value = false
  }
})

// props 动态变化时同步注册信息到父组件
watch(
  () => [props.title, props.isDisabled, props.badge, props.dot, props.icon, props.closable],
  () => {
    if (!tabsContext) return
    // 先取消再注册一次（更稳妥的兼容做法）
    tabsContext.unregisterPane(props.name)
    tabsContext.registerPane({
      name: props.name,
      title: props.title,
      isDisabled: props.isDisabled,
      badge: props.badge,
      dot: props.dot,
      icon: props.icon,
      closable: props.closable
    })
  }
)

/** ---------- lifecycle ---------- */
onMounted(() => {
  if (!tabsContext) {
    console.warn('[SeeTabPane] 必须在 <see-tabs> 中使用')
    return
  }
  tabsContext.registerPane({
    name: props.name,
    title: props.title,
    isDisabled: props.isDisabled,
    badge: props.badge,
    dot: props.dot,
    icon: props.icon,
    closable: props.closable
  })
  // 初始激活时标记已渲染
  if (isActive.value) {
    hasRendered.value = true
  }
})

onUnmounted(() => {
  tabsContext?.unregisterPane(props.name)
})
</script>

<style lang="scss" scoped>
.see-tab-pane {
  width: 100%;
  box-sizing: border-box;
}
</style>
