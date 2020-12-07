import React, { useContext } from 'react'
import { AuthContext } from '../../providers'
import { SidebarItem } from './SidebarItem'

export const SideBar = () => {
  const { logout } = useContext(AuthContext)

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <a href="#" className="brand-link text-center">
        Re-Ba<span className="brand-text font-weight-light"> Accounting</span>
      </a>
      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
          >
            <SidebarItem title="Socios" icon="user" route="/"></SidebarItem>
            <SidebarItem
              title="Proyectos"
              icon="handshake"
              route="/projects"
            ></SidebarItem>
            <SidebarItem
              title="Sociedad"
              icon="users"
              route="/partnership"
            ></SidebarItem>
            <SidebarItem
              title="Salir"
              icon="sign-out-alt"
              callback={logout}
            ></SidebarItem>
          </ul>
        </nav>
      </div>
    </aside>
  )
}
