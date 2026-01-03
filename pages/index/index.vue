<template>
  <see-config>
    <view class="content">
      <view class="content-detail">
        <view class="logo">
          <image src="/static/logo.png" alt="see-u-ui Logo" mode="heightFix"></image>
        </view>
        <view class="detail-text">
          <view class="title">SeeYouUI 1.0.13</view>
          <view class="subtitle">一个基于 uni-app 的组件库</view>
        </view>
      </view>
      <view class="content-detail">
        <text class="subtitle">
          SeeYouUI 是一个基于 uni-app 的高质量组件库，使用 TypeScript 开发，提供丰富组件与工具函数，帮助你快速构建跨平台应用。
        </text>
      </view>
      <view v-for="(item, index) in list" :key="index" class="list">
        <view class="list-title">
          <text>{{ item.title }}</text>
        </view>
        <view
          v-for="(val, key) in item.componentsList"
          :key="key"
          class="list-item"
          :style="key === 0 && 'border-top: 1px var(--see-border-four-color) solid'"
          @tap="clickItem(val.url)"
        >
          <text>{{ val.title }}</text>
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

type listType = Array<{
  title: string
  componentsList: Array<{
    title: string
    url: string
  }>
}>

const list = ref<listType>([
  {
    title: '基础组件',
    componentsList: [
      { title: 'Color 色彩', url: '/pages/seeColor/index' },
      { title: 'Button 按钮', url: '/pages/seeButton/index' },
      { title: 'Text 文本', url: '/pages/seeText/index' },
      { title: 'Link 链接', url: '/pages/seeLink/index' },
      { title: 'Icon 图标', url: '/pages/seeIcon/index' },
      { title: 'Image 图片', url: '/pages/seeImage/index' },
      { title: 'Badge 徽标数', url: '/pages/seeBadge/index' },
      { title: 'Tag 标签', url: '/pages/todo/index' }
    ]
  },
  {
    title: '表单组件',
    componentsList: [
      { title: 'Form 表单', url: '/pages/todo/index' },
      { title: 'Input 输入框', url: '/pages/todo/index' },
      { title: 'Keyboard 键盘', url: '/pages/todo/index' },
      { title: 'Select 经典下拉框', url: '/pages/todo/index' },
      { title: 'Picker 选择器', url: '/pages/todo/index' },
      { title: 'Cascader 级联选择器', url: '/pages/todo/index' },
      { title: 'DatetimePicker 选择器', url: '/pages/todo/index' },
      { title: 'Rate 评分', url: '/pages/todo/index' },
      { title: 'Search 搜索', url: '/pages/todo/index' },
      { title: 'NumberBox 步进器', url: '/pages/todo/index' },
      { title: 'Upload 上传', url: '/pages/todo/index' },
      { title: 'Code 验证码输入框', url: '/pages/todo/index' },
      { title: 'Textarea 文本域', url: '/pages/todo/index' },
      { title: 'Checkbox 复选框', url: '/pages/todo/index' },
      { title: 'Radio 单选框', url: '/pages/todo/index' },
      { title: 'Switch 开关选择器', url: '/pages/todo/index' },
      { title: 'Slider 滑动选择器', url: '/pages/todo/index' }
    ]
  },
  {
    title: '布局组件',
    componentsList: [
      { title: 'Layout 布局', url: '/pages/todo/index' },
      { title: 'Cell 单元格', url: '/pages/todo/index' },
      { title: 'LoadingIcon 加载动画', url: '/pages/todo/index' },
      { title: 'LoadingPage 加载页', url: '/pages/todo/index' },
      { title: 'ScrollList 横向滚动列表', url: '/pages/todo/index' },
      { title: 'Line 线条', url: '/pages/todo/index' },
      { title: 'Card 卡片', url: '/pages/todo/index' },
      { title: 'Overlay 遮罩层', url: '/pages/todo/index' },
      { title: 'NoNetwork 无网络提示', url: '/pages/todo/index' },
      { title: 'Grid 宫格布局', url: '/pages/todo/index' },
      { title: 'Swiper 轮播图', url: '/pages/todo/index' },
      { title: 'Skeleton 骨架屏', url: '/pages/todo/index' },
      { title: 'Sticky 吸顶', url: '/pages/todo/index' },
      { title: 'Waterfall 瀑布流', url: '/pages/todo/index' },
      { title: 'Box 盒子', url: '/pages/todo/index' }
    ]
  },
  {
    title: '数据组件',
    componentsList: [
      { title: 'List 列表', url: '/pages/todo/index' },
      { title: 'VirtualList 虚拟列表', url: '/pages/todo/index' },
      { title: 'LineProgress 线形进度条', url: '/pages/todo/index' },
      { title: 'Table 表格', url: '/pages/todo/index' },
      { title: 'CountDown 倒计时', url: '/pages/todo/index' },
      { title: 'CountTo 数字滚动', url: '/pages/todo/index' }
    ]
  },
  {
    title: '反馈组件',
    componentsList: [
      { title: 'Tooltip 长按提示', url: '/pages/todo/index' },
      { title: 'Popover 弹窗提示', url: '/pages/todo/index' },
      { title: 'ActionSheet 操作菜单', url: '/pages/todo/index' },
      { title: 'Alert 警告提示', url: '/pages/todo/index' },
      { title: 'Toast 消息提示', url: '/pages/todo/index' },
      { title: 'NoticeBar 滚动通知', url: '/pages/todo/index' },
      { title: 'Notify 消息提示', url: '/pages/todo/index' },
      { title: 'SwipeAction 滑动单元格', url: '/pages/todo/index' },
      { title: 'Collapse 折叠面板', url: '/pages/todo/index' },
      { title: 'Popup 弹出层', url: '/pages/todo/index' },
      { title: 'Modal 模态框', url: '/pages/todo/index' },
      { title: 'Copy 复制', url: '/pages/todo/index' }
    ]
  },
  {
    title: '导航组件',
    componentsList: [
      { title: 'Dropdown 下拉菜单', url: '/pages/todo/index' },
      { title: 'Tabbar 底部导航栏', url: '/pages/todo/index' },
      { title: 'BackTop 返回顶部', url: '/pages/todo/index' },
      { title: 'Navbar 自定义导航栏', url: '/pages/todo/index' },
      { title: 'NavbarMini 迷你导航栏', url: '/pages/todo/index' },
      { title: 'Tabs 标签', url: '/pages/todo/index' },
      { title: 'Subsection 分段器', url: '/pages/todo/index' },
      { title: 'IndexList 索引列表', url: '/pages/todo/index' },
      { title: 'Steps 步骤条', url: '/pages/todo/index' },
      { title: 'Empty 内容为空', url: '/pages/todo/index' },
      { title: 'Pagination 分页器', url: '/pages/todo/index' },
      { title: 'Tree 树形组件', url: '/pages/todo/index' },
      { title: 'CityLocate 城市定位选择', url: '/pages/todo/index' }
    ]
  },
  {
    title: '内容解析',
    componentsList: [
      { title: 'Parse 富文本解析器', url: '/pages/todo/index' },
      { title: 'Markdown 文本解析', url: '/pages/todo/index' }
    ]
  }
])

const clickItem = (url: string) => uni.navigateTo({ url })
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--see-bg-color);
}

.content-detail {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 24px;
  padding-top: 0;
  box-sizing: border-box;
}

.detail-text {
  margin-left: 24px;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.logo {
  height: 88px;
  margin-top: 12px;
  margin-bottom: 12px;
  image {
    width: 100%;
    height: 100%;
  }
}

.subtitle {
  font-size: 14px;
  color: #999;
}

.list {
  width: 100%;
  box-sizing: border-box;
}

.list-title {
  font-size: 15px;
  color: var(--see-info-dark);
  padding: 12px 24px;
}

.list-item {
  width: 100%;
  padding: 12px 24px;
  box-sizing: border-box;
  border-bottom: 1px var(--see-border-four-color) solid;
}
</style>
