import { validateDocumentRequest } from '../../../app/messaging/document-request-schema'

describe('validate message body of the document request', () => {
  let documentRequest
  let endemicsDocumentRequest

  beforeEach(() => {
    documentRequest = {
      reference: 'AHWR-1234-5678',
      crn: '1234567890',
      sbi: '123456789',
      whichSpecies: 'beef',
      startDate: new Date(),
      email: 'lindagodwinc@randomdomain.com.test'
    }
    endemicsDocumentRequest = {
      reference: 'AHWR-1234-5678',
      crn: '1234567890',
      sbi: '123456789',
      startDate: new Date(),
      userType: 'newUser',
      email: 'lindagodwinc@randomdomain.com.test'
    }

    jest.resetAllMocks()
  })

  test('document request is invalid returns false', async () => {
    documentRequest.whichSpecies = null
    documentRequest.userType = 'newUser'

    const validationResponse = validateDocumentRequest(documentRequest)
    expect(validationResponse).toEqual(false)
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

  test('document request message is invalid and returns false', async () => {
    endemicsDocumentRequest.userType = ''
    const validationResponse = validateDocumentRequest(endemicsDocumentRequest)
    expect(validationResponse).toBeFalsy()
  })

  test('document request message is valid and returns true', async () => {
    expect(validateDocumentRequest(endemicsDocumentRequest)).toEqual(true)
  })
})
