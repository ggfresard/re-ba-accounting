import React, { createContext, useState } from 'react'
import apiClient from '../apiClient'
import { Endpoints } from '../types/Endpoints'

type PartnerContextInterface = {
  partners: Partner[]
  fetchPartners: () => Promise<boolean>
  createPartner: (driver: Partner) => Promise<boolean>
}

export const PartnerContext = createContext<PartnerContextInterface>(
  {} as PartnerContextInterface
)

const PartnerProvider: React.FC = ({ children }) => {
  const [partners, setPartners] = useState<Partner[]>([])

  const fetchPartners = async () => {
    const result = await apiClient.get(Endpoints.Partner)
    result.success ? setPartners(result.data as Partner[]) : setPartners([])
    return result.success
  }
  const createPartner = async (partner: Partner) => {
    const result = await apiClient.post(Endpoints.Partner, {
      body: partner
    })
    return result.success
  }

  return (
    <PartnerContext.Provider
      value={{
        partners,
        fetchPartners,
        createPartner
      }}
    >
      {children}
    </PartnerContext.Provider>
  )
}

export default PartnerProvider
