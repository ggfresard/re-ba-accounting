import React, { createContext, useContext, useState } from 'react'
import { ErrorContext } from '.'
import apiClient from '../apiClient'
import { Endpoints } from '../types/Endpoints'
import { AuthContext } from './AuthProvider'

type ExpenseContextInterface = {
  expenses: Expense[]
  fetchExpenses: () => Promise<boolean>
  createExpense: (expense: Expense) => Promise<boolean>
  updateExpense: (expense: Expense) => Promise<boolean>
  expense: (id: number) => Expense | null
  monthExpenses: (date: string, variable: boolean) => Expense[]
}

export const ExpenseContext = createContext<ExpenseContextInterface>(
  {} as ExpenseContextInterface
)

const ExpenseProvider: React.FC = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const { addError } = useContext(ErrorContext)
  const { user } = useContext(AuthContext)

  const fetchExpenses = async () => {
    const result = await apiClient.get(Endpoints.Expense)
    result.success && setExpenses(result.data as Expense[])
    result.error && addError(result.data, result.status)
    return result.success
  }
  const createExpense = async (expense: Expense) => {
    const result = await apiClient.post(Endpoints.Expense, {
      body: { ...expense, owner: user?.id }
    })
    result.error && addError(result.data, result.status)
    return result.success
  }
  const updateExpense = async (expense: Expense) => {
    console.log(expense)
    const result = await apiClient.patch(Endpoints.Expense, {
      body: expense,
      extraRoutes: [expense.id ? expense.id.toString() : '']
    })
    result.error && addError(result.data, result.status)
    return result.success
  }

  const expense = (id: number) => expenses.find((p) => p.id === id) ?? null

  const monthExpenses = (date: string, variable: boolean) => {
    const dateSplit = date.split('-')
    return expenses.filter((e) => {
      const expenseDateSplit = e.date.split('-')
      console.log()
      return (
        variable === e.is_variable &&
        dateSplit[0] === expenseDateSplit[0] &&
        dateSplit[1] === expenseDateSplit[1]
      )
    })
  }

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        fetchExpenses,
        createExpense,
        updateExpense,
        expense,
        monthExpenses
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

export default ExpenseProvider
