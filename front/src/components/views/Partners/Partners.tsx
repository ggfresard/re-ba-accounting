import React, { Fragment, useContext, useEffect, useState } from 'react'
import { PartnerForm } from './PartnerForm'
import { Modal } from 'reactstrap'
import { AuthContext, AuthProvider, PartnerContext } from '../../../providers'
import { ContentWrapper } from '../../common/ContentWrapper'
import { PartnerCard } from './PartnerCard'

export const Partners = () => {
  const { user } = useContext(AuthContext)
  const { partners, fetchPartners } = useContext(PartnerContext)
  const [showModal, setShowModal] = useState(false)
  const [targetPartner, setPartner] = useState<Partner>()

  useEffect(() => {
    fetchPartners()
  }, [])

  const onClose = () => {
    fetchPartners()
  }
  const toggleModal = () => {
    setShowModal(!showModal)
  }

  return (
    <ContentWrapper>
      <Modal
        isOpen={showModal}
        onClosed={onClose}
        backdrop={true}
        toggle={() => {
          setShowModal(!showModal)
        }}
      >
        <div className="modal-header">
          <h4 className="modal-title">
            {targetPartner ? 'Editar Socio' : 'Crear Socio'}
          </h4>
        </div>
        <PartnerForm
          type="modal"
          onSubmit={toggleModal}
          partner={targetPartner}
        />
      </Modal>
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
            <div className="col-sm">
              {partners
                .filter(
                  (p) => p.id === ((user?.partner as Partner)?.id as number)
                )
                .map((partner) => (
                  <PartnerCard
                    partner={partner}
                    editClick={() => {
                      setPartner(partner)
                      toggleModal()
                    }}
                    cardClasses={['card-success']}
                  ></PartnerCard>
                ))}
              {partners.length
                ? partners
                    .filter(
                      (p) => p.id !== ((user?.partner as Partner)?.id as number)
                    )
                    .map((partner) => (
                      <PartnerCard
                        partner={partner}
                        editClick={() => {
                          setPartner(partner)
                          toggleModal()
                        }}
                        cardClasses={['card-primary']}
                      ></PartnerCard>
                    ))
                : 'No hay datos'}
            </div>
          </div>
          <div className="row">
            <div className="col-sm text-center mb-5">
              <button
                type="button"
                className="btn bg-gradient-success rounded-circle"
                data-toggle="modal"
                data-target="#newPartner"
                onClick={() => {
                  setPartner(undefined)
                  toggleModal()
                }}
              >
                <i className="fa fa-plus" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  )
}
