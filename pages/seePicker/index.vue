<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('picker.demo.single') }}</text>
      <view class="content">
        <see-picker
          v-model="singleValue"
          :columns="singleColumns"
          :placeholder="t('picker.demo.placeholderFruit')"
          :toolbar-title="t('picker.demo.toolbarFruit')"
          @on-confirm="handleSingleConfirm"
        />
        <text class="result-text">{{ t('picker.demo.selectedValue') }}{{ singleValue || t('picker.demo.none') }}</text>
      </view>

      <text class="title">{{ t('picker.demo.multi') }}</text>
      <view class="content">
        <see-picker
          v-model="multiValue"
          :columns="multiColumns"
          :placeholder="t('picker.demo.placeholderDate')"
          :toolbar-title="t('picker.demo.toolbarDate')"
          @on-confirm="handleMultiConfirm"
        />
        <text class="result-text">{{ t('picker.demo.selectedValue') }}{{ JSON.stringify(multiValue) }}</text>
      </view>

      <text class="title">{{ t('picker.demo.cascade') }}</text>
      <view class="content">
        <see-picker
          v-model="cascadeValue"
          :columns="cascadeColumns"
          is-cascade
          :placeholder="t('picker.demo.placeholderRegion')"
          :toolbar-title="t('picker.demo.toolbarRegion')"
          @on-confirm="handleCascadeConfirm"
        />
        <text class="result-text">{{ t('picker.demo.selectedValue') }}{{ JSON.stringify(cascadeValue) }}</text>
      </view>

      <text class="title">{{ t('picker.demo.disabled') }}</text>
      <view class="content">
        <see-picker :model-value="'apple'" :columns="singleColumns" is-disabled :placeholder="t('picker.demo.placeholderDisabled')" />
      </view>

      <text class="title">{{ t('picker.demo.readonly') }}</text>
      <view class="content">
        <see-picker :model-value="'banana'" :columns="singleColumns" is-readonly :placeholder="t('picker.demo.placeholderReadonly')" />
      </view>

      <text class="title">{{ t('picker.demo.customBtnText') }}</text>
      <view class="content">
        <see-picker
          v-model="customValue"
          :columns="singleColumns"
          :placeholder="t('picker.demo.placeholderCustom')"
          :toolbar-title="t('picker.demo.toolbarSelect')"
          :confirm-text="t('picker.demo.confirm')"
          :cancel-text="t('picker.demo.cancel')"
        />
      </view>

      <text class="title">{{ t('picker.demo.sizes') }}</text>
      <view class="content">
        <see-picker v-model="sizeValue1" :columns="singleColumns" size="small" :placeholder="t('picker.demo.placeholderSmall')" />
        <see-picker v-model="sizeValue2" :columns="singleColumns" size="default" :placeholder="t('picker.demo.placeholderDefault')" />
        <see-picker v-model="sizeValue3" :columns="singleColumns" size="large" :placeholder="t('picker.demo.placeholderLarge')" />
      </view>

      <text class="title">{{ t('picker.demo.noBorder') }}</text>
      <view class="content">
        <see-picker v-model="borderValue" :columns="singleColumns" :is-border="false" :placeholder="t('picker.demo.placeholderNoBorder')" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t } = useI18n()
useNavbarI18n('navbar.seePicker')

/** 单列数据 */
const singleColumns = [
  { text: t('picker.data.apple'), value: 'apple' },
  { text: t('picker.data.banana'), value: 'banana' },
  { text: t('picker.data.orange'), value: 'orange' },
  { text: t('picker.data.grape'), value: 'grape' },
  { text: t('picker.data.watermelon'), value: 'watermelon' }
]

/** 多列数据 */
const multiColumns = [
  [
    { text: t('picker.data.year', { year: 2024 }), value: 2024 },
    { text: t('picker.data.year', { year: 2025 }), value: 2025 },
    { text: t('picker.data.year', { year: 2026 }), value: 2026 }
  ],
  [
    { text: t('picker.data.month', { month: 1 }), value: 1 },
    { text: t('picker.data.month', { month: 2 }), value: 2 },
    { text: t('picker.data.month', { month: 3 }), value: 3 },
    { text: t('picker.data.month', { month: 6 }), value: 6 },
    { text: t('picker.data.month', { month: 12 }), value: 12 }
  ]
]

/** 联动数据 */
const cascadeColumns = [
  {
    text: t('picker.data.zhejiang'),
    value: 'zhejiang',
    children: [
      {
        text: t('picker.data.hangzhou'),
        value: 'hangzhou',
        children: [
          { text: t('picker.data.xihu'), value: 'xihu' },
          { text: t('picker.data.yuhang'), value: 'yuhang' },
          { text: t('picker.data.binjiang'), value: 'binjiang' }
        ]
      },
      {
        text: t('picker.data.ningbo'),
        value: 'ningbo',
        children: [
          { text: t('picker.data.haishu'), value: 'haishu' },
          { text: t('picker.data.yinzhou'), value: 'yinzhou' }
        ]
      }
    ]
  },
  {
    text: t('picker.data.jiangsu'),
    value: 'jiangsu',
    children: [
      {
        text: t('picker.data.nanjing'),
        value: 'nanjing',
        children: [
          { text: t('picker.data.xuanwu'), value: 'xuanwu' },
          { text: t('picker.data.gulou'), value: 'gulou' }
        ]
      },
      {
        text: t('picker.data.suzhou'),
        value: 'suzhou',
        children: [
          { text: t('picker.data.gusu'), value: 'gusu' },
          { text: t('picker.data.wuzhong'), value: 'wuzhong' }
        ]
      }
    ]
  }
]

const singleValue = ref('')
const multiValue = ref<(string | number)[]>([])
const cascadeValue = ref<(string | number)[]>([])
const customValue = ref('')
const sizeValue1 = ref('')
const sizeValue2 = ref('')
const sizeValue3 = ref('')
const borderValue = ref('')

const handleSingleConfirm = (value: string | number | (string | number)[]) => {
  console.log('单列确认：', value)
}

const handleMultiConfirm = (value: string | number | (string | number)[]) => {
  console.log('多列确认：', value)
}

const handleCascadeConfirm = (value: string | number | (string | number)[]) => {
  console.log('联动确认：', value)
}
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

.result-text {
  font-size: 14px;
  color: #999;
  padding: 8px 12px;
  border-radius: 6px;
}
</style>
