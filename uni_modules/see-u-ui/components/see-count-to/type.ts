export interface SeeCountToProps {
  startVal?: number
  endVal?: number
  duration?: number
  autoplay?: boolean
  decimals?: number
  decimal?: string
  separator?: string
  prefix?: string
  suffix?: string
  useEasing?: boolean
  easingFn?: (t: number, b: number, c: number, d: number) => number
  color?: string
  fontSize?: string
  fontWeight?: string | number
}
