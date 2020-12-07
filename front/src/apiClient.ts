import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios"
import URI from "urijs"
import { Endpoints } from './types/Endpoints'
import "core-js/stable";
import "regenerator-runtime/runtime";
import { getCookie } from './utils/getCookie'

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
  status?: number
}

export enum ReqTypes {
  post = "post",
  patch = "patch",
  delete = "delete",
  get = "get",
  put = "put"
}


interface Options {
  body?: Object | null; queryParams?: Object; config?: AxiosRequestConfig;
  extraRoutes?: string[]
}
axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token')
    if (token)
      config.headers = {
        ...config.headers,
        ['Authorization']: `Token ${token}`
      }
    if (!config.timeout) config.timeout = TIMEOUT_MILLISECONDS
    config.headers = {
      ...config.headers,
      'Content-Type': 'application/json',
      'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value
    }
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
    const errorData = { error: typeof error.response.data === 'string' ? error.response.data : Object.keys(error.response.data).reduce((acc, key) => acc + `${key}: ${error.response.data[key]}\n`, ''), status: error.response.status }
    console.error(errorData)
    return Promise.reject(errorData)
  }
)

const apiRequest = async (
  endpoint: Endpoints,
  type: ReqTypes,
  options?: Options
): Promise<ApiResponse> => {
  var extra = ''
  if (options?.extraRoutes?.length) {
    extra += options.extraRoutes.reduce((acc, curr) => acc + `${curr}/`, "")
  }
  const url = new URI(BASE_URL + endpoint + extra)
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
      case ReqTypes.put:
        response = await axios.put(
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
    console.log(e)
    return {
      success: false,
      error: e,
      data: e ? e.error : "No connection",
      status: e.status
    }
  }
}

const apiClient = {
  post: async (
    endpoint: Endpoints,
    options?: Options
  ): Promise<ApiResponse> => {
    return apiRequest(endpoint, ReqTypes.post, options)
  },
  delete: async (
    endpoint: Endpoints,
    options?: Options
  ): Promise<ApiResponse> => apiRequest(endpoint, ReqTypes.delete, options),
  get: async (
    endpoint: Endpoints,
    options?: Options
  ): Promise<ApiResponse> => apiRequest(endpoint, ReqTypes.get, options),
  patch: async (
    endpoint: Endpoints,
    options?: Options
  ): Promise<ApiResponse> => apiRequest(endpoint, ReqTypes.patch, options),
  put: async (
    endpoint: Endpoints,
    options?: Options
  ): Promise<ApiResponse> => apiRequest(endpoint, ReqTypes.put, options)
}

export default apiClient
