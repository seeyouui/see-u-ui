import type { App, Component } from 'vue'

// 国际化
import { createI18n, useI18n, t as i18nT } from './locale'
import type { CreateI18nOptions, I18nInstance, I18nUseReturn, LocaleMessages } from './locale/type'

// 原有组件
import { SeeButton } from './components/see-button/index'
import { SeeText } from './components/see-text/index'
import { SeeLink } from './components/see-link/index'
import { SeeTag } from './components/see-tag/index'
import { SeeBadge } from './components/see-badge/index'
import { SeeIcon } from './components/see-icon/index'
import { SeeImage } from './components/see-image/index'
import { SeeConfig } from './components/see-config/index'

// 表单体系组件
import { SeeForm } from './components/see-form/index'
import { SeeFormItem } from './components/see-form-item/index'
import { SeeInput } from './components/see-input/index'
import { SeeTextarea } from './components/see-textarea/index'
import { SeeCheckbox, SeeCheckboxGroup } from './components/see-checkbox/index'
import { SeeRadio, SeeRadioGroup } from './components/see-radio/index'
import { SeeSwitch } from './components/see-switch/index'
import { SeeRate } from './components/see-rate/index'
import { SeeSlider } from './components/see-slider/index'
import { SeeNumberBox } from './components/see-number-box/index'
import { SeeSearch } from './components/see-search/index'
import { SeeSelect } from './components/see-select/index'
import { SeePicker } from './components/see-picker/index'
import { SeeCascader } from './components/see-cascader/index'
import { SeeDatetimePicker } from './components/see-datetime-picker/index'
import { SeeCalendar } from './components/see-calendar/index'
import { SeeUpload } from './components/see-upload/index'
import { SeeCode } from './components/see-code/index'
import { SeeKeyboard } from './components/see-keyboard/index'

// 布局组件
import { SeeBox } from './components/see-box/index'
import { SeeLine } from './components/see-line/index'
import { SeeOverlay } from './components/see-overlay/index'
import { SeeNoNetwork } from './components/see-no-network/index'
import { SeeLayout, SeeLayoutItem } from './components/see-layout/index'
import { SeeCell } from './components/see-cell/index'
import { SeeCard } from './components/see-card/index'
import { SeeGrid, SeeGridItem } from './components/see-grid/index'
import { SeeSticky } from './components/see-sticky/index'
import { SeeLoadingIcon } from './components/see-loading-icon/index'
import { SeeLoadingPage } from './components/see-loading-page/index'
import { SeeSkeleton } from './components/see-skeleton/index'
import { SeeSkeletonGlobal } from './components/see-skeleton-global/index'
import { SeeSwiper } from './components/see-swiper/index'
import { SeeScrollList } from './components/see-scroll-list/index'
import { SeeWaterfall } from './components/see-waterfall/index'

// 数据组件
import { SeeLineProgress } from './components/see-line-progress/index'
import { SeeCountDown } from './components/see-count-down/index'
import { SeeCountTo } from './components/see-count-to/index'
import { SeeList } from './components/see-list/index'
import { SeeVirtualList } from './components/see-virtual-list/index'
import { SeeTable } from './components/see-table/index'

// 反馈组件
import { SeePopup } from './components/see-popup/index'
import { SeeToast, toast } from './components/see-toast/index'
import { SeeNotify, notify } from './components/see-notify/index'
import { SeeModal, modal } from './components/see-modal/index'
import { SeeActionSheet } from './components/see-action-sheet/index'
import { SeeTooltip } from './components/see-tooltip/index'
import { SeePopover } from './components/see-popover/index'
import { SeeAlert } from './components/see-alert/index'
import { SeeNoticeBar } from './components/see-notice-bar/index'
import { SeeCollapse, SeeCollapseItem } from './components/see-collapse/index'
import { SeeSwipeAction } from './components/see-swipe-action/index'
import { SeeCopy, copy as seeCopy } from './components/see-copy/index'
import { SeeParse } from './components/see-parse/index'
import { SeeMarkdown } from './components/see-markdown/index'

// 业务组件
import { SeeWatermark } from './components/see-watermark/index'
import { SeeCoupon } from './components/see-coupon/index'
import { SeeScratchCard } from './components/see-scratch-card/index'

// 工具 Hooks
import { formatCurrency, useCurrencyFormat } from './utils/hooks/useCurrencyFormat'
import { formatDate, useDateFormat } from './utils/hooks/useDateFormat'
import { formatTimeAgo, useTimeAgo } from './utils/hooks/useTimeAgo'
import { useTheme } from './utils/hooks/useTheme'
import { useForm } from './utils/hooks/useForm'
import { useField } from './utils/hooks/useField'
import { formatCountdown, parseCountdownTime, useCountdown } from './utils/hooks/useCountdown'
import { easeOutExpo, formatCountToValue, useCountTo } from './utils/hooks/useCountTo'
import { useVirtualWindow } from './utils/hooks/useVirtualWindow'
import { useThemeColor, applyThemeColorOnLaunch, DEFAULT_COLORS, PRIMARY_PRESETS } from './utils/hooks/useThemeColor'
import { useSkeletonGlobal } from './utils/hooks/useSkeletonGlobal'
import { isValidHex } from './utils/colorDerive'

// 反馈组件公共 Hooks
import { useZIndex } from './utils/hooks/useZIndex'
import { useLockScroll, resetLockScroll } from './utils/hooks/useLockScroll'
import { useTransition } from './utils/hooks/useTransition'
import { useOverlay } from './utils/hooks/useOverlay'
import { usePopup } from './utils/hooks/usePopup'
import { useTeleport } from './utils/hooks/useTeleport'
import { useGesture } from './utils/hooks/useGesture'
import { usePopoverPosition } from './utils/hooks/usePopoverPosition'
import { useNavbarI18n } from './utils/hooks/useNavbarI18n'
import { useCopy } from './utils/hooks/useCopy'

const components: Component[] = [
  // 原有组件
  SeeButton,
  SeeText,
  SeeLink,
  SeeTag,
  SeeBadge,
  SeeIcon,
  SeeImage,
  SeeConfig,
  // 表单体系
  SeeForm,
  SeeFormItem,
  SeeInput,
  SeeTextarea,
  SeeCheckbox,
  SeeCheckboxGroup,
  SeeRadio,
  SeeRadioGroup,
  SeeSwitch,
  SeeRate,
  SeeSlider,
  SeeNumberBox,
  SeeSearch,
  SeeSelect,
  SeePicker,
  SeeCascader,
  SeeDatetimePicker,
  SeeCalendar,
  SeeUpload,
  SeeCode,
  SeeKeyboard,
  // 布局组件
  SeeBox,
  SeeLine,
  SeeOverlay,
  SeeNoNetwork,
  SeeLayout,
  SeeLayoutItem,
  SeeCell,
  SeeCard,
  SeeGrid,
  SeeGridItem,
  SeeSticky,
  SeeLoadingIcon,
  SeeLoadingPage,
  SeeSkeleton,
  SeeSkeletonGlobal,
  SeeSwiper,
  SeeScrollList,
  SeeWaterfall,
  // 数据组件
  SeeLineProgress,
  SeeCountDown,
  SeeCountTo,
  SeeList,
  SeeVirtualList,
  SeeTable,
  // 反馈组件
  SeePopup,
  SeeToast,
  SeeNotify,
  SeeModal,
  SeeActionSheet,
  SeeTooltip,
  SeePopover,
  SeeAlert,
  SeeNoticeBar,
  SeeCollapse,
  SeeCollapseItem,
  SeeSwipeAction,
  SeeCopy,
  // 内容解析
  SeeParse,
  SeeMarkdown,
  // 业务组件
  SeeWatermark,
  SeeCoupon,
  SeeScratchCard
]

export interface SeeYouUIOptions {
  i18n?: I18nInstance
}

const install = (app: App, options?: SeeYouUIOptions) => {
  components.forEach((component) => {
    const name = (component as { name?: string }).name
    if (name) {
      app.component(name, component)
    } else {
      console.warn('SeeYouUI: 组件缺少 name 属性，无法自动注册', component)
    }
  })

  // 安装 i18n 实例（如果用户传入了自定义 i18n）
  if (options?.i18n) {
    options.i18n.install(app)
  }
}

export {
  // 国际化
  createI18n,
  useI18n,
  i18nT as t,
  // 工具 Hooks
  formatCurrency,
  useCurrencyFormat,
  formatTimeAgo,
  useDateFormat,
  formatDate,
  useTimeAgo,
  useTheme,
  useForm,
  useField,
  useCountdown,
  parseCountdownTime,
  formatCountdown,
  useCountTo,
  easeOutExpo,
  formatCountToValue,
  useVirtualWindow,
  useThemeColor,
  applyThemeColorOnLaunch,
  DEFAULT_COLORS,
  PRIMARY_PRESETS,
  useSkeletonGlobal,
  isValidHex,
  // 反馈组件公共 Hooks
  useZIndex,
  useLockScroll,
  resetLockScroll,
  useTransition,
  useOverlay,
  usePopup,
  useTeleport,
  useGesture,
  usePopoverPosition,
  useNavbarI18n,
  useCopy,
  // 原有组件
  SeeButton,
  SeeText,
  SeeLink,
  SeeTag,
  SeeBadge,
  SeeIcon,
  SeeImage,
  SeeConfig,
  // 表单体系
  SeeForm,
  SeeFormItem,
  SeeInput,
  SeeTextarea,
  SeeCheckbox,
  SeeCheckboxGroup,
  SeeRadio,
  SeeRadioGroup,
  SeeSwitch,
  SeeRate,
  SeeSlider,
  SeeNumberBox,
  SeeSearch,
  SeeSelect,
  SeePicker,
  SeeCascader,
  SeeDatetimePicker,
  SeeCalendar,
  SeeUpload,
  SeeCode,
  SeeKeyboard,
  // 布局组件
  SeeBox,
  SeeLine,
  SeeOverlay,
  SeeNoNetwork,
  SeeLayout,
  SeeLayoutItem,
  SeeCell,
  SeeCard,
  SeeGrid,
  SeeGridItem,
  SeeSticky,
  SeeLoadingIcon,
  SeeLoadingPage,
  SeeSkeleton,
  SeeSkeletonGlobal,
  SeeSwiper,
  SeeScrollList,
  SeeWaterfall,
  // 数据组件
  SeeLineProgress,
  SeeCountDown,
  SeeCountTo,
  SeeList,
  SeeVirtualList,
  SeeTable,
  // 反馈组件
  SeePopup,
  SeeToast,
  toast,
  SeeNotify,
  notify,
  SeeModal,
  modal,
  SeeActionSheet,
  SeeTooltip,
  SeePopover,
  SeeAlert,
  SeeNoticeBar,
  SeeCollapse,
  SeeCollapseItem,
  SeeSwipeAction,
  SeeCopy,
  seeCopy,
  // 内容解析
  SeeParse,
  SeeMarkdown,
  // 业务组件
  SeeWatermark,
  SeeCoupon,
  SeeScratchCard
}

export default {
  install
}

// 类型导出
export type { CreateI18nOptions, I18nInstance, I18nUseReturn, LocaleMessages }
export type { SeeButtonProps, SeeButtonEmits, ButtonType, ButtonSize } from './components/see-button/type'
export type { FormRule, FormInstance, FormItemInstance, ValidateResult, ValidateError } from './utils/shared/form-types'
export type { CascaderOption } from './components/see-cascader/type'
export type { SelectOption } from './components/see-select/type'
export type { PickerOption, PickerColumn } from './components/see-picker/type'
export type { UploadFileItem } from './components/see-upload/type'
export type { SeeLineProgressProps, SeeLineProgressStatus } from './components/see-line-progress/type'
export type { SeeCountDownProps, SeeCountDownTimeData } from './components/see-count-down/type'
export type { SeeCountToProps } from './components/see-count-to/type'
export type { SeeListProps, SeeListItemScope, SeeListGroupScope } from './components/see-list/type'
export type {
  SeeVirtualListProps,
  SeeVirtualListItemScope,
  SeeVirtualListRangeChange,
  SeeVirtualListScrollEvent
} from './components/see-virtual-list/type'
export type {
  SeeTableColumn,
  SeeTablePagination,
  SeeTableProps,
  SeeTableCellScope,
  SeeTableHeaderScope,
  SeeTableSortChange,
  SeeTableRangeChange,
  SeeTablePageChange
} from './components/see-table/type'
export type { CountdownTimeData, UseCountdownOptions } from './utils/hooks/useCountdown'
export type { CountToFormatOptions, UseCountToOptions } from './utils/hooks/useCountTo'
export type { VirtualWindowRange, UseVirtualWindowOptions } from './utils/hooks/useVirtualWindow'
export type { UseTransitionOptions, TransitionState } from './utils/hooks/useTransition'
export type { UseOverlayOptions } from './utils/hooks/useOverlay'
export type { UsePopupOptions } from './utils/hooks/usePopup'
export type { UseTeleportOptions } from './utils/hooks/useTeleport'
export type { UseGestureOptions, SwipeDirection, GestureDirection } from './utils/hooks/useGesture'
export type { UsePopoverPositionOptions, PopoverPosition, Rect } from './utils/hooks/usePopoverPosition'
export type { UseCopyOptions } from './utils/hooks/useCopy'
export type { UseSkeletonGlobalReturn } from './utils/hooks/useSkeletonGlobal'
export type { SeeSkeletonGlobalProps } from './components/see-skeleton-global/type'
export type { SeePopupProps, SeePopupEmits, PopupPosition } from './components/see-popup/type'
export type { SeeToastProps, SeeToastEmits, ToastOptions, ToastType, ToastPosition } from './components/see-toast/type'
export type { SeeNotifyProps, SeeNotifyEmits, NotifyOptions, NotifyType } from './components/see-notify/type'
export type { SeeModalProps, SeeModalEmits, ModalOptions, ModalConfirmType } from './components/see-modal/type'
export type { SeeActionSheetProps, SeeActionSheetEmits, ActionSheetAction } from './components/see-action-sheet/type'
export type { SeeTooltipProps, SeeTooltipEmits, TooltipPosition, TooltipTrigger, TooltipEffect } from './components/see-tooltip/type'
export type { SeePopoverProps, SeePopoverEmits, PopoverPosition as SeePopoverPosition, PopoverTrigger } from './components/see-popover/type'
export type { SeeAlertProps, SeeAlertEmits, AlertType, AlertEffect } from './components/see-alert/type'
export type { SeeNoticeBarProps, SeeNoticeBarEmits, NoticeBarType } from './components/see-notice-bar/type'
export type { SeeCollapseProps, SeeCollapseEmits, SeeCollapseItemProps, SeeCollapseItemEmits } from './components/see-collapse/type'
export type { SeeSwipeActionProps, SeeSwipeActionEmits, SwipeActionItem, SwipeActionStyle } from './components/see-swipe-action/type'
export type { SeeCopyProps, SeeCopyEmits, CopyOptions } from './components/see-copy/type'
export type {
  SeeParseProps,
  SeeParseEmits,
  SeeParseNode,
  SeeParseNodeAttrs,
  SeeParseTextNode,
  SeeParseElementNode,
  UseHtmlParserOptions
} from './components/see-parse/type'
export type { SeeMarkdownProps, SeeMarkdownEmits, MarkdownParserOptions } from './components/see-markdown/type'
export type { SeeWatermarkProps, SeeWatermarkEmits } from './components/see-watermark/type'
export type { SeeCouponProps, SeeCouponEmits, CouponStatus, CouponType } from './components/see-coupon/type'
export type { SeeScratchCardProps, SeeScratchCardEmits } from './components/see-scratch-card/type'
export type { ThemeColorState, ThemeColorToken, ThemeColorPreset, UseThemeColorReturn } from './utils/hooks/useThemeColor'
export type { ColorPalette, ThemeMode } from './utils/colorDerive'
