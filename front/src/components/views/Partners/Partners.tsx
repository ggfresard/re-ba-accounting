import React, { Fragment, useContext, useEffect, useState } from 'react'
import { PartnerForm } from './PartnerForm'
import { Modal } from 'reactstrap'
import {
  AuthContext,
  ExpenseContext,
  PartnerContext,
  ProjectContext
} from '../../../providers'
import { ContentWrapper } from '../../common/ContentWrapper'
import { PartnerCard } from './PartnerCard'
import { Loading } from '../../common/Loading'

export const Partners = () => {
  const { user } = useContext(AuthContext)
  const { partners, fetchPartners } = useContext(PartnerContext)
  const { fetchProjects } = useContext(ProjectContext)
  const { fetchExpenses } = useContext(ExpenseContext)
  const [showModal, setShowModal] = useState(false)
  const [targetPartner, setPartner] = useState<Partner>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const init = async () => {
      await fetchPartners()
      await fetchProjects()
      await fetchExpenses()
    }
    init().finally(() => setLoading(false))
  }, [])

  const onClose = () => {
    fetchPartners()
  }
  const toggleModal = () => {
    setShowModal(!showModal)
  }

  return (
    <ContentWrapper>
      {loading ? (
        <Loading />
      ) : (
        <Fragment>
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
                        key={partner.id}
                        partnershipPartner
                      ></PartnerCard>
                    ))}
                  {partners.length
                    ? partners
                        .filter(
                          (p) =>
                            p.id !== ((user?.partner as Partner)?.id as number)
                        )
                        .map((partner) => (
                          <PartnerCard
                            partner={partner}
                            editClick={() => {
                              setPartner(partner)
                              toggleModal()
                            }}
                            cardClasses={['card-primary']}
                            key={partner.id}
                            partnershipPartner={false}
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
        </Fragment>
      )}
    </ContentWrapper>
  )
}
