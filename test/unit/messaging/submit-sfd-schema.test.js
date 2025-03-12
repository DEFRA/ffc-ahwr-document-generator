import { validateSFDSchema } from '../../../app/messaging/submit-sfd-schema'

const mockLogger = {
  warn: jest.fn()
}
describe('validateSFDSchema', () => {
  const validEvent = {
    crn: '1234567890',
    sbi: '123456789',
    agreementReference: 'IAHW-6222-6848',
    notifyTemplateId: '58ac9fbe-1cdc-4305-be1c-a4e4ac3232a7',
    emailAddress: 'tester@example.com',
    customParams: {
      reference: 'IAHW-6222-6848'
    },
    dateTime: new Date().toISOString()
  }
  const invalidEvent = {
    crn: '1234567890',
    agreementReference: 'IAHW-6222-6848',
    notifyTemplateId: '58ac9fbe-1cdc-4305-be1c-a4e4ac3232a7',
    emailAddress: 'tester@example.com',
    customParams: {
      reference: 'IAHW-6222-6848'
    },
    dateTime: new Date().toISOString()
  }

  test('returns true when event valid', () => {
    expect(validateSFDSchema(mockLogger, validEvent)).toBeTruthy()
  })

  test('returns false when event invalid', () => {
    expect(validateSFDSchema(mockLogger, invalidEvent)).toBeFalsy()
  })
})
