import * as api from '@/services/api/auth'

export const login = () => {
  const url = api.login()
  window.location.href = url
}

export const logout = async () => {
  const response = await api.logout()

  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('email')

  return response.data
}

export const callback = async (code: string) => {
  const data = await api.callback(code)

  localStorage.setItem('token', 'Bearer ' + data.jwt_token)
  localStorage.setItem('username', data.user_info.username)
  localStorage.setItem('email', data.user_info.email)

  console.log('callback', data.jwt_token)
  console.log('callback', data.user_info)
}

export const getProfile = async () => {
  const response = await api.getProfile()
  console.log('getProfile', response)
  return response.data.data.user
}
