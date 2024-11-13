jest.resetAllMocks()
const { NEW_USER, EXISTING_USER } = require('../../../app/config/constant')
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

const sfdSendMock = require('../../../app/email/sfd-client')
jest.mock('../../../app/email/sfd-client')

jest.mock('applicationinsights', () => ({ defaultClient: { trackException: jest.fn(), trackEvent: jest.fn() }, dispose: jest.fn() }))

const { setEndemicsEnabled } = require('../../mocks/config')
const { sendFarmerApplicationEmail, sendCarbonCopy, sendEmail } = require('../../../app/email/notify-send')
const conf = require('../../../app/config')

const consoleLog = jest.spyOn(console, 'log')
const consoleError = jest.spyOn(console, 'error')

const notifyResponseId = '123456789'
let personalisation = { reference: '123abc', crn: 'someCrn', sbi: 'someSbi' }
const templateId = 'template-id'
const mockEmailAddress = 'mockEmail@mock.com'

describe('sendEmail', () => {
  beforeEach(() => {
    conf.sfdMessage.enabled = false
    personalisation = { reference: '123abc', crn: 'someCrn', sbi: 'someSbi' }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('send email successfully', async () => {
    notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
    notifyClient.sendEmail.mockResolvedValue({ data: { id: notifyResponseId } })
    const response = await sendEmail(mockEmailAddress, personalisation, notifyResponseId, templateId)
    expect(consoleLog).toHaveBeenNthCalledWith(1, `Received email to send to ${mockEmailAddress} for ${notifyResponseId}`)
    expect(consoleLog).toHaveBeenNthCalledWith(2, `Email sent to ${mockEmailAddress} for ${notifyResponseId}`)
    expect(response).toEqual(true)
    expect(sfdSendMock).toHaveBeenCalledTimes(0)
  })
  test('send email successfully via SFD route', async () => {
    conf.sfdMessage.enabled = true
    const response = await sendEmail(mockEmailAddress, personalisation, notifyResponseId, templateId)
    expect(sfdSendMock).toHaveBeenCalledWith(
      'template-id', 'mockEmail@mock.com', { personalisation: { reference: '123abc' }, reference: '123456789' }, 'someCrn', 'someSbi'
    )
    expect(consoleLog).toHaveBeenNthCalledWith(2, 'Request sent to sfd message proxy for 123456789')
    expect(response).toEqual(true)
  })

  test('send email fail', async () => {
    notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
    notifyClient.sendEmail.mockImplementation(() => { throw new Error() })
    const response = await sendEmail(mockEmailAddress, personalisation, notifyResponseId, templateId)
    expect(consoleError).toHaveBeenNthCalledWith(1, `Error occurred sending email to ${mockEmailAddress} for ${notifyResponseId}. Error: undefined`)
    expect(consoleLog).toHaveBeenNthCalledWith(1, `Received email to send to ${mockEmailAddress} for ${notifyResponseId}`)
    expect(response).toEqual(false)
  })
})

describe('notify send email messages', () => {
  describe('endemics enabled true', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      setEndemicsEnabled(true)
    })

    test('send farmer application email - successful email send', async () => {
      notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
      notifyClient.sendEmail.mockResolvedValue({ data: { id: notifyResponseId } })
      const response = await sendFarmerApplicationEmail(mockData, Buffer.from('test').toString('base64'))
      expect(consoleLog).toHaveBeenCalledTimes(6)
      expect(response).toEqual(true)
    })

    test('send farmer application email - successful email send when org email does not exist', async () => {
      notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
      notifyClient.sendEmail.mockResolvedValue({ data: { id: notifyResponseId } })
      const response = await sendFarmerApplicationEmail({ ...mockData, orgEmail: undefined }, Buffer.from('test').toString('base64'))
      expect(consoleLog).toHaveBeenCalledTimes(2)
      expect(response).toEqual(true)
    })

    test('send farmer application email - error raised', async () => {
      notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
      notifyClient.sendEmail.mockImplementation(() => { throw new Error() })
      const response = await sendFarmerApplicationEmail(mockData, Buffer.from('test').toString('base64'))
      expect(consoleError).toHaveBeenCalledWith(`Error occurred sending email to ${mockUser.orgEmail} for ${mockDocumentRequest.reference}. Error: undefined`)
      expect(response).toEqual(false)
    })

    test('send carbon copy email - not called Carbon copy email is undefined', async () => {
      notifyClient.sendEmail.mockResolvedValue({ data: { id: notifyResponseId } })
      await sendCarbonCopy(templateId, personalisation)
      expect(consoleLog).toHaveBeenCalledTimes(0)
    })

    test('does not send carbon copy email when no carbon copy email address', async () => {
      await sendCarbonCopy(templateId, personalisation)

      expect(notifyClient.sendEmail).not.toHaveBeenCalled()
    })

    test('send carbon copy email - error raised', async () => {
      notifyClient.sendEmail.mockImplementation(() => { throw new Error() })
      await sendCarbonCopy(templateId, personalisation)
      expect(notifyClient.sendEmail).not.toHaveBeenCalled()
      expect(consoleLog).not.toHaveBeenCalled()
    })

    test('send farmer application email - successful email send', async () => {
      const mockBlob = 'mockBlob'
      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockResolvedValue(true)

      const response = await sendFarmerApplicationEmail(mockData, mockBlob)

      expect(consoleLog).toHaveBeenCalledTimes(6)
      expect(notifyClient.prepareUpload).toHaveBeenCalledWith(mockBlob)
      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(2)
      expect(response).toEqual(true)
    })

    test('sendFarmerApplicationEmail should use mockTemplateIdFarmerApplicationGenerationNewUser when newUser', async () => {
      const mockBlob = 'mockBlob'
      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockResolvedValue(true)

      const response = await sendFarmerApplicationEmail({ ...mockData, userType: NEW_USER }, mockBlob)

      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(2)
      expect(notifyClient.sendEmail).toHaveBeenCalledWith(
        'mockTemplateIdFarmerApplicationGenerationNewUser',
        expect.anything(),
        expect.anything()
      )
      expect(response).toEqual(true)
    })

    test('sendFarmerApplicationEmail should use mockTemplateIdFarmerApplicationGenerationExitingUser when not newUser', async () => {
      const mockBlob = 'mockBlob'
      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockResolvedValue(true)

      const response = await sendFarmerApplicationEmail({ ...mockData, userType: EXISTING_USER }, mockBlob)

      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(2)
      expect(notifyClient.sendEmail).toHaveBeenCalledWith(
        'mockTemplateIdFarmerApplicationGenerationExistingUser',
        expect.anything(),
        expect.anything()
      )
      expect(response).toEqual(true)
    })

    test('send farmer application email - successful email send when org email does not exist', async () => {
      const mockBlob = 'mockBlob'

      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockResolvedValue(true)

      const response = await sendFarmerApplicationEmail(mockData, mockBlob)
      expect(consoleLog).toHaveBeenCalledTimes(6)
      expect(notifyClient.prepareUpload).toHaveBeenCalledWith(mockBlob)
      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(2)
      expect(response).toEqual(true)
    })

    test('send farmer application email - error raised', async () => {
      const mockBlob = 'mockBlob'

      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockRejectedValue(new Error())

      const response = await sendFarmerApplicationEmail(mockData, mockBlob)

      expect(consoleError).toHaveBeenCalledWith(`Error occurred sending email to ${mockData.orgEmail} for ${mockData.reference}. Error: undefined`)
      expect(consoleError).toHaveBeenCalledWith(`Error occurred sending email to ${mockData.email} for ${mockData.reference}. Error: undefined`)
      expect(response).toEqual(false)
    })
  })

  describe('endemics enamble false', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      setEndemicsEnabled(false)
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    test('sendFarmerApplicationEmail should use templateIdFarmerApplicationGeneration', async () => {
      const mockBlob = 'mockBlob'
      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockResolvedValue(true)

      const response = await sendFarmerApplicationEmail(mockData, mockBlob)

      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(2)
      expect(notifyClient.sendEmail).toHaveBeenCalledWith(
        'mockTemplateIdFarmerApplicationGeneration',
        expect.anything(),
        expect.anything()
      )
      expect(response).toEqual(true)
    })
  })
})
