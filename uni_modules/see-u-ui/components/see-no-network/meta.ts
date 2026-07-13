import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeNoNetwork AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeNoNetwork',
  tag: 'see-no-network',
  title: '无网络提示',
  titleEn: 'NoNetwork',
  category: '布局组件',
  description: '无网络提示组件，可自动监听设备网络状态并在断网时显示提示，支持手动重试、全屏及自定义文案。',
  docUrl: '/components/no-network/',
  examples: [
    {
      title: '自动监听',
      code: '<see-no-network @on-retry="handleRetry" @on-network-change="handleChange" />'
    },
    {
      title: '手动控制',
      code: '<see-no-network v-model:show="show" :auto-check="false" text="网络连接已断开" retry-text="重新加载" />'
    }
  ]
}

export default meta
