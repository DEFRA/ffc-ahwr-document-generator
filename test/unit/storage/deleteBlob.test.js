import { deleteBlob } from '../../../app/storage/deleteBlob.js'
import { getBlobServiceClient } from '../../../app/storage/getBlobServiceClient.js'

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}

jest.mock('../../../app/storage/getBlobServiceClient.js', () => ({
  getBlobServiceClient: jest.fn()
}))

describe('deleteBlob', () => {
  const filename = 'test-document.pdf'

  const deleteIfExistsMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    getBlobServiceClient.mockReturnValue({
      getContainerClient: jest.fn(() => ({
        getBlobClient: jest.fn(() => ({
          deleteIfExists: deleteIfExistsMock
        }))
      }))
    })
  })

  test('logs success and returns true if blob was deleted', async () => {
    deleteIfExistsMock.mockResolvedValueOnce({ succeeded: true })

    const result = await deleteBlob(filename, mockLogger)

    expect(result).toBe(true)
    expect(mockLogger.info).toHaveBeenCalledWith(`Successfully deleted blob: ${filename}`)
  })

  test('logs warning and returns false if blob does not exist', async () => {
    deleteIfExistsMock.mockResolvedValueOnce({ succeeded: false })

    const result = await deleteBlob(filename, mockLogger)

    expect(result).toBe(false)
    expect(mockLogger.warn).toHaveBeenCalledWith(`Blob not found or already deleted: ${filename}`)
  })

  test('logs and rethrows error if deletion fails', async () => {
    const error = new Error('Azure failure')
    deleteIfExistsMock.mockRejectedValueOnce(error)

    await expect(deleteBlob(filename, mockLogger)).rejects.toThrow('Azure failure')

    expect(mockLogger.error).toHaveBeenCalledWith(
      { err: error },
      expect.stringContaining('Unable to delete blob')
    )
  })
})
