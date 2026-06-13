<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('select.demo.basic') }}</text>
      <view class="content">
        <see-select v-model="singleValue" :options="basicOptions" :placeholder="t('select.demo.cityPlaceholder')" />
        <text class="info">{{ t('select.demo.selectedValue') }}{{ singleValue || t('select.demo.none') }}</text>
      </view>

      <text class="title">{{ t('select.demo.multiple') }}</text>
      <view class="content">
        <see-select v-model="multiValue" :options="basicOptions" is-multiple :placeholder="t('select.demo.multiPlaceholder')" />
        <text class="info">{{ t('select.demo.selectedValue') }}{{ JSON.stringify(multiValue) }}</text>
      </view>

      <text class="title">{{ t('select.demo.multipleMaxTags') }}</text>
      <view class="content">
        <see-select
          v-model="multiMaxValue"
          :options="basicOptions"
          is-multiple
          :max-tag-count="2"
          :placeholder="t('select.demo.maxTagPlaceholder')"
        />
      </view>

      <text class="title">{{ t('select.demo.filterable') }}</text>
      <view class="content">
        <see-select v-model="filterValue" :options="basicOptions" is-filterable :placeholder="t('select.demo.filterPlaceholder')" />
      </view>

      <text class="title">{{ t('select.demo.disabled') }}</text>
      <view class="content">
        <see-select :model-value="'beijing'" :options="basicOptions" is-disabled :placeholder="t('select.demo.disabledPlaceholder')" />
      </view>

      <text class="title">{{ t('select.demo.readonly') }}</text>
      <view class="content">
        <see-select :model-value="'shanghai'" :options="basicOptions" is-readonly :placeholder="t('select.demo.readonlyPlaceholder')" />
      </view>

      <text class="title">{{ t('select.demo.clearable') }}</text>
      <view class="content">
        <see-select v-model="clearableValue" :options="basicOptions" is-clearable :placeholder="t('select.demo.clearablePlaceholder')" />
      </view>

      <text class="title">{{ t('select.demo.disabledOption') }}</text>
      <view class="content">
        <see-select v-model="disabledOptValue" :options="disabledOptions" :placeholder="t('select.demo.disabledOptPlaceholder')" />
      </view>

      <text class="title">{{ t('select.demo.sizes') }}</text>
      <view class="content">
        <see-select v-model="sizeValue1" :options="basicOptions" size="small" :placeholder="t('select.demo.smallPlaceholder')" />
        <see-select v-model="sizeValue2" :options="basicOptions" size="default" :placeholder="t('select.demo.defaultPlaceholder')" />
        <see-select v-model="sizeValue3" :options="basicOptions" size="large" :placeholder="t('select.demo.largePlaceholder')" />
      </view>

      <text class="title">{{ t('select.demo.group') }}</text>
      <view class="content">
        <see-select v-model="groupValue" :options="groupOptions" :placeholder="t('select.demo.groupPlaceholder')" />
      </view>

      <text class="title">{{ t('select.demo.noBorder') }}</text>
      <view class="content">
        <see-select v-model="borderValue" :options="basicOptions" :is-border="false" :placeholder="t('select.demo.noBorderPlaceholder')" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seeSelect')

const basicOptions = [
  { label: t('select.data.beijing'), value: 'beijing' },
  { label: t('select.data.shanghai'), value: 'shanghai' },
  { label: t('select.data.guangzhou'), value: 'guangzhou' },
  { label: t('select.data.shenzhen'), value: 'shenzhen' },
  { label: t('select.data.hangzhou'), value: 'hangzhou' },
  { label: t('select.data.chengdu'), value: 'chengdu' }
]

const disabledOptions = [
  { label: t('select.demo.option1'), value: 1 },
  { label: t('select.demo.option2Disabled'), value: 2, isDisabled: true },
  { label: t('select.demo.option3'), value: 3 },
  { label: t('select.demo.option4Disabled'), value: 4, isDisabled: true },
  { label: t('select.demo.option5'), value: 5 }
]

const groupOptions = [
  {
    label: t('select.demo.eastChina'),
    value: 'east',
    children: [
      { label: t('select.data.shanghai'), value: 'shanghai' },
      { label: t('select.data.hangzhou'), value: 'hangzhou' },
      { label: t('select.data.nanjing'), value: 'nanjing' }
    ]
  },
  {
    label: t('select.demo.southChina'),
    value: 'south',
    children: [
      { label: t('select.data.guangzhou'), value: 'guangzhou' },
      { label: t('select.data.shenzhen'), value: 'shenzhen' }
    ]
  },
  {
    label: t('select.demo.southwestChina'),
    value: 'southwest',
    children: [
      { label: t('select.data.chengdu'), value: 'chengdu' },
      { label: t('select.data.chongqing'), value: 'chongqing' }
    ]
  }
]

const singleValue = ref('')
const multiValue = ref<(string | number)[]>([])
const multiMaxValue = ref<(string | number)[]>([])
const filterValue = ref('')
const clearableValue = ref('beijing')
const disabledOptValue = ref('')
const sizeValue1 = ref('')
const sizeValue2 = ref('')
const sizeValue3 = ref('')
const groupValue = ref('')
const borderValue = ref('')
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  overflow: hidden;
  padding: 12px;
  box-sizing: border-box;

  .title {
    font-size: 18px;
    color: #999;
  }
  .content {
    margin-top: 12px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.info {
  font-size: 12px;
  color: #999;
}
</style>
