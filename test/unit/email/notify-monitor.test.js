const { start } = require('../../../app/email/notify-monitor')
const { DELIVERED } = require('../../../app/email/notify-statuses')

const { checkEmailDelivered } = require('../../../app/repositories/document-log-repository')
jest.mock('../../../app/repositories/document-log-repository')

const checkDeliveryStatus = require('../../../app/email/notify-status')
jest.mock('.../../../app/email/notify-status')

jest.mock('.../../../app/email/update-email-status', () => {
  return jest.fn()
})

jest.useFakeTimers()

jest.mock('../../../app/config', () => ({
  storageConfig: {},
  notifyConfig: {
    notifyApiKey: 'fake_api_key'
  }
}))

const consoleLog = jest.spyOn(console, 'log')
const consoleError = jest.spyOn(console, 'error')
const emailReference = '123456789'

describe('run notify monitor', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('check for messages and check status', async () => {
    checkEmailDelivered.mockReturnValue([{ emailReference }])
    checkDeliveryStatus.mockResolvedValue(DELIVERED)
    await start()
    expect(consoleLog).toHaveBeenCalledWith(`Checking message: ${JSON.stringify({ emailReference })}`)
    expect(checkDeliveryStatus).toHaveBeenCalledTimes(1)
  })

  test('check for messages and check status - emailReference null', async () => {
    checkEmailDelivered.mockReturnValue([{ emailReference: null }])
    checkDeliveryStatus.mockResolvedValue(DELIVERED)
    await start()
    expect(consoleLog).toHaveBeenCalledWith(`Checking message: ${JSON.stringify({ emailReference: null })}`)
    expect(checkDeliveryStatus).toHaveBeenCalledTimes(0)
  })

  test('check for messages and check status - error', async () => {
    checkEmailDelivered.mockImplementation(() => { throw new Error() })
    checkDeliveryStatus.mockResolvedValue(DELIVERED)
    await start()
    expect(consoleError).toHaveBeenCalledTimes(1)
    expect(checkDeliveryStatus).toHaveBeenCalledTimes(0)
  })
})
