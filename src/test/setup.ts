import { beforeEach, vi } from 'vitest'

// Mock localStorage
const storedItems: Record<string, string> = {}

const localStorageMock = {
  getItem: vi.fn((key: string) => storedItems[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    storedItems[key] = value
  }),
  clear: vi.fn(() => {
    Object.keys(storedItems).forEach(key => delete storedItems[key])
  }),
  removeItem: vi.fn((key: string) => {
    delete storedItems[key]
  }),
  key: vi.fn(),
  length: 0
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  localStorageMock.clear()
})