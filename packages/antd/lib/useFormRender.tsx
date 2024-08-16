import { Form } from 'antd'
import {
  Context,
  FormItemBridgeWrapper,
  FormRenderProps,
  useFormData,
  usePrepareSchema,
  useProvider,
} from '@rf-render/antd'
import { FileName, Platform, RfRender } from '@rf-render/core'
import { useEffect } from 'react'

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
  const formName = Symbol('formName')

  const switchFileName = (fileName: FileName) => {
    RfRender.switchFileName(fileName, formName)
  }
  const switchPlatform = (platform: Platform) => {
    RfRender.switchPlatform(platform, formName)
  }
  const switchPlatformAndFileName = (fileName: FileName, platform: Platform) => {
    RfRender.switchPlatformAndFileName(platform, fileName, formName)
  }

  /**
   * @description 表单渲染组件，多了个schema属性其余和和antd的Form属性一致
   */
  function FormRender(props: FormRenderProps) {
    const { schema, immediateDeps = true, immediateValidate = false, ...antdFromProps } = props
    const { formData, updateFormData } = useFormData()
    const { schemaMap, schemaEffectMap } = usePrepareSchema({
      schema,
      formName,
      updateFormData,
    })
    const { context } = useProvider({
      schemaMap,
      form,
      formName,
      schemaEffectMap,
      formData,
      updateFormData,
    })
    // 保证所有表单组件均加载完成后执行一次dependOn
    useEffect(() => {
      // 默认切换一次平台
      RfRender.switchPlatformAndFileName(platform, fileName, formName)
      // 获取所有依赖项
      if (immediateDeps) {
        // const deps = RfRender.getAllDeps(formName) ?? []
        // deps.forEach(async (dep) => {
        //   const { changeConfig, changeValue } = dep
        //   await changeValue(immediateValidate)
        //   await changeConfig()
        // })
      }
    }, [immediateDeps])
    console.log('FormRender comp renderer')

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
    form,
  }
}
