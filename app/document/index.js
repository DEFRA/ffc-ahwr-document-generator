const PdfPrinter = require('pdfmake')
const fonts = require('./fonts')
const createDocumentDefinition = require('./document-definition')
const printer = new PdfPrinter(fonts)
const publish = require('./publish-document')

const generateDocument = async (data) => {
  const docDefinition = createDocumentDefinition(data)
  console.log('Document definition created')
  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  console.log('Document PDF created')
  const publishResponse = await publish(pdfDoc, data)
  console.log('Document published')
  return publishResponse
}

module.exports = generateDocument
