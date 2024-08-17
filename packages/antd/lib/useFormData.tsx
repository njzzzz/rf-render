import { useRef } from 'react'

export type UpdateFormData = (mapKeyname: string, val: any) => void

export function useFormData() {
  const formData = useRef<any>({})
  const updateFormData: UpdateFormData = (key, val) => {
    formData.current[key] = val
  }
  return {
    formData,
    updateFormData,
  }
}
