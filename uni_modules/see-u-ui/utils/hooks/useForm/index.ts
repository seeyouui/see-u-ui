/**
 * useForm - 表单管理 Hook
 * @description 提供表单级别的数据管理、校验、重置等功能
 * @tutorial https://www.seeuui.cn/components/form/
 */
import { ref, provide, reactive, toRaw } from 'vue'
import type { FormRule, FormItemInstance, FormContext, ValidateResult } from '../../shared/form-types'
import { formKey } from '../../shared/form-keys'
import { validateForm } from '../../shared/validate'

export interface UseFormOptions {
  /** 表单数据模型 */
  model: Record<string, unknown>
  /** 校验规则 */
  rules?: Record<string, FormRule | FormRule[]>
  /** 标签位置 */
  labelPosition?: 'left' | 'right' | 'top'
  /** 标签宽度 */
  labelWidth?: string | number
  /** 是否禁用 */
  isDisabled?: boolean
  /** 是否只读 */
  isReadonly?: boolean
  /** 是否显示必填星号 */
  isRequiredAsterisk?: boolean
  /** 是否显示校验错误信息 */
  isShowMessage?: boolean
  /** 是否行内模式 */
  isInline?: boolean
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
}

export function useForm(options: UseFormOptions) {
  /** 子字段实例列表 */
  const fields = ref<FormItemInstance[]>([])

  /** 保存原始数据（用于 reset） */
  const initialValues = JSON.parse(JSON.stringify(toRaw(options.model)))

  /** 添加字段 */
  const addField = (field: FormItemInstance) => {
    if (field.field && !fields.value.find((f) => f.field === field.field)) {
      fields.value.push(field)
    }
  }

  /** 移除字段 */
  const removeField = (field: FormItemInstance) => {
    const index = fields.value.findIndex((f) => f.field === field.field)
    if (index > -1) {
      fields.value.splice(index, 1)
    }
  }

  /** 获取字段的校验规则 */
  const getRules = (field: string): FormRule[] => {
    const rules = options.rules?.[field]
    if (!rules) return []
    return Array.isArray(rules) ? rules : [rules]
  }

  /** 创建 FormContext 并 provide */
  const formContext: FormContext = reactive({
    model: options.model,
    rules: options.rules || {},
    props: {
      labelPosition: options.labelPosition,
      labelWidth: options.labelWidth,
      isDisabled: options.isDisabled,
      isReadonly: options.isReadonly,
      isRequiredAsterisk: options.isRequiredAsterisk,
      isShowMessage: options.isShowMessage,
      isInline: options.isInline,
      size: options.size
    },
    addField,
    removeField,
    getRules
  })

  provide(formKey, formContext)

  /** 校验整个表单 */
  const validate = async (): Promise<ValidateResult> => {
    const result = await validateForm(options.model, options.rules || {})
    // 更新每个字段的校验状态
    fields.value.forEach((field) => {
      const fieldErrors = result.errors.filter((e) => e.field === field.field)
      if (fieldErrors.length > 0) {
        field.validateStatus = 'error'
        field.validateMessage = fieldErrors[0].message
      } else {
        field.validateStatus = 'success'
        field.validateMessage = ''
      }
    })
    return result
  }

  /** 校验指定字段 */
  const validateField = async (targetFields: string | string[]): Promise<ValidateResult> => {
    const fieldList = Array.isArray(targetFields) ? targetFields : [targetFields]
    const result = await validateForm(options.model, options.rules || {}, fieldList)
    // 更新目标字段的校验状态
    fields.value.forEach((field) => {
      if (fieldList.includes(field.field)) {
        const fieldErrors = result.errors.filter((e) => e.field === field.field)
        if (fieldErrors.length > 0) {
          field.validateStatus = 'error'
          field.validateMessage = fieldErrors[0].message
        } else {
          field.validateStatus = 'success'
          field.validateMessage = ''
        }
      }
    })
    return result
  }

  /** 重置表单 */
  const resetFields = (targetFields?: string | string[]) => {
    const fieldList = targetFields ? (Array.isArray(targetFields) ? targetFields : [targetFields]) : Object.keys(initialValues)

    fieldList.forEach((field) => {
      if (field in initialValues) {
        options.model[field] = JSON.parse(JSON.stringify(initialValues[field]))
      }
    })

    // 清除校验状态
    clearValidate(targetFields)
  }

  /** 清除校验状态 */
  const clearValidate = (targetFields?: string | string[]) => {
    const fieldList = targetFields ? (Array.isArray(targetFields) ? targetFields : [targetFields]) : undefined

    fields.value.forEach((field) => {
      if (!fieldList || fieldList.includes(field.field)) {
        field.validateStatus = ''
        field.validateMessage = ''
      }
    })
  }

  /** 滚动到指定字段 */
  const scrollToField = (field: string) => {
    // #ifdef H5
    const el = document.querySelector(`[data-field="${field}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    // #endif

    // #ifndef H5
    // 小程序/App 端使用 uni.createSelectorQuery
    // 注意：需要在组件中设置 data-field 属性
    // #endif
  }

  /** 获取表单数据 */
  const getFieldsValue = (): Record<string, unknown> => {
    return JSON.parse(JSON.stringify(toRaw(options.model)))
  }

  /** 设置表单数据 */
  const setFieldsValue = (values: Record<string, unknown>) => {
    Object.keys(values).forEach((key) => {
      if (key in options.model) {
        options.model[key] = values[key]
      }
    })
  }

  return {
    validate,
    validateField,
    resetFields,
    clearValidate,
    scrollToField,
    getFieldsValue,
    setFieldsValue,
    fields,
    formContext
  }
}
