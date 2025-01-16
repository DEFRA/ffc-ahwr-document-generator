import { checkEmailDelivered } from '../../../app/repositories/document-log-repository.js'
import { buildData } from '../../../app/data/index.js'

jest.mock('../../../app/data/index', () => {
  return {
    buildData: {
      models: {
        documentLog: {
          findAll: jest.fn(),
          create: jest.fn(),
          update: jest.fn()
        }
      }
    }
  }
})

describe('Document Log repository test', () => {
  const env = process.env

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
    process.env = { ...env }
  })

  test('Should query for outstanding email status rows using expected query criteria', async () => {
    buildData.models.documentLog.findAll.mockResolvedValueOnce([])
    await checkEmailDelivered()

    expect(buildData.models.documentLog.findAll).toHaveBeenCalledWith({ where: { completed: null, status: 'email-created' } })
  })
})
