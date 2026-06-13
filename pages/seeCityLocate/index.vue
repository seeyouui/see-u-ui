<template>
  <view class="demo-city-locate">
    <see-city-locate @on-select="onSelect" @on-locate="onLocate" @on-locate-error="onLocateError" />
  </view>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import SeeCityLocate from '@/uni_modules/see-u-ui/components/see-city-locate/see-city-locate.vue'
import type { CityInfo } from '@/uni_modules/see-u-ui/components/see-city-locate/type'

const { t } = useI18n()
useNavbarI18n('navbar.seeCityLocate')

const onSelect = (city: CityInfo) => {
  uni.showToast({ title: t('cityLocate.demo.selected', { name: city.name }), icon: 'none' })
}

const onLocate = (city: CityInfo) => {
  uni.showToast({ title: t('cityLocate.demo.located', { name: city.name }), icon: 'none' })
}

const onLocateError = (error: string) => {
  uni.showToast({ title: t('cityLocate.demo.locateError', { error }), icon: 'none' })
}
</script>

<style lang="scss" scoped>
.demo-city-locate {
  background: var(--see-bg-color);
  min-height: 100vh;
}
</style>
