/**
 * Unit tests for the action's entrypoint, src/index.js
 */
import { jest } from '@jest/globals'

const mockRun = jest.fn()

await jest.unstable_mockModule('../src/main.js', () => ({
  run: mockRun
}))

await jest.unstable_mockModule('@actions/core', () => ({
  setFailed: jest.fn()
}))

describe('index', () => {
  it('calls run when imported', async () => {
    await import('../src/index.js')

    expect(mockRun).toHaveBeenCalled()
  })
})
