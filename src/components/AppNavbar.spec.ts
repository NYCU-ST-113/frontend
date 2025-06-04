import { logout } from '@/services/auth'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import AppNavbar from './AppNavbar.vue'

vi.mock('@/services/auth', () => ({
  logout: vi.fn()
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: {} },
    { path: '/applications', component: {} },
    { path: '/payments', component: {} },
    { path: '/terms', component: {} },
    { path: '/admin', component: {} }
  ]
})

describe('AppNavbar.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(AppNavbar, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-test="navbar"]').exists()).toBe(true)
  })

  it('toggles sidebar when menu button is clicked', async () => {
    const wrapper = mount(AppNavbar, {
      global: {
        plugins: [router]
      }
    })
    const menuButton = wrapper.find('[data-test="menu-button"]')

    await menuButton.trigger('click')
    expect(wrapper.emitted('toggle-sidebar')).toBeTruthy()
  })

  it('renders all navigation items', () => {
    const wrapper = mount(AppNavbar, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('[data-test="nav-"]').exists()).toBe(true) // Home
    expect(wrapper.find('[data-test="nav-applications"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-payments"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="nav-terms"]').exists()).toBe(true)
  })

  it('handles logout correctly', async () => {
    const wrapper = mount(AppNavbar, {
      global: {
        plugins: [router]
      }
    })

    const logoutButton = wrapper.find('[data-test="logout-button"]')
    await logoutButton.trigger('click')

    expect(logout).toHaveBeenCalled()
  })

  it('renders admin button with correct link', () => {
    const wrapper = mount(AppNavbar, {
      global: {
        plugins: [router]
      }
    })

    const adminButton = wrapper.find('[data-test="admin-button"]')
    expect(adminButton.exists()).toBe(true)

    const adminLink = wrapper.find('[data-test="admin-button"] a')
    expect(adminLink.attributes('href')).toBe('/admin')
  })
})