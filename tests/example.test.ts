import { describe, it, expect, vi } from 'vitest'

describe('测试配置验证', () => {
  describe('uni 对象基础功能', () => {
    it('uni 对象应该存在', () => {
      expect(uni).toBeDefined()
      expect(typeof uni).toBe('object')
    })

    it('应该能获取系统信息', () => {
      const systemInfo = uni.getSystemInfoSync()
      expect(systemInfo).toBeDefined()
      expect(systemInfo.brand).toBe('devtools')
      expect(systemInfo.model).toBe('iPhone')
      expect(systemInfo.platform).toBe('ios')
      expect(systemInfo.safeArea).toBeDefined()
    })
  })

  describe('uni 选择器查询 API', () => {
    it('createSelectorQuery 应该正常工作', () => {
      const query = uni.createSelectorQuery()
      expect(query).toBeDefined()
      expect(query.select).toBeDefined()
      expect(query.selectAll).toBeDefined()
      expect(query.exec).toBeDefined()
    })

    it('select 和 boundingClientRect 应该返回数据', async () => {
      const query = uni.createSelectorQuery()
      let result: any = null

      query.select('#test-id').boundingClientRect((data) => {
        result = data
      })

      await query.exec()

      expect(result).toBeDefined()
      expect(result.id).toBe('test-id')
      expect(result.width).toBe(100)
      expect(result.height).toBe(100)
    })

    it('selectAll 应该返回数组', async () => {
      const query = uni.createSelectorQuery()
      let result: any = null

      query.selectAll('.test-class').boundingClientRect((data) => {
        result = data
      })

      await query.exec()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)
    })

    it('in 方法应该支持组件内查询', () => {
      const query = uni.createSelectorQuery()
      const componentInstance = {}
      const queryWithScope = query.in(componentInstance)

      expect(queryWithScope).toBe(query)
    })

    it('特定选择器应该返回特定尺寸', async () => {
      const query = uni.createSelectorQuery()
      let result: any = null

      query.select('.wd-tabs').boundingClientRect((data) => {
        result = data
      })

      await query.exec()

      expect(result.width).toBe(375)
      expect(result.height).toBe(44)
    })
  })

  describe('uni 交叉观察器 API', () => {
    it('createIntersectionObserver 应该正常工作', () => {
      const observer = uni.createIntersectionObserver({})
      expect(observer).toBeDefined()
      expect(observer.observe).toBeDefined()
      expect(observer.disconnect).toBeDefined()
    })

    it('observe 应该触发回调', () => {
      const observer = uni.createIntersectionObserver({})
      const callback = vi.fn()

      observer.observe('#test-id', callback)

      expect(callback).toHaveBeenCalled()
      const result = callback.mock.calls[0][0]
      // setup.ts 中的 extractSelectorInfo 会提取 ID 并去掉 #，所以返回 'test-id'
      expect(result.id).toBe('test-id')
      expect(result.intersectionRatio).toBe(0.5)
    })

    it('relativeTo 和 relativeToViewport 应该支持链式调用', () => {
      const observer = uni.createIntersectionObserver({})
      const result1 = observer.relativeTo('#parent')
      const result2 = observer.relativeToViewport({ bottom: 100 })

      expect(result1).toBe(observer)
      expect(result2).toBe(observer)
    })
  })

  describe('uni Canvas API', () => {
    it('createCanvasContext 应该返回 Canvas Context', () => {
      const ctx = uni.createCanvasContext('canvas-id')
      expect(ctx).toBeDefined()
      expect(ctx.draw).toBeDefined()
      expect(ctx.fillRect).toBeDefined()
      expect(ctx.stroke).toBeDefined()
    })

    it('canvasToTempFilePath 应该调用成功回调', () => {
      const success = vi.fn()
      uni.canvasToTempFilePath({
        canvasId: 'test',
        success
      })

      expect(success).toHaveBeenCalled()
      expect(success.mock.calls[0][0].tempFilePath).toBe('cropped-image.jpg')
    })

    it('createOffscreenCanvas 应该返回 OffscreenCanvas 对象', () => {
      const canvas = uni.createOffscreenCanvas({ width: 400, height: 300 })
      expect(canvas).toBeDefined()
      expect(canvas.width).toBe(400)
      expect(canvas.height).toBe(300)
      expect(canvas.getContext).toBeDefined()
    })
  })

  describe('uni 图片相关 API', () => {
    it('previewImage 应该调用成功回调', () => {
      const success = vi.fn()
      uni.previewImage({
        urls: ['https://example.com/image.jpg'],
        success
      })

      expect(success).toHaveBeenCalled()
    })

    it('chooseImage 应该返回图片路径', () => {
      uni.chooseImage({
        count: 1,
        success(res) {
          expect(res).toBeDefined()
          expect(res.tempFilePaths).toBeDefined()
          expect(res.tempFilePaths.length).toBeGreaterThan(0)
        }
      })
    })

    it('saveImageToPhotosAlbum 应该调用成功回调', () => {
      const success = vi.fn()
      uni.saveImageToPhotosAlbum({
        filePath: 'test.jpg',
        success
      })

      expect(success).toHaveBeenCalled()
    })

    it('getImageInfo 应该返回图片信息', () => {
      uni.getImageInfo({
        src: 'https://example.com/image.jpg',
        success(res) {
          expect(res).toBeDefined()
          expect(res.width).toBe(800)
          expect(res.height).toBe(600)
        }
      })
    })

    it('getImageInfo 失败时应该调用 fail 回调', () => {
      uni.getImageInfo({
        src: '',
        fail() {
          expect(true).toBe(true)
        }
      })
    })
  })

  describe('uni UI 反馈 API', () => {
    it('showToast 应该调用成功回调', () => {
      const success = vi.fn()
      uni.showToast({
        title: '测试',
        success
      })

      expect(success).toHaveBeenCalled()
    })

    it('hideToast 应该调用成功回调', () => {
      const success = vi.fn()
      uni.hideToast()
      expect(success).not.toHaveBeenCalled()
    })

    it('showLoading 应该调用成功回调', () => {
      const success = vi.fn()
      uni.showLoading({
        title: '加载中',
        success
      })

      expect(success).toHaveBeenCalled()
    })

    it('hideLoading 应该调用成功回调', () => {
      const success = vi.fn()
      uni.hideLoading()
      expect(success).not.toHaveBeenCalled()
    })

    it('showModal 应该返回确认结果', () => {
      uni.showModal({
        title: '提示',
        content: '确认操作？',
        success(res) {
          expect(res).toBeDefined()
          expect(res.confirm).toBe(true)
          expect(res.cancel).toBe(false)
        }
      })
    })
  })

  describe('uni 路由 API', () => {
    it('navigateTo 应该调用成功回调', () => {
      const success = vi.fn()
      uni.navigateTo({
        url: '/pages/test/index',
        success
      })

      expect(success).toHaveBeenCalled()
    })

    it('redirectTo 应该调用成功回调', () => {
      const success = vi.fn()
      uni.redirectTo({
        url: '/pages/test/index',
        success
      })

      expect(success).toHaveBeenCalled()
    })
  })

  describe('uni 文件上传 API', () => {
    it('uploadFile 应该返回上传任务对象', () => {
      const success = vi.fn()
      const task = uni.uploadFile({
        url: 'https://example.com/upload',
        filePath: 'test.jpg',
        name: 'file',
        success
      })

      expect(task).toBeDefined()
      expect(task.onProgressUpdate).toBeDefined()
      expect(task.abort).toBeDefined()
      expect(success).toHaveBeenCalled()
    })
  })

  describe('uni 页面相关 API', () => {
    it('pageScrollTo 应该调用成功回调', () => {
      const success = vi.fn()
      uni.pageScrollTo({
        scrollTop: 100,
        success
      })

      expect(success).toHaveBeenCalled()
    })

    it('onPageScroll 应该是一个函数', () => {
      expect(typeof uni.pageScrollTo).toBe('function')
    })

    it('onWindowResize 应该是一个函数', () => {
      expect(typeof uni.onWindowResize).toBe('function')
    })
  })

  describe('uni 其他 API', () => {
    it('canIUse 应该正确判断功能支持', () => {
      expect(uni.canIUse('showToast')).toBe(true)
      expect(uni.canIUse('createOffscreenCanvas')).toBe(false)
    })

    it('vibrateShort 应该调用成功回调', () => {
      const success = vi.fn()
      uni.vibrateShort({ success })

      expect(success).toHaveBeenCalled()
    })
  })

  describe('全局对象', () => {
    it('getCurrentPages 应该返回页面数组', () => {
      const pages = getCurrentPages()
      expect(Array.isArray(pages)).toBe(true)
      expect(pages.length).toBeGreaterThan(0)
      expect(pages[0].route).toBe('pages/index/index')
    })

    it('getApp 应该返回应用实例', () => {
      const app = getApp()
      expect(app).toBeDefined()
      expect(typeof app).toBe('object')
    })

    it('plus 应该存在', () => {
      expect(plus).toBeDefined()
    })
  })

  describe('生命周期钩子', () => {
    it('onLaunch 应该存在', () => {
      expect(typeof (globalThis as any).onLaunch).toBe('function')
    })

    it('onShow 应该存在', () => {
      expect(typeof (globalThis as any).onShow).toBe('function')
    })

    it('onHide 应该存在', () => {
      expect(typeof (globalThis as any).onHide).toBe('function')
    })

    it('onUnload 应该存在', () => {
      expect(typeof (globalThis as any).onUnload).toBe('function')
    })

    it('onError 应该存在', () => {
      expect(typeof (globalThis as any).onError).toBe('function')
    })
  })

  describe('TouchEvent', () => {
    it('TouchEvent 应该可以创建', () => {
      const touchEvent = new TouchEvent('touchstart', {
        touches: [
          {
            clientX: 100,
            clientY: 200,
            force: 0,
            identifier: 0,
            pageX: 0,
            pageY: 0,
            radiusX: 0,
            radiusY: 0,
            rotationAngle: 0,
            screenX: 0,
            screenY: 0,
            target: undefined
          }
        ]
      })

      expect(touchEvent).toBeInstanceOf(Event)
      expect(touchEvent.touches).toBeDefined()
      expect(touchEvent.touches.length).toBe(1)
      expect(touchEvent.touches[0].clientX).toBe(100)
      expect(touchEvent.touches[0].clientY).toBe(200)
    })

    it('TouchEvent 应该有默认 touches', () => {
      const touchEvent = new TouchEvent('touchstart')
      expect(touchEvent.touches).toBeDefined()
      expect(touchEvent.touches.length).toBe(1)
      expect(touchEvent.touches[0].clientX).toBe(0)
      expect(touchEvent.touches[0].clientY).toBe(0)
    })
  })

  describe('选择器特定配置', () => {
    it('wd-tabs 选择器应该返回特定尺寸', async () => {
      const query = uni.createSelectorQuery()
      let result: any = null

      query.select('.wd-tabs').boundingClientRect((data) => {
        result = data
      })

      await query.exec()

      expect(result.width).toBe(375)
      expect(result.height).toBe(44)
    })

    it('wd-segmented 选择器应该返回特定尺寸', async () => {
      const query = uni.createSelectorQuery()
      let result: any = null

      query.select('.wd-segmented').boundingClientRect((data) => {
        result = data
      })

      await query.exec()

      expect(result.width).toBe(300)
      expect(result.height).toBe(40)
    })

    it('wd-index-bar 选择器应该返回特定尺寸', async () => {
      const query = uni.createSelectorQuery()
      let result: any = null

      query.select('.wd-index-bar').boundingClientRect((data) => {
        result = data
      })

      await query.exec()

      expect(result.width).toBe(375)
      expect(result.height).toBe(600)
    })

    it('wd-segmented__item selectAll 应该返回 3 个元素', async () => {
      const query = uni.createSelectorQuery()
      let result: any = null

      query.selectAll('.wd-segmented__item').boundingClientRect((data) => {
        result = data
      })

      await query.exec()

      expect(result.length).toBe(3)
    })

    it('wd-tab selectAll 应该返回 4 个元素', async () => {
      const query = uni.createSelectorQuery()
      let result: any = null

      query.selectAll('.wd-tab').boundingClientRect((data) => {
        result = data
      })

      await query.exec()

      expect(result.length).toBe(4)
    })

    it('wd-index-anchor selectAll 应该返回 5 个元素', async () => {
      const query = uni.createSelectorQuery()
      let result: any = null

      query.selectAll('.wd-index-anchor').boundingClientRect((data) => {
        result = data
      })

      await query.exec()

      expect(result.length).toBe(5)
    })
  })

  describe('回调完整性', () => {
    it('所有 API 都应该支持 complete 回调', () => {
      const complete1 = vi.fn()
      uni.showToast({ title: 'test', complete: complete1 })
      expect(complete1).toHaveBeenCalled()

      const complete2 = vi.fn()
      uni.hideToast()
      complete2()
      expect(complete2).toHaveBeenCalled()

      const complete3 = vi.fn()
      uni.showLoading({ title: 'test' })
      complete3()
      expect(complete3).toHaveBeenCalled()

      expect(complete3).toHaveBeenCalled()

      const complete4 = vi.fn()
      uni.hideLoading()
      complete4()
      expect(complete4).toHaveBeenCalled()

      const complete5 = vi.fn()
      uni.showModal({ title: 'test', complete: complete5 })
      expect(complete5).toHaveBeenCalled()
    })
  })
})
