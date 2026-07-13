import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeNavbar AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeNavbar',
  tag: 'see-navbar',
  title: '自定义导航栏',
  titleEn: 'Navbar',
  category: '导航组件',
  description: '自定义导航栏，支持标题、左右按钮、返回箭头、搜索模式、毛玻璃、安全区适配与 fixed 固定占位',
  docUrl: '/components/navbar/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-navbar title="页面标题" :left-arrow="true" @on-back="onBack" />\n</template>'
    },
    {
      title: '搜索模式',
      code: '<template>\n  <see-navbar :is-search="true" search-placeholder="搜索商品" @on-search="onSearch" @on-right-click="onRight" />\n</template>'
    }
  ]
}

export default meta
