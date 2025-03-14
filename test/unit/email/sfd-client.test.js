import { sendSFDEmailMessage } from '../../../app/email/sfd-client'
import { sendMessage } from '../../../app/messaging/send-message'
jest.mock('../../../app/messaging/send-message')

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}

describe('sendSFDEmail', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('send SFD request successfully', async () => {
    await sendSFDEmailMessage(mockLogger, '99ef9794-67eb-4f18-bb38-541f30f955f8', 'hi@bye.com', {
      someValue: 'someVal'
    }, 'agreementRef', '1110000000', '123456789')

    expect(sendMessage).toHaveBeenCalledTimes(1)
    expect(sendMessage).toHaveBeenCalledWith({
      agreementReference: 'agreementRef',
      crn: '1110000000',
      customParams: {
        someValue: 'someVal'
      },
      dateTime: expect.anything(),
      emailAddress: 'hi@bye.com',
      notifyTemplateId: '99ef9794-67eb-4f18-bb38-541f30f955f8',
      sbi: '123456789'
    },
    'uk.gov.ffc.ahwr.sfd.request', expect.anything())
  })

  test('send SFD request fail', async () => {
    await expect(sendSFDEmailMessage(mockLogger, '99ef9794-67eb-4f18-bb38-541f30f955f8', 'hi@bye.com', {
      reference: 'someRef',
      personalisation: {
        someValue: 'someVal'
      }
    }, 'agreementRef', 'invalid', 'this too')).rejects.toEqual(new Error('SFD validation error'))
  })
})
