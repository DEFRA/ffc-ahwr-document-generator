import { appConfig } from '../config/index.js'
import { getBlobServiceClient } from './getBlobServiceClient.js'

let containersInitialisedState

const { createContainers, documentContainer } = appConfig.storageConfig

const initialiseContainers = async (container) => {
  if (createContainers && !containersInitialisedState) {
    await container.createIfNotExists()

    containersInitialisedState = true
  }
}

export const uploadBlob = async (logger, filename, contents) => {
  const {
    connectionString,
    useConnectionString,
    storageAccount
  } = appConfig.storageConfig

  const blobServiceClient = getBlobServiceClient(useConnectionString, connectionString, storageAccount)
  const container = blobServiceClient.getContainerClient(documentContainer)
  await initialiseContainers(container)
  const blob = container.getBlockBlobClient(filename)
  const result = Buffer.concat(contents)
  await blob.upload(result, result.length)
  logger.info(`Generated document: ${filename}`)

  return result
}
