import { IContext } from '@rf-render/antd'
import { useState } from 'react'

export function useProvider(props: IContext) {
  const [context, setContext] = useState<IContext>(props)

  return {
    context,
    setContext,
  }
}
