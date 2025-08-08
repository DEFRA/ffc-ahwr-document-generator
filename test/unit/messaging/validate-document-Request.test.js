import { validateDocumentRequest } from '../../../app/messaging/document-request-schema'

const mockLogger = {
  error: jest.fn()
}
describe('validate message body of the document request', () => {
  let endemicsDocumentRequest

  beforeEach(() => {
    endemicsDocumentRequest = {
      reference: 'IAHW-1234-5678',
      crn: '1234567890',
      sbi: '123456789',
      startDate: new Date(),
      userType: 'newUser',
      email: 'lindagodwinc@randomdomain.com.test'
    }

    jest.resetAllMocks()
  })

  test('document request message is valid and returns true', async () => {
    expect(validateDocumentRequest(mockLogger, endemicsDocumentRequest)).toBeTruthy()
  })

  test('document request message is valid including optional valid scheme and returns true', async () => {
    endemicsDocumentRequest.scheme = 'ahwr'
    expect(validateDocumentRequest(mockLogger, endemicsDocumentRequest)).toBeTruthy()
  })

  test('document request message is invalid and returns false - empty request', async () => {
    endemicsDocumentRequest = {}
    const validationResponse = validateDocumentRequest(mockLogger, endemicsDocumentRequest)
    expect(validationResponse).toBeFalsy()
  })

  test('document request message is invalid and returns false - no reference', async () => {
    endemicsDocumentRequest.reference = null
    const validationResponse = validateDocumentRequest(mockLogger, endemicsDocumentRequest)
    expect(validationResponse).toBeFalsy()
  })

  test('document request message is invalid and returns false - no sbi', async () => {
    endemicsDocumentRequest.sbi = null
    const validationResponse = validateDocumentRequest(mockLogger, endemicsDocumentRequest)
    expect(validationResponse).toBeFalsy()
  })

  test('document request message is invalid and returns false - no startDate', async () => {
    endemicsDocumentRequest.startDate = null
    const validationResponse = validateDocumentRequest(mockLogger, endemicsDocumentRequest)
    expect(validationResponse).toBeFalsy()
  })

  test('document request message is invalid and returns false - userType cannot be empty if present', async () => {
    endemicsDocumentRequest.userType = ''
    const validationResponse = validateDocumentRequest(mockLogger, endemicsDocumentRequest)
    expect(validationResponse).toBeFalsy()
  })

  test('document request message is invalid and returns false - invalid scheme', async () => {
    endemicsDocumentRequest.scheme = 'poultry'
    const validationResponse = validateDocumentRequest(mockLogger, endemicsDocumentRequest)
    expect(validationResponse).toBeFalsy()
  })
})
