import { buildConfig } from '../../../app/config/index.js'

describe('Main Config Validation', () => {
  const originalProcessEnv = process.env

  beforeEach(() => {
    process.env = {}
  })

  afterAll(() => {
    process.env = originalProcessEnv
  })

  test('should throw an error if the config object is invalid', () => {
    // Mock environment variables
    process.env.CARBON_COPY_EMAIL_ADDRESS = 'some-string'

    // Validate config
    expect(buildConfig()).toThrow('The application config is invalid. "carbonCopyEmailAddress" must be a valid email')
  })

  test('should validate the config object successfully picking up defaults', () => {
    // Mock environment variables
    delete process.env.PORT
    delete process.env.TERMS_AND_CONDITIONS_URL
    delete process.env.APPLY_SERVICE_URI
    delete process.env.CLAIM_SERVICE_URI

    const config = buildConfig()

    expect(config.port).toEqual(3005)
    expect(config.termsAndConditionsUrl).toEqual('#')
    expect(config.applyServiceUri).toEqual('#')
    expect(config.claimServiceUri).toEqual('#')
  })

  test('should validate the config object successfully picking up overridden values', () => {
    // Mock environment variables
    process.env.PORT = '12345'
    process.env.TERMS_AND_CONDITIONS_URL = 'https://example.com/terms'
    process.env.APPLY_SERVICE_URI = 'https://example.com/apply'
    process.env.CLAIM_SERVICE_URI = 'https://example.com/claim'

    const config = buildConfig()

    expect(config.port).toEqual(12345)
    expect(config.termsAndConditionsUrl).toEqual('https://example.com/terms')
    expect(config.applyServiceUri).toEqual('https://example.com/apply')
    expect(config.claimServiceUri).toEqual('https://example.com/claim')
  })
})
