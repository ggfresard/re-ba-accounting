import 'react-month-picker/css/month-picker.css'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { ContentWrapper } from '../../common/ContentWrapper'
import { ExpenseContext, PartnerContext } from '../../../providers'
import { useForm } from '../../../hooks'
import { Modal } from 'reactstrap'
import { ExpenseForm } from './ExpenseForm'
import { ExpenseDeleteForm } from './ExpenseDeleteForm'

export const Partnership = () => {
  const { partner, fetchPartners } = useContext(PartnerContext)
  const { expenses, fetchExpenses, monthExpenses } = useContext(ExpenseContext)
  const [variableExpenses, setVariableExpenses] = useState<Expense[]>([])
  const [nonVariableExpenses, setNonVariableExpenses] = useState<Expense[]>([])
  const [formValues, setFormValues, handleChange] = useForm<{ month: string }>({
    month: ''
  })
  const [showModalExpenseForm, setShowModalExpenseForm] = useState(false)
  const [showDeleteExpenseModal, setShowDeleteExpenseModal] = useState(false)
  const [targetExpense, setTargetExpense] = useState<Expense>()
  const [isVariable, setIsVariable] = useState(false)

  const onClose = () => {
    fetchExpenses()
  }

  useEffect(() => {
    fetchPartners()
    const date = new Date()

    setFormValues({
      ...formValues,
      month: `${date.getFullYear()}-${date.getMonth() + 1}`
    })
    fetchExpenses()
  }, [])

  useEffect(() => {
    setNonVariableExpenses(monthExpenses(formValues.month, false))
    setVariableExpenses(monthExpenses(formValues.month, true))
  }, [expenses])

  useEffect(() => {
    setNonVariableExpenses(monthExpenses(formValues.month, false))
    setVariableExpenses(monthExpenses(formValues.month, true))
  }, [formValues])

  return (
    <Fragment>
      <Modal
        isOpen={showDeleteExpenseModal}
        onClosed={onClose}
        backdrop={true}
        toggle={() => {
          setShowDeleteExpenseModal(!showDeleteExpenseModal)
        }}
      >
        <div className="modal-header bg-danger">
          <h4 className="modal-title">{`Eliminar gasto`}</h4>
        </div>
        <ExpenseDeleteForm
          expense={targetExpense as Expense}
          onSubmit={() => {
            setShowDeleteExpenseModal(!showDeleteExpenseModal)
          }}
        ></ExpenseDeleteForm>
      </Modal>
      <Modal
        isOpen={showModalExpenseForm}
        onClosed={onClose}
        backdrop
        toggle={() => setShowModalExpenseForm(!showModalExpenseForm)}
      >
        <div className="modal-header">
          <h4 className="modal-title">
            {`${targetExpense ? 'Editar' : 'Ingresar'} gasto`}
          </h4>
        </div>
        <ExpenseForm
          expense={targetExpense}
          isVariable={isVariable}
          onSubmit={() => {
            setShowModalExpenseForm(!showModalExpenseForm)
          }}
        ></ExpenseForm>
      </Modal>

      <ContentWrapper>
        <div className="content-header">
          <div className="container-fluid">
            <div className="col align-content-between">
              <div className="row mb-2 justify-content-between">
                <h1 className="m-0 text-dark">Sociedad</h1>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="month"
                    name="month"
                    id="month"
                    value={formValues.month}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-6">
                <div className="card card-outline card-blue">
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <h3>Gastos fijos</h3>
                      <h4 className="text-danger text-bold">{`${nonVariableExpenses
                        .reduce<number>((acc, exp) => acc + exp.amount, 0)
                        .toLocaleString('en-cl', {
                          style: 'currency',
                          currency: 'CLP'
                        })}`}</h4>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row align-items-center justify-content-between">
                      <button
                        type="button"
                        className="btn bg-gradient-danger btn-sm rounded-circle ml-2"
                        onClick={() => {
                          setIsVariable(false)
                          setTargetExpense(undefined)
                          setShowModalExpenseForm(!showModalExpenseForm)
                        }}
                      >
                        <i className="fa fa-plus" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body table-responsive table-hover pt-0">
                    <table className="table table-striped table-valign-middle">
                      <thead>
                        <tr>
                          <th>Descipción</th>
                          <th>Socio</th>
                          <th>Fecha</th>
                          <th>Pagado</th>
                          <th></th>
                          <th>Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!!nonVariableExpenses.length &&
                          nonVariableExpenses.map((expense) => (
                            <tr
                              className="no-wrap"
                              onClick={() => {
                                setIsVariable(false)
                                setTargetExpense(expense)
                                setShowModalExpenseForm(!showModalExpenseForm)
                              }}
                              style={{ cursor: 'pointer' }}
                              key={expense.id}
                            >
                              <td>{expense.description}</td>
                              <td>
                                {expense.partner &&
                                  `${
                                    partner(expense.partner as number)?.name ??
                                    ''
                                  } ${
                                    partner(expense.partner as number)
                                      ?.last_name ?? ''
                                  }`}
                              </td>
                              <td>{expense.date}</td>
                              <td className="text-danger">
                                {`${expense.amount_paid?.toLocaleString(
                                  'en-cl',
                                  {
                                    style: 'currency',
                                    currency: 'CLP'
                                  }
                                )}`}
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm bg-gradient-danger rounded-circle"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setTargetExpense(expense)
                                    setShowDeleteExpenseModal(
                                      !showDeleteExpenseModal
                                    )
                                  }}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                              <td className="text-danger">
                                {`${expense.amount.toLocaleString('en-cl', {
                                  style: 'currency',
                                  currency: 'CLP'
                                })}`}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="card card-outline card-blue">
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <h3>Gastos variables</h3>
                      <h4 className="text-danger text-bold">{`${variableExpenses
                        .reduce<number>((acc, exp) => acc + exp.amount, 0)
                        .toLocaleString('en-cl', {
                          style: 'currency',
                          currency: 'CLP'
                        })}`}</h4>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row align-items-center justify-content-between">
                      <button
                        type="button"
                        className="btn bg-gradient-danger btn-sm rounded-circle ml-2"
                        onClick={() => {
                          setIsVariable(true)
                          setTargetExpense(undefined)
                          setShowModalExpenseForm(!showModalExpenseForm)
                        }}
                      >
                        <i className="fa fa-plus" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body table-responsive table-hover pt-0">
                    <table className="table table-striped table-valign-middle">
                      <thead>
                        <tr>
                          <th>Descripción</th>
                          <th>Fecha</th>
                          <th></th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!!variableExpenses.length &&
                          variableExpenses.map((expense) => (
                            <tr
                              className="no-wrap"
                              onClick={() => {
                                setIsVariable(true)
                                setTargetExpense(expense)
                                setShowModalExpenseForm(!showModalExpenseForm)
                              }}
                              style={{ cursor: 'pointer' }}
                              key={expense.id}
                            >
                              <td style={{ width: '38%' }}>
                                {expense.description}
                              </td>
                              <td>{expense.date}</td>
                              <td>
                                <button
                                  className="btn btn-sm bg-gradient-danger rounded-circle"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setTargetExpense(expense)
                                    setShowDeleteExpenseModal(
                                      !showDeleteExpenseModal
                                    )
                                  }}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                              <td className="text-danger">
                                {`${expense.amount.toLocaleString('en-cl', {
                                  style: 'currency',
                                  currency: 'CLP'
                                })}`}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </Fragment>
  )
}
