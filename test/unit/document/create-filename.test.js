
const getFilename = require('../../../app/document/create-filename')
const documentExtension = '.pdf'
const mockData = require('../../mocks/data')

describe('create filename', () => {
  test('writes full filename', () => {
    const result = getFilename(mockData)
    expect(result).toBe(`${mockData.whichSpecies}/${mockData.sbi}/${mockData.reference}${documentExtension}`)
  })
})
