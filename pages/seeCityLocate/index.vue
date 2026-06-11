<template>
  <view class="demo-city-locate">
    <see-city-locate @on-select="onSelect" @on-locate="onLocate" @on-locate-error="onLocateError" />
  </view>
</template>

<script lang="ts" setup>
import SeeCityLocate from '@/uni_modules/see-u-ui/components/see-city-locate/see-city-locate.vue'
import type { CityInfo } from '@/uni_modules/see-u-ui/components/see-city-locate/type'

const onSelect = (city: CityInfo) => {
  uni.showToast({ title: `选择了: ${city.name}`, icon: 'none' })
}

const onLocate = (city: CityInfo) => {
  uni.showToast({ title: `定位到: ${city.name}`, icon: 'none' })
}

const onLocateError = (error: string) => {
  uni.showToast({ title: `定位失败: ${error}`, icon: 'none' })
}
</script>

<style lang="scss" scoped>
.demo-city-locate {
  background: var(--see-bg-color);
  min-height: 100vh;
}
</style>
