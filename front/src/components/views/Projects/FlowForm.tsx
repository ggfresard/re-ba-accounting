import React, { Fragment, useContext, useEffect } from 'react'
import { useForm } from '../../../hooks'
import DatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
registerLocale('es', es)

import 'react-datepicker/dist/react-datepicker.css'
import { PartnerContext, ProjectContext } from '../../../providers'

interface Props {
  project?: Project
  onSubmit?: () => void
  positive: boolean
}

interface FormValues {
  description: string
  partner?: string
  amount: string
  date: Date
}

const initialValues: FormValues = {
  description: '',
  amount: '0',
  date: new Date()
}

export const FlowForm: React.FC<Props> = ({ project, onSubmit, positive }) => {
  const [formValues, setFormValues, handleChange] = useForm<FormValues>({
    ...initialValues
  })

  const { fetchPartners } = useContext(PartnerContext)
  const { projectPartners, createFlow } = useContext(ProjectContext)

  const submit = () => {
    createFlow({
      ...{
        ...formValues,
        partner: formValues.partner ? parseInt(formValues.partner) : undefined,
        date: formValues.date.toISOString().split('T')[0],
        amount: positive
          ? parseInt(formValues.amount)
          : -parseInt(formValues.amount)
      },
      project: project?.id as number,
      confirmed: false
    }).then(onSubmit)
  }

  useEffect(() => {
    fetchPartners()
  }, [])
  return (
    <Fragment>
      <div className="modal-body">
        <form className="form-horizontal">
          <div className="form-group row">
            <label className="col-3 col-form-label" htmlFor="description">
              Descripción
            </label>
            <div className="col">
              <input
                className="form-control"
                type="text"
                name="description"
                id="description"
                onChange={handleChange}
                value={formValues.description}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-3 col-form-label" htmlFor="description">
              Fecha
            </label>
            <div className="col ">
              <DatePicker
                className="form-control"
                locale="es"
                onChange={(v) =>
                  setFormValues({
                    ...formValues,
                    date: v as Date
                  })
                }
                selected={formValues.date}
              ></DatePicker>
            </div>
          </div>
          {!positive && (
            <div className="form-group row">
              <label htmlFor="participant" className="col-3 col-form-label">
                Socio
              </label>
              <div className="col">
                <select
                  name="partner"
                  id="partner"
                  className="form-control"
                  onChange={handleChange}
                >
                  <option value="">Seleccionar socio</option>
                  {projectPartners(project as Project).map((partner) => (
                    <option key={partner?.id} value={partner?.id}>
                      {`${partner?.name ?? ''} ${partner?.last_name ?? ''}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <div className="form-group row">
            <label htmlFor="total" className="col-3 col-form-label">
              Total
            </label>
            <div className="col">
              <input
                className="form-control"
                type="number"
                name="amount"
                id="amount"
                onChange={handleChange}
                value={formValues.amount}
              />
            </div>
          </div>
        </form>
      </div>
      <div className={`modal-footer`}>
        <button onClick={submit} className="btn bg-gradient-primary">
          Guardar
        </button>
      </div>
    </Fragment>
  )
}
