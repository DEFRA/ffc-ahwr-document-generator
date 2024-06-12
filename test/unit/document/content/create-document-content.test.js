const moment = require('moment')
const config = require('../../../../app/config')
const createContent = require('../../../../app/document/content')
const mockData = require('../../../mocks/data')
const { setEndemicsEnabled } = require('../../../mocks/config')

describe('generate document content', () => {
  describe('Endemics Off', () => {
    let result

    beforeEach(() => {
      jest.resetAllMocks()
      setEndemicsEnabled(false)
      result = createContent(mockData)
    })

    test('includes header and logo', () => {
      expect(result[0].stack[0].style).toBe('logo')
      expect(result[0].stack[1].text).toBe('Annual health and welfare review of livestock agreement summary')
      expect(result[0].stack[1].style).toBe('header')
      expect(result[0].stack[1].alignment).toBe('left')
    })

    test('includes agreement text', () => {
      expect(result[1].stack[0].text).toBe('You have applied for funding for a review.\n\n')
      expect(result[1].stack[1].text).toBe('By applying for this funding you have entered into an agreement with the Rural Payments Agency (RPA). The agreement will be governed by the agreed ')
    })

    test('includes terms and conditions link', () => {
      expect(result[1].stack[2].text).toBe('terms and conditions.\n\n')
      expect(result[1].stack[2].link).toBe(config.termsAndConditionsUrl)
    })

    test('includes agreement summary sub header', () => {
      expect(result[1].stack[3].text).toBe('Agreement summary \n\n')
      expect(result[1].stack[3].style).toBe('subheader')
    })

    test('includes Agreement details', () => {
      expect(result[1].stack[4].ul[0]).toBe(`Agreement number: ${mockData.reference} \n\n`)
      expect(result[1].stack[4].ul[1]).toBe(`Agreement holder: ${mockData.name} - ${mockData.sbi} \n\n`)
      expect(result[1].stack[4].ul[2]).toBe(`Agreement start date: ${moment(mockData.startDate).format('D MMMM YYYY')} \n\n`)
      expect(result[1].stack[4].ul[3]).toBe(`Agreement end date: ${moment(mockData.startDate).add(6, 'M').format('D MMMM YYYY')} \n\n`)
      expect(result[1].stack[4].ul[4]).toBe(`Type of livestock review: ${mockData.whichSpecies} \n\n`)
    })

    test('includes Eligibility', () => {
      expect(result[1].stack[5].text).toBe('You must have a minimum number of animals on the date the vet visits your farm to do the review. You must have 11 or more beef cattle.\n\n')
    })

    test('includes more information sub header', () => {
      expect(result[1].stack[6].text).toBe('More information\n\n')
      expect(result[1].stack[6].style).toBe('subheader')
    })

    test('includes application guidance text', () => {
      expect(result[1].stack[7].text).toBe('For information about what happens during a review and what you need to do, read the ')
    })

    test('includes application guidance link', () => {
      expect(result[1].stack[8].text).toBe('guidance on how to apply for an annual health and welfare review of livestock.\n\n')
      expect(result[1].stack[8].link).toBe(`${config.applyServiceUri}/guidance-for-farmers`)
    })

    test('includes claim guidance text', () => {
      expect(result[1].stack[9].text).toBe('For information on how to claim, read the ')
    })

    test('includes claim guidance link', () => {
      expect(result[1].stack[10].text).toBe('guidance on how to claim funding for an annual health and welfare review of livestock.\n\n')
      expect(result[1].stack[10].link).toBe(`${config.applyServiceUri}/claim-guidance-for-farmers`)
    })
  })

  describe('Endemics On', () => {
    let result

    beforeEach(() => {
      jest.resetAllMocks()
      setEndemicsEnabled(true)
      result = createContent(mockData)
    })

    test('includes header and logo', () => {
      expect(result[0].stack[0].style).toBe('logo')
      expect(result[0].stack[1].text).toBe('Agreement summary: get funding to improve animal health and welfare')
      expect(result[0].stack[1].style).toBe('header')
      expect(result[0].stack[1].alignment).toBe('left')
    })

    test('includes funding text', () => {
      expect(result[1].stack[0].text).toBe('You have applied for funding for:')
      expect(result[1].stack[1].ul[0].text).toBe('animal health and welfare reviews')
      expect(result[1].stack[1].ul[1].text).toBe('endemic disease follow-ups')
    })

    test('includes By applying for this funding', () => {
      expect(result[1].stack[2].text[0]).toBe('By applying for this funding, you have entered into an agreement with the Rural Payments Agency. The agreement will be governed by the ')
    })

    test('Agreement details table formatted correctly', () => {
      // line thickness on rows
      expect(result[1].stack[4].layout.hLineWidth(0, { table: { body: [1,2,3,4]}})).toBe(0)
      expect(result[1].stack[4].layout.hLineWidth(1, { table: { body: [1,2,3,4]}})).toBe(1)
      expect(result[1].stack[4].layout.hLineWidth(2, { table: { body: [1,2,3,4]}})).toBe(1)
      expect(result[1].stack[4].layout.hLineWidth(3, { table: { body: [1,2,3,4]}})).toBe(1)
      expect(result[1].stack[4].layout.hLineWidth(4, { table: { body: [1,2,3,4]}})).toBe(0)
    })
  })
})
