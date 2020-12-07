import React, { Fragment, useContext } from 'react'
import { useForm } from '../../../hooks'
import { ProjectContext } from '../../../providers'
interface Props {
  flow?: Flow
  onSubmit?: () => void
}

export const FlowConfirmForm: React.FC<Props> = ({ flow, onSubmit }) => {
  const [formValues, setFormValues, handleChange] = useForm<{
    receipt_number: string
  }>({ receipt_number: '' })

  const { confirmFlow } = useContext(ProjectContext)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    confirmFlow({
      ...flow,
      receipt_number: formValues.receipt_number
    } as Flow).then(onSubmit)
  }

  return (
    <Fragment>
      <div className="modal-body">
        <form className="form-horizontal" onSubmit={submit}>
          <div className="form-group row">
            <label className="col-3 col-form-label" htmlFor="receipt_number">
              Documento
            </label>
            <div className="col">
              <input
                className="form-control"
                type="text"
                name="receipt_number"
                id="receipt_number"
                onChange={handleChange}
                value={formValues.receipt_number}
              />
            </div>
          </div>
        </form>
      </div>
      <div className={`modal-footer`}>
        <button onClick={submit} className="btn bg-gradient-primary">
          Confirmar
        </button>
      </div>
    </Fragment>
  )
}
