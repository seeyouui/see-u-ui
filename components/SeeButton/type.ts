export type TouchEvent = {
  touches: Array<{ clientX: number; clientY: number }>
  changedTouches: Array<{ clientX: number; clientY: number }>
  detail?: {
    clientX?: number
    clientY?: number
  }
}

export type ClientRectData = {
  id?: string
  dataset?: Record<string, string>

  top: number
  bottom: number
  left: number
  right: number
  width: number
  height: number

  finalWidth?: number
}

export interface RippleItem {
	id: number;
	x: number;
	y: number;
	size: number;
}