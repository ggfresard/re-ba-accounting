import React, { createContext, useContext, useState } from 'react'
import { ErrorContext } from '.'
import apiClient from '../apiClient'
import { Endpoints } from '../types/Endpoints'
import { AuthContext } from './AuthProvider'

type PartnerContextInterface = {
  partners: Partner[]
  fetchPartners: () => Promise<boolean>
  createPartner: (partner: Partner) => Promise<boolean>
  updatePartner: (partner: Partner) => Promise<boolean>
  partner: (id: number) => Partner | null
  mainPartner: () => Partner | undefined
}

export const PartnerContext = createContext<PartnerContextInterface>(
  {} as PartnerContextInterface
)

const PartnerProvider: React.FC = ({ children }) => {
  const [partners, setPartners] = useState<Partner[]>([])
  const { addError } = useContext(ErrorContext)
  const { user } = useContext(AuthContext)

  const fetchPartners = async () => {
    const result = await apiClient.get(Endpoints.Partner)
    result.success ? setPartners(result.data as Partner[]) : setPartners([])
    result.error && addError(result.data, result.status)
    return result.success
  }
  const createPartner = async (partner: Partner) => {
    const result = await apiClient.post(Endpoints.Partner, {
      body: { ...partner, owner: user?.id }
    })
    result.error && addError(result.data, result.status)
    return result.success
  }
  const updatePartner = async (partner: Partner) => {
    const result = await apiClient.patch(Endpoints.Partner, {
      body: partner,
      extraRoutes: [partner.id.toString()]
    })
    result.error && addError(result.data, result.status)
    return result.success
  }

  const partner = (id: number) => partners.find((p) => p.id === id) ?? null

  const mainPartner = () => partners.find((p) => p.id == user?.partner.id)

  return (
    <PartnerContext.Provider
      value={{
        partners,
        fetchPartners,
        createPartner,
        updatePartner,
        partner,
        mainPartner
      }}
    >
      {children}
    </PartnerContext.Provider>
  )
}

export default PartnerProvider
