jest.mock('../../app/messaging')
const mockMessaging = require('../../app/messaging')
jest.mock('../../app/email/notify-monitor')
const mockNotifyMonitor = require('../../app/email/notify-monitor')

describe('app', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('starts messaging', async () => {
    await expect(mockMessaging.start).toHaveBeenCalled()
  })

  test('start notify monitor', async () => {
    await expect(mockNotifyMonitor.start).toHaveBeenCalled()
  })
})
