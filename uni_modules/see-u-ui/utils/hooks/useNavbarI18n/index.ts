/**
 * useNavbarI18n — 导航栏标题国际化
 *
 * @description 监听语言切换，自动更新当前页面的 navigationBarTitleText。
 *              一行代码搞定 navigationBar 国际化。
 *
 * @param key - 翻译 key，如 'navbar.button'
 *
 * @example
 * ```ts
 * import { useNavbarI18n } from '@/uni_modules/see-u-ui'
 * useNavbarI18n('navbar.button')
 * ```
 */
import { watch, onMounted } from 'vue'
import { useI18n } from '../../../locale'

export function useNavbarI18n(key: string) {
  const { t, locale } = useI18n()

  const update = () => {
    uni.setNavigationBarTitle({ title: t(key) })
  }

  onMounted(update)
  watch(locale, update)
}
