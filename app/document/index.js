import PdfPrinter from 'pdfmake'
import { fonts } from './fonts/index.js'
import { createDocumentDefinition } from './document-definition.js'
import { publishDocument } from './publish-document.js'

const printer = new PdfPrinter(fonts)

export const generateDocument = async (logger, data) => {
  const docDefinition = createDocumentDefinition(data)
  logger.info('Document definition created')
  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  logger.info('Document PDF created')
  const publishResponse = await publishDocument(logger, pdfDoc, data)
  logger.info('Document published')
  return publishResponse
}
