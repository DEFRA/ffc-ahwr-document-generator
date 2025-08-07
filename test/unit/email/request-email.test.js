import { NEW_USER, EXISTING_USER } from '../../../app/constants'
import { requestFarmerApplicationEmail } from '../../../app/email/request-email.js'
import { appConfig } from '../../../app/config'
import { sendSFDEmailMessage } from '../../../app/email/sfd-client'
import { mockRequest } from '../../mocks/data'
import { update } from '../../../app/repositories/document-log-repository.js'

const mockLogger = {
  info: jest.fn(),
  error: jest.fn()
}

jest.mock('../../../app/repositories/document-log-repository', () => {
  return {
    update: jest.fn()
  }
})

jest.mock('../../../app/email/sfd-client')
jest.mock('applicationinsights', () => ({ defaultClient: { trackException: jest.fn(), trackEvent: jest.fn() }, dispose: jest.fn() }))

const stockPersonalisations = {
  claim_guidance_uri: 'http://localhost/claim-guidance-for-farmers',
  claim_uri: 'http://localhost',
  guidance_uri: 'http://localhost/guidance-for-farmers',
  name: mockRequest.name,
  reference: mockRequest.reference
}

function getExpectedLinkToFile (blobContent) {
  return {
    link_to_file: {
      confirm_email_before_download: null,
      file: blobContent,
      is_csv: false,
      retention_period: null
    }
  }
}

describe('notify send application email messages', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('should use correct template', () => {
    test('sendFarmerApplicationEmail should use templateIdFarmerApplicationGenerationNewUser when newUser', async () => {
      const mockBlob = 'mockBlob'

      const response = await requestFarmerApplicationEmail(mockLogger, { ...mockRequest, userType: NEW_USER }, mockBlob)

      expect(sendSFDEmailMessage).toHaveBeenCalledWith(mockLogger,
        appConfig.templateIdFarmerApplicationGenerationNewUser,
        mockRequest.email,
        { ...stockPersonalisations, ...getExpectedLinkToFile(mockBlob) },
        mockRequest.reference,
        undefined,
        mockRequest.sbi
      )
      expect(response).toEqual(true)
    })

    test('sendFarmerApplicationEmail should use templateIdFarmerApplicationGenerationExistingUser when existing user', async () => {
      const mockBlob = 'mockBlob'

      const response = await requestFarmerApplicationEmail(mockLogger, { ...mockRequest, userType: EXISTING_USER }, mockBlob)

      expect(sendSFDEmailMessage).toHaveBeenCalledWith(mockLogger,
        appConfig.templateIdFarmerApplicationGenerationExistingUser,
        mockRequest.email,
        { ...stockPersonalisations, ...getExpectedLinkToFile(mockBlob) },
        mockRequest.reference,
        undefined,
        mockRequest.sbi
      )
      expect(response).toEqual(true)
    })

    test('sendFarmerApplicationEmail should use specific templateId when passed in', async () => {
      const mockBlob = 'mockBlob'

      const response = await requestFarmerApplicationEmail(mockLogger, {
        ...mockRequest,
        templateId: appConfig.templateIdFarmerApplicationGenerationExistingUser,
        scheme: 'ahwr'
      }, mockBlob)

      expect(sendSFDEmailMessage).toHaveBeenCalledWith(mockLogger,
        appConfig.templateIdFarmerApplicationGenerationExistingUser,
        mockRequest.email,
        { ...stockPersonalisations, ...getExpectedLinkToFile(mockBlob) },
        mockRequest.reference,
        undefined,
        mockRequest.sbi
      )
      expect(response).toEqual(true)
    })
  })

  describe('should send to correct recipients', () => {
    function expectSendSFDEmailCalledForAddress (emailAddress) {
      expect(sendSFDEmailMessage).toHaveBeenCalledWith(expect.anything(),
        expect.anything(),
        emailAddress,
        expect.anything(),
        expect.anything(),
        undefined,
        expect.anything()
      )
    }

    test('send to just email address when org email address not present', async () => {
      delete appConfig.carbonCopyEmailAddress
      const mockBlob = 'mockBlob'

      await requestFarmerApplicationEmail(mockLogger, { ...mockRequest, orgEmail: undefined }, mockBlob)

      expect(sendSFDEmailMessage).toHaveBeenCalledTimes(1)
      expectSendSFDEmailCalledForAddress(mockRequest.email)

      expect(update).toHaveBeenCalledWith(mockRequest.reference, { status: 'email-requested' })
    })

    test('send to just orgEmail address when email address does not exist', async () => {
      delete appConfig.carbonCopyEmailAddress
      const mockBlob = 'mockBlob'

      await requestFarmerApplicationEmail(mockLogger, { ...mockRequest, email: undefined }, mockBlob)

      expect(sendSFDEmailMessage).toHaveBeenCalledTimes(1)
      expectSendSFDEmailCalledForAddress(mockRequest.orgEmail)

      expect(update).toHaveBeenCalledWith(mockRequest.reference, { status: 'email-requested' })
    })

    test('send only once when email address and orgEmail address both present but the same', async () => {
      delete appConfig.carbonCopyEmailAddress
      const mockBlob = 'mockBlob'

      await requestFarmerApplicationEmail(mockLogger, { ...mockRequest, orgEmail: mockRequest.email }, mockBlob)

      expect(sendSFDEmailMessage).toHaveBeenCalledTimes(1)
      expectSendSFDEmailCalledForAddress(mockRequest.email)

      expect(update).toHaveBeenCalledWith(mockRequest.reference, { status: 'email-requested' })
    })

    test('send to all addresses when CC available and email and orgEmail addresses present and unique', async () => {
      appConfig.carbonCopyEmailAddress = 'cc@address.com'
      const mockBlob = 'mockBlob'

      await requestFarmerApplicationEmail(mockLogger, mockRequest, mockBlob)

      expect(sendSFDEmailMessage).toHaveBeenCalledTimes(3)
      expectSendSFDEmailCalledForAddress(mockRequest.email)
      expectSendSFDEmailCalledForAddress(mockRequest.orgEmail)
      expectSendSFDEmailCalledForAddress(appConfig.carbonCopyEmailAddress)

      expect(update).toHaveBeenCalledWith(mockRequest.reference, { status: 'email-requested' })
    })
  })

  test('send farmer application email returns false when sendEmail throws an error', async () => {
    delete appConfig.carbonCopyEmailAddress
    const mockBlob = 'mockBlob'
    sendSFDEmailMessage.mockRejectedValueOnce(new Error('SFD validation failed'))

    const response = await requestFarmerApplicationEmail(mockLogger, mockRequest, mockBlob)

    expect(sendSFDEmailMessage).toHaveBeenCalledTimes(2)
    expect(response).toEqual(false)
    expect(update).toHaveBeenCalledWith(mockRequest.reference, { status: 'email-request-failed' })
  })
})
