const createContent = require('../../../../app/document/content')
const mockData = require('../../../mocks/data')

describe('generate document content', () => {
  test('includes header one', () => {
    const result = createContent(mockData)
    expect(result[0].stack[0].text).toBe('ANNUAL HEALTH AND WELFARE REVIEW')
    expect(result[0].stack[0].style).toBe('header')
    expect(result[0].stack[0].alignment).toBe('center')
  })

  test('includes header two', () => {
    const result = createContent(mockData)
    expect(result[0].stack[1].text).toBe('PLACEHOLDER AGREEMENT DOCUMENT FOR TESTING ONLY \n\n\n')
    expect(result[0].stack[0].style).toBe('header')
    expect(result[0].stack[0].alignment).toBe('center')
  })

  test('includes Agreement number', () => {
    const result = createContent(mockData)
    expect(result[1].stack[0].text).toBe(`Agreement number: ${mockData.reference} \n\n`)
  })

  test('includes Agreement holder', () => {
    const result = createContent(mockData)
    expect(result[1].stack[1].text).toBe(`Agreement holder: ${mockData.user.farmerName} - ${mockData.user.sbi} \n\n`)
  })

  test('includes Agreement holder', () => {
    const result = createContent(mockData)
    expect(result[1].stack[2].text).toBe(`Agreement start date: ${mockData.startDate} \n\n`)
  })

  test('includes Agreement end date', () => {
    const result = createContent(mockData)
    expect(result[1].stack[3].text).toBe('Agreement end date: 23/03/2023 \n\n')
  })

  test('includes Species to be reviewed', () => {
    const result = createContent(mockData)
    expect(result[1].stack[4].text).toBe(`Species to be reviewed: ${mockData.whichSpecies} \n\n`)
  })

  test('includes Eligibility', () => {
    const result = createContent(mockData)
    expect(result[1].stack[5].text).toBe('You must have a minimum number of animals on the date the vet visits your farm to do the review. do the review. You must have 11 or more beef cattle\n\n')
  })

  test('includes Species to be reviewed', () => {
    const result = createContent(mockData)
    expect(result[1].stack[6].text).toBe('Link to full terms and conditions')
    expect(result[1].stack[6].link).toBe('#')
  })
})
