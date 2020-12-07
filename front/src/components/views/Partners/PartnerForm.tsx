import React, { Fragment, useContext, useEffect } from 'react'
import { useForm } from '../../../hooks'
import { PartnerContext } from '../../../providers'
import { adaptObject } from '../../../utils/legab'

interface Props {
  partner?: Partner
  type: 'modal' | 'card'
  onSubmit?: () => void
}

interface FormValues {
  name: string
  last_name: string
  rut: string
}

const initialValues: FormValues = {
  name: '',
  last_name: '',
  rut: ''
}

export const PartnerForm: React.FC<Props> = ({ partner, type, onSubmit }) => {
  const [formValues, setFormValues, handleChange] = useForm<FormValues>(
    partner
      ? { name: partner.name, last_name: partner.last_name, rut: partner.rut }
      : initialValues
  )

  const { createPartner, updatePartner } = useContext(PartnerContext)

  const submit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault()
    partner
      ? updatePartner({ ...formValues, id: partner.id }).then(onSubmit)
      : createPartner(formValues as Partner).then(onSubmit)
  }

  useEffect(() => {
    setFormValues(
      partner
        ? (adaptObject(partner, initialValues, '') as FormValues)
        : initialValues
    )
  }, [partner])

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
            <label htmlFor="name" className="col-sm col-form-label">
              Apellido
            </label>
            <div className="col-sm-10">
              <input
                className="form-control"
                type="text"
                name="last_name"
                id="last_name"
                onChange={handleChange}
                value={formValues.last_name}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="name" className="col-sm col-form-label">
              Rut
            </label>
            <div className="col-sm-10">
              <input
                className="form-control"
                type="text"
                name="rut"
                id="rut"
                onChange={handleChange}
                value={formValues.rut}
              />
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
