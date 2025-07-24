import { redactPII, set, update } from '../../../app/repositories/document-log-repository.js'
import { buildData } from '../../../app/data/index.js'

jest.mock('../../../app/data/index', () => {
  return {
    buildData: {
      models: {
        documentLog: {
          create: jest.fn(),
          update: jest.fn()
        }
      }
    }
  }
})

describe('Document Log repository test', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Set calls through to create model function', async () => {
    const data = { reference: 'reference', sbi: 'sbi', other: 'someData' }
    await set({ reference: 'reference', sbi: 'sbi', other: 'someData' }, 'fileName')

    expect(buildData.models.documentLog.create).toHaveBeenCalledWith({ data, reference: 'reference', sbi: 'sbi', fileName: 'fileName' })
  })

  test('Should update the status of record', async () => {
    await update('reference', { sbi: 'sbi' })

    expect(buildData.models.documentLog.update).toHaveBeenCalledWith({ sbi: 'sbi' }, { where: { reference: 'reference' } })
  })

  test('Should redact PII in document log and log update', async () => {
    const mockLogger = { info: jest.fn() }
    buildData.models.documentLog.update.mockResolvedValue([1, [{ id: 1 }]])

    await redactPII('AHWR-123', mockLogger)

    expect(buildData.models.documentLog.update).toHaveBeenCalledWith(
      { data: expect.any(Object) },
      {
        where: { reference: 'AHWR-123' },
        returning: true
      }
    )

    expect(mockLogger.info).toHaveBeenCalledWith('Redacted PII in 1 message(s) for agreementReference: AHWR-123')
  })

  test('Should log when no messages are updated', async () => {
    const mockLogger = { info: jest.fn() }
    buildData.models.documentLog.update.mockResolvedValue([1, []])

    await redactPII('AHWR-123', mockLogger)

    expect(mockLogger.info).toHaveBeenCalledWith('No messages updated for agreementReference: AHWR-123')
  })
})
