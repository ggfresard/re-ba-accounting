import React, { Children } from 'react'

export const ContentWrapper: React.FC = ({ children }) => {
  return <div className="content-wrapper">{children}</div>
}
