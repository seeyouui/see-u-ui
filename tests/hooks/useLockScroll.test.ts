import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ref, defineComponent, h } from 'vue'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import { useLockScroll, resetLockScroll } from '../../uni_modules/see-u-ui/utils/hooks/useLockScroll'

/**
 * useLockScroll 单元测试
 * 涵盖：基础锁/解锁、多实例锁计数、resetLockScroll 与新锁不互相干扰
 */

const mountWithLock = (locked: any) => {
  const Comp = defineComponent({
    setup() {
      const api = useLockScroll(locked)
      return () => h('div', { class: 'host' }, [api.locked.value ? 'locked' : 'unlocked'])
    }
  })
  return mount(Comp)
}

// 每个 test 自动 unmount，避免实例堆积影响下一个 test
enableAutoUnmount(afterEach)

const cleanBody = () => {
  document.body.removeAttribute('style')
}

const isUnlocked = () => {
  const p = document.body.style.position
  return p === '' || p === undefined || !document.body.hasAttribute('style') || p !== 'fixed'
}

describe('useLockScroll', () => {
  beforeEach(() => {
    resetLockScroll()
    cleanBody()
  })

  afterEach(() => {
    resetLockScroll()
    cleanBody()
  })

  it('isLocked=true 时立即锁定 body', () => {
    const locked = ref(true)
    mountWithLock(locked)
    expect(document.body.style.position).toBe('fixed')
  })

  it('isLocked 由 true 切回 false 时解锁', async () => {
    const locked = ref(true)
    const wrapper = mountWithLock(locked)
    expect(document.body.style.position).toBe('fixed')
    locked.value = false
    await wrapper.vm.$nextTick()
    await Promise.resolve()
    expect(isUnlocked()).toBe(true)
  })

  it('多实例锁应保持 body 一直锁住直到全部解锁', async () => {
    const a = ref(true)
    const b = ref(true)
    const wA = mountWithLock(a)
    const wB = mountWithLock(b)
    a.value = false
    await wA.vm.$nextTick()
    expect(document.body.style.position).toBe('fixed')
    b.value = false
    await wB.vm.$nextTick()
    await Promise.resolve()
    expect(isUnlocked()).toBe(true)
  })

  it('组件卸载时自动解锁', async () => {
    const locked = ref(true)
    const wrapper = mountWithLock(locked)
    expect(document.body.style.position).toBe('fixed')
    wrapper.unmount()
    await Promise.resolve()
    expect(isUnlocked()).toBe(true)
  })

  it('resetLockScroll 不应破坏后续新锁的工作（regression: P2 useLockScroll reset）', async () => {
    const a = ref(true)
    mountWithLock(a)
    resetLockScroll()
    cleanBody()
    expect(isUnlocked()).toBe(true)

    const b = ref(true)
    mountWithLock(b)
    expect(document.body.style.position).toBe('fixed')
  })
})
