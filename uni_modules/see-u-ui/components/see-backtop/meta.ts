import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeBacktop AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeBacktop',
  tag: 'see-backtop',
  title: '返回顶部',
  titleEn: 'BackTop',
  category: '导航组件',
  description: '返回顶部按钮，页面滚动超过阈值时浮现，点击平滑滚动回顶部，支持自定义位置、层级与图标插槽',
  docUrl: '/components/backtop/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-backtop />\n</template>'
    },
    {
      title: '自定义阈值与位置',
      code: '<template>\n  <see-backtop :visibility-height="300" :right="30" :bottom="100" @on-click="handleClick" />\n</template>'
    }
  ]
}

export default meta
