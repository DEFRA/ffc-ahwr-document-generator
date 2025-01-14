import PdfPrinter from 'pdfmake'
import { fonts } from './fonts/index.js'
import { createDocumentDefinition } from './document-definition.js'
import { publishDocument } from './publish-document.js'

const printer = new PdfPrinter(fonts)

export const generateDocument = async (data) => {
  const docDefinition = createDocumentDefinition(data)
  console.log('Document definition created')
  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  console.log('Document PDF created')
  const publishResponse = await publishDocument(pdfDoc, data)
  console.log('Document published')
  return publishResponse
}
