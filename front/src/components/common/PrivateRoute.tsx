import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../../providers'

type Props = {
  component: () => JSX.Element
  path: string
  exact: boolean
}

function PrivateRoute({ component, path, exact = true, ...rest }: Props) {
  const { isAuthenticated, isLoading, isInit } = useContext(AuthContext)
  const Child = component

  return (
    <Route
      path={path}
      exact={exact}
      {...rest}
      render={(props) =>
        isInit || isLoading ? (
          <h2>Loading...</h2>
        ) : isAuthenticated ? (
          <Child />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  )
}

export default PrivateRoute
