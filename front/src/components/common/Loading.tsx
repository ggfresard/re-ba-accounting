import React from 'react'
import { Spinner } from 'reactstrap'

export const Loading = () => {
  return (
    <div className="col align-items-center text-center pt-3">
      <Spinner color="secondary"></Spinner>
    </div>
  )
}
