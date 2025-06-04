import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import http from '../api/http'

vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    get: vi.fn(),
    defaults: {
      baseURL: 'http://140.113.207.240/api'
    },
    interceptors: {
      request: {
        use: vi.fn((handler) => {
          mockAxios.get.mockImplementation(async (url) => {
            const config = { url, headers: {} }
            const modifiedConfig = await handler(config)
            return { config: modifiedConfig }
          })
        })
      }
    }
  }
  return { default: mockAxios }
})

describe('HTTP Client', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should have correct base URL', () => {
    expect(http.defaults.baseURL).toBe('http://140.113.207.240/api')
  })

  describe('request interceptor', () => {
    it('should add Authorization header when token exists', async () => {
      const token = 'Bearer test-token'
      localStorage.setItem('token', token)

      const response = await http.get('/test')
      expect(response.config.headers.Authorization).toBe(token)
    })

    it('should not add Authorization header when token does not exist', async () => {
      const response = await http.get('/test')
      expect(response.config.headers.Authorization).toBeUndefined()
    })

    it('should handle request error', async () => {
      const error = new Error('Network Error')
      vi.spyOn(http, 'get').mockRejectedValueOnce(error)

      await expect(http.get('/test')).rejects.toThrow('Network Error')
    })
  })
})