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

jest.mock('../../../app/config/notify', () => ({
  ...jest.requireActual('../../../app/config/notify'),
  carbonCopyEmailAddress: undefined,
  notifyApiKey: 'mockNotifyApiKey',
  notfiyCheckInterval: 30000,
  templateIdFarmerApplicationGeneration: 'mockTemplateIdFarmerApplicationGeneration',
  templateIdFarmerApplicationGenerationNewUser: 'mockTemplateIdFarmerApplicationGenerationNewUser',
  templateIdFarmerApplicationGenerationExistingUser: 'mockTemplateIdFarmerApplicationGenerationExistingUser'
}))

const notifyClient = require('../../../app/email/notify-client')
jest.mock('../../../app/email/notify-client')

jest.mock('applicationinsights', () => ({ defaultClient: { trackException: jest.fn(), trackEvent: jest.fn() }, dispose: jest.fn() }))

const { setEndemicsEnabled } = require('../../mocks/config')

const { sendFarmerApplicationEmail, sendCarbonCopy, sendEmail } = require('../../../app/email/notify-send')

const consoleLog = jest.spyOn(console, 'log')
const consoleError = jest.spyOn(console, 'error')

const notifyResponseId = '123456789'
const personalisation = { reference: '123abc' }
const carbonCopyEmailAddress = 'test@example.com'
const templateId = 'template-id'
const mockEmailAddress = 'mockEmail@mock.com'

describe('sendEmail', () => {
  test('send email succesfully', async () => {
    notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
    notifyClient.sendEmail.mockResolvedValue({ data: { id: notifyResponseId } })
    const response = await sendEmail(mockEmailAddress, personalisation, notifyResponseId, templateId)
    expect(consoleLog).toHaveBeenNthCalledWith(1, `Received email to send to ${mockEmailAddress} for ${notifyResponseId}`)
    expect(consoleLog).toHaveBeenNthCalledWith(2, `Email sent to ${mockEmailAddress} for ${notifyResponseId}`)
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
  describe('endemics ennable true', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      // setEndemicsEnabled(true)
    })

    test('send farmer application email - successful email send', async () => {
      notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
      notifyClient.sendEmail.mockResolvedValue({ data: { id: notifyResponseId } })
      const response = await sendFarmerApplicationEmail(mockData, Buffer.from('test').toString('base64'))
      expect(consoleLog).toHaveBeenNthCalledWith(1, `Sending email for ${mockDocumentRequest.reference}`)
      expect(consoleLog).toHaveBeenNthCalledWith(2, `File contents for ${mockDocumentRequest.whichSpecies}/${mockUser.sbi}/${mockDocumentRequest.reference}.pdf downloaded`)
      expect(consoleLog).toHaveBeenNthCalledWith(3, `Received email to send to ${mockUser.orgEmail} for ${mockDocumentRequest.reference}`)
      expect(consoleLog).toHaveBeenNthCalledWith(4, `Email sent to ${mockUser.orgEmail} for ${mockDocumentRequest.reference}`)
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

    test('send farmer application email - successful email send', async () => {
      const mockBlob = 'mockBlob'
      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockResolvedValue(true)

      const response = await sendFarmerApplicationEmail(mockData, mockBlob)

      expect(consoleLog).toHaveBeenNthCalledWith(1, `Sending email for ${mockData.reference}`)
      expect(notifyClient.prepareUpload).toHaveBeenCalledWith(mockBlob)
      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(1)
      expect(response).toEqual(true)
    })

    test('sendFarmerApplicationEmail should use mockTemplateIdFarmerApplicationGenerationNewUser when newUser', async () => {
      const mockBlob = 'mockBlob'
      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockResolvedValue(true)

      const response = await sendFarmerApplicationEmail({ ...mockData, userType: NEW_USER }, mockBlob)

      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(1)
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

      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(1)
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

      expect(consoleLog).toHaveBeenNthCalledWith(1, `Sending email for ${mockData.reference}`)
      expect(consoleLog).toHaveBeenNthCalledWith(2, `File contents for ${mockDocumentRequest.whichSpecies}/${mockUser.sbi}/${mockDocumentRequest.reference}.pdf downloaded`)
      expect(notifyClient.prepareUpload).toHaveBeenCalledWith(mockBlob)
      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(1)
      expect(response).toEqual(true)
    })

    test('send farmer application email - error raised', async () => {
      const mockData = {
        reference: 'mockReference',
        name: 'mockName',
        email: 'mockEmail',
        orgEmail: 'mockOrgEmail',
        userType: 'mockUserType'
      }
      const mockBlob = 'mockBlob'

      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockRejectedValue(new Error())

      const response = await sendFarmerApplicationEmail(mockData, mockBlob)

      expect(consoleError).toHaveBeenCalledWith(`Error occurred sending email to ${mockData.orgEmail} for ${mockData.reference}. Error: undefined`)
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

      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(1)
      expect(notifyClient.sendEmail).toHaveBeenCalledWith(
        'mockTemplateIdFarmerApplicationGeneration',
        expect.anything(),
        expect.anything()
      )
      expect(response).toEqual(true)
    })
  })
})
