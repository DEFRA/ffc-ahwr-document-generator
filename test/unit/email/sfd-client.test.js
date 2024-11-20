
const sfdMessageSend = require('../../../app/messaging/send-message')
jest.mock('../../../app/messaging/send-message')

const sendSFDEmail = require('../../../app/email/sfd-client')

describe('sendSFDEmail', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('send SFD request successfully', async () => {
    await sendSFDEmail('99ef9794-67eb-4f18-bb38-541f30f955f8', 'hi@bye.com', {
      reference: 'someRef',
      personalisation: {
        someValue: 'someVal',
        reference: 'agreementRef'
      }
    }, '1110000000', '123456789')

    expect(sfdMessageSend).toHaveBeenCalledTimes(1)
    expect(sfdMessageSend).toHaveBeenCalledWith({
      agreementReference: 'agreementRef',
      crn: '1110000000',
      customParams: {
        reference: 'agreementRef',
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
    await sendSFDEmail('99ef9794-67eb-4f18-bb38-541f30f955f8', 'hi@bye.com', {
      reference: 'someRef',
      personalisation: {
        someValue: 'someVal',
        reference: 'agreementRef'
      }
    }, 'invalid', 'this too')

    expect(sfdMessageSend).toHaveBeenCalledTimes(1)
    expect(sfdMessageSend).toHaveBeenCalledWith({
      sfdMessage: 'failed'
    },
    'uk.gov.ffc.ahwr.sfd.request', expect.anything(), { templateId: '99ef9794-67eb-4f18-bb38-541f30f955f8' })
  })
})
