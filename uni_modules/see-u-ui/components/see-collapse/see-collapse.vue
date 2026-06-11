<template>
  <view class="see-collapse" :class="{ 'see-collapse--border': isShowBorder }">
    <slot />
  </view>
</template>

<script lang="ts" setup>
/**
 * SeeCollapse 折叠面板
 * @description 内容分组展示，通过折叠/展开控制内容区域的可见性
 * @tutorial https://www.seeuui.cn/components/collapse/
 * @property {Array} modelValue 当前展开项 name 数组（v-model）
 * @property {Boolean} isAccordion 是否手风琴模式
 * @property {Boolean} isShowBorder 是否显示边框
 * @event {Function} onChange 展开项变化时触发
 */
import { provide, ref, watch, toRef } from 'vue'
import type { SeeCollapseProps, SeeCollapseEmits } from './type'
import { collapseInjectionKey } from './type'

defineOptions({ name: 'SeeCollapse' })

const props = withDefaults(defineProps<SeeCollapseProps>(), {
  modelValue: () => [],
  isAccordion: false,
  isShowBorder: true
})

const emit = defineEmits<SeeCollapseEmits>()

// ==================== 提供注入 ====================

const activeNames = ref<(string | number)[]>([...props.modelValue])
/** 已注册的 item name 集合（用于 expandAll） */
const registeredNames = new Set<string | number>()

const registerItem = (name: string | number) => {
  registeredNames.add(name)
}

const unregisterItem = (name: string | number) => {
  registeredNames.delete(name)
}

const toggle = (name: string | number) => {
  const index = activeNames.value.indexOf(name)
  let newNames: (string | number)[]

  if (props.isAccordion) {
    // 手风琴模式：只能展开一个
    newNames = index > -1 ? [] : [name]
  } else {
    // 多选模式：可同时展开多个
    if (index > -1) {
      newNames = activeNames.value.filter((n) => n !== name)
    } else {
      newNames = [...activeNames.value, name]
    }
  }

  activeNames.value = newNames
  emit('onChange', newNames)
  emit('update:modelValue', newNames)
}

provide(collapseInjectionKey, {
  activeNames,
  isAccordion: toRef(props, 'isAccordion'),
  toggle,
  registerItem,
  unregisterItem
})

// ==================== 监听 ====================

watch(
  () => props.modelValue,
  (val) => {
    activeNames.value = [...val]
  }
)

// ==================== Expose ====================

defineExpose({
  toggleAll: () => {
    const all = Array.from(registeredNames)
    activeNames.value = activeNames.value.length === all.length ? [] : all
    emit('onChange', activeNames.value)
    emit('update:modelValue', activeNames.value)
  },
  expandAll: () => {
    const allNames = Array.from(registeredNames)
    activeNames.value = allNames
    emit('onChange', allNames)
    emit('update:modelValue', allNames)
  },
  collapseAll: () => {
    activeNames.value = []
    emit('onChange', [])
    emit('update:modelValue', [])
  }
})
</script>

<style lang="scss" scoped>
.see-collapse {
  &--border {
    border-top: 1px solid var(--see-border-four-color);
    border-bottom: 1px solid var(--see-border-four-color);
  }
}
</style>
