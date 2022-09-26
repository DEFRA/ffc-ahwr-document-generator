const styles = require('../../../app/document/styles')
const createDocumentDefinition = require('../../../app/document/document-definition')
const mockData = require('../../mocks/data')
const { A4 } = require('../../../app/document/page-sizes')

describe('get document definition', () => {
  test('includes A4 paper size', () => {
    const result = createDocumentDefinition(mockData)
    expect(result.pageSize).toBe(A4)
  })

  test('includes all defined styles', () => {
    const result = createDocumentDefinition(mockData)
    expect(result.styles).toStrictEqual(styles)
  })

  test('sets default style as default style', () => {
    const result = createDocumentDefinition(mockData)
    expect(result.defaultStyle).toBe(styles.default)
  })
})
