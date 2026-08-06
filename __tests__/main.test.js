/**
 * Unit tests for the action's main functionality, src/main.js
 */
import { jest } from '@jest/globals'

const mockGetInput = jest.fn()
const mockGetBooleanInput = jest.fn()
const mockSetFailed = jest.fn()
const mockInfo = jest.fn()
const mockExec = jest.fn()
const mockReaddirSync = jest.fn()
const mockExistsSync = jest.fn()

await jest.unstable_mockModule('@actions/core', () => ({
  getInput: mockGetInput,
  getBooleanInput: mockGetBooleanInput,
  setFailed: mockSetFailed,
  info: mockInfo
}))

await jest.unstable_mockModule('@actions/exec', () => ({
  exec: mockExec
}))

await jest.unstable_mockModule('fs', () => ({
  readdirSync: mockReaddirSync,
  existsSync: mockExistsSync
}))

const { run } = await import('../src/main.js')

describe('run', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetBooleanInput.mockReturnValue(false)
    mockGetInput.mockReturnValue('')
    mockExec.mockResolvedValue(0)
  })

  it('uses the provided path', async () => {
    mockGetInput.mockImplementation(name =>
      name === 'path' ? 'my.sdPlugin' : ''
    )
    mockExistsSync.mockReturnValue(true)

    await run()

    expect(mockExec).toHaveBeenCalledWith(
      'npx',
      expect.arrayContaining(['pack', 'my.sdPlugin'])
    )
  })

  it('auto-detects the sdPlugin directory', async () => {
    mockGetInput.mockReturnValue('')
    mockReaddirSync.mockReturnValue([
      { isDirectory: () => true, name: 'my.sdPlugin' }
    ])
    mockExistsSync.mockReturnValue(true)

    await run()

    expect(mockExec).toHaveBeenCalledWith(
      'npx',
      expect.arrayContaining(['pack', 'my.sdPlugin'])
    )
  })

  it('fails when no sdPlugin directory is found', async () => {
    mockGetInput.mockReturnValue('')
    mockReaddirSync.mockReturnValue([])

    await run()

    expect(mockSetFailed).toHaveBeenCalledWith(
      'path not specified and no .sdPlugin directory found in the current working directory.'
    )
  })

  it('fails when the provided path does not exist', async () => {
    mockGetInput.mockImplementation(name =>
      name === 'path' ? 'missing.sdPlugin' : ''
    )
    mockExistsSync.mockReturnValue(false)

    await run()

    expect(mockSetFailed).toHaveBeenCalledWith(
      "Path 'missing.sdPlugin' does not exist."
    )
  })

  it('fails when both forceUpdateCheck and noUpdateCheck are true', async () => {
    mockGetInput.mockImplementation(name =>
      name === 'path' ? 'my.sdPlugin' : ''
    )
    mockGetBooleanInput.mockImplementation(
      name => name === 'forceUpdateCheck' || name === 'noUpdateCheck'
    )
    mockExistsSync.mockReturnValue(true)

    await run()

    expect(mockSetFailed).toHaveBeenCalledWith(
      'forceUpdateCheck and noUpdateCheck cannot be set to true at the same time'
    )
  })

  it('appends --output when outputPath is provided', async () => {
    mockGetInput.mockImplementation(name => {
      if (name === 'path') return 'my.sdPlugin'
      if (name === 'outputPath') return 'output/'
      return ''
    })
    mockExistsSync.mockReturnValue(true)

    await run()

    expect(mockExec).toHaveBeenCalledWith(
      'npx',
      expect.arrayContaining(['--output', 'output/'])
    )
  })

  it('appends --force when force is true', async () => {
    mockGetInput.mockImplementation(name =>
      name === 'path' ? 'my.sdPlugin' : ''
    )
    mockGetBooleanInput.mockImplementation(name => name === 'force')
    mockExistsSync.mockReturnValue(true)

    await run()

    expect(mockExec).toHaveBeenCalledWith(
      'npx',
      expect.arrayContaining(['--force'])
    )
  })
})
