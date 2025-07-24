import { appConfig } from '../config/index.js'
import { getBlobServiceClient } from './getBlobServiceClient.js'

const { connectionString, useConnectionString, storageAccount, documentContainer } = appConfig.storageConfig

export const deleteBlob = async (filename, logger) => {
  try {
    const blobServiceClient = getBlobServiceClient(useConnectionString, connectionString, storageAccount)
    const container = blobServiceClient.getContainerClient(documentContainer)
    const blobClient = container.getBlobClient(filename)
    const deleteResponse = await blobClient.deleteIfExists()

    if (deleteResponse.succeeded) {
      logger.info(`Successfully deleted blob: ${filename}`)
    } else {
      logger.warn(`Blob not found or already deleted: ${filename}`)
    }

    return deleteResponse.succeeded
  } catch (err) {
    logger.error({ err }, `Unable to delete blob: ${documentContainer}/${filename}`)
    throw err
  }
}
