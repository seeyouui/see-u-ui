<template>
  <see-config>
    <view class="container">
      <text class="title">基础用法 - 省市区</text>
      <view class="content">
        <see-cascader v-model="basicValue" :options="areaData" placeholder="请选择地区" toolbar-title="选择地区" @on-confirm="handleBasicConfirm" />
        <text class="result-text">选中值：{{ JSON.stringify(basicValue) }}</text>
      </view>

      <text class="title">显示标签页导航</text>
      <view class="content">
        <see-cascader v-model="tabValue" :options="areaData" is-show-tab placeholder="带标签页导航" toolbar-title="选择地区" />
      </view>

      <text class="title">懒加载</text>
      <view class="content">
        <see-cascader
          v-model="lazyValue"
          :options="lazyData"
          is-lazy
          :lazy-load="lazyLoadChildren"
          placeholder="懒加载子级"
          toolbar-title="懒加载选择"
          @on-confirm="handleLazyConfirm"
        />
        <text class="result-text">选中值：{{ JSON.stringify(lazyValue) }}</text>
      </view>

      <text class="title">禁用状态</text>
      <view class="content">
        <see-cascader :model-value="['zhejiang', 'hangzhou', 'xihu']" :options="areaData" is-disabled placeholder="禁用状态" />
      </view>

      <text class="title">只读状态</text>
      <view class="content">
        <see-cascader :model-value="['zhejiang', 'hangzhou', 'xihu']" :options="areaData" is-readonly placeholder="只读状态" />
      </view>

      <text class="title">自定义按钮文字</text>
      <view class="content">
        <see-cascader
          v-model="customValue"
          :options="areaData"
          placeholder="自定义按钮"
          toolbar-title="请选择地址"
          confirm-text="确定"
          cancel-text="返回"
        />
      </view>

      <text class="title">不同尺寸</text>
      <view class="content">
        <see-cascader v-model="sizeValue1" :options="areaData" size="small" placeholder="小尺寸" />
        <see-cascader v-model="sizeValue2" :options="areaData" size="default" placeholder="默认尺寸" />
        <see-cascader v-model="sizeValue3" :options="areaData" size="large" placeholder="大尺寸" />
      </view>

      <text class="title">无边框</text>
      <view class="content">
        <see-cascader v-model="borderValue" :options="areaData" :is-border="false" placeholder="无边框样式" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { CascaderOption } from '../../uni_modules/see-u-ui/components/see-cascader/type'

/** 省市区数据 */
const areaData: CascaderOption[] = [
  {
    value: 'zhejiang',
    text: '浙江省',
    children: [
      {
        value: 'hangzhou',
        text: '杭州市',
        children: [
          { value: 'xihu', text: '西湖区' },
          { value: 'yuhang', text: '余杭区' },
          { value: 'binjiang', text: '滨江区' },
          { value: 'xiaoshan', text: '萧山区' }
        ]
      },
      {
        value: 'ningbo',
        text: '宁波市',
        children: [
          { value: 'haishu', text: '海曙区' },
          { value: 'yinzhou', text: '鄞州区' },
          { value: 'jiangbei', text: '江北区' }
        ]
      },
      {
        value: 'wenzhou',
        text: '温州市',
        children: [
          { value: 'lucheng', text: '鹿城区' },
          { value: 'ouhai', text: '瓯海区' }
        ]
      }
    ]
  },
  {
    value: 'jiangsu',
    text: '江苏省',
    children: [
      {
        value: 'nanjing',
        text: '南京市',
        children: [
          { value: 'xuanwu', text: '玄武区' },
          { value: 'gulou', text: '鼓楼区' },
          { value: 'jianye', text: '建邺区' }
        ]
      },
      {
        value: 'suzhou',
        text: '苏州市',
        children: [
          { value: 'gusu', text: '姑苏区' },
          { value: 'wuzhong', text: '吴中区' },
          { value: 'huqiu', text: '虎丘区' }
        ]
      }
    ]
  },
  {
    value: 'guangdong',
    text: '广东省',
    children: [
      {
        value: 'guangzhou',
        text: '广州市',
        children: [
          { value: 'tianhe', text: '天河区' },
          { value: 'yuexiu', text: '越秀区' },
          { value: 'haizhu', text: '海珠区' }
        ]
      },
      {
        value: 'shenzhen',
        text: '深圳市',
        children: [
          { value: 'futian', text: '福田区' },
          { value: 'nanshan', text: '南山区' },
          { value: 'luohu', text: '罗湖区' }
        ]
      }
    ]
  }
]

/** 懒加载数据（只有根节点） */
const lazyData: CascaderOption[] = [
  { value: 'node1', text: '节点一', isLeaf: false },
  { value: 'node2', text: '节点二', isLeaf: false },
  { value: 'node3', text: '节点三（无子级）', isLeaf: true }
]

/** 懒加载函数 */
const lazyLoadChildren = (node: CascaderOption): Promise<CascaderOption[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const parentVal = node.value
      resolve([
        { value: `${parentVal}-child1`, text: `${node.text} - 子项1`, isLeaf: false },
        { value: `${parentVal}-child2`, text: `${node.text} - 子项2`, isLeaf: false },
        { value: `${parentVal}-leaf`, text: `${node.text} - 叶子节点`, isLeaf: true }
      ])
    }, 800)
  })
}

const basicValue = ref<(string | number)[]>([])
const tabValue = ref<(string | number)[]>([])
const lazyValue = ref<(string | number)[]>([])
const customValue = ref<(string | number)[]>([])
const sizeValue1 = ref<(string | number)[]>([])
const sizeValue2 = ref<(string | number)[]>([])
const sizeValue3 = ref<(string | number)[]>([])
const borderValue = ref<(string | number)[]>([])

const handleBasicConfirm = (value: (string | number)[]) => {
  console.log('基础确认：', value)
}

const handleLazyConfirm = (value: (string | number)[]) => {
  console.log('懒加载确认：', value)
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
