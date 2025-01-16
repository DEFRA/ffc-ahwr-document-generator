import { appConfig } from '../../../app/config'
import { startMessaging } from '../../../app/messaging'
import { MessageReceiver } from 'ffc-messaging'

const mockSubscribe = jest.fn().mockResolvedValue(true)
jest.mock('ffc-messaging')
MessageReceiver.subscribe = mockSubscribe

const constructorSpy = jest.spyOn(
  require('ffc-messaging'),
  'MessageReceiver'
).mockImplementation(() => ({
  subscribe: mockSubscribe
}))

jest.mock('../../../app/messaging/process-document-request', () => ({
  processDocumentRequest: jest.fn()
}))

describe('startMessaging', () => {
  test('it instantiates the message receiver and subscribes to messages', async () => {
    await startMessaging()
    expect(constructorSpy).toHaveBeenCalledWith(appConfig.messageQueueConfig.applicationDocCreationRequestQueue, expect.any(Function))
    expect(mockSubscribe).toHaveBeenCalled()
  })
})
