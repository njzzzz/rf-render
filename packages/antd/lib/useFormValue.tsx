import { Context, IRfRenderItem } from '@rf-render/antd'
import { useContext, useEffect, useMemo } from 'react'

export interface UseInitialValueProps {
  itemConfig: IRfRenderItem
  onChange: any
}
export function useInitialValue(props: UseInitialValueProps) {
  const { updateFormData, initialValues } = useContext(Context)
  const { itemConfig, onChange } = props
  const { name, mapKeys } = itemConfig
  useEffect(() => {
    if (initialValues !== undefined) {
      Object.keys(initialValues).forEach((name) => {
        updateFormData(name, initialValues[name])
      })
    }
  }, [initialValues, updateFormData])

  useEffect(() => {
    const v = initialValues[name]
    onChange(v)
  }, [initialValues, name])

  const value = useMemo(() => {
    const v = initialValues[name]
    const value: unknown[] = [v]
    if (mapKeys?.length) {
      mapKeys.forEach((mapKey) => {
        value.push(initialValues[mapKey] ?? null)
      })
    }
    return value
  }, [initialValues, mapKeys, name])

  return {
    value,
  }
}
