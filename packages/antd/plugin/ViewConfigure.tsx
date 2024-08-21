import { defineConfigure } from '@rf-render/core'

/**
 * common configure
 */
// eslint-disable-next-line react-refresh/only-export-components
export default defineConfigure(() => {
  return {
    props: {
      disabled: true,
      readOnly: true,
    },
  }
})
