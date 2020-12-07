import React, { Fragment } from 'react'
import AuthProvider from './AuthProvider'
import {
  PartnerProvider,
  ErrorProvider,
  ProjectProvider,
  ExpenseProvider
} from './index'

const AppProviders: React.FC = ({ children }) => {
  return (
    <Fragment>
      <ErrorProvider>
        <AuthProvider>
          <PartnerProvider>
            <ProjectProvider>
              <ExpenseProvider>{children}</ExpenseProvider>
            </ProjectProvider>
          </PartnerProvider>
        </AuthProvider>
      </ErrorProvider>
    </Fragment>
  )
}

export default AppProviders
