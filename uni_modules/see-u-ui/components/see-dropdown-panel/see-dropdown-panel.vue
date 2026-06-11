<template>
  <view v-show="isActive" class="see-dropdown-panel">
    <slot />
  </view>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import type { SeeDropdownPanelProps, DropdownContext } from '../see-dropdown/type'

defineOptions({ name: 'SeeDropdownPanel' })

/** ---------- props ---------- */
const props = defineProps<SeeDropdownPanelProps>()

/** ---------- inject ---------- */
const dropdownCtx = inject<DropdownContext | null>('see-dropdown', null)

/** ---------- computed ---------- */
const isActive = computed(() => {
  return dropdownCtx?.activeItem.value === props.name
})
</script>

<style lang="scss" scoped>
.see-dropdown-panel {
  width: 100%;
  box-sizing: border-box;
}
</style>
