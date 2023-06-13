const { start } = require('../../../app/email/notify-monitor')
const { DELIVERED } = require('../../../app/email/notify-statuses')

const { checkEmailDelivered } = require('../../../app/repositories/document-log-repository')
jest.mock('../../../app/repositories/document-log-repository')

const checkDeliveryStatus = require('../../../app/email/notify-status')
jest.mock('.../../../app/email/notify-status')

const updateEmailStatusMock = require('.../../../app/email/update-email-status')
jest.mock('.../../../app/email/update-email-status', () => {
  return jest.fn()
})

const consoleLog = jest.spyOn(console, 'log')
const consoleError = jest.spyOn(console, 'error')
const emailReference = '123456789'

describe('run notify monitor', () => {
  const originalSetTimeout = setTimeout;

  beforeEach(() => {
    const mockSetTimeout = (callback, delay) => {
      // Do nothing
    };
    setTimeout = mockSetTimeout;
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    setTimeout = originalSetTimeout;
    jest.resetAllMocks()
  })

  test('check for messages and check status', async () => {
    checkEmailDelivered.mockResolvedValue([{ emailReference }])
    checkDeliveryStatus.mockResolvedValue(DELIVERED)
    await start()
    expect(consoleLog).toHaveBeenCalledWith(`Checking message with email reference ${emailReference}.`)
    expect(checkDeliveryStatus).toHaveBeenCalledTimes(1)
    expect(checkEmailDelivered).toHaveBeenCalledTimes(1)
    expect(updateEmailStatusMock).toHaveBeenCalledTimes(1)
  })

  test('check for messages and skip null email reference', async () => {
    checkEmailDelivered.mockResolvedValue([{ emailReference: null }])
    await start()
    expect(consoleLog).toHaveBeenCalledWith('Checking message with email reference null.')
    expect(checkDeliveryStatus).toHaveBeenCalledTimes(0)
    expect(checkEmailDelivered).toHaveBeenCalledTimes(1)
    expect(updateEmailStatusMock).toHaveBeenCalledTimes(0)
  })

  test('check for messages and check status - error', async () => {
    checkEmailDelivered.mockImplementation(() => { throw new Error() })
    await start()
    expect(consoleError).toHaveBeenCalledTimes(1)
  })
})
