import { NEW_USER, EXISTING_USER } from '../../../app/constants'
import { notifyClient } from '../../../app/email/notify-client'
import { sendFarmerApplicationEmail, sendEmail } from '../../../app/email/notify-send'
import { appConfig } from '../../../app/config'
import { sendSFDEmail } from '../../../app/email/sfd-client'
import { mockRequest } from '../../mocks/data'

const mockLogger = {
  info: jest.fn(),
  error: jest.fn()
}

jest.mock('../../../app/repositories/document-log-repository', () => {
  return {
    update: jest.fn()
  }
})

jest.mock('../../../app/email/notify-client')
jest.mock('../../../app/email/sfd-client')
jest.mock('applicationinsights', () => ({ defaultClient: { trackException: jest.fn(), trackEvent: jest.fn() }, dispose: jest.fn() }))

const notifyResponseId = '123456789'
let personalisation = { reference: '123abc', crn: 'someCrn', sbi: 'someSbi' }
const templateId = 'template-id'
const mockEmailAddress = 'mockEmail@mock.com'

describe('sendEmail', () => {
  beforeEach(() => {
    appConfig.sfdMessage.enabled = false
    personalisation = { reference: '123abc', crn: 'someCrn', sbi: 'someSbi' }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('send email successfully', async () => {
    notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
    notifyClient.sendEmail.mockResolvedValue({ data: { id: notifyResponseId } })
    const response = await sendEmail(mockLogger, mockEmailAddress, personalisation, notifyResponseId, templateId)

    expect(response).toEqual(true)
    expect(sendSFDEmail).toHaveBeenCalledTimes(0)
  })
  test('send email successfully via SFD route', async () => {
    appConfig.sfdMessage.enabled = true
    const response = await sendEmail(mockLogger, mockEmailAddress, personalisation, notifyResponseId, templateId)
    expect(sendSFDEmail).toHaveBeenCalledWith(mockLogger,
      'template-id', 'mockEmail@mock.com', { personalisation: { reference: '123abc' }, reference: '123456789' }, 'someCrn', 'someSbi'
    )
    expect(response).toEqual(true)
  })

  test('returns false when sending email fails', async () => {
    notifyClient.prepareUpload.mockReturnValue(Buffer.from('test').toString('base64'))
    notifyClient.sendEmail.mockImplementation(() => { throw new Error() })
    const response = await sendEmail(mockLogger, mockEmailAddress, personalisation, notifyResponseId, templateId)

    expect(response).toEqual(false)
  })
})

describe('notify send application email messages', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('should use correct template', () => {
    test('sendFarmerApplicationEmail should use templateIdFarmerApplicationGenerationNewUser when newUser', async () => {
      const mockBlob = 'mockBlob'
      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockResolvedValue(true)

      const response = await sendFarmerApplicationEmail(mockLogger, { ...mockRequest, userType: NEW_USER }, mockBlob)

      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(3)
      expect(notifyClient.sendEmail).toHaveBeenCalledWith(
        appConfig.notifyConfig.templateIdFarmerApplicationGenerationNewUser,
        expect.anything(),
        expect.anything()
      )
      expect(response).toEqual(true)
    })

    test('sendFarmerApplicationEmail should use templateIdFarmerApplicationGenerationExistingUser when not newUser', async () => {
      const mockBlob = 'mockBlob'
      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockResolvedValue(true)

      const response = await sendFarmerApplicationEmail(mockLogger, { ...mockRequest, userType: EXISTING_USER }, mockBlob)

      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(3)
      expect(notifyClient.sendEmail).toHaveBeenCalledWith(
        appConfig.notifyConfig.templateIdFarmerApplicationGenerationExistingUser,
        expect.anything(),
        expect.anything()
      )
      expect(response).toEqual(true)
    })
  })

  describe('should send to correct receipients', () => {
    test('send to just email address when org email address not present', async () => {
      delete appConfig.notifyConfig.carbonCopyEmailAddress
      const mockBlob = 'mockBlob'

      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockResolvedValue(true)

      const request = { ...mockRequest, orgEmail: undefined }

      const response = await sendFarmerApplicationEmail(mockLogger, request, mockBlob)
      expect(notifyClient.prepareUpload).toHaveBeenCalledWith(mockBlob)
      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(1)
      expect(response).toEqual(true)
    })

    test('send to just orgEmail address when email address does not exist', async () => {
      delete appConfig.notifyConfig.carbonCopyEmailAddress
      const mockBlob = 'mockBlob'

      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockResolvedValue(true)

      const request = { ...mockRequest, email: undefined }

      const response = await sendFarmerApplicationEmail(mockLogger, request, mockBlob)
      expect(notifyClient.prepareUpload).toHaveBeenCalledWith(mockBlob)
      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(1)
      expect(response).toEqual(true)
    })

    test('send only once when email address and orgEmail address both present but the same', async () => {
      delete appConfig.notifyConfig.carbonCopyEmailAddress
      const mockBlob = 'mockBlob'

      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockResolvedValue(true)

      const request = { ...mockRequest, orgEmail: 'admin@the-dairy.com' }

      const response = await sendFarmerApplicationEmail(mockLogger, request, mockBlob)
      expect(notifyClient.prepareUpload).toHaveBeenCalledWith(mockBlob)
      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(1)
      expect(response).toEqual(true)
    })

    test('send to all addresses when CC available and email and orgEmail addresses present and unique', async () => {
      appConfig.notifyConfig.carbonCopyEmailAddress = 'i_want_it_too@email.com'
      const mockBlob = 'mockBlob'

      notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
      notifyClient.sendEmail.mockResolvedValue(true)

      const request = { ...mockRequest }

      const response = await sendFarmerApplicationEmail(mockLogger, request, mockBlob)
      expect(notifyClient.prepareUpload).toHaveBeenCalledWith(mockBlob)
      expect(notifyClient.sendEmail).toHaveBeenCalledTimes(3)
      expect(response).toEqual(true)
    })
  })

  test('send farmer application email returns false when sendEmail throws an error', async () => {
    const mockBlob = 'mockBlob'

    notifyClient.prepareUpload.mockReturnValue('mockLinkToFile')
    notifyClient.sendEmail.mockRejectedValue(new Error())

    const response = await sendFarmerApplicationEmail(mockLogger, mockRequest, mockBlob)

    expect(response).toEqual(false)
  })
})
