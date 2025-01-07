import { publishDocument } from '../../../app/document/publish-document'
import { uploadBlob } from '../../../app/storage'
import { set } from '../../../app/repositories/document-log-repository'
import PdfPrinter from 'pdfmake'
import { fonts } from '../../../app/document/fonts'
import { createDocumentDefinition } from '../../../app/document/document-definition'

jest.mock('../../../app/repositories/document-log-repository')
jest.mock('../../../app/storage')

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

    uploadBlob.mockResolvedValueOnce(blob)

    const result = await publishDocument(pdfDoc, data)
    expect(uploadBlob).toBeCalledTimes(1)
    expect(set).toBeCalledTimes(1)
    expect(result.filename).toBe('pig/12222321/AHWR-4444-2222.pdf')
    expect(result.blob).toBe(blob)
  })
})
