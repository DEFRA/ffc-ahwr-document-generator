import PdfPrinter from 'pdfmake'
import { fonts } from './fonts'
import { createDocumentDefinition } from './document-definition'
import { publishDocument } from './publish-document'

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
