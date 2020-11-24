import React, { Fragment, useContext, useEffect } from 'react'
import { PartnerContext } from '../providers'

export const Partners = () => {
  const { partners, fetchPartners } = useContext(PartnerContext)
  useEffect(() => {
    fetchPartners()
  }, [])
  return (
    <Fragment>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-6">
              <h1 className="m-0 text-dark">Socios</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-8">
              {partners.map((partner) => (
                <div className="card">
                  <div className="card-header">Socio #{partner.id}</div>
                  <div className="card-body">{partner.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="row">
            <div className="col-8 text-center">
              <button
                type="button"
                className="btn bg-gradient-success rounded-circle"
              >
                <i className="fa fa-plus" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
