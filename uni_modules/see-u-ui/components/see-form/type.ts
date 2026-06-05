/**
 * SeeForm / SeeFormItem 组件类型定义
 * @description 表单组件的类型声明，复用共享类型体系
 */

// 重新导出共享类型，方便外部统一引用
export type {
  FormRule,
  ValidateStatus,
  ValidateError,
  ValidateResult,
  FormItemInstance,
  FormInstance,
  FormContext,
  FormItemContext
} from '../../utils/shared/form-types'

/** 表单标签位置 */
export type LabelPosition = 'left' | 'right' | 'top'

/** 表单尺寸 */
export type FormSize = 'small' | 'default' | 'large'

/** SeeForm Props */
export interface SeeFormProps {
  /** 表单数据对象（必填） */
  model: Record<string, unknown>
  /** 校验规则 */
  rules?: Record<string, import('../../utils/shared/form-types').FormRule | import('../../utils/shared/form-types').FormRule[]>
  /** 标签位置 */
  labelPosition?: LabelPosition
  /** 标签宽度 */
  labelWidth?: string | number
  /** 是否禁用整组 */
  isDisabled?: boolean
  /** 是否只读整组 */
  isReadonly?: boolean
  /** 是否显示必填星号 */
  isRequiredAsterisk?: boolean
  /** 是否显示校验错误信息 */
  isShowMessage?: boolean
  /** 是否行内模式 */
  isInline?: boolean
  /** 尺寸 */
  size?: FormSize
}

/** SeeFormItem Props */
export interface SeeFormItemProps {
  /** 标签文本 */
  label?: string
  /** 字段名（用于校验和重置） */
  field?: string
  /** 标签宽度（覆盖 Form 级别） */
  labelWidth?: string | number
  /** 标签位置（覆盖 Form 级别） */
  labelPosition?: LabelPosition
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 该字段的校验规则（覆盖 Form 级别） */
  rules?: import('../../utils/shared/form-types').FormRule | import('../../utils/shared/form-types').FormRule[]
  /** 是否显示错误信息 */
  isShowMessage?: boolean
  /** 是否必填（覆盖自动检测） */
  isRequired?: boolean
}
