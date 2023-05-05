
const mockData = require('../../mocks/data')
const mockUser = require('../../mocks/user')
const mockDocumentRequest = require('../../mocks/document-request')
const { SEND_FAILED } = require('../../../app/email/notify-statuses')

const { downloadBlob } = require('../../../app/storage')
jest.mock('../../../app/storage')

const MOCK_NOW = new Date(2022, 7, 5, 15, 30, 10, 120)
const MOCK_UPDATE = jest.fn()

jest.mock('../../../app/repositories/document-log-repository', () => {
  return {
    update: MOCK_UPDATE
  }
})

jest.mock('../../../app/config', () => ({
  storageConfig: {},
  notifyConfig: {
    notifyApiKey: 'fake_api_key'
  }
}))

const notifyClient = require('../../../app/email/notify-client')
jest.mock('../../../app/email/notify-client')

const { sendFarmerApplicationEmail } = require('../../../app/email/notify-send')

const consoleLog = jest.spyOn(console, 'log')
const consoleError = jest.spyOn(console, 'error')

const notifyResponseId = '123456789'

describe('notify send email messages', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(MOCK_NOW)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('send farmer application email - successful email send', async () => {
    notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
    notifyClient.sendEmail.mockResolvedValue({ data: { id: notifyResponseId } })
    downloadBlob.mockResolvedValue(mockData)
    await sendFarmerApplicationEmail(mockData)
    expect(consoleLog).toHaveBeenNthCalledWith(1, `File contents for ${mockDocumentRequest.whichSpecies}/${mockUser.sbi}/${mockDocumentRequest.reference}.pdf downloaded`)
    expect(consoleLog).toHaveBeenNthCalledWith(2, `Sending email to: ${JSON.stringify({
      email: mockUser.email,
      reference: mockDocumentRequest.reference
    })}`)
    expect(consoleLog).toHaveBeenNthCalledWith(3, `Email sent to: ${JSON.stringify({
      email: mockUser.email,
      reference: mockDocumentRequest.reference
    })}`)
  })

  test('send farmer application email - error raised', async () => {
    notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
    notifyClient.sendEmail.mockImplementation(() => { throw new Error() })
    downloadBlob.mockResolvedValue(mockData)
    await sendFarmerApplicationEmail(mockData)
    expect(consoleError).toHaveBeenCalledWith(`Error while sending email: ${JSON.stringify({
      email: mockUser.email,
      reference: mockDocumentRequest.reference
    })}`)
    expect(MOCK_UPDATE).toHaveBeenCalledWith('AHWR-1234-5678', {
      status: SEND_FAILED,
      completed: MOCK_NOW
    })
  })
})
