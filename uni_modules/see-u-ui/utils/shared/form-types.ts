/**
 * SeeYouUI 表单体系 - 共享类型定义
 * @description 所有表单组件共享的类型定义
 */

/** 表单校验规则 */
export interface FormRule {
  /** 是否必填 */
  required?: boolean
  /** 必填时的提示信息（默认自动生成） */
  message?: string
  /** 校验触发方式 */
  trigger?: 'blur' | 'change' | ('blur' | 'change')[]
  /** 最小值/最小长度 */
  min?: number
  /** 最大值/最大长度 */
  max?: number
  /** 精确长度 */
  len?: number
  /** 正则校验 */
  pattern?: RegExp
  /** 枚举校验 */
  enum?: unknown[]
  /** 自定义校验函数（同步） */
  validator?: (value: unknown, rule: FormRule) => boolean | string
  /** 自定义校验函数（异步） */
  asyncValidator?: (value: unknown, rule: FormRule) => Promise<boolean | string>
  /** 类型校验 */
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date' | 'url' | 'email'
  /** 白名单（仅在白名单中的值才校验） */
  whitespace?: boolean
}

/** 校验状态 */
export type ValidateStatus = '' | 'success' | 'error' | 'validating'

/** 校验错误信息 */
export interface ValidateError {
  /** 字段名 */
  field: string
  /** 错误信息 */
  message: string
  /** 触发的规则 */
  rule?: FormRule
}

/** 校验结果 */
export interface ValidateResult {
  /** 是否通过 */
  valid: boolean
  /** 错误信息列表 */
  errors: ValidateError[]
  /** 所有字段的错误信息（按字段名分组） */
  errorFields?: Record<string, ValidateError[]>
}

/** FormItem 实例暴露的方法和属性 */
export interface FormItemInstance {
  /** 字段名 */
  field: string
  /** 当前校验状态 */
  validateStatus: ValidateStatus
  /** 当前错误信息 */
  validateMessage: string
  /** 校验该字段 */
  validate: (trigger?: string) => Promise<ValidateResult>
  /** 重置该字段 */
  resetField: () => void
  /** 清除该字段校验状态 */
  clearValidate: () => void
}

/** Form 实例暴露的方法 */
export interface FormInstance {
  /** 校验整个表单 */
  validate: () => Promise<ValidateResult>
  /** 校验指定字段 */
  validateField: (fields: string | string[]) => Promise<ValidateResult>
  /** 重置表单 */
  resetFields: (fields?: string | string[]) => void
  /** 清除校验状态 */
  clearValidate: (fields?: string | string[]) => void
  /** 滚动到指定字段 */
  scrollToField: (field: string) => void
  /** 获取表单数据 */
  getFieldsValue: () => Record<string, unknown>
  /** 设置表单数据 */
  setFieldsValue: (values: Record<string, unknown>) => void
}

/** Form provide 的上下文类型 */
export interface FormContext {
  /** 表单数据模型 */
  model: Record<string, unknown>
  /** 校验规则 */
  rules: Record<string, FormRule | FormRule[]>
  /** 表单 props */
  props: {
    labelPosition?: 'left' | 'right' | 'top'
    labelWidth?: string | number
    isDisabled?: boolean
    isReadonly?: boolean
    isRequiredAsterisk?: boolean
    isShowMessage?: boolean
    isInline?: boolean
    size?: 'small' | 'default' | 'large'
  }
  /** 添加字段 */
  addField: (field: FormItemInstance) => void
  /** 移除字段 */
  removeField: (field: FormItemInstance) => void
  /** 获取字段的校验规则 */
  getRules: (field: string) => FormRule[]
}

/** FormItem provide 的上下文类型 */
export interface FormItemContext {
  /** 字段名 */
  field: string
  /** 校验状态 */
  validateStatus: ValidateStatus
  /** 错误信息 */
  validateMessage: string
}
