const { getByEmail, getBySbi } = require('../../app/user')

const { downloadBlob } = require('../../app/storage')
jest.mock('../../app/storage')

const mockUser = require('../mocks/user')
const users = []

describe('get user information', () => {
  beforeEach(() => {
    users.push(mockUser)
    jest.resetAllMocks()
  })

  test('Get user by email', async () => {
    downloadBlob.mockResolvedValue(JSON.stringify(users))
    const response = await getByEmail(mockUser.email)
    expect(response).toEqual(mockUser)
  })

  test('Get user by sbi', async () => {
    downloadBlob.mockResolvedValue(JSON.stringify(users))
    const response = await getBySbi(mockUser.sbi)
    expect(response).toEqual(mockUser)
  })
})
