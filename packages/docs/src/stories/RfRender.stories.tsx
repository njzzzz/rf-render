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
      loader: (platform, fileName) => lazy(() => import('antd/es/checkbox/Group')),
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
        label: '爱好',
        async initConfig(config) {
          return {
            ...config,
            props: {
              options: [
                { label: 'Apple', value: 'Apple' },
                { label: 'Pear', value: 'Pear' },
                { label: 'Orange', value: 'Orange' },
              ],
            },
          }
        },
        // props: {
        //   options:
        // },
      },

    ]),
  },
}
