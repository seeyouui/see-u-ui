import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { usePopoverPosition } from '../../uni_modules/see-u-ui/utils/hooks/usePopoverPosition'

/**
 * usePopoverPosition 测试
 * 注意：完整 H5 path 涉及 DOM/getBoundingClientRect，这里聚焦响应式接口与 API 形状
 */
describe('usePopoverPosition', () => {
  it('接收 string 形式的 position', () => {
    const triggerRef = ref(null as any)
    const popoverRef = ref(null as any)
    const api = usePopoverPosition({ triggerRef, popoverRef, position: 'top' })
    expect(api).toBeDefined()
  })

  it('接收 Ref<string> 形式的 position', () => {
    const triggerRef = ref(null as any)
    const popoverRef = ref(null as any)
    const pos = ref<'top' | 'bottom'>('bottom')
    const api = usePopoverPosition({ triggerRef, popoverRef, position: pos as any })
    expect(api).toBeDefined()
  })

  it('调用 updatePosition 在元素未挂载时不应抛错', async () => {
    const triggerRef = ref(null as any)
    const popoverRef = ref(null as any)
    const api = usePopoverPosition({ triggerRef, popoverRef, position: 'top' })
    if (api.updatePosition) {
      await expect(Promise.resolve(api.updatePosition())).resolves.not.toThrow()
    }
  })
})
