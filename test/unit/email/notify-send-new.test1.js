const notifyClient = require('../../../app/email/notify-client')
const createFileName = require('../../../app/document/create-filename')
const { applyServiceUri, claimServiceUri, endemics } = require('../../../app/config')
const { EMAIL_CREATED } = require('../../../app/statuses')
const { SEND_FAILED } = require('../../../app/email/notify-statuses')
const {
  templateIdFarmerApplicationGeneration,
  templateIdFarmerApplicationGenerationNewUser,
  carbonCopyEmailAddress
} = require('../../../app/config').notifyConfig
const { update } = require('../../../app/repositories/document-log-repository')
const appInsights = require('applicationinsights')
// const { orgEmail } = require('../../test/mocks/user')

jest.mock('../../../app/email/notify-client')
jest.mock('../../../app/document/create-filename')
jest.mock('../../../app/config')
jest.mock('../../../app/statuses')
jest.mock('../../../app/email/notify-statuses')
jest.mock('../../../app/repositories/document-log-repository')
jest.mock('applicationinsights')
jest.mock('../../mocks/user')

const sendModule = require('../../../app/email/notify-send')

describe('notify-send', () => {
  let mockData, mockBlob

  beforeEach(() => {
    mockData = {
      reference: 'ref123',
      userType: 'newUser',
      email: 'user@example.com',
      orgEmail: 'org@example.com',
      name: 'John Doe'
    }
    mockBlob = Buffer.from('test').toString('base64')
    jest.clearAllMocks()
  })

  describe('send', () => {
    test('should log and send email', async () => {
      const mockResponse = { data: { id: 'emailRef' } }
      notifyClient.sendEmail.mockResolvedValueOnce(mockResponse)
      const consoleSpy = jest.spyOn(console, 'log')

      const result = await sendModule.send('templateId', 'email@example.com', { reference: 'ref123' })

      expect(consoleSpy).toHaveBeenCalledWith('Received email to send to email@example.com for ref123')
      expect(notifyClient.sendEmail).toHaveBeenCalledWith('templateId', 'email@example.com', { reference: 'ref123' })
      expect(result).toEqual(mockResponse)
    })

    test('should throw error', async () => {
      const mockError = new Error('Test error')
      notifyClient.sendEmail.mockRejectedValueOnce(mockError)

      await expect(sendModule.send('templateId', 'email@example.com', { reference: 'ref123' })).rejects.toThrow(mockError)
    })
  })

  describe('sendEmail', () => {
    test('should send email successfully', async () => {
      const mockResponse = { data: { id: 'emailRef' } }
      sendModule.send.mockResolvedValueOnce(mockResponse)
      update.mockImplementationOnce(() => {})
      appInsights.defaultClient.trackEvent.mockImplementationOnce(() => {})

      const result = await sendModule.sendEmail('email@example.com', { reference: 'ref123' }, 'ref123', 'templateId')

      expect(sendModule.send).toHaveBeenCalledWith('templateId', 'email@example.com', { personalisation: { reference: 'ref123' }, reference: 'ref123' })
      expect(update).toHaveBeenCalledWith('ref123', { emailReference: 'emailRef', status: EMAIL_CREATED })
      expect(appInsights.defaultClient.trackEvent).toHaveBeenCalledWith({
        name: 'email',
        properties: {
          status: true,
          reference: 'ref123',
          email: 'email@example.com',
          templateId: 'templateId'
        }
      })
      expect(result).toBe(true)
    })

    test('should handle error', async () => {
      const mockError = new Error('Test error')
      mockError.response = { data: 'Error data' }
      sendModule.send.mockRejectedValueOnce(mockError)
      update.mockImplementationOnce(() => {})
      appInsights.defaultClient.trackException.mockImplementationOnce(() => {})
      const consoleSpy = jest.spyOn(console, 'error')

      const result = await sendModule.sendEmail('email@example.com', { reference: 'ref123' }, 'ref123', 'templateId')

      expect(sendModule.send).toHaveBeenCalledWith('templateId', 'email@example.com', { personalisation: { reference: 'ref123' }, reference: 'ref123' })
      expect(update).toHaveBeenCalledWith('ref123', { status: SEND_FAILED })
      expect(appInsights.defaultClient.trackException).toHaveBeenCalledWith({ exception: mockError })
      expect(consoleSpy).toHaveBeenCalledWith('Error occurred sending email to email@example.com for ref123. Error: Error data')
      expect(result).toBe(false)
    })
  })

  describe('sendCarbonCopy', () => {
    test('should send carbon copy email', async () => {
      carbonCopyEmailAddress.mockReturnValueOnce('carbon@example.com')
      sendModule.send.mockResolvedValueOnce()
      const consoleSpy = jest.spyOn(console, 'log')

      await sendModule.sendCarbonCopy('templateId', { reference: 'ref123' })

      expect(sendModule.send).toHaveBeenCalledWith('templateId', 'carbon@example.com', { reference: 'ref123' })
      expect(consoleSpy).toHaveBeenCalledWith('Carbon copy email sent to carbon@example.com for ref123')
    })

    test('should not send carbon copy email if carbonCopyEmailAddress is falsy', async () => {
      carbonCopyEmailAddress.mockReturnValueOnce(null)
      sendModule.send.mockResolvedValueOnce()

      await sendModule.sendCarbonCopy('templateId', { reference: 'ref123' })

      expect(sendModule.send).not.toHaveBeenCalled()
    })

    test('should handle error', async () => {
      const mockError = new Error('Test error')
      mockError.response = { data: 'Error data' }
      carbonCopyEmailAddress.mockReturnValueOnce('carbon@example.com')
      sendModule.send.mockRejectedValueOnce(mockError)
      const consoleSpy = jest.spyOn(console, 'error')

      await sendModule.sendCarbonCopy('templateId', { reference: 'ref123' })

      expect(sendModule.send).toHaveBeenCalledWith('templateId', 'carbon@example.com', { reference: 'ref123' })
      expect(consoleSpy).toHaveBeenCalledWith('Error occurred sending carbon email to carbon@example.com for ref123. Error: Error data')
    })
  })

  describe('sendFarmerApplicationEmail', () => {
    test('should send email to orgEmail and emailAddress', async () => {
      endemics.mockReturnValueOnce({ enabled: true })
      createFileName.mockReturnValueOnce('filename.pdf')
      notifyClient.prepareUpload.mockReturnValueOnce('uploadedBlob')
      sendModule.sendEmail.mockResolvedValueOnce(true)
      sendModule.sendCarbonCopy.mockResolvedValueOnce()
      const consoleSpy = jest.spyOn(console, 'log')

      const result = await sendModule.sendFarmerApplicationEmail(mockData, mockBlob)

      expect(createFileName).toHaveBeenCalledWith(mockData)
      expect(notifyClient.prepareUpload).toHaveBeenCalledWith(mockBlob)
      expect(sendModule.sendCarbonCopy).toHaveBeenCalledWith(templateIdFarmerApplicationGenerationNewUser, {
        name: 'John Doe',
        reference: 'ref123',
        link_to_file: 'uploadedBlob',
        guidance_uri: `${applyServiceUri}/guidance-for-farmers`,
        claim_guidance_uri: `${applyServiceUri}/claim-guidance-for-farmers`,
        claim_uri: claimServiceUri
      })
      expect(sendModule.sendEmail).toHaveBeenCalledTimes(2)
      expect(sendModule.sendEmail).toHaveBeenNthCalledWith(1, 'org@example.com', {
        name: 'John Doe',
        reference: 'ref123',
        link_to_file: 'uploadedBlob',
        guidance_uri: `${applyServiceUri}/guidance-for-farmers`,
        claim_guidance_uri: `${applyServiceUri}/claim-guidance-for-farmers`,
        claim_uri: claimServiceUri
      }, 'ref123', templateIdFarmerApplicationGenerationNewUser)
      expect(sendModule.sendEmail).toHaveBeenNthCalledWith(2, 'user@example.com', {
        name: 'John Doe',
        reference: 'ref123',
        link_to_file: 'uploadedBlob',
        guidance_uri: `${applyServiceUri}/guidance-for-farmers`,
        claim_guidance_uri: `${applyServiceUri}/claim-guidance-for-farmers`,
        claim_uri: claimServiceUri
      }, 'ref123', templateIdFarmerApplicationGenerationNewUser)
      expect(consoleSpy).toHaveBeenCalledTimes(3)
      expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Sending email for ref123 - newUser - user@example.com - org@example.com')
      expect(consoleSpy).toHaveBeenNthCalledWith(2, 'File contents for filename.pdf downloaded')
      expect(consoleSpy).toHaveBeenNthCalledWith(3, 'Carbon copy email sent to carbon@example.com for ref123')
      expect(result).toBe(true)
    })

    test('should send email to orgEmail only', async () => {
      endemics.enabled.mockReturnValueOnce(false)
      createFileName.mockReturnValueOnce('filename.pdf')
      notifyClient.prepareUpload.mockReturnValueOnce('uploadedBlob')
      sendModule.sendEmail.mockResolvedValueOnce(true)
      sendModule.sendCarbonCopy.mockResolvedValueOnce()
      const consoleSpy = jest.spyOn(console, 'log')

      const result = await sendModule.sendFarmerApplicationEmail(mockData, mockBlob)

      expect(createFileName).toHaveBeenCalledWith(mockData)
      expect(notifyClient.prepareUpload).toHaveBeenCalledWith(mockBlob)
      expect(sendModule.sendCarbonCopy).toHaveBeenCalledWith(templateIdFarmerApplicationGeneration, {
        name: 'John Doe',
        reference: 'ref123',
        link_to_file: 'uploadedBlob',
        guidance_uri: `${applyServiceUri}/guidance-for-farmers`,
        claim_guidance_uri: `${applyServiceUri}/claim-guidance-for-farmers`,
        claim_uri: claimServiceUri
      })
      expect(sendModule.sendEmail).toHaveBeenCalledTimes(1)
      expect(consoleSpy).toHaveBeenCalledTimes(0)
      expect(result).toBe(false)
    })
  })
})
