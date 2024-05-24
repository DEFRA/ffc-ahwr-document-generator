const styles = require('../../../app/document/styles')
const createDocumentDefinition = require('../../../app/document/document-definition')
const mockData = require('../../mocks/data')
const { A4 } = require('../../../app/document/page-sizes')
const moment = require('moment')
const { setEndemicsEnabled } = require('../../mocks/config')

describe('get document definition', () => {
  describe('Endemics On', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      setEndemicsEnabled(false)
    })
    test('includes A4 paper size', () => {
      const result = createDocumentDefinition(mockData)
      expect(result.pageSize).toBe(A4)
    })

    test('includes all defined styles', () => {
      const result = createDocumentDefinition(mockData)
      expect(result.styles).toStrictEqual(styles)
    })

    test('included footer', () => {
      const result = createDocumentDefinition(mockData)
      expect(result.footer.stack[0].text).toBe(`Date Generated: ${moment(new Date()).format('DD/MM/YYYY')}    Application Reference: ${mockData.reference}    Application Status: Agreement Offered`)
      expect(result.footer.stack[0].style).toBe('footer')
    })

    test('sets default style as default style', () => {
      const result = createDocumentDefinition(mockData)
      expect(result.defaultStyle).toBe(styles.default)
    })
  })
  describe('Endemics Off', () => {
    beforeEach(() => {
      jest.resetAllMocks()
      setEndemicsEnabled(true)
    })
    test('includes A4 paper size', () => {
      const result = createDocumentDefinition(mockData)
      expect(result.pageSize).toBe(A4)
    })

    test('includes all defined styles', () => {
      const result = createDocumentDefinition(mockData)
      expect(result.styles).toStrictEqual(styles)
    })

    test('included footer', () => {
      const result = createDocumentDefinition(mockData)
      expect(result.footer.stack[0].text).toBe(`Date Generated: ${moment(new Date()).format('DD/MM/YYYY')}    Application Reference: ${mockData.reference}    Application Status: Agreement Offered`)
      expect(result.footer.stack[0].style).toBe('footer')
    })

    test('sets default style as default style', () => {
      const result = createDocumentDefinition(mockData)
      expect(result.defaultStyle).toBe(styles.default)
    })
  })
})
