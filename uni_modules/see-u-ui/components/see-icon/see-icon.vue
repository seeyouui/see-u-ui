<template>
  <view class="see-icon">{{ t('icon.component.placeholder') }}</view>
</template>

<script lang="ts" setup>
/**
 * Icon 图标
 * @description 暂无说明
 * @tutorial http://113.44.242.235:9000/components/icon/
 *
 * @property {String | Number}										text			内容
 *
 * @example
 */
import { useI18n } from '../../locale'

defineOptions({
  name: 'SeeIcon'
})

const { t } = useI18n()
</script>

<style lang="scss" scoped></style>
