describe('storage tests', () => {
  const mockConfig = require('../../app/config')
  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  describe('create BlobServiceClient', () => {
    test.each([
      { mockConnectionStringEnabled: true },
      { mockConnectionStringEnabled: false }
    ])('create blob client with $connectionStringEnabled', async ({ mockConnectionStringEnabled }) => {
      jest.mock('../../app/config', () => ({
        ...mockConfig,
        storageConfig: {
          useConnectionString: mockConnectionStringEnabled
        }
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
      { mockCcreateContainers: true }
    ])('test upload blob ', async ({ mockCcreateContainers }) => {
      jest.mock('../../app/config', () => ({
        ...mockConfig,
        storageConfig: {
          useConnectionString: true,
          createContainers: mockCcreateContainers
        }
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
      expect(mockCreateIfNotExists).toHaveBeenCalledTimes(1)
      expect(mockGetBlockBlobClient).toHaveBeenCalledTimes(1)
      expect(mockUploadBlob).toHaveBeenCalledTimes(1)
    })
  })
})
