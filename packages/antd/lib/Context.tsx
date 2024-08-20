import { MutableRefObject, createContext } from 'react'
import { SchemaEffectMap, SchemaEffectRecordMap, SchemaMap, UpdateFormData } from '@rf-render/antd'
import { FormInstance } from 'antd'

export interface IContext<Values = any> {
  schemaMap: SchemaMap
  form: FormInstance<Values>
  formName: symbol
  // 收集依赖执行changeConfig和changeValue --> 针对数组中的字符串类型
  dependOnMap: SchemaEffectMap
  formData: MutableRefObject<Values>
  updateFormData: UpdateFormData
  immediateValidate: boolean
  immediateDeps: boolean
  // 收集依赖执行changeConfig和changeValue --> 针对数组中的对象类型，单独执行
  independentOnsMap: SchemaEffectRecordMap
}
export const Context = createContext<IContext>({
  schemaMap: {},
  form: {} as FormInstance,
  formName: Symbol('formName'),
  dependOnMap: {},
  formData: { current: {} },
  updateFormData() {},
  immediateDeps: true,
  immediateValidate: false,
  independentOnsMap: {},
})
