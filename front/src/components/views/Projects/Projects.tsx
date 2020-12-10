import React, { Fragment, useContext, useEffect, useState } from 'react'
import { ProjectForm } from './ProjectForm'
import { Button, Modal } from 'reactstrap'
import { ContentWrapper } from '../../common/ContentWrapper'
import { ProjectContext } from '../../../providers/ProjectProvider'
import { FlowForm } from './FlowForm'
import { PartnerContext } from '../../../providers'
import { FlowConfirmForm } from './FlowConfirmForm'
import { Collapse } from 'reactstrap'
import { FlowDeleteForm } from './FlowDeleteForm'

export const Projects = () => {
  const { projects, fetchProjects, confirmFlow } = useContext(ProjectContext)
  const { partner, fetchPartners } = useContext(PartnerContext)
  const [showModalProjectForm, setShowModalProjectForm] = useState(false)
  const [showModalFlowForm, setShowModalFlowForm] = useState(false)
  const [showModalFlowConfirmForm, setShowModaFlowConfirmForm] = useState(false)
  const [
    showModalFlowDeleteConfirmForm,
    setShowModaDeleteFlowConfirmForm
  ] = useState(false)
  const [targetProject, setTargetProject] = useState<Project>()
  const [targetFlow, setTargetFlow] = useState<Flow>()
  const [positiveFlow, setPositiveFlow] = useState<boolean>(true)
  const [projectOpen, setProjectOpen] = useState<number>()

  useEffect(() => {
    fetchPartners()
    fetchProjects()
  }, [])

  const onClose = () => {
    fetchProjects()
  }
  const toggleProjectFormModal = () => {
    setShowModalProjectForm(!showModalProjectForm)
  }

  const toggleFlowFormModal = () => {
    setShowModalFlowForm(!showModalFlowForm)
  }

  const toggleFlowConfirmFormModal = () => {
    setShowModaFlowConfirmForm(!showModalFlowConfirmForm)
  }

  const toggleFlowDeleteConfirmModal = () => {
    setShowModaDeleteFlowConfirmForm(!showModalFlowDeleteConfirmForm)
  }

  return (
    <ContentWrapper>
      <Modal
        isOpen={showModalFlowDeleteConfirmForm}
        onClosed={onClose}
        backdrop={true}
        toggle={() => {
          setShowModaDeleteFlowConfirmForm(!showModalFlowDeleteConfirmForm)
        }}
      >
        <div className="modal-header bg-danger">
          <h4 className="modal-title">
            {`Eliminar ${
              (targetFlow?.amount as number) > 0 ? 'ingreso' : 'gasto'
            }`}
          </h4>
        </div>
        <FlowDeleteForm
          flow={targetFlow as Flow}
          onSubmit={toggleFlowDeleteConfirmModal}
        ></FlowDeleteForm>
      </Modal>
      <Modal
        isOpen={showModalProjectForm}
        onClosed={onClose}
        backdrop={true}
        toggle={() => {
          setShowModalProjectForm(!showModalProjectForm)
        }}
        className="modal-lg"
      >
        <div className="modal-header">
          <h4 className="modal-title">
            {targetProject ? 'Editar Proyecto' : 'Crear Proyecto'}
          </h4>
        </div>
        <ProjectForm
          type="modal"
          onSubmit={toggleProjectFormModal}
          project={targetProject}
        />
      </Modal>
      <Modal
        isOpen={showModalFlowForm}
        onClosed={onClose}
        backdrop={true}
        toggle={() => {
          setShowModalFlowForm(!showModalFlowForm)
        }}
      >
        <div
          className={`modal-header bg-${positiveFlow ? 'success' : 'danger'}`}
        >
          <h4 className="modal-title">
            {positiveFlow ? 'Nuevo ingreso' : 'Nuevo egreso'}
          </h4>
        </div>
        <FlowForm
          onSubmit={toggleFlowFormModal}
          project={targetProject}
          positive={positiveFlow}
        />
      </Modal>
      <Modal
        isOpen={showModalFlowConfirmForm}
        onClosed={onClose}
        backdrop={true}
        toggle={() => {
          setShowModaFlowConfirmForm(!setShowModaFlowConfirmForm)
        }}
      >
        <div className={`modal-header `}>
          <h4 className="modal-title">Confirmar egreso</h4>
        </div>
        <FlowConfirmForm
          onSubmit={toggleFlowConfirmFormModal}
          flow={targetFlow}
        />
      </Modal>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2 justify-content-between align-items-center">
            <div className="col">
              <h1 className="m-0 text-dark">Proyectos</h1>
            </div>
            <button
              type="button"
              className="btn bg-gradient-success rounded-circle mr-3 mt-2"
              data-toggle="modal"
              data-target="#newProject"
              onClick={() => {
                setTargetProject(undefined)
                toggleProjectFormModal()
              }}
            >
              <i className="fa fa-plus" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm">
              {!!projects.length
                ? projects.map((project) => {
                    const actualAmount = project.flows?.length
                      ? project.flows.reduce<number>(
                          (acc, flow) =>
                            acc +
                            ((flow.amount < 0 && flow.confirmed) ||
                            flow.amount > 0
                              ? flow.amount
                              : 0),
                          0
                        )
                      : 0
                    return (
                      <div
                        className="card card-primary card-outline"
                        key={project.id}
                      >
                        <a
                          data-toggle="collapse"
                          href={`#flow-table-${project.id}`}
                          role="button"
                          aria-expanded="false"
                          aria-controls={`flow-table-${project.id}`}
                          style={{
                            textDecoration: 'inherit',
                            color: 'inherit'
                          }}
                        >
                          <div
                            className="card-header border-0 pb-0"
                            onClick={() => {
                              setProjectOpen(
                                project.id === projectOpen ? 0 : project.id
                              )
                            }}
                            style={{ cursor: 'pointer', transition: 'all 1' }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <h3>{`${project.name}`}</h3>
                              <h4 className="text-success text-bold">{`${project.total_amount.toLocaleString(
                                'en-cl',
                                { style: 'currency', currency: 'CLP' }
                              )}`}</h4>
                            </div>
                          </div>
                        </a>
                        <div className="card-body pt-0">
                          <div className="row">
                            <div className="col">
                              <button
                                type="button"
                                className="btn bg-gradient-success btn-sm rounded-circle mr-2"
                                onClick={() => {
                                  setShowModalFlowForm(true)
                                  setTargetProject(project)
                                  setPositiveFlow(true)
                                }}
                              >
                                <i
                                  className="fa fa-plus"
                                  aria-hidden="true"
                                ></i>
                              </button>
                              <button
                                type="button"
                                className="btn bg-gradient-danger btn-sm rounded-circle"
                                onClick={() => {
                                  setShowModalFlowForm(true)
                                  setTargetProject(project)
                                  setPositiveFlow(false)
                                }}
                              >
                                <i
                                  className="fa fa-minus"
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </div>
                            <h5
                              className={
                                actualAmount > 0
                                  ? 'text-success'
                                  : 'text-danger'
                              }
                            >
                              <i
                                className={`mr-1 fa fa-arrow-${
                                  actualAmount > 0 ? 'up' : 'down'
                                }`}
                              ></i>
                              {actualAmount.toLocaleString('en-cl', {
                                style: 'currency',
                                currency: 'CLP'
                              })}
                            </h5>
                          </div>
                        </div>
                        <div
                          className="collapse"
                          id={`flow-table-${project.id}`}
                        >
                          <div className="card-body table-responsive table-hover p-0">
                            <table className="table table-striped table-valign-middle">
                              <tbody>
                                {!!project.flows?.length &&
                                  project.flows.map((flow) => (
                                    <tr className="no-wrap" key={flow.id}>
                                      <td style={{ width: '38%' }}>
                                        {flow.description}
                                      </td>
                                      <td>{flow.date}</td>
                                      <td>
                                        {flow.amount < 0 &&
                                          `${
                                            partner(flow.partner as number)
                                              ?.name
                                          } ${
                                            partner(flow.partner as number)
                                              ?.last_name
                                          }`}
                                      </td>
                                      <td>
                                        {flow.amount < 0 &&
                                          (flow.confirmed ? (
                                            <span className="text-success">
                                              Confirmado
                                            </span>
                                          ) : (
                                            <button
                                              className="btn btn-sm btn-primary"
                                              onClick={() => {
                                                setTargetFlow(flow)
                                                toggleFlowConfirmFormModal()
                                              }}
                                            >
                                              Confirmar
                                            </button>
                                          ))}
                                      </td>
                                      <td>
                                        {(flow.amount > 0 ||
                                          !flow.confirmed) && (
                                          <button
                                            className="btn btn-sm bg-gradient-danger rounded-circle"
                                            onClick={() => {
                                              setTargetFlow(flow)
                                              toggleFlowDeleteConfirmModal()
                                            }}
                                          >
                                            <i
                                              className="fa fa-trash"
                                              aria-hidden="true"
                                            ></i>
                                          </button>
                                        )}
                                      </td>
                                      <td style={{ width: '15%' }}>
                                        {flow.amount > 0 ? (
                                          <span className="text-success">
                                            <i className="fa fa-arrow-up mr-1"></i>
                                            {`${flow.amount.toLocaleString(
                                              'en-cl',
                                              {
                                                style: 'currency',
                                                currency: 'CLP'
                                              }
                                            )}`}
                                          </span>
                                        ) : (
                                          <span className="text-danger">
                                            <i className="fa fa-arrow-down mr-1"></i>
                                            {`${flow.amount.toLocaleString(
                                              'en-cl',
                                              {
                                                style: 'currency',
                                                currency: 'CLP'
                                              }
                                            )}`}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="card-footer">
                          <button
                            type="button"
                            className="btn bg-gradient-primary rounded-circle  float-right"
                            data-toggle="modal"
                            data-target="#newProject"
                            onClick={() => {
                              setTargetProject(project)
                              toggleProjectFormModal()
                            }}
                          >
                            <i className="fa fa-pen" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    )
                  })
                : 'No hay datos'}
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  )
}
