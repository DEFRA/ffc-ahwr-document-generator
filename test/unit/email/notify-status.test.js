import { NOTIFY_STATUSES } from '../../../app/constants'
import { checkDeliveryStatus } from '../../../app/email/notify-status'
import { requestedDelivery } from '../../mocks/notify-delivery-status'
import { notifyClient } from '../../../app/email/notify-client'

jest.mock('../../../app/email/notify-client')

const reference = requestedDelivery.reference

describe('check delivery status', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('calls notify endpoint once', async () => {
    const mockGetNotificationById = jest.fn().mockResolvedValueOnce({ data: { status: NOTIFY_STATUSES.DELIVERED } })
    notifyClient.getNotificationById = mockGetNotificationById

    const result = await checkDeliveryStatus(reference)
    expect(mockGetNotificationById).toHaveBeenCalledTimes(1)
    expect(mockGetNotificationById).toHaveBeenCalledWith(reference)
    expect(result).toStrictEqual(NOTIFY_STATUSES.DELIVERED)
  })
})
