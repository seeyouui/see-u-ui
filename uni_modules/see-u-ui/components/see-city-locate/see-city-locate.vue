<template>
  <view class="see-city-locate">
    <!-- 搜索框 -->
    <view v-if="isShowSearch" class="see-city-locate__search">
      <input class="see-city-locate__search-input" type="text" :placeholder="displaySearchPlaceholder" :value="searchQuery" @input="handleSearch" />
    </view>

    <!-- 定位区域 -->
    <view v-if="isShowLocation" class="see-city-locate__location">
      <text class="see-city-locate__location-label">{{ t('cityLocate.currentCity') }}</text>
      <view class="see-city-locate__location-city" @tap="handleLocate">
        <text class="see-city-locate__location-text">{{ locatedCity ? getCityName(locatedCity) : displayLocateText }}</text>
      </view>
    </view>

    <!-- 热门城市 -->
    <view v-if="hotCitiesData.length > 0" class="see-city-locate__hot">
      <text class="see-city-locate__section-title">{{ t('cityLocate.hotCities') }}</text>
      <view class="see-city-locate__hot-grid">
        <view v-for="city in hotCitiesData" :key="city.id" class="see-city-locate__hot-item" @tap="handleSelect(city)">
          <text class="see-city-locate__hot-text">{{ getCityName(city) }}</text>
        </view>
      </view>
    </view>

    <!-- 最近访问 -->
    <view v-if="isShowHistory && historyCities.length > 0" class="see-city-locate__history">
      <text class="see-city-locate__section-title">{{ t('cityLocate.recent') }}</text>
      <scroll-view class="see-city-locate__history-scroll" scroll-x>
        <view class="see-city-locate__history-list">
          <view v-for="city in historyCities" :key="city.id" class="see-city-locate__history-item" @tap="handleSelect(city)">
            <text class="see-city-locate__history-text">{{ getCityName(city) }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 城市列表 -->
    <view class="see-city-locate__list">
      <scroll-view class="see-city-locate__scroll" scroll-y :scroll-into-view="scrollIntoView" scroll-with-animation>
        <view v-for="group in filteredGroups" :id="'group-' + group[0]" :key="group[0]" class="see-city-locate__group">
          <view class="see-city-locate__group-header">
            <text class="see-city-locate__group-letter">{{ group[0] }}</text>
          </view>
          <view v-for="city in group[1]" :key="city.id" class="see-city-locate__city-item" @tap="handleSelect(city)">
            <text class="see-city-locate__city-name">{{ getCityName(city) }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 右侧索引导航条 -->
      <view class="see-city-locate__nav">
        <view v-for="letter in navLetters" :key="letter" class="see-city-locate__nav-item" @tap="handleNavTap(letter)">
          <text class="see-city-locate__nav-text">{{ letter }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../../locale'
import type { CityInfo, SeeCityLocateProps, SeeCityLocateEmits } from './type'
import { builtinCities, defaultHotCities, groupCitiesByLetter, searchCities } from './city-data'

defineOptions({ name: 'SeeCityLocate' })

const { t, getLocale } = useI18n()

/**
 * 根据当前语言返回城市显示名
 * 英文环境下优先使用 nameEn，中文环境使用 name
 */
const getCityName = (city: CityInfo): string => {
  if (getLocale() === 'en' && city.nameEn) {
    return city.nameEn
  }
  return city.name
}

/** ---------- props ---------- */
const props = withDefaults(defineProps<SeeCityLocateProps>(), {
  modelValue: null,
  hotCities: () => defaultHotCities,
  cities: () => builtinCities,
  isShowSearch: true,
  isShowLocation: true,
  isShowHistory: true,
  isInternational: false,
  maxHistory: 10,
  searchPlaceholder: '',
  locateText: ''
})

/** ---------- emits ---------- */
const emit = defineEmits<SeeCityLocateEmits>()

/** ---------- computed ---------- */
const displaySearchPlaceholder = computed(() => props.searchPlaceholder || t('cityLocate.searchPlaceholder'))
const displayLocateText = computed(() => props.locateText || t('cityLocate.locating'))

/** ---------- state ---------- */
const searchQuery = ref('')
const locatedCity = ref<CityInfo | null>(null)
const historyCities = ref<CityInfo[]>([])
const scrollIntoView = ref('')

/** ---------- computed ---------- */
const hotCitiesData = computed(() => {
  return props.hotCities.length > 0 ? props.hotCities : defaultHotCities
})

const allCities = computed(() => {
  return props.cities.length > 0 ? props.cities : builtinCities
})

const groupedCities = computed(() => {
  return groupCitiesByLetter(allCities.value)
})

const filteredGroups = computed(() => {
  if (!searchQuery.value) return groupedCities.value

  const filtered = searchCities(allCities.value, searchQuery.value)
  return groupCitiesByLetter(filtered)
})

const navLetters = computed(() => {
  return filteredGroups.value.map(([letter]) => letter)
})

/** ---------- methods ---------- */
const handleSearch = (e: any) => {
  searchQuery.value = e.detail?.value || e.target?.value || ''
}

const handleSelect = (city: CityInfo) => {
  saveHistory(city)
  emit('onSelect', city)
}

const handleLocate = () => {
  if (locatedCity.value) {
    emit('onSelect', locatedCity.value)
    return
  }

  // GPS 定位
  uni.getLocation({
    type: 'gcj02',
    // 超时设置（部分小程序端支持），避免长时间无响应卡在"定位中"
    // @ts-expect-error - uni-app 类型定义未覆盖该字段
    timeout: 10000,
    success: (res) => {
      const { latitude, longitude } = res
      // 匹配最近城市
      const matched = findNearestCity(latitude, longitude)
      if (matched) {
        locatedCity.value = matched
        emit('onLocate', matched)
      } else {
        emit('onLocateError', t('cityLocate.noMatchCity'))
      }
    },
    fail: (err) => {
      const msg = err?.errMsg || t('cityLocate.demo.locateError', { error: '' })
      // 识别权限拒绝场景，引导用户去设置中开启
      if (/deny|denied|disable|auth/i.test(msg)) {
        // #ifdef MP-WEIXIN || MP-ALIPAY || MP-BAIDU || MP-TOUTIAO || MP-QQ
        uni.showModal({
          title: t('cityLocate.locationPermissionTitle'),
          content: t('cityLocate.locationPermissionContent'),
          confirmText: t('cityLocate.goToSettings'),
          success: (modalRes) => {
            if (modalRes.confirm) {
              uni.openSetting?.({})
            }
          }
        })
        // #endif
        emit('onLocateError', t('cityLocate.locationPermissionTitle'))
      } else {
        emit('onLocateError', msg)
      }
    }
  })
}

// 用 Haversine 公式计算两个经纬度之间的真实距离（km），跨纬度也准确
const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371 // 地球半径，单位 km
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

const findNearestCity = (lat: number, lng: number): CityInfo | null => {
  let minDist = Infinity
  let nearest: CityInfo | null = null

  for (const city of allCities.value) {
    // 使用 != null 判断字段存在，避免赤道（latitude===0）被误判为缺失
    if (city.latitude != null && city.longitude != null) {
      const dist = haversineDistance(city.latitude, city.longitude, lat, lng)
      if (dist < minDist) {
        minDist = dist
        nearest = city
      }
    }
  }

  return nearest
}

const handleNavTap = (letter: string) => {
  scrollIntoView.value = `group-${letter}`
}

const loadHistory = () => {
  try {
    const cached = uni.getStorageSync('see-city-history')
    if (cached) {
      historyCities.value = JSON.parse(cached).slice(0, props.maxHistory)
    }
  } catch {
    // 忽略解析错误
  }
}

const saveHistory = (city: CityInfo) => {
  const existing = historyCities.value.filter((c) => c.id !== city.id)
  historyCities.value = [city, ...existing].slice(0, props.maxHistory)

  try {
    uni.setStorageSync('see-city-history', JSON.stringify(historyCities.value))
  } catch {
    // 忽略存储错误
  }
}

/** ---------- lifecycle ---------- */
onMounted(() => {
  loadHistory()
})
</script>

<style lang="scss" scoped>
.see-city-locate {
  width: 100%;
  background: var(--see-bg-color);
  min-height: 100vh;

  &__search {
    padding: 16rpx 24rpx;
    background: var(--see-bg-color);
  }

  &__search-input {
    height: var(--see-city-locate-search-height, 80rpx);
    background: var(--see-info-light, #f2f3f5);
    border-radius: 40rpx;
    padding: 0 32rpx;
    font-size: 28rpx;
    color: var(--see-main-color);
  }

  &__location {
    display: flex;
    align-items: center;
    padding: 24rpx;
    border-bottom: 1rpx solid var(--see-border-four-color);
  }

  &__location-label {
    font-size: 28rpx;
    color: var(--see-tips-color);
    margin-right: 16rpx;
  }

  &__location-city {
    padding: 8rpx 24rpx;
    background: var(--see-primary-light, #e9f6ff);
    border-radius: 8rpx;
  }

  &__location-text {
    font-size: 28rpx;
    color: var(--see-primary);
  }

  &__hot {
    padding: 24rpx;
    border-bottom: 1rpx solid var(--see-border-four-color);
  }

  &__section-title {
    font-size: 26rpx;
    color: var(--see-tips-color);
    margin-bottom: 16rpx;
    display: block;
  }

  &__hot-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--see-city-locate-hot-city-gap, 16rpx);
  }

  &__hot-item {
    padding: 12rpx 24rpx;
    background: var(--see-info-light, #f2f3f5);
    border-radius: 8rpx;
  }

  &__hot-text {
    font-size: 26rpx;
    color: var(--see-main-color);
  }

  &__history {
    padding: 24rpx;
    border-bottom: 1rpx solid var(--see-border-four-color);
  }

  &__history-scroll {
    white-space: nowrap;
  }

  &__history-list {
    display: flex;
    gap: 16rpx;
  }

  &__history-item {
    padding: 8rpx 24rpx;
    background: var(--see-info-light, #f2f3f5);
    border-radius: 8rpx;
    flex-shrink: 0;
  }

  &__history-text {
    font-size: 26rpx;
    color: var(--see-main-color);
  }

  &__list {
    position: relative;
    flex: 1;
  }

  &__scroll {
    height: calc(100vh - 400rpx);
  }

  &__group-header {
    padding: 0 24rpx;
    height: var(--see-index-list-header-height, 56rpx);
    display: flex;
    align-items: center;
    background: var(--see-index-list-header-bg, var(--see-border-four-color));
    position: sticky;
    top: 0;
    z-index: 1;
  }

  &__group-letter {
    font-size: 26rpx;
    color: var(--see-tips-color);
    font-weight: 500;
  }

  &__city-item {
    display: flex;
    align-items: center;
    height: var(--see-index-list-item-height, 88rpx);
    padding: 0 24rpx;
    border-bottom: 1rpx solid var(--see-border-four-color);
  }

  &__city-name {
    font-size: 30rpx;
    color: var(--see-main-color);
  }

  &__nav {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8rpx 0;
    z-index: 10;
  }

  &__nav-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--see-index-list-nav-width, 40rpx);
    height: 32rpx;
  }

  &__nav-text {
    font-size: var(--see-index-list-nav-font-size, 22rpx);
    color: var(--see-content-color);
  }
}
</style>
