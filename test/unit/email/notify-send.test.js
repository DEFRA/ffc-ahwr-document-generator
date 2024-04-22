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

const { sendFarmerApplicationEmail, sendCarbonCopy } = require('../../../app/email/notify-send')
const { endemics } = require('../../../app/config')

const consoleLog = jest.spyOn(console, 'log')
const consoleError = jest.spyOn(console, 'error')

const notifyResponseId = '123456789'
const personalisation = { reference: '123abc' }
const carbonCopyEmailAddress = 'test@example.com'
const templateId = 'template-id'

describe('notify send email messages', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('send farmer application email - successful email send', async () => {
    notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
    notifyClient.sendEmail.mockResolvedValue({ data: { id: notifyResponseId } })
    const response = await sendFarmerApplicationEmail(mockData, Buffer.from('test').toString('base64'))

    expect(consoleLog).toHaveBeenNthCalledWith(2, `File contents for ${mockDocumentRequest.whichSpecies}/${mockUser.sbi}/${mockDocumentRequest.reference}.pdf downloaded`)
    expect(consoleLog).toHaveBeenNthCalledWith(3, 'endemics enabled', endemics.enabled)
    expect(consoleLog).toHaveBeenNthCalledWith(4, `Received email to send to ${mockUser.orgEmail} for ${mockDocumentRequest.reference}`)
    expect(consoleLog).toHaveBeenNthCalledWith(5, `Email sent to ${mockUser.orgEmail} for ${mockDocumentRequest.reference}`)
    expect(response).toEqual(true)
  })

  test('send farmer application email - successful email send when org email does not exist', async () => {
    notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
    notifyClient.sendEmail.mockResolvedValue({ data: { id: notifyResponseId } })
    const response = await sendFarmerApplicationEmail({ ...mockData, orgEmail: undefined }, Buffer.from('test').toString('base64'))
    expect(consoleLog).toHaveBeenNthCalledWith(1, `Sending email for ${mockDocumentRequest.reference}`)
    expect(consoleLog).toHaveBeenNthCalledWith(2, `File contents for ${mockDocumentRequest.whichSpecies}/${mockUser.sbi}/${mockDocumentRequest.reference}.pdf downloaded`)
    expect(consoleLog).toHaveBeenNthCalledWith(3, `Received email to send to ${mockUser.email} for ${mockDocumentRequest.reference}`)
    expect(consoleLog).toHaveBeenNthCalledWith(4, `Email sent to ${mockUser.email} for ${mockDocumentRequest.reference}`)
    expect(response).toEqual(true)
  })

  test('send farmer application email - error raised', async () => {
    notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
    notifyClient.sendEmail.mockImplementation(() => { throw new Error() })
    const response = await sendFarmerApplicationEmail(mockData, Buffer.from('test').toString('base64'))
    expect(consoleError).toHaveBeenCalledWith(`Error occurred sending email to ${mockUser.orgEmail} for ${mockDocumentRequest.reference}. Error: undefined`)
    expect(response).toEqual(false)
  })

  test('send carbon copy email - successful email', async () => {
    notifyClient.sendEmail.mockResolvedValue({ data: { id: notifyResponseId } })
    await sendCarbonCopy(templateId, personalisation, carbonCopyEmailAddress)
    expect(consoleLog).toHaveBeenNthCalledWith(1, `Received email to send to ${carbonCopyEmailAddress} for ${personalisation.reference}`)
    expect(consoleLog).toHaveBeenNthCalledWith(2, `Carbon copy email sent to ${carbonCopyEmailAddress} for ${personalisation.reference}`)
  })

  test('does not send carbon copy email when no carbon copy email address', async () => {
    await sendCarbonCopy(templateId, personalisation)

    expect(notifyClient.sendEmail).not.toHaveBeenCalled()
  })

  test('send carbon copy email - error raised', async () => {
    notifyClient.sendEmail.mockImplementation(() => { throw new Error() })
    await sendCarbonCopy(templateId, personalisation, carbonCopyEmailAddress)
    expect(consoleError).toHaveBeenCalledWith(`Error occurred sending carbon email to ${carbonCopyEmailAddress} for ${personalisation.reference}. Error: undefined`)
  })
})
