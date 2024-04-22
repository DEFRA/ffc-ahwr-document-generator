const getFilename = require('../../../app/document/create-filename')
const documentExtension = '.pdf'
const mockData = require('../../mocks/data')

describe('create filename', () => {
  test('writes full filename', () => {
    mockData.whichSpecies = 'sheep'
    const result = getFilename(mockData)
    expect(result).toBe(`${mockData.whichSpecies}/${mockData.sbi}/${mockData.reference}${documentExtension}`)
  })
  test('writes filename without species', () => {
    const result = getFilename({ ...mockData, whichSpecies: undefined })
    expect(result).toBe(`${mockData.sbi}/${mockData.reference}${documentExtension}`)
  })
})
