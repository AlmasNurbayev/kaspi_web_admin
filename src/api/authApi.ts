function getConfig<T = unknown>(method: string, body?: T): RequestInit {
  return {
    body: body ? JSON.stringify(body) : null,
    headers: {
      'Content-type': 'application/json'
    },
    credentials: 'include',
    method
  }
}

export type LoginBody = {
  email: string
  password: string
}

export type AuthUser = {
  id: number
  email: string
}

export type LoginResponse =
  | { ok: true; user: AuthUser; error: null }
  | { ok: false; user: null; error: string }

export async function loginApi(body: LoginBody): Promise<LoginResponse> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  try {
    const response = await fetch(backendUrl + '/api/auth/login', getConfig('POST', body))
    const text = await response.text()

    if (response.status === 200) {
      const user: AuthUser = JSON.parse(text)
      return { ok: true, user, error: null }
    }

    if (response.status === 403) {
      return { ok: false, user: null, error: text || 'Неверный логин или пароль' }
    }

    // 500 и прочее
    return { ok: false, user: null, error: text || 'Ошибка сервера' }
  } catch (error) {
    return { ok: false, user: null, error: String(error) }
  }
}

export async function logoutApi(): Promise<{ ok: boolean; error: string | null }> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  try {
    const response = await fetch(backendUrl + '/api/auth/logout', getConfig('POST'))
    if (response.ok) {
      return { ok: true, error: null }
    } else {
      return { ok: false, error: 'Ошибка при выходе' }
    }
  } catch (error) {
    return { ok: false, error: String(error) }
  }
}
