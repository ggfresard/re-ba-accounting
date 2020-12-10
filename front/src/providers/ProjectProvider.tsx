import React, { createContext, useContext, useState } from 'react'
import { async } from 'regenerator-runtime'
import { ErrorContext } from '.'
import apiClient from '../apiClient'
import { Endpoints } from '../types/Endpoints'
import { AuthContext } from './AuthProvider'
import { PartnerContext } from './PartnerProvider'

type ProjectContextInterface = {
  projects: Project[]
  fetchProjects: () => Promise<boolean>
  createProject: (project: Project) => Promise<boolean>
  updateProject: (project: Project) => Promise<boolean>
  projectPartners: (project: Project) => (Partner | undefined)[]
  createFlow: (flow: Flow) => Promise<boolean>
  confirmFlow: (flow: Flow) => Promise<boolean>
  deleteFlow: (flow: Flow) => Promise<boolean>
}

export const ProjectContext = createContext<ProjectContextInterface>(
  {} as ProjectContextInterface
)

const ProjectProvider: React.FC = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([])
  const { addError } = useContext(ErrorContext)
  const { partners } = useContext(PartnerContext)

  const fetchProjects = async () => {
    const result = await apiClient.get(Endpoints.Project)
    result.success ? setProjects(result.data as Project[]) : setProjects([])
    result.error && addError(result.data, result.status)
    return result.success
  }
  const createProject = async (project: Project) => {
    const result = await apiClient.post(Endpoints.Project, {
      body: { ...project }
    })
    result.error && addError(result.data, result.status)
    return result.success
  }
  const updateProject = async (project: Project) => {
    const result = await apiClient.patch(Endpoints.Project, {
      body: project,
      extraRoutes: [project.id?.toString() as string]
    })
    result.error && addError(result.data, result.status)
    return result.success
  }

  const projectPartners = (p: Project) =>
    p.participants.map((participant) =>
      partners.find((par) => par.id === participant.partner)
    )
  const createFlow = async (flow: Flow) => {
    const result = await apiClient.post(Endpoints.Flow, {
      body: flow
    })
    result.error && addError(result.data, result.status)
    return result.success
  }
  const deleteFlow = async (flow: Flow) => {
    const result = await apiClient.delete(Endpoints.Flow, {
      extraRoutes: [flow.id?.toString() as string]
    })
    result.error && addError(result.data, result.status)
    return result.success
  }

  const confirmFlow = async (flow: Flow) => {
    if (!flow.receipt_number) {
      addError('No document number')
      return false
    }
    const result = await apiClient.put(Endpoints.FlowConfirm, {
      body: {
        receipt_number: flow.receipt_number ?? '',
        confirmed: true
      },
      extraRoutes: [flow.id?.toString() as string]
    })
    result.error && addError(result.data, result.status)
    return result.success
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        fetchProjects,
        createProject,
        updateProject,
        projectPartners,
        createFlow,
        confirmFlow,
        deleteFlow
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectProvider
