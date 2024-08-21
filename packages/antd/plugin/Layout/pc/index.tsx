import { CustomerLayout, FormItemBridgeWrapper, getItemStyle } from '@rf-render/antd'
import { FormItemBridgeProps } from '@rf-render/core'
import { Col, Row } from 'antd'
import { ReactElement } from 'react'
/**
 * 布局组件-使用antd的 Row Col进行封装
 */
export default function Layout(props: FormItemBridgeProps) {
  const { itemConfig } = props
  const { props: selfProps = {}, layout = [], display = true, visibility = true } = itemConfig
  const { span, rowProps, colProps, mode = 'independent' } = selfProps as CustomerLayout
  const getRow = () => {
    if (!layout.length) {
      return null
    }
    return layout.reduce((acc: ReactElement[], item, currentIndex: number) => {
      const { name, colProps: itemColProps = {}, display = true, visibility = true, itemProps = {}, layout: itemLayout = [] } = item
      // 处理每一项的隐藏逻辑
      const { itemStyle } = getItemStyle({ visibility })
      const { style = {} } = itemProps
      const itemColPropsOverride = {
        noStyle: mode === 'combine',
        ...itemProps,
      }
      if (itemLayout.length) {
        itemColPropsOverride.style = {
          marginBottom: 0,
          ...style,
        }
      }

      if (display) {
        acc.push (
          <Col key={name || currentIndex} {...(itemColProps ?? (colProps ?? { span: Math.ceil(24 / (span || layout.length)) }))} style={itemStyle}>
            <FormItemBridgeWrapper itemConfig={{ ...item, itemProps: itemColPropsOverride }}></FormItemBridgeWrapper>
          </Col>,
        )
      }
      return acc
    }, [])
  }
  const Rows = getRow() ?? []
  const { itemStyle } = getItemStyle({ visibility })
  return (
    display
      ? (
        <Row gutter={[24, 16]} {...(rowProps ?? {})} style={itemStyle}>
          {Rows}
        </Row>
        )
      : null
  )
}
