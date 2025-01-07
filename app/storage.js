import { BlobServiceClient } from '@azure/storage-blob'
import { DefaultAzureCredential } from '@azure/identity'
import { appConfig } from './config'

let blobServiceClient
let containersInitialised

const { createContainers, connectionString, useConnectionString, storageAccount, documentContainer } = appConfig.storageConfig

if (useConnectionString === true) {
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
} else {
  const uri = `https://${storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential({ managedIdentityClientId: process.env.AZURE_CLIENT_ID }))
}

const initialiseContainers = async (container) => {
  if (createContainers && !containersInitialised) {
    console.log('Making sure blob containers exist')
    await container.createIfNotExists()

    containersInitialised = true
  }
}

export const uploadBlob = async (filename, contents) => {
  const container = blobServiceClient.getContainerClient(documentContainer)
  await initialiseContainers(container)
  const blob = container.getBlockBlobClient(filename)
  const result = Buffer.concat(contents)
  await blob.upload(result, result.length)
  console.log(`Generated document: ${filename}`)

  return result
}
