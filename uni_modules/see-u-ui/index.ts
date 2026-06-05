import type { App, DefineComponent } from 'vue'

// 原有组件
import { SeeButton } from './components/see-button/index'
import { SeeText } from './components/see-text/index'
import { SeeLink } from './components/see-link/index'
import { SeeTag } from './components/see-tag/index'

// 表单体系组件
import { SeeForm, SeeFormItem } from './components/see-form/index'
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
import { SeeUpload } from './components/see-upload/index'
import { SeeCode } from './components/see-code/index'
import { SeeKeyboard } from './components/see-keyboard/index'

// 工具 Hooks
import { formatCurrency, useCurrencyFormat } from './utils/hooks/useCurrencyFormat'
import { formatDate, useDateFormat } from './utils/hooks/useDateFormat'
import { formatTimeAgo, useTimeAgo } from './utils/hooks/useTimeAgo'
import { useTheme } from './utils/hooks/useTheme'
import { useForm } from './utils/hooks/useForm'
import { useField } from './utils/hooks/useField'

const components: DefineComponent[] = [
  // 原有组件
  SeeButton,
  SeeText,
  SeeLink,
  SeeTag,
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
  SeeUpload,
  SeeCode,
  SeeKeyboard
] as unknown as DefineComponent[]

const install = (app: App) => {
  components.forEach((component) => {
    if (component.name) {
      app.component(component.name, component)
    } else {
      console.warn('SeeYouUI: 组件缺少 name 属性，无法自动注册', component)
    }
  })
}

export {
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
  // 原有组件
  SeeButton,
  SeeText,
  SeeLink,
  SeeTag,
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
  SeeUpload,
  SeeCode,
  SeeKeyboard
}

export default {
  install
}
