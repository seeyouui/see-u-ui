import type { CountdownTimeData } from '../../utils/hooks/useCountdown'

export interface SeeCountDownProps {
  time?: number
  format?: string
  autoStart?: boolean
  millisecond?: boolean
  interval?: number
  serverTime?: number
  endTime?: number
  separator?: string
  showDays?: boolean
  zeroPad?: boolean
  textColor?: string
  fontSize?: string
  block?: boolean
}

export type SeeCountDownTimeData = CountdownTimeData
