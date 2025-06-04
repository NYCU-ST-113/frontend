import { createPinia } from 'pinia'
import { ConfirmationService, DialogService, ToastService } from 'primevue'
import PrimeVue from 'primevue/config'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'

const mockApp = {
  use: vi.fn().mockReturnThis(),
  mount: vi.fn(),
}

vi.mock('vue', () => ({
  createApp: vi.fn(() => mockApp),
  defineComponent: vi.fn((comp) => comp),
}))

vi.mock('../App.vue', () => ({
  default: {},
}))

vi.mock('pinia', () => ({
  createPinia: vi.fn(),
}))

vi.mock('primevue/config', () => ({
  default: vi.fn(),
}))

vi.mock('primevue', () => ({
  ConfirmationService: vi.fn(),
  DialogService: vi.fn(),
  ToastService: vi.fn(),
}))

vi.mock('../router', () => ({
  default: vi.fn(),
}))

vi.mock('@primeuix/themes/aura', () => ({
  default: {},
}))

describe('Main', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create and configure the app correctly', async () => {
    const { default: App } = await import('../App.vue')
    const { default: router } = await import('../router')

    await import('../main')

    expect(createApp).toHaveBeenCalledWith(App)
    expect(mockApp.use).toHaveBeenCalledWith(createPinia())
    expect(mockApp.use).toHaveBeenCalledWith(router)
    expect(mockApp.use).toHaveBeenCalledWith(PrimeVue, expect.any(Object))
    expect(mockApp.use).toHaveBeenCalledWith(ConfirmationService)
    expect(mockApp.use).toHaveBeenCalledWith(ToastService)
    expect(mockApp.use).toHaveBeenCalledWith(DialogService)
    expect(mockApp.mount).toHaveBeenCalledWith('#app')
  })
})
