import { uploadBlob } from '../../../app/storage/uploadBlob'
import { getBlobServiceClient } from '../../../app/storage/getBlobServiceClient'

jest.mock('../../../app/config', () => ({
  appConfig: {
    ...jest.requireActual('../../../app/config').appConfig,
    storageConfig: {
      ...jest.requireActual('../../../app/config').appConfig.storageConfig,
      connectionString: 'fake-connection-string',
      useConnectionString: true,
      storageAccount: 'fake-storage-account',
      createContainers: true,
      documentContainer: 'fake-document-container'
    }
  }
}))

jest.mock('../../../app/storage/getBlobServiceClient', () => ({
  getBlobServiceClient: jest.fn()
}))

const mockLogger = {
  info: jest.fn()
}

describe('uploadBlob', () => {
  test('it initialises the containers and uploads the document', async () => {
    const mockCreateContainers = jest.fn()
    const mockUpload = jest.fn()
    const mockBlockBlobClient = jest.fn().mockImplementation(() => ({
      upload: mockUpload
    }))
    const mockGetContainerClient = jest.fn().mockImplementation(() => ({
      getBlockBlobClient: mockBlockBlobClient,
      createIfNotExists: mockCreateContainers
    }))

    getBlobServiceClient.mockImplementation(() => ({
      getContainerClient: mockGetContainerClient
    }))

    const fileName = 'file-name-test'
    const contents = [Buffer.from('file-contents-test')]

    const result = await uploadBlob(mockLogger, fileName, contents)

    expect(getBlobServiceClient).toHaveBeenCalledWith(true, 'fake-connection-string', 'fake-storage-account')
    expect(mockGetContainerClient).toHaveBeenCalledWith('fake-document-container')
    expect(mockCreateContainers).toHaveBeenCalled()
    expect(mockBlockBlobClient).toHaveBeenCalledWith(fileName)
    expect(mockUpload).toHaveBeenCalledWith(result, result.length)
    expect(result.toString()).toEqual('file-contents-test')
  })

  test('it doesnt initialis the containers if they have already been initialised, but still uploads the document', async () => {
    const mockCreateContainers = jest.fn()
    const mockUpload = jest.fn()
    const mockBlockBlobClient = jest.fn().mockImplementation(() => ({
      upload: mockUpload
    }))
    const mockGetContainerClient = jest.fn().mockImplementation(() => ({
      getBlockBlobClient: mockBlockBlobClient,
      createIfNotExists: mockCreateContainers
    }))

    getBlobServiceClient.mockImplementation(() => ({
      getContainerClient: mockGetContainerClient
    }))

    const fileName = 'file-name-test'
    const contents = [Buffer.from('file-contents-test')]

    const result = await uploadBlob(mockLogger, fileName, contents)

    expect(getBlobServiceClient).toHaveBeenCalledWith(true, 'fake-connection-string', 'fake-storage-account')
    expect(mockGetContainerClient).toHaveBeenCalledWith('fake-document-container')

    expect(mockCreateContainers).not.toHaveBeenCalled() // Important line

    expect(mockBlockBlobClient).toHaveBeenCalledWith(fileName)
    expect(mockUpload).toHaveBeenCalledWith(result, result.length)
    expect(result.toString()).toEqual('file-contents-test')
  })
})
