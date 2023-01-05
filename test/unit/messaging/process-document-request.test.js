jest.mock('ffc-messaging')
jest.mock('../../../app/data')

const mockDocumentGenerator = jest.fn()
jest.mock('../../../app/document', () => {
  return mockDocumentGenerator
})

const mockNotify = require('../../../app/email/notify-send')
jest.mock('../../../app/email/notify-send')

const mockValidation = require('../../../app/messaging/document-request-schema')
jest.mock('../../../app/messaging/document-request-schema')

const mockDocumentRequest = require('../../mocks/document-request')
const processDocumentRequest = require('../../../app/messaging/process-document-request')

let receiver

describe('process document request message', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockNotify.sendFarmerApplicationEmail = jest.fn()
    receiver = {
      completeMessage: jest.fn(),
      deadLetterMessage: jest.fn()
    }
  })

  test('completes message on success', async () => {
    mockValidation.validateDocumentRequest.mockReturnValue(true)

    const message = {
      body: mockDocumentRequest
    }

    await processDocumentRequest(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('deadletters message on error', async () => {
    mockValidation.validateDocumentRequest.mockImplementation(() => { throw new Error() })
    const message = {
      body: mockDocumentRequest
    }
    await processDocumentRequest(message, receiver)
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })
})
