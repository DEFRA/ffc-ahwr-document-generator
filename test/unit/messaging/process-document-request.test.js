import { sendFarmerApplicationEmail } from '../../../app/email/notify-send'
import { validateDocumentRequest } from '../../../app/messaging/document-request-schema'
import { mockDocumentRequest } from '../../mocks/data'
import { processDocumentRequest } from '../../../app/messaging/process-document-request'
import { generateDocument } from '../../../app/document'

jest.mock('ffc-messaging')
jest.mock('../../../app/data')
jest.mock('../../../app/email/notify-send')
jest.mock('../../../app/messaging/document-request-schema')
jest.mock('../../../app/document')
jest.mock('../../../app/getDirName', () => ({
  getDirName: () => 'dir/'
}))

generateDocument.mockImplementation(jest.fn().mockResolvedValue({ blob: 'something' }))

let receiver

describe('process document request message', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    sendFarmerApplicationEmail.mockImplementation()
    receiver = {
      completeMessage: jest.fn(),
      deadLetterMessage: jest.fn()
    }
  })

  test('completes message on success', async () => {
    validateDocumentRequest.mockReturnValue(true)
    generateDocument.mockImplementation(jest.fn().mockResolvedValue('filename', Buffer.from('test').toString('base64')))

    const message = {
      body: mockDocumentRequest
    }

    await processDocumentRequest(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('deadletters message on error', async () => {
    validateDocumentRequest.mockImplementation(() => { throw new Error() })
    const message = {
      body: mockDocumentRequest
    }
    await processDocumentRequest(message, receiver)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })
})
