import { StoryObj } from '@storybook/react'
import { defineSchema } from '@rf-render/antd'
import Test from './Test'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  // title: 'Components/RfFormRender',
  component: Test,
  // parameters: {
  //   // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
  //   layout: 'centered',
  // },
  // // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  // tags: ['autodocs'],
  // // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // argTypes: {

  // },

  // // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
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
        props: { disabled: false, placeholder: '请输入姓名' },
        changeConfig(config, formData) {
          config.props!.disabled = formData.b === '1'
          return config
        },
      },
      {
        name: 'age',
        label: '年龄',
        ItemProps: { rules: [{ required: true, message: '请输入年龄' }] },
        props: { disabled: false, placeholder: '请输入姓名', type: 'number' },
      },
      {
        name: 'ageOver18',
        label: '年龄是否大于18',
        props: {
          disabled: false,
        },
        dependOn: ['age'],
        changeValue(formData) {
          return [formData.age > 18 ? '是' : '否']
        },
        changeConfig(config, formData) {
          config.props!.disabled = formData.age > 18
          return config
        },
      },
    ]),
  },
}
export const X但是: Story = {
  args: {
    layout: 'vertical',
    schema: defineSchema([
      {
        name: 'name',
        label: '姓名',
        ItemProps: { rules: [{ required: true, message: '请输入姓名' }] },
        props: { disabled: false, placeholder: '请输入姓名' },
        changeConfig(config, formData) {
          config.props!.disabled = formData.b === '1'
          return config
        },
      },
      {
        name: 'age',
        label: '年龄',
        ItemProps: { rules: [{ required: true, message: '请输入年龄' }] },
        props: { disabled: false, placeholder: '请输入姓名', type: 'number' },
      },
      {
        name: 'ageOver18',
        label: '年龄是否大于18',
        props: {
          disabled: false,
        },
        dependOn: ['age'],
        changeValue(formData) {
          return [formData.age > 18 ? '是' : '否']
        },
        changeConfig(config, formData) {
          config.props!.disabled = formData.age > 18
          return config
        },
      },
    ]),
  },
}
// export const Secondary: Story = {
//   args: {
//     label: 'Button',
//   },
// }
//
// export const Large: Story = {
//   args: {
//     size: 'large',
//     label: 'Button',
//   },
// }
//
// export const Small: Story = {
//   args: {
//     size: 'small',
//     label: 'Button',
//   },
// }
