import { MutableRefObject, createContext } from 'react'
import { SchemaEffectMap, SchemaMap, UpdateFormData } from '@rf-render/antd'
import { FormInstance } from 'antd'

export interface IContext {
  schemaMap: SchemaMap
  form: FormInstance | null
  formName: symbol
  updateFormData: UpdateFormData
  formData: MutableRefObject<any>
  schemaEffectMap: SchemaEffectMap
}
export const Context = createContext<IContext>({
  schemaMap: {},
  form: null,
  formName: Symbol('formName'),
  formData: { current: {} },
  updateFormData: () => {},
  schemaEffectMap: {},
})
