const { start } = require('../../../app/email/notify-monitor')
const { DELIVERED } = require('../../../app/email/notify-statuses')

const { checkEmailDelivered } = require('../../../app/repositories/document-log-repository')
jest.mock('../../../app/repositories/document-log-repository')

const checkDeliveryStatus = require('../../../app/email/notify-status')
jest.mock('.../../../app/email/notify-status')

jest.mock('.../../../app/email/update-email-status', () => {
  return jest.fn()
})

const consoleLog = jest.spyOn(console, 'log')
const consoleError = jest.spyOn(console, 'error')
const emailReference = '123456789'

describe('run notify monitor', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('check for messages and check status', async () => {
    checkEmailDelivered.mockResolvedValue([{ emailReference }])
    checkDeliveryStatus.mockResolvedValue(DELIVERED)
    await start()
    expect(consoleLog).toHaveBeenCalledWith(`Checking message with email reference ${emailReference}.`)
  })

  test('check for messages and check status - error', async () => {
    checkEmailDelivered.mockImplementation(() => { throw new Error() })
    checkDeliveryStatus.mockResolvedValue(DELIVERED)
    await start()
    expect(consoleError).toHaveBeenCalledTimes(1)
  })
})
