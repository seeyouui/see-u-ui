<template>
  <see-config>
    <view class="container">
      <text class="title">基础单选</text>
      <view class="content">
        <see-select v-model="singleValue" :options="basicOptions" placeholder="请选择城市" />
        <text class="info">选中值：{{ singleValue || '无' }}</text>
      </view>

      <text class="title">多选模式</text>
      <view class="content">
        <see-select v-model="multiValue" :options="basicOptions" is-multiple placeholder="请选择多个城市" />
        <text class="info">选中值：{{ JSON.stringify(multiValue) }}</text>
      </view>

      <text class="title">多选 - 限制标签数</text>
      <view class="content">
        <see-select v-model="multiMaxValue" :options="basicOptions" is-multiple :max-tag-count="2" placeholder="最多显示2个标签" />
      </view>

      <text class="title">搜索过滤</text>
      <view class="content">
        <see-select v-model="filterValue" :options="basicOptions" is-filterable placeholder="可输入搜索" />
      </view>

      <text class="title">禁用状态</text>
      <view class="content">
        <see-select :model-value="'beijing'" :options="basicOptions" is-disabled placeholder="禁用状态" />
      </view>

      <text class="title">只读状态</text>
      <view class="content">
        <see-select :model-value="'shanghai'" :options="basicOptions" is-readonly placeholder="只读状态" />
      </view>

      <text class="title">可清除</text>
      <view class="content">
        <see-select v-model="clearableValue" :options="basicOptions" is-clearable placeholder="可清除" />
      </view>

      <text class="title">禁用选项</text>
      <view class="content">
        <see-select v-model="disabledOptValue" :options="disabledOptions" placeholder="部分选项禁用" />
      </view>

      <text class="title">不同尺寸</text>
      <view class="content">
        <see-select v-model="sizeValue1" :options="basicOptions" size="small" placeholder="小尺寸" />
        <see-select v-model="sizeValue2" :options="basicOptions" size="default" placeholder="默认尺寸" />
        <see-select v-model="sizeValue3" :options="basicOptions" size="large" placeholder="大尺寸" />
      </view>

      <text class="title">分组选项</text>
      <view class="content">
        <see-select v-model="groupValue" :options="groupOptions" placeholder="分组选择" />
      </view>

      <text class="title">无边框</text>
      <view class="content">
        <see-select v-model="borderValue" :options="basicOptions" :is-border="false" placeholder="无边框样式" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const basicOptions = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州', value: 'hangzhou' },
  { label: '成都', value: 'chengdu' }
]

const disabledOptions = [
  { label: '选项一', value: 1 },
  { label: '选项二（禁用）', value: 2, isDisabled: true },
  { label: '选项三', value: 3 },
  { label: '选项四（禁用）', value: 4, isDisabled: true },
  { label: '选项五', value: 5 }
]

const groupOptions = [
  {
    label: '华东地区',
    value: 'east',
    children: [
      { label: '上海', value: 'shanghai' },
      { label: '杭州', value: 'hangzhou' },
      { label: '南京', value: 'nanjing' }
    ]
  },
  {
    label: '华南地区',
    value: 'south',
    children: [
      { label: '广州', value: 'guangzhou' },
      { label: '深圳', value: 'shenzhen' }
    ]
  },
  {
    label: '西南地区',
    value: 'southwest',
    children: [
      { label: '成都', value: 'chengdu' },
      { label: '重庆', value: 'chongqing' }
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
