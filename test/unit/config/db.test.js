const dbConfig = require('../../../app/config/db')

const MOCK_TOKEN = 'mockedAccessToken'

jest.mock('@azure/identity', () => {
  class MockDefaultAzureCredential {
    async getToken () {
      return { token: MOCK_TOKEN }
    }
  }

  return {
    DefaultAzureCredential: MockDefaultAzureCredential
  }
})

describe('beforeConnect hook', () => {
  test('should modify password in production environment', async () => {
    const cfg = {
      password: 'originalPassword'
    }

    process.env.NODE_ENV = 'production'

    await dbConfig.development.hooks.beforeConnect(cfg)

    expect(cfg.password).not.toBe('originalPassword')
    expect(cfg.password).toEqual(MOCK_TOKEN)

    await dbConfig.production.hooks.beforeConnect(cfg)

    expect(cfg.password).not.toBe('originalPassword')
    expect(cfg.password).toEqual(MOCK_TOKEN)

    await dbConfig.test.hooks.beforeConnect(cfg)

    expect(cfg.password).not.toBe('originalPassword')
    expect(cfg.password).toEqual(MOCK_TOKEN)
  })

  test('should not modify password in non-production environment', async () => {
    const cfg = {
      password: 'originalPassword'
    }

    process.env.NODE_ENV = 'development'

    await dbConfig.development.hooks.beforeConnect(cfg)

    expect(cfg.password).toBe('originalPassword')

    await dbConfig.production.hooks.beforeConnect(cfg)

    expect(cfg.password).toBe('originalPassword')

    await dbConfig.test.hooks.beforeConnect(cfg)

    expect(cfg.password).toBe('originalPassword')
  })
})
