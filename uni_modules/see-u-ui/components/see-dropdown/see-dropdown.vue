<template>
  <view class="see-dropdown">
    <!-- 菜单栏 -->
    <view class="see-dropdown__menu">
      <slot name="menu" />
    </view>

    <!-- 遮罩层 -->
    <view v-if="isOverlay && activeItem" class="see-dropdown__overlay" :style="overlayStyle" @tap="handleOverlayClick" />

    <!-- 面板容器：里面的 see-dropdown-panel 会按 activeItem 自动切换 v-show -->
    <view v-show="activeItem" class="see-dropdown__panels" :style="panelsStyle">
      <slot name="panels" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, provide, computed } from 'vue'
import type { SeeDropdownProps, SeeDropdownItemProps, SeeDropdownEmits, SeeDropdownExpose, DropdownContext } from './type'

defineOptions({ name: 'SeeDropdown' })

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeeDropdownProps>(), {
  modelValue: () => ({}),
  zIndex: 100,
  duration: 200,
  isOverlay: true,
  closeOnClickOverlay: true
})

/** ---------- emits ---------- */
const emit = defineEmits<SeeDropdownEmits>()

/** ---------- state ---------- */
const activeItem = ref<string | null>(null)
const items = ref<SeeDropdownItemProps[]>([])

/** ---------- computed ---------- */
// 用 computed 保持响应式，避免 zIndex prop 变化后样式不更新
const overlayStyle = computed(() => ({
  zIndex: String(props.zIndex)
}))

const panelsStyle = computed(() => ({
  zIndex: String(props.zIndex + 1)
}))

/** ---------- provide/inject ---------- */
const registerItem = (item: SeeDropdownItemProps) => {
  if (!items.value.find((i) => i.name === item.name)) {
    items.value.push(item)
  }
}

const unregisterItem = (name: string) => {
  items.value = items.value.filter((i) => i.name !== name)
}

const openItem = (name: string) => {
  if (activeItem.value === name) {
    activeItem.value = null
    emit('onClose', name)
  } else {
    if (activeItem.value) {
      emit('onClose', activeItem.value)
    }
    activeItem.value = name
    emit('onOpen', name)
  }
}

const closeItem = (name: string) => {
  if (activeItem.value === name) {
    activeItem.value = null
    emit('onClose', name)
  }
}

const closeAll = () => {
  if (activeItem.value) {
    emit('onClose', activeItem.value)
    activeItem.value = null
  }
}

// 由 panel 调用，把选项变更冒泡出去
const emitChange = (value: any, name: string) => {
  emit('onChange', value, name)
}

provide<DropdownContext>('see-dropdown', {
  activeItem,
  registerItem,
  unregisterItem,
  openItem,
  closeItem,
  closeAll,
  emitChange
})

/** ---------- methods ---------- */
const handleOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    closeAll()
  }
}

const open = (name: string) => {
  openItem(name)
}

const close = (name: string) => {
  closeItem(name)
}

const reset = () => {
  closeAll()
  emit('onChange', null, '')
}

/** ---------- expose ---------- */
defineExpose<SeeDropdownExpose>({
  open,
  close,
  closeAll,
  reset
})
</script>

<style lang="scss" scoped>
.see-dropdown {
  position: relative;
  width: 100%;

  &__menu {
    display: flex;
    align-items: center;
    height: var(--see-dropdown-menu-height, 88rpx);
    background: var(--see-dropdown-menu-bg, var(--see-bg-color));
    border-bottom: 1px solid var(--see-dropdown-border-color, var(--see-border-four-color));
  }

  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--see-overlay-bg, rgba(0, 0, 0, 0.6));
  }

  &__panels {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--see-dropdown-panel-bg, var(--see-bg-color));
    max-height: var(--see-dropdown-panel-max-height, 560rpx);
    overflow-y: auto;
    box-shadow: var(--see-shadow-medium);
  }
}
</style>
