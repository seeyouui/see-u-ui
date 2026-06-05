/**
 * SeeForm 组件导出
 * @description 表单组件统一导出
 */
import SeeForm from './see-form.vue'
import SeeFormItem from '../see-form-item/see-form-item.vue'

export { SeeForm, SeeFormItem }

export default SeeForm

// 导出类型
export type {
  FormRule,
  ValidateStatus,
  ValidateError,
  ValidateResult,
  FormItemInstance,
  FormInstance,
  FormContext,
  FormItemContext,
  SeeFormProps,
  SeeFormItemProps,
  LabelPosition,
  FormSize
} from './type'
