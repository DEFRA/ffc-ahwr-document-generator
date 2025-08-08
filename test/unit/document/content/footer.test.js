import { footer } from '../../../../app/document/content/footer.js'
import moment from 'moment'

describe('footer', () => {
  test('builds an object to use in for the page footer content, using default scheme', () => {
    const reference = '12345'
    expect(footer(reference)).toEqual({
      stack: [
        {
          text: `Date Generated: ${moment(new Date()).format('DD/MM/YYYY')}    Application Reference: ${reference}    Application Status: Agreement Offered`,
          style: 'footer'
        }
      ]
    })
  })

  test('builds an object to use in for the page footer content, using specific scheme', () => {
    const reference = '12345'
    expect(footer(reference, 'ahwr')).toEqual({
      stack: [
        {
          text: `Date Generated: ${moment(new Date()).format('DD/MM/YYYY')}    Application Reference: ${reference}    Application Status: Agreement Offered`,
          style: 'footer'
        }
      ]
    })
  })
})
