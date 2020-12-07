interface Expense {
    id?: number
    is_variable?: boolean
    description: string
    partner?: number | Partner
    amount: number
    date: string
    amount_paid?: number
}