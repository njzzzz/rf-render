import { Form, FormInstance } from 'antd'
import {
  Context,
  CustomerProps,
  FormItemBridgeWrapper,
  FormRenderProps,
  IRfRenderItem,
  useFormData,
  useProvider,
} from '@rf-render/antd'
import { FileName, Platform, RfRender } from '@rf-render/core'
import { useEffect, useMemo, useState } from 'react'
/**
 * 初次加载渲染次数
 * Form 组件1次
 *  1. 默认首次渲染
 * FormItemBridgeWrapper SwitchWidget 2 或 3 次
 *  1. 默认首次渲染
 *  2. 加载默认配置项的更新 由于存在异步，必有一次加载完成后的更新
 *  3. 首次加载， changeConfig 可能会发生一次， 返回undefined 不会触发
 */
export interface FormRenderParams {
  fileName?: FileName
  platform?: Platform
}
export function useFormRender(params: FormRenderParams = {}) {
  const { fileName, platform } = { fileName: 'index', platform: 'pc', ...params }
  const formName = useMemo(() => Symbol('formName'), [])
  const onRfValuesChangeSet: Set<OnRfValuesChangeCb> = new Set()
  /**
   * @description form实例，使用useForm得到的
   */
  const [form] = Form.useForm()
  const overrideForm = {
    ...form,
    /**
     * @description 会过滤掉键包含/\.\d+\./，只对单层有效
     */
    getRfFieldsValue() {
      return form.getFieldsValue(true, rfrenderFieldsFilter)
    },
    /**
     * @description 当表单项触发onChange或者changeValue被触发时，新旧值不一致时触发
     */
    onRfValuesChange(cb) {
      onRfValuesChangeSet.add(cb)
    },
  } as RfRenderFormInstance
  const switchFileName = (fileName: FileName) => {
    RfRender.switchFileName(fileName, formName)
  }
  const switchPlatform = (platform: Platform) => {
    RfRender.switchPlatform(platform, formName)
  }
  const switchPlatformAndFileName = (fileName: FileName, platform: Platform) => {
    RfRender.switchPlatformAndFileName(platform, fileName, formName)
  }

  // 切换一次平台
  RfRender.switchPlatformAndFileName(platform, fileName, formName)

  /**
   * @description 表单渲染组件，多了个schema属性其余和和antd的Form属性一致
   */
  function FormRender(props: FormRenderProps) {
    const { schema, immediateDeps = true, immediateValidate = false, ...antdFromProps } = props
    const { formData, updateFormData } = useFormData()
    const [currentFileName, setCurrentFileName] = useState<FileName>(fileName)
    const { context } = useProvider({
      form: overrideForm,
      formName,
      formData,
      updateFormData,
      immediateDeps,
      immediateValidate,
      onRfValuesChangeSet,
    })

    useEffect(() => {
      const toggleClass = () => {
        setCurrentFileName(RfRender.fileName.get(formName)!)
      }
      RfRender.addSwitchListener(formName, toggleClass)
      return () => {
        RfRender.removeAllOneDep(formName)
        RfRender.removeSwitchListener(formName, toggleClass)
      }
    }, [])

    const className = useMemo(() => {
      return `rf-render-form rf-render-form-${currentFileName}`
    }, [currentFileName])

    return (
      <Context.Provider value={context}>
        <Form
          className={className}
          form={form}
          {...antdFromProps}
        >
          {
              schema.map((item) => {
                return (
                  <FormItemBridgeWrapper
                    key={item.name}
                    itemConfig={item}
                  />
                )
              })
            }
        </Form>
      </Context.Provider>
    )
  }
  return {
    FormRender,
    switchFileName,
    switchPlatform,
    switchPlatformAndFileName,
    formName,
    form: overrideForm,
  }
}
export type OnRfValuesChange<T = any> = (cb: OnRfValuesChangeCb<T>) => void
export type OnRfValuesChangeCb<T = any> = (formData: T, itemConfig: IRfRenderItem, customProps: CustomerProps,) => void
export interface RfRenderFormInstance<T = any> extends FormInstance<T> {
  getRfFieldsValue: <V>() => V
  onRfValuesChange: OnRfValuesChange<T>
}
export function rfrenderFieldsFilter(meta: any) {
  const { name = [] } = meta
  return !name[0].match(/\.\d+\./)
}
