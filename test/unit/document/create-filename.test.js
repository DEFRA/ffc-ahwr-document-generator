import { createFileName } from '../../../app/document/create-filename'
import { mockRequest } from '../../mocks/data'

const documentExtension = '.pdf'

describe('create filename', () => {
  test('writes full filename', () => {
    const result = createFileName(mockRequest)

    expect(result).toBe(`${mockRequest.whichSpecies}/${mockRequest.sbi}/${mockRequest.reference}${documentExtension}`)
  })

  test('writes filename without species', () => {
    const data = { ...mockRequest, whichSpecies: undefined }

    const result = createFileName(data)

    expect(result).toBe(`${data.sbi}/${data.reference}${documentExtension}`)
  })
})
