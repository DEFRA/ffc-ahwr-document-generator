import { set, update } from '../../../app/repositories/document-log-repository.js'
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
})
