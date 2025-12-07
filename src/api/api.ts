import { categoryAddT, categoryItem, organizationsListT, productsListT } from './types'

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

export async function getCategoryList(): Promise<{
  response?: Response
  ok: boolean
  data?: categoryItem[]
  error: string | null
}> {
  // const backendUrl = configStore.getState().backendUrl
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  try {
    //console.log(backendUrl + '/api/kaspi/category')
    const response = await fetch(backendUrl + '/api/kaspi/category', getConfig('GET'))
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
  // const backendUrl = configStore.getState().backendUrl
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
    //console.log(backendUrl + '/api/kaspi/category')
    const response = await fetch(url, getConfig('GET'))
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
  // const backendUrl = configStore.getState().backendUrl
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const url = backendUrl + '/api/kaspi/organization/'

  try {
    //console.log(backendUrl + '/api/kaspi/category')
    const response = await fetch(url, getConfig('GET'))
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
    if (response.ok) {
      return { response, ok: response.ok, error: null }
    } else {
      return { response, ok: false, error: await response.text() }
    }
  } catch (error) {
    return { ok: false, error: String(error) }
  }
}
