import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock PrimeVue components
config.global.components = {
  Button: {
    name: 'Button',
    template: '<button :data-test="$attrs[\'data-test\']" :class="$attrs.class" @click="$emit(\'click\')"><slot></slot></button>',
    props: ['label', 'icon', 'severity', 'outlined', 'raised', 'rounded', 'size', 'text'],
    emits: ['click']
  },
  Menu: {
    name: 'Menu',
    template: '<div :data-test="$attrs[\'data-test\']" class="p-menu"><slot></slot></div>',
    props: ['model']
  },
  Image: {
    name: 'Image',
    template: '<img :src="src" :alt="alt" :width="width" :height="height" />',
    props: ['src', 'alt', 'width', 'height']
  },
  Badge: {
    name: 'Badge',
    template: '<span :data-test="$attrs[\'data-test\']" class="p-badge"><slot></slot></span>',
    props: ['value']
  },
  Menubar: {
    name: 'Menubar',
    template: '<nav :data-test="$attrs[\'data-test\']" class="p-menubar"><slot name="start"></slot><slot name="item" v-bind="{ item: {}, props: { action: {} }, hasSubmenu: false, root: true }"></slot><slot name="end"></slot></nav>',
    props: ['model']
  }
}

// Mock router-link component
config.global.components['router-link'] = {
  name: 'RouterLink',
  template: '<a :data-test="$attrs[\'data-test\']" :href="to"><slot></slot></a>',
  props: ['to']
}

// Mock directives
config.global.directives = {
  ripple: {}
}

// Mock router
vi.mock('vue-router', () => ({
  createRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    beforeEach: vi.fn(),
    afterEach: vi.fn(),
    install: vi.fn()
  }),
  createWebHistory: () => ({}),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn()
  }),
  useRoute: () => ({
    path: '/',
    name: 'home'
  })
}))

// Mock auth service
vi.mock('@/services/auth', () => ({
  login: vi.fn(() => {
    window.location.href = '/auth'
  }),
  logout: vi.fn(() => {
    window.location.href = '/login'
  })
}))