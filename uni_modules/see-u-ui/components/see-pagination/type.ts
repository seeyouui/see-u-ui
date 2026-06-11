/**
 * SeePagination Props
 */
export interface SeePaginationProps {
  /** 当前页码 */
  modelValue?: number
  /** 总条数 */
  total?: number
  /** 每页条数 */
  pageSize?: number
  /** 显示模式 */
  mode?: 'button' | 'simple' | 'number'
  /** 最多显示页码数 */
  maxPages?: number
  /** 是否显示总数 */
  isShowTotal?: boolean
  /** 是否显示每页条数选择器 */
  isShowSizeChanger?: boolean
  /** 每页条数选项 */
  pageSizeOptions?: number[]
  /** 上一页文字 */
  prevText?: string
  /** 下一页文字 */
  nextText?: string
  /** 是否禁用 */
  isDisabled?: boolean
}

/**
 * SeePagination 事件
 */
export interface SeePaginationEmits {
  /** 页码变更 */
  (e: 'onChange', page: number, pageSize: number): void
  /** v-model 更新 */
  (e: 'update:modelValue', value: number): void
}
