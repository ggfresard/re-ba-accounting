import React, { createContext, useContext, useEffect, useState } from 'react'
import apiClient from '../apiClient'
import { Endpoints } from '../types/Endpoints'
import { ErrorContext } from './ErrorProvider'

interface AuthContextInterface {
  user: User | null
  isAuthenticated: boolean | null
  isLoading: boolean
  loadUser: () => void
  login: (username: string, password: string) => void
  logout: () => void
  isInit: boolean
}

export const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface
)

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInit, setIsInit] = useState(true)
  const { addError } = useContext(ErrorContext)

  const loadUser = async () => {
    setIsLoading(true)
    const response = await apiClient.get(Endpoints.UserAuth)
    if (response.success) {
      setUser(response.data)
      setIsAuthenticated(true)
    }
    if (response.error) {
      localStorage.removeItem('token')
      setUser(null)
      setIsAuthenticated(false)
    }
    setIsLoading(false)
    setIsInit(false)
  }

  const login = async (username: string, password: string) => {
    const response = await apiClient.post(Endpoints.Login, {
      body: { username, password }
    })

    if (response.success) {
      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
      setIsAuthenticated(true)
    }

    if (response.error) {
      localStorage.removeItem('token')
      addError(response.data, response.status)
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const logout = async () => {
    const response = await apiClient.post(Endpoints.Logout, { body: null })
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
    if (response.error) {
      addError(response.data, response.status)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        loadUser,
        login,
        logout,
        isInit
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
