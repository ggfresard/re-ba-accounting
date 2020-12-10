import React, { Fragment, useContext } from 'react'
import { ExpenseContext } from '../../../providers'

interface Props {
  expense: Expense
  onSubmit: () => void
}

export const ExpenseDeleteForm: React.FC<Props> = ({ expense, onSubmit }) => {
  const { deleteExpense } = useContext(ExpenseContext)

  const submit = async () => {
    deleteExpense(expense).then(onSubmit)
  }
  return (
    <Fragment>
      <div className="modal-body">
        {`¿Seguro que deseas eliminar este gasto?`}
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
