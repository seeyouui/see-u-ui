<template>
  <see-config>
    <view class="container">
      <text class="title">{{ t('cascader.demo.basic') }}</text>
      <view class="content">
        <see-cascader
          v-model="basicValue"
          :options="areaData"
          :placeholder="t('cascader.demo.placeholderRegion')"
          :toolbar-title="t('cascader.demo.toolbarRegion')"
          @on-confirm="handleBasicConfirm"
        />
        <text class="result-text">{{ t('cascader.demo.selectedValue') }}{{ JSON.stringify(basicValue) }}</text>
      </view>

      <text class="title">{{ t('cascader.demo.tabNav') }}</text>
      <view class="content">
        <see-cascader
          v-model="tabValue"
          :options="areaData"
          is-show-tab
          :placeholder="t('cascader.demo.placeholderTab')"
          :toolbar-title="t('cascader.demo.toolbarRegion')"
        />
      </view>

      <text class="title">{{ t('cascader.demo.lazy') }}</text>
      <view class="content">
        <see-cascader
          v-model="lazyValue"
          :options="lazyData"
          is-lazy
          :lazy-load="lazyLoadChildren"
          :placeholder="t('cascader.demo.placeholderLazy')"
          :toolbar-title="t('cascader.demo.toolbarLazy')"
          @on-confirm="handleLazyConfirm"
        />
        <text class="result-text">{{ t('cascader.demo.selectedValue') }}{{ JSON.stringify(lazyValue) }}</text>
      </view>

      <text class="title">{{ t('cascader.demo.disabled') }}</text>
      <view class="content">
        <see-cascader
          :model-value="['zhejiang', 'hangzhou', 'xihu']"
          :options="areaData"
          is-disabled
          :placeholder="t('cascader.demo.placeholderDisabled')"
        />
      </view>

      <text class="title">{{ t('cascader.demo.readonly') }}</text>
      <view class="content">
        <see-cascader
          :model-value="['zhejiang', 'hangzhou', 'xihu']"
          :options="areaData"
          is-readonly
          :placeholder="t('cascader.demo.placeholderReadonly')"
        />
      </view>

      <text class="title">{{ t('cascader.demo.customBtnText') }}</text>
      <view class="content">
        <see-cascader
          v-model="customValue"
          :options="areaData"
          :placeholder="t('cascader.demo.placeholderCustom')"
          :toolbar-title="t('cascader.demo.toolbarAddress')"
          :confirm-text="t('cascader.demo.confirm')"
          :cancel-text="t('cascader.demo.cancel')"
        />
      </view>

      <text class="title">{{ t('cascader.demo.sizes') }}</text>
      <view class="content">
        <see-cascader v-model="sizeValue1" :options="areaData" size="small" :placeholder="t('cascader.demo.placeholderSmall')" />
        <see-cascader v-model="sizeValue2" :options="areaData" size="default" :placeholder="t('cascader.demo.placeholderDefault')" />
        <see-cascader v-model="sizeValue3" :options="areaData" size="large" :placeholder="t('cascader.demo.placeholderLarge')" />
      </view>

      <text class="title">{{ t('cascader.demo.noBorder') }}</text>
      <view class="content">
        <see-cascader v-model="borderValue" :options="areaData" :is-border="false" :placeholder="t('cascader.demo.placeholderNoBorder')" />
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'
import type { CascaderOption } from '../../uni_modules/see-u-ui/components/see-cascader/type'

const { t } = useI18n()
useNavbarI18n('navbar.seeCascader')

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
