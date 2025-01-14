import { dbConfig } from '../../../app/config/db'

const MOCK_TOKEN = 'mockedAccessToken'

jest.mock('@azure/identity', () => {
  class MockDefaultAzureCredential {
  }

  return {
    DefaultAzureCredential: MockDefaultAzureCredential,
    getBearerTokenProvider: jest.fn(() => MOCK_TOKEN)
  }
})

describe('beforeConnect hook', () => {
  test('should modify password in production environment', async () => {
    const cfg = {
      password: 'originalPassword'
    }

    process.env.NODE_ENV = 'production'

    await dbConfig.hooks.beforeConnect(cfg)

    expect(cfg.password).not.toBe('originalPassword')
    expect(cfg.password).toEqual(MOCK_TOKEN)

    await dbConfig.hooks.beforeConnect(cfg)

    expect(cfg.password).not.toBe('originalPassword')
    expect(cfg.password).toEqual(MOCK_TOKEN)

    await dbConfig.hooks.beforeConnect(cfg)

    expect(cfg.password).not.toBe('originalPassword')
    expect(cfg.password).toEqual(MOCK_TOKEN)
  })

  test('should not modify password in non-production environment', async () => {
    const cfg = {
      password: 'originalPassword'
    }

    process.env.NODE_ENV = 'development'

    await dbConfig.hooks.beforeConnect(cfg)

    expect(cfg.password).toBe('originalPassword')

    await dbConfig.hooks.beforeConnect(cfg)

    expect(cfg.password).toBe('originalPassword')

    await dbConfig.hooks.beforeConnect(cfg)

    expect(cfg.password).toBe('originalPassword')
  })
})
