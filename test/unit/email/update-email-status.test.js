const { DELIVERED, PERMANENT_FAILURE, TEMPORARY_FAILURE, TECHNICAL_FAILURE } = require('../../../app/email/notify-statuses')
const { EMAIL_DELIVERED, INVALID_EMAIL, DELIVERY_FAILED, NOTIFY_ERROR_RESEND } = require('../../../app/statuses')
const updateEmailStatus = require('../../../app/email/update-email-status')
const mockData = require('../../mocks/data')

const { update } = require('../../../app/repositories/document-log-repository')
jest.mock('../../../app/repositories/document-log-repository')

const { sendFarmerApplicationEmail } = require('../../../app/email/notify-send')
jest.mock('../../../app/email/notify-send')

const consoleError = jest.spyOn(console, 'error')

describe('update email status', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date(2020, 1, 1))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('update email status - delivered', async () => {
    await updateEmailStatus(mockData, DELIVERED)
    expect(update).toHaveBeenCalledWith(mockData.reference, { status: EMAIL_DELIVERED, completed: new Date() })
  })

  test('update email status - permanent failure', async () => {
    await updateEmailStatus(mockData, PERMANENT_FAILURE)
    expect(update).toHaveBeenCalledWith(mockData.reference, { status: INVALID_EMAIL, completed: new Date() })
  })

  test('update email status - temporary failure', async () => {
    await updateEmailStatus(mockData, TEMPORARY_FAILURE)
    expect(update).toHaveBeenCalledWith(mockData.reference, { status: DELIVERY_FAILED, completed: new Date() })
  })

  test('update email status - technical failure', async () => {
    await updateEmailStatus(mockData, TECHNICAL_FAILURE)
    expect(update).toHaveBeenCalledWith(mockData.reference, { status: NOTIFY_ERROR_RESEND })
    expect(sendFarmerApplicationEmail).toHaveBeenCalledTimes(1)
  })

  test('update email status - unkown', async () => {
    await updateEmailStatus(mockData, 'unknown')
    expect(consoleError).toHaveBeenCalledTimes(1)
  })
})
