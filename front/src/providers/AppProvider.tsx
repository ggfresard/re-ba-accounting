import React, { Fragment } from 'react'
import { PartnerProvider } from './index'

const AppProviders: React.FC = ({ children }) => {
  return (
    <Fragment>
      <PartnerProvider>{children}</PartnerProvider>
    </Fragment>
  )
}

export default AppProviders
