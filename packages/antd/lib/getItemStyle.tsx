import { IRfRenderItem } from '@rf-render/antd'
import { CSSProperties } from 'react'

export function getItemStyle(props: Pick<IRfRenderItem, 'visibility'>) {
  const { visibility = true } = props
  const itemStyle: Pick<CSSProperties, 'visibility' | 'width' | 'height' | 'margin'> = {}
  if (!visibility) {
    itemStyle.visibility = 'hidden'
    itemStyle.width = 0
    itemStyle.height = 0
    itemStyle.margin = 0
  }
  return {
    itemStyle,
  }
}
