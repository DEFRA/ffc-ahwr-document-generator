import { redactPII, set, update } from '../../../app/repositories/document-log-repository.js'
import { buildData } from '../../../app/data/index.js'
import { Sequelize, Op } from 'sequelize'

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
    const redactedSbi = '105948234'
    buildData.models.documentLog.update.mockResolvedValue([1, [{ id: 1 }]])

    await redactPII('AHWR-123', redactedSbi, mockLogger)

    expect(buildData.models.documentLog.update).toHaveBeenCalledWith(
      { redactedSbi, filename: 'REDACTED_FILENAME', data: expect.any(Object) },
      {
        where: {
          reference: 'AHWR-123',
          [Op.and]: Sequelize.literal("data->>'name' IS NOT NULL")
        }
      }
    )
    expect(buildData.models.documentLog.update).toHaveBeenCalledWith(
      { redactedSbi, filename: 'REDACTED_FILENAME', data: expect.any(Object) },
      {
        where: {
          reference: 'AHWR-123',
          [Op.and]: Sequelize.literal("data->>'email' IS NOT NULL")
        }
      }
    )
    expect(buildData.models.documentLog.update).toHaveBeenCalledWith(
      { redactedSbi, filename: 'REDACTED_FILENAME', data: expect.any(Object) },
      {
        where: {
          reference: 'AHWR-123',
          [Op.and]: Sequelize.literal("data->>'orgEmail' IS NOT NULL")
        }
      }
    )
    expect(buildData.models.documentLog.update).toHaveBeenCalledWith(
      { redactedSbi, filename: 'REDACTED_FILENAME', data: expect.any(Object) },
      {
        where: {
          reference: 'AHWR-123',
          [Op.and]: Sequelize.literal("data->>'farmerName' IS NOT NULL")
        }
      }
    )
    expect(buildData.models.documentLog.update).toHaveBeenCalledWith(
      { redactedSbi, filename: 'REDACTED_FILENAME', data: expect.any(Object) },
      {
        where: {
          reference: 'AHWR-123',
          [Op.and]: Sequelize.literal("data->>'sbi' IS NOT NULL")
        }
      }
    )

    expect(mockLogger.info).toHaveBeenCalledWith("Redacted field 'name' in 1 message(s) for agreementReference: AHWR-123")
  })

  test('Should log when no messages are updated', async () => {
    const mockLogger = { info: jest.fn() }
    buildData.models.documentLog.update.mockResolvedValue([0])

    await redactPII('AHWR-123', '105948234', mockLogger)

    expect(mockLogger.info).toHaveBeenCalledWith('No messages updated for agreementReference: AHWR-123')
  })
})
