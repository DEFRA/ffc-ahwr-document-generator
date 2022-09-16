const { BlobServiceClient } = require('@azure/storage-blob')
const { DefaultAzureCredential } = require('@azure/identity')
const { createContainers, connectionString, useConnectionString, storageAccount, documentContainer } = require('./config').storageConfig

let blobServiceClient
let containersInitialised

if (useConnectionString === true) {
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
} else {
  const uri = `https://${storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
}

const initialiseContainers = async (container) => {
  if (createContainers) {
    console.log('Making sure blob containers exist')
    await container.createIfNotExists()
  }
  containersInitialised = true
}

const downloadBlob = async (container, filename) => {
  const containerClient = blobServiceClient.getContainerClient(container)
  console.log(`Downloading blob ${filename} from container ${container}`)
  if (await containerClient.exists()) {
    try {
      const blob = containerClient.getBlockBlobClient(filename)
      return await blob.downloadToBuffer()
    } catch (e) {
      console.error(e)
    }
  }
  return undefined
}

const uploadBlob = async (filename, contents) => {
  const container = blobServiceClient.getContainerClient(documentContainer)
  containersInitialised ?? await initialiseContainers(container)
  const blob = container.getBlockBlobClient(filename)
  const result = Buffer.concat(contents)
  await blob.upload(result, result.length)
  console.log(`Generated document: ${filename}`)
}

module.exports = {
  downloadBlob,
  uploadBlob
}
