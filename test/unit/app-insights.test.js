import appInsights from 'applicationinsights'
import * as insights from '../../app/insights.js'

jest.mock('applicationinsights', () => ({
  setup: jest.fn()
}))

const mockLogger = {
  info: jest.fn()
}

describe('App Insights', () => {
  const startMock = jest.fn()
  const setupMock = jest.fn(() => {
    return {
      start: startMock
    }
  })
  appInsights.setup = setupMock
  const cloudRoleTag = 'cloudRoleTag'
  const tags = {}
  appInsights.defaultClient = {
    context: {
      keys: {
        cloudRole: cloudRoleTag
      },
      tags
    },
    trackException: jest.fn()
  }

  const appInsightsKey = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING

  beforeEach(() => {
    delete process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
    delete process.env.APPINSIGHTS_CLOUDROLE
    jest.clearAllMocks()
  })

  afterAll(() => {
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = appInsightsKey
  })

  test('is started when env var exists', () => {
    const appName = 'test-app'
    process.env.APPINSIGHTS_CLOUDROLE = appName
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = 'something'

    insights.setup(mockLogger)

    expect(setupMock).toHaveBeenCalledTimes(1)
    expect(startMock).toHaveBeenCalledTimes(1)
    expect(tags[cloudRoleTag]).toEqual(appName)
  })

  test('when started and no cloudrole set, then app name is blank', () => {
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = 'something'

    insights.setup(mockLogger)

    expect(setupMock).toHaveBeenCalledTimes(1)
    expect(startMock).toHaveBeenCalledTimes(1)
    expect(tags[cloudRoleTag]).toEqual('')
  })

  test('not started when no connection string', () => {
    delete process.env.APPLICATIONINSIGHTS_CONNECTION_STRING

    insights.setup(mockLogger)

    expect(setupMock).toHaveBeenCalledTimes(0)
    expect(startMock).toHaveBeenCalledTimes(0)
  })
})
