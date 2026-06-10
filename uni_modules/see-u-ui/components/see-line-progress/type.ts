export type SeeLineProgressStatus = 'normal' | 'success' | 'warning' | 'error'

export interface SeeLineProgressProps {
  percentage?: number
  max?: number
  strokeWidth?: string
  trackColor?: string
  activeColor?: string | string[]
  status?: SeeLineProgressStatus
  striped?: boolean
  animated?: boolean
  showText?: boolean
  textInside?: boolean
  format?: (percentage: number) => string
  round?: boolean
  inactive?: boolean
  duration?: number
}
