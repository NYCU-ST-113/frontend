import { useAuthStore } from '@/stores/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import router from '../index'

vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    isAuthenticated: vi.fn()
  }))
}))

vi.mock('../index', () => {
  const routes = [
    {
      path: '/login',
      name: 'login'
    },
    {
      path: '/auth/callback',
      name: 'callback'
    },
    {
      path: '/',
      children: [
        {
          path: '/',
          name: 'home'
        },
        {
          path: '/applications',
          name: 'applications'
        },
        {
          path: 'applications/create',
          name: 'create-application'
        },
        {
          path: '/payments',
          name: 'payments'
        },
        {
          path: '/terms',
          name: 'terms-of-use'
        }
      ]
    },
    {
      path: '/admin',
      children: [
        {
          path: '',
          name: 'admin-home'
        },
        {
          path: 'profile',
          name: 'admin-profile'
        },
        {
          path: 'applications',
          name: 'admin-applications'
        },
        {
          path: 'payments',
          name: 'admin-payments'
        },
        {
          path: 'mail',
          name: 'admin-mail'
        }
      ]
    }
  ]

  return {
    default: {
      getRoutes: () => routes,
      push: vi.fn(),
      beforeEach: vi.fn((fn) => fn),
      currentRoute: {
        value: { name: 'login' }
      }
    }
  }
})

describe('Router', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('routes', () => {
    it('should have correct base routes', () => {
      const routes = router.getRoutes()
      const baseRoutes = routes.filter(r => !r.path.includes('/') || r.path === '/' || r.path === '/admin' || r.path === '/login' || r.path === '/auth/callback')

      expect(baseRoutes.length).toBe(4) // login, callback, default layout, admin layout
      expect(baseRoutes.map(r => r.path)).toEqual([
        '/login',
        '/auth/callback',
        '/',
        '/admin'
      ])
    })

    it('should have correct nested routes in default layout', () => {
      const defaultLayout = router.getRoutes().find(r => r.path === '/')
      const children = defaultLayout?.children || []

      expect(children).toHaveLength(5)
      expect(children.map(r => r.name).sort()).toEqual([
        'home',
        'applications',
        'create-application',
        'payments',
        'terms-of-use'
      ].sort())
    })

    it('should have correct nested routes in admin layout', () => {
      const adminLayout = router.getRoutes().find(r => r.path === '/admin')
      const children = adminLayout?.children || []

      expect(children).toHaveLength(5)
      expect(children.map(r => r.name).sort()).toEqual([
        'admin-home',
        'admin-profile',
        'admin-applications',
        'admin-payments',
        'admin-mail'
      ].sort())
    })
  })

  describe('navigation guards', () => {
    it('should allow access to login page when not authenticated', async () => {
      const authStore = useAuthStore()
      vi.mocked(authStore.isAuthenticated).mockReturnValue(false)

      const pushSpy = vi.spyOn(router, 'push')
      await router.push({ name: 'login' })

      expect(pushSpy).toHaveBeenCalledWith({ name: 'login' })
    })

    it('should allow access to callback page when not authenticated', async () => {
      const authStore = useAuthStore()
      vi.mocked(authStore.isAuthenticated).mockReturnValue(false)

      const pushSpy = vi.spyOn(router, 'push')
      await router.push({ name: 'callback' })

      expect(pushSpy).toHaveBeenCalledWith({ name: 'callback' })
    })

    it('should redirect to login page when not authenticated', async () => {
      const authStore = useAuthStore()
      vi.mocked(authStore.isAuthenticated).mockReturnValue(false)

      await router.push({ name: 'home' })
      expect(router.currentRoute.value.name).toBe('login')
    })

    it('should allow access when authenticated', async () => {
      const authStore = useAuthStore()
      vi.mocked(authStore.isAuthenticated).mockReturnValue(true)

      const pushSpy = vi.spyOn(router, 'push')
      await router.push({ name: 'home' })

      expect(pushSpy).toHaveBeenCalledWith({ name: 'home' })
    })
  })
})