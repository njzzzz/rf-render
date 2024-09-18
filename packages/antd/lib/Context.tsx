import { MutableRefObject, createContext } from 'react'
import { OnRfValuesChangeCb, RfRenderFormInstance, UpdateFormData } from '@rf-render/antd'

export interface IContext<Values = any> {
  form: RfRenderFormInstance<Values>
  formName: symbol
  formData: MutableRefObject<Values>
  updateFormData: UpdateFormData
  immediateValidate: boolean
  immediateDeps: boolean
  onRfValuesChangeSet: Set<OnRfValuesChangeCb>
}
export const Context = createContext<IContext>({
  form: {} as RfRenderFormInstance,
  formName: Symbol('formName'),
  formData: { current: {} },
  updateFormData() {},
  immediateDeps: true,
  immediateValidate: false,
  onRfValuesChangeSet: new Set(),
})
