import { appConfig } from '../config'
import { getBlobServiceClient } from './getBlobServiceClient'

let containersInitialisedState

const { createContainers, documentContainer } = appConfig.storageConfig

const initialiseContainers = async (container) => {
  if (createContainers && !containersInitialisedState) {
    console.log('Making sure blob containers exist')
    await container.createIfNotExists()

    containersInitialisedState = true
  }
}

export const uploadBlob = async (filename, contents) => {
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
  console.log(`Generated document: ${filename}`)

  return result
}
