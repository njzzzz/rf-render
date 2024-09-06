import { StoryObj } from '@storybook/react'
import { RfRender } from '@rf-render/core'
import { antdRfRenderPlugin, defineSchema } from '@rf-render/antd'
// import dayjs from 'dayjs'
import FormModal from './components/FormModal'

// eslint-disable-next-line no-new
new RfRender({
  debugger: 'info',
  defaultWidget: 'Input',
  cover: true,
  plugins: antdRfRenderPlugin,
})
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/FormModal',
  component: FormModal,
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
  // args: { onClick: fn() },
}

export default meta
type Story = StoryObj<typeof meta>
export const 弹框表单: Story = {
  args: {
    formData: {
      name: '张三',
      age: '19',
      favo: ['eat'],
      province: 'xx省',
      city: 'xx市',
    },
    modalProps: {
      okText: '保存',
      cancelText: '取消',
      title: '弹框标题',
    },
    schema: defineSchema([
      {
        label: '姓名',
        name: 'name',
        customerProps: {
          requiredWithRules: true,
        },
      },
      {
        label: '年龄',
        name: 'age',
        widget: 'InputNumber',
        customerProps: {
          requiredWithRules: true,
        },
      },
      {
        label: '爱好',
        name: 'favo',
        widget: 'CheckboxGroup',
        props: {
          options: [],
        },
        async initConfig(config) {
          config.props = {
            options: [
              { label: '吃', value: 'eat' },
              { label: '喝', value: 'drink' },
              { label: '玩', value: 'play' },
              { label: '乐', value: 'happy' },
            ],
          }
          return config
        },
      },
      {
        name: 'location',
        widget: 'Layout',
        layout: [
          {
            label: '省',
            name: 'province',
          },
          {
            label: '市',
            name: 'city',
          },
        ],
      },
    ]),
  },
}
