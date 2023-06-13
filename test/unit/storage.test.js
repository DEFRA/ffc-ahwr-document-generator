jest.mock('../../app/config/notify', () => ({
  apiKey: 'mockApiKey'
}))

jest.mock('../../app/config/storage', () => ({
  storageAccount: 'mockStorageAccount'
}))

describe('storage tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  describe('create BlobServiceClient', () => {
    test.each([
      { mockConnectionStringEnabled: true },
      { mockConnectionStringEnabled: false }
    ])('create blob client with $connectionStringEnabled', async ({ mockConnectionStringEnabled }) => {
      jest.mock('../../app/config/storage', () => ({
        useConnectionString: mockConnectionStringEnabled,
        storageAccount: 'mockStorageAccount'
      }))
      const { BlobServiceClient } = require('@azure/storage-blob')
      const mockFromConnectionString = jest.fn()
      jest.mock('@azure/storage-blob')
      BlobServiceClient.fromConnectionString = mockFromConnectionString

      const constructorSpy = jest.spyOn(require('@azure/storage-blob'), 'BlobServiceClient')

      require('../../app/storage')
      if (mockConnectionStringEnabled) {
        expect(mockFromConnectionString).toHaveBeenCalledTimes(1)
      } else {
        expect(constructorSpy).toHaveBeenCalledTimes(1)
      }
    })

    test.each([
      { mockCreateContainers: true },
      { mockCreateContainers: false }
    ])('test upload blob ', async ({ mockCreateContainers }) => {
      jest.mock('../../app/config/storage', () => ({
        useConnectionString: true,
        storageAccount: 'mockStorageAccount',
        createContainers: mockCreateContainers
      }))
      const { BlobServiceClient } = require('@azure/storage-blob')
      const mockFromConnectionString = jest.fn()
      const mockGetContainerClient = jest.fn()
      const mockCreateIfNotExists = jest.fn()
      const mockGetBlockBlobClient = jest.fn()
      const mockUploadBlob = jest.fn()
      jest.mock('@azure/storage-blob')
      BlobServiceClient.fromConnectionString = mockFromConnectionString
      mockGetBlockBlobClient.mockImplementationOnce(() => {
        return { upload: mockUploadBlob }
      })
      mockUploadBlob.mockImplementationOnce(() => { return { } })
      mockFromConnectionString.mockImplementationOnce(() => {
        return {
          getContainerClient: mockGetContainerClient
        }
      })
      mockGetContainerClient.mockImplementationOnce(() => {
        return {
          createIfNotExists: mockCreateIfNotExists,
          getBlockBlobClient: mockGetBlockBlobClient
        }
      })
      const storage = require('../../app/storage')
      await storage.uploadBlob('somefilename', [])
      expect(mockFromConnectionString).toHaveBeenCalledTimes(1)
      expect(mockGetContainerClient).toHaveBeenCalledTimes(1)
      expect(mockCreateIfNotExists).toHaveBeenCalledTimes(mockCreateContainers ? 1 : 0)
      expect(mockGetBlockBlobClient).toHaveBeenCalledTimes(1)
      expect(mockUploadBlob).toHaveBeenCalledTimes(1)
    })
  })
})
