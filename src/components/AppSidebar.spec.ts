import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import AppSidebar from './AppSidebar.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/admin', component: {} },
    { path: '/admin/profile', component: {} },
    { path: '/admin/applications', component: {} },
    { path: '/admin/payments', component: {} },
    { path: '/admin/mail', component: {} }
  ]
})

describe('AppSidebar.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(AppSidebar, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-test="sidebar"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="sidebar-menu"]').exists()).toBe(true)
  })

  it('applies correct classes based on isOpen prop', async () => {
    const wrapper = mount(AppSidebar, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.classes()).toContain('translate-x-0')

    await wrapper.setProps({ isOpen: false })
    expect(wrapper.classes()).toContain('-translate-x-full')
  })

  it('emits close event when backdrop is clicked', async () => {
    const wrapper = mount(AppSidebar, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [router]
      }
    })

    const backdrop = wrapper.find('[data-test="sidebar-backdrop"]')
    await backdrop.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('renders all menu items correctly', () => {
    const wrapper = mount(AppSidebar, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [router]
      }
    })

    const menu = wrapper.find('[data-test="sidebar-menu"]')
    expect(menu.exists()).toBe(true)

    // Check if menu items are rendered
    const menuItems = wrapper.findComponent({ name: 'Menu' })
    expect(menuItems.props('model')).toHaveLength(1) // One main group
    expect(menuItems.props('model')[0].items).toHaveLength(5) // Five sub-items
  })

  it('renders menu items with correct labels and URLs', () => {
    const wrapper = mount(AppSidebar, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [router]
      }
    })

    const menuItems = wrapper.findComponent({ name: 'Menu' })
    const items = menuItems.props('model')[0].items

    const expectedItems = [
      { label: '管理儀表板', url: '/admin' },
      { label: '個人審核資訊', url: '/admin/profile' },
      { label: '申請管理', url: '/admin/applications' },
      { label: '繳費管理', url: '/admin/payments' },
      { label: '寄送通知', url: '/admin/mail' }
    ]

    expectedItems.forEach((expected, index) => {
      expect(items[index].label).toBe(expected.label)
      expect(items[index].url).toBe(expected.url)
    })
  })
})