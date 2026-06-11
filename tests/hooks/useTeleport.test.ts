import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useTeleport } from '../../uni_modules/see-u-ui/utils/hooks/useTeleport'

/**
 * useTeleport 测试
 * 涵盖：默认行为、isEnabled 输入兼容性
 */
describe('useTeleport', () => {
  it('默认配置（无参）应可调用且返回对象', () => {
    const api = useTeleport()
    expect(api).toBeDefined()
    expect(typeof api).toBe('object')
  })

  it('isEnabled=布尔字面量', () => {
    const api1 = useTeleport({ isEnabled: true })
    const api2 = useTeleport({ isEnabled: false })
    expect(api1).toBeDefined()
    expect(api2).toBeDefined()
  })

  it('isEnabled=Ref<boolean>', () => {
    const flag = ref(true)
    const api = useTeleport({ isEnabled: flag })
    expect(api).toBeDefined()
  })

  it('to 自定义 selector', () => {
    const api = useTeleport({ to: '#my-host' })
    expect(api).toBeDefined()
  })
})
