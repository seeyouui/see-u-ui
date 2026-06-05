<template>
  <see-config>
    <view class="container">
      <text class="title">单列选择</text>
      <view class="content">
        <see-picker
          v-model="singleValue"
          :columns="singleColumns"
          placeholder="请选择水果"
          toolbar-title="选择水果"
          @on-confirm="handleSingleConfirm"
        />
        <text class="result-text">选中值：{{ singleValue || '无' }}</text>
      </view>

      <text class="title">多列选择</text>
      <view class="content">
        <see-picker v-model="multiValue" :columns="multiColumns" placeholder="请选择日期" toolbar-title="选择日期" @on-confirm="handleMultiConfirm" />
        <text class="result-text">选中值：{{ JSON.stringify(multiValue) }}</text>
      </view>

      <text class="title">联动选择</text>
      <view class="content">
        <see-picker
          v-model="cascadeValue"
          :columns="cascadeColumns"
          is-cascade
          placeholder="请选择地区"
          toolbar-title="选择地区"
          @on-confirm="handleCascadeConfirm"
        />
        <text class="result-text">选中值：{{ JSON.stringify(cascadeValue) }}</text>
      </view>

      <text class="title">禁用状态</text>
      <view class="content">
        <see-picker :model-value="'apple'" :columns="singleColumns" is-disabled placeholder="禁用状态" />
      </view>

      <text class="title">只读状态</text>
      <view class="content">
        <see-picker :model-value="'banana'" :columns="singleColumns" is-readonly placeholder="只读状态" />
      </view>

      <text class="title">自定义按钮文字</text>
      <view class="content">
        <see-picker
          v-model="customValue"
          :columns="singleColumns"
          placeholder="自定义按钮"
          toolbar-title="请选择"
          confirm-text="确定"
          cancel-text="返回"
        />
      </view>

      <text class="title">不同尺寸</text>
      <view class="content">
        <see-picker v-model="sizeValue1" :columns="singleColumns" size="small" placeholder="小尺寸" />
        <see-picker v-model="sizeValue2" :columns="singleColumns" size="default" placeholder="默认尺寸" />
        <see-picker v-model="sizeValue3" :columns="singleColumns" size="large" placeholder="大尺寸" />
      </view>

      <text class="title">无边框</text>
      <view class="content">
        <see-picker v-model="borderValue" :columns="singleColumns" :is-border="false" placeholder="无边框样式" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

/** 单列数据 */
const singleColumns = [
  { text: '苹果', value: 'apple' },
  { text: '香蕉', value: 'banana' },
  { text: '橙子', value: 'orange' },
  { text: '葡萄', value: 'grape' },
  { text: '西瓜', value: 'watermelon' }
]

/** 多列数据 */
const multiColumns = [
  [
    { text: '2024年', value: 2024 },
    { text: '2025年', value: 2025 },
    { text: '2026年', value: 2026 }
  ],
  [
    { text: '1月', value: 1 },
    { text: '2月', value: 2 },
    { text: '3月', value: 3 },
    { text: '6月', value: 6 },
    { text: '12月', value: 12 }
  ]
]

/** 联动数据 */
const cascadeColumns = [
  {
    text: '浙江省',
    value: 'zhejiang',
    children: [
      {
        text: '杭州市',
        value: 'hangzhou',
        children: [
          { text: '西湖区', value: 'xihu' },
          { text: '余杭区', value: 'yuhang' },
          { text: '滨江区', value: 'binjiang' }
        ]
      },
      {
        text: '宁波市',
        value: 'ningbo',
        children: [
          { text: '海曙区', value: 'haishu' },
          { text: '鄞州区', value: 'yinzhou' }
        ]
      }
    ]
  },
  {
    text: '江苏省',
    value: 'jiangsu',
    children: [
      {
        text: '南京市',
        value: 'nanjing',
        children: [
          { text: '玄武区', value: 'xuanwu' },
          { text: '鼓楼区', value: 'gulou' }
        ]
      },
      {
        text: '苏州市',
        value: 'suzhou',
        children: [
          { text: '姑苏区', value: 'gusu' },
          { text: '吴中区', value: 'wuzhong' }
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
    margin-top: 24px;
    margin-bottom: 12px;
    display: block;
  }

  .content {
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .result-text {
    font-size: 14px;
    color: #666;
    padding: 8px 12px;
    background-color: #f5f5f5;
    border-radius: 6px;
  }
}
</style>
