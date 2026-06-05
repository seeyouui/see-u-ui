/**
 * SeeYouUI 表单体系 - Provide/Inject Keys
 * @description 使用 Symbol 作为注入键，避免命名冲突
 */
import type { InjectionKey } from 'vue'
import type { FormContext, FormItemContext } from './form-types'
import type { RadioGroupContext } from '../../components/see-radio/type'

/** Form 父组件注入键 */
export const formKey: InjectionKey<FormContext> = Symbol('SeeForm')

/** FormItem 父组件注入键（用于嵌套场景） */
export const formItemKey: InjectionKey<FormItemContext> = Symbol('SeeFormItem')

/** RadioGroup 注入键 */
export const radioGroupKey: InjectionKey<RadioGroupContext> = Symbol('SeeRadioGroup')
