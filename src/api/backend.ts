import {
  categoryAddT, categoryItem,
  exportProductJSON,
  exportProductResponse,
  organizationsListT, productsListT,
  updateCategoryRequest
} from './types'

function getConfig<T = unknown>(method: string, body?: T): RequestInit {
  return {
    body: body ? JSON.stringify(body) : null,
    headers: {
      'Content-type': 'application/json'
    },
    //mode: 'no-cors',
    credentials: 'include',
    method
  }
}

/** При 401 — перенаправляем на страницу входа */
function handleUnauthorized(response: Response): void {
  if (response.status === 401) {
    window.location.href = '/login'
  }
}

export async function getCategoryList(): Promise<{
  response?: Response
  ok: boolean
  data?: categoryItem[]
  error: string | null
}> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  try {
    const response = await fetch(backendUrl + '/api/kaspi/categories', getConfig('GET'))
    handleUnauthorized(response)
    let dataObj: { data: categoryItem[] }
    if (response.ok) {
      dataObj = await response.json()
      return { response, ok: response.ok, data: dataObj.data, error: null }
    } else {
      return { response, ok: false, error: null }
    }
  } catch (error) {
    return { ok: false, error: String(error) }
  }
}

export async function getProductList(params?: {
  [key: string]: string | string[] | undefined
}): Promise<{
  response?: Response
  ok: boolean
  data?: productsListT
  error: string | null
}> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  let stringParams = ''
  for (const param in params) {
    if (params[param] !== undefined && params[param] !== '') {
      stringParams += `&${param}=${params[param]}`
    }
  }
  const url =
    backendUrl + '/api/kaspi/products/' + (stringParams !== '' ? '?' + stringParams : '')

  try {
    const response = await fetch(url, getConfig('GET'))
    handleUnauthorized(response)
    let dataObj: productsListT
    if (response.ok) {
      dataObj = await response.json()
      return { response, ok: response.ok, data: dataObj, error: null }
    } else {
      return { response, ok: false, error: null }
    }
  } catch (error) {
    return { ok: false, error: String(error) }
  }
}

export async function getOrganizationList(): Promise<{
  response?: Response
  ok: boolean
  data?: organizationsListT
  error: string | null
}> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const url = backendUrl + '/api/kaspi/organization/'

  try {
    const response = await fetch(url, getConfig('GET'))
    handleUnauthorized(response)
    let dataObj: organizationsListT
    if (response.ok) {
      dataObj = await response.json()
      return { response, ok: response.ok, data: dataObj, error: null }
    } else {
      return { response, ok: false, error: null }
    }
  } catch (error) {
    return { ok: false, error: String(error) }
  }
}

export async function addCategory(body: categoryAddT): Promise<{
  response?: Response
  ok: boolean
  error: string | null
}> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const url = backendUrl + '/api/kaspi/category/'

  try {
    const response = await fetch(url, getConfig('POST', body))
    handleUnauthorized(response)
    if (response.ok) {
      return { response, ok: response.ok, error: null }
    } else {
      return { response, ok: false, error: await response.text() }
    }
  } catch (error) {
    return { ok: false, error: String(error) }
  }
}

export async function getCategoryById(id: number): Promise<{
  response?: Response
  ok: boolean
  data?: categoryItem
  error: string | null
}> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const url = backendUrl + `/api/kaspi/category/${id}`

  try {
    const response = await fetch(url, getConfig('GET'))
    handleUnauthorized(response)
    if (response.ok) {
      const data: categoryItem = await response.json()
      return { response, ok: true, data, error: null }
    } else {
      return { response, ok: false, error: await response.text() }
    }
  } catch (error) {
    return { ok: false, error: String(error) }
  }
}

export async function updateCategoryFromKaspi(body: updateCategoryRequest): Promise<{
  response?: Response
  ok: boolean
  error: string | null
}> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const url = backendUrl + `/api/kaspi/category/`
  try {
    const response = await fetch(url, getConfig('PUT', body))
    handleUnauthorized(response)
    if (response.ok) {
      return { response, ok: true, error: null }
    } else {
      return { response, ok: false, error: await response.text() }
    }
  } catch (error) {
    return { ok: false, error: String(error) }
  }
}

export async function exportProductToKaspi(body: exportProductJSON[]): Promise<{
  response?: Response
  ok: boolean
  data?: exportProductResponse
  error: string | null
}> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  try {
    const response = await fetch(backendUrl + '/api/products/import', getConfig('POST', body))
    if (response.status === 400) {
      return { response, ok: response.ok, error: 'Ошибка загрузки товара' }
    }
    let dataObj: { data: exportProductResponse }
    if (response.ok) {
      dataObj = await response.json()
      return { response, ok: response.ok, data: dataObj.data, error: null }
    } else {
      return { response, ok: false, error: null }
    }
  } catch (error) {
    return { ok: false, error: String(error) }
  }
}