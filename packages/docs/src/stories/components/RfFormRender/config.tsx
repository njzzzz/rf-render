import { defineSchema } from '@rf-render/antd'
import { FormInstance } from 'antd'

export function useExampleSchema(props: { form: FormInstance }) {
  return defineSchema([
    {
      name: 'name',
      label: '姓名',
      itemProps: { rules: [{ required: true, message: '请输入姓名' }] },
      props: { placeholder: '请输入姓名', readOnly: true },
    },
    {
      name: 'age',
      label: '年龄',
      itemProps: { rules: [{ required: true, message: '请输入年龄' }] },
      props: { placeholder: '请输入姓名', type: 'number' },
    },
    {
      name: 'ageOver18',
      label: '年龄是否大于18',
      mapKeys: ['ageOver18Egnlish'],
      dependOn: ['age'],
      changeValue(formData) {
        return [
          formData.age > 18 ? '是' : '否',
          formData.age > 18 ? 'yes' : 'no',
        ]
      },
      changeConfig(config, formData) {
        const { props = {} } = config
        props.disabled = formData.age > 18
        return { ...config, props }
      },
    },
    {
      name: 'favo',
      widget: 'CheckboxGroup',
      withFormItem: true,
      label: '爱好',
      dependOn: ['age'],
      async initConfig(config) {
        return {
          ...config,
          props: {
            options: [
              { label: 'AppleDefault', value: 'AppleDefault' },
              { label: 'PearDefault', value: 'PearDefault' },
              { label: 'OrangeDefault', value: 'OrangeDefault' },
            ],
          },
        }
      },
      async changeConfig(config, formData) {
        const { props = {} } = config
        const { age } = formData
        props.options = age > 18 ? await getOptions1() : await getOptions2()
        return {
          ...config,
          props,
        }
      },
      changeValue() {
        return [[]]
      },
    },
    {
      name: 'buju',
      label: '布局',
      widget: 'Layout',
      withFormItem: false,
      display: false,
      dependOn: ['age'],
      changeConfig(config, formData) {
        config.display = formData.age === '18'
        return config
      },
      layout: [
        {
          name: 'date',
          label: '日期',
          itemProps: { rules: [{ required: true, message: '请输入日期' }] },
        },
        { name: 'date-1', label: '日期-1' },
      ],
    },
    {
      withFormItem: false,
      widget: 'Layout',
      props: {
        rowProps: {
          gutter: 18,
        },
      },
      layout: [
        {
          withFormItem: false,
          widget: 'Button',
          props: {
            type: 'primary',
            children: '提交',
            onClick() {
              props.form.validateFields()
              const data = props.form.getFieldsValue()
              console.log(data)
            },
          },
        },
        {
          withFormItem: false,
          widget: 'Button',
          colProps: {
          },
          props: {
            children: '重置',
            onClick() {
              props.form.resetFields()
            },
          },
        },
      ],
    },
  ])
}
async function getOptions1(): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve([
          { label: 'Apple1', value: 'Apple1' },
          { label: 'Pear1', value: 'Pear1' },
          { label: 'Orange1', value: 'Orange1' },
        ]),
      1000,
    )
  })
}

async function getOptions2() {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve([
          { label: 'Apple2', value: 'Apple2' },
          { label: 'Pear2', value: 'Pear2' },
          { label: 'Orange2', value: 'Orange2' },
        ]),
      1000,
    )
  })
}
