<template>
  <view
    class="see-dropdown-item"
    :class="{
      'see-dropdown-item--active': isActive,
      'see-dropdown-item--disabled': isDisabled
    }"
    @tap="handleClick"
  >
    <text class="see-dropdown-item__title" :class="{ 'see-dropdown-item__title--active': isActive }">
      {{ displayTitle }}
    </text>
    <text class="see-dropdown-item__arrow" :class="{ 'see-dropdown-item__arrow--up': isActive }">▾</text>
  </view>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, onUnmounted } from 'vue'
import type { SeeDropdownItemProps, DropdownContext } from '../see-dropdown/type'

defineOptions({ name: 'SeeDropdownItem' })

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeeDropdownItemProps>(), {
  title: '',
  menuType: 'single',
  options: () => [],
  isDisabled: false,
  placeholder: '请选择'
})

/** ---------- inject ---------- */
const dropdownCtx = inject<DropdownContext | null>('see-dropdown', null)

/** ---------- computed ---------- */
const isActive = computed(() => {
  return dropdownCtx?.activeItem.value === props.name
})

const displayTitle = computed(() => {
  return props.title || props.placeholder
})

/** ---------- methods ---------- */
const handleClick = () => {
  if (props.isDisabled) return
  dropdownCtx?.openItem(props.name)
}

/** ---------- lifecycle ---------- */
onMounted(() => {
  dropdownCtx?.registerItem({
    name: props.name,
    title: props.title,
    menuType: props.menuType,
    options: props.options,
    isDisabled: props.isDisabled,
    placeholder: props.placeholder
  })
})

onUnmounted(() => {
  dropdownCtx?.unregisterItem(props.name)
})
</script>

<style lang="scss" scoped>
.see-dropdown-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 24rpx;
  box-sizing: border-box;
  position: relative;

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__title {
    font-size: 28rpx;
    color: var(--see-main-color);
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &--active {
      color: var(--see-dropdown-active-color, var(--see-primary));
    }
  }

  &__arrow {
    font-size: 24rpx;
    color: var(--see-tips-color);
    margin-left: 8rpx;
    transition: transform 0.2s ease;

    &--up {
      transform: rotate(180deg);
      color: var(--see-dropdown-active-color, var(--see-primary));
    }
  }
}
</style>
