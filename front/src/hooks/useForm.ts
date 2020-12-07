import {
  useState,
  ChangeEvent,
  SetStateAction,
  Dispatch,
  ReactNode
} from "react"
import { is } from "../utils/legab"

export const useForm = <T extends Object>(
  initialValue: T
): [
    T,
    Dispatch<SetStateAction<T>>,
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
    (e: ChangeEvent<{ name?: string; value: unknown }>, child: ReactNode) => void
  ] => {
  const [values, setValues] = useState<T>(initialValue)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    checked?: boolean
  ) => {
    const value = is(checked) ? checked : e.target.value
    setValues({
      ...values,
      [e.target.id]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
    })
  }

  const handleChangeSelect = (
    e: ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    setValues({
      ...values,
      [name ? name : e.target.name as string]: e.target.value
    })
  }

  return [values, setValues, handleChange, handleChangeSelect]
}
