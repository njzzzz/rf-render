import { CustomerLayout, FormItemBridgeWrapper, getItemStyle } from '@rf-render/antd'
import { FormItemBridgeProps } from '@rf-render/core'
import { Col, FormInstance, Row } from 'antd'
import { ReactElement } from 'react'

/**
 * 布局组件-使用antd的 Row Col进行封装
 */
export default function Layout(props: FormItemBridgeProps<FormInstance> & CustomerLayout) {
  const { rfrender, span = 2, rowProps, colProps } = props
  const { item } = rfrender
  const { layout = [] } = item
  const getRows = () => {
    if (!layout.length) {
      return null
    }
    let index = 0
    return layout.reduce((acc: ReactElement[][], item, currentIndex: number) => {
      const stack: ReactElement[] = acc[index] ?? []
      const { name, colProps: itemColProps, display = true, visibility = true } = item
      const { itemStyle } = getItemStyle({ visibility })

      if (display) {
        const col = (
          <Col key={name || currentIndex} {...(itemColProps ?? (colProps ?? {}))} style={itemStyle}>
            <FormItemBridgeWrapper {...item} {...rfrender}></FormItemBridgeWrapper>
          </Col>
        )
        acc[index] = [...stack, col]
      }
      const len = acc[index]?.length
      if (len && (len % span === 0)) {
        index++
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
