import { requestFarmerApplicationEmail } from '../../../app/email/request-email.js'
import { validateDocumentRequest } from '../../../app/messaging/document-request-schema'
import { mockDocumentRequest } from '../../mocks/data'
import { processDocumentRequest } from '../../../app/messaging/process-document-request'
import { generateDocument } from '../../../app/document'

jest.mock('ffc-messaging')
jest.mock('../../../app/data')
jest.mock('../../../app/email/request-email.js')
jest.mock('../../../app/messaging/document-request-schema')
jest.mock('../../../app/document')
jest.mock('../../../app/getDirName', () => ({
  getDirName: () => 'dir/'
}))

const mockLogger = {
  error: jest.fn(),
  info: jest.fn(),
  setBindings: jest.fn()
}

generateDocument.mockImplementation(jest.fn().mockResolvedValue({ blob: 'something' }))

let receiver

describe('process document request message', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    requestFarmerApplicationEmail.mockImplementation()
    receiver = {
      completeMessage: jest.fn(),
      deadLetterMessage: jest.fn()
    }
  })

  test('completes message on success', async () => {
    validateDocumentRequest.mockReturnValue(true)
    generateDocument.mockImplementation(jest.fn().mockResolvedValue({ blob: Buffer.from('test').toString('base64') }))

    const message = {
      body: mockDocumentRequest
    }

    await processDocumentRequest(mockLogger, message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('dead-letters message on error', async () => {
    validateDocumentRequest.mockImplementation(() => { throw new Error() })
    const message = {
      body: mockDocumentRequest
    }
    await processDocumentRequest(mockLogger, message, receiver)

    expect(validateDocumentRequest).toBeCalled()
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })

  test('dead-letters message on validation fail', async () => {
    validateDocumentRequest.mockReturnValueOnce(false)
    const message = {
      body: mockDocumentRequest
    }
    await processDocumentRequest(mockLogger, message, receiver)

    expect(validateDocumentRequest).toBeCalled()
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })
})
