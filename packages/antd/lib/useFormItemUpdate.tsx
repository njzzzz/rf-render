import { IRfRenderItem } from '@rf-render/antd'
import { useState } from 'react'

export type FormItemUpdateProps = Pick<IRfRenderItem, 'label' | 'visibility' | 'display' | 'itemProps'>
export interface UseFormItemUpdateProps {
  itemConfig: IRfRenderItem
}
export type OnUpdateFormItem = React.Dispatch<React.SetStateAction<FormItemUpdateProps>>
export function useFormItemUpdate(props: UseFormItemUpdateProps) {
  const { itemConfig } = props
  // 影响FormItemBridgeWrapper重新渲染的属性
  const [formItemProps, setFormItemProps] = useState<FormItemUpdateProps>(itemConfig)

  return {
    formItemProps,
    setFormItemProps,
    onUpdateFormItem: setFormItemProps,
  }
}
