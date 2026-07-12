/**
 * 城市信息
 */
export interface CityInfo {
  /** 城市 ID */
  id: string | number
  /** 城市名称 */
  name: string
  /** 英文名称 */
  nameEn?: string
  /** 拼音 */
  pinyin?: string
  /** 首字母 */
  firstLetter?: string
  /** 父级 ID */
  parentId?: string
  /** 层级 */
  level: 'country' | 'province' | 'city' | 'district'
  /** 纬度 */
  latitude?: number
  /** 经度 */
  longitude?: number
  /** 是否热门城市 */
  hot?: boolean
}

/**
 * SeeCityLocate Props
 */
export interface SeeCityLocateProps {
  /** 当前选中的城市 */
  modelValue?: CityInfo | null
  /** 热门城市列表 */
  hotCities?: CityInfo[]
  /** 城市数据列表 */
  cities?: CityInfo[]
  /** 是否显示搜索框 */
  isShowSearch?: boolean
  /** 是否显示定位功能 */
  isShowLocation?: boolean
  /** 是否显示最近访问 */
  isShowHistory?: boolean
  /** 是否支持国际城市 */
  isInternational?: boolean
  /** 最近访问最大数量 */
  maxHistory?: number
  /** 搜索框占位文字 */
  searchPlaceholder?: string
  /** 定位按钮文字 */
  locateText?: string
}

/**
 * SeeCityLocate 事件
 */
export interface SeeCityLocateEmits {
  /** 选择城市 */
  (e: 'onSelect', city: CityInfo): void
  /** 定位成功 */
  (e: 'onLocate', city: CityInfo): void
  /** 定位失败 */
  (e: 'onLocateError', error: string): void
  /** v-model 更新 */
  (e: 'update:modelValue', city: CityInfo): void
}
