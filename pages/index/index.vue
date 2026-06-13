<template>
  <see-config>
    <view class="content">
      <view class="content-detail">
        <view class="logo">
          <image src="/static/logo.png" alt="see-u-ui Logo" mode="heightFix"></image>
        </view>
        <view class="detail-text">
          <view class="title">SeeYouUI 1.3.1</view>
          <view class="subtitle">{{ t('home.subtitle') }}</view>
        </view>
      </view>
      <view class="content-detail">
        <text class="subtitle">
          {{ t('home.description') }}
        </text>
      </view>
      <view v-for="(item, index) in list" :key="index" class="list">
        <view class="list-title">
          <text>{{ t(item.titleKey) }}</text>
        </view>
        <view
          v-for="(val, key) in item.componentsList"
          :key="key"
          class="list-item"
          :style="key === 0 && 'border-top: 1px var(--see-border-four-color) solid'"
          @tap="clickItem(val.url)"
        >
          <text class="list-item-text">{{ locale === 'zh-CN' ? val.en + ' ' + val.zh : val.en }}</text>
        </view>
      </view>
    </view>
  </see-config>
</template>

<script lang="ts" setup>
import { useI18n, useNavbarI18n } from '@/uni_modules/see-u-ui'

const { t, locale } = useI18n()
useNavbarI18n('navbar.index')

const list = [
  {
    titleKey: 'home.section.basic',
    componentsList: [
      { en: 'Color', zh: '色彩', url: '/pages/seeColor/index' },
      { en: 'Button', zh: '按钮', url: '/pages/seeButton/index' },
      { en: 'Text', zh: '文本', url: '/pages/seeText/index' },
      { en: 'Link', zh: '链接', url: '/pages/seeLink/index' },
      { en: 'Icon', zh: '图标', url: '/pages/seeIcon/index' },
      { en: 'Image', zh: '图片', url: '/pages/seeImage/index' },
      { en: 'Badge', zh: '徽标数', url: '/pages/seeBadge/index' },
      { en: 'Tag', zh: '标签', url: '/pages/seeTag/index' }
    ]
  },
  {
    titleKey: 'home.section.form',
    componentsList: [
      { en: 'Form', zh: '表单', url: '/pages/seeForm/index' },
      { en: 'Input', zh: '输入框', url: '/pages/seeInput/index' },
      { en: 'Textarea', zh: '文本域', url: '/pages/seeTextarea/index' },
      { en: 'Checkbox', zh: '复选框', url: '/pages/seeCheckbox/index' },
      { en: 'Radio', zh: '单选框', url: '/pages/seeRadio/index' },
      { en: 'Switch', zh: '开关选择器', url: '/pages/seeSwitch/index' },
      { en: 'Rate', zh: '评分', url: '/pages/seeRate/index' },
      { en: 'Slider', zh: '滑动选择器', url: '/pages/seeSlider/index' },
      { en: 'NumberBox', zh: '步进器', url: '/pages/seeNumberBox/index' },
      { en: 'Search', zh: '搜索', url: '/pages/seeSearch/index' },
      { en: 'Select', zh: '经典下拉框', url: '/pages/seeSelect/index' },
      { en: 'Picker', zh: '选择器', url: '/pages/seePicker/index' },
      { en: 'Cascader', zh: '级联选择器', url: '/pages/seeCascader/index' },
      { en: 'DatetimePicker', zh: '日期选择器', url: '/pages/seeDatetimePicker/index' },
      { en: 'Calendar', zh: '日历', url: '/pages/seeCalendar/index' },
      { en: 'Upload', zh: '上传', url: '/pages/seeUpload/index' },
      { en: 'Code', zh: '验证码输入框', url: '/pages/seeCode/index' },
      { en: 'Keyboard', zh: '键盘', url: '/pages/seeKeyboard/index' }
    ]
  },
  {
    titleKey: 'home.section.layout',
    componentsList: [
      { en: 'Layout', zh: '布局', url: '/pages/seeLayout/index' },
      { en: 'Cell', zh: '单元格', url: '/pages/seeCell/index' },
      { en: 'LoadingIcon', zh: '加载动画', url: '/pages/seeLoadingIcon/index' },
      { en: 'LoadingPage', zh: '加载页', url: '/pages/seeLoadingPage/index' },
      { en: 'ScrollList', zh: '横向滚动列表', url: '/pages/seeScrollList/index' },
      { en: 'Line', zh: '线条', url: '/pages/seeLine/index' },
      { en: 'Card', zh: '卡片', url: '/pages/seeCard/index' },
      { en: 'Overlay', zh: '遮罩层', url: '/pages/seeOverlay/index' },
      { en: 'NoNetwork', zh: '无网络提示', url: '/pages/seeNoNetwork/index' },
      { en: 'Grid', zh: '宫格布局', url: '/pages/seeGrid/index' },
      { en: 'Swiper', zh: '轮播图', url: '/pages/seeSwiper/index' },
      { en: 'Skeleton', zh: '骨架屏', url: '/pages/seeSkeleton/index' },
      { en: 'Sticky', zh: '吸顶', url: '/pages/seeSticky/index' },
      { en: 'Waterfall', zh: '瀑布流', url: '/pages/seeWaterfall/index' },
      { en: 'Box', zh: '盒子', url: '/pages/seeBox/index' }
    ]
  },
  {
    titleKey: 'home.section.data',
    componentsList: [
      { en: 'List', zh: '列表', url: '/pages/seeList/index' },
      { en: 'VirtualList', zh: '虚拟列表', url: '/pages/seeVirtualList/index' },
      { en: 'LineProgress', zh: '线形进度条', url: '/pages/seeLineProgress/index' },
      { en: 'Table', zh: '表格', url: '/pages/seeTable/index' },
      { en: 'CountDown', zh: '倒计时', url: '/pages/seeCountDown/index' },
      { en: 'CountTo', zh: '数字滚动', url: '/pages/seeCountTo/index' }
    ]
  },
  {
    titleKey: 'home.section.feedback',
    componentsList: [
      { en: 'Popup', zh: '弹出层', url: '/pages/seePopup/index' },
      { en: 'Toast', zh: '消息提示', url: '/pages/seeToast/index' },
      { en: 'Notify', zh: '顶部通知', url: '/pages/seeNotify/index' },
      { en: 'Modal', zh: '模态框', url: '/pages/seeModal/index' },
      { en: 'ActionSheet', zh: '操作菜单', url: '/pages/seeActionSheet/index' },
      { en: 'Tooltip', zh: '长按提示', url: '/pages/seeTooltip/index' },
      { en: 'Popover', zh: '气泡提示', url: '/pages/seePopover/index' },
      { en: 'Alert', zh: '警告提示', url: '/pages/seeAlert/index' },
      { en: 'NoticeBar', zh: '滚动通知', url: '/pages/seeNoticeBar/index' },
      { en: 'Collapse', zh: '折叠面板', url: '/pages/seeCollapse/index' },
      { en: 'SwipeAction', zh: '滑动单元格', url: '/pages/seeSwipeAction/index' },
      { en: 'Copy', zh: '复制功能', url: '/pages/seeCopy/index' }
    ]
  },
  {
    titleKey: 'home.section.navigation',
    componentsList: [
      { en: 'Navbar', zh: '自定义导航栏', url: '/pages/seeNavbar/index' },
      { en: 'NavbarMini', zh: '迷你导航栏', url: '/pages/seeNavbarMini/index' },
      { en: 'Tabbar', zh: '底部导航栏', url: '/pages/seeTabbar/index' },
      { en: 'BackTop', zh: '返回顶部', url: '/pages/seeBackTop/index' },
      { en: 'Tabs', zh: '标签页', url: '/pages/seeTabs/index' },
      { en: 'Subsection', zh: '分段器', url: '/pages/seeSubsection/index' },
      { en: 'Dropdown', zh: '下拉菜单', url: '/pages/seeDropdown/index' },
      { en: 'Pagination', zh: '分页器', url: '/pages/seePagination/index' },
      { en: 'Steps', zh: '步骤条', url: '/pages/seeSteps/index' },
      { en: 'IndexList', zh: '索引列表', url: '/pages/seeIndexList/index' },
      { en: 'Tree', zh: '树形组件', url: '/pages/seeTree/index' },
      { en: 'CityLocate', zh: '城市定位选择', url: '/pages/seeCityLocate/index' },
      { en: 'Empty', zh: '空状态', url: '/pages/seeEmpty/index' }
    ]
  },
  {
    titleKey: 'home.section.content',
    componentsList: [
      { en: 'Parse', zh: '富文本解析器', url: '/pages/seeParse/index' },
      { en: 'Markdown', zh: '文本解析', url: '/pages/seeMarkdown/index' }
    ]
  },
  {
    titleKey: 'home.section.business',
    componentsList: [
      { en: 'Watermark', zh: '水印', url: '/pages/seeWatermark/index' },
      { en: 'Coupon', zh: '优惠券', url: '/pages/seeCoupon/index' },
      { en: 'ScratchCard', zh: '刮刮卡', url: '/pages/seeScratchCard/index' }
    ]
  }
]

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
  color: var(--see-main-color);
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
  color: var(--see-tips-color);
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

.list-item-text {
  color: var(--see-main-color);
}
</style>
