import { createFileName } from './create-filename'
import { uploadBlob } from '../storage'
import { set } from '../repositories/document-log-repository'

export const publishDocument = (pdfDocGenerator, data) => {
  const filename = createFileName(data)
  return new Promise((resolve, reject) => {
    const chunks = []

    pdfDocGenerator.on('data', chunk => chunks.push(chunk))

    pdfDocGenerator.on('end', async () => {
      const blob = await uploadBlob(filename, chunks)
      await set(data, filename)
      resolve({ filename, blob })
    })

    pdfDocGenerator.on('error', (err) => reject(err))

    pdfDocGenerator.end()
  })
}
