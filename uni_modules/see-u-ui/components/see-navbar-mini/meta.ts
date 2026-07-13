import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeNavbarMini AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeNavbarMini',
  tag: 'see-navbar-mini',
  title: '迷你导航栏',
  titleEn: 'NavbarMini',
  category: '导航组件',
  description: '迷你导航栏，轻量版标题栏，支持返回按钮、自定义高度与背景色,适用于子页面顶部导航',
  docUrl: '/components/navbar-mini/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-navbar-mini title="子页面标题" :is-show-back="true" @on-back="onBack" />\n</template>'
    }
  ]
}

export default meta
