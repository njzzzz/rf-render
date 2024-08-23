import { MutableRefObject, createContext } from 'react'
import { UpdateFormData } from '@rf-render/antd'
import { FormInstance } from 'antd'

export interface IContext<Values = any> {
  form: FormInstance<Values>
  formName: symbol
  formData: MutableRefObject<Values>
  updateFormData: UpdateFormData
  immediateValidate: boolean
  immediateDeps: boolean

}
export const Context = createContext<IContext>({
  form: {} as FormInstance,
  formName: Symbol('formName'),
  formData: { current: {} },
  updateFormData() {},
  immediateDeps: true,
  immediateValidate: false,
})
