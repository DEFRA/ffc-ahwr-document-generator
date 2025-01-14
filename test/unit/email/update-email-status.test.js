import { NOTIFY_STATUSES, DOCUMENT_STATUSES } from '../../../app/constants'
import { updateEmailStatus } from '../../../app/email/update-email-status'
import { mockRequest } from '../../mocks/data'
import { update } from '../../../app/repositories/document-log-repository'
import { sendFarmerApplicationEmail } from '../../../app/email/notify-send'

jest.mock('../../../app/repositories/document-log-repository')
jest.mock('../../../app/email/notify-send')

const { DELIVERED, PERMANENT_FAILURE, TEMPORARY_FAILURE, TECHNICAL_FAILURE } = NOTIFY_STATUSES
const { EMAIL_DELIVERED, INVALID_EMAIL, DELIVERY_FAILED, NOTIFY_ERROR_RESEND } = DOCUMENT_STATUSES

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
    await updateEmailStatus(mockRequest, DELIVERED)
    expect(update).toHaveBeenCalledWith(mockRequest.reference, { status: EMAIL_DELIVERED, completed: new Date() })
  })

  test('update email status - permanent failure', async () => {
    await updateEmailStatus(mockRequest, PERMANENT_FAILURE)
    expect(update).toHaveBeenCalledWith(mockRequest.reference, { status: INVALID_EMAIL, completed: new Date() })
  })

  test('update email status - temporary failure', async () => {
    await updateEmailStatus(mockRequest, TEMPORARY_FAILURE)
    expect(update).toHaveBeenCalledWith(mockRequest.reference, { status: DELIVERY_FAILED, completed: new Date() })
  })

  test('update email status - technical failure', async () => {
    await updateEmailStatus(mockRequest, TECHNICAL_FAILURE)
    expect(update).toHaveBeenCalledWith(mockRequest.reference, { status: NOTIFY_ERROR_RESEND })
    expect(sendFarmerApplicationEmail).toHaveBeenCalledTimes(1)
  })

  test('update email status - unkown', async () => {
    await updateEmailStatus(mockRequest, 'unknown')
    expect(consoleError).toHaveBeenCalledTimes(1)
  })
})
