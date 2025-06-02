import http from './http'

const prefix = 'user'

export const login = () => {
  return `${http.defaults.baseURL}/${prefix}/login`
}

export const logout = async () => {
  const response = await http.get(`${prefix}/logout`)
  return response.data
}

export const callback = async (code: string) => {
  const response = await http.get(`${prefix}/callback`, {
    params: {
      code,
    },
  })
  return response.data
}

export const getProfile = async () => {
  const response = await http.get(`${prefix}/me`)
  return response.data
}
