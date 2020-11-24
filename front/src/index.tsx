import ReactDom from 'react-dom'
import { SideBar } from './components/SideBar'
import React, { Component } from 'react'
import { AppProvider } from './providers'
import { Partners } from './components/Partners'

export default class App extends Component {
  render() {
    return (
      <AppProvider>
        <div className="wrapper">
          <SideBar></SideBar>
          <div className="content-wrapper">
            <Partners></Partners>
          </div>
        </div>
      </AppProvider>
    )
  }
}

ReactDom.render(<App></App>, document.getElementById('root'))
