const { BlobServiceClient } = require('@azure/storage-blob')
const { DefaultAzureCredential } = require('@azure/identity')
const { createContainers, connectionString, useConnectionString, storageAccount, documentContainer } = require('./config').storageConfig

let blobServiceClient
let containersInitialised

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

const uploadBlob = async (filename, contents) => {
  const container = blobServiceClient.getContainerClient(documentContainer)
  await initialiseContainers(container)
  const blob = container.getBlockBlobClient(filename)
  const result = Buffer.concat(contents)
  await blob.upload(result, result.length)
  console.log(`Generated document: ${filename}`)
  return result
}

module.exports = {
  uploadBlob
}
