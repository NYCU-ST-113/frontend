import * as api from '@/services/api/auth'

export const login = () => {
  const url = api.login()
  window.location.href = url
}

export const logout = async () => {
  const response = await api.logout()
  return response.data
}

export const callback = async (code: string) => {
  const data = await api.callback(code)
  localStorage.setItem('token', data['jwt-token'])
}
