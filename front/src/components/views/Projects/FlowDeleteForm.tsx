import React, { Fragment, useContext } from 'react'
import { ProjectContext } from '../../../providers'

interface Props {
  flow: Flow
  onSubmit: () => void
}

export const FlowDeleteForm: React.FC<Props> = ({ flow, onSubmit }) => {
  const { deleteFlow } = useContext(ProjectContext)

  const submit = async () => {
    deleteFlow(flow).then(onSubmit)
  }
  return (
    <Fragment>
      <div className="modal-body">
        {`¿Seguro que deseas eliminar este ${
          flow.amount > 0 ? 'ingreso' : 'gasto'
        }?`}
      </div>
      <div className={`modal-footer`}>
        <button onClick={submit} className="btn">
          Cancelar
        </button>
        <button onClick={submit} className="btn bg-gradient-danger">
          Eliminar
        </button>
      </div>
    </Fragment>
  )
}
