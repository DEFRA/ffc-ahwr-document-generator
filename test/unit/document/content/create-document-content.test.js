const moment = require('moment')
const createContent = require('../../../../app/document/content')
const mockData = require('../../../mocks/data')

describe('generate document content', () => {
  test('includes header one', () => {
    const result = createContent(mockData)
    expect(result[0].stack[0].text).toBe('Annual Health and Welfare Review of livestock agreement')
    expect(result[0].stack[0].style).toBe('header')
    expect(result[0].stack[0].alignment).toBe('left')
  })

  test('includes terms and condition', () => {
    const result = createContent(mockData)
    expect(result[1].stack[2].text).toBe('The agreement will be governed by the agreed terms and conditions. \n\n\n')
  })

  test('includes Agreement summary', () => {
    const result = createContent(mockData)
    expect(result[1].stack[4].text).toBe(`Agreement number: ${mockData.reference} \n\n`)
  })

  test('includes Agreement number', () => {
    const result = createContent(mockData)
    expect(result[1].stack[3].text).toBe('Agreement summary \n\n')
    expect(result[1].stack[3].style).toBe('subheader')
  })

  test('includes Agreement holder', () => {
    const result = createContent(mockData)
    expect(result[1].stack[5].text).toBe(`Agreement holder: ${mockData.user.farmerName} - ${mockData.user.sbi} \n\n`)
  })

  test('includes start date', () => {
    const result = createContent(mockData)
    expect(result[1].stack[6].text).toBe(`Agreement start date: ${moment(mockData.startDate).format('DD/MM/yyyy')} \n\n`)
  })

  test('includes Agreement end date', () => {
    const result = createContent(mockData)
    expect(result[1].stack[7].text).toBe(`Agreement end date: ${moment(mockData.startDate).add(6, 'M').format('DD/MM/yyyy')} \n\n`)
  })

  test('includes Species to be reviewed', () => {
    const result = createContent(mockData)
    expect(result[1].stack[8].text).toBe(`Type of livestock review: ${mockData.whichSpecies} \n\n`)
  })

  test('includes Eligibility', () => {
    const result = createContent(mockData)
    expect(result[1].stack[9].text).toBe('You must have a minimum number of animals on the date the vet visits your farm to do the review. You must have 11 or more beef cattle.\n\n')
  })
})
