import axios from 'axios'

const http = axios.create({
  baseURL: 'http://140.113.207.240/api',
})
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `${token}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  },
)

export default http
