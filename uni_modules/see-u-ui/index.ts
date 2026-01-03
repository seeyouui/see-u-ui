import type { App, DefineComponent } from 'vue'

import { SeeButton } from './components/see-button/index'
import { SeeText } from './components/see-text/index'
import { SeeLink } from './components/see-link/index'

import { formatCurrency, useCurrencyFormat } from './utils/hooks/useCurrencyFormat'
import { formatDate, useDateFormat } from './utils/hooks/useDateFormat'
import { formatTimeAgo, useTimeAgo } from './utils/hooks/useTimeAgo'
import { useTheme } from './utils/hooks/useTheme'

const components: DefineComponent[] = [SeeButton, SeeText, SeeLink] as unknown as DefineComponent[]
const install = (app: App) => {
  components.forEach((component) => {
    if (component.name) {
      app.component(component.name, component)
    } else {
      console.warn('SeeYouUI: 组件缺少 name 属性，无法自动注册', component)
    }
  })
}

export { formatCurrency, useCurrencyFormat, formatTimeAgo, useDateFormat, formatDate, useTimeAgo, useTheme }
export { SeeButton, SeeText, SeeLink }
export default {
  install
}
