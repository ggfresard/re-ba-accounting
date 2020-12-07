import React, { Fragment, useContext, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useHistory
} from 'react-router-dom'
import { AuthContext } from '../providers'
import { Login } from './views/Login'
import PrivateRoute from './common/PrivateRoute'
import { Partners } from './views/Partners/Partners'
import { Navbar } from './common/Navbar'
import { SideBar } from './common/SideBar'
import { Projects } from './views/Projects/Projects'
import { Partnership } from './views/Partnership/Partnership'

const AppRouter = () => {
  const { isAuthenticated, loadUser } = useContext(AuthContext)

  useEffect(() => {
    loadUser()
  }, [])

  return (
    <Router>
      <div className="wrapper">
        {isAuthenticated && (
          <Fragment>
            <Navbar></Navbar>
            <SideBar></SideBar>
          </Fragment>
        )}
        <Switch>
          <PrivateRoute exact path="/" component={Partners} />
          <PrivateRoute exact path="/projects" component={Projects} />
          <PrivateRoute exact path="/partnership" component={Partnership} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </div>
    </Router>
  )
}

export default AppRouter
