import axios, { AxiosResponse, AxiosRequestConfig } from "axios"
import URI from "urijs"
import { Endpoints } from './types/Endpoints'
import "core-js/stable";
import "regenerator-runtime/runtime";

const BASE_URL = process.env.REACT_APP_API_URL || 'api/'
const SESSION_TOKEN_NAME = process.env.SESSION_TOKEN_NAME || "auth-token"
const API_TOKEN_NAME = process.env.API_TOKEN_NAME || "x-auth-token"
const TIMEOUT_MILLISECONDS = process.env.TIMEOUT_MILLISECONDS
  ? parseInt(process.env.TIMEOUT_MILLISECONDS)
  : 5000

type ApiResponse = {
  success: boolean
  error?: Error
  data?: any
}

export enum ReqTypes {
  post = "post",
  patch = "patch",
  delete = "delete",
  get = "get"
}

axios.interceptors.request.use(
  function (config) {
    const token = sessionStorage.getItem(SESSION_TOKEN_NAME)
    if (token)
      config.headers = {
        ...config.headers,
        [API_TOKEN_NAME]: token
      }
    if (!config.timeout) config.timeout = TIMEOUT_MILLISECONDS
    return config
  },
  function (error) {
    console.log("API REQUEST ERROR")
    console.error(error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    console.log("API RESPONSE ERROR")
    const errorData = error.response?.data || error
    console.error(errorData)
    return Promise.reject(errorData)
  }
)

const apiRequest = async (
  endpoint: Endpoints,
  type: ReqTypes,
  options?: { body?: Object; queryParams?: Object; config?: AxiosRequestConfig }
): Promise<ApiResponse> => {
  const url = new URI(BASE_URL + endpoint)
  if (options?.queryParams) url.addSearch(options.queryParams)
  var response: AxiosResponse<any> | undefined
  try {
    switch (type) {
      case ReqTypes.get:
        response = await axios.get(url.toString(), options?.config)
        break
      case ReqTypes.delete:
        response = await axios.delete(url.toString(), {
          ...options?.config,
          data: options?.body
        })
        break
      case ReqTypes.post:
        response = await axios.post(
          url.toString(),
          { ...options?.body },
          options?.config
        )
        break
      case ReqTypes.patch:
        response = await axios.patch(
          url.toString(),
          { ...options?.body },
          options?.config
        )
        break
    }
    return {
      success: true,
      data: response?.data
    }
  } catch (e) {
    return {
      success: false,
      error: e,
      data: response ? response.data : "No connection"
    }
  }
}

const apiClient = {
  post: async (
    endpoint: Endpoints,
    options?: {
      body?: Object
      queryParams?: Object
      config?: AxiosRequestConfig
    }
  ): Promise<ApiResponse> => apiRequest(endpoint, ReqTypes.post, options),
  delete: async (
    endpoint: Endpoints,
    options?: {
      body?: Object
      queryParams?: Object
      config?: AxiosRequestConfig
    }
  ): Promise<ApiResponse> => apiRequest(endpoint, ReqTypes.delete, options),
  get: async (
    endpoint: Endpoints,
    options?: {
      body?: Object
      queryParams?: Object
      config?: AxiosRequestConfig
    }
  ): Promise<ApiResponse> => apiRequest(endpoint, ReqTypes.get, options),
  patch: async (
    endpoint: Endpoints,
    options?: {
      body?: Object
      queryParams?: Object
      config?: AxiosRequestConfig
    }
  ): Promise<ApiResponse> => apiRequest(endpoint, ReqTypes.patch, options)
}

export default apiClient
