const { DELIVERED } = require('../../../app/email/notify-statuses')
const mockGetNotificationById = jest.fn().mockResolvedValue({ data: { status: DELIVERED } })
jest.mock('notifications-node-client', () => {
  return {
    NotifyClient: jest.fn().mockImplementation(() => {
      return {
        getNotificationById: mockGetNotificationById
      }
    })
  }
})

const checkDeliveryStatus = require('../../../app/email/notify-status')
const { requestedDelivery } = require('../../mocks/notify-delivery-status')

const reference = requestedDelivery.reference

describe('check delivery status', () => {
  test('calls notify endpoint once', async () => {
    await checkDeliveryStatus(reference)
    expect(mockGetNotificationById).toHaveBeenCalledTimes(1)
  })

  test('calls notify endpoint with reference', async () => {
    await checkDeliveryStatus(reference)
    expect(mockGetNotificationById).toHaveBeenCalledWith(reference)
  })

  test('returns delivery status', async () => {
    const result = await checkDeliveryStatus(reference)
    expect(result).toStrictEqual(DELIVERED)
  })
})
