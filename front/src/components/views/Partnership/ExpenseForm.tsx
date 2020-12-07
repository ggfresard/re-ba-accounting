import React, { Fragment, useContext, useEffect } from 'react'
import es from 'date-fns/locale/es'
import DatePicker, { registerLocale } from 'react-datepicker'
registerLocale('es', es)

import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from '../../../hooks'
import { ExpenseContext, PartnerContext } from '../../../providers'

interface Props {
  expense?: Expense
  onSubmit?: () => void
  isVariable?: boolean
}

interface FormValues {
  description: string
  date: Date
  partner?: string
  amount: string
  amount_paid?: string
}

const initialValues: FormValues = {
  description: '',
  date: new Date(),
  amount: '0',
  amount_paid: '0'
}

export const ExpenseForm: React.FC<Props> = ({
  expense,
  onSubmit,
  isVariable
}) => {
  const { createExpense, updateExpense } = useContext(ExpenseContext)
  const { fetchPartners, partners, mainPartner } = useContext(PartnerContext)
  const [formValues, setFormValues, handleChange] = useForm<FormValues>({
    ...initialValues,
    partner: mainPartner()?.id.toString()
  })

  const submit = () => {
    const body = expense
      ? {
          ...expense,
          partner: expense.is_variable
            ? undefined
            : formValues.partner
            ? parseInt(formValues.partner)
            : undefined,
          date: formValues.date.toISOString().split('T')[0],
          description: formValues.description,
          amount: parseInt(formValues.amount),
          amount_paid: expense.is_variable
            ? undefined
            : parseInt(formValues.amount_paid as string)
        }
      : {
          is_variable: isVariable,
          description: formValues.description,
          partner: isVariable
            ? undefined
            : formValues.partner
            ? parseInt(formValues.partner)
            : undefined,
          date: formValues.date.toISOString().split('T')[0],
          amount: parseInt(formValues.amount),
          amount_paid: isVariable
            ? undefined
            : parseInt(formValues.amount_paid as string)
        }
    expense
      ? updateExpense(body).then(onSubmit)
      : createExpense(body).then(onSubmit)
  }
  useEffect(() => {
    fetchPartners()
    setFormValues({ ...formValues, partner: mainPartner()?.id.toString() })
  }, [])

  useEffect(() => {
    setFormValues({ ...formValues, partner: mainPartner()?.id.toString() })
  }, [isVariable])

  useEffect(() => {
    if (expense) {
      const date = new Date(expense.date)
      date.setHours(date.getHours() + 6)
      setFormValues({
        partner: expense.partner?.toString(),
        date,
        description: expense.description,
        amount: expense.amount.toString(),
        amount_paid: expense.is_variable
          ? undefined
          : expense.amount_paid?.toString()
      })
    } else {
      setFormValues({ ...initialValues, partner: mainPartner()?.id.toString() })
    }
  }, [expense])

  return (
    <Fragment>
      <div className="modal-body">
        <form className="form-horizontal">
          <div className="form-group row">
            <label htmlFor="description" className="col-sm-3 col-form-label">
              Descripción
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                name="description"
                id="description"
                onChange={handleChange}
                value={formValues.description}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="amount" className="col-sm-3 col-form-label">
              Total
            </label>
            <div className="col-sm-9">
              <input
                type="number"
                min="0"
                className="form-control"
                name="amount"
                id="amount"
                onChange={handleChange}
                value={formValues.amount}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label" htmlFor="description">
              Fecha
            </label>
            <div className="col-sm-9 ">
              <DatePicker
                dateFormat="yyyy/MM/dd"
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
          {((expense && !expense.is_variable) || !isVariable) && (
            <Fragment>
              <div className="form-group row">
                <label
                  htmlFor="amount_paid"
                  className="col-sm-3 col-form-label"
                >
                  Pagado
                </label>
                <div className="col-sm-9">
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    name="amount_paid"
                    id="amount_paid"
                    onChange={handleChange}
                    value={formValues.amount_paid}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="partner" className="col-3 col-form-label">
                  Socio
                </label>
                <div className="col">
                  <select
                    name="partner"
                    id="partner"
                    className="form-control"
                    onChange={handleChange}
                    value={formValues.partner}
                  >
                    <option value="">Seleccionar socio</option>
                    {partners.map((partner) => (
                      <option key={partner?.id} value={partner?.id}>
                        {`${partner?.name ?? ''} ${partner?.last_name ?? ''}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Fragment>
          )}
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
