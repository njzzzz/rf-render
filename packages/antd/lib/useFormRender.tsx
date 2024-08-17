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
import { useMemo } from 'react'
/**
 * 初次加载渲染次数
 * Form 组件1次
 *  1. 默认首次渲染
 * FormItemBridgeWrapper SwitchWidget 2 次
 *  1. 默认首次渲染
 *  2. 加载默认配置项的更新 由于存在异步，必有一次加载完成后的更新
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
    const { schemaMap, schemaEffectMap } = usePrepareSchema({
      schema,
      formName,
    })
    const { context } = useProvider({
      schemaMap,
      form,
      formName,
      schemaEffectMap,
      formData,
      updateFormData,
      immediateDeps,
      immediateValidate,
    })
    // 保证所有表单组件均加载完成后执行一次dependOn
    // useEffect(() => {
    //   // 获取所有依赖项
    //   const promises: any[] = []
    //   if (immediateDeps) {
    //     const deps = RfRender.getAllDeps(formName) ?? []
    //     deps.forEach(async (dep) => {
    //       const { changeConfig, changeValue } = dep
    //       promises.push(await changeValue())
    //       promises.push(await changeConfig())
    //     })
    //   }
    //   Promise.all(promises).then(() => {
    //     if (immediateValidate) {
    //       form.validateFields()
    //     }
    //   })
    //   return () => RfRender.removeAllDep(formName)
    // }, [])
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
