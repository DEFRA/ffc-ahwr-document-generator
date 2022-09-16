const PdfPrinter = require('pdfmake')
const fonts = require('./fonts')
const createDocumentDefinition = require('./document-definition')
const printer = new PdfPrinter(fonts)
const publish = require('./publish-document')

const generateDocument = async (data) => {
  const docDefinition = createDocumentDefinition(data)
  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  await publish(pdfDoc, data)
}

module.exports = generateDocument
