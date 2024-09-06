import { RfRenderFormInstance, defineSchema, useFormRender } from '@rf-render/antd'
import { FormInstance, Modal, ModalProps } from 'antd'
import { useCallback, useState } from 'react'

export interface FormModalOpenProps {
  formData?: Record<string, any>
  schema: ReturnType<typeof defineSchema>
  modalProps?: FormModalProps
  labelPosition?: 'horizontal' | 'inline' | 'vertical'
}

export interface UseFormModalOnOkProps {
  form: RfRenderFormInstance
  formData: Record<string, any>
  close: () => void
  /**
   * open传入的初始值
   */
  initialValues: Record<string, any>
}

export interface UseFormModalProps {
  labelPosition?: 'horizontal' | 'inline' | 'vertical'
}

export interface FormModalProps extends Omit<ModalProps, 'onOk' | 'footer'> {
  onOk?: (props: UseFormModalOnOkProps) => any
  footer?: (props: {
    initialValues: Record<string, any>
    confirm: () => Promise<void>
    form: FormInstance<any> & { getRfFieldsValue: <T>() => T }
    close: () => void
  }) => ModalProps['footer']
  confirm?: () => Promise<void>
}

export function useFormModal(props: UseFormModalProps = {}) {
  const { labelPosition = 'vertical' } = props
  const [visible, setVisible] = useState(false)
  const [modalProps, setModalProps] = useState<FormModalProps>({})
  const [initialValues, setInitialValues] = useState({})
  const [schema, setSchema] = useState<any[]>([])
  const { FormRender, form } = useFormRender()
  const [layout, setLayout] = useState<UseFormModalProps['labelPosition']>(labelPosition)

  const open = (props: FormModalOpenProps) => {
    const { formData = {}, modalProps = {}, schema = [], labelPosition } = props
    setModalProps(modalProps)
    setVisible(true)
    setInitialValues(formData)
    setLayout(pos => labelPosition || pos)
    setSchema(schema)
  }
  const close = () => {
    setVisible(false)
  }

  const FormModal = useCallback(() => {
    const confirm = async () => {
      const { onOk } = modalProps
      try {
        await form.validateFields()
        onOk && onOk({ formData: form.getRfFieldsValue(), form, close, initialValues })
      }
      catch (e) {
        console.log(e)
      }
    }
    const { footer, ...otherProps } = modalProps
    const props: Omit<FormModalProps, 'footer'> & {
      footer?: ModalProps['footer']
    } = {
      ...otherProps,
    }
    if (footer) {
      props.footer = footer({
        form,
        close,
        initialValues,
        confirm,
      })
    }
    return (
      <Modal {...props} open={visible} onCancel={close} onOk={confirm}>
        <FormRender layout={layout} schema={schema} initialValues={initialValues} />
      </Modal>
    )
  }, [visible, schema, initialValues, modalProps, layout])

  return {
    FormModal,
    open,
    close,
  }
}
export type ReturnTypeOfUseFormModal = ReturnType<typeof useFormModal>
