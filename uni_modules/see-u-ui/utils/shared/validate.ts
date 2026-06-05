/**
 * SeeYouUI 表单体系 - 验证引擎
 * @description 轻量级表单验证工具，支持同步/异步校验、内置规则、自定义校验器
 */
import type { FormRule, ValidateError, ValidateResult } from './form-types'

/**
 * 获取值的类型
 */
function getType(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

/**
 * 判断值是否为空
 */
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * 内置类型校验器
 */
const typeValidators: Record<string, (value: unknown) => boolean> = {
  string: (v) => typeof v === 'string',
  number: (v) => typeof v === 'number' && !isNaN(v),
  boolean: (v) => typeof v === 'boolean',
  array: (v) => Array.isArray(v),
  object: (v) => getType(v) === 'object',
  date: (v) => v instanceof Date || !isNaN(Date.parse(v as string)),
  url: (v) => {
    if (typeof v !== 'string') return false
    try {
      new URL(v)
      return true
    } catch {
      return false
    }
  },
  email: (v) => {
    if (typeof v !== 'string') return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  }
}

/**
 * 校验单条规则
 * @param value 要校验的值
 * @param rule 校验规则
 * @param field 字段名
 * @returns 错误信息，校验通过返回 null
 */
async function validateRule(value: unknown, rule: FormRule, field: string): Promise<string | null> {
  // 必填校验
  if (rule.required) {
    if (isEmpty(value)) {
      return rule.message || `${field} 是必填项`
    }
  }

  // 如果值为空且不是必填，跳过后续校验
  if (isEmpty(value) && !rule.required) {
    return null
  }

  // 类型校验
  if (rule.type && typeValidators[rule.type]) {
    if (!typeValidators[rule.type](value)) {
      return rule.message || `${field} 类型必须是 ${rule.type}`
    }
  }

  // 枚举校验
  if (rule.enum && rule.enum.length > 0) {
    if (!rule.enum.includes(value)) {
      return rule.message || `${field} 必须是 ${rule.enum.join(', ')} 中的一个`
    }
  }

  // 最小值/最小长度
  if (rule.min !== undefined) {
    if (typeof value === 'number' && value < rule.min) {
      return rule.message || `${field} 不能小于 ${rule.min}`
    }
    if (typeof value === 'string' && value.length < rule.min) {
      return rule.message || `${field} 长度不能少于 ${rule.min} 个字符`
    }
    if (Array.isArray(value) && value.length < rule.min) {
      return rule.message || `${field} 选项不能少于 ${rule.min} 个`
    }
  }

  // 最大值/最大长度
  if (rule.max !== undefined) {
    if (typeof value === 'number' && value > rule.max) {
      return rule.message || `${field} 不能大于 ${rule.max}`
    }
    if (typeof value === 'string' && value.length > rule.max) {
      return rule.message || `${field} 长度不能超过 ${rule.max} 个字符`
    }
    if (Array.isArray(value) && value.length > rule.max) {
      return rule.message || `${field} 选项不能超过 ${rule.max} 个`
    }
  }

  // 精确长度
  if (rule.len !== undefined) {
    if (typeof value === 'string' && value.length !== rule.len) {
      return rule.message || `${field} 长度必须是 ${rule.len} 个字符`
    }
    if (Array.isArray(value) && value.length !== rule.len) {
      return rule.message || `${field} 选项必须是 ${rule.len} 个`
    }
    if (typeof value === 'number' && value !== rule.len) {
      return rule.message || `${field} 必须等于 ${rule.len}`
    }
  }

  // 正则校验
  if (rule.pattern) {
    if (!rule.pattern.test(String(value))) {
      return rule.message || `${field} 格式不正确`
    }
  }

  // 空白校验
  if (rule.whitespace === false && typeof value === 'string') {
    if (value.trim() === '') {
      return rule.message || `${field} 不能为空`
    }
  }

  // 自定义同步校验器
  if (rule.validator) {
    const result = rule.validator(value, rule)
    if (result === false) {
      return rule.message || `${field} 校验失败`
    }
    if (typeof result === 'string') {
      return result
    }
  }

  // 自定义异步校验器
  if (rule.asyncValidator) {
    try {
      const result = await rule.asyncValidator(value, rule)
      if (result === false) {
        return rule.message || `${field} 校验失败`
      }
      if (typeof result === 'string') {
        return result
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      return rule.message || message || `${field} 异步校验失败`
    }
  }

  return null
}

/**
 * 校验单个字段
 * @param value 字段值
 * @param rules 该字段的校验规则数组
 * @param field 字段名
 * @returns 校验结果
 */
export async function validateField(value: unknown, rules: FormRule[], field: string): Promise<ValidateResult> {
  const errors: ValidateError[] = []

  for (const rule of rules) {
    const message = await validateRule(value, rule, field)
    if (message) {
      errors.push({ field, message, rule })
      // 如果是必填校验失败，不再继续后续规则
      if (rule.required && isEmpty(value)) {
        break
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * 校验多个字段
 * @param model 表单数据对象
 * @param rules 校验规则（按字段名索引）
 * @param fields 要校验的字段名数组，不传则校验所有字段
 * @returns 校验结果
 */
export async function validateForm(
  model: Record<string, unknown>,
  rules: Record<string, FormRule | FormRule[]>,
  fields?: string | string[]
): Promise<ValidateResult> {
  const targetFields = fields ? (Array.isArray(fields) ? fields : [fields]) : Object.keys(rules)

  const allErrors: ValidateError[] = []
  const errorFields: Record<string, ValidateError[]> = {}

  // 并行校验所有字段
  const promises = targetFields.map(async (field) => {
    const fieldRules = rules[field]
    if (!fieldRules) return

    const ruleArray = Array.isArray(fieldRules) ? fieldRules : [fieldRules]
    const result = await validateField(model[field], ruleArray, field)

    if (!result.valid) {
      allErrors.push(...result.errors)
      errorFields[field] = result.errors
    }
  })

  await Promise.all(promises)

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    errorFields
  }
}
