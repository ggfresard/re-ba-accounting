import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { useForm } from '../../hooks'
import { AuthContext } from '../../providers'

export const Login = () => {
  const [values, setValues, handleChange] = useForm<{
    username: string
    password: string
  }>({ username: '', password: '' })

  const { login, isAuthenticated } = useContext(AuthContext)

  const submit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault()
    login(values.username, values.password)
  }

  return isAuthenticated ? (
    <Redirect to="/"></Redirect>
  ) : (
    <div
      className=" align-items-center d-flex flex-column justify-content-center bg-gray-light"
      style={{ height: '100vh' }}
    >
      <div className="login-box">
        <div className="card card-outline card-primary">
          <div className="card-header text-center">
            <a href="#" className="h1">
              <b>Re-Ba</b> Accounting
            </a>
          </div>
          <div className="card-body">
            <form>
              <div className="input-group mb-3">
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="form-control"
                  placeholder="Usuario"
                  value={values.username}
                  onChange={handleChange}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user"></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  value={values.password}
                  onChange={handleChange}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <button
                  type="submit"
                  onClick={submit}
                  className="btn btn-primary"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
