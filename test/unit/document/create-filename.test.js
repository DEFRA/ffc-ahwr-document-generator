import { createFileName } from '../../../app/document/create-filename'
import { mockRequest } from '../../mocks/data'

const documentExtension = '.pdf'

describe('create filename', () => {
  test('creates filename based on reference and sbi', () => {
    const data = { ...mockRequest }

    const result = createFileName(data)

    expect(result).toBe(`${data.sbi}/${data.reference}${documentExtension}`)
  })
})
