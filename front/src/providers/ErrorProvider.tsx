import React, { createContext, Fragment, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ToastBody } from 'reactstrap'
type ErrorContextInterface = {
  errors: string[]
  addError: (error: string, status?: number) => boolean
}

export const ErrorContext = createContext<ErrorContextInterface>(
  {} as ErrorContextInterface
)

const ErrorProvider: React.FC = ({ children }) => {
  const [errors, setErrors] = useState<string[]>([])

  const addError = (error: string, status?: number) => {
    setErrors([...errors, error])
    toast.error(
      <Fragment>
        <ToastBody>{`Error ${status}`}</ToastBody>
        <ToastBody>{error}</ToastBody>
      </Fragment>
    )
    return true
  }

  return (
    <ErrorContext.Provider
      value={{
        errors,
        addError
      }}
    >
      <ToastContainer />
      {children}
    </ErrorContext.Provider>
  )
}

export default ErrorProvider
