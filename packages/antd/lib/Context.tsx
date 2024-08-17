import { MutableRefObject, createContext } from 'react'
import { SchemaEffectMap, SchemaMap, UpdateFormData } from '@rf-render/antd'
import { FormInstance } from 'antd'

export interface IContext<Values = any> {
  schemaMap: SchemaMap
  form: FormInstance<Values>
  formName: symbol
  schemaEffectMap: SchemaEffectMap
  formData: MutableRefObject<Values>
  updateFormData: UpdateFormData
  immediateValidate: boolean
  immediateDeps: boolean
}
export const Context = createContext<IContext>({
  schemaMap: {},
  form: {} as FormInstance,
  formName: Symbol('formName'),
  schemaEffectMap: {},
  formData: { current: {} },
  updateFormData() {},
  immediateDeps: true,
  immediateValidate: false,
})
