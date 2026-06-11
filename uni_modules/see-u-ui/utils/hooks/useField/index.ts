/**
 * useField - 表单字段管理 Hook
 * @description 为表单组件提供字段级别的校验、状态管理能力
 */
import { ref, inject, onMounted, onBeforeUnmount, computed } from 'vue'
import type { FormRule, ValidateStatus, FormItemInstance, ValidateResult } from '../../shared/form-types'
import { formKey } from '../../shared/form-keys'
import { validateField as runValidate } from '../../shared/validate'

export interface UseFieldOptions {
  /** 字段名 */
  field: string
  /** 字段值的响应式引用（getter） */
  getValue: () => unknown
  /** 字段值变化时的校验规则触发 */
  trigger?: 'blur' | 'change'
  /** 自定义校验规则（覆盖 Form 级别的规则） */
  rules?: FormRule | FormRule[]
  /** 字段值变化回调（用于触发 change 校验） */
  onValueChange?: (value: unknown) => void
}

export function useField(options: UseFieldOptions) {
  const { field, getValue, trigger = 'change' } = options

  /** 注入 Form 上下文 */
  const form = inject(formKey, null)

  /** 空字段名时跳过注册，返回空壳 */
  if (!field) {
    return {
      validateStatus: ref<ValidateStatus>(''),
      validateMessage: ref(''),
      isValidating: ref(false),
      isDisabled: computed(() => form?.props.isDisabled ?? false),
      isReadonly: computed(() => form?.props.isReadonly ?? false),
      isShowMessage: computed(() => form?.props.isShowMessage ?? true),
      validate: async () => ({ valid: true, errors: [] }) as ValidateResult,
      resetField: () => {},
      clearValidate: () => {},
      handleChange: () => {},
      handleBlur: () => {}
    }
  }

  /** 校验状态 */
  const validateStatus = ref<ValidateStatus>('')

  /** 错误信息 */
  const validateMessage = ref('')

  /** 是否正在校验 */
  const isValidating = ref(false)

  /** 校验代次 token（防止竞态条件） */
  let validateGeneration = 0

  /** 是否禁用 */
  const isDisabled = computed(() => form?.props.isDisabled ?? false)

  /** 是否只读 */
  const isReadonly = computed(() => form?.props.isReadonly ?? false)

  /** 是否显示错误信息 */
  const isShowMessage = computed(() => form?.props.isShowMessage ?? true)

  /** 获取校验规则 */
  const getRules = (): FormRule[] => {
    // 优先使用组件自定义规则
    if (options.rules) {
      return Array.isArray(options.rules) ? options.rules : [options.rules]
    }
    // 否则从 Form 获取
    return form?.getRules(field) || []
  }

  /** 校验当前字段 */
  const validate = async (validateTrigger?: string): Promise<ValidateResult> => {
    const rules = getRules()
    if (rules.length === 0) {
      validateStatus.value = ''
      validateMessage.value = ''
      return { valid: true, errors: [] }
    }

    // 如果指定了触发方式，只校验匹配触发方式的规则
    const filteredRules = validateTrigger
      ? rules.filter((rule) => {
          if (!rule.trigger) return true
          const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]
          return triggers.includes(validateTrigger as 'blur' | 'change')
        })
      : rules

    if (filteredRules.length === 0) {
      return { valid: true, errors: [] }
    }

    // 使用 generation token 防止竞态条件
    const gen = ++validateGeneration

    isValidating.value = true
    validateStatus.value = 'validating'

    try {
      const result = await runValidate(getValue(), filteredRules, field)

      // 检查是否仍为当前代次，防止竞态条件
      if (gen !== validateGeneration) {
        return { valid: true, errors: [] }
      }

      if (result.valid) {
        validateStatus.value = 'success'
        validateMessage.value = ''
      } else {
        validateStatus.value = 'error'
        validateMessage.value = result.errors[0]?.message || ''
      }

      return result
    } finally {
      isValidating.value = false
    }
  }

  /** 重置字段 */
  const resetField = () => {
    validateStatus.value = ''
    validateMessage.value = ''
  }

  /** 清除校验状态 */
  const clearValidate = () => {
    validateStatus.value = ''
    validateMessage.value = ''
  }

  /** 处理 change 事件 */
  const handleChange = (value: unknown) => {
    options.onValueChange?.(value)
    if (trigger === 'change') {
      validate('change')
    }
  }

  /** 处理 blur 事件 */
  const handleBlur = () => {
    if (trigger === 'blur') {
      validate('blur')
    }
  }

  /** 创建字段实例 */
  const fieldInstance: FormItemInstance = {
    get field() {
      return field
    },
    get validateStatus() {
      return validateStatus.value
    },
    set validateStatus(val: ValidateStatus) {
      validateStatus.value = val
    },
    get validateMessage() {
      return validateMessage.value
    },
    set validateMessage(val: string) {
      validateMessage.value = val
    },
    validate,
    resetField,
    clearValidate
  }

  /** 注册到 Form */
  onMounted(() => {
    form?.addField(fieldInstance)
  })

  /** 从 Form 注销 */
  onBeforeUnmount(() => {
    form?.removeField(fieldInstance)
  })

  return {
    validateStatus,
    validateMessage,
    isValidating,
    isDisabled,
    isReadonly,
    isShowMessage,
    validate,
    resetField,
    clearValidate,
    handleChange,
    handleBlur
  }
}
