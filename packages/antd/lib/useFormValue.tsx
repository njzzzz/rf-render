import { Context, IRfRenderItem } from '@rf-render/antd'
import { useContext, useEffect, useState } from 'react'

export interface UseFormValueProps {
  itemConfig: IRfRenderItem

}
export function useFormValue(props: UseFormValueProps) {
  const { itemConfig } = props
  const { updateFormData } = useContext(Context)
  const { initialValue = null, name, initialMapKeysValue = [], mapKeys = [] } = itemConfig

  const [mapKeysValue, setMapKeysValue] = useState<unknown[]>(initialMapKeysValue)
  useEffect(() => {
    if (initialValue !== undefined) {
      updateFormData(name, initialValue)
    }
    mapKeys.forEach((mapKey, index) => {
      updateFormData(mapKey, initialMapKeysValue[index])
    })
  }, [initialValue, name, updateFormData, initialMapKeysValue, mapKeys])
  return {
    value: initialValue,
    mapKeysValue,
    setMapKeysValue,
  }
}
