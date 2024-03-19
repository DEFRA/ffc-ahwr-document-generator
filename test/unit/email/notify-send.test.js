
const mockData = require('../../mocks/data')
const mockUser = require('../../mocks/user')
const mockDocumentRequest = require('../../mocks/document-request')

jest.mock('../../../app/repositories/document-log-repository', () => {
  return {
    update: jest.fn()
  }
})

const notifyClient = require('../../../app/email/notify-client')
jest.mock('../../../app/email/notify-client')

jest.mock('applicationinsights', () => ({ defaultClient: { trackException: jest.fn(), trackEvent: jest.fn() }, dispose: jest.fn() }))

const { sendFarmerApplicationEmail } = require('../../../app/email/notify-send')

const consoleLog = jest.spyOn(console, 'log')
const consoleError = jest.spyOn(console, 'error')

const notifyResponseId = '123456789'

describe('notify send email messages', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('send farmer application email - successful email send', async () => {
    notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
    notifyClient.sendEmail.mockResolvedValue({ data: { id: notifyResponseId } })
    const response = await sendFarmerApplicationEmail(mockData, Buffer.from('test').toString('base64'))
    expect(consoleLog).toHaveBeenNthCalledWith(1, `File contents for ${mockDocumentRequest.whichSpecies}/${mockUser.sbi}/${mockDocumentRequest.reference}.pdf downloaded`)
    expect(consoleLog).toHaveBeenNthCalledWith(2, `Received email to send to ${mockUser.orgEmail} for ${mockDocumentRequest.reference}`)
    expect(consoleLog).toHaveBeenNthCalledWith(3, `Received email to send to ${mockUser.email} for ${mockDocumentRequest.reference}`)
    expect(consoleLog).toHaveBeenNthCalledWith(4, `Email sent to ${mockUser.orgEmail} for ${mockDocumentRequest.reference}`)
    expect(consoleLog).toHaveBeenNthCalledWith(5, `Email sent to ${mockUser.email} for ${mockDocumentRequest.reference}`)
    expect(response).toEqual(true)
  })

  test('send farmer application email - error raised', async () => {
    notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
    notifyClient.sendEmail.mockImplementation(() => { throw new Error() })
    const response = await sendFarmerApplicationEmail(mockData, Buffer.from('test').toString('base64'))
    expect(consoleError).toHaveBeenCalledWith(`Error occurred sending email to ${mockUser.email} for ${mockDocumentRequest.reference}. Error: undefined`)
    expect(response).toEqual(false)
  })
})
