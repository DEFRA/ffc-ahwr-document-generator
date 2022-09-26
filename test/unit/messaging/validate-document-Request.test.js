const { validateDocumentRequest } = require('../../../app/messaging/document-request-schema')

describe('validate message body of the document request', () => {
  let documentRequest

  beforeEach(() => {
    documentRequest = {
      reference: 'AHWR-1234-5678',
      sbi: '123456789',
      whichSpecies: 'beef',
      startDate: new Date()
    }

    jest.resetAllMocks()
  })

  test('document request message is valid and returns true', async () => {
    const validationResponse = validateDocumentRequest(documentRequest)
    expect(validationResponse).toEqual(true)
  })

  test('document request message is invalid and returns false - empty request', async () => {
    documentRequest = {}
    const validationResponse = validateDocumentRequest(documentRequest)
    expect(validationResponse).toEqual(false)
  })

  test('document request message is invalid and returns false - no feference', async () => {
    documentRequest.reference = null
    const validationResponse = validateDocumentRequest(documentRequest)
    expect(validationResponse).toEqual(false)
  })

  test('document request message is invalid and returns false - no sbi', async () => {
    documentRequest.sbi = null
    const validationResponse = validateDocumentRequest(documentRequest)
    expect(validationResponse).toEqual(false)
  })

  test('document request message is invalid and returns false - no whichSpecies', async () => {
    documentRequest.sbi = null
    const validationResponse = validateDocumentRequest(documentRequest)
    expect(validationResponse).toEqual(false)
  })

  test('document request message is invalid and returns false - no startDate', async () => {
    documentRequest.startDate = null
    const validationResponse = validateDocumentRequest(documentRequest)
    expect(validationResponse).toEqual(false)
  })
})
