import type { AxiosResponse } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../api/auth'
import { login, logout } from '../auth'

vi.mock('../api/auth')

const mockLocation = {
  href: '',
}
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockLocation.href = ''
  })

  const mockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  })

  describe('login', () => {
    it('should redirect to login URL', () => {
      const mockLoginUrl = 'http://example.com/login'
      vi.mocked(api.login).mockReturnValue(mockLoginUrl)

      login()

      expect(api.login).toHaveBeenCalled()
      expect(window.location.href).toBe(mockLoginUrl)
    })
  })

  describe('logout', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('username', 'test-user')
      localStorage.setItem('email', 'test@example.com')
    })

    it('should clear local storage and call logout API', async () => {
      vi.mocked(api.logout).mockResolvedValue(mockAxiosResponse({ success: true }))

      const result = await logout()

      expect(api.logout).toHaveBeenCalled()
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('username')).toBeNull()
      expect(localStorage.getItem('email')).toBeNull()
      expect(result).toEqual({ success: true })
    })

    it('should handle logout API errors', async () => {
      const error = new Error('API Error')
      vi.mocked(api.logout).mockRejectedValue(error)

      await expect(logout()).rejects.toThrow('API Error')
    })
  })
})
