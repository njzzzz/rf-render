import { IRfRenderItem } from '@rf-render/antd'
import { CSSProperties } from 'react'

export function getItemStyle(props: Pick<IRfRenderItem, 'visibility'>) {
  const { visibility = true } = props
  const itemStyle: Pick<CSSProperties, 'visibility' | 'width' | 'height' | 'margin' | 'padding'> = {}
  if (!visibility) {
    itemStyle.width = 0
    itemStyle.height = 0
    itemStyle.margin = 0
    itemStyle.padding = 0
    itemStyle.visibility = 'hidden'
  }
  return {
    itemStyle,
  }
}
