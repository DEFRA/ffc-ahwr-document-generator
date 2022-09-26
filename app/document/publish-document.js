const createFilename = require('./create-filename')
const { uploadBlob } = require('../storage')
const { set } = require('../repositories/document-log-repository')

const publishDocument = (pdfDocGenerator, data) => {
  const filename = createFilename(data)
  return new Promise((resolve, reject) => {
    const chunks = []

    pdfDocGenerator.on('data', chunk => chunks.push(chunk))

    pdfDocGenerator.on('end', async () => {
      uploadBlob(filename, chunks)
      await set(data, filename)
      resolve(filename)
    })

    pdfDocGenerator.on('error', (err) => reject(err))

    pdfDocGenerator.end()
  })
}

module.exports = publishDocument
