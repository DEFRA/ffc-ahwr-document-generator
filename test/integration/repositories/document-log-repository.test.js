const db = require('../../../app/data')
const { checkEmailDelivered, set, update } = require('../../../app/repositories/document-log-repository')
const createFileName = require('../../../app/document/create-filename')
const mockDocumentRequest = require('../../mocks/document-request')
const { DOCUMENT_CREATED, EMAIL_DELIVERED } = require('../../../app/statuses')

describe('document log db', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 15, 30, 10, 120))

    await db.sequelize.truncate({ cascade: true })
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('add new document log', async () => {
    const fileName = createFileName(mockDocumentRequest)
    const results = await set(mockDocumentRequest, fileName)
    expect(results.status).toEqual(DOCUMENT_CREATED)
    expect(results.fileName).toBe(fileName)
  })

  test('check if email delivered and return 1 result with status of document-created', async () => {
    const fileName = createFileName(mockDocumentRequest)
    await set(mockDocumentRequest, fileName)
    const results = await checkEmailDelivered()
    expect(results.length).toBe(1)
    expect(results[0].reference).toEqual(mockDocumentRequest.reference)
    expect(results[0].sbi).toEqual(mockDocumentRequest.sbi)
    expect(results[0].fileName).toBe(fileName)
  })

  test('Update status to email-delivered and check if email delivered returns 0', async () => {
    await update(mockDocumentRequest.reference, { status: EMAIL_DELIVERED, completed: new Date() })
    const results = await checkEmailDelivered()
    expect(results.length).toBe(0)
  })
})
