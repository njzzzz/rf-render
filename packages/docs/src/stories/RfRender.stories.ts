import { fn } from '@storybook/test'
import { StoryObj } from '@storybook/react'
import { RfRender } from '@rf-render/core'
import { lazy } from 'react'
import { defineSchema } from '@rf-render/react'
import RfFormRender from './RfFormRender.tsx'

// eslint-disable-next-line no-new
new RfRender({
  defaultWidget: 'Test',
  plugins: [
    {
      name: 'Test',
      loader: (platform, fileName) => lazy(() => import((`../RfRenderComponents/Test/${platform}/${fileName}.tsx`))),
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
    schema: defineSchema([
      {
        name: 'xx',
        label: 'xx',
        props: { a: '', b: '' },
        dependOn: ['xx', 'xx1', 'xx2', 'xx'],
        changeConfig(config, formData) {
          config.disabled = formData.xx1 === ''
          return config
        },
      },
      {
        name: 'xx1',
        label: 'xx',
        props: { aa: '' },
        widget: 'Test',
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
