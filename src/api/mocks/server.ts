import { setupServer } from 'msw/node'
import { mockHandlers } from './handlers/mock-handlers'

export const server = setupServer(...mockHandlers)
