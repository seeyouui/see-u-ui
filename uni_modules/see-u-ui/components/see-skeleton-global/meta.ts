import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeSkeletonGlobal AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeSkeletonGlobal',
  tag: 'see-skeleton-global',
  title: '全局骨架屏',
  titleEn: 'SkeletonGlobal',
  category: '布局组件',
  description: '全局全屏骨架屏，内置导航栏+卡片预设布局，由 useSkeletonGlobal 的 show/hide 控制显隐，可自定义行数、动画与颜色。',
  docUrl: '/components/skeleton-global/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-skeleton-global />\n  <view class="content">页面内容</view>\n</template>\n\n<script setup>\nimport { useSkeletonGlobal } from \'@/uni_modules/see-u-ui\'\nconst { show, hide } = useSkeletonGlobal()\nshow()\n// 数据加载完成后调用 hide()\n</script>'
    },
    {
      title: '自定义骨架',
      code: '<see-skeleton-global :rows="6" :animate="true">\n  <view>自定义骨架内容</view>\n</see-skeleton-global>'
    }
  ]
}

export default meta
