import { Form, FormInstance } from 'antd'
import {
  Context,
  FormItemBridgeWrapper,
  FormRenderProps,
  useFormData,
  useProvider,
} from '@rf-render/antd'
import { FileName, Platform, RfRender } from '@rf-render/core'
import { useEffect, useMemo } from 'react'
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

  /**
   * @description form实例，使用useForm得到的
   */
  const [form] = Form.useForm()
  const formName = useMemo(() => Symbol('formName'), [])
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
    const { context } = useProvider({
      form,
      formName,
      formData,
      updateFormData,
      immediateDeps,
      immediateValidate,
    })

    useEffect(() => {
      return () => {
        RfRender.removeAllOneDep(formName)
      }
    }, [])
    return (
      <Context.Provider value={context}>
        <Form
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
    form: {
      ...form,
      /**
       * @description 会过滤掉键包含/\.\d+\./，只对单层有效
       */
      getRfFieldsValue() {
        return form.getFieldsValue(true, rfrenderFieldsFilter)
      },
    } as RfRenderFormInstance,
  }
}

export interface RfRenderFormInstance<T = any> extends FormInstance<T> {
  getRfFieldsValue: <T>() => T
}

export function rfrenderFieldsFilter(meta: any) {
  const { name = [] } = meta
  return !name[0].match(/\.\d+\./)
}
