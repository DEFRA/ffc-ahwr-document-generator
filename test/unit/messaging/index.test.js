import { appConfig } from '../../../app/config'
import { startMessaging, stopMessaging } from '../../../app/messaging'
import { MessageReceiver } from 'ffc-messaging'

jest.mock('ffc-messaging')
jest.mock('../../../app/messaging/process-document-request', () => ({
  processDocumentRequest: jest.fn()
}))

const mockSubscribe = jest.fn().mockResolvedValue(true)
const mockLogger = {
  info: jest.fn(),
  error: jest.fn()
}

const mockClose = jest.fn()
MessageReceiver.prototype.subscribe = mockSubscribe
MessageReceiver.prototype.closeConnection = mockClose

const constructorSpy = jest.spyOn(
  require('ffc-messaging'),
  'MessageReceiver'
)

describe('startMessaging', () => {
  test('it instantiates the message receiver and subscribes to messages', async () => {
    await startMessaging(mockLogger)
    expect(constructorSpy).toHaveBeenCalledWith(appConfig.messageQueueConfig.applicationDocCreationRequestQueue, expect.any(Function))
    expect(mockSubscribe).toHaveBeenCalled()
  })

  test('successfully stopped receivers', async () => {
    await stopMessaging()
    expect(mockClose).toHaveBeenCalledTimes(1)
  })
})
