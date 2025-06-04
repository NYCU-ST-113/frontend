import { login } from '@/services/auth'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './LoginPage.vue'

vi.mock('@/services/auth', () => ({
  login: vi.fn()
}))

describe('LoginPage.vue', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/login',
        component: LoginPage
      }
    ]
  })

  let mockWindow: { location: { href: string } }

  beforeEach(() => {
    mockWindow = {
      location: {
        href: ''
      }
    }
    vi.stubGlobal('window', mockWindow)
  })

  afterEach(() => {
    vi.unstubGlobal('window')
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the title correctly', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router]
      }
    })
    const title = wrapper.find('h1')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('服務申請系統')
  })

  it('displays login button with correct attributes', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router]
      }
    })
    const loginButton = wrapper.find('[data-test="login-button"]')
    expect(loginButton.exists()).toBe(true)
    expect(loginButton.attributes('label')).toBe('登入')
    expect(loginButton.attributes('icon')).toBe('pi pi-sign-in')
    expect(loginButton.attributes('size')).toBe('large')
  })

  it('calls login service and redirects when login button is clicked', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.find('[data-test="login-button"]').trigger('click')

    expect(login).toHaveBeenCalled()
    expect(mockWindow.location.href).toBe('/auth')
  })

  it('has correct layout classes', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.h-dvh').exists()).toBe(true)
    expect(wrapper.find('.w-dvw').exists()).toBe(true)
    expect(wrapper.find('.flex.flex-col').exists()).toBe(true)
    expect(wrapper.find('.mt-16').exists()).toBe(true)
    expect(wrapper.find('.mt-32').exists()).toBe(true)
  })
})