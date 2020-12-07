import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useForm } from '../../../hooks'
import { PartnerContext } from '../../../providers'
import { ProjectContext } from '../../../providers/ProjectProvider'

interface Props {
  project?: Project
  type: 'modal' | 'card'
  onSubmit?: () => void
}

interface FormValues {
  name: string
  client: string
  total_amount: number
  percentage: string
  partner: string
}

const initialValues: FormValues = {
  name: '',
  client: '',
  total_amount: 0,
  percentage: '0',
  partner: ''
}

export const ProjectForm: React.FC<Props> = ({ project, type, onSubmit }) => {
  const [formValues, setFormValues, handleChange] = useForm<FormValues>(
    project
      ? {
          ...initialValues,
          name: project.name,
          client: project.client ?? '',
          total_amount: project.total_amount
        }
      : initialValues
  )

  const { createProject, updateProject } = useContext(ProjectContext)
  const { partners, fetchPartners, partner } = useContext(PartnerContext)
  const [participants, setParticipants] = useState<
    {
      partner: number
      participation: number
    }[]
  >(
    [] as {
      partner: number
      participation: number
    }[]
  )

  const submit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) => {
    e.preventDefault()

    const respose = await (project
      ? updateProject({
          ...formValues,
          participants: participants.map((p) => {
            return {
              partner: p.partner,
              participation: p.participation
            }
          }),
          id: project.id
        } as Project)
      : createProject({
          ...formValues,
          participants: participants.map((p) => {
            return {
              partner: p.partner,
              participation: p.participation
            }
          })
        } as Project))
    respose && onSubmit && onSubmit()
  }

  useEffect(() => {
    fetchPartners().then(() => {
      setFormValues(
        project
          ? {
              ...initialValues,
              name: project.name,
              client: project.client ?? '',
              total_amount: project.total_amount
            }
          : initialValues
      )

      project && setParticipants(project.participants)
    })
  }, [project])

  useEffect(() => {
    fetchPartners()
  }, [])

  return (
    <Fragment>
      <div className={`${type}-body`}>
        <form className="form-horizontal">
          <div className="form-group row">
            <label htmlFor="name" className="col-sm col-form-label">
              Nombre
            </label>
            <div className="col-sm-10">
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                onChange={handleChange}
                value={formValues.name}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="client" className="col-sm col-form-label">
              Cliente
            </label>
            <div className="col-sm-10">
              <input
                className="form-control"
                type="text"
                name="client"
                id="client"
                onChange={handleChange}
                value={formValues.client}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="total" className="col-sm col-form-label">
              Total
            </label>
            <div className="col-sm-10">
              <input
                className="form-control"
                type="number"
                name="total_amount"
                id="total_amount"
                onChange={handleChange}
                value={formValues.total_amount}
              />
            </div>
          </div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Socio</th>
                <th>Participación</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!!participants.length &&
                participants.map((participant) => {
                  const p = partner(participant.partner) as Partner
                  return (
                    <tr key={p.id}>
                      <td>{`${p.name ?? ''} ${p.last_name ?? ''}`}</td>
                      <td>{`${participant.participation}%`}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn bg-gradient-danger btn-sm rounded-circle"
                          onClick={() => {
                            setParticipants(
                              participants.filter((par) => par.partner !== p.id)
                            )
                          }}
                        >
                          <i className="fa fa-minus" aria-hidden="true"></i>
                        </button>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
          {!!participants.length && (
            <div className="row">
              <div className="col-6"></div>
              <div className="col-6">
                <div className="form-group row">
                  <div className="col-6 text-right">
                    <label htmlFor="totalDisplay">Total</label>
                  </div>
                  <div className="col-6 text-right text-emphasized">
                    <div id="totalDisplay">
                      {participants.reduce<number>(
                        (acc, curr) => acc + curr.participation,
                        0
                      )}
                      %
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-8">
              <div className="form-group row">
                <label htmlFor="participant" className="col-sm col-form-label">
                  Agregar participante
                </label>
                <div className="col-8">
                  <select
                    name="partner"
                    id="partner"
                    className="form-control"
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar socio</option>
                    {partners
                      .filter((p) =>
                        participants.reduce<boolean>(
                          (acc, participant) =>
                            !acc
                              ? acc
                              : participant.partner === p.id
                              ? false
                              : acc,
                          true
                        )
                      )
                      .map((partner) => (
                        <option key={partner.id} value={partner.id}>
                          {`${partner.name ?? ''} ${partner.last_name ?? ''}`}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="form-group row">
                <div className="col-10">
                  <input
                    className="form-control"
                    type="number"
                    name="percentage"
                    id="percentage"
                    max="100"
                    min="0"
                    onChange={handleChange}
                    value={formValues.percentage}
                  />
                </div>
                <label htmlFor="percentage" className="col-sm col-form-label">
                  %
                </label>
              </div>
            </div>
            <div className="col-1 text-center">
              <button
                type="button"
                className="btn bg-gradient-success rounded-circle"
                onClick={() => {
                  formValues.partner &&
                    setParticipants([
                      ...participants,
                      {
                        partner: parseInt(formValues.partner),
                        participation: parseInt(formValues.percentage)
                      }
                    ])
                  setFormValues({ ...formValues, partner: '' })
                }}
              >
                <i className="fa fa-plus" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className={`${type}-footer`}>
        <button onClick={submit} className="btn bg-gradient-success">
          Guardar
        </button>
      </div>
    </Fragment>
  )
}
