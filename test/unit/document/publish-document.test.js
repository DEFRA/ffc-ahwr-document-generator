const publishDocument = require('../../../app/document/publish-document')
const storageMock = require('../../../app/storage')
jest.mock('../../../app/storage')
const repositoryMock = require('../../../app/repositories/document-log-repository')
jest.mock('../../../app/repositories/document-log-repository')

const PdfPrinter = require('pdfmake')
const fonts = require('../../../app/document/fonts')
const createDocumentDefinition = require('../../../app/document/document-definition')
const printer = new PdfPrinter(fonts)

describe('publish document', () => {
  test('published document', async () => {
    const data = {
      whichSpecies: 'pig',
      sbi: '12222321',
      reference: 'AHWR-4444-2222'
    }
    const docDefinition = createDocumentDefinition(data)
    const pdfDoc = printer.createPdfKitDocument(docDefinition)
    const blob = Buffer.from('test').toString('base64')

    storageMock.uploadBlob.mockResolvedValueOnce(blob)

    const result = await publishDocument(pdfDoc, data)
    expect(storageMock.uploadBlob).toBeCalledTimes(1)
    expect(repositoryMock.set).toBeCalledTimes(1)
    expect(result.filename).toBe('pig/12222321/AHWR-4444-2222.pdf')
    expect(result.blob).toBe(blob)
  })
})
