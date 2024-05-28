import { fn } from '@storybook/test'
import { StoryObj } from '@storybook/react'
import { RfRender } from '@rf-render/core'
import { lazy } from 'react'
import { defineSchema } from '@rf-render/antd'
import RfFormRender from './RfFormRender.tsx'

// eslint-disable-next-line no-new
new RfRender({
  defaultWidget: 'Test',
  plugins: [
    {
      name: 'Test',
      loader: (platform, fileName) => lazy(() => import((`../RfRenderComponents/Test/${platform}/${fileName}.tsx`))),
    },
    {
      name: 'CheckboxGroup',
      loader: () => lazy(() => import('antd/es/checkbox/Group')),
    },
  ],
})
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/RfFormRender',
  component: RfFormRender,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {

  },

  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
}

export default meta
type Story = StoryObj<typeof meta>
//

// // More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    layout: 'vertical',
    initialValues: {
      name: 'xxxx',
      age: '19',
      ageOver18: '是',
      favo: ['Apple', 'Pear', 'Orange'],
      ageOver18Egnlish: 'xxx',
    },
    schema: defineSchema([
      {
        name: 'name',
        label: '姓名',
        ItemProps: { rules: [{ required: true, message: '请输入姓名' }] },
        props: { placeholder: '请输入姓名' },
      },
      {
        name: 'age',
        label: '年龄',
        ItemProps: { rules: [{ required: true, message: '请输入年龄' }] },
        props: { placeholder: '请输入姓名', type: 'number' },
      },
      {
        name: 'ageOver18',
        label: '年龄是否大于18',
        mapKeys: ['ageOver18Egnlish'],
        dependOn: ['age'],
        changeValue(formData) {
          return [formData.age > 18 ? '是' : '否', formData.age > 18 ? 'yes' : 'no']
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

    ]),
  },
}
async function getOptions1(): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([
      { label: 'Apple1', value: 'Apple1' },
      { label: 'Pear1', value: 'Pear1' },
      { label: 'Orange1', value: 'Orange1' },
    ]), 1000)
  })
}

async function getOptions2() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([
      { label: 'Apple2', value: 'Apple2' },
      { label: 'Pear2', value: 'Pear2' },
      { label: 'Orange2', value: 'Orange2' },
    ]), 1000)
  })
}
