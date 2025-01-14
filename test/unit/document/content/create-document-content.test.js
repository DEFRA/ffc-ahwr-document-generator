import { createContent } from '../../../../app/document/content'
import { mockRequest } from '../../../mocks/data'

jest.mock('../../../../app/getDirName', () => ({
  getDirName: () => 'dir/'
}))

describe('generate document content', () => {
  let result

  beforeEach(() => {
    jest.resetAllMocks()
    result = createContent(mockRequest)
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
    expect(result[1].stack[4].layout.hLineWidth(0, { table: { body: [1, 2, 3, 4] } })).toBe(0)
    expect(result[1].stack[4].layout.hLineWidth(1, { table: { body: [1, 2, 3, 4] } })).toBe(1)
    expect(result[1].stack[4].layout.hLineWidth(2, { table: { body: [1, 2, 3, 4] } })).toBe(1)
    expect(result[1].stack[4].layout.hLineWidth(3, { table: { body: [1, 2, 3, 4] } })).toBe(1)
    expect(result[1].stack[4].layout.hLineWidth(4, { table: { body: [1, 2, 3, 4] } })).toBe(0)

    expect(result[1].stack[4].layout.vLineWidth(0, {})).toBe(0)
  })
})
