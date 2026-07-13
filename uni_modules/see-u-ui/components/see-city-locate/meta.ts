import type { ComponentMeta } from '../../utils/shared/ai-meta-types'

/** SeeCityLocate AI 元数据 */
const meta: ComponentMeta = {
  name: 'SeeCityLocate',
  tag: 'see-city-locate',
  title: '城市定位选择',
  titleEn: 'CityLocate',
  category: '导航组件',
  description: '城市选择器，内置城市数据按首字母分组，支持搜索、GPS 定位、热门城市、最近访问历史与右侧字母索引导航',
  docUrl: '/components/city-locate/',
  examples: [
    {
      title: '基本使用',
      code: '<template>\n  <see-city-locate v-model="city" @on-select="onSelect" />\n</template>'
    },
    {
      title: '带定位与自定义配置',
      code: '<template>\n  <see-city-locate\n    v-model="city"\n    :is-show-history="true"\n    :max-history="8"\n    @on-select="onSelect"\n    @on-locate="onLocate"\n    @on-locate-error="onError"\n  />\n</template>'
    }
  ]
}

export default meta
