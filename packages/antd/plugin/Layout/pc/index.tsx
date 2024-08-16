import { CustomerLayout, FormItemBridgeWrapper, getItemStyle } from '@rf-render/antd'
import { FormItemBridgeProps } from '@rf-render/core'
import { Col, Row } from 'antd'
import { ReactElement } from 'react'
/**
 * 布局组件-使用antd的 Row Col进行封装
 */
export default function Layout(props: FormItemBridgeProps) {
  const { itemConfig } = props
  const { props: selfProps = {}, layout = [] } = itemConfig
  const { span = 2, rowProps, colProps } = selfProps as CustomerLayout
  const getRows = () => {
    if (!layout.length) {
      return null
    }
    return layout.reduce((acc: ReactElement[], item, currentIndex: number) => {
      const { name, colProps: itemColProps, display = true, visibility = true } = item
      const { itemStyle } = getItemStyle({ visibility })

      if (display) {
        acc.push (
          <Col key={name || currentIndex} {...(itemColProps ?? (colProps ?? { span: Math.ceil(24 / (span || layout.length)) }))} style={itemStyle}>
            <FormItemBridgeWrapper itemConfig={item}></FormItemBridgeWrapper>
          </Col>,
        )
      }
      return acc
    }, [])
  }
  const Rows = getRows() ?? []
  return (
    <>
      {
        Rows.map((cols, index) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Row key={index} gutter={24} {...(rowProps ?? {})}>
              {cols}
            </Row>
          )
        })
      }
    </>
  )
}
