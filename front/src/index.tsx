import ReactDom from 'react-dom'
import React from 'react'
import { AppProvider } from './providers'
import AppRouter from './components/AppRouter'

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}

ReactDom.render(<App />, document.getElementById('root'))
