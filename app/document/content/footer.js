import moment from 'moment'
import { AHWR_SCHEME } from 'ffc-ahwr-common-library'

export const footer = (reference, scheme = 'default') => {
  return {
    stack: footerMap.get(scheme)(reference)
  }
}

const generateDefaultFooter = (reference) => {
  return [
    { text: `Date Generated: ${moment(new Date()).format('DD/MM/YYYY')}    Application Reference: ${reference}    Application Status: Agreement Offered`, style: 'footer' }
  ]
}
const footerMap = new Map([
  ['default', generateDefaultFooter],
  [AHWR_SCHEME, generateDefaultFooter]
])
