import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

describe('App.vue', () => {
  it('renders router view with transition', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          component: { template: '<div>Home Page</div>' }
        }
      ]
    })

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'Transition' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'Transition' }).attributes('name')).toBe('fade')
    expect(wrapper.findComponent({ name: 'Transition' }).attributes('mode')).toBe('out-in')
  })
})