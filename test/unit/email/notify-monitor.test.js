import { start } from '../../../app/email/notify-monitor'
import { NOTIFY_STATUSES } from '../../../app/constants'
import { checkEmailDelivered } from '../../../app/repositories/document-log-repository'
import { checkDeliveryStatus } from '../../../app/email/notify-status'
import { updateEmailStatus } from '.../../../app/email/update-email-status'

jest.mock('.../../../app/email/update-email-status')
jest.mock('.../../../app/email/notify-status')
jest.mock('../../../app/repositories/document-log-repository')

const emailReference = '123456789'

describe('run notify monitor', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.useRealTimers()
    jest.resetAllMocks()
  })

  test('check for messages and check status', async () => {
    checkEmailDelivered.mockResolvedValue([{ emailReference }])
    checkDeliveryStatus.mockResolvedValue(NOTIFY_STATUSES.DELIVERED)

    await start()

    expect(checkDeliveryStatus).toHaveBeenCalledTimes(1)
    expect(checkEmailDelivered).toHaveBeenCalledTimes(1)
    expect(updateEmailStatus).toHaveBeenCalledTimes(1)
  })

  test('check for messages and skip null email reference', async () => {
    checkEmailDelivered.mockResolvedValue([{ emailReference: null }])

    await start()

    expect(checkDeliveryStatus).toHaveBeenCalledTimes(0)
    expect(checkEmailDelivered).toHaveBeenCalledTimes(1)
    expect(updateEmailStatus).toHaveBeenCalledTimes(0)
  })
})
