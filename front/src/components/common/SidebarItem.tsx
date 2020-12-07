import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

interface Props {
  title: string
  route?: string
  icon?: string
  callback?: () => void
}

export const SidebarItem: React.FC<Props> = ({
  children,
  route,
  icon,
  title,
  callback
}) => {
  const [active, setActive] = useState(route === window.location.pathname)
  const history = useHistory()

  useEffect(() => {
    return history.listen((location) => {
      setActive(location.pathname === route)
    })
  }, [history])

  return (
    <li className="nav-item">
      <a
        className={`nav-link ${active && 'active'}`}
        onClick={() => {
          if (route) {
            history.push(route)
          } else if (callback) {
            callback()
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <i className={`nav-icon fas fa-${icon}`}></i>
        <p>
          {title}
          {!!children && <i className="right fas fa-angle-left"></i>}
        </p>
      </a>
      {!!children && <ul className="nav nav-treeview">{children}</ul>}
    </li>
  )
}
