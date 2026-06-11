import type { CityInfo } from './type'

/**
 * 内置中国城市数据
 * 包含主要城市，含拼音、经纬度、热门标记
 */
export const builtinCities: CityInfo[] = [
  // 直辖市
  {
    id: 'beijing',
    name: '北京',
    nameEn: 'Beijing',
    pinyin: 'beijing',
    firstLetter: 'B',
    level: 'city',
    latitude: 39.9042,
    longitude: 116.4074,
    hot: true
  },
  {
    id: 'shanghai',
    name: '上海',
    nameEn: 'Shanghai',
    pinyin: 'shanghai',
    firstLetter: 'S',
    level: 'city',
    latitude: 31.2304,
    longitude: 121.4737,
    hot: true
  },
  {
    id: 'guangzhou',
    name: '广州',
    nameEn: 'Guangzhou',
    pinyin: 'guangzhou',
    firstLetter: 'G',
    level: 'city',
    latitude: 23.1291,
    longitude: 113.2644,
    hot: true
  },
  {
    id: 'shenzhen',
    name: '深圳',
    nameEn: 'Shenzhen',
    pinyin: 'shenzhen',
    firstLetter: 'S',
    level: 'city',
    latitude: 22.5431,
    longitude: 114.0579,
    hot: true
  },
  {
    id: 'chengdu',
    name: '成都',
    nameEn: 'Chengdu',
    pinyin: 'chengdu',
    firstLetter: 'C',
    level: 'city',
    latitude: 30.5728,
    longitude: 104.0668,
    hot: true
  },
  {
    id: 'hangzhou',
    name: '杭州',
    nameEn: 'Hangzhou',
    pinyin: 'hangzhou',
    firstLetter: 'H',
    level: 'city',
    latitude: 30.2741,
    longitude: 120.1551,
    hot: true
  },
  { id: 'wuhan', name: '武汉', nameEn: 'Wuhan', pinyin: 'wuhan', firstLetter: 'W', level: 'city', latitude: 30.5928, longitude: 114.3055, hot: true },
  {
    id: 'nanjing',
    name: '南京',
    nameEn: 'Nanjing',
    pinyin: 'nanjing',
    firstLetter: 'N',
    level: 'city',
    latitude: 32.0603,
    longitude: 118.7969,
    hot: true
  },
  {
    id: 'chongqing',
    name: '重庆',
    nameEn: 'Chongqing',
    pinyin: 'chongqing',
    firstLetter: 'C',
    level: 'city',
    latitude: 29.4316,
    longitude: 106.9123,
    hot: true
  },
  { id: 'xian', name: '西安', nameEn: "Xi'an", pinyin: 'xian', firstLetter: 'X', level: 'city', latitude: 34.3416, longitude: 108.9398, hot: true },
  {
    id: 'suzhou',
    name: '苏州',
    nameEn: 'Suzhou',
    pinyin: 'suzhou',
    firstLetter: 'S',
    level: 'city',
    latitude: 31.299,
    longitude: 120.5853,
    hot: true
  },
  {
    id: 'tianjin',
    name: '天津',
    nameEn: 'Tianjin',
    pinyin: 'tianjin',
    firstLetter: 'T',
    level: 'city',
    latitude: 39.3434,
    longitude: 117.3616,
    hot: true
  },

  // 省会城市
  { id: 'changsha', name: '长沙', nameEn: 'Changsha', pinyin: 'changsha', firstLetter: 'C', level: 'city', latitude: 28.2282, longitude: 112.9388 },
  {
    id: 'zhengzhou',
    name: '郑州',
    nameEn: 'Zhengzhou',
    pinyin: 'zhengzhou',
    firstLetter: 'Z',
    level: 'city',
    latitude: 34.7466,
    longitude: 113.6254
  },
  { id: 'dongguan', name: '东莞', nameEn: 'Dongguan', pinyin: 'dongguan', firstLetter: 'D', level: 'city', latitude: 23.0207, longitude: 113.7518 },
  { id: 'kunming', name: '昆明', nameEn: 'Kunming', pinyin: 'kunming', firstLetter: 'K', level: 'city', latitude: 25.0389, longitude: 102.7183 },
  { id: 'dalian', name: '大连', nameEn: 'Dalian', pinyin: 'dalian', firstLetter: 'D', level: 'city', latitude: 38.914, longitude: 121.6147 },
  { id: 'qingdao', name: '青岛', nameEn: 'Qingdao', pinyin: 'qingdao', firstLetter: 'Q', level: 'city', latitude: 36.0671, longitude: 120.3826 },
  { id: 'shenyang', name: '沈阳', nameEn: 'Shenyang', pinyin: 'shenyang', firstLetter: 'S', level: 'city', latitude: 41.8057, longitude: 123.4315 },
  { id: 'hefei', name: '合肥', nameEn: 'Hefei', pinyin: 'hefei', firstLetter: 'H', level: 'city', latitude: 31.8206, longitude: 117.2272 },
  { id: 'fuzhou', name: '福州', nameEn: 'Fuzhou', pinyin: 'fuzhou', firstLetter: 'F', level: 'city', latitude: 26.0745, longitude: 119.2965 },
  { id: 'xiamen', name: '厦门', nameEn: 'Xiamen', pinyin: 'xiamen', firstLetter: 'X', level: 'city', latitude: 24.4798, longitude: 118.0894 },
  { id: 'jinan', name: '济南', nameEn: 'Jinan', pinyin: 'jinan', firstLetter: 'J', level: 'city', latitude: 36.6512, longitude: 116.9972 },
  { id: 'wenzhou', name: '温州', nameEn: 'Wenzhou', pinyin: 'wenzhou', firstLetter: 'W', level: 'city', latitude: 27.9939, longitude: 120.6993 },
  { id: 'haikou', name: '海口', nameEn: 'Haikou', pinyin: 'haikou', firstLetter: 'H', level: 'city', latitude: 20.044, longitude: 110.1999 },
  { id: 'nanning', name: '南宁', nameEn: 'Nanning', pinyin: 'nanning', firstLetter: 'N', level: 'city', latitude: 22.817, longitude: 108.3665 },
  { id: 'guiyang', name: '贵阳', nameEn: 'Guiyang', pinyin: 'guiyang', firstLetter: 'G', level: 'city', latitude: 26.647, longitude: 106.6302 },
  { id: 'nanchang', name: '南昌', nameEn: 'Nanchang', pinyin: 'nanchang', firstLetter: 'N', level: 'city', latitude: 28.682, longitude: 115.8579 },
  { id: 'harbin', name: '哈尔滨', nameEn: 'Harbin', pinyin: 'haerbin', firstLetter: 'H', level: 'city', latitude: 45.8038, longitude: 126.534 },
  {
    id: 'changchun',
    name: '长春',
    nameEn: 'Changchun',
    pinyin: 'changchun',
    firstLetter: 'C',
    level: 'city',
    latitude: 43.8171,
    longitude: 125.3235
  },
  { id: 'lanzhou', name: '兰州', nameEn: 'Lanzhou', pinyin: 'lanzhou', firstLetter: 'L', level: 'city', latitude: 36.0611, longitude: 103.8343 },
  { id: 'taiyuan', name: '太原', nameEn: 'Taiyuan', pinyin: 'taiyuan', firstLetter: 'T', level: 'city', latitude: 37.8706, longitude: 112.5489 },
  { id: 'yinchuan', name: '银川', nameEn: 'Yinchuan', pinyin: 'yinchuan', firstLetter: 'Y', level: 'city', latitude: 38.4872, longitude: 106.2309 },
  { id: 'xining', name: '西宁', nameEn: 'Xining', pinyin: 'xining', firstLetter: 'X', level: 'city', latitude: 36.6171, longitude: 101.7782 },
  { id: 'urumqi', name: '乌鲁木齐', nameEn: 'Urumqi', pinyin: 'wulumuqi', firstLetter: 'W', level: 'city', latitude: 43.8256, longitude: 87.6168 },
  { id: 'lhasa', name: '拉萨', nameEn: 'Lhasa', pinyin: 'lasa', firstLetter: 'L', level: 'city', latitude: 29.65, longitude: 91.1 },
  { id: 'hohhot', name: '呼和浩特', nameEn: 'Hohhot', pinyin: 'huhehaote', firstLetter: 'H', level: 'city', latitude: 40.8422, longitude: 111.749 },
  { id: 'zhuhai', name: '珠海', nameEn: 'Zhuhai', pinyin: 'zhuhai', firstLetter: 'Z', level: 'city', latitude: 22.271, longitude: 113.5767 },
  { id: 'foshan', name: '佛山', nameEn: 'Foshan', pinyin: 'foshan', firstLetter: 'F', level: 'city', latitude: 23.0218, longitude: 113.1219 },
  { id: 'wuxi', name: '无锡', nameEn: 'Wuxi', pinyin: 'wuxi', firstLetter: 'W', level: 'city', latitude: 31.4912, longitude: 120.3119 },
  { id: 'yantai', name: '烟台', nameEn: 'Yantai', pinyin: 'yantai', firstLetter: 'Y', level: 'city', latitude: 37.4638, longitude: 121.4479 },
  { id: 'ningbo', name: '宁波', nameEn: 'Ningbo', pinyin: 'ningbo', firstLetter: 'N', level: 'city', latitude: 29.8683, longitude: 121.544 }
]

/**
 * 默认热门城市
 */
export const defaultHotCities: CityInfo[] = builtinCities.filter((city) => city.hot)

/**
 * 按首字母分组城市
 */
export function groupCitiesByLetter(cities: CityInfo[]): [string, CityInfo[]][] {
  const groups: Record<string, CityInfo[]> = {}

  cities.forEach((city) => {
    const letter = (city.firstLetter || '#').toUpperCase()
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(city)
  })

  return Object.entries(groups).sort(([a], [b]) => {
    if (a === '#') return 1
    if (b === '#') return -1
    return a.localeCompare(b)
  })
}

/**
 * 搜索城市（支持中文、拼音、首字母）
 */
export function searchCities(cities: CityInfo[], query: string): CityInfo[] {
  if (!query) return cities

  const lowerQuery = query.toLowerCase()

  return cities.filter((city) => {
    const name = city.name.toLowerCase()
    const pinyin = (city.pinyin || '').toLowerCase()
    const firstLetter = (city.firstLetter || '').toLowerCase()
    const nameEn = (city.nameEn || '').toLowerCase()

    return name.includes(lowerQuery) || pinyin.includes(lowerQuery) || firstLetter.includes(lowerQuery) || nameEn.includes(lowerQuery)
  })
}
