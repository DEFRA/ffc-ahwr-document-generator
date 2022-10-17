const moment = require('moment')
const config = require('../../../../app/config')
const createContent = require('../../../../app/document/content')
const mockData = require('../../../mocks/data')

describe('generate document content', () => {
  test('includes header and logo', () => {
    const result = createContent(mockData)
    expect(result[0].stack[0].style).toBe('logo')
    expect(result[0].stack[1].text).toBe('Annual health and welfare review of livestock agreement summary')
    expect(result[0].stack[1].style).toBe('header')
    expect(result[0].stack[1].alignment).toBe('left')
  })

  test('includes aggreement text', () => {
    const result = createContent(mockData)
    expect(result[1].stack[0].text).toBe('You have applied for funding for a review.\n\n')
    expect(result[1].stack[1].text).toBe('By applying for this funding you’ve entered into an agreement with the Rural Payments Agency (RPA). The agreement will be governed by the agreed terms and conditions.\n\n')
  })

  test('includes sub header', () => {
    const result = createContent(mockData)
    expect(result[1].stack[2].text).toBe('Agreement summary \n\n')
    expect(result[1].stack[2].style).toBe('subheader')
  })

  test('includes Agreement details', () => {
    const result = createContent(mockData)
    expect(result[1].stack[3].text).toBe('Here are the following details:\n\n')
    expect(result[1].stack[4].ul[0]).toBe(`Agreement number: ${mockData.reference} \n\n`)
    expect(result[1].stack[4].ul[1]).toBe(`Agreement holder: ${mockData.user.farmerName} - ${mockData.user.sbi} \n\n`)
    expect(result[1].stack[4].ul[2]).toBe(`Agreement start date: ${moment(mockData.startDate).format('DD/MM/yyyy')} \n\n`)
    expect(result[1].stack[4].ul[3]).toBe(`Agreement end date: ${moment(mockData.startDate).add(6, 'M').format('DD/MM/yyyy')} \n\n`)
    expect(result[1].stack[4].ul[4]).toBe(`Type of livestock review: ${mockData.whichSpecies} \n\n`)
  })

  test('includes Eligibility', () => {
    const result = createContent(mockData)
    expect(result[1].stack[5].text).toBe('You must have a minimum number of animals on the date the vet visits your farm to do the review. You must have 11 or more beef cattle.\n\n')
  })

  test('includes terms and condition, guidance', () => {
    const result = createContent(mockData)
    expect(result[1].stack[6].text).toBe('Terms and conditions\n\n')
    expect(result[1].stack[6].link).toBe(config.termsAndConditionsUrl)
  })
})
