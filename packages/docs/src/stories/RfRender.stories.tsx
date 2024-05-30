import { fn } from '@storybook/test'
import { StoryObj } from '@storybook/react'
import { RfRender } from '@rf-render/core'
import { lazy } from 'react'
import { antdRfRenderPlugin, defineSchema } from '@rf-render/antd'
import RfFormRender from './components/RfFormRender'

// eslint-disable-next-line no-new
new RfRender({
  debugger: 'info',
  defaultWidget: 'Test',
  cover: true,
  plugins: [
    {
      name: 'Test',
      loader: (platform, fileName) =>
        lazy(
          () => import(`../RfRenderComponents/Test/${platform}/${fileName}.tsx`),
        ),
    },
    {
      name: 'CheckboxGroup',
      loader: () => lazy(() => import('antd/es/checkbox/Group')),
    },
    ...antdRfRenderPlugin,
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
  argTypes: {},

  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
}

export default meta
type Story = StoryObj<typeof meta>
// // More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const 简单表单: Story = {
  args: {
    layout: 'vertical',
    initialValues: {
      name: '',
      age: '',
      ageOver18: '',
      favo: [],
    },
    schema: defineSchema([
      {
        label: '姓名',
        name: 'name',
        itemProps: {
          rules: [{ required: true, message: '请输入姓名' }],
        },
      },
      {
        label: '年龄',
        name: 'age',
        props: {
          type: 'number',
        },
        itemProps: {
          rules: [{ required: true, message: '请输入年龄' }],
        },
      },
      {
        label: '年龄是否大于18',
        name: 'ageOver18',
        dependOn: ['age'],
        props: {
          disabled: true,
        },
        changeValue(formData) {
          return [formData.age ? formData.age > 18 ? '是' : '否' : '']
        },
      },
      {
        label: '爱好',
        name: 'favo',
        widget: 'CheckboxGroup',
        props: {
          options: [
            { label: '吃', value: 'eat' },
            { label: '喝', value: 'drink' },
            { label: '玩', value: 'play' },
            { label: '乐', value: 'happy' },
          ],
        },
      },
      {
        name: 'showlayoutDispaly',
        widget: 'RadioGroup',
        label: '是否显示省市（卸载组件，不保留表单值）',
        props: {
          options: [
            '是',
            '否',
          ],
        },
      },
      {
        name: 'showlayoutVisibility',
        widget: 'RadioGroup',
        label: '是否显示省市（不展示组件，但保留表单值）',
        props: {
          options: [
            '是',
            '否',
          ],
        },
      },
      {
        name: 'location',
        widget: 'Layout',
        dependOn: ['showlayoutVisibility', 'showlayoutDispaly'],
        changeConfig(config, formData) {
          config.display = !!formData.showlayoutDispaly && (formData.showlayoutDispaly === '是')
          config.visibility = !!formData.showlayoutVisibility && (formData.showlayoutVisibility === '是')
          return config
        },
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
